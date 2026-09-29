"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  PrinterIcon,
  Home01Icon,
  ArrowRight01Icon,
  Loading01Icon,
  DeliveryTruck01Icon,
} from "@hugeicons/core-free-icons";
import { Container } from "@/components/custom-ui/container";
import { Button } from "@/components/ui/button";
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

import { useOrderDetails } from "../actions/orders.queries";

interface OrderDetailsViewProps {
  orderId: string;
}

export default function OrderDetailsView({ orderId }: OrderDetailsViewProps) {
  const { data, isLoading, error } = useOrderDetails(orderId);

  const order = data?.order || null;
  const invoice = data?.invoice || null;

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <HugeiconsIcon icon={Loading01Icon} className="w-8 h-8 text-primary animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <Container className="py-12 px-4 text-center">
        <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">{error?.message || "Could not locate this order."}</p>
        <Button asChild>
          <Link href={route.public.home}>Return Home</Link>
        </Button>
      </Container>
    );
  }

  return (
    <div className="py-6 sm:py-10 bg-muted/20 min-h-screen">
      <Container className="px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={route.public.home} className="flex items-center gap-1 font-medium">
                  <HugeiconsIcon icon={Home01Icon} size={14} />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Order #{order.orderNumber}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Success Banner */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-xs mb-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Thank You For Your Order!
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Your order <span className="font-bold text-foreground">#{order.orderNumber}</span> has been received and is being processed.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Status: {order.status}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
              Payment: {order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod} ({order.paymentStatus})
            </span>
          </div>

          {invoice && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="gap-2 cursor-pointer"
              >
                <HugeiconsIcon icon={PrinterIcon} className="w-4 h-4" />
                Print Invoice ({invoice.invoiceNumber})
              </Button>
            </div>
          )}
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Address */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-2">
              Shipping Address
            </h2>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p className="font-bold text-foreground">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.district}
              </p>
              <p>Phone: <span className="font-medium text-foreground">{order.shippingAddress.phone}</span></p>
              <p>Email: <span className="font-medium text-foreground">{order.shippingAddress.email}</span></p>
            </div>
          </div>

          {/* Payment & Summary Info */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-foreground border-b border-border pb-2">
              Order Summary
            </h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal:</span>
                <span className="font-bold text-foreground">{order.subtotal.toLocaleString()}৳</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Fee:</span>
                <span className="font-bold text-foreground">{order.shippingFee.toLocaleString()}৳</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
                <span>Total Amount:</span>
                <span className="text-[#D9381E]">{order.total.toLocaleString()}৳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground border-b border-border pb-2">
            Order Items ({order.items.length})
          </h2>
          <div className="divide-y divide-border/60">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-sm">
                <div>
                  <div className="font-bold text-foreground">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Qty: {item.quantity} x {item.unitPrice.toLocaleString()}৳ | SKU: {item.sku}
                  </div>
                </div>
                <div className="font-bold text-foreground whitespace-nowrap">
                  {item.lineTotal.toLocaleString()}৳
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 text-center">
          <Button asChild size="lg" className="cursor-pointer gap-2">
            <Link href={route.public.home}>
              Continue Shopping
              <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
