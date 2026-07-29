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
        console.log("SUPABASE ROW", prodData[0]);

        const dbMapped = prodData.map((row: any) => {
          const mainImageUrl = row.image_url || "/images/product-dress-front.jpg";
          console.log("RAW DB:", row.image_url);
          console.log("MAIN:", mainImageUrl);

          return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            subtitle: row.subtitle || "Premium Drop Silhouette",
            description: row.description || "Crafted from hand-selected luxurious materials.",
            price: Number(row.price),
            isNew: row.is_new ?? true,
            isBestseller: row.is_bestseller ?? false,
            isSoldOut: row.is_sold_out ?? false,
            isActive: row.is_active ?? true,
            imageUrl: mainImageUrl,
            images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [mainImageUrl],
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
        });

        const blushPinkCorsetProduct: Product = {
          id: "prod-blush-pink-corset-001",
          name: "Satin Corset Co-Ord Set – Blush Pink",
          slug: "satin-corset-co-ord-set-blush-pink",
          subtitle: "Luminous Satin Evening Co-Ord",
          description:
            "The Satin Corset Co-Ord Set – Blush Pink is designed for elevated evening dressing with a modern couture silhouette. Crafted from glossy satin, the structured corset crop top features elegant panel construction and dramatic off-shoulder puff sleeves that create a sculptural statement. The matching high-waisted ultra-wide palazzo trousers flow effortlessly, balancing structure with fluid movement. Designed for cocktail evenings, luxury vacations, celebrations, and fashion-forward occasions, this ensemble combines contemporary femininity with timeless sophistication.",
          price: 4999,
          salePrice: undefined,
          isNew: true,
          isBestseller: true,
          isSoldOut: false,
          imageUrl: "/images/satin-corset-blush-pink-front.png",
          images: [
            "/images/satin-corset-blush-pink-front.png",
            "/images/satin-corset-blush-pink-back.jpg",
          ],
          colors: [{ name: "Blush Pink", hex: "#E88DA5" }],
          sizes: ["S", "M", "L"],
          categoryId: "cat-coord-sets",
          categoryName: "Co-Ord Sets",
          collectionId: "col-new-arrivals",
          collectionName: "New Arrivals",
          rating: 5.0,
          reviewsCount: 0,
          createdAt: new Date().toISOString(),
          details: [
            "Premium glossy satin fabrication",
            "Structured corset bodice",
            "Off-shoulder puff sleeves",
            "High-waisted silhouette",
            "Ultra-wide palazzo trousers",
            "Lightweight luxurious drape",
            "Hidden side zip closure",
            "Fully lined",
            "Designed in India",
          ],
          fabricCare: [
            "Premium Satin Blend",
            "Dry Clean Only",
            "Steam Before Wear",
            "Do Not Bleach",
            "Cool Iron Inside Out",
          ],
        };

        const azureEclipseProduct: Product = {
          id: "prod-azure-eclipse-001",
          name: "Azure Eclipse Co-Ord Set",
          slug: "azure-eclipse-co-ord-set",
          subtitle: "Architectural Satin Evening Co-Ord",
          description:
            "A striking two-piece satin co-ord crafted for modern evening dressing. The structured cropped blazer features sculpted shoulders and a deep architectural neckline, paired with a high-waisted mini skirt finished with a subtle side slit. Designed to create a confident silhouette while maintaining effortless elegance.\n\nCut from premium high-shine satin with a fluid drape, Azure Eclipse transitions seamlessly from cocktail evenings to luxury resort occasions. Every detail is engineered to embody contemporary femininity with refined tailoring.",
          price: 6999,
          salePrice: undefined,
          isNew: true,
          isBestseller: true,
          isSoldOut: false,
          imageUrl: "/images/azure-eclipse-coord.jpg",
          images: ["/images/azure-eclipse-coord.jpg"],
          colors: [
            { name: "Royal Azure", hex: "#0047AB" },
            { name: "Atelier Gold", hex: "#C8A46B" },
          ],
          sizes: ["S", "M", "L"],
          categoryId: "cat-dresses",
          categoryName: "Dresses",
          collectionId: "col-resort-26",
          collectionName: "Resort '26",
          rating: 5.0,
          reviewsCount: 12,
          createdAt: new Date().toISOString(),
          details: [
            "Two-piece coordinated set",
            "Cropped blazer with structured shoulders",
            "Deep plunge silhouette",
            "High-rise mini skirt",
            "Side slit detail",
            "Regular fit",
            "True to size",
          ],
          fabricCare: [
            "Premium Satin Blend",
            "Soft Inner Lining",
            "Dry Clean Only",
            "Steam on Low Heat",
            "Do Not Bleach",
            "Store on Hanger",
          ],
        };

        const hasBlush = dbMapped.some((p: any) => p.slug === "satin-corset-co-ord-set-blush-pink");
        const hasAzure = dbMapped.some((p: any) => p.slug === "azure-eclipse-co-ord-set");

        const extraProducts: Product[] = [];
        if (!hasBlush) extraProducts.push(blushPinkCorsetProduct);
        if (!hasAzure) extraProducts.push(azureEclipseProduct);

        const finalCatalog = [...extraProducts, ...dbMapped];

        setProducts(finalCatalog);

        console.log("FINAL PRODUCTS", finalCatalog.map((r: any) => ({
          name: r.name,
          image: r.imageUrl
        })));
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
    if (productData.isActive !== undefined) dbRow.is_active = productData.isActive;
    if (productData.categoryId !== undefined) dbRow.category_id = productData.categoryId;
    if (productData.collectionId !== undefined) dbRow.collection_id = productData.collectionId;
    if (productData.imageUrl !== undefined) {
      dbRow.image_url = productData.imageUrl;
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
    refresh: loadCatalog,
  };
}
