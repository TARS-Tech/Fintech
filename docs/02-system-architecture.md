# Finpilot System Architecture

**Version:** 1.0
**Status:** MVP Draft
**Product:** Finpilot
**Platform:** React Native + Node.js + MongoDB

---

# 1. Purpose

This document defines the high-level system architecture of the Finpilot MVP.

It explains how different components of the system interact to support customer loan applications, lead qualification, and administrative management.

This document focuses on system design and data flow rather than implementation details.

---

# 2. Architecture Overview

The Finpilot MVP consists of four primary components:

```
Customer Mobile App
        │
        ▼
REST API Server
        │
        ▼
Business Logic Layer
        │
        ▼
MongoDB Database
        │
        ▼
Admin Panel
```

External services such as OTP providers and cloud file storage integrate with the backend but remain independent of the core application.

---

# 3. System Components

## Customer Mobile Application

The customer-facing mobile application allows users to:

* Register and login
* Complete their profile
* Apply for loans
* Upload required documents
* Track application status
* Receive notifications

The mobile application communicates only with the backend API.

---

## Backend API

The backend is the central component of the system.

Responsibilities include:

* Authentication
* Customer management
* Loan application management
* Document management
* Lead qualification
* Status management
* Notification handling
* Admin operations

All business rules are enforced within the backend.

---

## Database

MongoDB stores all application data.

Primary data includes:

* Customer profiles
* Loan applications
* Uploaded documents
* Application status
* Lead qualification results
* Notifications
* Admin accounts

MongoDB acts as the single source of truth for the platform.

---

## Admin Panel

The Admin Panel enables internal TARS users to manage the platform.

Responsibilities include:

* View customer applications
* Review customer information
* Review uploaded documents
* Qualify loan leads
* Update application status
* Manage customers
* Generate reports

---

# 4. High-Level System Flow

```
Customer

↓

Mobile App

↓

Backend API

↓

Business Logic

↓

MongoDB

↓

Admin Panel

↓

Application Status Updated

↓

Customer
```

---

# 5. Lead Processing Flow

```
Customer Login

↓

Loan Application

↓

Customer Information Stored

↓

Documents Uploaded

↓

Lead Qualification

↓

Admin Review

↓

Qualified Lead

↓

Forward to Partner Bank/NBFC

↓

Status Updated

↓

Customer Notification
```

---

# 6. Core Architecture Layers

## Presentation Layer

* React Native Mobile App
* Admin Panel

Responsible for user interaction.

---

## API Layer

Provides secure REST APIs for:

* Authentication
* Customers
* Loan Applications
* Documents
* Notifications
* Administration

---

## Business Layer

Implements all business rules.

Responsibilities include:

* Customer validation
* Loan validation
* Lead qualification
* Status management
* Permission handling

---

## Data Layer

Responsible for persistent storage.

Includes:

* MongoDB Collections
* File Storage References

---

# 7. Authentication Flow

```
Customer

↓

Mobile Number

↓

OTP Verification

↓

JWT Token Generated

↓

Authenticated Session
```

The backend validates every protected request using JWT authentication.

---

# 8. Document Storage Flow

```
Customer

↓

Upload Document

↓

Backend Validation

↓

Cloud Storage

↓

Document URL Stored in MongoDB
```

Only document references are stored in the database.

---

# 9. Lead Qualification

The Lead Qualification component evaluates every submitted application.

The MVP uses predefined business rules to determine whether a lead is suitable for review.

Qualified applications become available for the Admin Panel.

The qualification logic is configurable and can be expanded in future releases.

---

# 10. Application Status Lifecycle

```
Draft

↓

Submitted

↓

Under Review

↓

Qualified

↓

Forwarded to Bank/NBFC

↓

Approved

or

Rejected

↓

Disbursed
```

The backend maintains a complete history of every status change.

---

# 11. Security Architecture

The MVP includes:

* OTP Authentication
* JWT Authorization
* Password-less Login
* Secure API Validation
* Protected Admin Routes
* Role-Based Authorization
* Secure Document Upload
* Audit Logging

---

# 12. External Integrations (MVP)

The MVP integrates with:

### OTP Service

* Mobile number verification

### Cloud Storage

* Secure document storage

Future banking integrations are intentionally excluded from the MVP.

---

# 13. Scalability

The architecture is designed to support future enhancements without major restructuring.

Future capabilities may include:

* Bank APIs
* NBFC APIs
* Automated lead distribution
* Credit bureau integrations
* AI-based lead scoring
* Multi-lender routing

These are outside the scope of the MVP but are supported by the chosen architecture.

---

# 14. Architecture Principles

The Finpilot MVP follows these principles:

* Modular architecture
* API-first design
* Separation of concerns
* Stateless backend services
* Centralized business logic
* Secure authentication
* Scalable data model
* Extensible integration layer

---

**End of System Architecture Document**
