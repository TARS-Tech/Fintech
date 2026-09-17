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
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = COLOR_TEXT

    # Helpers
    def set_cell_background(cell, fill_hex):
        shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        cell._tc.get_or_add_tcPr().append(shading_elm)

    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
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
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(18)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
        return p

    def add_heading_2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = COLOR_SECONDARY
        return p

    def add_paragraph(text, bold_prefix=None, italic=False):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(6)
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
        p.paragraph_format.space_after = Pt(4)
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

    def add_callout(text, title=None, border_hex="1D4ED8", fill_hex="F8FAFC"):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        table.autofit = False
        cell = table.cell(0, 0)
        cell.width = Inches(6.5)
        set_cell_background(cell, fill_hex)
        set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

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
            r_title.font.size = Pt(10.5)
            r_title.font.color.rgb = COLOR_SECONDARY
        r_text = p.add_run(text)
        r_text.font.name = 'Arial'
        r_text.font.size = Pt(9.5)
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
    run_title = p_cov_title.add_run("FinPilot Platform:\nProject Progress Report")
    run_title.font.name = 'Arial'
    run_title.font.size = Pt(28)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_PRIMARY

    p_cov_sub = doc.add_paragraph()
    p_cov_sub.paragraph_format.space_after = Pt(140)
    run_sub = p_cov_sub.add_run("Comprehensive Engineering Milestone Status, Module Matrix, Defect Audit, and Progress Assessment")
    run_sub.font.name = 'Arial'
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = COLOR_MUTED

    # Cover Metadata Block Table
    meta_table = doc.add_table(rows=5, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Project Name:", "FinPilot (Digital Loan Distribution Platform)"),
        ("Prepared For:", "Corporate Project Review Committee — TARS Technologies"),
        ("Author / Lead:", "Senior Software Architect & Technical Documentation Lead"),
        ("Document Classification:", "Confidential — Internal Corporate Review"),
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
    hrun = hp.add_run("FinPilot Platform — Project Progress Report | TARS Technologies")
    hrun.font.name = 'Arial'
    hrun.font.size = Pt(8.5)
    hrun.font.color.rgb = COLOR_MUTED

    footer = section.footer
    fp = footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.LEFT
    frun = fp.add_run("CONFIDENTIAL — FOR INTERNAL CORPORATE REVIEW ONLY")
    frun.font.name = 'Arial'
    frun.font.size = Pt(8.5)
    frun.font.color.rgb = COLOR_MUTED

    # -------------------------------------------------------------
    # SECTION 1: EXECUTIVE PROGRESS SUMMARY
    # -------------------------------------------------------------
    add_heading_1("1. Executive Progress Summary")
    add_paragraph("This Project Progress Report presents an objective, evidence-based accounting of the current development status of FinPilot at TARS Technologies. The report evaluates completed milestones, partial implementations, pending features, security debt, and operational blockers based strictly on empirical codebase verification from the repository (`e:\\Fintech`).")

    add_callout(
        "Current Platform Completion Estimate: ~55% Overall MVP Completion\n"
        "(Note: Internal engineering estimate based on codebase code-to-specification ratio; not a formal corporate KPI).\n\n"
        "Current State Summary: The borrower-facing MVP foundation is substantially developed, while operational DSA workflows and lender distribution remain future work.",
        title="EXECUTIVE PROGRESS SNAPSHOT",
        border_hex="1D4ED8"
    )

    add_paragraph("Key Achievement Highlights:")
    add_bullet("Completed robust mobile registration, 6-digit OTP generation/verification, JWT access token (`7d`) and refresh token (`30d`) issuance, Redux store persistence, and startup session hydration (`StartupScreen.jsx`).", "Authentication & Session Engine: ")
    add_bullet("Delivered complete demographic profile forms, date/gender pickers, address management, and profile picture uploads to Cloudinary (`fintech/profile`).", "User Profile Management: ")
    add_bullet("Engineered end-to-end Aadhaar OKYC and PAN verification via Sandbox.co.in integration (with offline `USE_MOCK_KYC` toggle), AES-256-GCM encryption at rest, and masked data formatting (`XXXX-XXXX-1234`, `XXXXXX1234`).", "Digital KYC Vault: ")
    add_bullet("Implemented the 80-point deterministic financial scoring algorithm evaluating CIBIL score, monthly salary, and active loan counts, with MongoDB persistence across `FinancialProfile` and `Eligibility` collections.", "Eligibility Scoring Engine: ")
    add_bullet("Developed a high-polish React Native UI featuring custom collapsible headers, animated skeleton loaders, interactive loan sliders, and a bento-grid loan explorer.", "Borrower Mobile UX: ")

    # -------------------------------------------------------------
    # SECTION 2: PROJECT TIMELINE & MILESTONES
    # -------------------------------------------------------------
    add_heading_1("2. Project Timeline & Milestone History")
    add_paragraph("The development trajectory of FinPilot has progressed through three primary execution sprints:")

    add_bullet("Initial repository scaffolding (`/backend` and `/mobile`), Express server configuration, MongoDB Mongoose schema design (`User`, `Otp`), and Redux store architecture.", "Milestone 1 — Core Architecture & Authentication: ")
    add_bullet("Development of `ProfileScreen.jsx`, `KycScreen.jsx`, `AadhaarScreen.jsx`, `PanScreen.jsx`, integration with Sandbox.co.in APIs, and implementation of `encryption.service.js` (AES-256-GCM).", "Milestone 2 — Profile & Digital KYC Vault: ")
    add_bullet("Backend `eligibility.service.js` scoring logic, MongoDB persistence (`FinancialProfile`, `Eligibility`), mobile `EligibilityScreen.jsx` UI, and `LoanExplorerScreen.jsx` static catalog.", "Milestone 3 — Financial Profile & Scoring Engine: ")

    # -------------------------------------------------------------
    # SECTION 3: MODULE-WISE PROGRESS ASSESSMENT
    # -------------------------------------------------------------
    add_heading_1("3. Module-Wise Progress Assessment")
    add_paragraph("The following subsections provide a detailed technical audit of progress across each core functional module.")

    add_heading_2("3.1 Backend Architecture Progress")
    add_paragraph("The Node.js/Express backend (`backend/src`) is operational for borrower endpoints. Controllers for `auth`, `profile`, `kyc`, and `eligibility` are implemented with Zod payload validation schemas (`validations/`). Cryptographic helpers (`encryption.service.js`) and API integration services (`sandbox.service.js`, `aadhaar.service.js`, `pan.service.js`) are fully functional.")

    add_heading_2("3.2 Mobile App Architecture Progress")
    add_paragraph("The React Native mobile application (`mobile/src`) contains 17 active screen views. Navigation state is handled by `AppRouter.jsx` and `RootNavigator.js`. Global state is orchestrated via Redux Toolkit slices (`authSlice`, `userSlice`, `kycSlice`, `eligibilitySlice`) with `redux-persist` caching session tokens in AsyncStorage.")

    add_heading_2("3.3 Authentication & Session Management")
    add_paragraph("Phone OTP generation and verification APIs are 100% functional. JWT access tokens (`7d`) and refresh tokens (`30d`) are generated upon verification. However, backend routes lack a `/api/auth/refresh` endpoint to handle seamless token renewal.")

    add_heading_2("3.4 User Profile Module")
    add_paragraph("Profile fetching (`GET /api/profile`) and profile updating (`PUT /api/profile`) are 100% complete. Multipart profile image uploads are stored in Cloudinary folder `fintech/profile`.")

    add_heading_2("3.5 Digital KYC Module")
    add_paragraph("Aadhaar OKYC (OTP send/verify) and PAN verification are 100% functional via Sandbox.co.in or mock mode (`USE_MOCK_KYC=true`). Raw Aadhaar/PAN numbers are encrypted with AES-256-GCM. Cloudinary storage handles image uploads (`fintech/kyc`).")

    add_heading_2("3.6 Financial Profile & Eligibility Scoring")
    add_paragraph("The 80-point scoring algorithm is 100% implemented in `eligibility.service.js`. Inputs (salary, company, employment type, active loans, EMI, CIBIL) are saved to `FinancialProfile`, scored, and saved to `Eligibility` collection. Results are displayed via modal in `EligibilityScreen.jsx`.")

    add_heading_2("3.7 Loan Explorer & Product Catalog")
    add_paragraph("The loan catalog UI is 100% functional, showcasing 6 loan categories (Personal, Home, Business, Education, Vehicle, Gold) with loan amount sliders (`LoanAmountSelector.jsx`). However, catalog data is static local JSON (`loans.js`) rather than database-driven.")

    add_heading_2("3.8 Security & Hardening Progress")
    add_paragraph("AES-256-GCM encryption and masked identifiers are implemented. However, production security hardening is incomplete due to console PII logging, public Cloudinary URLs, open CORS, missing rate limiting, and unencrypted token storage.")

    add_heading_2("3.9 Testing & Quality Assurance Progress")
    add_paragraph("Testing is currently limited to ad-hoc Node.js scripts (`test_all_scenarios.js`, `test-encryption.js`). Automated Jest unit tests and integration suites are 0% implemented.")

    add_heading_2("3.10 Technical Documentation Progress")
    add_paragraph("Architectural documentation (`docs/01-product.md` through `07-api.md`) is 100% complete.")

    # -------------------------------------------------------------
    # SECTION 4: IMPLEMENTED VS PENDING MATRIX
    # -------------------------------------------------------------
    add_heading_1("4. Implemented vs. Pending Module Matrix")
    add_paragraph("The matrix below outlines the completion status, empirical evidence, and remaining work for every system module:")

    # Table of Progress Matrix
    t_mat = doc.add_table(rows=9, cols=5)
    t_mat.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Module Name", "Status", "Est. Completion", "Codebase Evidence", "Remaining Work"]
    for i, h in enumerate(headers):
        cell = t_mat.cell(0, i)
        set_cell_background(cell, HEX_PRIMARY)
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9.0)

    matrix_data = [
        ("Authentication & Session", "COMPLETED*", "85%", "auth.controller.js, jwt.service.js, AuthNavigator.jsx", "Implement /api/auth/refresh endpoint, add rate limiting."),
        ("User Profile Vault", "COMPLETED", "90%", "profile.controller.js, User.js model, ProfileScreen.jsx", "Address pincode verification API."),
        ("Digital KYC Vault", "COMPLETED*", "85%", "kyc.controller.js, encryption.service.js, AadhaarScreen.jsx", "Secure Cloudinary signed URLs, DigiLocker integration."),
        ("Eligibility Engine", "COMPLETED", "90%", "eligibility.service.js, FinancialProfile model, EligibilityScreen.jsx", "Real-time bureau credit score pull API."),
        ("Loan Catalog UI", "IN PROGRESS", "60%", "loans.js, LoanExplorerScreen.jsx, LoanOffersScreen.jsx", "Migrate static loans.js to MongoDB collection & dynamic API."),
        ("Loan Application Engine", "NOT STARTED", "0%", "Docs specify LoanApplication model (absent in code)", "Create LoanApplication schema, submission API, status lifecycle."),
        ("Admin Web Portal", "NOT STARTED", "0%", "Docs specify admin panel (absent in code)", "Develop Express admin routes and React web admin portal."),
        ("Security Hardening", "IN PROGRESS", "40%", "encryption.service.js, maskSensitiveData.js implemented", "Remove console PII logs, restrict CORS, hardware SecureStore.")
    ]

    for row_idx, data in enumerate(matrix_data, start=1):
        row = t_mat.rows[row_idx]
        bg = HEX_ALT_ROW if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=80, right=80)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if col_idx == 1:
                r.font.bold = True
                if "COMPLETED" in text:
                    r.font.color.rgb = RGBColor(22, 163, 74)
                elif "PROGRESS" in text:
                    r.font.color.rgb = RGBColor(29, 78, 216)
                else:
                    r.font.color.rgb = RGBColor(220, 38, 38)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # -------------------------------------------------------------
    # SECTION 5: KNOWN ISSUES & CURRENT BLOCKERS
    # -------------------------------------------------------------
    add_heading_1("5. Known Technical Issues & Blockers")
    add_paragraph("An audit of code execution highlights four technical issues and operational blockers that must be resolved prior to commercial staging:")

    add_heading_2("5.1 Technical Security Issues")
    add_bullet("Plaintext OTPs and sensitive PII (PAN, Aadhaar, DOB) are printed in server console logs (`auth.controller.js:43`, `pan.service.js:7`).", "1. PII Console Leakage: ")
    add_bullet("Uploaded Aadhaar/PAN images are stored in public Cloudinary buckets without signed access tokens.", "2. Public Cloudinary Access: ")
    add_bullet("Mobile client hardcodes developer local IP address (`http://192.168.1.4:5000/api`) in `mobile/src/services/api.js`.", "3. Hardcoded Local IP Config: ")
    add_bullet("Mobile client stores session tokens in plain `AsyncStorage` instead of hardware `SecureStore`.", "4. Unencrypted Mobile Storage: ")

    add_heading_2("5.2 Operational Blockers")
    add_callout(
        "BLOCKER 1: Absence of Web Admin Panel — TARS internal operators currently have no web dashboard to view, qualify, or forward customer leads stored in MongoDB.\n\n"
        "BLOCKER 2: Absence of Loan Application Backend — Customers cannot submit formal loan applications because the `LoanApplication` schema and backend submission API do not exist.",
        title="PRIMARY OPERATIONAL BLOCKERS",
        border_hex="DC2626",
        fill_hex="FEF2F2"
    )

    # -------------------------------------------------------------
    # SECTION 6: OVERALL PROGRESS ASSESSMENT
    # -------------------------------------------------------------
    add_heading_1("6. Overall Progress Assessment")
    add_paragraph("The overall engineering progress of the FinPilot platform is summarized below:")

    add_bullet("Focuses on registration, profile, digital KYC, eligibility scoring, and loan discovery. Functional completion: ~85%.", "Borrower Mobile App (B2C MVP): ")
    add_bullet("Supports auth, profile, KYC, and eligibility endpoints. Functional completion: ~70%.", "Backend Core REST API: ")
    add_bullet("Admin panel, lead queue, manual verification, and lender routing. Functional completion: 0%.", "Admin Operations & DSA Distribution: ")

    add_paragraph("Combining all functional layers, the overall project completion is estimated at ~55% of the total target MVP vision.")

    # -------------------------------------------------------------
    # SECTION 7: NEXT IMMEDIATE MILESTONES
    # -------------------------------------------------------------
    add_heading_1("7. Next Immediate Milestones")
    add_paragraph("The engineering team will focus on three immediate execution targets:")

    add_bullet("Purge console logs, secure Cloudinary signed URLs, restrict CORS, add rate limiting, and implement `/api/auth/refresh` endpoint.", "Milestone 4 — Security Hardening (Weeks 1 - 3): ")
    add_bullet("Create `LoanApplication` model, submission controllers, status lifecycle, and tracking APIs.", "Milestone 5 — Application Submission Engine (Weeks 4 - 6): ")
    add_bullet("Develop Express admin controllers and React web admin portal for operational lead management.", "Milestone 6 — Web Admin Operations Portal (Weeks 7 - 10): ")

    # Save Document
    output_dir = r"e:\Fintech\docs\reports"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "FinPilot_Project_Progress_Report.docx")
    
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    create_document()
