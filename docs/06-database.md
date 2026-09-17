# Finpilot Database Design Documentation

**Version:** 1.0
**Status:** MVP
**Database:** MongoDB (Mongoose ODM)

---

# 1. Overview

The Finpilot database stores customer information, loan applications, uploaded documents, notifications, and administrative data.

MongoDB is used because it provides a flexible document-based structure suitable for handling different loan categories and evolving business requirements.

The database is designed to support the MVP while remaining scalable for future integrations with Banks and NBFCs.

---

# 2. Database Collections

The MVP contains the following collections:

```text
users
loanApplications
documents
notifications
admins
```

---

# 3. Database Relationship

```text
User
 │
 ├──────────────┐
 │              │
 ▼              ▼
Loan        Notification
 │
 ▼
Documents
```

---

# 4. Users Collection

Stores customer account information.

### Fields

| Field        | Type     | Required |
| ------------ | -------- | -------- |
| _id          | ObjectId | Yes      |
| fullName     | String   | Yes      |
| mobile       | String   | Yes      |
| email        | String   | No       |
| dateOfBirth  | Date     | No       |
| gender       | String   | No       |
| profilePhoto | String   | No       |
| createdAt    | Date     | Yes      |
| updatedAt    | Date     | Yes      |

---

# 5. Loan Applications Collection

Stores every loan application submitted by customers.

### Fields

| Field               | Type     |
| ------------------- | -------- |
| _id                 | ObjectId |
| userId              | ObjectId |
| loanCategory        | String   |
| loanAmount          | Number   |
| loanPurpose         | String   |
| employmentType      | String   |
| companyName         | String   |
| monthlyIncome       | Number   |
| workExperience      | Number   |
| applicationStatus   | String   |
| qualificationStatus | String   |
| adminRemark         | String   |
| submittedAt         | Date     |
| updatedAt           | Date     |

---

# 6. Documents Collection

Stores uploaded document references.

### Fields

| Field              | Type     |
| ------------------ | -------- |
| _id                | ObjectId |
| applicationId      | ObjectId |
| userId             | ObjectId |
| documentType       | String   |
| fileUrl            | String   |
| verificationStatus | String   |
| uploadedAt         | Date     |

---

# 7. Notifications Collection

Stores notifications sent to customers.

### Fields

| Field     | Type     |
| --------- | -------- |
| _id       | ObjectId |
| userId    | ObjectId |
| title     | String   |
| message   | String   |
| isRead    | Boolean  |
| createdAt | Date     |

---

# 8. Admin Collection

Stores administrator accounts.

### Fields

| Field     | Type     |
| --------- | -------- |
| _id       | ObjectId |
| fullName  | String   |
| email     | String   |
| password  | String   |
| role      | String   |
| createdAt | Date     |

---

# 9. Application Status Enum

Every application follows a predefined lifecycle.

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

---

# 10. Qualification Status

```text
Pending

Qualified

Not Qualified
```

---

# 11. Document Types

Supported documents in MVP:

* PAN Card
* Aadhaar Card
* Salary Slip
* Bank Statement
* Business Proof
* Other Supporting Documents

---

# 12. Document Verification Status

```text
Pending

Verified

Rejected
```

---

# 13. Indexing Strategy

Indexes should be created for:

### Users

* mobile (Unique)

### Loan Applications

* userId
* applicationStatus
* qualificationStatus
* submittedAt

### Documents

* applicationId
* userId

### Notifications

* userId

---

# 14. Data Relationships

One User → Many Loan Applications

One Loan Application → Many Documents

One User → Many Notifications

One Admin → Many Application Updates

---

# 15. Soft Delete Strategy

No records should be permanently deleted.

Collections should use:

* isDeleted
* deletedAt

This allows auditability and prevents accidental data loss.

---

# 16. File Storage Strategy

Uploaded files are **not stored inside MongoDB**.

The database stores only:

* File URL
* File Type
* Upload Date
* Verification Status

The actual files are stored in cloud storage.

---

# 17. Future Collections

Not part of the MVP:

* lenders
* lenderResponses
* creditChecks
* bankAccounts
* auditLogs
* activityLogs
* dsaPartners
* commissions

These collections can be introduced in future releases without affecting the existing schema.

---

# 18. Database Design Principles

* Document-oriented schema
* Minimal collection coupling
* Reference-based relationships
* Scalable structure
* Soft delete support
* Indexed search fields
* Secure document references
* Extensible for future integrations

---

**End of Database Design Documentation**
