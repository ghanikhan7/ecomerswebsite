# ABAYA ATTIRE OFFICIAL — Haute Modesty & Timeless Luxury
### Designed & Engineered by AlisTech • Luxury E-Commerce Division

A bespoke, international haute-couture modest fashion e-commerce storefront and comprehensive Admin CMS built with React 19, TypeScript, Vite, Tailwind CSS v4, and Lucide React.

---

## 1. Project Overview & Brand Direction

- **Brand:** ABAYA ATTIRE OFFICIAL
- **Engineering Partner:** AlisTech
- **Aesthetic Inspiration:** High-end modest fashion editorial, luxury boutique shopping (Net-A-Porter, The Modist, Buka, Louella, Haute Elan).
- **Core Philosophy:** Elevating traditional Gulf silhouette heritage (Dubai Nida, Medina silk, French bullion wire zardozi) into contemporary architectural couture.
- **Architectural Archetype:** Headless, highly reusable white-label e-commerce architecture configured via centralized brand files, persistent with LocalStorage and ready for full backend integration.

---

## 2. Visual Design System

- **Warm Ivory:** `#F8F6F1` (Canvas & primary background)
- **Deep Black:** `#171614` (Editorial typography & luxury dark accents)
- **Champagne Gold:** `#B69A70` (Accents, badges, highlights, and borders)
- **Soft Beige:** `#E8DFD2` (Subtle secondary contrast & cards)
- **Pure White:** `#FFFFFF` (Product presentation surfaces)
- **Editorial Typography:**
  - *Headings:* `Cormorant Garamond` (Weights: 300, 400, 500, 600, 700, Italic)
  - *Interface & Commerce:* `Inter` (Weights: 300, 400, 500, 600, 700)

---

## 3. Architecture & Project Structure

```
src/
  types/
    index.ts                 # Strongly-typed data models (Products, Orders, Matrix, Brand, Cart)
  config/
    brandConfig.ts           # Centralized brand & client configuration (AlisTech reusable starter)
  data/
    initialProducts.ts       # Curated luxury collection covering all 8 specified abaya categories
    initialOrders.ts         # Realistic sample orders with customer & tracking data
  context/
    storeContextInstance.ts  # Isolated React Context definition
    useStore.ts              # Custom hook with complete error checking
    StoreContext.tsx         # Global provider with LocalStorage synchronization
  utils/
    formatters.ts            # Currency (INR ₹), dates, discounts, and order IDs
  components/
    common/
      AnnouncementBar.tsx    # Luxury broadcast bar with quick admin & currency indicators
      Navbar.tsx             # Editorial sticky navigation, collections mega-menu, search, bag, mobile drawer
      Footer.tsx             # Brand manifesto, category links, client care, VIP circle, AlisTech credits
      StorefrontLayout.tsx   # Global master layout for customer storefront
      CartDrawer.tsx         # Slide-over shopping bag with complimentary shipping meter & checkout CTA
      QuickViewModal.tsx     # Instant product preview, gallery, size/color selectors, and quick-add
      SizeGuideModal.tsx     # Comprehensive modest fashion height & length measurement chart (50"-60")
      SearchModal.tsx        # Live instantaneous search with query chips & category suggestions
      Toast.tsx              # Unobtrusive luxury toast notification
      Breadcrumbs.tsx        # Minimalist navigational hierarchy
      Icons.tsx              # Custom SVG icons (e.g. Instagram)
      ScrollToTop.tsx        # Automatic route scroll reset
    product/
      ProductCard.tsx        # Image hover flip, wishlist toggle, quick-view, and color dots
      ProductGrid.tsx        # Responsive layout with 2, 3, 4 column switches
      ProductFilters.tsx     # Category, price range, color palette, and garment length filters
    checkout/
      RazorpayModal.tsx      # Simulated Razorpay test gateway (UPI, Cards, NetBanking, test sandbox)
    admin/
      AdminLayout.tsx        # Haute couture dark admin layout with responsive navigation & status bar
  pages/
    storefront/
      HomePage.tsx           # Grand editorial hero, brand pillars, categories, new arrivals, lookbook, reviews
      ShopPage.tsx           # Complete catalogue with multi-column views, live filtering, and sorting
      ProductDetailPage.tsx  # Multi-angle gallery, color/size matrix, dynamic stock, care & fabric accordions
      CartPage.tsx           # Dedicated bag review, keepsake gift wrapping, atelier notes, breakdown
      CheckoutPage.tsx       # 3-step checkout with coupon code (LUXURY10), delivery speed, and payment options
      OrderSuccessPage.tsx   # Order confirmation, tracking trajectory timeline, and printable receipt
      WishlistPage.tsx       # Private curation wishlist grid with quick-bag transfer
      AboutPage.tsx          # The House chronicle, Modest Manifesto, textile mastery, AlisTech credits
      ContactPage.tsx        # Atelier coordinates, VIP WhatsApp concierge desk, message form, FAQs
      PoliciesPage.tsx       # Shipping, Returns & Exchanges, Privacy, and Terms documentation
    admin/
      AdminLoginPage.tsx     # Editorial login with one-click demo credentials autofill
      AdminDashboardPage.tsx # Sales KPIs (today, week, month, year), order influx, inventory, sales charts
      AdminProductsPage.tsx  # Product catalogue table, add new creation, edit modal, publish/draft toggle
      AdminInventoryPage.tsx # Matrix stock management (Colorway × Length Dimension live counts)
      AdminOrdersPage.tsx    # Full order lifecycle, status transition, Airway Bill tracking assignment
      AdminReportsPage.tsx   # Daily, weekly, monthly, yearly analytics, AOV, and conversion rates
      AdminSettingsPage.tsx  # Store configuration, logo, rates, free shipping threshold, demo reset
```

---

## 4. Product Categories (Covered in Full)

1. **Everyday Abayas** (e.g. *The Medina Daily Crepe Abaya*)
2. **Premium Abayas** (e.g. *The Empress Pleated Dubai Nida Abaya*)
3. **Front Open Abayas** (e.g. *Al-Noor Front Open Crepe Abaya*)
4. **Double Shrug Abayas** (e.g. *Rawdah Double Shrug Cape Abaya*)
5. **Kimono Abayas** (e.g. *Sovereign Silk Kimono Abaya*)
6. **Kaftans** (e.g. *Imperial Moroccan Silk Kaftan*)
7. **Khimars** (e.g. *Al-Amira Cascading Silk Khimar Set*)
8. **Embroidered Abayas** (e.g. *The Royal Zahra Embroidered Abaya*)

---

## 5. Key Frontend Features

### Customer Storefront
- **High-Resolution Fashion Photography:** Curated modest fashion editorial imagery with smooth dual-image hover transitions.
- **Dynamic Inventory Sizing:** Real-time feedback for combinations (e.g. *"Only 2 pieces remain in Noir Onyx (Size 56\")"*).
- **Atelier Sizing Guide:** Comprehensive height-to-abaya length mapping (50" to 60") with guidance on heel heights and bespoke adjustments.
- **Cart & Slideover Drawer:** Real-time calculation of progress towards Complimentary Worldwide Shipping (Free over ₹5,000).
- **Checkout Experience:**
  - One-page luxury layout with contact info and address validation.
  - Coupon Code support (`LUXURY10` gives 10% off; `FIRST1000` gives ₹1,000 off).
  - Transit method selection (Standard Insured vs. VIP Air Priority Express).
  - Payment simulation: **Razorpay Test Gateway Modal** (UPI, Cards, NetBanking test sandbox) & **Cash on Delivery (COD)**.
  - Automatic order generation with tracking trajectory.

### Admin CMS Portal (`/admin`)
- **Authentication:** Demo access (`admin@abayaattire.com` / `luxury2026`) with one-click prefill.
- **Dashboard Overview:** Displays Sales Today, This Week, This Month, This Year, Total Orders, Active Silhouettes, Low Stock items, and weekly SVG volume charts.
- **Product Management:** Add new silhouettes, edit pricing, descriptions, images, manage sizes/colors, toggle Published/Draft status, and delete items.
- **Color & Size Inventory Matrix:** Separate stock counters per colorway and length dimension (e.g. Black 52", 54", 56", 58", 60"). Updating any quantity immediately reflects in storefront availability!
- **Order Management:** View all placed orders, inspect line items, assign airway bill tracking numbers, and update fulfillment states (*Pending -> Confirmed -> Processing -> Shipped -> Delivered*).
- **Reports & Analytics:** Switch between Daily, Weekly, Monthly, and Yearly sales breakdowns, conversion rates, and category distribution.
- **Settings & Rebranding:** Modify brand name, tagline, announcement broadcast, support WhatsApp, free shipping threshold, and tax rate, or reset back to default luxury demo state.

---

## 6. How to Run the Application

### Development Mode
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```
Builds the optimized production assets in `dist/` with full TypeScript verification (`tsc -b && vite build`).

### Linting Check
```bash
npm run lint
```
Runs ESLint with strict React 19 rules and type checking.

---

## 7. Reusability Guide for Future AlisTech Clients

To white-label this starter for a different luxury client:
1. Open [`src/config/brandConfig.ts`](file:///c:/Users/ADMIN/OneDrive/Desktop/Alistech%20E%20commers%20wesbite/src/config/brandConfig.ts).
2. Update:
   - `brandName`, `shortName`, `tagline`, and `logoText`
   - `currency` (Currency code, symbol, locale)
   - `contact` coordinates (Email, Phone, WhatsApp, Address, Studio Hours)
   - `categories` list with custom hero images and descriptions
   - `shipping` rates and free shipping threshold
3. The entire storefront and admin CMS will dynamically adapt without touching component markup.

---

## 8. Backend & Production Integration Readiness

This frontend architecture is organized to seamlessly connect with:
- **Node.js & Express / NestJS:** Replace LocalStorage actions in `useStore` with REST / GraphQL API endpoints.
- **PostgreSQL & Prisma:** Mirror the data interfaces in [`src/types/index.ts`](file:///c:/Users/ADMIN/OneDrive/Desktop/Alistech%20E%20commers%20wesbite/src/types/index.ts) directly into your Prisma schema.
- **Razorpay Production Gateway:** Replace [`src/components/checkout/RazorpayModal.tsx`](file:///c:/Users/ADMIN/OneDrive/Desktop/Alistech%20E%20commers%20wesbite/src/components/checkout/RazorpayModal.tsx) with the official `Razorpay` checkout script (`checkout.razorpay.com/v1/checkout.js`) and server-side webhook signature verification.

---
*Architected & Crafted with pride by AlisTech — Luxury E-Commerce Solutions.*
