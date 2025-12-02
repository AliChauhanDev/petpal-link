# Software Requirements Specification (SRS)
# PetLink - Pet Management & Lost-Found Portal

**Document Version:** 1.0  
**Date:** December 2024  
**Project Name:** PetLink  
**Prepared By:** Development Team

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Specific Requirements](#3-specific-requirements)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [System Features](#5-system-features)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Use Case Diagrams](#7-use-case-diagrams)
8. [Data Requirements](#8-data-requirements)
9. [Appendices](#9-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete description of all the requirements for the PetLink application. It is intended for developers, testers, project managers, and stakeholders involved in the development and deployment of the system.

### 1.2 Scope

PetLink is a comprehensive web-based pet management and lost-found portal designed to:

- Enable pet owners to register and manage their pets
- Facilitate reporting of lost and found pets
- Provide automated matching between lost and found pet reports
- Enable community interaction through messaging and notifications
- Offer map-based search functionality for locating pets
- Generate QR codes for quick pet identification

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| SRS | Software Requirements Specification |
| RLS | Row Level Security |
| API | Application Programming Interface |
| UI | User Interface |
| UX | User Experience |
| CRUD | Create, Read, Update, Delete |
| JWT | JSON Web Token |
| QR Code | Quick Response Code |
| PWA | Progressive Web Application |

### 1.4 References

- IEEE 830-1998: Recommended Practice for Software Requirements Specifications
- React Documentation: https://react.dev/
- Supabase Documentation: https://supabase.com/docs
- Tailwind CSS Documentation: https://tailwindcss.com/docs

### 1.5 Overview

This document is organized into nine main sections covering introduction, overall description, specific requirements, external interfaces, system features, non-functional requirements, use case diagrams, data requirements, and appendices.

---

## 2. Overall Description

### 2.1 Product Perspective

PetLink is a standalone web application that operates as a community platform for pet management. It interfaces with:

- **Database System:** PostgreSQL via Lovable Cloud (Supabase)
- **Authentication System:** Built-in authentication with email and password
- **Storage System:** Cloud storage for pet images
- **Map Service:** Mapbox for location-based features

### 2.2 Product Functions

The major functions of PetLink include:

1. **User Management**
   - User registration with phone number
   - User authentication (login/logout)
   - Profile management

2. **Pet Management**
   - Add, edit, delete pets
   - Upload pet images
   - Generate pet QR codes

3. **Lost Pet Reporting**
   - Create lost pet reports
   - Specify last seen location and date
   - Add contact information and reward

4. **Found Pet Reporting**
   - Create found pet reports
   - Specify found location and date
   - Add contact information

5. **Pet Matching System**
   - Automated matching algorithm
   - Match score calculation
   - Match notifications

6. **Search & Discovery**
   - Filter by pet type
   - Search by location
   - Map-based visual search

7. **Communication**
   - In-app messaging
   - Real-time notifications
   - Social sharing

8. **Administration**
   - User management
   - Report moderation
   - System statistics

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Expertise |
|------------|-------------|---------------------|
| Pet Owner | Primary user who registers pets and reports lost/found pets | Low to Medium |
| Community Member | User who reports found pets and helps locate lost pets | Low to Medium |
| Administrator | System administrator with full access | Medium to High |
| Guest | Unauthenticated user with limited access | Low |

### 2.4 Operating Environment

- **Client Side:**
  - Modern web browsers (Chrome, Firefox, Safari, Edge)
  - Desktop and mobile devices
  - Minimum screen resolution: 320px width

- **Server Side:**
  - Lovable Cloud (Supabase) infrastructure
  - PostgreSQL database
  - Edge functions for serverless logic

### 2.5 Design and Implementation Constraints

1. Must be built using React and TypeScript
2. Must use Tailwind CSS for styling
3. Must integrate with Lovable Cloud for backend
4. Must support responsive design
5. Must implement Row Level Security (RLS)
6. Must follow accessibility guidelines (WCAG 2.1)

### 2.6 Assumptions and Dependencies

**Assumptions:**
- Users have access to modern web browsers
- Users have stable internet connectivity
- Users can provide valid email addresses
- Pet images are in standard formats (JPEG, PNG, WebP)

**Dependencies:**
- Lovable Cloud (Supabase) availability
- Mapbox API availability (for map features)
- Email service availability (for notifications)

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### FR-001: User Registration
- **Description:** System shall allow new users to register
- **Input:** Email, password, full name, phone number
- **Output:** User account created, profile generated
- **Priority:** High

#### FR-002: User Authentication
- **Description:** System shall authenticate users via email and password
- **Input:** Email, password
- **Output:** Session token, access granted
- **Priority:** High

#### FR-003: User Profile Management
- **Description:** System shall allow users to view and edit their profiles
- **Input:** Profile data (name, phone, address, avatar)
- **Output:** Updated profile
- **Priority:** Medium

#### FR-004: Pet Registration
- **Description:** System shall allow users to register their pets
- **Input:** Pet details (name, type, breed, age, color, gender, description, image)
- **Output:** Pet record created
- **Priority:** High

#### FR-005: Pet Editing
- **Description:** System shall allow users to edit their pet information
- **Input:** Updated pet details
- **Output:** Pet record updated
- **Priority:** High

#### FR-006: Pet Deletion
- **Description:** System shall allow users to delete their pets
- **Input:** Pet ID, confirmation
- **Output:** Pet record deleted
- **Priority:** Medium

#### FR-007: Lost Pet Report Creation
- **Description:** System shall allow users to report lost pets
- **Input:** Pet details, last seen location, date, contact info, reward
- **Output:** Lost report created, matching triggered
- **Priority:** High

#### FR-008: Found Pet Report Creation
- **Description:** System shall allow users to report found pets
- **Input:** Pet details, found location, date, contact info
- **Output:** Found report created, matching triggered
- **Priority:** High

#### FR-009: Automatic Pet Matching
- **Description:** System shall automatically match lost and found reports
- **Input:** New lost/found report
- **Output:** Match records with scores, notifications sent
- **Priority:** High

#### FR-010: Match Score Calculation
- **Description:** System shall calculate match scores based on criteria
- **Criteria:**
  - Pet type match: 50 points
  - Location similarity: 30 points
  - Date proximity (within 7 days): 20 points
- **Priority:** High

#### FR-011: Lost Pets Listing
- **Description:** System shall display all active lost pet reports
- **Input:** Filter criteria (optional)
- **Output:** List of lost pet reports
- **Priority:** High

#### FR-012: Found Pets Listing
- **Description:** System shall display all active found pet reports
- **Input:** Filter criteria (optional)
- **Output:** List of found pet reports
- **Priority:** High

#### FR-013: Pet Search
- **Description:** System shall provide search functionality
- **Input:** Search query, filters (pet type, location, date)
- **Output:** Filtered list of pets/reports
- **Priority:** Medium

#### FR-014: Map-Based Search
- **Description:** System shall display pets on an interactive map
- **Input:** Location coordinates, zoom level
- **Output:** Map with pet markers
- **Priority:** Medium

#### FR-015: QR Code Generation
- **Description:** System shall generate QR codes for registered pets
- **Input:** Pet ID
- **Output:** QR code image
- **Priority:** Medium

#### FR-016: Notification System
- **Description:** System shall send notifications for matches and messages
- **Input:** Event trigger (new match, message)
- **Output:** Notification created, displayed to user
- **Priority:** High

#### FR-017: In-App Messaging
- **Description:** System shall enable direct messaging between users
- **Input:** Message content, recipient ID
- **Output:** Message sent and received
- **Priority:** Medium

#### FR-018: Social Sharing
- **Description:** System shall enable sharing reports on social media
- **Input:** Report details, platform selection
- **Output:** Share link generated
- **Priority:** Low

#### FR-019: Admin User Management
- **Description:** Admins shall be able to manage user accounts
- **Input:** User ID, action (view, suspend, delete)
- **Output:** User account modified
- **Priority:** Medium

#### FR-020: Admin Report Moderation
- **Description:** Admins shall be able to moderate reports
- **Input:** Report ID, action (approve, reject, delete)
- **Output:** Report status updated
- **Priority:** Medium

#### FR-021: Auto-Create Lost Report
- **Description:** When marking a pet as lost, system shall auto-create lost report
- **Input:** Pet marked as lost via edit
- **Output:** Lost report created automatically
- **Priority:** High

### 3.2 Data Requirements

#### DR-001: User Data
- User ID (UUID, unique)
- Email (unique, validated)
- Password (hashed)
- Full Name
- Phone Number
- Avatar URL
- Address
- Created/Updated timestamps

#### DR-002: Pet Data
- Pet ID (UUID, unique)
- Owner User ID (foreign key)
- Name, Type, Breed, Age, Color, Gender
- Description
- Image URL
- Is Lost flag
- Created/Updated timestamps

#### DR-003: Lost Report Data
- Report ID (UUID, unique)
- User ID (foreign key)
- Pet ID (foreign key, optional)
- Pet Name, Type, Description
- Last Seen Location, Date
- Contact Phone, Email
- Reward amount
- Status (active/resolved)
- Image URL
- Created/Updated timestamps

#### DR-004: Found Report Data
- Report ID (UUID, unique)
- User ID (foreign key)
- Pet Name, Type, Description
- Found Location, Date
- Contact Phone, Email
- Status (active/resolved)
- Image URL
- Created/Updated timestamps

#### DR-005: Match Data
- Match ID (UUID, unique)
- Lost Report ID (foreign key)
- Found Report ID (foreign key)
- Match Score (0-100)
- Status (pending/confirmed/rejected)
- Created timestamp

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### UI-001: Landing Page
- Hero section with call-to-action
- Quick links to report lost/found pets
- Statistics display
- Recent lost/found pets preview

#### UI-002: Authentication Pages
- Login form (email, password)
- Registration form (email, password, full name, phone)
- Password visibility toggle
- Form validation feedback

#### UI-003: Dashboard
- User statistics (pets count, reports count)
- Recent notifications
- Quick action buttons
- Recent activity feed

#### UI-004: Pet Management Pages
- Pet listing with cards
- Add/Edit pet forms
- Pet detail view with QR code
- Delete confirmation dialog

#### UI-005: Lost/Found Report Pages
- Report listing with filters
- Report creation forms
- Report detail view
- Contact modal with copy functionality

#### UI-006: Map View
- Interactive map with markers
- Cluster markers for dense areas
- Popup cards for pet details
- Filter controls

#### UI-007: Profile Page
- Profile information display/edit
- Avatar upload
- Account settings

#### UI-008: Admin Panel
- User management table
- Report moderation interface
- System statistics dashboard

### 4.2 Hardware Interfaces

No specific hardware interfaces required. The application runs on standard computing devices with web browsers.

### 4.3 Software Interfaces

| Interface | Description | Protocol |
|-----------|-------------|----------|
| Supabase Database | PostgreSQL database operations | REST/GraphQL |
| Supabase Auth | User authentication | JWT |
| Supabase Storage | File storage for images | REST |
| Supabase Realtime | Real-time subscriptions | WebSocket |
| Mapbox API | Map rendering and geocoding | REST |

### 4.4 Communication Interfaces

- **HTTPS:** All client-server communication
- **WebSocket:** Real-time notifications and messages
- **REST API:** Database operations via Supabase client

---

## 5. System Features

### 5.1 Authentication System

**Description:** Secure user authentication and session management

**Stimulus/Response Sequences:**
1. User enters credentials → System validates → Session created
2. User clicks logout → Session destroyed → Redirect to home
3. Session expires → Auto-logout → Redirect to login

**Functional Requirements:**
- Email/password authentication
- Session persistence
- Auto-logout on inactivity
- Password strength validation

### 5.2 Pet Management System

**Description:** Complete CRUD operations for pet records

**Stimulus/Response Sequences:**
1. User adds pet → Form validation → Pet created → Success notification
2. User marks pet as lost → Auto-create lost report → Matching triggered
3. User deletes pet → Confirmation dialog → Pet removed

**Functional Requirements:**
- Image upload with preview
- Form validation with error messages
- QR code generation
- Automatic lost report creation

### 5.3 Lost-Found Matching System

**Description:** Automated matching algorithm for lost and found reports

**Stimulus/Response Sequences:**
1. New report created → Trigger function executes → Matches calculated
2. Match found → Notification created → Users notified
3. User views matches → Match list displayed with scores

**Functional Requirements:**
- Database trigger for automatic matching
- Multi-criteria scoring algorithm
- Notification generation
- Match status management

### 5.4 Notification System

**Description:** Real-time notification delivery

**Stimulus/Response Sequences:**
1. Match found → Notification created → Bell icon updates
2. User clicks notification → Redirect to relevant page
3. User marks as read → Notification status updated

**Functional Requirements:**
- Real-time notification count
- Mark as read functionality
- Notification grouping by type
- Link to relevant content

### 5.5 Messaging System

**Description:** Direct user-to-user communication

**Stimulus/Response Sequences:**
1. User sends message → Message stored → Recipient notified
2. Recipient opens chat → Messages loaded → Marked as read
3. New message arrives → Real-time update → UI refreshes

**Functional Requirements:**
- Real-time message delivery
- Read receipts
- Conversation history
- User presence indication

---

## 6. Non-Functional Requirements

### 6.1 Performance Requirements

| Requirement | Specification |
|-------------|---------------|
| Page Load Time | < 3 seconds on 3G |
| API Response Time | < 500ms for 95th percentile |
| Concurrent Users | Support 1000+ simultaneous users |
| Database Queries | < 100ms average response |
| Image Upload | Support files up to 10MB |

### 6.2 Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Authentication | JWT-based session tokens |
| Authorization | Row Level Security (RLS) policies |
| Data Encryption | HTTPS/TLS for all communications |
| Password Storage | Bcrypt hashing |
| Input Validation | Client and server-side validation |
| SQL Injection | Parameterized queries via ORM |
| XSS Prevention | React's built-in escaping |
| CSRF Protection | Token-based protection |

### 6.3 Reliability Requirements

- **Uptime:** 99.9% availability
- **Data Backup:** Daily automated backups
- **Recovery Time:** < 1 hour for critical failures
- **Error Handling:** Graceful degradation with user feedback

### 6.4 Availability Requirements

- 24/7 system availability
- Scheduled maintenance windows communicated in advance
- Automatic failover for critical services

### 6.5 Maintainability Requirements

- Modular component architecture
- Comprehensive code documentation
- TypeScript for type safety
- Consistent coding standards (ESLint)

### 6.6 Scalability Requirements

- Horizontal scaling support
- Database connection pooling
- CDN for static assets
- Lazy loading for images

### 6.7 Usability Requirements

- Responsive design (mobile-first)
- Accessibility compliance (WCAG 2.1 AA)
- Intuitive navigation
- Clear error messages
- Loading state indicators

---

## 7. Use Case Diagrams

### 7.1 Actors

| Actor | Description |
|-------|-------------|
| **Guest** | Unauthenticated user who can view public content |
| **Registered User** | Authenticated user with full access to features |
| **Pet Owner** | Registered user who has registered pets |
| **Admin** | Administrator with system management capabilities |
| **System** | Automated processes (matching, notifications) |

### 7.2 Use Case List

#### Guest Use Cases
| UC-ID | Use Case Name | Description |
|-------|---------------|-------------|
| UC-G01 | View Home Page | View landing page and statistics |
| UC-G02 | View Lost Pets | Browse lost pet reports |
| UC-G03 | View Found Pets | Browse found pet reports |
| UC-G04 | Register Account | Create new user account |
| UC-G05 | Login | Authenticate into system |
| UC-G06 | Search Pets | Search for pets by criteria |

#### Registered User Use Cases
| UC-ID | Use Case Name | Description |
|-------|---------------|-------------|
| UC-U01 | Manage Profile | View/edit profile information |
| UC-U02 | Add Pet | Register a new pet |
| UC-U03 | Edit Pet | Modify pet information |
| UC-U04 | Delete Pet | Remove a pet record |
| UC-U05 | View My Pets | List all owned pets |
| UC-U06 | Report Lost Pet | Create lost pet report |
| UC-U07 | Report Found Pet | Create found pet report |
| UC-U08 | View Matches | View potential pet matches |
| UC-U09 | Contact Owner | View contact information |
| UC-U10 | Send Message | Send direct message to user |
| UC-U11 | View Messages | Read conversations |
| UC-U12 | View Notifications | Check notifications |
| UC-U13 | Generate QR Code | Get QR code for pet |
| UC-U14 | Share Report | Share on social media |
| UC-U15 | View Map | Use map-based search |
| UC-U16 | Mark Pet as Lost | Update pet status to lost |
| UC-U17 | Logout | End session |

#### Admin Use Cases
| UC-ID | Use Case Name | Description |
|-------|---------------|-------------|
| UC-A01 | View All Users | List all registered users |
| UC-A02 | Manage User | Edit/suspend/delete user |
| UC-A03 | View All Reports | List all lost/found reports |
| UC-A04 | Moderate Report | Approve/reject/delete report |
| UC-A05 | View Statistics | System analytics dashboard |
| UC-A06 | Manage Roles | Assign user roles |

#### System Use Cases
| UC-ID | Use Case Name | Description |
|-------|---------------|-------------|
| UC-S01 | Match Pets | Auto-match lost and found |
| UC-S02 | Calculate Score | Compute match score |
| UC-S03 | Send Notification | Generate and deliver notification |
| UC-S04 | Create Profile | Auto-create profile on signup |

### 7.3 Use Case Diagram Description

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PetLink System                                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        <<subsystem>>                                  │   │
│  │                     User Management                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                   │   │
│  │  │  Register   │  │   Login     │  │   Logout    │                   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                   │   │
│  │  ┌─────────────┐                                                      │   │
│  │  │Manage Profile│                                                     │   │
│  │  └─────────────┘                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        <<subsystem>>                                  │   │
│  │                      Pet Management                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │   Add Pet   │  │  Edit Pet   │  │ Delete Pet  │  │View My Pets │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │  ┌─────────────┐  ┌─────────────┐                                    │   │
│  │  │Generate QR  │  │Mark as Lost │                                    │   │
│  │  └─────────────┘  └─────────────┘                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        <<subsystem>>                                  │   │
│  │                    Lost-Found Reporting                               │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │Report Lost  │  │Report Found │  │View Lost    │  │View Found   │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  │  ┌─────────────┐  ┌─────────────┐                                    │   │
│  │  │View Matches │  │Contact Owner│                                    │   │
│  │  └─────────────┘  └─────────────┘                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        <<subsystem>>                                  │   │
│  │                      Communication                                    │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                   │   │
│  │  │Send Message │  │View Messages│  │   Notify    │                   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                   │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        <<subsystem>>                                  │   │
│  │                      Administration                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │Manage Users │  │Mod. Reports │  │View Stats   │  │Manage Roles │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

Actors:
┌─────────┐    ┌──────────────┐    ┌───────────┐    ┌─────────┐    ┌────────┐
│  Guest  │    │Registered    │    │ Pet Owner │    │  Admin  │    │ System │
│         │    │    User      │    │           │    │         │    │        │
└─────────┘    └──────────────┘    └───────────┘    └─────────┘    └────────┘
```

### 7.4 Use Case Relationships

#### Include Relationships (<<include>>)
| Base Use Case | Included Use Case |
|---------------|-------------------|
| Report Lost Pet | Validate Form |
| Report Found Pet | Validate Form |
| Add Pet | Upload Image |
| Edit Pet | Upload Image |
| Mark Pet as Lost | Auto-Create Lost Report |

#### Extend Relationships (<<extend>>)
| Base Use Case | Extension Use Case | Condition |
|---------------|--------------------|-----------|
| View Lost Pet | Contact Owner | User clicks contact |
| View Found Pet | Contact Owner | User clicks contact |
| View Matches | Send Message | User initiates chat |
| Report Lost Pet | Add Reward | Owner wants to add reward |

#### Generalization Relationships
| Parent Actor | Child Actor |
|--------------|-------------|
| Registered User | Pet Owner |
| Registered User | Admin |

### 7.5 Detailed Use Case Specifications

#### UC-U06: Report Lost Pet

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-U06 |
| **Use Case Name** | Report Lost Pet |
| **Actor** | Registered User (Pet Owner) |
| **Description** | User reports a lost pet to the system |
| **Preconditions** | User is authenticated |
| **Postconditions** | Lost report created, matching triggered |
| **Basic Flow** | 1. User navigates to "Report Lost" page<br>2. User fills pet details form<br>3. User uploads pet image<br>4. User enters last seen location/date<br>5. User enters contact information<br>6. User submits form<br>7. System validates data<br>8. System creates lost report<br>9. System triggers pet matching<br>10. System displays success message |
| **Alternative Flows** | **A1:** Select existing pet<br>1. User selects from registered pets<br>2. System auto-fills pet details<br>3. Continue from step 4 |
| **Exception Flows** | **E1:** Validation error<br>1. System displays error messages<br>2. User corrects errors<br>3. Return to step 6 |

#### UC-S01: Match Pets (System)

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-S01 |
| **Use Case Name** | Match Pets |
| **Actor** | System |
| **Description** | Automatically match lost and found reports |
| **Trigger** | New lost or found report created |
| **Preconditions** | Report successfully created |
| **Postconditions** | Matches calculated and stored |
| **Basic Flow** | 1. Trigger fires on new report<br>2. System queries opposite report type<br>3. System calculates match scores<br>4. System stores matches above threshold<br>5. System creates notifications for matches |
| **Scoring Algorithm** | - Pet type match: +50 points<br>- Location similarity: +30 points<br>- Date proximity (≤7 days): +20 points |

---

## 8. Data Requirements

### 8.1 Entity Relationship Diagram Description

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    profiles     │       │      pets       │       │   pet_images    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │◄──────│ pet_id (FK)     │
│ user_id (FK)    │◄──────│ user_id (FK)    │       │ id (PK)         │
│ full_name       │       │ name            │       │ image_url       │
│ phone           │       │ pet_type        │       │ is_primary      │
│ address         │       │ breed           │       └─────────────────┘
│ avatar_url      │       │ age             │
│ created_at      │       │ color           │
│ updated_at      │       │ gender          │
└─────────────────┘       │ description     │
                          │ image_url       │
                          │ is_lost         │
                          │ created_at      │
                          │ updated_at      │
                          └─────────────────┘
                                   │
                                   │ (optional)
                                   ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  lost_reports   │       │  pet_matches    │       │  found_reports  │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ lost_report_id  │       │ id (PK)         │
│ user_id (FK)    │       │ found_report_id │──────►│ user_id (FK)    │
│ pet_id (FK)     │       │ match_score     │       │ pet_type        │
│ pet_name        │       │ status          │       │ pet_name        │
│ pet_type        │       │ created_at      │       │ description     │
│ description     │       └─────────────────┘       │ found_location  │
│ last_seen_loc   │                                 │ found_date      │
│ last_seen_date  │                                 │ contact_phone   │
│ contact_phone   │                                 │ contact_email   │
│ contact_email   │                                 │ image_url       │
│ reward          │                                 │ status          │
│ image_url       │                                 │ created_at      │
│ status          │                                 │ updated_at      │
│ created_at      │                                 └─────────────────┘
│ updated_at      │
└─────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   user_roles    │       │    messages     │       │  notifications  │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ user_id (FK)    │       │ sender_id (FK)  │       │ user_id (FK)    │
│ role            │       │ receiver_id(FK) │       │ title           │
│ created_at      │       │ content         │       │ message         │
└─────────────────┘       │ read            │       │ type            │
                          │ created_at      │       │ link            │
                          └─────────────────┘       │ read            │
                                                    │ created_at      │
                                                    └─────────────────┘
```

### 8.2 Data Dictionary

#### Table: profiles
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | No | Primary key |
| user_id | UUID | No | Reference to auth.users |
| full_name | TEXT | Yes | User's full name |
| phone | TEXT | Yes | Contact phone number |
| address | TEXT | Yes | Physical address |
| avatar_url | TEXT | Yes | Profile picture URL |
| created_at | TIMESTAMPTZ | No | Record creation time |
| updated_at | TIMESTAMPTZ | No | Last update time |

#### Table: pets
| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | UUID | No | Primary key |
| user_id | UUID | No | Owner's user ID |
| name | TEXT | No | Pet's name |
| pet_type | ENUM | No | dog, cat, bird, rabbit, fish, hamster, other |
| breed | TEXT | Yes | Pet breed |
| age | TEXT | Yes | Pet age |
| color | TEXT | Yes | Pet color |
| gender | TEXT | Yes | Pet gender |
| description | TEXT | Yes | Pet description |
| image_url | TEXT | Yes | Primary image URL |
| is_lost | BOOLEAN | Yes | Lost status flag |
| created_at | TIMESTAMPTZ | No | Record creation time |
| updated_at | TIMESTAMPTZ | No | Last update time |

---

## 9. Appendices

### 9.1 Technology Stack Reference

| Category | Technology | Version |
|----------|------------|---------|
| Frontend Framework | React | 18.3.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | Latest |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | Latest |
| State Management | TanStack Query | 5.x |
| Routing | React Router DOM | 6.x |
| Form Handling | React Hook Form | 7.x |
| Validation | Zod | 3.x |
| Backend | Lovable Cloud (Supabase) | Latest |
| Database | PostgreSQL | 15.x |
| Maps | Mapbox GL | 3.x |

### 9.2 Glossary

| Term | Definition |
|------|------------|
| RLS | Row Level Security - PostgreSQL feature for data access control |
| Edge Function | Serverless function running close to users |
| Real-time | Instant data synchronization via WebSockets |
| Match Score | Numerical value (0-100) indicating potential pet match |

### 9.3 Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | Dec 2024 | Development Team | Initial SRS document |

---

**End of Document**
