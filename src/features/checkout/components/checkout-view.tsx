"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  ShoppingBag01Icon,
  DeliveryTruck01Icon,
  Store01Icon,
  DiscountTag01Icon,
  ArrowRight01Icon,
  Loading01Icon,
  Invoice01Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";

import { useCart } from "@/context/cart-context";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { route } from "@/routes/routes";
import { toast } from "sonner";
import { checkoutOrder } from "@/features/orders/api/orders-api";

const BANGLADESH_DISTRICTS = [
  "Dhaka - City",
  "Dhaka - Outside City",
  "Chattogram",
  "Gazipur",
  "Narayanganj",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Bogura",
  "Jessore",
  "Cox's Bazar",
];

export default function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, clearCart, syncCartWithBackend } = useCart();

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [upazilaThana, setUpazilaThana] = useState("");
  const [district, setDistrict] = useState("Dhaka - City");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  // Options
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE" | "POS">("COD");
  const [deliveryMethod, setDeliveryMethod] = useState<"HOME" | "PICKUP" | "EXPRESS">("HOME");
  
  // Coupon
  const [activeTab, setActiveTab] = useState<"coupon" | "voucher">("coupon");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Agreement & Submitting state
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery fee calculation
  const deliveryFee =
    deliveryMethod === "HOME" ? 200 : deliveryMethod === "EXPRESS" ? 450 : 0;

  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }
    if (couponCode.toUpperCase() === "DISCOUNT10") {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      toast.success("Coupon applied! 10% discount added.");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your First and Last Name");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter your Address");
      return;
    }

    if (!upazilaThana.trim()) {
      toast.error("Please enter your Upazila/Thana");
      return;
    }

    if (!mobile.trim()) {
      toast.error("Please enter your Mobile Number");
      return;
    }

    if (!email.trim()) {
      toast.error("Please enter your Email address");
      return;
    }

    if (!agreedToTerms) {
      toast.error("You must agree to the Terms & Conditions to place an order");
      return;
    }

    // Format phone number for libphonenumber-js backend validator
    let formattedPhone = mobile.trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = `+88${formattedPhone}`;
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+880${formattedPhone}`;
    }

    setIsSubmitting(true);
    try {
      // First ensure cart is synced to backend database
      await syncCartWithBackend();

      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      // Call backend checkout endpoint
      const order = await checkoutOrder({
        shippingAddress: {
          fullName,
          phone: formattedPhone,
          email: email.trim(),
          addressLine1: address.trim(),
          city: upazilaThana.trim(),
          district: district.trim(),
        },
        paymentMethod: "COD", // Active backend method
        notes: comment.trim() || undefined,
      });

      toast.success(`Order #${order.orderNumber} placed successfully!`);
      clearCart();
      router.push(route.public.orderDetails(order.id));
    } catch (err: any) {
      console.error("Order error:", err);
      toast.error(err.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 sm:py-8 bg-[#F2F4F8] dark:bg-background/95 min-h-screen text-foreground">
      <Container className="px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={route.public.home}
                  className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
                >
                  <HugeiconsIcon icon={Home01Icon} size={14} />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground text-xs sm:text-sm">
                Checkout
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Heading */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground mb-6">
          Checkout
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-border bg-card shadow-xs my-6">
            <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4">
              <HugeiconsIcon icon={ShoppingBag01Icon} className="w-10 h-10" />
            </div>
            <h2 className="text-lg font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Add items to your cart before proceeding to checkout.
            </p>
            <Button asChild size="default" className="cursor-pointer gap-2">
              <Link href={route.public.home}>
                Continue Shopping
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping & Billing Section */}
              <div className="bg-card border border-border/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                  <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <HugeiconsIcon icon={Invoice01Icon} className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Shipping & Billing
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="First Name*"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Last Name*"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      Address<span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Address*"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Upazila / Thana */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      Upazila/Thana<span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Upazila/Thana*"
                      value={upazilaThana}
                      onChange={(e) => setUpazilaThana(e.target.value)}
                      required
                      className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* District */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      District
                    </label>
                    <Select value={district} onValueChange={setDistrict}>
                      <SelectTrigger className="bg-background border-border/80 h-10 text-sm w-full">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {BANGLADESH_DISTRICTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      Mobile<span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      placeholder="Telephone*"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      required
                      className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="E-Mail*"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>

                  {/* Comment */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Comment
                    </label>
                    <Textarea
                      placeholder="Any special requirement/instruction for us?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="bg-background border-border/80 text-sm resize-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method & Delivery Method Section Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Method */}
                <div className="bg-card border border-border/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                    <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-600">
                      <HugeiconsIcon icon={CreditCardIcon} className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Payment Method
                    </h2>
                  </div>

                  <p className="text-xs text-muted-foreground font-medium">
                    Select a payment method
                  </p>

                  <div className="space-y-2.5">
                    {/* Cash on Delivery (Active) */}
                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="w-4 h-4 text-primary accent-primary cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        Cash on Delivery
                      </span>
                    </label>

                    {/* Online Payment (Displayed & Disabled) */}
                    <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/30 cursor-not-allowed opacity-60">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="ONLINE"
                          disabled
                          checked={paymentMethod === "ONLINE"}
                          className="w-4 h-4 cursor-not-allowed"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                          Online Payment
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        Unavailable
                      </span>
                    </label>

                    {/* POS on Delivery (Displayed & Disabled) */}
                    <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/30 cursor-not-allowed opacity-60">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="POS"
                          disabled
                          checked={paymentMethod === "POS"}
                          className="w-4 h-4 cursor-not-allowed"
                        />
                        <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                          POS on Delivery
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        Unavailable
                      </span>
                    </label>
                  </div>

                  {/* Payment Badges Logos */}
                  <div className="pt-3 border-t border-border/60 space-y-2">
                    <span className="text-[11px] font-semibold text-muted-foreground block">
                      We Accept :
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="px-2 py-1 rounded bg-muted/80 text-[10px] font-bold text-foreground border border-border/60">
                        CASH ON DELIVERY
                      </span>
                      <span className="px-2 py-1 rounded bg-blue-600 text-white text-[10px] font-bold shadow-2xs">
                        VISA
                      </span>
                      <span className="px-2 py-1 rounded bg-pink-600 text-white text-[10px] font-bold shadow-2xs">
                        bKash
                      </span>
                      <span className="px-2 py-1 rounded bg-orange-600 text-white text-[10px] font-bold shadow-2xs">
                        Nagad
                      </span>
                      <span className="px-2 py-1 rounded bg-amber-500 text-white text-[10px] font-bold shadow-2xs">
                        upay
                      </span>
                      <span className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold shadow-2xs">
                        TakaPay
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="bg-card border border-border/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                    <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-600">
                      <HugeiconsIcon icon={DeliveryTruck01Icon} className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Delivery Method
                    </h2>
                  </div>

                  <p className="text-xs text-muted-foreground font-medium">
                    Select a delivery method
                  </p>

                  <div className="space-y-2.5">
                    {/* Home Delivery - 200৳ */}
                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="HOME"
                        checked={deliveryMethod === "HOME"}
                        onChange={() => setDeliveryMethod("HOME")}
                        className="w-4 h-4 text-primary accent-primary cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        Home Delivery - 200৳
                      </span>
                    </label>

                    {/* Store Pickup - 0৳ */}
                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="PICKUP"
                        checked={deliveryMethod === "PICKUP"}
                        onChange={() => setDeliveryMethod("PICKUP")}
                        className="w-4 h-4 text-primary accent-primary cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        Store Pickup - 0৳
                      </span>
                    </label>

                    {/* Request Express - 450৳ */}
                    <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="EXPRESS"
                        checked={deliveryMethod === "EXPRESS"}
                        onChange={() => setDeliveryMethod("EXPRESS")}
                        className="w-4 h-4 text-primary accent-primary cursor-pointer"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        Request Express - 450৳
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Products Card Section */}
              <div className="bg-card border border-border/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                  <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-600">
                    <HugeiconsIcon icon={Store01Icon} className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Products
                  </h2>
                </div>

                <div className="divide-y divide-border/60">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.thumbnailUrl && (
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0 border border-border/40">
                            <Image
                              src={item.thumbnailUrl}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="text-xs sm:text-sm font-semibold text-foreground line-clamp-2">
                          <span className="font-bold text-primary mr-1.5">
                            {item.quantity} X
                          </span>
                          {item.name}
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm font-bold text-foreground whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString()}৳
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-card border border-border/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-5 sticky top-20">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                  <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-600">
                    <HugeiconsIcon icon={Invoice01Icon} className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Order Summary
                  </h2>
                </div>

                {/* Get Some Extra / Promo Box */}
                <div className="p-4 rounded-xl border border-dashed border-border/80 bg-muted/20 space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground">
                      Get Some Extra
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Use coupon/voucher/star points
                    </p>
                  </div>

                  {/* Toggle Tabs */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("coupon")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        activeTab === "coupon"
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      <HugeiconsIcon icon={DiscountTag01Icon} className="w-3.5 h-3.5 inline mr-1" />
                      Coupon
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("voucher")}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        activeTab === "voucher"
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      Gift Voucher
                    </button>
                  </div>

                  {/* Promo Input & Apply */}
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="text"
                      placeholder="Promo / Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-background h-9 text-xs uppercase"
                    />
                    <Button
                      type="button"
                      onClick={handleApplyCoupon}
                      variant="secondary"
                      className="h-9 px-3 text-xs font-semibold cursor-pointer shrink-0"
                    >
                      Apply
                    </Button>
                  </div>

                  {discountAmount > 0 && (
                    <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      Discount Applied: -{discountAmount.toLocaleString()}৳
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-xs sm:text-sm border-b border-border/60 pb-4">
                  <div className="flex justify-between items-center text-muted-foreground font-medium">
                    <span>Sub-Total:</span>
                    <span className="font-bold text-foreground">
                      {subtotal.toLocaleString()}৳
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-medium">
                      <span>Discount:</span>
                      <span className="font-bold">
                        -{discountAmount.toLocaleString()}৳
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-muted-foreground font-medium">
                    <span>
                      {deliveryMethod === "HOME"
                        ? "Home Delivery:"
                        : deliveryMethod === "EXPRESS"
                        ? "Express Delivery:"
                        : "Store Pickup:"}
                    </span>
                    <span className="font-bold text-foreground">
                      {deliveryFee}৳
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground">
                      Total:
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-[#D9381E]">
                      {total.toLocaleString()}৳
                    </span>
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary accent-primary rounded cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-foreground leading-snug cursor-pointer select-none">
                    I have read and agree to the{" "}
                    <span className="text-[#D9381E] font-semibold hover:underline">
                      Terms and Conditions
                    </span>
                    ,{" "}
                    <span className="text-[#D9381E] font-semibold hover:underline">
                      Privacy Policy
                    </span>{" "}
                    and{" "}
                    <span className="text-[#D9381E] font-semibold hover:underline">
                      Refund and Return Policy
                    </span>
                  </label>
                </div>

                {/* Confirm Order Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#3B49DF] hover:bg-[#323ECA] text-white font-bold text-sm cursor-pointer shadow-sm rounded-lg transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Loading01Icon} className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </div>
                  ) : (
                    "Confirm Order"
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Container>
    </div>
  );
}
