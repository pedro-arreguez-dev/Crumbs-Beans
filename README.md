# ☕ Crumbs & Beans - Premium Coffee Shop Application

> A beautifully crafted, full-stack E-Commerce web application built to deliver a seamless and visually stunning coffee ordering experience.

## 🚀 Project Overview

**Crumbs & Beans** is a modern Single Page Application (SPA) showcasing best-in-class frontend architecture and serverless backend integration. Engineered with the latest **Angular 19** features such as Standalone Components, built-in Control Flow, and reactive Signals, the application acts as a fast, robust, and highly scalable e-commerce platform.

This project was built to demonstrate proficiency in connecting a complex functional UI with a robust real-time database, managing complex asynchronous application state, and delivering a pixel-perfect, premium user experience.

---

## ✨ Core Features

*   **Premium Glassmorphic UI:** A deeply customized, mobile-responsive interface utilizing CSS Custom Properties and advanced SCSS nesting. Featuring custom dropdowns, floating labels, and dynamic sticky layouts.
*   **Reactive State Management:** Global shopping cart and user session state actively managed with **Angular Signals** for jitter-free, instantaneous UI updates across completely disconnected components.
*   **Secure Authentication:** End-to-end user registration and login workflows securely integrated with **Supabase Auth**.
*   **Dynamic Checkout Flow:** Full order tracking lifecycle, from filtering the menu (by category and dietary preferences like Vegan) to dynamic cart calculations (subtotals, discounts) and generating persistent Order History records.
*   **Robust Routing:** Seamless logical flow leveraging Angular Router for deep-linking, preventing hard reloads to preserve delicate user session states.

---

## 🛠️ Technology Stack

**Frontend Architecture:**
*   **Framework:** Angular (19)
*   **Reactivity:** Angular Signals (`signal`, `computed`, `effect`)
*   **Styling:** SCSS + Bootstrap (Grid system & baseline utilities only, heavily customized)
*   **Architecture:** Feature-based modular structure (Core Services, Shared Components, Features)

**Backend Integration:**
*   **Platform:** Supabase (BaaS)
*   **Database:** PostgreSQL (Products, Orders, Order Items relational schema)
*   **Authentication:** Supabase GoTrue Auth API

---

## 🔮 Future Roadmap

Development on Crumbs & Beans is actively evolving. The immediate next phase of implementation involves expanding the platform's managerial capabilities:

*   **🔒 Secure Admin Panel:** An expansive back-office interface designed for store managers to update product availability, track active orders, and adjust pricing.
*   **🛡️ Angular Router Guards:** Implementation of strong Role-Based Access Control (RBAC) via `CanActivate` Route Guards, ensuring the Admin Panel is strictly inaccessible to unauthorized customers.