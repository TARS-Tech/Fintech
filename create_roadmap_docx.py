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

    def add_heading_3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(11.5)
        run.font.bold = True
        run.font.color.rgb = COLOR_PRIMARY
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

    def render_phase_block(phase_num, title, objective, features, tech_work, dependencies, outcome, risk, exit_criteria):
        add_heading_1(f"Phase {phase_num}: {title}")
        add_paragraph(objective, bold_prefix="Objective: ")
        
        add_heading_2(f"Phase {phase_num} Key Features")
        for f in features:
            add_bullet(f[1], bold_prefix=f[0])

        add_heading_2(f"Phase {phase_num} Technical Implementation Work")
        for w in tech_work:
            add_bullet(w[1], bold_prefix=w[0])

        t_meta = doc.add_table(rows=4, cols=2)
        t_meta.alignment = WD_TABLE_ALIGNMENT.CENTER
        m_items = [
            ("Dependencies", dependencies),
            ("Expected Outcome", outcome),
            ("Risk Assessment", risk),
            ("Exit Criteria", exit_criteria)
        ]
        for idx, (k, v) in enumerate(m_items):
            row = t_meta.rows[idx]
            bg = HEX_ALT_ROW if idx % 2 == 1 else "FFFFFF"
            cell_k, cell_v = row.cells[0], row.cells[1]
            cell_k.width = Inches(1.8)
            cell_v.width = Inches(4.7)
            set_cell_background(cell_k, bg)
            set_cell_background(cell_v, bg)
            set_cell_margins(cell_k, top=60, bottom=60, left=100, right=100)
            set_cell_margins(cell_v, top=60, bottom=60, left=100, right=100)
            pk = cell_k.paragraphs[0]
            pk.add_run(k).font.bold = True
            pk.runs[0].font.size = Pt(9.0)
            pk.runs[0].font.color.rgb = COLOR_PRIMARY
            pv = cell_v.paragraphs[0]
            pv.add_run(v).font.size = Pt(9.0)
            pv.runs[0].font.color.rgb = COLOR_TEXT

        doc.add_paragraph().paragraph_format.space_after = Pt(8)

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
    run_title = p_cov_title.add_run("FinPilot Platform:\nUpcoming Work & Roadmap")
    run_title.font.name = 'Arial'
    run_title.font.size = Pt(28)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_PRIMARY

    p_cov_sub = doc.add_paragraph()
    p_cov_sub.paragraph_format.space_after = Pt(140)
    run_sub = p_cov_sub.add_run("Strategic Engineering Execution Plan: Security Hardening, Loan Application Engine, Admin Web Portal, Lender Distribution, and Analytics")
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
    hrun = hp.add_run("FinPilot Platform — Upcoming Work & Roadmap | TARS Technologies")
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
    # SECTION 1: EXECUTIVE ROADMAP OVERVIEW
    # -------------------------------------------------------------
    add_heading_1("1. Executive Roadmap Overview")
    add_paragraph("This Upcoming Work & Roadmap document outlines the strategic engineering execution plan to transition FinPilot from its current borrower-facing mobile MVP (~55% overall completion) into a commercial-grade, secure Digital Lead Distribution Platform for TARS Technologies. It answers the central question: 'What do we build next and why?'")

    add_callout(
        "FinPilot Roadmap Core Prioritization Order:\n"
        "1. Security & Compliance Hardening (Weeks 1–3) — Eliminate vulnerabilities before public beta.\n"
        "2. Loan Application Submission Engine (Weeks 4–7) — Enable end-to-end borrower application filing.\n"
        "3. Web Admin Operations Portal (Weeks 8–11) — Build operator dashboard for lead review and qualification.\n"
        "4. Lender Integration & Routing (Weeks 12–16) — Dynamic lender matching and API distribution.\n"
        "5. Intelligence & Conversion Analytics (Weeks 17–24) — Lead quality scoring and routing optimization.",
        title="STRATEGIC EXECUTION ORDER",
        border_hex="1D4ED8"
    )

    # -------------------------------------------------------------
    # SECTION 2: PHASE 1 — SECURITY HARDENING
    # -------------------------------------------------------------
    render_phase_block(
        1, "Security & Compliance Hardening",
        "Remediate all technical debt and critical security vulnerabilities identified during repository auditing to ensure compliance with India's Digital Personal Data Protection (DPDP) Act prior to commercial staging.",
        [
            ("Purge Plaintext Console Logging: ", "Remove all `console.log` statements exposing plaintext 6-digit OTPs and PII (`auth.controller.js:43`, `mockKyc.js:17`, `pan.service.js:7`)."),
            ("Private KYC Document Storage: ", "Configure Cloudinary private storage buckets with time-limited signed URLs for Aadhaar/PAN image access."),
            ("CORS & Rate Limiting: ", "Restrict CORS origins to authorized app domains and attach `express-rate-limit` middleware to `/api/auth/*` routes to block brute-force attacks."),
            ("JWT Token Refresh Route: ", "Implement `/api/auth/refresh` route in backend to handle seamless 30-day token renewals."),
            ("Hardware Mobile Security: ", "Migrate token storage in React Native from plain `AsyncStorage` to hardware-backed `expo-secure-store`."),
            ("Environment & Payload Hardening: ", "Replace hardcoded local IP (`http://192.168.1.4:5000`) with environment configuration; enforce request body payload limits.")
        ],
        [
            ("Security Middleware: ", "Install and configure `helmet`, `express-rate-limit`, and `cors` whitelist middleware in `backend/index.js`."),
            ("Crypto Helper Update: ", "Update `uploadKyc.middleware.js` to set Cloudinary `type: 'authenticated'` and generate 15-minute signed URLs."),
            ("Auth Controller Refactor: ", "Create `refreshTokenController` verifying refresh JWTs against `user.refreshToken` in MongoDB."),
            ("Mobile Auth Service: ", "Refactor `services/auth.js` to utilize `expo-secure-store` for `accessToken` and `refreshToken`.")
        ],
        "Zero environment variables in repo, clean console logs, 0 unauthenticated file URLs.",
        "Zero critical/high security vulnerabilities, complete DPDP compliance, seamless session renewal.",
        "Unresolved security vulnerabilities could expose customer PII or permit OTP session takeover.",
        "100% security audit pass rate; zero plaintext PII logged; signed URLs verified."
    )

    # -------------------------------------------------------------
    # SECTION 3: PHASE 2 — LOAN APPLICATION ENGINE
    # -------------------------------------------------------------
    render_phase_block(
        2, "Loan Application Engine",
        "Engineer the core backend data models and submission workflows enabling borrowers to formally apply for loan products and track application progress.",
        [
            ("LoanApplication Schema: ", "Define Mongoose model tracking `applicationId`, `userId`, `loanCategory`, `requestedAmount`, `tenure`, `status`, and `qualificationStatus`."),
            ("Application Submission APIs: ", "Expose `POST /api/loan-applications`, `GET /api/loan-applications/my`, and `GET /api/loan-applications/:id`."),
            ("Document Association: ", "Attach uploaded KYC document references (`aadhaar`, `pan`, `salarySlip`, `bankStatement`) to application records."),
            ("Proposed Status Lifecycle: ", "Draft -> Submitted -> Under Review -> Verified -> Assigned -> Sent to Lender -> Lender Processing -> Approved / Rejected -> Disbursed (Proposed future design).")
        ],
        [
            ("Model Construction: ", "Create `backend/src/models/loanApplication.model.js` with indexes on `userId`, `status`, and `submittedAt`."),
            ("Controller & Routes: ", "Implement `loanApplication.controller.js` and `loanApplication.route.js` with Zod validation."),
            ("Mobile Integration: ", "Connect mobile `LoanOffersScreen.jsx` 'Apply Now' CTA to the backend submission API.")
        ],
        "Completed Phase 1 (Security Hardening & Token Refresh).",
        "Borrowers can save draft applications, submit formal loan requests, and monitor real-time application status.",
        "Data schema migration risk if loan category requirements expand.",
        "Borrowers successfully submit applications; MongoDB records created with full document associations."
    )

    # -------------------------------------------------------------
    # SECTION 4: PHASE 3 — ADMIN / OPERATIONS PANEL
    # -------------------------------------------------------------
    render_phase_block(
        3, "Admin / Operations Panel",
        "Develop the internal Web Admin Portal and backend management APIs allowing TARS operators to review customer leads, verify documents, and execute manual lead qualification.",
        [
            ("Admin Authentication & RBAC: ", "Admin login endpoint (`POST /api/admin/auth/login`), JWT role validation middleware (`admin.middleware.js`)."),
            ("Operations Queue Dashboard: ", "Real-time queues for Pending Reviews, Verified Leads, Forwarded Applications, and Rejected Files."),
            ("Customer & Lead Detail View: ", "Inspect borrower demographic profile, encrypted Aadhaar/PAN status, financial score, and Cloudinary document preview."),
            ("Lead Qualification Controls: ", "Operator actions to mark leads as 'Qualified' or 'Not Qualified', attach internal notes, and update status.")
        ],
        [
            ("Admin API Development: ", "Build `admin.controller.js` handling `/api/admin/dashboard`, `/api/admin/applications`, and `/api/admin/qualify`."),
            ("React Web Portal: ", "Develop a responsive React.js web admin application with TailwindCSS and Lucide icons."),
            ("Audit Logging: ", "Implement `auditLog.model.js` recording all operator status changes and document access events.")
        ],
        "Completed Phase 2 (Loan Application Backend).",
        "TARS internal operations team possesses full control to review, qualify, and manage incoming borrower applications.",
        "Operator error or delay during manual verification.",
        "Operators successfully login, view customer queues, inspect documents, and update application status."
    )

    # -------------------------------------------------------------
    # SECTION 5: PHASE 4 — LENDER DISTRIBUTION
    # -------------------------------------------------------------
    render_phase_block(
        4, "Lender Integration & Distribution",
        "Transition FinPilot from static loan catalog displays to a dynamic lender matching engine and API lead routing system.",
        [
            ("Dynamic Lender Profiles: ", "Database collections for `Lenders` and `LoanProducts` replacing hardcoded `loans.js`."),
            ("Lender Matching Engine: ", "Automated matching logic evaluating borrower score against specific Bank/NBFC underwriting criteria."),
            ("Lender API Connectors: ", "HTTP Webhook / REST connectors for forwarding pre-qualified lead payloads to partner NBFC APIs."),
            ("Status Synchronization: ", "Webhook listener endpoints receiving real-time approval, rejection, and disbursal updates from lenders.")
        ],
        [
            ("Lender Schema Design: ", "Create `lender.model.js` storing partner bank API keys, eligibility rules, and commission rates."),
            ("Matching Algorithm: ", "Implement `lenderMatching.service.js` prioritizing high-commission, high-probability lender offers."),
            ("Webhook Listener: ", "Build `POST /api/webhooks/lender-status` with HMAC signature validation.")
        ],
        "Completed Phase 3 (Admin Panel & Qualification Queue).",
        "Automated end-to-end lead distribution to partner financial institutions with real-time status updates.",
        "Third-party lender API downtime or schema mismatches.",
        "Lead payload successfully transmitted to lender endpoint; webhook receives status confirmation."
    )

    # -------------------------------------------------------------
    # SECTION 6: PHASE 5 — INTELLIGENCE & ANALYTICS
    # -------------------------------------------------------------
    render_phase_block(
        5, "Intelligence & Analytics",
        "Deploy analytics pipelines and predictive machine learning models to optimize lead routing and maximize commission conversion.",
        [
            ("Conversion Funnel Analytics: ", "Track drop-off rates across OTP registration, KYC completion, eligibility check, and application submission."),
            ("Lender Performance Benchmarking: ", "Analyze approval rates, disbursal turnaround times, and average commission revenue per lender."),
            ("Predictive Lead Scoring: ", "Machine learning model predicting lender approval probability based on historical applicant data.")
        ],
        [
            ("Analytics Pipeline: ", "Integrate aggregation pipelines in MongoDB for real-time dashboard analytics."),
            ("Event Tracking: ", "Implement event logging service recording borrower interactions.")
        ],
        "Completed Phase 4 (Lender API Integrations).",
        "Data-driven routing optimization maximizing platform commission revenue and approval speed.",
        "Insufficient historical sample size for ML model training.",
        "Analytics dashboard active; routing engine automatically prioritizes top-converting lenders."
    )

    # -------------------------------------------------------------
    # SECTION 7: 90-DAY & 6-MONTH ROADMAP SUMMARY
    # -------------------------------------------------------------
    add_heading_1("7. Strategic Delivery Timeline")

    add_heading_2("7.1 90-Day Execution Plan (Near-Term)")
    
    t_90 = doc.add_table(rows=4, cols=4)
    t_90.alignment = WD_TABLE_ALIGNMENT.CENTER
    h90 = ["Timeframe", "Focus Area", "Primary Deliverables", "Target Milestone"]
    for i, h in enumerate(h90):
        cell = t_90.cell(0, i)
        set_cell_background(cell, HEX_PRIMARY)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)
        r.font.size = Pt(9.5)

    data_90 = [
        ("Month 1 (Weeks 1 - 4)", "Security & Application Engine", "Purge console logs, signed URLs, CORS, rate limits, JWT refresh, LoanApplication schema & submission APIs.", "Milestone 4 & 5"),
        ("Month 2 (Weeks 5 - 8)", "Web Admin Panel Development", "React web admin portal, operator lead queue, customer KYC review UI, admin qualification APIs.", "Milestone 6"),
        ("Month 3 (Weeks 9 - 12)", "Dynamic Catalog & Staging QA", "Migrate static loans.js to MongoDB, staging deployment, end-to-end QA, partner pilot testing.", "Commercial Staging")
    ]

    for row_idx, data in enumerate(data_90, start=1):
        row = t_90.rows[row_idx]
        bg = HEX_ALT_ROW if row_idx % 2 == 1 else "FFFFFF"
        for col_idx, text in enumerate(data):
            cell = row.cells[col_idx]
            set_cell_background(cell, bg)
            p = cell.paragraphs[0]
            r = p.add_run(text)
            r.font.size = Pt(8.5)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_heading_2("7.2 6-Month Vision Plan (Medium-Term)")
    add_bullet("Direct API connectors with top 5 NBFC partners, webhook status sync, FCM push notifications.", "Months 4 - 5 (Lender Integration): ")
    add_bullet("Account Aggregator (AA) integration, predictive lead scoring, conversion funnel analytics, commercial expansion.", "Month 6 (Intelligence & Scale): ")

    # Save Document
    output_dir = r"e:\Fintech\docs\reports"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "FinPilot_Upcoming_Work_Roadmap.docx")
    
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == "__main__":
    create_document()
