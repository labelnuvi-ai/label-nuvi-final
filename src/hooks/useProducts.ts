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
      
      // Fetch Products directly from products table joined with categories & collections
      const { data: prodData, error: prodError } = await supabase
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
            const mainImageUrl = row.image_url || "/images/product-dress-front.jpg";

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
              imageUrl: mainImageUrl,
              images: [mainImageUrl],
              colors: Array.isArray(row.colors) ? row.colors : [{ name: "Ivory", hex: "#FAF8F5" }],
              sizes: Array.isArray(row.sizes) ? row.sizes : ["S", "M"],
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

    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("==============");
    console.log("SESSION:", session);
    console.log("USER:", session?.user);
    console.log("ROLE:", session?.user?.role);
    console.log("==============");

    const id = productData.id || crypto.randomUUID();
    const now = new Date().toISOString();

    // Insert payload targeting ONLY the existing products table schema
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
      image_url: productData.imageUrl || (productData.images && productData.images[0]) || "/images/product-dress-front.jpg",
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
    if (productData.imageUrl !== undefined) {
      dbRow.image_url = productData.imageUrl;
    } else if (productData.images !== undefined && productData.images.length > 0) {
      dbRow.image_url = productData.images[0];
    }

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

    await loadCatalog();
    return data;
  };

  const deleteProduct = async (productId: string) => {
    const supabase = createClient();

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

    console.log("Uploading:", fileName);

    const result = await supabase.storage
      .from("products")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log("UPLOAD RESULT:", result);

    if (result.error) {
      throw result.error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(fileName);

    console.log("PUBLIC URL:", publicUrl);

    return publicUrl;
  };

  return { products, categories, collections, loading, addProduct, updateProduct, deleteProduct, uploadProductImage, refresh: loadCatalog };
}
