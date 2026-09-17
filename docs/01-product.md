# Finpilot Product Requirements Document (PRD)

**Version:** 1.0
**Status:** MVP Draft
**Product:** Finpilot
**Type:** Loan Lead Collection & Distribution Platform
**Platform:** Mobile App + Admin Panel

---

# 1. Product Overview

Finpilot is a digital platform developed by TARS to simplify the loan application process.

The platform allows customers to apply for different loan products through a single application. Customer information, financial details, and supporting documents are collected digitally and managed from a centralized system.

Finpilot does **not** provide loans. It acts as a platform that collects qualified loan applications and forwards them to partner Banks and NBFCs for review.

---

# 2. Product Vision

To build a simple, reliable, and scalable platform that helps customers apply for loans digitally while enabling TARS to collect, manage, qualify, and distribute loan leads to partner Banks and NBFCs.

---

# 3. Problem Statement

Traditional loan application processes are fragmented and manual.

Customers often need to:

* Visit multiple lenders.
* Submit the same documents repeatedly.
* Wait without knowing application status.
* Communicate through calls and WhatsApp.

For businesses, managing customer data and loan applications manually becomes inefficient as the number of applications grows.

---

# 4. Solution

Finpilot provides one centralized platform where customers can:

* Register and login.
* Apply for loans.
* Submit personal and financial information.
* Upload required documents.
* Track loan application status.

For TARS, the platform provides:

* Centralized customer database.
* Loan application management.
* Lead qualification.
* Lead management.
* Loan status management.
* Forward qualified leads to Banks and NBFCs.

---

# 5. Core Idea

Finpilot is a **Loan Lead Collection Platform**.

The primary objective of the MVP is **not loan approval**.

The objective is to collect high-quality customer data, qualify loan applications, and manage those applications before forwarding them to partner lenders.

```
Customer

↓

Login

↓

Apply for Loan

↓

Submit Information

↓

Upload Documents

↓

Application Stored

↓

Lead Qualification

↓

Admin Review

↓

Forward to Bank / NBFC

↓

Loan Status Updated

↓

Customer Views Status
```

---

# 6. Business Model

Finpilot earns revenue through successful loan referrals.

When a customer receives a loan through a partner Bank or NBFC, TARS earns a commission from the lending institution.

Customers are not charged for submitting loan applications through Finpilot.

---

# 7. Target Users

## Customer

Individuals applying for loans.

## Admin

Internal TARS team responsible for managing customer applications and qualified loan leads.

---

# 8. User Roles

## Customer

Customer can:

* Register
* Login
* Complete profile
* Apply for loan
* Upload documents
* View application status
* Receive notifications

---

## Admin

Admin can:

* View customers
* View applications
* Manage loan applications
* Review submitted information
* Qualify leads
* Update application status
* Forward qualified applications to partner lenders
* View reports

---

# 9. Loan Categories

* Personal Loan
* Business Loan
* Home Loan
* Mortgage Loan
* Car Loan
* Gold Loan
* Agriculture Loan

---

# 10. Customer Journey

```
Open App

↓

Register / Login

↓

Complete Profile

↓

Select Loan Category

↓

Fill Loan Application

↓

Upload Documents

↓

Submit Application

↓

Track Loan Status

↓

Receive Updates
```

---

# 11. Admin Workflow

```
Customer Application Received

↓

Review Customer Information

↓

Review Documents

↓

Qualify Lead

↓

Update Application Status

↓

Forward Qualified Lead

↓

Manage Loan Status
```

---

# 12. Core Modules

## Authentication

* Registration
* Login
* OTP Verification
* Session Management

---

## Customer Module

* Customer Profile
* Loan Application
* Loan History
* Application Status
* Notifications

---

## Loan Module

* Loan Categories
* Loan Application
* Loan Details
* Status Tracking

---

## Document Module

* Document Upload
* Document Storage
* Document Management

---

## Lead Management Module

* Customer Data Collection
* Lead Qualification
* Lead Status
* Lead Management

---

## Admin Module

* Dashboard
* Customer Management
* Loan Management
* Lead Management
* Reports

---

## Notification Module

* Push Notifications
* SMS Notifications
* Email Notifications
* In-App Notifications

---

# 13. Business Rules

* Finpilot does not provide loans.
* Customers submit loan applications through the platform.
* Every application must include the required customer information.
* Supporting documents are required before processing.
* Every application must have a trackable status.
* Only qualified applications should be forwarded to partner Banks and NBFCs.

---

# 14. MVP Scope

## Customer

* OTP Login
* Customer Profile
* Loan Application
* Document Upload
* Application Status
* Notifications

---

## Admin

* Dashboard
* Customer Management
* Loan Management
* Lead Qualification
* Lead Management
* Status Management
* Reports

---

## Platform

* Customer Database
* Lead Qualification Logic
* Loan Status Tracking
* Notification System

---

# 15. Success Metrics

* Registered Customers
* Loan Applications Submitted
* Qualified Leads
* Leads Forwarded
* Loan Approvals
* Loan Disbursals
* Average Processing Time
* Customer Satisfaction

---

# 16. MVP Objective

The first version of Finpilot is focused on validating the business by building a platform that:

* Collects customer loan applications.
* Stores customer and loan data securely.
* Qualifies loan leads.
* Enables administrators to manage applications.
* Distributes qualified applications to partner Banks and NBFCs.
* Allows customers to track the status of their applications.

---

**End of Product Requirements Document**


