# Culinary Odyssey - Catering Management System

## Description

Culinary Odyssey is a modern, full-stack catering management system built with Next.js that enables customers to browse menus, place orders, and manage their catering needs seamlessly. The platform provides an intuitive interface for discovering meal plans, managing shopping carts, and tracking orders with real-time status updates.

## Long Description

Culinary Odyssey is a comprehensive catering management platform designed to streamline the entire catering experience from menu discovery to order fulfillment. Built using Next.js 14 with TypeScript, the application offers a robust and scalable solution for both customers and catering businesses. The system features a sophisticated authentication mechanism with OTP-based email verification, ensuring secure user registration and login processes. Users can explore an extensive catalog of meal plans through an intuitive search interface with debounced queries for optimal performance. The shopping cart functionality supports item selection, quantity management, and selective checkout, allowing customers to choose specific items from their cart. Order management is handled through a dedicated orders page where users can view order history, track order status, process payments, and cancel pending orders. The platform also includes customer profile management, password reset capabilities, and a responsive design that works seamlessly across desktop and mobile devices. With a modern UI built using Radix UI components and Tailwind CSS, the application delivers a polished user experience while maintaining clean, maintainable code architecture.

## Features

- User authentication with OTP-based email verification
- Password reset functionality with OTP verification
- Menu browsing with real-time search and categorized meal plans
- Shopping cart with quantity management and item selection
- Order placement from selected cart items
- Order history with detailed tracking and status updates
- Payment processing and order management
- Responsive design optimized for all devices

## Challenges

- Managing application state across multiple components (authentication, cart, orders) required a centralized solution to prevent prop drilling and maintain consistency
- Ensuring cart data synchronization between client-side state and backend API across different user sessions
- Implementing secure authentication with OTP verification, password reset, and session management while maintaining smooth user experience
- Providing real-time feedback for user actions without full page refreshes to avoid unresponsive user experience
- Creating a consistent and functional UI across various device sizes while maintaining design integrity and usability

## Solution

The project addressed these challenges through a comprehensive technical approach. Zustand was implemented for centralized state management, creating stores for authentication, cart, and orders with automatic localStorage persistence. A hybrid cart management system was developed to synchronize client-side state with backend APIs while providing offline resilience through fallback mechanisms. The authentication flow was built using modular Next.js API routes with separate endpoints for registration, OTP generation, and password reset, integrated with Nodemailer for email delivery. Optimistic UI updates with debounced search queries, loading states, and toast notifications provide immediate user feedback. A mobile-first responsive design was achieved using Tailwind CSS with flexible layouts that adapt to all screen sizes. Additionally, Formik with Yup schemas handled form validation, Radix UI components ensured accessibility, RESTful API architecture enabled scalability, and TypeScript provided type safety throughout the application.
