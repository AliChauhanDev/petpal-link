# PetLink - Complete Project Documentation

## Project Overview

**PetLink** is a comprehensive pet management and lost-found portal designed to help pet owners register pets, report lost/found incidents, and search for pets within a community. The platform leverages modern web technologies to provide a seamless, responsive, and feature-rich experience.

---

## Table of Contents

1. [Project Information](#project-information)
2. [Technology Stack](#technology-stack)
3. [Libraries & Dependencies](#libraries--dependencies)
4. [Features & Functionality](#features--functionality)
5. [Database Schema](#database-schema)
6. [Security Implementation](#security-implementation)
7. [Future Enhancements](#future-enhancements)

---

## Project Information

| Attribute | Value |
|-----------|-------|
| **Project Name** | PetLink |
| **Version** | 1.0.0 |
| **Type** | Full-Stack Web Application |
| **Platform** | Web (Desktop & Mobile Responsive) |
| **Backend** | Lovable Cloud (Supabase) |
| **Deployment** | Lovable Hosting |

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | Core UI library for building component-based user interfaces |
| **TypeScript** | 5.x | Type-safe JavaScript for better code quality and developer experience |
| **Vite** | 5.x | Next-generation frontend build tool with fast HMR |
| **Tailwind CSS** | 3.x | Utility-first CSS framework for rapid UI development |

#### Why These Technologies?

- **React**: Industry-standard library with excellent ecosystem, virtual DOM for performance, and component reusability
- **TypeScript**: Catches errors at compile time, improves code documentation, and enhances IDE support
- **Vite**: Significantly faster build times compared to webpack, native ES modules support
- **Tailwind CSS**: Rapid prototyping, consistent design system, smaller bundle size with purging

### Backend Technologies

| Technology | Purpose |
|------------|---------|
| **Supabase (via Lovable Cloud)** | PostgreSQL database, authentication, storage, and realtime subscriptions |
| **Row Level Security (RLS)** | Database-level security policies |
| **PostgreSQL Functions** | Server-side logic for matching algorithm |
| **Realtime Subscriptions** | Live updates for notifications and chat |

#### Why Supabase?

- Open-source Firebase alternative with PostgreSQL
- Built-in authentication with multiple providers
- Real-time database subscriptions
- File storage with CDN
- Row Level Security for data protection
- Generous free tier for development

---

## Libraries & Dependencies

### UI Components & Styling

| Library | Version | Purpose | Advantages |
|---------|---------|---------|------------|
| **shadcn/ui** | Latest | Pre-built accessible React components | Customizable, accessible, modern design |
| **Radix UI** | Various | Headless UI primitives | Accessible by default, unstyled for customization |
| **Lucide React** | 0.462.0 | Icon library | Consistent icons, tree-shakeable, customizable |
| **tailwindcss-animate** | 1.0.7 | Animation utilities | Smooth, performant CSS animations |
| **class-variance-authority** | 0.7.1 | Variant management | Type-safe component variants |
| **clsx** | 2.1.1 | Class name utilities | Conditional class names |
| **tailwind-merge** | 2.6.0 | Tailwind class merging | Prevents conflicting Tailwind classes |

### State Management & Data Fetching

| Library | Version | Purpose | Advantages |
|---------|---------|---------|------------|
| **@tanstack/react-query** | 5.83.0 | Server state management | Caching, background updates, optimistic updates |
| **@supabase/supabase-js** | 2.86.0 | Supabase client | Type-safe database queries, realtime |

### Forms & Validation

| Library | Version | Purpose | Advantages |
|---------|---------|---------|------------|
| **react-hook-form** | 7.61.1 | Form state management | Minimal re-renders, easy validation |
| **zod** | 3.25.76 | Schema validation | TypeScript-first, composable schemas |
| **@hookform/resolvers** | 3.10.0 | Form validation integration | Connects zod with react-hook-form |

### Routing & Navigation

| Library | Version | Purpose | Advantages |
|---------|---------|---------|------------|
| **react-router-dom** | 6.30.1 | Client-side routing | Declarative routing, nested routes |

### Date & Time

| Library | Version | Purpose | Advantages |
|---------|---------|---------|------------|
| **date-fns** | 3.6.0 | Date utilities | Modular, tree-shakeable, immutable |
| **react-day-picker** | 8.10.1 | Date picker component | Accessible, customizable |

### Additional Features

| Library | Version | Purpose | Advantages |
|---------|---------|---------|------------|
| **qrcode.react** | 4.0.1 | QR code generation | SVG-based, customizable |
| **mapbox-gl** | 3.8.0 | Interactive maps | High-performance, customizable |
| **sonner** | 1.7.4 | Toast notifications | Beautiful, accessible toasts |
| **recharts** | 2.15.4 | Data visualization | React-native charts, responsive |
| **vaul** | 0.9.9 | Drawer component | Mobile-friendly bottom sheets |
| **embla-carousel-react** | 8.6.0 | Carousel/slider | Touch-friendly, performant |

---

## Features & Functionality

### 1. User Authentication & Profiles
- Email/password registration and login
- Secure session management
- User profile management (name, phone, address, avatar)
- Protected routes for authenticated users

### 2. Pet Management
- Register pets with detailed information
- Upload pet photos
- Edit pet details
- Mark pets as lost
- View pet QR codes for quick identification
- Image gallery with multiple photos

### 3. Lost Pet Reporting
- Create detailed lost pet reports
- Include last seen location and date
- Add contact information
- Set reward amount
- Upload pet photos
- Track report status

### 4. Found Pet Reporting
- Report found pets
- Include found location and date
- Add description and photos
- Contact finder functionality

### 5. Pet Matching System (AI-Powered)
- Automatic matching of lost and found reports
- Match scoring based on:
  - Pet type (50% weight)
  - Location similarity (30% weight)
  - Date proximity (20% weight)
- Real-time notifications for potential matches

### 6. Notifications System
- In-app notifications
- Real-time updates via WebSocket
- Notification types: matches, alerts, info
- Mark as read functionality
- Bell icon with unread count

### 7. Map Integration
- Interactive map view of lost/found pets
- Filter by report type
- Click markers for details
- Visual location-based search
- Mapbox integration

### 8. Social Sharing
- Share lost pet reports on social media
- Facebook, Twitter, WhatsApp sharing
- Copy link functionality
- Native share API support

### 9. Community Chat
- Direct messaging between users
- Real-time message delivery
- Conversation history
- Unread message indicators

### 10. Admin Panel
- View all reports and users
- Moderate report status
- Delete inappropriate content
- Platform statistics dashboard
- Role-based access control

### 11. Search & Filter
- Search pets by name, breed, description
- Filter by pet type
- Sort by date or relevance
- Search history tracking

### 12. Sample Data Manager
- Insert demo data for testing
- Clear user data
- Pre-populated pets and reports

### 13. Pet QR Codes
- Generate unique QR codes for pets
- Download as PNG
- Print functionality
- Quick identification via scan

---

## Database Schema

### Tables

#### `profiles`
Stores user profile information.
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `full_name` (TEXT)
- `phone` (TEXT)
- `address` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `pets`
Stores registered pet information.
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `name` (TEXT)
- `pet_type` (ENUM)
- `breed` (TEXT)
- `age` (TEXT)
- `color` (TEXT)
- `gender` (TEXT)
- `description` (TEXT)
- `image_url` (TEXT)
- `is_lost` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `lost_reports`
Stores lost pet reports.
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `pet_name` (TEXT)
- `pet_type` (ENUM)
- `description` (TEXT)
- `last_seen_location` (TEXT)
- `last_seen_date` (DATE)
- `contact_phone` (TEXT)
- `contact_email` (TEXT)
- `reward` (TEXT)
- `image_url` (TEXT)
- `status` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `found_reports`
Stores found pet reports.
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `pet_name` (TEXT)
- `pet_type` (ENUM)
- `description` (TEXT)
- `found_location` (TEXT)
- `found_date` (DATE)
- `contact_phone` (TEXT)
- `contact_email` (TEXT)
- `image_url` (TEXT)
- `status` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `pet_matches`
Stores automatic pet matches.
- `id` (UUID, PK)
- `lost_report_id` (UUID, FK)
- `found_report_id` (UUID, FK)
- `match_score` (INTEGER)
- `status` (TEXT)
- `created_at` (TIMESTAMP)

#### `notifications`
Stores user notifications.
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `title` (TEXT)
- `message` (TEXT)
- `type` (TEXT)
- `read` (BOOLEAN)
- `link` (TEXT)
- `created_at` (TIMESTAMP)

#### `messages`
Stores chat messages.
- `id` (UUID, PK)
- `sender_id` (UUID, FK → auth.users)
- `receiver_id` (UUID, FK → auth.users)
- `content` (TEXT)
- `read` (BOOLEAN)
- `created_at` (TIMESTAMP)

#### `user_roles`
Stores user roles for admin access.
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `role` (ENUM: admin, moderator, user)
- `created_at` (TIMESTAMP)

#### `search_history`
Stores user search history.
- `id` (UUID, PK)
- `user_id` (UUID, FK → auth.users)
- `search_query` (TEXT)
- `filters` (JSONB)
- `created_at` (TIMESTAMP)

#### `pet_images`
Stores multiple images per pet.
- `id` (UUID, PK)
- `pet_id` (UUID, FK)
- `lost_report_id` (UUID, FK)
- `found_report_id` (UUID, FK)
- `image_url` (TEXT)
- `is_primary` (BOOLEAN)
- `created_at` (TIMESTAMP)

---

## Security Implementation

### Row Level Security (RLS)
All tables have RLS enabled with specific policies:

- **Profiles**: Users can view all, update only own
- **Pets**: Users can CRUD own pets, view all
- **Reports**: Anyone can view active reports, users manage own
- **Messages**: Users can only access own conversations
- **Notifications**: Users can only access own notifications
- **User Roles**: Admin-only management

### Authentication
- Secure email/password authentication
- Session management with auto-refresh
- Protected routes for authenticated content

### Admin Access
- Role-based access control
- Security definer functions
- Admin-only routes and actions

---

## Future Enhancements

1. **Email Notifications** - Send email alerts for matches
2. **Push Notifications** - Browser push notifications
3. **Advanced Matching** - Machine learning for image matching
4. **Geolocation** - Automatic location detection
5. **Multi-language Support** - i18n implementation
6. **Mobile App** - React Native version
7. **Verified Users** - Identity verification system
8. **Analytics Dashboard** - Usage statistics
9. **Social Login** - Google, Facebook authentication
10. **Pet Microchip Integration** - Registry lookup

---

## Contact & Support

For support or inquiries about PetLink, please contact the development team through the platform's support channels.

---

*Documentation last updated: November 2024*
*Version: 1.0.0*
