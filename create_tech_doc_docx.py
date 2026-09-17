import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def create_document():
    doc = Document()

    # Define Color Palette
    COLOR_PRIMARY = RGBColor(15, 23, 42)       # #0F172A Navy
    COLOR_SECONDARY = RGBColor(29, 78, 216)   # #1D4ED8 Royal Blue
    COLOR_TEXT = RGBColor(51, 65, 85)         # #334155 Slate Text
    COLOR_MUTED = RGBColor(100, 116, 139)     # #64748B Muted Gray
    HEX_PRIMARY = "0F172A"
    HEX_SECONDARY = "1D4ED8"
    HEX_ALT_ROW = "F1F5F9"

    # Set Margins
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Styles helper
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Arial'
    normal_style.font.size = Pt(10.0)
    normal_style.font.color.rgb = COLOR_TEXT

    # Helpers
    def set_cell_background(cell, fill_hex):
        shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        cell._tc.get_or_add_tcPr().append(shading_elm)

    def set_cell_margins(cell, top=80, bottom=80, left=120, right=120):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for margin, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = OxmlElement(f'w:{margin}')
            node.set(qn('w:w'), str(val))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    def add_heading_1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(16)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
        return p

    def add_heading_2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = COLOR_SECONDARY
        return p

    def add_heading_3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(11)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
        return p

    def add_paragraph(text, bold_prefix=None, italic=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(5)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_bold = p.add_run(bold_prefix)
            r_bold.font.name = 'Arial'
            r_bold.font.bold = True
            r_bold.font.color.rgb = COLOR_PRIMARY
        r_text = p.add_run(text)
        r_text.font.name = 'Arial'
        r_text.font.italic = italic
        r_text.font.color.rgb = COLOR_TEXT
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_bold = p.add_run(bold_prefix)
            r_bold.font.name = 'Arial'
            r_bold.font.bold = True
            r_bold.font.color.rgb = COLOR_PRIMARY
        r_text = p.add_run(text)
        r_text.font.name = 'Arial'
        r_text.font.color.rgb = COLOR_TEXT
        return p

    def add_code_block(code_text):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, "1E293B") # Dark slate code box
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(code_text)
        r.font.name = 'Consolas'
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(241, 245, 249)
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    def add_callout(text, title=None, border_hex="1D4ED8", fill_hex="F8FAFC"):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        cell = table.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, fill_hex)
        set_cell_margins(cell, top=120, bottom=120, left=180, right=180)

        tcPr = cell._tc.get_or_add_tcPr()
        borders_elm = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="none"/>
                <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_hex}"/>
                <w:bottom w:val="none"/>
                <w:right w:val="none"/>
            </w:tcBorders>
        ''')
        tcPr.append(borders_elm)

        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        if title:
            r_title = p.add_run(f"{title}\n")
            r_title.font.name = 'Arial'
            r_title.font.bold = True
            r_title.font.size = Pt(10.0)
            r_title.font.color.rgb = COLOR_SECONDARY
        r_text = p.add_run(text)
        r_text.font.name = 'Arial'
        r_text.font.size = Pt(9.0)
        r_text.font.color.rgb = COLOR_TEXT
        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # -------------------------------------------------------------
    # COVER PAGE
    # -------------------------------------------------------------
    p_cov_top = doc.add_paragraph()
    p_cov_top.paragraph_format.space_before = Pt(36)
    p_cov_top.paragraph_format.space_after = Pt(12)
    run_org = p_cov_top.add_run("TARS TECHNOLOGIES — CORPORATE REVIEW DOCUMENTATION")
    run_org.font.name = 'Arial'
    run_org.font.size = Pt(11)
    run_org.font.bold = True
    run_org.font.color.rgb = COLOR_SECONDARY

    p_cov_title = doc.add_paragraph()
    p_cov_title.paragraph_format.space_before = Pt(18)
    p_cov_title.paragraph_format.space_after = Pt(12)
    run_title = p_cov_title.add_run("FinPilot Platform:\nTechnical Documentation")
    run_title.font.name = 'Arial'
    run_title.font.size = Pt(28)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_PRIMARY

    p_cov_sub = doc.add_paragraph()
    p_cov_sub.paragraph_format.space_after = Pt(140)
    run_sub = p_cov_sub.add_run("Comprehensive Developer-Facing Technical Manual: System Architecture, REST APIs, Cryptography, Database Schemas, Redux State, and Security")
    run_sub.font.name = 'Arial'
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = COLOR_MUTED

    # Cover Metadata Block Table
    meta_table = doc.add_table(rows=5, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Project Name:", "FinPilot (Digital Loan Distribution Platform)"),
        ("Prepared For:", "Engineering & Developer Onboarding — TARS Technologies"),
        ("Author / Lead:", "Senior Software Architect & Technical Documentation Lead"),
        ("Document Classification:", "Confidential — Internal Developer Reference"),
        ("Date & Version:", "August 2026 | Version 1.0 (Master Release)")
    ]
    for idx, (k, v) in enumerate(meta_data):
        row = meta_table.rows[idx]
        cell_k, cell_v = row.cells[0], row.cells[1]
        cell_k.width = Inches(2.2)
        cell_v.width = Inches(4.3)
        pk = cell_k.paragraphs[0]
        pk.paragraph_format.space_after = Pt(2)
        rk = pk.add_run(k)
        rk.font.name = 'Arial'
        rk.font.bold = True
        rk.font.size = Pt(9.5)
        rk.font.color.rgb = COLOR_PRIMARY
        pv = cell_v.paragraphs[0]
        pv.paragraph_format.space_after = Pt(2)
        rv = pv.add_run(v)
        rv.font.name = 'Arial'
        rv.font.size = Pt(9.5)
        rv.font.color.rgb = COLOR_TEXT

    doc.add_page_break()

    # Setup Header & Footer for main body
    section = doc.sections[0]
    header = section.header
    hp = header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hrun = hp.add_run("FinPilot Platform — Technical Documentation | TARS Technologies")
    hrun.font.name = 'Arial'
    hrun.font.size = Pt(8.5)
    hrun.font.color.rgb = COLOR_MUTED

    footer = section.footer
    fp = footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
    frun = fp.add_run("CONFIDENTIAL — FOR INTERNAL DEVELOPER USE ONLY")
    frun.font.name = 'Arial'
    frun.font.size = Pt(8.5)
    frun.font.color.rgb = COLOR_MUTED

    # -------------------------------------------------------------
    # SECTION 1: SYSTEM OVERVIEW
    # -------------------------------------------------------------
    add_heading_1("1. System Overview")
    add_paragraph("FinPilot is a digital Corporate Direct Selling Agent (DSA) and loan distribution platform developed for TARS Technologies. The platform digitizes the customer loan acquisition lifecycle — enabling borrowers to register via mobile OTP, create a profile, execute digital Aadhaar/PAN KYC, calculate loan eligibility via a deterministic server engine, and explore loan products.")
    add_paragraph("FinPilot acts strictly as a distribution channel and DOES NOT disburse funds directly. All credit underwriting and capital disbursal are managed by partner Banks and Non-Banking Financial Companies (NBFCs).")

    # -------------------------------------------------------------
    # SECTION 2: REPOSITORY STRUCTURE
    # -------------------------------------------------------------
    add_heading_1("2. Repository Structure")
    add_paragraph("The workspace (`e:\\Fintech`) is structured into two core application directories and an architectural documentation folder:")

    add_code_block(
"e:\\Fintech\n"
"├── backend/                 # Node.js / Express REST API Server\n"
"│   ├── index.js             # Server Entry Point & MongoDB Connection\n"
"│   └── src/\n"
"│       ├── config/          # Cloudinary SDK Configuration\n"
"│       ├── controllers/     # Auth, Profile, KYC, Eligibility Handlers\n"
"│       ├── middleware/      # Bearer JWT & Cloudinary Multer Uploads\n"
"│       ├── models/          # Mongoose Schemas (User, Otp, KYC, etc.)\n"
"│       ├── routes/          # Express Routers (/api/auth, /api/kyc...)\n"
"│       ├── services/        # Crypto, JWT, Sandbox API, Scoring Engine\n"
"│       ├── utils/           # Data Masking & Mock KYC Store\n"
"│       └── validations/     # Zod Payload Schemas\n"
"├── mobile/                  # React Native / Expo Application\n"
"│   ├── App.js               # Entry Point (Redux Provider & PersistGate)\n"
"│   └── src/\n"
"│       ├── api/             # Centralized Axios API Services\n"
"│       ├── components/      # Design Tokens, Skeletons, Buttons\n"
"│       ├── data/            # Static Catalog Data (loans.js)\n"
"│       ├── navigation/      # React Navigation Routers\n"
"│       ├── redux/           # Redux Toolkit Slices & Thunk Actions\n"
"│       ├── screens/         # 17 Screen View Components\n"
"│       └── services/        # AsyncStorage Token Helpers & API Config\n"
"└── docs/                    # Architectural Specifications (01 to 07)"
    )

    # -------------------------------------------------------------
    # SECTION 3: SYSTEM ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("3. High-Level System Architecture")
    add_paragraph("FinPilot implements a decoupled 3-tier client-server architecture:")

    add_bullet("React Native application running on iOS/Android via Expo SDK ~52.0.", "Tier 1 — Mobile Client: ")
    add_bullet("Stateless Node.js/Express web server handling authentication, validation, scoring, and third-party API orchestration.", "Tier 2 — REST API Server: ")
    add_bullet("MongoDB Atlas / Community server storing user profiles, encrypted KYC identity vaults, and eligibility scores.", "Tier 3 — Database Layer: ")
    add_bullet("Sandbox.co.in APIs (Aadhaar OKYC & PAN verification) and Cloudinary (KYC & profile image storage).", "Tier 4 — Integrations: ")

    # -------------------------------------------------------------
    # SECTION 4: MOBILE APPLICATION ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("4. Mobile Application Architecture")
    add_paragraph("The mobile frontend (`mobile/src`) enforces strict modularity. UI components render state supplied by Redux Toolkit slices, while async action thunks execute network calls through a centralized Axios client.")

    # -------------------------------------------------------------
    # SECTION 5: BACKEND ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("5. Backend Architecture")
    add_paragraph("The backend (`backend/src`) uses a Controller-Service-Model architecture:")
    add_bullet("Maps incoming HTTP paths to specific controller handlers.", "Routes (`routes/`): ")
    add_bullet("Validates payload schemas using Zod (`validations/`), calls services, and formats JSON responses.", "Controllers (`controllers/`): ")
    add_bullet("Executes core business logic (encryption, Sandbox HTTPS requests, scoring).", "Services (`services/`): ")
    add_bullet("Defines Mongoose MongoDB schemas, indexes, and document methods.", "Models (`models/`): ")

    # -------------------------------------------------------------
    # SECTION 6: NAVIGATION ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("6. Navigation Architecture")
    add_paragraph("Navigation is managed via React Navigation v6 stack navigators in `mobile/src/navigation`:")
    add_bullet("Wraps navigation based on Redux `isAuthenticated` state.", "RootNavigator.js: ")
    add_bullet("Controls SplashScreen, OnboardingScreen, RegisterScreen, VerificationCode.", "AuthNavigator.jsx: ")
    add_bullet("Controls HomeScreen, ProfileScreen, KycScreen, AadhaarScreen, PanScreen, EligibilityScreen, LoanExplorerScreen, LoanOffersScreen.", "AppNavigator.jsx: ")

    # -------------------------------------------------------------
    # SECTION 7: REDUX STATE ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("7. Redux State Architecture")
    add_paragraph("Global state (`mobile/src/redux/store.js`) combines four core slices with `redux-persist` caching `auth` and `kyc` state in AsyncStorage:")
    add_bullet("Manages `token`, `refreshToken`, `isAuthenticated`, `userHydrated`.", "authSlice.js: ")
    add_bullet("Manages borrower profile details (`name`, `email`, `phone`, `profileCompleted`).", "userSlice.js: ")
    add_bullet("Manages `aadhaarVerified`, `panVerified`, `kycCompleted`, and status.", "kycSlice.js: ")
    add_bullet("Manages `score`, `status`, `breakdown`, and calculation state.", "eligibilitySlice.js: ")

    # -------------------------------------------------------------
    # SECTION 8: AUTHENTICATION ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("8. Authentication Architecture")
    add_paragraph("Authentication relies on 6-digit mobile OTP verification issuing dual JSON Web Tokens (JWT):")
    add_bullet("Valid for 7 days (`JWT_ACCESS_SECRET`). Included in API request headers: `Authorization: Bearer <token>`.", "Access Token: ")
    add_bullet("Valid for 30 days (`JWT_REFRESH_SECRET`). Stored in `User.refreshToken` in MongoDB.", "Refresh Token: ")

    # -------------------------------------------------------------
    # SECTION 9: OTP FLOW
    # -------------------------------------------------------------
    add_heading_1("9. Mobile OTP Flow")
    add_paragraph("1. Borrower submits 10-digit phone on `RegisterScreen.jsx` -> `POST /api/auth/send-otp`.")
    add_paragraph("2. Server deletes existing OTP docs for phone, generates random 6-digit string (`otp.service.js`), saves new `Otp` document with 5-minute expiry.")
    add_paragraph("3. In development, OTP is printed to console and returned in API response.")

    # -------------------------------------------------------------
    # SECTION 10: JWT FLOW
    # -------------------------------------------------------------
    add_heading_1("10. JWT Token Verification Flow")
    add_paragraph("1. Borrower enters 6-digit OTP on `VerificationCode.jsx` -> `POST /api/auth/verify-otp`.")
    add_paragraph("2. Server validates OTP, marks `user.isVerified = true`, signs access and refresh JWTs, and updates `user.refreshToken`.")
    add_paragraph("3. Mobile client persists tokens to `AsyncStorage` via `saveTokens()` in `services/auth.js`.")

    # -------------------------------------------------------------
    # SECTION 11: PROFILE ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("11. Profile Architecture")
    add_paragraph("Profile details are retrieved via `GET /api/profile` and updated via `PUT /api/profile` (multipart form-data handling profile image upload to Cloudinary `fintech/profile`).")

    # -------------------------------------------------------------
    # SECTION 12: KYC ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("12. Digital KYC Architecture")
    add_paragraph("The KYC module (`kyc.controller.js`) orchestrates identity verification across Aadhaar OKYC and PAN verification. It updates the `KYC` collection and sets `user.kycCompleted = true` when both are verified.")

    # -------------------------------------------------------------
    # SECTION 13: AADHAAR OKYC FLOW
    # -------------------------------------------------------------
    add_heading_1("13. Aadhaar OKYC Flow")
    add_paragraph("1. Borrower inputs 12-digit Aadhaar on `AadhaarScreen.jsx` -> `POST /api/kyc/send-aadhaar-otp`.")
    add_paragraph("2. Server calls Sandbox Aadhaar OKYC API (or mock generator `mockKyc.js`). Borrower receives OTP.")
    add_paragraph("3. Borrower uploads Aadhaar front/back photos and submits OTP -> `POST /api/kyc/verify-aadhaar-otp`.")
    add_paragraph("4. Server verifies OTP, uploads images to Cloudinary (`fintech/kyc`), encrypts Aadhaar with AES-256-GCM, and saves masked `XXXX-XXXX-1234`.")

    # -------------------------------------------------------------
    # SECTION 14: PAN VERIFICATION FLOW
    # -------------------------------------------------------------
    add_heading_1("14. PAN Verification Flow")
    add_paragraph("1. Borrower submits 10-character PAN and card photo on `PanScreen.jsx` -> `POST /api/kyc/verify-pan`.")
    add_paragraph("2. Server validates PAN format/Sandbox match, uploads image to Cloudinary, encrypts PAN with AES-256-GCM, saves masked `XXXXXX1234`, and updates `kycCompleted`.")

    # -------------------------------------------------------------
    # SECTION 15: ENCRYPTION ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("15. Cryptographic Encryption Architecture")
    add_paragraph("Sensitive identity numbers (Aadhaar and PAN) are encrypted at rest using AES-256-GCM authenticated encryption (`backend/src/services/encryption.service.js`):")

    add_code_block(
"// AES-256-GCM Implementation (encryption.service.js)\n"
"Algorithm: aes-256-gcm\n"
"Key: Buffer.from(process.env.ENCRYPTION_KEY, 'base64') // 32 bytes\n"
"IV: crypto.randomBytes(12) // 12 bytes initialization vector\n"
"Output Object: {\n"
"  encrypted: string, // hex cipher text\n"
"  iv: string,        // hex IV\n"
"  authTag: string    // hex authentication tag\n"
"}"
    )

    # -------------------------------------------------------------
    # SECTION 16: DATA MASKING
    # -------------------------------------------------------------
    add_heading_1("16. Data Masking Utilities")
    add_paragraph("Utility `maskSensitiveData.js` ensures unencrypted raw identity numbers are never returned in API payloads:")
    add_bullet("Formats `123456789012` -> `XXXX-XXXX-9012`.", "Aadhaar Masking: ")
    add_bullet("Formats `ABCDE1234F` -> `XXXXXX1234`.", "PAN Masking: ")

    # -------------------------------------------------------------
    # SECTION 17: FILE UPLOAD ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("17. File Upload Architecture")
    add_paragraph("File uploads utilize Multer middleware with `multer-storage-cloudinary` adapters (`upload.middleware.js` and `uploadKyc.middleware.js`). Allowed formats: JPEG, PNG, JPG; max file size 5MB.")

    # -------------------------------------------------------------
    # SECTION 18: CLOUDINARY INTEGRATION
    # -------------------------------------------------------------
    add_heading_1("18. Cloudinary Storage Integration")
    add_paragraph("Configured in `backend/src/config/cloudinary.js` using `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. Target folders: `fintech/profile` for avatars; `fintech/kyc` for identity documents.")

    # -------------------------------------------------------------
    # SECTION 19: SANDBOX INTEGRATION
    # -------------------------------------------------------------
    add_heading_1("19. Sandbox.co.in API Integration")
    add_paragraph("API services `sandbox.service.js`, `aadhaar.service.js`, and `pan.service.js` authenticate against `https://test-api.sandbox.co.in` using `x-api-key` and `x-api-secret` headers, caching OAuth tokens for Aadhaar OKYC and PAN validation.")

    # -------------------------------------------------------------
    # SECTION 20: ELIGIBILITY ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("20. Financial Eligibility Architecture")
    add_paragraph("The eligibility engine (`eligibility.service.js`) receives financial profile inputs, computes a deterministic 80-point score, upserts `FinancialProfile` and `Eligibility` MongoDB documents, and returns the breakdown.")

    # -------------------------------------------------------------
    # SECTION 21: ELIGIBILITY FORMULA
    # -------------------------------------------------------------
    add_heading_1("21. Eligibility Scoring Formula")
    add_paragraph("$$\\text{Total Score} = \\text{CIBIL Points} + \\text{Salary Points} + \\text{Loan Points} \\quad (\\text{Max: } 80)$$")
    add_bullet("CIBIL Score: >=750 -> 30, >=700 -> 20, >=650 -> 10, <650 -> 0.", "CIBIL (Max 30): ")
    add_bullet("Monthly Salary: >=₹50,000 -> 20, >=₹30,000 -> 10, <₹30,000 -> 0.", "Salary (Max 20): ")
    add_bullet("Existing Loans: 0 -> 30, 1 -> 20, 2 -> 10, >=3 -> 0.", "Loans (Max 30): ")
    add_bullet("Threshold: Total Score >= 70 -> 'eligible', < 70 -> 'not_eligible'.", "Decision: ")

    # -------------------------------------------------------------
    # SECTION 22: LOAN CATALOG ARCHITECTURE
    # -------------------------------------------------------------
    add_heading_1("22. Loan Catalog Architecture")
    add_paragraph("The catalog uses local static JSON (`mobile/src/data/loans.js`) defining 6 loan products (Personal, Home, Business, Education, Vehicle, Gold) with interest rates, tenure ranges, and mock partner offers.")

    # -------------------------------------------------------------
    # SECTION 23: API ARCHITECTURE & DIRECTORY
    # -------------------------------------------------------------
    add_heading_1("23. API Architecture & Complete Endpoint Directory")
    add_paragraph("The table below documents all existing and planned REST API endpoints in the FinPilot repository:")

    # Table of APIs
    t_api = doc.add_table(rows=11, cols=6)
    t_api.alignment = WD_TABLE_ALIGNMENT.CENTER
    a_headers = ["Method", "Endpoint", "Auth", "Request Payload", "Response Payload", "Implementation Status"]
    for i, h in enumerate(a_headers):
        cell = t_api.cell(0, i)
        set_cell_background(cell, HEX_PRIMARY)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(8.5)

    api_data = [
        ("POST", "/api/auth/send-otp", "Public", "{ phone, email }", "{ message, otp* }", "IMPLEMENTED"),
        ("POST", "/api/auth/verify-otp", "Public", "{ phone, otp }", "{ user, accessToken, refreshToken }", "IMPLEMENTED"),
        ("GET", "/api/profile", "Bearer", "None", "{ user }", "IMPLEMENTED"),
        ("PUT", "/api/profile", "Bearer", "multipart (name, dob, image)", "{ user }", "IMPLEMENTED"),
        ("POST", "/api/kyc/send-aadhaar-otp", "Bearer", "{ aadhaarNumber }", "{ referenceId, message }", "IMPLEMENTED"),
        ("POST", "/api/kyc/verify-aadhaar-otp", "Bearer", "multipart (otp, refId, files)", "{ message, aadhaar }", "IMPLEMENTED"),
        ("POST", "/api/kyc/verify-pan", "Bearer", "multipart (panNumber, file)", "{ message, pan }", "IMPLEMENTED"),
        ("GET", "/api/kyc/status", "Bearer", "None", "{ status, kycCompleted, aadhaar, pan }", "IMPLEMENTED"),
        ("POST", "/api/eligibility/calculate", "Bearer", "{ salary, company, cibilScore... }", "{ score, status, breakdown }", "IMPLEMENTED"),
        ("POST", "/api/loan-applications", "Bearer", "{ loanId, amount, tenure }", "{ application }", "DOCUMENTED / NOT IMPLEMENTED")
    ]

    for row_idx, data in enumerate(api_data, start=1):
        row = t_api.rows[row_idx]
        bg = HEX_ALT_ROW if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.0)
            if col_idx == 5:
                r.font.bold = True
                if "IMPLEMENTED" == text:
                    r.font.color.rgb = RGBColor(22, 163, 74)
                else:
                    r.font.color.rgb = RGBColor(217, 119, 6)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # SECTIONS 24-28: BACKEND STRUCTURE & MIDDLEWARE
    # -------------------------------------------------------------
    add_heading_1("24. Backend Route Structure")
    add_paragraph("Routes are registered in `backend/index.js` under `/api/auth`, `/api/profile`, `/api/kyc`, and `/api/eligibility`.")

    add_heading_1("25. Controller Structure")
    add_paragraph("Controllers (`auth.controller.js`, `profile.controller.js`, `kyc.controller.js`, `eligibility.controller.js`) parse `req.body` and `req.file`, delegate logic to services, and return standardized JSON responses via `utils/response.js`.")

    add_heading_1("26. Service Structure")
    add_paragraph("Services encapsulate standalone business logic: `jwt.service.js`, `otp.service.js`, `encryption.service.js`, `sandbox.service.js`, `aadhaar.service.js`, `pan.service.js`, and `eligibility.service.js`.")

    add_heading_1("27. Payload Validation Structure")
    add_paragraph("Zod validation schemas in `backend/src/validations/` validate incoming API payloads before controller execution, throwing standardized 400 validation errors on mismatch.")

    add_heading_1("28. Middleware Architecture")
    add_bullet("Verifies `Authorization: Bearer <token>` header, decodes JWT, attaches `req.user`.", "auth.middleware.js: ")
    add_bullet("Multer memory storage adapter uploading profile photo to Cloudinary `fintech/profile`.", "upload.middleware.js: ")
    add_bullet("Multer memory storage adapter uploading KYC document images to Cloudinary `fintech/kyc`.", "uploadKyc.middleware.js: ")

    # -------------------------------------------------------------
    # SECTIONS 29-30: DATABASE & MONGOOSE MODELS
    # -------------------------------------------------------------
    add_heading_1("29. Database Architecture")
    add_paragraph("MongoDB database storing 5 active collections. Mongoose ODM handles schemas, type casting, validation, and reference populate hooks.")

    add_heading_1("30. Mongoose Document Schemas")
    add_bullet("Stores phone, email, name, dob, profileImage, gender, address, isVerified, profileCompleted, kycCompleted, refreshToken.", "User.js: ")
    add_bullet("Stores phone, otp, expiresAt, attempts. TTL expiration logic.", "Otp.js: ")
    add_bullet("Stores userId, encrypted aadhaar/pan objects, image URLs, verification flags, and status.", "KYC.js: ")
    add_bullet("Stores userId, monthlySalary, employmentType, company, existingLoans, existingEmi, cibilScore.", "FinancialProfile.js: ")
    add_bullet("Stores user, score, status (eligible/not_eligible), breakdown, calculatedAt.", "Eligibility.js: ")

    # -------------------------------------------------------------
    # SECTIONS 31-35: SECURITY, ERROR & STATE MANAGEMENT
    # -------------------------------------------------------------
    add_heading_1("31. Security Architecture")
    add_paragraph("Security enforced via AES-256-GCM encryption at rest for PII, masked data presentation, and Bearer JWT authentication. Gaps include console PII logging and public Cloudinary bucket URLs.")

    add_heading_1("32. Global Error Handling")
    add_paragraph("Backend `index.js` includes a centralized error middleware returning `{ success: false, message: error.message }` with appropriate 4xx/5xx HTTP status codes.")

    add_heading_1("33. State Management & Persistence")
    add_paragraph("Mobile global state managed via Redux Toolkit slices (`authSlice`, `userSlice`, `kycSlice`, `eligibilitySlice`). `redux-persist` automatically saves `auth` and `kyc` state to `AsyncStorage`.")

    add_heading_1("34. Startup / Session Hydration Flow")
    add_paragraph("1. `StartupScreen.jsx` checks `AsyncStorage` for `accessToken`.\n2. If present, dispatches `getProfile()` -> `GET /api/profile`.\n3. If valid, dispatches `getKycState()` -> `GET /api/kyc/status` and routes to `HomeScreen.jsx`. If invalid, clears tokens and routes to login.")

    add_heading_1("35. Environment Configuration")
    add_code_block(
"// Backend .env Configuration\n"
"PORT=5000\n"
"MONGODB_URI=mongodb://localhost:27017/fintech\n"
"JWT_ACCESS_SECRET=your_jwt_access_secret_key\n"
"JWT_REFRESH_SECRET=your_jwt_refresh_secret_key\n"
"ENCRYPTION_KEY=32_byte_base64_encoded_encryption_key\n"
"CLOUDINARY_CLOUD_NAME=your_cloud_name\n"
"CLOUDINARY_API_KEY=your_cloudinary_api_key\n"
"CLOUDINARY_API_SECRET=your_cloudinary_api_secret\n"
"SANDBOX_API_KEY=key_test_1ada05f8f4024914bbbf6b18ace0e3af\n"
"SANDBOX_API_SECRET=secret_test_9782ecbbba464f029c2831adfbe61970\n"
"USE_MOCK_KYC=true"
    )

    # -------------------------------------------------------------
    # SECTIONS 36-40: TESTING, DEBT, DEPLOYMENT & SETUP
    # -------------------------------------------------------------
    add_heading_1("36. Testing & Quality Assurance")
    add_paragraph("Manual testing executed using ad-hoc Node.js scripts (`test_all_scenarios.js`, `test-encryption.js`). Automated test suites (Jest/Supertest) are not yet implemented.")

    add_heading_1("37. Known Technical Debt")
    add_bullet("Plaintext OTP and PII printed in server logs.", "1. Console PII Logging: ")
    add_bullet("Uploaded Aadhaar/PAN images accessible via unauthenticated Cloudinary URLs.", "2. Public Cloudinary Documents: ")
    add_bullet("Missing `/api/auth/refresh` backend route.", "3. Missing Refresh Endpoint: ")
    add_bullet("Mobile client config hardcodes developer local IP address (`http://192.168.1.4:5000/api`).", "4. Hardcoded Local IP Config: ")

    add_heading_1("38. Production Deployment Considerations")
    add_paragraph("Requires AWS EC2 / ALB deployment for Express server, MongoDB Atlas Mongoose connection string, Cloudinary authenticated bucket migration, and HTTPS domain SSL setup.")

    add_heading_1("39. Proposed Future Architecture")
    add_paragraph("Transition to a microservices architecture separating Auth, KYC Vault, Eligibility Scoring, and Lender Routing, backed by Redis caching and Account Aggregator integration.")

    add_heading_1("40. Developer Setup & Local Execution Guide")
    add_code_block(
"# 1. Start MongoDB Local Instance\n"
"mongod --dbpath /data/db\n\n"
"# 2. Start Backend Server\n"
"cd backend\n"
"npm install\n"
"npm run dev     # Server runs on http://localhost:5000\n\n"
"# 3. Start Mobile Application\n"
"cd mobile\n"
"npm install\n"
"npx expo start  # Press 'a' for Android, 'i' for iOS"
    )

    # Save Document
    output_dir = r"e:\Fintech\docs\reports"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "FinPilot_Technical_Documentation.docx")
    
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    create_document()
