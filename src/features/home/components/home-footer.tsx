"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/custom-ui/container";
import Logo from "@/components/custom-ui/logo";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  Call02Icon,
  Location01Icon,
  Facebook02Icon,
  TwitterIcon,
  InstagramIcon,
  Linkedin02Icon,
  GithubIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";

export default function HomeFooter() {
  return (
    <footer className="w-full bg-muted/30 border-t border-border/40 dark:border-border/80 transition-colors duration-200">
      {/* Main Footer Links */}
      <div className="py-12">
        <Container>
          <div className="px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Column 1: Brand & Contact Info */}
            <div className="lg:col-span-4 space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground pr-4 leading-relaxed">
                Your ultimate destination for cutting-edge electronics, high-performance PC components, gadgets, and tech gear.
              </p>

              <ul className="space-y-2.5 text-sm text-muted-foreground pt-2">
                <li className="flex items-start gap-2.5">
                  <HugeiconsIcon icon={Location01Icon} className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>123 Tech Avenue, Silicon Valley, CA 94025</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <HugeiconsIcon icon={Call02Icon} className="w-4 h-4 text-primary shrink-0" />
                  <a href="tel:+18001234567" className="hover:text-foreground transition-colors">
                    +1 (800) 123-4567
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <HugeiconsIcon icon={Mail01Icon} className="w-4 h-4 text-primary shrink-0" />
                  <a href="mailto:support@galibs.tech" className="hover:text-foreground transition-colors">
                    support@galibs.tech
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Categories */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-sm font-semibold tracking-wider uppercase">Shop Categories</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/category/laptops-computers" className="text-muted-foreground hover:text-foreground transition-colors">
                    Laptops & Desktops
                  </Link>
                </li>
                <li>
                  <Link href="/category/smartphones-tablets" className="text-muted-foreground hover:text-foreground transition-colors">
                    Smartphones & Tablets
                  </Link>
                </li>
                <li>
                  <Link href="/category/pc-components" className="text-muted-foreground hover:text-foreground transition-colors">
                    PC Components & Hardware
                  </Link>
                </li>
                <li>
                  <Link href="/category/audio-wearables" className="text-muted-foreground hover:text-foreground transition-colors">
                    Audio & Wearables
                  </Link>
                </li>
                <li>
                  <Link href="/category/gaming-gear" className="text-muted-foreground hover:text-foreground transition-colors">
                    Gaming Gear & Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/category/networking" className="text-muted-foreground hover:text-foreground transition-colors">
                    Networking & Storage
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Customer Care */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-semibold tracking-wider uppercase">Customer Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/order-status" className="text-muted-foreground hover:text-foreground transition-colors">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/shipping-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/returns-refunds" className="text-muted-foreground hover:text-foreground transition-colors">
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link href="/warranty-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Warranty Information
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQs & Help Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Company & Legal */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-sm font-semibold tracking-wider uppercase">Company Info</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About GALIB's
                  </Link>
                </li>
                <li>
                  <Link href="/store-locations" className="text-muted-foreground hover:text-foreground transition-colors">
                    Store Locations
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Copyright & Social Bar */}
      <div className="border-t border-border/40 dark:border-border/80 py-6 bg-background/40">
        <Container>
          <div className="px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} GALIB's. All rights reserved. Built with passion for tech enthusiasts.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full hover:bg-muted"
              >
                <HugeiconsIcon icon={Facebook02Icon} className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full hover:bg-muted"
              >
                <HugeiconsIcon icon={TwitterIcon} className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full hover:bg-muted"
              >
                <HugeiconsIcon icon={InstagramIcon} className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full hover:bg-muted"
              >
                <HugeiconsIcon icon={Linkedin02Icon} className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full hover:bg-muted"
              >
                <HugeiconsIcon icon={YoutubeIcon} className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full hover:bg-muted"
              >
                <HugeiconsIcon icon={GithubIcon} className="w-4 h-4" />
              </a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
