"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sliders, Plus, Trash2, Edit3, ArrowLeft, X, Tag, Upload, RefreshCw } from "lucide-react";
import { Product, Category, Collection } from "@/types";
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
  } = useProducts();

  const [collectionsList, setCollectionsList] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (collections.length > 0) {
      setCollectionsList(collections);
      if (!selectedCollectionId) {
        setSelectedCollectionId(collections[0].id);
      }
    }
  }, [collections]);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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
  const [imageUrl, setImageUrl] = useState("/images/product-dress-front.jpg");
  const [galleryUrl1, setGalleryUrl1] = useState("");
  const [galleryUrl2, setGalleryUrl2] = useState("");
  const [galleryUrl3, setGalleryUrl3] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L"]);
  const [colors, setColors] = useState<{ name: string; hex: string }[]>([
    { name: "Ivory", hex: "#FAF8F5" },
    { name: "Blush Pink", hex: "#E88DA5" },
  ]);
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#C8A46B");

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

  const presetCategoryImages = [
    { label: "Dresses (ivory)", value: "/images/category-dresses.jpg" },
    { label: "Co-Ord Sets", value: "/images/satin-corset-blush-pink-front.png" },
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

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setIsSlugUserModified(false);
    setPrice("");
    setSalePrice("");
    setSelectedCategoryId(categories[0]?.id || "");
    setSelectedCollectionId(collectionsList[0]?.id || "");
    setSubtitle("");
    setDescription("");
    setImageUrl("/images/product-dress-front.jpg");
    setGalleryUrl1("");
    setGalleryUrl2("");
    setGalleryUrl3("");
    setSelectedSizes(["S", "M", "L"]);
    setColors([{ name: "Ivory", hex: "#FAF8F5" }]);
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
    setSelectedCollectionId(prod.collectionId || collectionsList[0]?.id || "");
    setSubtitle(prod.subtitle || "");
    setDescription(prod.description || "");
    setImageUrl(prod.imageUrl || (prod.images && prod.images[0]) || "/images/product-dress-front.jpg");
    setGalleryUrl1(prod.images && prod.images[1] ? prod.images[1] : "");
    setGalleryUrl2(prod.images && prod.images[2] ? prod.images[2] : "");
    setGalleryUrl3(prod.images && prod.images[3] ? prod.images[3] : "");
    setSelectedSizes(prod.sizes || ["S", "M", "L"]);
    setColors(prod.colors && prod.colors.length > 0 ? prod.colors : [{ name: "Ivory", hex: "#FAF8F5" }]);
    setIsNew(prod.isNew ?? true);
    setIsBestseller(prod.isBestseller ?? false);
    setIsSoldOut(prod.isSoldOut ?? false);
    setIsActive(prod.isActive ?? true);
    setIsProductModalOpen(true);
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const matchedCat = categories.find((c) => c.id === selectedCategoryId);
    const matchedCol = collectionsList.find((c) => c.id === selectedCollectionId);

    const imagesList = [imageUrl, galleryUrl1, galleryUrl2, galleryUrl3].filter((u) => Boolean(u && u.trim()));

    const payload = {
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
      imageUrl: imageUrl || imagesList[0] || "/images/product-dress-front.jpg",
      images: imagesList.length > 0 ? imagesList : [imageUrl || "/images/product-dress-front.jpg"],
      colors: colors.length > 0 ? colors : [{ name: "Ivory", hex: "#FAF8F5" }],
      sizes: selectedSizes.length > 0 ? (selectedSizes as any) : ["S", "M", "L"],
      isNew,
      isBestseller,
      isSoldOut,
      isActive,
      details: editingProduct?.details || ["Dry clean only", "Made in India"],
      fabricCare: editingProduct?.fabricCare || ["Dry clean only", "Cool iron reverse"],
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

        <div className="flex items-center space-x-3">
          <button
            onClick={openAddCategoryModal}
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
                    {collectionsList.map((col) => (
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

              {/* Main & Gallery Image URLs */}
              <div className="space-y-3 pt-2 border-t border-neutral-100">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                  Main Cover & Gallery Image URLs
                </label>

                {/* Main Image URL */}
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                    <Image src={imageUrl || "/images/product-dress-front.jpg"} alt="Main Preview" fill className="object-cover" />
                  </div>
                  <input
                    type="text"
                    placeholder="Main Cover Image URL (e.g. /images/satin-corset-blush-pink-front.png)"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-3.5 py-3 flex-1 rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>

                {/* Gallery Image 1 */}
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                    <Image src={galleryUrl1 || imageUrl || "/images/product-dress-front.jpg"} alt="Gallery 1" fill className="object-cover" />
                  </div>
                  <input
                    type="text"
                    placeholder="Gallery Image URL 1 (e.g. /images/satin-corset-blush-pink-back.jpg)"
                    value={galleryUrl1}
                    onChange={(e) => setGalleryUrl1(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-3.5 py-3 flex-1 rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>

                {/* Gallery Image 2 */}
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                    <Image src={galleryUrl2 || imageUrl || "/images/product-dress-front.jpg"} alt="Gallery 2" fill className="object-cover" />
                  </div>
                  <input
                    type="text"
                    placeholder="Gallery Image URL 2 (Optional)"
                    value={galleryUrl2}
                    onChange={(e) => setGalleryUrl2(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-3.5 py-3 flex-1 rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>

                {/* Gallery Image 3 */}
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                    <Image src={galleryUrl3 || imageUrl || "/images/product-dress-front.jpg"} alt="Gallery 3" fill className="object-cover" />
                  </div>
                  <input
                    type="text"
                    placeholder="Gallery Image URL 3 (Optional)"
                    value={galleryUrl3}
                    onChange={(e) => setGalleryUrl3(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-3.5 py-3 flex-1 rounded-2xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
                </div>
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {["XXS", "XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleSizeToggle(sz)}
                      className={`w-10 h-10 rounded-xl text-xs flex items-center justify-center font-bold border transition-colors ${
                        selectedSizes.includes(sz)
                          ? "bg-black text-white border-black"
                          : "bg-[#FAF8F5] text-neutral-800 border-neutral-200 hover:border-black"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Colours List */}
              <div className="space-y-2.5 pt-2 border-t border-neutral-100">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                  Available Colours (Dynamic List)
                </label>

                <div className="flex flex-wrap gap-2">
                  {colors.map((c, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-[#FAF8F5] border border-neutral-200 px-3 py-1.5 rounded-xl">
                      <span className="w-4 h-4 rounded-full border border-neutral-300 shrink-0" style={{ backgroundColor: c.hex }} />
                      <span className="text-xs font-semibold text-neutral-800">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                        className="text-neutral-400 hover:text-red-600 font-bold ml-1"
                        title="Remove Colour"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2 pt-1">
                  <input
                    type="text"
                    placeholder="Colour Name (e.g. Blush Pink)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="bg-[#FAF8F5] text-xs px-3.5 py-2.5 flex-1 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
                  />
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
                      setColors([...colors, { name: newColorName.trim(), hex: newColorHex }]);
                      setNewColorName("");
                    }}
                    className="bg-black text-white text-xs px-4 py-2.5 rounded-xl font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                  >
                    Add Color
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
    </div>
  );
}
