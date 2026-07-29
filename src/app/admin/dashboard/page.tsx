"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Sliders,
  Sparkles,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Eye,
  X,
  Printer,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fetchOrdersDb, updateOrderStatusDb, cancelOrderDb } from "@/lib/supabase/db";
import { useProducts } from "@/hooks/useProducts";
import { Order } from "@/types";

const ORDER_STATUSES = ["Pending", "Paid", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUSES = ["All", "Paid", "Pending", "Failed", "Cancelled"];

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { products, loading: productsLoading } = useProducts();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dbProfilesCount, setDbProfilesCount] = useState(0);

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState("All");

  // Selected Order Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const loadDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);

    try {
      // Fetch Orders via Supabase db helper
      const fetchedOrders = await fetchOrdersDb();
      setOrders(fetchedOrders);

      // Fetch Profiles Count
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      setDbProfilesCount(count || 0);
    } catch (err) {
      console.error("Error loading admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Update Status Handler
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatusDb(orderId, newStatus);
      // Immediately update local state
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus as any } : ord))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (err: any) {
      console.error("Admin order status update failed:", err);
      alert(`Failed to update status: ${err.message || JSON.stringify(err)}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Cancel Order Handler
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setIsUpdatingStatus(true);
    try {
      await cancelOrderDb(orderId);
      setOrders((prev) =>
        prev.map((ord) =>
          ord.id === orderId
            ? { ...ord, status: "Cancelled" as any, paymentStatus: "Cancelled" as any }
            : ord
        )
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: "Cancelled" as any, paymentStatus: "Cancelled" as any } : null
        );
      }
    } catch (err: any) {
      console.error("Admin order cancellation failed:", err);
      alert(`Failed to cancel order: ${err.message || JSON.stringify(err)}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.shippingAddress.email &&
        order.shippingAddress.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      selectedStatusFilter === "All" || order.status === selectedStatusFilter;

    const matchesPayment =
      selectedPaymentFilter === "All" ||
      (order as any).paymentStatus === selectedPaymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Metrics
  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);
  const ordersCount = orders.length;
  const productsCount = products.length;

  if (loading || productsLoading) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-6 text-center text-xs font-label uppercase tracking-widest text-[#706C66]">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-neutral-400 mb-2" />
        <span>Authenticating Admin Credentials & Live Orders Feed...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#C8A46B] font-semibold block font-label">
            ATELIER ADMIN PORTAL
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-luxury font-light uppercase tracking-wider text-neutral-900">
            ORDER & CLIENT MANAGEMENT
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/coupons"
            className="bg-amber-700 text-white text-xs font-label uppercase tracking-widest px-4 py-3 font-semibold rounded-2xl flex items-center space-x-1.5 shadow-md hover:bg-amber-800 transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>COUPONS</span>
          </Link>
          <Link
            href="/admin/cms"
            className="bg-[#1A1A1A] text-[#E6D5C3] text-xs font-label uppercase tracking-widest px-4 py-3 font-semibold rounded-2xl flex items-center space-x-1.5 shadow-md"
          >
            <Sliders className="w-4 h-4" />
            <span>HOMEPAGE CMS</span>
          </Link>
          <Link
            href="/admin/products"
            className="bg-black text-white text-xs font-label uppercase tracking-widest px-4 py-3 font-semibold rounded-2xl flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-label">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-luxury-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Sales Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-serif-luxury font-bold text-neutral-900">₹{totalRevenue.toFixed(2)}</p>
          <p className="text-[11px] text-emerald-700 font-medium">Real-Time Supabase Feed</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-luxury-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-black" />
          </div>
          <p className="text-3xl font-serif-luxury font-bold text-neutral-900">{ordersCount}</p>
          <p className="text-[11px] text-neutral-500 font-medium">Live Order Tracking</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-luxury-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Active Products</span>
            <Package className="w-4 h-4 text-black" />
          </div>
          <p className="text-3xl font-serif-luxury font-bold text-neutral-900">{productsCount}</p>
          <p className="text-[11px] text-neutral-500 font-medium">Couture catalog items</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-luxury-xs space-y-2">
          <div className="flex justify-between items-center text-xs text-neutral-400 font-semibold uppercase tracking-wider">
            <span>Registered VIP Clients</span>
            <Users className="w-4 h-4 text-black" />
          </div>
          <p className="text-3xl font-serif-luxury font-bold text-neutral-900">{dbProfilesCount}</p>
          <p className="text-[11px] text-emerald-700 font-medium">Supabase Auth Members</p>
        </div>
      </div>

      {/* Main Order Management Section */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 space-y-6 shadow-luxury-xs font-label">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
          <div>
            <h2 className="text-lg font-serif-luxury uppercase tracking-wider font-semibold text-neutral-900">
              CLIENT ORDERS FEED ({filteredOrders.length})
            </h2>
            <p className="text-xs text-neutral-500 font-sans mt-0.5">
              Filter by order number, payment status, or workflow state.
            </p>
          </div>

          {/* Search & Filter Inputs */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search order, name, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#FAF8F5] text-xs pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-sans"
              />
            </div>

            {/* Workflow Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-[#FAF8F5] text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 font-label uppercase font-semibold"
            >
              <option value="All">Status: All</option>
              {ORDER_STATUSES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* Payment Filter */}
            <select
              value={selectedPaymentFilter}
              onChange={(e) => setSelectedPaymentFilter(e.target.value)}
              className="bg-[#FAF8F5] text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 font-label uppercase font-semibold"
            >
              <option value="All">Payment: All</option>
              {PAYMENT_STATUSES.filter((p) => p !== "All").map((pm) => (
                <option key={pm} value={pm}>{pm}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                <th className="py-3 px-2">Order #</th>
                <th className="py-3 px-2">Silhouettes</th>
                <th className="py-3 px-2">Client Details</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Total Amount</th>
                <th className="py-3 px-2">Payment Status</th>
                <th className="py-3 px-2">Workflow Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-neutral-400 font-label uppercase tracking-widest">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-4 px-2 font-mono font-bold text-neutral-900">{ord.orderNumber}</td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-1.5 overflow-hidden">
                        {ord.items && ord.items.length > 0 ? (
                          ord.items.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="relative w-8 h-10 bg-neutral-100 rounded-md overflow-hidden shrink-0 border border-neutral-200 shadow-luxury-xs"
                              title={`${item.productName} (${item.size})`}
                            >
                              <Image
                                src={item.productImage || "/images/product-dress-front.jpg"}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))
                        ) : (
                          <div className="relative w-8 h-10 bg-neutral-100 rounded-md overflow-hidden shrink-0 border border-neutral-200">
                            <Image
                              src="/images/product-dress-front.jpg"
                              alt="Product Thumbnail"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        {ord.items && ord.items.length > 3 && (
                          <span className="text-[10px] font-label font-bold text-neutral-400">+{ord.items.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <p className="font-semibold text-neutral-900">{ord.shippingAddress.fullName}</p>
                      <p className="text-[11px] text-neutral-500">{ord.shippingAddress.email || ord.shippingAddress.phone}</p>
                    </td>
                    <td className="py-4 px-2 text-neutral-500 font-label">{ord.date}</td>
                    <td className="py-4 px-2 font-bold font-label text-neutral-900">₹{Number(ord.total).toFixed(2)}</td>
                    <td className="py-4 px-2">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-label font-bold uppercase ${
                          (ord as any).paymentStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-900"
                            : (ord as any).paymentStatus === "Cancelled"
                            ? "bg-red-100 text-red-900"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {(ord as any).paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      {/* Interactive Workflow Status Dropdown */}
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        disabled={isUpdatingStatus}
                        className="bg-white text-xs px-3 py-1.5 rounded-xl border border-neutral-200 font-label uppercase font-semibold focus:outline-none focus:border-black"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="bg-black text-white px-3.5 py-1.5 rounded-xl text-[11px] font-label uppercase font-semibold hover:bg-[#C8A46B] transition-colors inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl font-sans relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-neutral-200 pb-4 font-label space-y-1">
              <span className="text-[10px] text-[#C8A46B] uppercase tracking-[0.25em] font-semibold block">
                HAUTE COUTURE ORDER RECEIPT
              </span>
              <h2 className="text-2xl font-serif-luxury uppercase tracking-wider font-light text-neutral-900">
                ORDER #{selectedOrder.orderNumber}
              </h2>
              <p className="text-xs text-neutral-500">Placed on {selectedOrder.date}</p>
            </div>

            {/* Workflow Status Bar Timeline */}
            <div className="space-y-2 font-label">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-semibold">
                WORKFLOW STATUS TIMELINE
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {ORDER_STATUSES.map((st) => {
                  const isActive = selectedOrder.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                        isActive
                          ? "bg-black text-white shadow-md scale-105"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client & Address Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF8F5] p-5 rounded-2xl border border-neutral-200/60 font-label text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">Client Contact</span>
                <p className="font-bold text-neutral-900 mt-1">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-neutral-600">{selectedOrder.shippingAddress.email || "No email"}</p>
                <p className="text-neutral-600">{selectedOrder.shippingAddress.phone || "No phone"}</p>
              </div>

              <div>
                <span className="text-[10px] text-neutral-400 uppercase block font-bold">Shipping Destination</span>
                <p className="font-semibold text-neutral-900 mt-1">
                  {selectedOrder.shippingAddress.addressLine1}
                  {selectedOrder.shippingAddress.addressLine2 ? `, ${selectedOrder.shippingAddress.addressLine2}` : ""}
                </p>
                <p className="text-neutral-600">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                </p>
                <p className="text-neutral-600">{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 font-label text-xs space-y-2">
              <span className="text-[10px] text-neutral-400 uppercase block font-bold">Payment Information</span>
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <span className="text-neutral-500">Method: </span>
                  <span className="font-bold text-neutral-900">{selectedOrder.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Payment Status: </span>
                  <span className="font-bold text-emerald-700 uppercase">{(selectedOrder as any).paymentStatus || "Pending"}</span>
                </div>
                {selectedOrder.paymentId && (
                  <div>
                    <span className="text-neutral-500">Razorpay Payment ID: </span>
                    <span className="font-mono font-bold text-neutral-900">{selectedOrder.paymentId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Purchased Products */}
            <div className="space-y-3 font-label">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
                PURCHASED SILHOUETTES ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-neutral-100 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center space-x-4">
                    <div className="relative w-12 h-16 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                      <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-neutral-900 uppercase">{item.productName}</p>
                      <p className="text-neutral-500">Color: {item.color} | Size: {item.size} | Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-xs font-label">
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs font-label">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Discount:</span>
                  <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping & GST Tax:</span>
                <span>₹{(selectedOrder.shipping + (selectedOrder.tax || 0)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-neutral-900 border-t border-neutral-100 pt-2 font-serif-luxury">
                <span>Total Amount Paid:</span>
                <span>₹{selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Placeholders & Controls */}
            <div className="pt-4 border-t border-neutral-200 flex flex-wrap gap-3 justify-between font-label">
              <div className="flex items-center space-x-2">
                {/* Print Invoice Placeholder */}
                <button
                  onClick={() => window.print()}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Invoice</span>
                </button>

                {/* Refund Status Placeholder */}
                <span className="bg-neutral-100 text-neutral-700 px-3 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Refund: N/A</span>
                </span>
              </div>

              {/* Cancel Order Trigger */}
              {selectedOrder.status !== "Cancelled" && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  disabled={isUpdatingStatus}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
