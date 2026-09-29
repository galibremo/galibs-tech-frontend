"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkoutSchema,
  type CheckoutSchemaType,
} from "@/features/checkout/schemas/checkout-schema";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  ShoppingBag01Icon,
  DeliveryTruck01Icon,
  Store01Icon,
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
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import { checkoutOrder } from "@/features/orders/actions/orders.actions";

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
  const { items, subtotal, clearCart } = useCart();

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<CheckoutSchemaType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      upazilaThana: "",
      district: "Dhaka - City",
      mobile: "",
      email: "",
      comment: "",
      paymentMethod: "COD",
      deliveryMethod: "HOME",
      agreedToTerms: true,
    },
  });

  const deliveryMethod = watch("deliveryMethod");

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

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

  const handleConfirmOrder = async (values: CheckoutSchemaType) => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Format phone number for libphonenumber-js backend validator
    let formattedPhone = values.mobile.trim();
    if (formattedPhone.startsWith("0")) {
      formattedPhone = `+88${formattedPhone}`;
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = `+880${formattedPhone}`;
    }

    try {
      const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`;

      // Call backend checkout endpoint in a single request
      const order = await checkoutOrder({
        shippingAddress: {
          fullName,
          phone: formattedPhone,
          email: values.email.trim(),
          addressLine1: values.address.trim(),
          city: values.upazilaThana.trim(),
          district: values.district.trim(),
        },
        paymentMethod: values.paymentMethod as "COD" | "BKASH",
        notes: values.comment?.trim() || undefined,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });

      toast.success(`Order #${order.orderNumber} placed successfully!`);
      clearCart({ skipBackend: true });
      router.push(route.public.orderDetails(order.id));
    } catch (err: any) {
      toast.error(err.message || "Failed to place order. Please try again.");
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
          <form
            onSubmit={handleSubmit(handleConfirmOrder)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            noValidate
          >
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping & Billing Section */}
              <div className="bg-card border border-border/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                  <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <HugeiconsIcon
                      icon={Invoice01Icon}
                      className="w-5 h-5 text-orange-600"
                    />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Shipping & Billing
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field className="space-y-1.5">
                        <FieldLabel
                          htmlFor="firstName"
                          className="text-xs font-semibold text-foreground flex items-center gap-1"
                        >
                          First Name<span className="text-red-500">*</span>
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            {...field}
                            id="firstName"
                            placeholder="First Name*"
                            className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                          />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />

                  {/* Last Name */}
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field className="space-y-1.5">
                        <FieldLabel
                          htmlFor="lastName"
                          className="text-xs font-semibold text-foreground flex items-center gap-1"
                        >
                          Last Name<span className="text-red-500">*</span>
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            {...field}
                            id="lastName"
                            placeholder="Last Name*"
                            className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                          />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />

                  {/* Address */}
                  <div className="sm:col-span-2">
                    <Controller
                      name="address"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field className="space-y-1.5">
                          <FieldLabel
                            htmlFor="address"
                            className="text-xs font-semibold text-foreground flex items-center gap-1"
                          >
                            Address<span className="text-red-500">*</span>
                          </FieldLabel>
                          <FieldContent>
                            <Input
                              {...field}
                              id="address"
                              placeholder="Address*"
                              className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                            />
                            <FieldError>{fieldState.error?.message}</FieldError>
                          </FieldContent>
                        </Field>
                      )}
                    />
                  </div>

                  {/* Upazila / Thana */}
                  <Controller
                    name="upazilaThana"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field className="space-y-1.5">
                        <FieldLabel
                          htmlFor="upazilaThana"
                          className="text-xs font-semibold text-foreground flex items-center gap-1"
                        >
                          Upazila/Thana<span className="text-red-500">*</span>
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            {...field}
                            id="upazilaThana"
                            placeholder="Upazila/Thana*"
                            className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                          />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />

                  {/* District */}
                  <Controller
                    name="district"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field className="space-y-1.5">
                        <FieldLabel
                          htmlFor="district"
                          className="text-xs font-semibold text-foreground"
                        >
                          District
                        </FieldLabel>
                        <FieldContent>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="bg-background border-border/80 h-10! text-sm w-full">
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
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />

                  {/* Mobile */}
                  <Controller
                    name="mobile"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field className="space-y-1.5">
                        <FieldLabel
                          htmlFor="mobile"
                          className="text-xs font-semibold text-foreground flex items-center gap-1"
                        >
                          Mobile<span className="text-red-500">*</span>
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            {...field}
                            type="tel"
                            id="mobile"
                            placeholder="Telephone*"
                            className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                          />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />

                  {/* Email */}
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field className="space-y-1.5">
                        <FieldLabel
                          htmlFor="email"
                          className="text-xs font-semibold text-foreground flex items-center gap-1"
                        >
                          Email<span className="text-red-500">*</span>
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            {...field}
                            type="email"
                            id="email"
                            placeholder="E-Mail*"
                            className="bg-background border-border/80 h-10 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                          />
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />

                  {/* Comment */}
                  <div className="sm:col-span-2">
                    <Controller
                      name="comment"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field className="space-y-1.5">
                          <FieldLabel
                            htmlFor="comment"
                            className="text-xs font-semibold text-foreground"
                          >
                            Comment
                          </FieldLabel>
                          <FieldContent>
                            <Textarea
                              {...field}
                              id="comment"
                              placeholder="Any special requirement/instruction for us?"
                              rows={3}
                              className="bg-background border-border/80 text-sm resize-none focus-visible:ring-1 focus-visible:ring-primary"
                            />
                            <FieldError>{fieldState.error?.message}</FieldError>
                          </FieldContent>
                        </Field>
                      )}
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
                      <HugeiconsIcon
                        icon={CreditCardIcon}
                        className="w-5 h-5 text-orange-600"
                      />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Payment Method
                    </h2>
                  </div>

                  <p className="text-xs text-muted-foreground font-medium">
                    Select a payment method
                  </p>

                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field className="space-y-2.5">
                        <FieldContent>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2.5"
                          >
                            {/* Cash on Delivery (Active) */}
                            <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                              <RadioGroupItem value="COD" />
                              <span className="text-xs sm:text-sm font-semibold text-foreground">
                                Cash on Delivery
                              </span>
                            </label>

                            {/* Online Payment (Displayed & Disabled) */}
                            <label className="flex items-center justify-between p-2.5 rounded-lg border border-border/40 bg-muted/30 cursor-not-allowed opacity-60">
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value="ONLINE" disabled />
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
                                <RadioGroupItem value="POS" disabled />
                                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                  POS on Delivery
                                </span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                Unavailable
                              </span>
                            </label>
                          </RadioGroup>
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />

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
                      <HugeiconsIcon
                        icon={DeliveryTruck01Icon}
                        className="w-5 h-5 text-orange-600"
                      />
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-foreground">
                      Delivery Method
                    </h2>
                  </div>

                  <p className="text-xs text-muted-foreground font-medium">
                    Select a delivery method
                  </p>

                  <Controller
                    name="deliveryMethod"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field className="space-y-2.5">
                        <FieldContent>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2.5"
                          >
                            {/* Home Delivery - 200৳ */}
                            <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                              <RadioGroupItem value="HOME" />
                              <span className="text-xs sm:text-sm font-semibold text-foreground">
                                Home Delivery - 200৳
                              </span>
                            </label>

                            {/* Store Pickup - 0৳ */}
                            <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                              <RadioGroupItem value="PICKUP" />
                              <span className="text-xs sm:text-sm font-semibold text-foreground">
                                Store Pickup - 0৳
                              </span>
                            </label>

                            {/* Request Express - 450৳ */}
                            <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background cursor-pointer hover:border-primary/50 transition-colors">
                              <RadioGroupItem value="EXPRESS" />
                              <span className="text-xs sm:text-sm font-semibold text-foreground">
                                Request Express - 450৳
                              </span>
                            </label>
                          </RadioGroup>
                          <FieldError>{fieldState.error?.message}</FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>
              </div>

              {/* Products Card Section */}
              <div className="bg-card border border-border/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                  <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-600">
                    <HugeiconsIcon
                      icon={Store01Icon}
                      className="w-5 h-5 text-orange-600"
                    />
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
            <div className="lg:col-span-4 sticky top-34 z-10 h-max">
              <div className="bg-card border border-border/80 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                  <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-600">
                    <HugeiconsIcon
                      icon={Invoice01Icon}
                      className="w-5 h-5 text-orange-600"
                    />
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Order Summary
                  </h2>
                </div>

                {/* Promo / Coupon Box */}
                <div className="p-4 rounded-xl border border-dashed border-border/80 bg-muted/20 space-y-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground">
                      Get Some Extra
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Apply your promo/coupon code below
                    </p>
                  </div>

                  {/* Promo Input & Apply */}
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="text"
                      placeholder="Promo / Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="bg-background border-border/80 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    <Button
                      type="button"
                      onClick={handleApplyCoupon}
                      variant="secondary"
                      className="h-8.5 px-3 text-xs font-semibold cursor-pointer shrink-0"
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
                <Controller
                  name="agreedToTerms"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          className="mt-1 w-4 h-4 text-primary accent-primary rounded cursor-pointer"
                        />
                        <label
                          htmlFor="terms"
                          className="text-xs text-foreground leading-snug cursor-pointer select-none"
                        >
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
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </div>
                  )}
                />

                {/* Confirm Order Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#3B49DF] hover:bg-[#323ECA] text-white font-bold text-sm cursor-pointer shadow-sm rounded-lg transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon
                        icon={Loading01Icon}
                        className="w-4 h-4 animate-spin"
                      />
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
