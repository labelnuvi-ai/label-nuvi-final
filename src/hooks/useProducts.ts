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
      
      // Fetch Products joined with categories, collections, product_images & product_variants
      const { data: prodData, error: prodError } = await supabase
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
            image_url
          ),
          product_variants (
            size,
            color_name,
            color_hex
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
        const dbMapped = prodData.map((row: any) => {
          const mainImageUrl = row.image_url || "/images/product-dress-front.jpg";
          
          // Build images array combining main image_url and product_images rows
          let galleryList: string[] = [];
          if (Array.isArray(row.product_images) && row.product_images.length > 0) {
            galleryList = row.product_images.map((pi: any) => pi.image_url).filter(Boolean);
          }
          const allImages = [mainImageUrl, ...galleryList.filter((img) => img !== mainImageUrl)];

          // Extract colors and sizes from product_variants
          let colorList: { name: string; hex: string }[] = [];
          let sizeList: string[] = [];

          if (Array.isArray(row.product_variants) && row.product_variants.length > 0) {
            const colorMap = new Map<string, string>();
            const sizeSet = new Set<string>();

            row.product_variants.forEach((v: any) => {
              if (v.color_name) colorMap.set(v.color_name, v.color_hex || "#FAF8F5");
              if (v.size) sizeSet.add(v.size);
            });

            colorMap.forEach((hex, name) => colorList.push({ name, hex }));
            sizeList = Array.from(sizeSet);
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
            isActive: row.is_active ?? true,
            imageUrl: mainImageUrl,
            images: allImages.length > 0 ? allImages : [mainImageUrl],
            colors: colorList.length > 0 ? colorList : [{ name: "Ivory", hex: "#FAF8F5" }],
            sizes: sizeList.length > 0 ? (sizeList as any) : ["S", "M", "L"],
            categoryId: row.category_id,
            categoryName: row.categories?.name || "Dresses",
            collectionId: row.collection_id || undefined,
            collectionName: row.collections?.title || undefined,
            rating: Number(row.rating || 5.0),
            reviewsCount: Number(row.reviews_count || 0),
            createdAt: row.created_at,
            details: ["Hand finished seam construction", "Dry clean only"],
            fabricCare: ["Dry clean only", "Cool iron reverse"],
          };
        });

        setProducts(dbMapped);
      } else if (prodError) {
        console.error("Supabase products fetch error:", prodError);
      }

      if (!catError && catData) {
        setCategories(catData);
      }
      if (!colError && colData) {
        setCollections(colData);
      }
    } catch (err: any) {
      console.error("loadCatalog error:", err);
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

    // Insert payload targeting valid columns ONLY in products table
    const dbRow: any = {
      id,
      category_id: productData.categoryId || null,
      collection_id: productData.collectionId || null,
      name: productData.name,
      slug: productData.slug || productData.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "product-" + Date.now(),
      subtitle: productData.subtitle || "Premium Drop Silhouette",
      description: productData.description || "Crafted from hand-selected luxurious materials.",
      price: productData.price,
      sale_price: productData.salePrice || null,
      image_url: productData.imageUrl || "/images/product-dress-front.jpg",
      rating: productData.rating ?? 5.0,
      reviews_count: productData.reviewsCount ?? 0,
      is_new: productData.isNew ?? true,
      is_bestseller: productData.isBestseller ?? false,
      is_sold_out: productData.isSoldOut ?? false,
      is_active: productData.isActive ?? true,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("products")
      .insert(dbRow)
      .select()
      .single();

    if (error) {
      console.error("INSERT ERROR:", error);
      alert("Database error: " + error.message);
      throw error;
    }

    // Persist additional gallery images into product_images table
    const extraImages = (productData.images || []).filter((img) => img && img !== dbRow.image_url);
    if (extraImages.length > 0) {
      const imageRows = extraImages.map((img) => ({
        product_id: id,
        image_url: img,
      }));
      const { error: imgErr } = await supabase.from("product_images").insert(imageRows);
      if (imgErr) console.error("Error inserting product_images:", imgErr);
    }

    // Persist sizes and colors into product_variants table
    const sizes = productData.sizes || ["S", "M", "L"];
    const colors = productData.colors || [{ name: "Ivory", hex: "#FAF8F5" }];
    const variantRows: any[] = [];

    sizes.forEach((sz) => {
      colors.forEach((c) => {
        variantRows.push({
          product_id: id,
          size: sz,
          color_name: c.name,
          color_hex: c.hex,
        });
      });
    });

    if (variantRows.length > 0) {
      const { error: varErr } = await supabase.from("product_variants").insert(variantRows);
      if (varErr) console.error("Error inserting product_variants:", varErr);
    }

    await loadCatalog();
    return data;
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    const supabase = createClient();
    const now = new Date().toISOString();

    // Payload containing valid columns ONLY in products table
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
    if (productData.isActive !== undefined) dbRow.is_active = productData.isActive;
    if (productData.categoryId !== undefined) dbRow.category_id = productData.categoryId;
    if (productData.collectionId !== undefined) dbRow.collection_id = productData.collectionId;
    if (productData.imageUrl !== undefined) dbRow.image_url = productData.imageUrl;

    const { data, error } = await supabase
      .from("products")
      .update(dbRow)
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Error updating product:", error);
      alert("Error updating product: " + error.message);
      throw error;
    }

    // Synchronize product_images table if images array is provided
    if (productData.images !== undefined) {
      const mainImg = productData.imageUrl || dbRow.image_url;
      const extraImages = productData.images.filter((img) => img && img !== mainImg);

      await supabase.from("product_images").delete().eq("product_id", productId);

      if (extraImages.length > 0) {
        const imageRows = extraImages.map((img) => ({
          product_id: productId,
          image_url: img,
        }));
        await supabase.from("product_images").insert(imageRows);
      }
    }

    // Synchronize product_variants table if sizes or colors are provided
    if (productData.sizes !== undefined || productData.colors !== undefined) {
      const sizes = productData.sizes || ["S", "M", "L"];
      const colors = productData.colors || [{ name: "Ivory", hex: "#FAF8F5" }];
      const variantRows: any[] = [];

      sizes.forEach((sz) => {
        colors.forEach((c) => {
          variantRows.push({
            product_id: productId,
            size: sz,
            color_name: c.name,
            color_hex: c.hex,
          });
        });
      });

      await supabase.from("product_variants").delete().eq("product_id", productId);
      if (variantRows.length > 0) {
        await supabase.from("product_variants").insert(variantRows);
      }
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

  const addCategory = async (catData: Partial<Category>) => {
    const supabase = createClient();
    const id = catData.id || "cat-" + Date.now();
    const now = new Date().toISOString();

    const dbRow = {
      id,
      name: catData.name,
      slug: catData.slug || catData.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "cat-" + Date.now(),
      description: catData.description || "",
      image_url: catData.imageUrl || "/images/category-dresses.jpg",
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("categories")
      .insert(dbRow)
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      throw error;
    }

    await loadCatalog();
    return data;
  };

  const updateCategory = async (categoryId: string, catData: Partial<Category>) => {
    const supabase = createClient();
    const now = new Date().toISOString();

    const dbRow: any = {
      updated_at: now,
    };
    if (catData.name !== undefined) dbRow.name = catData.name;
    if (catData.slug !== undefined) dbRow.slug = catData.slug;
    if (catData.description !== undefined) dbRow.description = catData.description;
    if (catData.imageUrl !== undefined) dbRow.image_url = catData.imageUrl;

    const { data, error } = await supabase
      .from("categories")
      .update(dbRow)
      .eq("id", categoryId)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      throw error;
    }

    await loadCatalog();
    return data;
  };

  const deleteCategory = async (categoryId: string) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", categoryId);

    if (error) {
      console.error("Error deleting category:", error);
      throw error;
    }

    await loadCatalog();
  };

  const addCollection = async (colData: Partial<Collection>) => {
    const supabase = createClient();
    const id = colData.id || "col-" + Date.now();
    const now = new Date().toISOString();

    const dbRow = {
      id,
      title: colData.title,
      slug: colData.slug || colData.title?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "col-" + Date.now(),
      subtitle: colData.subtitle || "",
      description: colData.description || "",
      banner_image: colData.bannerImage || "/images/editorial-banner.jpg",
      is_featured: colData.isFeatured ?? true,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabase
      .from("collections")
      .insert(dbRow)
      .select()
      .single();

    if (error) {
      console.error("Error creating collection:", error);
      throw error;
    }

    await loadCatalog();
    return data;
  };

  const updateCollection = async (collectionId: string, colData: Partial<Collection>) => {
    const supabase = createClient();
    const now = new Date().toISOString();

    const dbRow: any = {
      updated_at: now,
    };
    if (colData.title !== undefined) dbRow.title = colData.title;
    if (colData.slug !== undefined) dbRow.slug = colData.slug;
    if (colData.subtitle !== undefined) dbRow.subtitle = colData.subtitle;
    if (colData.description !== undefined) dbRow.description = colData.description;
    if (colData.bannerImage !== undefined) dbRow.banner_image = colData.bannerImage;
    if (colData.isFeatured !== undefined) dbRow.is_featured = colData.isFeatured;

    const { data, error } = await supabase
      .from("collections")
      .update(dbRow)
      .eq("id", collectionId)
      .select()
      .single();

    if (error) {
      console.error("Error updating collection:", error);
      throw error;
    }

    await loadCatalog();
    return data;
  };

  const deleteCollection = async (collectionId: string) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("collections")
      .delete()
      .eq("id", collectionId);

    if (error) {
      console.error("Error deleting collection:", error);
      throw error;
    }

    await loadCatalog();
  };

  return {
    products,
    categories,
    collections,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addCollection,
    updateCollection,
    deleteCollection,
    refresh: loadCatalog,
  };
}
