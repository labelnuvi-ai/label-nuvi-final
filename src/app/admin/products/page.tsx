"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sliders, Plus, Trash2, ArrowLeft, X, Tag } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/data/mockData";
import { Product, Category } from "@/types";

export default function AdminProductsPage() {
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [categoriesList, setCategoriesList] = useState<Category[]>(CATEGORIES);
  
  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // New product form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(CATEGORIES[0]?.id || "cat-1");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/product-dress-front.jpg");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M"]);

  // New category form states
  const [catName, setCatName] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catImage, setCatImage] = useState("/images/category-dresses.jpg");

  const presetImages = [
    { label: "Satin Dress (Front)", value: "/images/product-dress-front.jpg" },
    { label: "Satin Dress (Back)", value: "/images/product-dress-back.jpg" },
    { label: "Atelier Suit", value: "/images/product-suit-front.jpg" },
    { label: "Outerwear Trench", value: "/images/editorial-banner.jpg" },
    { label: "Model Portrait", value: "/images/hero-portrait.jpg" },
  ];

  const presetCategoryImages = [
    { label: "Dresses (ivory)", value: "/images/category-dresses.jpg" },
    { label: "Suiting (sand)", value: "/images/product-suit-front.jpg" },
    { label: "Outerwear (black)", value: "/images/editorial-banner.jpg" },
  ];

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const matchedCat = categoriesList.find((c) => c.id === selectedCategoryId);

    const newProd: Product = {
      id: "prod-" + (productsList.length + 1),
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
      subtitle: subtitle || "Premium Collection Item",
      description: description || "Crafted from fine fibers for ultimate silhouette structure.",
      price: Number(price),
      categoryId: selectedCategoryId,
      categoryName: matchedCat ? matchedCat.name : "Dresses",
      images: [imageUrl, "/images/product-dress-back.jpg"],
      colors: [
        { name: "Ivory", hex: "#FAF8F5" },
        { name: "Atelier Gold", hex: "#C8A46B" },
      ],
      sizes: selectedSizes.length > 0 ? (selectedSizes as any) : ["S", "M"],
      rating: 4.8,
      reviewsCount: 1,
      isNew: true,
      details: ["Dry clean only", "Made in France"],
      fabricCare: ["Dry clean only", "Cool iron reverse"],
      createdAt: new Date().toISOString(),
    };

    setProductsList([newProd, ...productsList]);
    setIsProductModalOpen(false);

    // Reset Form
    setName("");
    setPrice("");
    setSubtitle("");
    setDescription("");
    setSelectedSizes(["S", "M"]);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName) return;

    const newCat: Category = {
      id: "cat-" + (categoriesList.length + 1),
      name: catName,
      slug: catName.toLowerCase().replace(/ /g, "-"),
      description: catDescription || "Luxury atelier curated drops.",
      imageUrl: catImage,
      itemCount: 0,
    };

    setCategoriesList([...categoriesList, newCat]);
    setIsCategoryModalOpen(false);

    // Reset Form
    setCatName("");
    setCatDescription("");
  };

  const handleDeleteProduct = (id: string) => {
    setProductsList(productsList.filter((p) => p.id !== id));
  };

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

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white text-black border border-neutral-200 text-xs font-label uppercase tracking-widest px-6 py-3.5 rounded-full flex items-center space-x-1.5 shadow-sm hover:border-black transition-colors"
          >
            <Tag className="w-4 h-4" />
            <span>ADD CATEGORY</span>
          </button>
          <button
            onClick={() => setIsProductModalOpen(true)}
            className="bg-black text-white text-xs font-label uppercase tracking-widest px-6 py-3.5 rounded-full flex items-center space-x-1.5 shadow-md hover:bg-neutral-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[24px] border border-neutral-200/80 shadow-luxury-xs overflow-hidden">
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
            {productsList.map((prod) => (
              <tr key={prod.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="relative w-12 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/50">
                    <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-black uppercase block">{prod.name}</span>
                  <span className="text-[11px] text-neutral-400 block">{prod.subtitle}</span>
                </td>
                <td className="px-6 py-4 uppercase text-[11px] font-semibold">{prod.categoryName}</td>
                <td className="px-6 py-4 font-semibold">${prod.price.toFixed(2)}</td>
                <td className="px-6 py-4 font-label font-bold text-neutral-500 space-x-1">
                  {prod.sizes.map((s) => (
                    <span key={s} className="bg-neutral-100 px-1.5 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ACTIVE
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors rounded-full hover:bg-neutral-100"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-8 shadow-2xl relative space-y-6 my-8">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[9px] font-label uppercase tracking-widest text-[#C8A46B] font-semibold">
                NEW COUTURE
              </span>
              <h2 className="text-2xl font-serif-luxury font-light uppercase tracking-wider text-black">
                ADD NEW PRODUCT
              </h2>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-label uppercase tracking-wider text-neutral-500 block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AURELIA SATIN MINI DRESS"
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-3 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-label uppercase tracking-wider text-neutral-500 block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="250"
                    className="bg-[#FAF8F5] text-xs font-label px-5 py-3 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-label uppercase tracking-wider text-neutral-500 block mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="bg-[#FAF8F5] text-xs font-label px-5 py-3 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-black"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-label uppercase tracking-wider text-neutral-500 block mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Heavy silk silhouette backless drape"
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-3 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-black"
                />
              </div>

              {/* Sizing Checkboxes */}
              <div>
                <label className="text-[10px] font-label uppercase tracking-wider text-neutral-500 block mb-2">
                  Select Available Sizes
                </label>
                <div className="flex space-x-2">
                  {["XS", "S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`w-10 h-10 rounded-full border text-xs font-label font-bold transition-all ${
                        selectedSizes.includes(size)
                          ? "bg-black text-white border-black"
                          : "bg-[#FAF8F5] text-black border-neutral-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image selector */}
              <div>
                <label className="text-[10px] font-label uppercase tracking-wider text-neutral-500 block mb-2">
                  Atelier Image Asset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presetImages.map((img) => (
                    <button
                      key={img.value}
                      type="button"
                      onClick={() => setImageUrl(img.value)}
                      className={`text-[10px] font-label p-2.5 rounded-xl border text-left truncate transition-colors ${
                        imageUrl === img.value
                          ? "bg-[#FAF8F5] border-[#1A1A1A] font-bold"
                          : "bg-white border-neutral-200 hover:border-black"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-label uppercase tracking-wider text-neutral-500 block mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Atelier draping features..."
                  rows={2}
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-black text-white text-xs font-label uppercase tracking-widest py-4 rounded-full font-semibold hover:bg-neutral-800 transition-colors shadow-md"
                >
                  ADD COUTURE PIECE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-8 shadow-2xl relative space-y-6 my-8">
            <button
              onClick={() => setIsCategoryModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[9px] font-label uppercase tracking-widest text-[#C8A46B] font-semibold">
                NEW SECTOR
              </span>
              <h2 className="text-2xl font-serif-luxury font-light uppercase tracking-wider text-black">
                ADD NEW CATEGORY
              </h2>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-label uppercase tracking-wider text-neutral-500 block mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Couture Silk, Knitwear"
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-3 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="text-[10px] font-label uppercase tracking-wider text-neutral-500 block mb-1">
                  Brief description
                </label>
                <input
                  type="text"
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="e.g. Fine knit cashmere blends"
                  className="bg-[#FAF8F5] text-xs font-label px-5 py-3 w-full rounded-full border border-neutral-200 focus:outline-none focus:border-black"
                />
              </div>

              {/* Category Image selector */}
              <div>
                <label className="text-[10px] font-label uppercase tracking-wider text-neutral-500 block mb-2">
                  Atelier Category Cover Image
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {presetCategoryImages.map((img) => (
                    <button
                      key={img.value}
                      type="button"
                      onClick={() => setCatImage(img.value)}
                      className={`text-[10px] font-label p-2.5 rounded-xl border text-left truncate transition-colors ${
                        catImage === img.value
                          ? "bg-[#FAF8F5] border-[#1A1A1A] font-bold"
                          : "bg-white border-neutral-200 hover:border-black"
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-black text-white text-xs font-label uppercase tracking-widest py-4 rounded-full font-semibold hover:bg-neutral-800 transition-colors shadow-md"
                >
                  ADD ATELIER CATEGORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
