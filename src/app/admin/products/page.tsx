"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sliders, Plus, Trash2, Edit3, ArrowLeft, X, Tag, Upload, RefreshCw } from "lucide-react";
import { CATEGORIES, COLLECTIONS } from "@/lib/data/mockData";
import { Product, Category, Collection } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useProducts } from "@/hooks/useProducts";

export default function AdminProductsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct, uploadProductImage } = useProducts();

  const [categoriesList, setCategoriesList] = useState<Category[]>(CATEGORIES);
  const [collectionsList, setCollectionsList] = useState<Collection[]>(COLLECTIONS);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states (Add & Edit share similar keys)
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(CATEGORIES[0]?.id || "cat-1");
  const [selectedCollectionId, setSelectedCollectionId] = useState(COLLECTIONS[0]?.id || "col-1");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/product-dress-front.jpg");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M"]);
  const [isNew, setIsNew] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  
  // Image uploading states
  const [isUploading, setIsUploading] = useState(false);

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

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setSalePrice("");
    setSelectedCategoryId(CATEGORIES[0]?.id || "cat-1");
    setSelectedCollectionId(COLLECTIONS[0]?.id || "col-1");
    setSubtitle("");
    setDescription("");
    setImageUrl("/images/product-dress-front.jpg");
    setSelectedSizes(["S", "M"]);
    setIsNew(true);
    setIsBestseller(false);
    setIsSoldOut(false);
    setIsProductModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(String(prod.price));
    setSalePrice(prod.salePrice ? String(prod.salePrice) : "");
    setSelectedCategoryId(prod.categoryId);
    setSelectedCollectionId(prod.collectionId || "col-1");
    setSubtitle(prod.subtitle || "");
    setDescription(prod.description || "");
    setImageUrl(prod.images[0] || "/images/product-dress-front.jpg");
    setSelectedSizes(prod.sizes || ["S", "M"]);
    setIsNew(prod.isNew ?? true);
    setIsBestseller(prod.isBestseller ?? false);
    setIsSoldOut(prod.isSoldOut ?? false);
    setIsProductModalOpen(true);
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadProductImage(file);
      setImageUrl(publicUrl);
    } catch (err: any) {
      alert("Storage upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const matchedCat = categoriesList.find((c) => c.id === selectedCategoryId);
    const matchedCol = collectionsList.find((c) => c.id === selectedCollectionId);

    const payload = {
      name,
      slug: name.toLowerCase().replace(/ /g, "-"),
      subtitle: subtitle || "Premium Collection Item",
      description: description || "Crafted from fine fibers for ultimate silhouette structure.",
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      categoryId: selectedCategoryId,
      categoryName: matchedCat ? matchedCat.name : "Dresses",
      collectionId: selectedCollectionId,
      collectionName: matchedCol ? matchedCol.title : undefined,
      images: [imageUrl, "/images/product-dress-back.jpg"],
      colors: [
        { name: "Ivory", hex: "#FAF8F5" },
        { name: "Atelier Gold", hex: "#C8A46B" },
      ],
      sizes: selectedSizes.length > 0 ? (selectedSizes as any) : ["S", "M"],
      isNew,
      isBestseller,
      isSoldOut,
      details: ["Dry clean only", "Made in France"],
      fabricCare: ["Dry clean only", "Cool iron reverse"],
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

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="bg-white text-black border border-neutral-200 text-xs font-label uppercase tracking-widest px-6 py-3.5 rounded-full flex items-center space-x-1.5 shadow-sm hover:border-black transition-colors"
          >
            <Tag className="w-4 h-4" />
            <span>ADD CATEGORY</span>
          </button>
          <button
            onClick={openAddModal}
            className="bg-black text-white text-xs font-label uppercase tracking-widest px-6 py-3.5 rounded-full flex items-center space-x-1.5 shadow-md hover:bg-neutral-800 transition-colors"
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
                      <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
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
                        <span className="text-black font-bold">${prod.salePrice}</span>
                        <span className="text-neutral-400 line-through">${prod.price}</span>
                      </div>
                    ) : (
                      <span>${prod.price}</span>
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
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Soren Cowl Satin Midi Dress"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Original Price (USD)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="490"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Sale Price (USD)
                  </label>
                  <input
                    type="number"
                    placeholder="420 (optional)"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Category Index
                  </label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Collection Index
                  </label>
                  <select
                    value={selectedCollectionId}
                    onChange={(e) => setSelectedCollectionId(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  >
                    {collectionsList.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Liquid Silk Gown"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
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

              {/* Upload Image to Storage */}
              <div className="space-y-2.5">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Product Image File (Supabase Storage)
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/50 shrink-0">
                    <Image src={imageUrl} alt="Upload Preview" fill className="object-cover" />
                  </div>

                  <label className="flex-1 flex flex-col items-center justify-center border border-dashed border-neutral-300 rounded-2xl p-4 bg-[#FAF8F5] hover:bg-neutral-50 cursor-pointer transition-colors relative">
                    {isUploading ? (
                      <RefreshCw className="w-5 h-5 animate-spin text-neutral-400" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                        <span className="text-[10px] text-neutral-500 font-semibold">CHOOSE FILE</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Sizes Availability
                </label>
                <div className="flex flex-wrap gap-2">
                  {["XXS", "XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSizeToggle(sz)}
                      className={`w-10 h-10 rounded-xl text-xs flex items-center justify-center font-bold border transition-colors ${
                        selectedSizes.includes(sz) ? "bg-black text-white border-black" : "bg-[#FAF8F5] text-neutral-800 border-neutral-200 hover:border-black"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-black rounded"
                  />
                  <span className="text-[10px] font-semibold text-neutral-800">NEW ARRIVAL</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="accent-black rounded"
                  />
                  <span className="text-[10px] font-semibold text-neutral-800">BESTSELLER</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSoldOut}
                    onChange={(e) => setIsSoldOut(e.target.checked)}
                    className="accent-black rounded"
                  />
                  <span className="text-[10px] font-semibold text-red-600">SOLD OUT</span>
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

      {/* Add Category Modal */}
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
                CREATE INDEX
              </span>
              <h3 className="text-xl font-serif font-bold uppercase tracking-wider text-[#1a1a1a]">
                ADD NEW CATEGORY
              </h3>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-4 text-xs font-label">
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculpt & Contour"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="bg-[#FAF8F5] text-xs px-4 py-3.5 w-full rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
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

              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Category Image Banner
                </label>
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
                CREATE CATEGORY INDEX
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
