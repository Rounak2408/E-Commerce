# E‑Commerce Dashboard (React Interview Task)

Authentication‑based e‑commerce dashboard built with **React + Vite**, **React Router**, and **Tailwind CSS**, using only **public APIs and browser storage** (no custom backend), as per the assignment PDF.

## Features

- **Public landing page**
  - Snitch‑style home page with hero section, category filters (Men, Women, Accessories, Tech), search, and demo products from Fake Store API.
  - Prices converted from USD to **INR** and formatted as Indian currency.
  - Login button and dark/light mode toggle.

- **Auth & session (no backend)**
  - Registration and login using **localStorage** (`ecom_user`, `ecom_session`).
  - 5‑minute, time‑bound session with countdown timer in the dashboard navbar.
  - All `/app/*` routes are fully protected with `ProtectedRoute`.

- **Dashboard**
  - Welcome overview card with quick actions (Browse products, View cart, Edit profile).
  - Top navbar with avatar initial, session timer, dark/light toggle, and hamburger menu on mobile.
  - Mobile‑friendly layout: navigation + logout + theme toggle via hamburger.

- **Products**
  - Products loaded from **Fake Store API**.
  - Category chips, search, and sort (Featured, Price Low–High, High–Low).
  - Modern card layout with hover animations and INR prices.
  - Add‑to‑cart button with success toast notification.

- **Cart**
  - Local cart managed via `CartContext` + localStorage (`ecom_cart`).
  - Increase/decrease quantity, remove items, clear cart.
  - Order summary with INR totals.
  - Checkout opens a thank‑you modal, simulates savings (20–30%), clears cart, and records a demo order.

- **Profile & orders**
  - Profile page to view/update name, email, and password (stored in localStorage).
  - Demo orders persisted per user email (`ecom_orders`) and summarized on the dashboard Overview (“Recent order” card).

- **Dark / Light mode**
  - Theme stored in `localStorage` (`ecom_theme`) and applied via Tailwind `dark` class.
  - Toggle available on:
    - Landing page navbar.
    - Dashboard header (desktop).
    - Dashboard hamburger menu (mobile).

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS
- **State & storage:** React Context + localStorage (auth, cart, theme, orders)
- **API:** [Fake Store API](https://fakestoreapi.com/)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

- `src/App.tsx` – Routes and top‑level providers.
- `src/main.tsx` – React entry point.
- `src/auth/*` – Auth context, layout, login/register pages, route protection.
- `src/dashboard/*` – Dashboard shell (navbar, layout) and overview page.
- `src/landing/HomePage.tsx` – Public marketing / products landing page.
- `src/products/ProductsPage.tsx` – Protected products listing + filters.
- `src/cart/*` – Cart context and cart page with checkout modal.
- `src/profile/ProfilePage.tsx` – User profile view/edit.
- `src/orders/orderStorage.ts` – Order persistence per user.
- `src/theme/ThemeContext.tsx` – Dark/light mode management.
- `src/utils/currency.ts` – USD→INR conversion and formatting.

## Deployment

Build for production:

```bash
npm run build
```

The `dist` folder can be deployed to any static host (e.g. **Vercel**, **Netlify**). Use the default Vite React template settings; no special configuration is required besides setting the build output as the deploy directory.

