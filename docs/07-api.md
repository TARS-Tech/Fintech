# Finpilot API Documentation

**Version:** 1.0
**Status:** MVP
**API Style:** REST API
**Base URL:**

```
/api/v1
```

---

# 1. Overview

The Finpilot Backend exposes REST APIs for both the Customer Mobile App and the Admin Panel.

All APIs return JSON responses.

Protected APIs require JWT Authentication.

---

# 2. Authentication

### Customer Authentication

```
POST /auth/send-otp
```

Purpose

Send OTP to customer's mobile number.

---

```
POST /auth/verify-otp
```

Purpose

Verify OTP and generate JWT token.

---

```
POST /auth/logout
```

Purpose

Logout current user.

---

```
GET /auth/me
```

Purpose

Return logged-in customer information.

---

# 3. Customer APIs

## Create Profile

```
POST /customers/profile
```

Purpose

Create customer profile after first login.

---

## Get Profile

```
GET /customers/profile
```

Purpose

Fetch customer profile.

---

## Update Profile

```
PUT /customers/profile
```

Purpose

Update profile information.

---

# 4. Loan Application APIs

## Create Draft

```
POST /loan-applications
```

Purpose

Create a new loan application.

---

## Get My Applications

```
GET /loan-applications
```

Purpose

Return all applications submitted by the logged-in customer.

---

## Get Application

```
GET /loan-applications/:applicationId
```

Purpose

Fetch application details.

---

## Update Draft

```
PUT /loan-applications/:applicationId
```

Purpose

Update draft application before submission.

---

## Submit Application

```
POST /loan-applications/:applicationId/submit
```

Purpose

Submit completed application for review.

---

## Get Application Status

```
GET /loan-applications/:applicationId/status
```

Purpose

Return current application status.

---

# 5. Document APIs

## Upload Document

```
POST /documents/upload
```

Purpose

Upload supporting documents.

---

## Get Documents

```
GET /documents/:applicationId
```

Purpose

Return uploaded documents.

---

## Delete Draft Document

```
DELETE /documents/:documentId
```

Purpose

Delete a document before application submission.

---

# 6. Notification APIs

## Get Notifications

```
GET /notifications
```

Purpose

Return customer notifications.

---

## Mark Notification Read

```
PATCH /notifications/:notificationId/read
```

Purpose

Mark notification as read.

---

# 7. Admin Authentication

```
POST /admin/auth/login
```

Purpose

Admin Login.

---

```
POST /admin/auth/logout
```

Purpose

Logout Admin.

---

```
GET /admin/auth/me
```

Purpose

Return logged-in admin information.

---

# 8. Admin Dashboard APIs

## Dashboard Summary

```
GET /admin/dashboard
```

Returns

* Total Customers
* Total Applications
* Pending Reviews
* Qualified Leads
* Forwarded Leads
* Approved Loans
* Rejected Loans

---

# 9. Customer Management APIs

## Get Customers

```
GET /admin/customers
```

---

## Get Customer Details

```
GET /admin/customers/:customerId
```

---

## Search Customers

```
GET /admin/customers/search
```

Query Parameters

* keyword
* mobile
* email

---

# 10. Loan Management APIs

## Get Applications

```
GET /admin/applications
```

Supports Filters

* Status
* Loan Category
* Date
* Qualification Status

---

## Get Application Details

```
GET /admin/applications/:applicationId
```

---

## Update Application Status

```
PATCH /admin/applications/:applicationId/status
```

Purpose

Update application status.

---

## Add Internal Remark

```
PATCH /admin/applications/:applicationId/remark
```

Purpose

Store internal admin remarks.

---

# 11. Lead Qualification APIs

## Qualify Lead

```
PATCH /admin/applications/:applicationId/qualify
```

Purpose

Mark lead as Qualified or Not Qualified.

---

## Get Qualified Leads

```
GET /admin/leads
```

Returns

Qualified applications.

---

# 12. Notification Management APIs

## Send Notification

```
POST /admin/notifications
```

Purpose

Send notification to customer.

---

# 13. Reports APIs

## Dashboard Report

```
GET /admin/reports/dashboard
```

---

## Customer Report

```
GET /admin/reports/customers
```

---

## Loan Report

```
GET /admin/reports/loans
```

---

# 14. Request Headers

Protected APIs require:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

# 15. Standard Success Response

```json
{
  "success": true,
  "message": "Request completed successfully.",
  "data": {}
}
```

---

# 16. Standard Error Response

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": []
}
```

---

# 17. HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# 18. API Security

The backend implements:

* JWT Authentication
* Role-Based Authorization
* Request Validation
* File Type Validation
* File Size Validation
* Input Sanitization
* Protected Admin Routes

---

# 19. API Versioning

Current Version

```
/api/v1
```

Future versions should be introduced as:

```
/api/v2
/api/v3
```

without breaking existing clients.

---

# 20. MVP API Modules

### Authentication

* Send OTP
* Verify OTP
* Logout
* Current User

### Customer

* Profile
* Update Profile

### Loan Applications

* Create Draft
* Update Draft
* Submit Application
* View Applications
* Track Status

### Documents

* Upload
* View
* Delete Draft Document

### Notifications

* View
* Mark as Read

### Admin

* Login
* Dashboard
* Customer Management
* Loan Management
* Lead Qualification
* Reports
* Notifications

---

# 21. API Design Principles

* RESTful endpoints
* Resource-based URLs
* Stateless authentication
* Consistent JSON responses
* Versioned APIs
* Secure by default
* Modular routing
* Easy to extend

---

**End of API Documentation**
