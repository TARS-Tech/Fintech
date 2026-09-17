# Finpilot Backend Documentation

**Version:** 1.0
**Status:** MVP
**Technology Stack:** Node.js + Express.js + MongoDB

---

# 1. Overview

The Finpilot Backend is the core of the platform.

It is responsible for:

* Authentication
* Customer Management
* Loan Application Processing
* Document Management
* Lead Qualification
* Notification Management
* Admin Operations
* Data Security

The backend exposes REST APIs consumed by both the Mobile App and the Admin Panel.

---

# 2. High Level Architecture

```text
React Native App
        │
        ▼
REST API
        │
        ▼
Controllers
        │
        ▼
Services
        │
        ▼
Database
```

---

# 3. Responsibilities

The backend is responsible for:

* User Authentication
* Business Logic
* Data Validation
* Database Operations
* File Upload
* Status Management
* Notifications
* JWT Authorization

---

# 4. Backend Folder Structure

```text
backend/

src/

├── config/
├── controllers/
├── routes/
├── middleware/
├── models/
├── services/
├── validators/
├── utils/
├── constants/
├── uploads/
├── sockets/
├── jobs/
├── database/
├── helpers/
├── app.js
└── server.js
```

---

# 5. Module Structure

## Authentication

Responsibilities

* OTP Login
* JWT Generation
* Refresh Token
* Logout

---

## Customer Module

Responsibilities

* Register Customer
* Update Profile
* View Profile

---

## Loan Module

Responsibilities

* Create Loan Application
* Update Application
* Submit Application
* Fetch Applications
* Track Status

---

## Document Module

Responsibilities

* Upload Documents
* Validate Files
* Store File URLs
* Fetch Documents

---

## Lead Module

Responsibilities

* Lead Qualification
* Lead Status
* Lead Review
* Lead Assignment

---

## Notification Module

Responsibilities

* Push Notification
* SMS
* Email
* In-App Notification

---

## Admin Module

Responsibilities

* Dashboard Data
* Customer Management
* Lead Management
* Status Updates
* Reports

---

# 6. Authentication Flow

```text
Customer

↓

Enter Mobile Number

↓

Generate OTP

↓

Verify OTP

↓

Generate JWT

↓

Access Protected APIs
```

---

# 7. Authorization

Customer

Can access

* Profile
* Loan
* Documents
* Notifications

---

Admin

Can access

* Dashboard
* Customers
* Applications
* Lead Management
* Reports

---

# 8. Business Logic

The backend handles:

## Customer

* Registration
* Login
* Profile Validation

---

## Loan

* Loan Creation
* Draft Saving
* Final Submission

---

## Lead Qualification

Backend validates

* Required Information
* Required Documents
* Loan Completeness

Application is marked as

* Draft
* Submitted
* Under Review
* Qualified
* Not Qualified

---

# 9. File Upload Flow

```text
Customer

↓

Upload File

↓

Backend Validation

↓

Cloud Storage

↓

Save URL

↓

Return Success
```

---

# 10. Status Management

Every application has a lifecycle.

```text
Draft

↓

Submitted

↓

Under Review

↓

Qualified

↓

Forwarded

↓

Approved

Rejected

↓

Disbursed
```

All status changes are stored in the database.

---

# 11. Middleware

Authentication Middleware

* JWT Validation

Authorization Middleware

* Role Validation

Validation Middleware

* Request Validation

Upload Middleware

* File Upload

Error Middleware

* Global Error Handler

---

# 12. Security

The backend implements:

* JWT Authentication
* Password-less Login
* OTP Verification
* Role Based Access
* Request Validation
* Secure File Upload
* Environment Variables

---

# 13. External Services

MVP Integrations

* OTP Provider
* Cloud Storage

Future Integrations

* PAN Verification
* Aadhaar Verification
* Credit Bureau
* Bank APIs

---

# 14. Error Handling

Standard API Response

Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Failure

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 15. Backend Principles

* Modular Architecture
* Service Layer Pattern
* REST API
* Reusable Components
* Centralized Business Logic
* Secure Authentication
* Scalable Structure
* Clean Code

---

# 16. Future Enhancements

* Automated Lead Qualification
* Bank API Integration
* AI Lead Scoring
* Webhooks
* Queue Processing
* Audit Logs

---

**End of Backend Documentation**
