# PizzaHub Client

> **Live Application**: [https://pizzahub-client-shahil.vercel.app](https://pizzahub-client-shahil.vercel.app)

PizzaHub is an online pizza marketplace where independent kitchens can showcase their artisanal pies, manage incoming orders, and grow their food business, while customers can discover nearby stone-baked pizzas, customize delivery schedules, and track their meals from the oven to their door.

This repository contains the frontend application, built with Next.js 16, React 19, and Tailwind CSS. It communicates with a standalone Express backend to handle menu browsing, user authentication, customer orders, vendor kitchen dashboards, and administrator moderation.

---

## What You Can Do with PizzaHub

PizzaHub is organized around three distinct user roles, each with its own workflow and interface.

### Customers
- **Explore menus**: Browse artisan pizzas by category, dietary preference, or restaurant location.
- **Search, filter, and sort**: Find pizzas using real-time keyword search, filter by category or location, and sort results by price or newest arrivals.
- **Inspect details**: Open individual pizza pages with high-resolution image galleries, spice indicators, ingredient descriptions, and allergen tags.
- **Order pizzas**: Place orders directly from the pizza details page or assemble multiple items in a floating cart drawer, specifying delivery dates and drop-off addresses.
- **Track order status**: Follow order progress through a visual timeline that updates as the kitchen moves an order from pending to accepted, in the oven, out for delivery, and delivered.
- **Cancel orders**: Cancel pending orders before the kitchen starts preparation.
- **Reviews and favorites**: Leave star ratings and written reviews on pizzas you have ordered, and bookmark favorites to your personal wishlist.

### Vendors
- **Restaurant profile**: Configure restaurant details, business name, and kitchen contact information.
- **Menu management**: Publish new pizza offerings with descriptions, pricing, location tags, and uploaded food photography.
- **Order fulfillment**: Review incoming customer orders in a dedicated kitchen dashboard, with options to accept or reject pending requests.
- **Kitchen limits and upgrades**: Start on a free tier supporting up to three active menu items, or upgrade to a Premium vendor subscription for unlimited active listings and priority placement on the homepage.
- **Order history and metrics**: Track active orders, past order volume, and customer review feedback.

### Administrators
- **User management**: Search and filter registered accounts across customer, vendor, and administrator roles, with the ability to suspend or unblock accounts.
- **Menu moderation**: Review newly submitted pizza items from vendors before they go live in the public catalog.
- **Subscription oversight**: View platform-wide transaction history and active vendor subscription records.
- **Platform analytics**: Monitor overall platform volume, including total user signups, order activity, and revenue statistics.

---

## Features Worth Exploring

### URL-Synchronized Menu Discovery
The menu catalog keeps all active search queries, selected categories, location filters, and sort options synchronized directly with URL search parameters. Sharing a link preserves the exact filtered view, and navigating with browser back and forward buttons retains your filter state without unnecessary page reloads.

### Role-Based Dashboard Shells
Each role has a purpose-built workspace:
- **Customer Dashboard**: Displays order history, delivery status steppers, and saved favorite items.
- **Vendor Kitchen**: Highlights pending orders needing immediate decisions, listing controls for menu items, and plan tier status.
- **Admin Backoffice**: Provides moderation queues for pending recipes, account status controls, and transaction audit logs.

### Pizza Details and Interactive Gallery
Individual menu item pages combine practical ordering details with a clean visual layout:
- Multi-image galleries with thumbnail navigation.
- Dietary tags, spice level indicators, and chef notes.
- Customer review list showing average ratings, individual feedback, and verified buyer badges.
- Direct-order modal with date validation ensuring delivery dates cannot be set in the past.

### Shopping Cart and Batch Ordering
Customers can add multiple pizzas from different kitchens into a slide-over cart drawer. When checking out, the client submits the batch order to the server, creating individual order records for each vendor while collecting delivery details in a single step.

### Theme Support
The interface supports both dark and light modes, using Tailwind CSS design tokens and smooth transitions across navigation, card borders, modals, and charts.

### Resilient States and Feedback
Every interactive surface includes dedicated states for loading skeletons, friendly empty states with descriptive guidance, error boundaries with retry buttons, and toast notifications via Sonner for order confirmations and setting updates.

---

## How the Client Works

The frontend runs as a Next.js App Router application that operates independently from the Express backend service.

### Authentication and Session Management
Authentication is powered by Better Auth on the frontend, supporting both email/password credentials and Google OAuth. The client maintains user sessions through HTTP-only cookies and communicates with a local authentication endpoint to retrieve short-lived JSON Web Tokens (JWTs).

### API Communication
All client-to-server requests go through an `apiFetch` utility. When a user is authenticated, the client automatically requests a fresh token and includes it in the `Authorization: Bearer <token>` header sent to the Express backend. The backend cryptographically verifies this token before processing any protected actions.

### Route Protection
Route access is enforced at the edge using Next.js proxy middleware (`proxy.ts`). Requests to `/dashboard/*`, `/profile/*`, `/payment/*`, and individual pizza order pages require an active session token. If no session is present, the middleware redirects the user to the sign-in page with a `callbackUrl` parameter so they return to their intended destination after logging in.

### Dynamic Role Routing
When users sign in, the application checks their assigned role (`customer`, `vendor`, or `admin`) and routes them directly to their corresponding dashboard view, ensuring clean separation between customer activities and kitchen operations.

---

## Technology

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Component Primitives**: Radix UI
- **Authentication**: Better Auth
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form, Zod
- **Charts**: Recharts
- **Notifications**: Sonner

---

## Related Links

- **Live Application**: [https://pizzahub-client-shahil.vercel.app](https://pizzahub-client-shahil.vercel.app)
- **Live API Endpoint**: [https://pizzahub-server-shahil.vercel.app](https://pizzahub-server-shahil.vercel.app)
- **Client Repository**: [https://github.com/srpranto/pizzahub-client](https://github.com/srpranto/pizzahub-client)
- **Server Repository**: [https://github.com/srpranto/pizzahub-server](https://github.com/srpranto/pizzahub-server)
