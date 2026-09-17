# Finpilot Mobile App Documentation

**Version:** 1.0
**Status:** MVP
**Platform:** React Native (Expo)

---

# 1. Overview

The Finpilot Mobile App is the customer-facing application.

Its purpose is to allow customers to:

* Create an account
* Login securely
* Complete their profile
* Apply for loans
* Upload documents
* Track loan application status
* Receive notifications

The mobile application is intentionally simple.

All business processing happens in the backend and Admin Panel.

---

# 2. MVP Modules

```
Authentication

↓

Home

↓

Loan Application

↓

Profile

↓

Notifications
```

---

# 3. Navigation Structure

```
Splash

↓

Authentication

↓

Home

↓

Loan Application

↓

Application Status

↓

Profile
```

---

# 4. Authentication Module

## Objective

Allow customers to securely access Finpilot.

---

### Screens

* Splash
* Welcome
* Login
* OTP Verification
* Complete Profile (First Time)

---

### Flow

```
Open App

↓

Splash

↓

Login

↓

Enter Mobile Number

↓

Receive OTP

↓

Verify OTP

↓

New User?

↓

Yes

↓

Complete Profile

↓

Home

----------------

Existing User

↓

Home
```

---

### Features

* Mobile Number Login
* OTP Verification
* JWT Authentication
* Auto Login
* Logout

---

# 5. Home Module

## Purpose

Provide quick access to loan services.

---

### Sections

* Greeting
* Loan Categories
* Active Application
* Recent Updates
* Notifications Shortcut

---

### Actions

Customer can

* Apply for Loan
* Continue Draft
* Track Application
* Open Profile

---

# 6. Loan Application Module

## Purpose

Collect customer loan information.

---

### Flow

```
Select Loan Category

↓

Loan Details

↓

Personal Information

↓

Employment Details

↓

Income Details

↓

Upload Documents

↓

Review

↓

Submit
```

---

### Loan Categories

* Personal Loan
* Business Loan
* Home Loan
* Mortgage Loan
* Car Loan
* Gold Loan
* Agriculture Loan

---

# 7. Document Upload Module

Customer uploads required documents.

Examples

* PAN Card
* Aadhaar Card
* Salary Slip
* Bank Statement
* Business Proof
* Other Supporting Documents

The backend validates and stores uploaded files.

---

# 8. Application Status Module

Customers can monitor their application.

Example statuses

```
Draft

↓

Submitted

↓

Under Review

↓

Qualified

↓

Sent to Bank

↓

Approved

or

Rejected

↓

Disbursed
```

Customers cannot edit submitted applications unless allowed by Admin.

---

# 9. Notification Module

Customers receive updates regarding:

* OTP
* Application Submitted
* Status Updated
* Document Required
* Loan Approved
* Loan Rejected

---

# 10. Profile Module

Customer Profile includes

* Personal Information
* Contact Information
* Employment Details
* Address
* Saved Documents

Customers can edit profile information before submitting a loan application.

---

# 11. Mobile App Folder Structure

```
src/

├── assets/
├── components/
├── navigation/
├── screens/
│   ├── auth/
│   ├── home/
│   ├── loan/
│   ├── profile/
│   ├── notifications/
│   └── common/
├── services/
├── hooks/
├── redux/
├── utils/
├── constants/
└── styles/
```

---

# 12. MVP Screens

## Authentication

* Splash
* Welcome
* Login
* OTP Verification
* Complete Profile

---

## Home

* Home Dashboard

---

## Loan

* Loan Categories
* Loan Details
* Personal Information
* Employment Information
* Income Information
* Document Upload
* Review Application

---

## Status

* Application Status
* Timeline

---

## Profile

* My Profile
* Edit Profile

---

## Notifications

* Notification List

---

# 13. Future Screens

Not included in MVP

* Multiple Loan Applications
* Loan Offers Comparison
* Chat Support
* Referral Program
* DSA Dashboard
* EMI Calculator
* Credit Score
* Video KYC

---

# 14. Mobile App Principles

* Simple user experience
* Minimal steps
* Secure authentication
* Fast application flow
* Clear status tracking
* Responsive interface
* Scalable architecture

---

**End of Mobile App Documentation**
