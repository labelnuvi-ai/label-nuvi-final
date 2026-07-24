import { useState, useEffect, useCallback } from "react";
import { Product, Category, Collection } from "@/types";
import { createClient } from "@/lib/supabase/client";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      // Fetch Products with joined categories, collections, product_images, and product_variants
      let prodData: any[] | null = null;
      let prodError: any = null;

      const resWithRelations = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          ),
          collections (
            title
          ),
          product_images (
            image_url,
            alt_text,
            sort_order
          ),
          product_variants (
            sku,
            size,
            size_value,
            color_name,
            color_hex,
            stock,
            price
          )
        `)
        .order("created_at", { ascending: false });

      if (resWithRelations.error) {
        // Fallback query if product_images / product_variants tables are absent
        const resSimple = await supabase
          .from("products")
          .select(`
            *,
            categories (
              name
            ),
            collections (
              title
            )
          `)
          .order("created_at", { ascending: false });
        prodData = resSimple.data;
        prodError = resSimple.error;
      } else {
        prodData = resWithRelations.data;
        prodError = resWithRelations.error;
      }

      // Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .select("*");

      // Fetch Collections
      const { data: colData, error: colError } = await supabase
        .from("collections")
        .select("*");

      if (!prodError && prodData) {
        setProducts(
          prodData.map((row: any) => {
            const relImages = row.product_images?.map((i: any) => i.image_url);
            const images = (relImages && relImages.length > 0)
              ? relImages
              : (Array.isArray(row.images) && row.images.length > 0 ? row.images : ["/images/product-dress-front.jpg"]);

            let colors = row.colors;
            if (row.product_variants && row.product_variants.length > 0) {
              const colorMap = new Map();
              row.product_variants.forEach((v: any) => {
                if (v.color_name && !colorMap.has(v.color_name)) {
                  colorMap.set(v.color_name, { name: v.color_name, hex: v.color_hex || "#FAF8F5" });
                }
              });
              if (colorMap.size > 0) {
                colors = Array.from(colorMap.values());
              }
            }
            if (!colors || colors.length === 0) {
              colors = [{ name: "Ivory", hex: "#FAF8F5" }];
            }

            let sizes = row.sizes;
            if (row.product_variants && row.product_variants.length > 0) {
              const sizeSet = new Set<string>();
              row.product_variants.forEach((v: any) => {
                const sVal = v.size || v.size_value;
                if (sVal) sizeSet.add(sVal);
              });
              if (sizeSet.size > 0) {
                sizes = Array.from(sizeSet);
              }
            }
            if (!sizes || sizes.length === 0) {
              sizes = ["S", "M"];
            }

            return {
              id: row.id,
              name: row.name,
              slug: row.slug,
              subtitle: row.subtitle || "Premium Drop Silhouette",
              description: row.description || "Crafted from hand-selected luxurious materials.",
              price: Number(row.price),
              salePrice: row.sale_price ? Number(row.sale_price) : undefined,
              isNew: row.is_new ?? true,
              isBestseller: row.is_bestseller ?? false,
              isSoldOut: row.is_sold_out ?? false,
              images,
              colors,
              sizes,
              categoryId: row.category_id,
              categoryName: row.categories?.name || "Dresses",
              collectionId: row.collection_id || undefined,
              collectionName: row.collections?.title || undefined,
              rating: Number(row.rating || 5.0),
              reviewsCount: Number(row.reviews_count || 0),
              createdAt: row.created_at,
              details: Array.isArray(row.details) ? row.details : ["Dry clean only"],
              fabricCare: Array.isArray(row.fabric_care) ? row.fabric_care : ["Dry clean only"],
            };
          })
        );
      }

      if (!catError && catData) {
        setCategories(
          catData.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description || "",
            imageUrl: row.image_url || "/images/category-dresses.jpg",
            itemCount: row.item_count || 0,
          }))
        );
      }

      if (!colError && colData) {
        setCollections(
          colData.map((row) => ({
            id: row.id,
            title: row.title,
            slug: row.slug,
            subtitle: row.subtitle || "",
            description: row.description || "",
            bannerImage: row.banner_image || "/images/editorial-banner.jpg",
            isFeatured: row.is_featured,
            productsCount: row.products_count || 0,
          }))
        );
      }
    } catch (err) {
      console.error("Error loading catalog:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const addProduct = async (productData: Partial<Product>) => {
    const supabase = createClient();
    const id = productData.id || crypto.randomUUID();
    const now = new Date().toISOString();

    // Payload containing ONLY existing products table columns
    const dbRow = {
      id,
      category_id: productData.categoryId || null,
      collection_id: productData.collectionId || null,
      name: productData.name,
      slug: productData.slug || productData.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product-" + Date.now(),
      subtitle: productData.subtitle || "Premium Drop Silhouette",
      description: productData.description || "Crafted from hand-selected luxurious materials.",
      price: productData.price,
      sale_price: productData.salePrice || null,
      rating: productData.rating ?? 5.0,
      reviews_count: productData.reviewsCount ?? 0,
      is_new: productData.isNew ?? true,
      is_bestseller: productData.isBestseller ?? false,
      is_sold_out: productData.isSoldOut ?? false,
      is_active: true,
      created_at: now,
      updated_at: now,
    };

    console.log("========== PRODUCT INSERT ==========");
    console.log(dbRow);

    const { data, error } = await supabase
      .from("products")
      .insert(dbRow)
      .select()
      .single();

    console.log("INSERT RESULT:", data);
    console.log("INSERT ERROR:", error);
    console.log("===================================");

    if (error) {
      alert(JSON.stringify(error, null, 2));
      console.error(error);
      throw error;
    }

    // Insert product images into product_images
    if (productData.images && productData.images.length > 0) {
      const imageRows = productData.images.map((url, idx) => ({
        product_id: id,
        image_url: url,
        alt_text: productData.name || "Product Image",
        sort_order: idx,
      }));
      try {
        await supabase.from("product_images").insert(imageRows);
      } catch (err) {
        console.warn("Could not insert product_images:", err);
      }
    }

    // Insert colors/sizes into product_variants
    const colors = productData.colors || [{ name: "Ivory", hex: "#FAF8F5" }];
    const sizes = productData.sizes || ["S", "M"];
    const variantRows: any[] = [];
    for (const c of colors) {
      for (const s of sizes) {
        variantRows.push({
          product_id: id,
          sku: crypto.randomUUID(),
          size: s,
          size_value: s,
          color_name: c.name,
          color_hex: c.hex || "#000000",
          stock: 10,
          price: productData.salePrice || productData.price || 0,
        });
      }
    }
    try {
      await supabase.from("product_variants").insert(variantRows);
    } catch (err) {
      console.warn("Could not insert product_variants:", err);
    }
    
    await loadCatalog();
    return data;
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    const supabase = createClient();
    const now = new Date().toISOString();

    // Payload containing ONLY valid products table columns
    const dbRow: any = {
      updated_at: now,
    };
    if (productData.name !== undefined) dbRow.name = productData.name;
    if (productData.slug !== undefined) dbRow.slug = productData.slug;
    if (productData.subtitle !== undefined) dbRow.subtitle = productData.subtitle;
    if (productData.description !== undefined) dbRow.description = productData.description;
    if (productData.price !== undefined) dbRow.price = productData.price;
    if (productData.salePrice !== undefined) dbRow.sale_price = productData.salePrice;
    if (productData.isNew !== undefined) dbRow.is_new = productData.isNew;
    if (productData.isBestseller !== undefined) dbRow.is_bestseller = productData.isBestseller;
    if (productData.isSoldOut !== undefined) dbRow.is_sold_out = productData.isSoldOut;
    if (productData.categoryId !== undefined) dbRow.category_id = productData.categoryId;
    if (productData.collectionId !== undefined) dbRow.collection_id = productData.collectionId;

    const { data, error } = await supabase
      .from("products")
      .update(dbRow)
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      throw error;
    }

    // Update product_images table if images are updated
    if (productData.images !== undefined && productData.images.length > 0) {
      try {
        await supabase.from("product_images").delete().eq("product_id", productId);
        const imageRows = productData.images.map((url, idx) => ({
          product_id: productId,
          image_url: url,
          alt_text: productData.name || "Product Image",
          sort_order: idx,
        }));
        await supabase.from("product_images").insert(imageRows);
      } catch (err) {
        console.warn("Could not update product_images:", err);
      }
    }

    // Update product_variants table if colors or sizes are updated
    if (productData.colors !== undefined || productData.sizes !== undefined) {
      try {
        await supabase.from("product_variants").delete().eq("product_id", productId);
        const colors = productData.colors || [{ name: "Standard", hex: "#000000" }];
        const sizes = productData.sizes || ["Standard"];
        const variantRows: any[] = [];
        for (const c of colors) {
          for (const s of sizes) {
            variantRows.push({
              product_id: productId,
              sku: crypto.randomUUID(),
              size: s,
              size_value: s,
              color_name: c.name,
              color_hex: c.hex || "#000000",
              stock: 10,
              price: productData.salePrice || productData.price || 0,
            });
          }
        }
        await supabase.from("product_variants").insert(variantRows);
      } catch (err) {
        console.warn("Could not update product_variants:", err);
      }
    }
    
    await loadCatalog();
    return data;
  };

  const deleteProduct = async (productId: string) => {
    const supabase = createClient();

    // Delete associated product_images and product_variants if present
    try {
      await supabase.from("product_images").delete().eq("product_id", productId);
    } catch (err) {}

    try {
      await supabase.from("product_variants").delete().eq("product_id", productId);
    } catch (err) {}

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }

    await loadCatalog();
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return { products, categories, collections, loading, addProduct, updateProduct, deleteProduct, uploadProductImage, refresh: loadCatalog };
}
