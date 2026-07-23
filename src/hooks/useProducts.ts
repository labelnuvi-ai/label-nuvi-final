import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { PRODUCTS } from "@/lib/data/mockData";
import { createClient } from "@/lib/supabase/client";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const dbProducts: Product[] = data.map((row) => ({
          id: row.id,
          name: row.name,
          slug: row.slug,
          subtitle: row.subtitle,
          description: row.description,
          price: Number(row.price),
          salePrice: row.sale_price ? Number(row.sale_price) : undefined,
          isNew: row.is_new,
          isBestseller: row.is_bestseller,
          isSoldOut: row.is_sold_out,
          images: row.images || ["/images/product-dress-front.jpg"],
          colors: row.colors || [{ name: "Ivory", hex: "#FAF8F5" }],
          sizes: row.sizes || ["S", "M"],
          categoryId: row.category_id,
          categoryName: row.category_name || "Dresses",
          rating: Number(row.rating || 5.0),
          reviewsCount: Number(row.reviews_count || 0),
          createdAt: row.created_at,
          details: row.details || ["Dry clean only"],
          fabricCare: row.fabric_care || ["Dry clean only"],
        }));

        // Filter out mock duplicates
        const mockFiltered = PRODUCTS.filter(
          (mp) => !dbProducts.some((dbp) => dbp.id === mp.id)
        );

        setProducts([...dbProducts, ...mockFiltered]);
      } else {
        setProducts(PRODUCTS);
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setProducts(PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = async (productData: Partial<Product>) => {
    const supabase = createClient();
    
    const id = productData.id || "prod-" + Math.floor(100000 + Math.random() * 900000);
    const dbRow = {
      id,
      name: productData.name,
      slug: productData.slug || productData.name?.toLowerCase().replace(/ /g, "-"),
      subtitle: productData.subtitle || "Premium Drop Silhouette",
      description: productData.description || "Crafted from hand-selected luxurious materials.",
      price: productData.price,
      sale_price: productData.salePrice || null,
      is_new: productData.isNew ?? true,
      is_bestseller: productData.isBestseller ?? false,
      is_sold_out: productData.isSoldOut ?? false,
      images: productData.images || ["/images/product-dress-front.jpg"],
      colors: productData.colors || [{ name: "Ivory", hex: "#FAF8F5" }],
      sizes: productData.sizes || ["S", "M"],
      category_id: productData.categoryId || "cat-1",
      category_name: productData.categoryName || "Dresses",
      rating: 5.0,
      reviews_count: 0,
      details: productData.details || ["Dry clean only", "Made in France"],
      fabric_care: productData.fabricCare || ["Dry clean only"],
    };

    const { data, error } = await supabase
      .from("products")
      .insert(dbRow)
      .select()
      .single();

    if (error) {
      console.error("Error inserting product in Supabase:", error);
      throw error;
    }
    
    await loadProducts();
    return data;
  };

  const updateProduct = async (productId: string, productData: Partial<Product>) => {
    const supabase = createClient();
    
    const dbRow: any = {};
    if (productData.name !== undefined) dbRow.name = productData.name;
    if (productData.slug !== undefined) dbRow.slug = productData.slug;
    if (productData.subtitle !== undefined) dbRow.subtitle = productData.subtitle;
    if (productData.description !== undefined) dbRow.description = productData.description;
    if (productData.price !== undefined) dbRow.price = productData.price;
    if (productData.salePrice !== undefined) dbRow.sale_price = productData.salePrice;
    if (productData.isNew !== undefined) dbRow.is_new = productData.isNew;
    if (productData.isBestseller !== undefined) dbRow.is_bestseller = productData.isBestseller;
    if (productData.isSoldOut !== undefined) dbRow.is_sold_out = productData.isSoldOut;
    if (productData.images !== undefined) dbRow.images = productData.images;
    if (productData.colors !== undefined) dbRow.colors = productData.colors;
    if (productData.sizes !== undefined) dbRow.sizes = productData.sizes;
    if (productData.categoryId !== undefined) dbRow.category_id = productData.categoryId;
    if (productData.categoryName !== undefined) dbRow.category_name = productData.categoryName;
    if (productData.details !== undefined) dbRow.details = productData.details;
    if (productData.fabricCare !== undefined) dbRow.fabric_care = productData.fabricCare;

    const { data, error } = await supabase
      .from("products")
      .update(dbRow)
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Error updating product in Supabase:", error);
      throw error;
    }
    
    await loadProducts();
    return data;
  };

  const deleteProduct = async (productId: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      console.error("Error deleting product from Supabase:", error);
      throw error;
    }

    await loadProducts();
  };

  const uploadProductImage = async (file: File): Promise<string> => {
    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  return { products, loading, addProduct, updateProduct, deleteProduct, uploadProductImage, refresh: loadProducts };
}
