"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sliders, Plus, Trash2, Edit3, ArrowLeft, X, Tag, Upload, RefreshCw } from "lucide-react";
import { Product, Category, Collection, ProductColor, ProductSizeStock, ProductCustomAttribute } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useProducts } from "@/hooks/useProducts";

export default function AdminProductsPage() {
  const router = useRouter();
  const supabase = createClient();
  const {
    products,
    categories,
    collections,
    loading: productsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addCollection,
    updateCollection,
    deleteCollection,
  } = useProducts();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  // Form states (Add & Edit share similar keys)
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isSlugUserModified, setIsSlugUserModified] = useState(false);
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  
  // Media System v2 States
  const [imageUrl, setImageUrl] = useState("/images/product-dress-front.jpg");
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "/images/product-dress-front.jpg",
    "/images/product-dress-back.jpg",
  ]);

  // Product Videos
  const [productVideo, setProductVideo] = useState("");
  const [catwalkVideo, setCatwalkVideo] = useState("");
  const [showcaseVideo, setShowcaseVideo] = useState("");

  // Dynamic Colours Manager
  const [colors, setColors] = useState<ProductColor[]>([
    { name: "Royal Azure", hex: "#0F52BA", isDefault: true, stock: 15 },
    { name: "Ivory", hex: "#FAF8F5", isDefault: false, stock: 10 },
  ]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#C8A46B");

  // Dynamic Sizes & Stock Manager
  const [sizeVariants, setSizeVariants] = useState<ProductSizeStock[]>([
    { size: "XS", stock: 12 },
    { size: "S", stock: 5 },
    { size: "M", stock: 8 },
    { size: "L", stock: 10 },
  ]);
  const [newSizeName, setNewSizeName] = useState("");
  const [newSizeStock, setNewSizeStock] = useState("10");

  // Dynamic Custom Attributes Manager (Key/Value)
  const [attributes, setAttributes] = useState<ProductCustomAttribute[]>([
    { key: "Fabric", value: "Silk Satin" },
    { key: "Care", value: "Dry Clean Only" },
    { key: "Occasion", value: "Evening / Party" },
    { key: "Neck", value: "Halter" },
    { key: "Sleeve", value: "Sleeveless" },
  ]);
  const [newAttrKey, setNewAttrKey] = useState("");
  const [newAttrValue, setNewAttrValue] = useState("");

  // Dynamic Product Details Bullet Points
  const [detailsBullets, setDetailsBullets] = useState<string[]>([
    "Premium Satin Fabrication",
    "Hand Finished Seams",
    "Hidden Zipper Closure",
    "Tailored Couture Fit",
  ]);
  const [newBulletText, setNewBulletText] = useState("");

  const [isNew, setIsNew] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Category form states
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [isCatSlugUserModified, setIsCatSlugUserModified] = useState(false);
  const [catDescription, setCatDescription] = useState("");
  const [catImage, setCatImage] = useState("/images/category-dresses.jpg");

  // Collection form states
  const [colTitle, setColTitle] = useState("");
  const [colSlug, setColSlug] = useState("");
  const [isColSlugUserModified, setIsColSlugUserModified] = useState(false);
  const [colSubtitle, setColSubtitle] = useState("");
  const [colDescription, setColDescription] = useState("");
  const [colBannerImage, setColBannerImage] = useState("/images/editorial-banner.jpg");
  const [colIsFeatured, setColIsFeatured] = useState(true);

  // Cloudinary Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleMainImageCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const { uploadToCloudinary } = await import("@/lib/cloudinary/upload");
      const secureUrl = await uploadToCloudinary(file, {
        onProgress: (pct) => setUploadProgress(pct),
      });

      setImageUrl(secureUrl);
      if (!galleryImages.includes(secureUrl)) {
        setGalleryImages((prev) => [secureUrl, ...prev]);
      }
      setUploadError(null);
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      setUploadError(err.message || "Failed to upload image to Cloudinary.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleMultiGalleryCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const { uploadToCloudinary } = await import("@/lib/cloudinary/upload");
      const uploadedUrls: string[] = [];
      const fileList = Array.from(files);

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const secureUrl = await uploadToCloudinary(file, {
          onProgress: (pct) => setUploadProgress(Math.round(((i + pct / 100) / fileList.length) * 100)),
        });
        uploadedUrls.push(secureUrl);
      }

      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
      if (!imageUrl && uploadedUrls.length > 0) {
        setImageUrl(uploadedUrls[0]);
      }
      setUploadError(null);
    } catch (err: any) {
      console.error("Multi upload failed:", err);
      setUploadError(err.message || "Failed to upload gallery images.");
    } finally {
      setIsUploading(false);
    }
  };

  const presetCategoryImages = [
    { label: "Dresses (ivory)", value: "/images/category-dresses.jpg" },
    { label: "Co-Ord Sets", value: "/images/satin-corset-blush-pink-front.png" },
    { label: "Suiting (sand)", value: "/images/product-suit-front.jpg" },
    { label: "Outerwear (black)", value: "/images/editorial-banner.jpg" },
  ];

  const presetCollectionBanners = [
    { label: "Editorial Banner", value: "/images/editorial-banner.jpg" },
    { label: "Hero Portrait", value: "/images/hero-portrait.jpg" },
    { label: "Satin Corset Banner", value: "/images/satin-corset-blush-pink-front.png" },
    { label: "Suiting Banner", value: "/images/product-suit-front.jpg" },
  ];

  useEffect(() => {
    const verifyAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoading(false);
    };
    verifyAdmin();
  }, []);

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCatName("");
    setCatSlug("");
    setIsCatSlugUserModified(false);
    setCatDescription("");
    setCatImage("/images/category-dresses.jpg");
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug || "");
    setIsCatSlugUserModified(true);
    setCatDescription(cat.description || "");
    setCatImage(cat.imageUrl || "/images/category-dresses.jpg");
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const payload = {
      name: catName.trim(),
      slug: catSlug.trim() || catName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      description: catDescription.trim(),
      imageUrl: catImage.trim() || "/images/category-dresses.jpg",
    };

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, payload);
      } else {
        await addCategory(payload);
      }
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      alert("Failed to save category: " + err.message);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm("Are you sure you want to delete this category from Supabase?")) return;
    try {
      await deleteCategory(catId);
    } catch (err: any) {
      alert("Failed to delete category: " + err.message);
    }
  };

  const openAddCollectionModal = () => {
    setEditingCollection(null);
    setColTitle("");
    setColSlug("");
    setIsColSlugUserModified(false);
    setColSubtitle("");
    setColDescription("");
    setColBannerImage("/images/editorial-banner.jpg");
    setColIsFeatured(true);
    setIsCollectionModalOpen(true);
  };

  const openEditCollectionModal = (col: Collection) => {
    setEditingCollection(col);
    setColTitle(col.title);
    setColSlug(col.slug || "");
    setIsColSlugUserModified(true);
    setColSubtitle(col.subtitle || "");
    setColDescription(col.description || "");
    setColBannerImage(col.bannerImage || "/images/editorial-banner.jpg");
    setColIsFeatured(col.isFeatured ?? true);
    setIsCollectionModalOpen(true);
  };

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colTitle.trim()) return;

    const payload = {
      title: colTitle.trim(),
      slug: colSlug.trim() || colTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      subtitle: colSubtitle.trim(),
      description: colDescription.trim(),
      bannerImage: colBannerImage.trim() || "/images/editorial-banner.jpg",
      isFeatured: colIsFeatured,
    };

    try {
      if (editingCollection) {
        await updateCollection(editingCollection.id, payload);
      } else {
        await addCollection(payload);
      }
      setIsCollectionModalOpen(false);
    } catch (err: any) {
      alert("Failed to save collection: " + err.message);
    }
  };

  const handleDeleteCollection = async (colId: string) => {
    if (!confirm("Are you sure you want to delete this collection from Supabase?")) return;
    try {
      await deleteCollection(colId);
    } catch (err: any) {
      alert("Failed to delete collection: " + err.message);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setIsSlugUserModified(false);
    setPrice("");
    setSalePrice("");
    setSelectedCategoryId(categories[0]?.id || "");
    setSelectedCollectionId(collections[0]?.id || "");
    setSubtitle("");
    setDescription("");
    setImageUrl("/images/product-dress-front.jpg");
    setGalleryImages([
      "/images/product-dress-front.jpg",
      "/images/product-dress-back.jpg",
    ]);
    setProductVideo("");
    setCatwalkVideo("");
    setShowcaseVideo("");
    setColors([
      { name: "Royal Azure", hex: "#0F52BA", isDefault: true, stock: 15 },
      { name: "Ivory", hex: "#FAF8F5", isDefault: false, stock: 10 },
    ]);
    setSizeVariants([
      { size: "XS", stock: 12 },
      { size: "S", stock: 5 },
      { size: "M", stock: 8 },
      { size: "L", stock: 10 },
    ]);
    setAttributes([
      { key: "Fabric", value: "Silk Satin" },
      { key: "Care", value: "Dry Clean Only" },
      { key: "Occasion", value: "Evening / Party" },
      { key: "Neck", value: "Halter" },
      { key: "Sleeve", value: "Sleeveless" },
    ]);
    setDetailsBullets([
      "Premium Satin Fabrication",
      "Hand Finished Seams",
      "Hidden Zipper Closure",
      "Tailored Couture Fit",
      "Luxury Finish",
    ]);
    setIsNew(true);
    setIsBestseller(false);
    setIsSoldOut(false);
    setIsActive(true);
    setIsProductModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug || "");
    setIsSlugUserModified(true);
    setPrice(String(prod.price));
    setSalePrice(prod.salePrice ? String(prod.salePrice) : "");
    setSelectedCategoryId(prod.categoryId || categories[0]?.id || "");
    setSelectedCollectionId(prod.collectionId || collections[0]?.id || "");
    setSubtitle(prod.subtitle || "");
    setDescription(prod.description || "");
    setImageUrl(prod.imageUrl || (prod.images && prod.images[0]) || "/images/product-dress-front.jpg");
    setGalleryImages(prod.images && prod.images.length > 0 ? prod.images : [prod.imageUrl || "/images/product-dress-front.jpg"]);
    setProductVideo(prod.videos?.productVideo || "");
    setCatwalkVideo(prod.videos?.catwalkVideo || "");
    setShowcaseVideo(prod.videos?.showcaseVideo || "");
    setColors(prod.colors && prod.colors.length > 0 ? prod.colors : [{ name: "Ivory", hex: "#FAF8F5", isDefault: true }]);
    setSizeVariants(
      prod.sizeVariants && prod.sizeVariants.length > 0
        ? prod.sizeVariants
        : (prod.sizes || ["S", "M", "L"]).map((s: any) => (typeof s === "string" ? { size: s, stock: 10 } : s))
    );
    setAttributes(prod.attributes || []);
    setDetailsBullets(prod.details || ["Hand finished silk satin"]);
    setIsNew(prod.isNew ?? true);
    setIsBestseller(prod.isBestseller ?? false);
    setIsSoldOut(prod.isSoldOut ?? false);
    setIsActive(prod.isActive ?? true);
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const matchedCat = categories.find((c) => c.id === selectedCategoryId);
    const matchedCol = collections.find((c) => c.id === selectedCollectionId);

    const imagesList = galleryImages.length > 0 ? galleryImages : [imageUrl || "/images/product-dress-front.jpg"];
    const mainImg = imageUrl || imagesList[0] || "/images/product-dress-front.jpg";

    const payload: Partial<Product> = {
      name,
      slug: slug.trim() || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      subtitle: subtitle || "Premium Collection Item",
      description: description || "Crafted from fine fibers for ultimate silhouette structure.",
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      categoryId: selectedCategoryId,
      categoryName: matchedCat ? matchedCat.name : "Dresses",
      collectionId: selectedCollectionId,
      collectionName: matchedCol ? matchedCol.title : undefined,
      imageUrl: mainImg,
      images: imagesList,
      videos: {
        productVideo: productVideo.trim() || undefined,
        catwalkVideo: catwalkVideo.trim() || undefined,
        showcaseVideo: showcaseVideo.trim() || undefined,
      },
      colors: colors.length > 0 ? colors : [{ name: "Ivory", hex: "#FAF8F5", isDefault: true }],
      sizes: sizeVariants.map((sv) => sv.size),
      sizeVariants: sizeVariants,
      attributes: attributes,
      details: detailsBullets.length > 0 ? detailsBullets : ["Hand finished silk satin"],
      fabricCare: ["Dry clean only", "Cool iron reverse"],
      isNew,
      isBestseller,
      isSoldOut,
      isActive,
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      setIsProductModalOpen(false);
    } catch (err: any) {
      alert("Failed to submit product: " + err.message);
    }
  };



  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this piece?")) return;
    try {
      await deleteProduct(id);
    } catch (err: any) {
      alert("Failed to delete piece: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center text-xs font-label uppercase tracking-widest text-[#706C66]">
        Authenticating Admin Credentials...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 gap-4">
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-xs font-label uppercase tracking-widest text-[#706C66] hover:text-black mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block">
            ATELIER ADMIN PORTAL
          </span>
          <h1 className="text-3xl font-serif-luxury font-light uppercase tracking-wider text-neutral-900">
            PRODUCT MANAGEMENT
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAddCategoryModal}
            className="bg-white text-black border border-neutral-200 text-xs font-label uppercase tracking-widest px-5 py-3 rounded-full flex items-center space-x-1.5 shadow-sm hover:border-black transition-colors"
          >
            <Tag className="w-4 h-4" />
            <span>ADD CATEGORY</span>
          </button>
          <button
            onClick={openAddCollectionModal}
            className="bg-white text-black border border-neutral-200 text-xs font-label uppercase tracking-widest px-5 py-3 rounded-full flex items-center space-x-1.5 shadow-sm hover:border-black transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>ADD COLLECTION</span>
          </button>
          <button
            onClick={openAddModal}
            className="bg-black text-white text-xs font-label uppercase tracking-widest px-5 py-3 rounded-full flex items-center space-x-1.5 shadow-md hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[24px] border border-neutral-200/80 shadow-luxury-xs overflow-hidden">
        {productsLoading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
            <p className="text-[10px] font-label uppercase tracking-widest text-[#706C66]">
              Loading catalog entries...
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-neutral-200 text-left text-xs font-label tracking-wider">
            <thead className="bg-[#FAF8F5] uppercase text-[#706C66]">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Sizes</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 font-sans text-neutral-800">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/50">
                      <Image src={prod.imageUrl} alt={prod.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-black uppercase block">{prod.name}</span>
                    <span className="text-[11px] text-neutral-400 block">{prod.subtitle}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-[10px] uppercase font-semibold">
                      {prod.categoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-neutral-900">
                    {prod.salePrice ? (
                      <div className="flex space-x-2">
                        <span className="text-black font-bold">₹{prod.salePrice}</span>
                        <span className="text-neutral-400 line-through">₹{prod.price}</span>
                      </div>
                    ) : (
                      <span>₹{prod.price}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-500 uppercase tracking-widest text-[10px]">
                      {prod.sizes.join(", ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {prod.isSoldOut ? (
                      <span className="inline-flex items-center text-red-700 font-semibold text-[10px] uppercase">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-1.5" />
                        Out of Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-green-700 font-semibold text-[10px] uppercase">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5" />
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(prod)}
                      className="p-2 text-neutral-400 hover:text-black transition-colors"
                      title="Edit Piece"
                    >
                      <Edit3 className="w-4 h-4 stroke-[1.5]" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete Piece"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.5]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-black"
            >
              <X className="w-6 h-6 stroke-[1.2]" />
            </button>

            <div>
              <span className="text-[9px] font-label uppercase tracking-widest text-[#706C66] font-semibold">
                {editingProduct ? "MODIFY DROP" : "CREATE DROP"}
              </span>
              <h3 className="text-xl font-serif font-bold uppercase tracking-wider text-[#1a1a1a]">
                {editingProduct ? "EDIT ATELIER PIECE" : "ADD NEW ATELIER PIECE"}
              </h3>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs font-label">
              {/* Product Name & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Satin Corset Co-Ord Set – Blush Pink"
                    value={name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setName(val);
                      if (!isSlugUserModified) {
                        setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                      }
                    }}
                    className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Slug (Auto-Generated / Editable)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. satin-corset-co-ord-set-blush-pink"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                      setIsSlugUserModified(true);
                    }}
                    className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="4999"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans font-bold text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Sale Price (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="3999"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              {/* Category & Collection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Category
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                    Collection
                  </label>
                  <select
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  >
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Luminous Satin Evening Co-Ord"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Description
                </label>
                <textarea
                  placeholder="Material specs, tailored details, and silhouettes overview..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans resize-none"
                />
              </div>

              {/* ==================================================================== */}
              {/* PRODUCT MEDIA MANAGER V2 (DYNAMIC GALLERY & COVER) */}
              {/* ==================================================================== */}
              <div className="space-y-4 pt-4 border-t border-neutral-200/80 font-label">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-label uppercase tracking-widest text-[#C8A46B] font-semibold block">
                      SHOPIFY-STYLE MEDIA MANAGER
                    </span>
                    <label className="text-xs font-serif font-bold uppercase tracking-wider text-neutral-900">
                      MAIN COVER & UNLIMITED GALLERY ({galleryImages.length} IMAGES)
                    </label>
                  </div>
                  
                  {/* Multi-Select Upload Button */}
                  <label className="relative cursor-pointer bg-black text-white text-[10px] font-label uppercase tracking-widest px-4 py-2.5 rounded-xl flex items-center space-x-1.5 hover:bg-[#C8A46B] transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>+ ADD IMAGES</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={isUploading}
                      onChange={handleMultiGalleryCloudinaryUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                {isUploading && (
                  <div className="space-y-1 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-amber-900">
                      <span>Cloudinary Uploading Media...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-black h-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Cover Preview & Main Selector */}
                <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-neutral-200/80 flex items-center space-x-4">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-300 shrink-0 shadow-sm">
                    <Image
                      src={imageUrl || "/images/product-dress-front.jpg"}
                      alt="Main Cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="bg-black text-white text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full tracking-wider">
                        MAIN COVER IMAGE
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {imageUrl.includes("cloudinary") ? "Cloudinary CDN" : "Static Media"}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-500 truncate max-w-xs">{imageUrl}</p>
                    <div className="flex items-center space-x-2 pt-1">
                      <label className="cursor-pointer text-[10px] uppercase font-semibold text-black hover:text-[#C8A46B] underline">
                        Replace Cover
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isUploading}
                          onChange={handleMainImageCloudinaryUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Unlimited Gallery Thumbnails Grid */}
                <div className="space-y-2">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block">
                    Product Gallery ({galleryImages.length} images uploaded &bull; Drag to reorder)
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryImages.map((img, idx) => {
                      const isCover = img === imageUrl;
                      return (
                        <div
                          key={idx}
                          className={`relative rounded-2xl overflow-hidden border p-2 bg-white flex flex-col justify-between space-y-2 shadow-xs transition-all ${
                            isCover ? "border-black ring-2 ring-black/10" : "border-neutral-200 hover:border-neutral-400"
                          }`}
                        >
                          <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-neutral-100">
                            <Image src={img} alt={`Gallery image ${idx + 1}`} fill className="object-cover" />
                            {isCover && (
                              <span className="absolute top-1.5 left-1.5 bg-black text-white text-[8px] uppercase font-bold px-2 py-0.5 rounded-full">
                                COVER
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[10px] pt-1">
                            <button
                              type="button"
                              onClick={() => setImageUrl(img)}
                              className={`font-semibold uppercase transition-colors ${
                                isCover ? "text-emerald-700 font-bold" : "text-neutral-500 hover:text-black"
                              }`}
                            >
                              {isCover ? "✓ Cover" : "Make Cover"}
                            </button>

                            <div className="flex items-center space-x-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...galleryImages];
                                    const temp = updated[idx];
                                    updated[idx] = updated[idx - 1];
                                    updated[idx - 1] = temp;
                                    setGalleryImages(updated);
                                  }}
                                  className="p-1 text-neutral-400 hover:text-black font-bold"
                                  title="Move Left"
                                >
                                  ←
                                </button>
                              )}
                              {idx < galleryImages.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...galleryImages];
                                    const temp = updated[idx];
                                    updated[idx] = updated[idx + 1];
                                    updated[idx + 1] = temp;
                                    setGalleryImages(updated);
                                  }}
                                  className="p-1 text-neutral-400 hover:text-black font-bold"
                                  title="Move Right"
                                >
                                  →
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = galleryImages.filter((_, i) => i !== idx);
                                  setGalleryImages(updated);
                                  if (isCover && updated.length > 0) setImageUrl(updated[0]);
                                }}
                                className="p-1 text-neutral-400 hover:text-red-600"
                                title="Delete Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ==================================================================== */}
              {/* PRODUCT VIDEOS SHOWCASE (CATWALK, SHOWCASE, PRODUCT VIDEO) */}
              {/* ==================================================================== */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/80 font-label">
                <span className="text-[9px] font-label uppercase tracking-widest text-[#C8A46B] font-semibold block">
                  SHOWCASE MEDIA
                </span>
                <label className="text-xs font-serif font-bold uppercase tracking-wider text-neutral-900 block">
                  PRODUCT VIDEOS (CATWALK, SHOWCASE & COUTURE)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1 font-semibold">
                      Product Video URL
                    </label>
                    <input
                      type="text"
                      placeholder="Cloudinary MP4 or Video URL"
                      value={productVideo}
                      onChange={(e) => setProductVideo(e.target.value)}
                      className="bg-[#FAF8F5] text-xs px-3.5 py-3 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1 font-semibold">
                      Catwalk Runway Video
                    </label>
                    <input
                      type="text"
                      placeholder="Runway Video URL"
                      value={catwalkVideo}
                      onChange={(e) => setCatwalkVideo(e.target.value)}
                      className="bg-[#FAF8F5] text-xs px-3.5 py-3 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1 font-semibold">
                      360° Showcase Video
                    </label>
                    <input
                      type="text"
                      placeholder="360° Showcase Video URL"
                      value={showcaseVideo}
                      onChange={(e) => setShowcaseVideo(e.target.value)}
                      className="bg-[#FAF8F5] text-xs px-3.5 py-3 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* ==================================================================== */}
              {/* DYNAMIC COLOUR MANAGER */}
              {/* ==================================================================== */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/80 font-label">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-serif font-bold uppercase tracking-wider text-neutral-900">
                    DYNAMIC COLOUR VARIANTS ({colors.length} COLOURS)
                  </label>
                  <span className="text-[10px] text-[#C8A46B] uppercase tracking-wider font-semibold">
                    Separate Variant Images Supported
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {colors.map((c, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border bg-white flex items-center justify-between space-x-3 shadow-xs ${
                        c.isDefault ? "border-black ring-1 ring-black/10" : "border-neutral-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className="w-6 h-6 rounded-full border border-neutral-300 shadow-xs shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="text-xs">
                          <p className="font-bold text-neutral-900">{c.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono uppercase">{c.hex} &bull; Stock: {c.stock ?? 10}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setColors(colors.map((col, i) => ({ ...col, isDefault: i === idx })));
                          }}
                          className={`text-[9px] uppercase font-bold px-2 py-1 rounded-lg transition-colors ${
                            c.isDefault ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          }`}
                        >
                          {c.isDefault ? "DEFAULT" : "Make Default"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                          className="text-neutral-400 hover:text-red-600 p-1"
                          title="Delete Colour"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Color Control */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200">
                  <input
                    type="text"
                    placeholder="Colour Name (e.g. Royal Azure)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="bg-white text-xs px-3.5 py-2.5 flex-1 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-10 h-10 rounded-xl border border-neutral-200 p-0.5 cursor-pointer bg-white"
                      title="Choose Hex Swatch"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newColorName.trim()) return;
                        setColors([
                          ...colors,
                          {
                            name: newColorName.trim(),
                            hex: newColorHex,
                            isDefault: colors.length === 0,
                            stock: 10,
                          },
                        ]);
                        setNewColorName("");
                        setNewColorHex("#C8A46B");
                      }}
                      className="bg-black text-white text-xs px-4 py-2.5 rounded-xl font-semibold uppercase tracking-wider hover:bg-[#C8A46B] transition-colors shrink-0"
                    >
                      + Add Colour
                    </button>
                  </div>
                </div>
              </div>

              {/* ==================================================================== */}
              {/* DYNAMIC SIZES & INVENTORY MANAGER */}
              {/* ==================================================================== */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/80 font-label">
                <label className="text-xs font-serif font-bold uppercase tracking-wider text-neutral-900 block">
                  DYNAMIC SIZES & INVENTORY ({sizeVariants.length} SIZES)
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {sizeVariants.map((sv, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-2xl border border-neutral-200 flex flex-col justify-between space-y-2 shadow-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-neutral-900 font-mono uppercase bg-neutral-100 px-2.5 py-1 rounded-lg">
                          {sv.size}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSizeVariants(sizeVariants.filter((_, i) => i !== idx))}
                          className="text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1.5 text-xs">
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold">Stock:</span>
                        <input
                          type="number"
                          value={sv.stock}
                          onChange={(e) => {
                            const val = Number(e.target.value || 0);
                            const updated = [...sizeVariants];
                            updated[idx].stock = val;
                            setSizeVariants(updated);
                          }}
                          className="w-16 bg-[#FAF8F5] text-xs font-bold font-mono px-2 py-1 rounded-lg border border-neutral-200 text-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Size Control */}
                <div className="flex space-x-2 pt-1 bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200">
                  <input
                    type="text"
                    placeholder="Size Name (e.g. XS, M, Custom)"
                    value={newSizeName}
                    onChange={(e) => setNewSizeName(e.target.value)}
                    className="bg-white text-xs px-3.5 py-2.5 flex-1 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-sans uppercase font-bold"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newSizeStock}
                    onChange={(e) => setNewSizeStock(e.target.value)}
                    className="w-20 bg-white text-xs px-3 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-mono font-bold text-center"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newSizeName.trim()) return;
                      const sizeUpper = newSizeName.trim().toUpperCase();
                      if (sizeVariants.some((s) => s.size === sizeUpper)) return;
                      setSizeVariants([
                        ...sizeVariants,
                        { size: sizeUpper, stock: Number(newSizeStock || 10) },
                      ]);
                      setNewSizeName("");
                      setNewSizeStock("10");
                    }}
                    className="bg-black text-white text-xs px-4 py-2.5 rounded-xl font-semibold uppercase tracking-wider hover:bg-[#C8A46B] transition-colors shrink-0"
                  >
                    + Add Size
                  </button>
                </div>
              </div>

              {/* ==================================================================== */}
              {/* DYNAMIC CUSTOM ATTRIBUTES MANAGER (FABRIC, CARE, OCCASION, ETC) */}
              {/* ==================================================================== */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/80 font-label">
                <label className="text-xs font-serif font-bold uppercase tracking-wider text-neutral-900 block">
                  CUSTOM ATTRIBUTES ({attributes.length} ATTRIBUTES)
                </label>

                <div className="space-y-2">
                  {attributes.map((attr, idx) => (
                    <div key={idx} className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-neutral-200 text-xs">
                      <span className="font-bold text-neutral-900 w-28 truncate uppercase font-label">{attr.key}:</span>
                      <span className="text-neutral-600 flex-1 font-sans">{attr.value}</span>
                      <button
                        type="button"
                        onClick={() => setAttributes(attributes.filter((_, i) => i !== idx))}
                        className="text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Attribute Row */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1 bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200">
                  <input
                    type="text"
                    placeholder="Attribute Key (e.g. Fabric, Care)"
                    value={newAttrKey}
                    onChange={(e) => setNewAttrKey(e.target.value)}
                    className="bg-white text-xs px-3.5 py-2.5 w-full sm:w-36 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Silk Satin, Dry Clean Only)"
                    value={newAttrValue}
                    onChange={(e) => setNewAttrValue(e.target.value)}
                    className="bg-white text-xs px-3.5 py-2.5 flex-1 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newAttrKey.trim() || !newAttrValue.trim()) return;
                      setAttributes([...attributes, { key: newAttrKey.trim(), value: newAttrValue.trim() }]);
                      setNewAttrKey("");
                      setNewAttrValue("");
                    }}
                    className="bg-black text-white text-xs px-4 py-2.5 rounded-xl font-semibold uppercase tracking-wider hover:bg-[#C8A46B] transition-colors shrink-0"
                  >
                    + Add Attribute
                  </button>
                </div>
              </div>

              {/* ==================================================================== */}
              {/* DYNAMIC PRODUCT DETAILS BULLET POINTS */}
              {/* ==================================================================== */}
              <div className="space-y-3 pt-4 border-t border-neutral-200/80 font-label">
                <label className="text-xs font-serif font-bold uppercase tracking-wider text-neutral-900 block">
                  PRODUCT DETAILS BULLET POINTS ({detailsBullets.length} BULLETS)
                </label>

                <div className="space-y-2">
                  {detailsBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-center space-x-3 bg-white p-3 rounded-2xl border border-neutral-200 text-xs">
                      <span className="text-[#C8A46B] font-bold">✓</span>
                      <span className="text-neutral-700 flex-1 font-sans">{bullet}</span>
                      <button
                        type="button"
                        onClick={() => setDetailsBullets(detailsBullets.filter((_, i) => i !== idx))}
                        className="text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2 pt-1 bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200">
                  <input
                    type="text"
                    placeholder="New Detail Bullet Point (e.g. Hidden Zipper Closure)"
                    value={newBulletText}
                    onChange={(e) => setNewBulletText(e.target.value)}
                    className="bg-white text-xs px-3.5 py-2.5 flex-1 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newBulletText.trim()) return;
                      setDetailsBullets([...detailsBullets, newBulletText.trim()]);
                      setNewBulletText("");
                    }}
                    className="bg-black text-white text-xs px-4 py-2.5 rounded-xl font-semibold uppercase tracking-wider hover:bg-[#C8A46B] transition-colors shrink-0"
                  >
                    + Add Bullet
                  </button>
                </div>
              </div>

              {/* Product Status Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-neutral-100 pt-4">
                <label className="flex items-center space-x-2 cursor-pointer bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-200/80">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-black rounded"
                  />
                  <span className="text-[10px] font-semibold text-neutral-800">NEW ARRIVAL</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-200/80">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="accent-black rounded"
                  />
                  <span className="text-[10px] font-semibold text-neutral-800">BESTSELLER</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-200/80">
                  <input
                    type="checkbox"
                    checked={isSoldOut}
                    onChange={(e) => setIsSoldOut(e.target.checked)}
                    className="accent-black rounded"
                  />
                  <span className="text-[10px] font-semibold text-red-600">SOLD OUT</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer bg-[#FAF8F5] p-2.5 rounded-xl border border-neutral-200/80">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-black rounded"
                  />
                  <span className="text-[10px] font-semibold text-emerald-700">ACTIVE</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors"
              >
                {editingProduct ? "SAVE PIECE CHANGES" : "CREATE PIECE DROP"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Categories Management Table */}
      <div className="space-y-4 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-label uppercase tracking-widest text-[#C8A46B] font-semibold">
              SUPABASE DATABASE INDEX
            </span>
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-neutral-900">
              CATEGORIES INDEX ({categories.length})
            </h2>
          </div>
          <button
            onClick={openAddCategoryModal}
            className="bg-black text-white text-xs font-label uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center space-x-1.5 shadow-sm hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD CATEGORY</span>
          </button>
        </div>

        <div className="bg-white rounded-[24px] border border-neutral-200/80 shadow-luxury-xs overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200 text-left text-xs font-label tracking-wider">
            <thead className="bg-[#FAF8F5] uppercase text-[#706C66]">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 font-sans text-neutral-800">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/50">
                      <Image src={cat.imageUrl || "/images/category-dresses.jpg"} alt={cat.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-black uppercase block">{cat.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-500 font-mono text-[11px] bg-neutral-100 px-2.5 py-1 rounded-md">{cat.slug}</span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-neutral-500 text-xs">
                    {cat.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditCategoryModal(cat)}
                      className="p-2 text-neutral-400 hover:text-black transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 className="w-4 h-4 stroke-[1.5]" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.5]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-black"
            >
              <X className="w-6 h-6 stroke-[1.2]" />
            </button>

            <div>
              <span className="text-[9px] font-label uppercase tracking-widest text-[#706C66] font-semibold">
                {editingCategory ? "MODIFY INDEX" : "CREATE INDEX"}
              </span>
              <h3 className="text-xl font-serif font-bold uppercase tracking-wider text-[#1a1a1a]">
                {editingCategory ? "EDIT CATEGORY INDEX" : "ADD NEW CATEGORY"}
              </h3>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs font-label">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculpt & Contour"
                  value={catName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCatName(val);
                    if (!isCatSlugUserModified) {
                      setCatSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }
                  }}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Category Slug (Auto-Generated / Editable)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sculpt-and-contour"
                  value={catSlug}
                  onChange={(e) => {
                    setCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                    setIsCatSlugUserModified(true);
                  }}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of the catalog layer..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  rows={2}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                  Category Image Banner URL
                </label>

                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                    <Image src={catImage || "/images/category-dresses.jpg"} alt="Category Preview" fill className="object-cover" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or /images/..."
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-3.5 py-3 flex-1 rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1.5 bg-[#FAF8F5] p-2 rounded-2xl border border-neutral-200/80">
                  {presetCategoryImages.map((img) => (
                    <button
                      key={img.value}
                      type="button"
                      onClick={() => setCatImage(img.value)}
                      className={`text-[10px] px-3 py-2 rounded-xl text-left border ${
                        catImage === img.value ? "bg-black text-white border-black" : "bg-white text-neutral-800 border-neutral-200"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors"
              >
                {editingCategory ? "SAVE CATEGORY CHANGES" : "CREATE CATEGORY INDEX"}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Collections Management Table */}
      <div className="space-y-4 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-label uppercase tracking-widest text-[#C8A46B] font-semibold">
              SUPABASE DATABASE INDEX
            </span>
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-neutral-900">
              COLLECTIONS INDEX ({collections.length})
            </h2>
          </div>
          <button
            onClick={openAddCollectionModal}
            className="bg-black text-white text-xs font-label uppercase tracking-widest px-5 py-2.5 rounded-full flex items-center space-x-1.5 shadow-sm hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD COLLECTION</span>
          </button>
        </div>

        <div className="bg-white rounded-[24px] border border-neutral-200/80 shadow-luxury-xs overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200 text-left text-xs font-label tracking-wider">
            <thead className="bg-[#FAF8F5] uppercase text-[#706C66]">
              <tr>
                <th className="px-6 py-4">Banner</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Subtitle</th>
                <th className="px-6 py-4">Featured</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/60 font-sans text-neutral-800">
              {collections.map((col) => (
                <tr key={col.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-10 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/50">
                      <Image src={col.bannerImage || "/images/editorial-banner.jpg"} alt={col.title} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-black uppercase block">{col.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-500 font-mono text-[11px] bg-neutral-100 px-2.5 py-1 rounded-md">{col.slug}</span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-neutral-500 text-xs">
                    {col.subtitle || "—"}
                  </td>
                  <td className="px-6 py-4">
                    {col.isFeatured ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                        FEATURED
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-[10px] uppercase font-semibold">STANDARD</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => openEditCollectionModal(col)}
                      className="p-2 text-neutral-400 hover:text-black transition-colors"
                      title="Edit Collection"
                    >
                      <Edit3 className="w-4 h-4 stroke-[1.5]" />
                    </button>
                    <button
                      onClick={() => handleDeleteCollection(col.id)}
                      className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.5]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Collection Modal */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setIsCollectionModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-black"
            >
              <X className="w-6 h-6 stroke-[1.2]" />
            </button>

            <div>
              <span className="text-[9px] font-label uppercase tracking-widest text-[#706C66] font-semibold">
                {editingCollection ? "MODIFY EDITORIAL DROP" : "CREATE EDITORIAL DROP"}
              </span>
              <h3 className="text-xl font-serif font-bold uppercase tracking-wider text-[#1a1a1a]">
                {editingCollection ? "EDIT COLLECTION" : "ADD NEW COLLECTION"}
              </h3>
            </div>

            <form onSubmit={handleCollectionSubmit} className="space-y-4 text-xs font-label">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Collection Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Resort '26 Evening Drop"
                  value={colTitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    setColTitle(val);
                    if (!isColSlugUserModified) {
                      setColSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }
                  }}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Collection Slug (Auto-Generated / Editable)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. resort-26-evening-drop"
                  value={colSlug}
                  onChange={(e) => {
                    setColSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                    setIsColSlugUserModified(true);
                  }}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Architectural Tailoring & Sculpted Evening Wear"
                  value={colSubtitle}
                  onChange={(e) => setColSubtitle(e.target.value)}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Description
                </label>
                <textarea
                  placeholder="Editorial story, silhouette narrative, and design direction..."
                  value={colDescription}
                  onChange={(e) => setColDescription(e.target.value)}
                  rows={2}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                  Banner Image URL
                </label>

                <div className="flex items-center space-x-3">
                  <div className="relative w-16 h-10 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                    <Image src={colBannerImage || "/images/editorial-banner.jpg"} alt="Banner Preview" fill className="object-cover" />
                  </div>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or /images/..."
                    value={colBannerImage}
                    onChange={(e) => setColBannerImage(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-3.5 py-3 flex-1 rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1.5 bg-[#FAF8F5] p-2 rounded-2xl border border-neutral-200/80">
                  {presetCollectionBanners.map((img) => (
                    <button
                      key={img.value}
                      type="button"
                      onClick={() => setColBannerImage(img.value)}
                      className={`text-[10px] px-3 py-2 rounded-xl text-left border ${
                        colBannerImage === img.value ? "bg-black text-white border-black" : "bg-white text-neutral-800 border-neutral-200"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer bg-[#FAF8F5] p-3 rounded-2xl border border-neutral-200/80">
                <input
                  type="checkbox"
                  checked={colIsFeatured}
                  onChange={(e) => setColIsFeatured(e.target.checked)}
                  className="accent-black rounded"
                />
                <span className="text-xs font-semibold text-neutral-900">FEATURED COLLECTION BANNER</span>
              </label>

              <button
                type="submit"
                className="w-full bg-[#1A1A1A] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] py-4 font-semibold rounded-full hover:bg-[#C8A46B] transition-colors"
              >
                {editingCollection ? "SAVE COLLECTION CHANGES" : "CREATE COLLECTION DROP"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
