import { useState, useEffect } from "react";
import { Product } from "@/types";
import { PRODUCTS } from "@/lib/data/mockData";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Products remain static for now, loaded from mockData
    setProducts(PRODUCTS);
    setLoading(false);
  }, []);

  const addProduct = async (productData: Partial<Product>) => {
    console.log("Mock add product:", productData);
    // Return mock created product
    return productData;
  };

  const deleteProduct = async (productId: string) => {
    console.log("Mock delete product:", productId);
  };

  return { products, loading, addProduct, deleteProduct, refresh: () => {} };
}
