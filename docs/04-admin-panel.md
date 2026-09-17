# Finpilot Admin Panel Documentation

**Version:** 1.0
**Status:** MVP
**Platform:** Web Admin Panel

---

# 1. Overview

The Admin Panel is the internal management system used by the TARS team.

Its primary objective is to manage customer applications, review submitted information, qualify loan leads, update application status, and forward qualified leads to partner Banks and NBFCs.

The Admin Panel is the operational center of the Finpilot MVP.

---

# 2. Admin Responsibilities

The Admin can:

* Login securely
* View dashboard analytics
* View all customers
* View all loan applications
* Review customer information
* Review uploaded documents
* Qualify leads
* Update application status
* Forward qualified applications to partner Banks/NBFCs
* Manage notifications
* View reports

---

# 3. Admin Navigation

```text
Login

↓

Dashboard

├── Dashboard
├── Customers
├── Loan Applications
├── Lead Management
├── Reports
├── Notifications
├── Settings
└── Profile
```

---

# 4. Authentication Module

## Features

* Email Login
* Password Login
* JWT Authentication
* Secure Session
* Logout

---

## Flow

```text
Admin Login

↓

Dashboard
```

---

# 5. Dashboard Module

The Dashboard provides a quick overview of platform activity.

### Dashboard Cards

* Total Customers
* Total Applications
* Pending Applications
* Qualified Leads
* Forwarded Leads
* Approved Loans
* Rejected Loans

---

### Dashboard Sections

* Recent Applications
* Pending Reviews
* Recent Status Updates
* Notification Summary

---

# 6. Customer Management Module

Admin can:

* View Customer List
* Search Customers
* Filter Customers
* View Customer Profile
* View Loan History

### Customer Information

* Name
* Mobile Number
* Email
* Address
* Employment
* Income
* Registered Date
* Application Count

---

# 7. Loan Application Module

Admin can view every submitted application.

### Application Details

* Application ID
* Customer Details
* Loan Category
* Requested Amount
* Loan Purpose
* Employment Details
* Income Details
* Submitted Date
* Current Status

---

## Actions

* View Application
* Review Information
* Update Status
* Add Remarks

---

# 8. Document Management Module

Admin can review uploaded documents.

Examples:

* PAN Card
* Aadhaar Card
* Salary Slip
* Bank Statement
* Business Documents
* Supporting Documents

Admin can:

* View Documents
* Verify Documents
* Reject Invalid Documents
* Request Re-upload

---

# 9. Lead Qualification Module

This is one of the core modules of the MVP.

The system collects customer information.

Admin reviews submitted data and determines whether the application is suitable to be forwarded to a lending partner.

### Qualification Factors

* Customer Information
* Loan Details
* Income Information
* Employment Information
* Uploaded Documents

---

## Lead Status

```text
New

↓

Under Review

↓

Qualified

↓

Not Qualified
```

---

# 10. Lead Management Module

Qualified applications are managed from this module.

Admin can:

* View Qualified Leads
* Search Leads
* Filter Leads
* Update Lead Status
* Add Internal Remarks

---

# 11. Loan Status Management

Every application has a status.

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

or

Rejected

↓

Disbursed
```

Admin updates the application status throughout the loan lifecycle.

---

# 12. Reports Module

The Reports section provides business insights.

### Reports

* Customer Report
* Loan Report
* Lead Report
* Status Report
* Approval Report

---

# 13. Notification Module

Admin can send notifications regarding:

* Application Updates
* Document Requests
* Loan Status Updates
* General Announcements

---

# 14. Settings Module

Admin can manage:

* Loan Categories
* Notification Templates
* Profile Settings
* Security Settings

---

# 15. Admin Folder Structure

```text
src/

├── pages/
│   ├── auth/
│   ├── dashboard/
│   ├── customers/
│   ├── applications/
│   ├── leads/
│   ├── reports/
│   ├── notifications/
│   └── settings/
│
├── components/
├── layouts/
├── services/
├── hooks/
├── redux/
├── utils/
├── constants/
└── styles/
```

---

# 16. MVP Pages

## Authentication

* Login

---

## Dashboard

* Dashboard Home

---

## Customers

* Customer List
* Customer Details

---

## Loan Applications

* Application List
* Application Details

---

## Lead Management

* Qualified Leads
* Lead Details

---

## Reports

* Reports Dashboard

---

## Notifications

* Notification List

---

## Settings

* Profile
* Basic Settings

---

# 17. MVP Workflow

```text
Customer Submits Application

↓

Application Appears in Admin Panel

↓

Admin Reviews Customer Information

↓

Admin Reviews Documents

↓

Admin Qualifies Lead

↓

Admin Updates Status

↓

Qualified Lead Forwarded to Bank/NBFC

↓

Application Status Updated

↓

Customer Receives Notification
```

---

# 18. Design Principles

* Clean dashboard interface
* Fast application review
* Minimal clicks
* Centralized lead management
* Secure access
* Simple workflows
* Scalable module structure

---

**End of Admin Panel Documentation**
