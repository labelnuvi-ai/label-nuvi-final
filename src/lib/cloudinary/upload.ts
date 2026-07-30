export interface CloudinaryUploadOptions {
  cloudName?: string;
  uploadPreset?: string;
  resourceType?: "image" | "video" | "auto";
  onProgress?: (percent: number) => void;
}

export async function uploadToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {}
): Promise<string> {
  const cloudName = options.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "vg61jz6i";
  const uploadPreset = options.uploadPreset || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "label_nuvi_uploads";
  
  const resourceType = options.resourceType || (file.type.startsWith("video/") ? "video" : "image");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`);

    if (xhr.upload && options.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          options.onProgress?.(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.secure_url) {
            resolve(res.secure_url);
          } else {
            // Fallback to data URL
            readAsDataUrl(file).then(resolve).catch(reject);
          }
        } catch {
          readAsDataUrl(file).then(resolve).catch(reject);
        }
      } else {
        // Fallback gracefully to data URL if Cloudinary fails or preset is invalid
        console.warn("Cloudinary endpoint notice, falling back to local file reader:", xhr.responseText);
        readAsDataUrl(file).then(resolve).catch(reject);
      }
    };

    xhr.onerror = () => {
      readAsDataUrl(file).then(resolve).catch(reject);
    };

    xhr.send(formData);
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
