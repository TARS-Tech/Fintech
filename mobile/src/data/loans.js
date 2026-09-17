// loans.js

export const loans = [
    // =========================================================
    // 1. PERSONAL LOAN
    // =========================================================
    {
        id: "personal-loan",
        name: "Personal Loan",
        slug: "personal-loan",
        category: "personal",
        description:
            "Flexible financing for your personal needs with a simple digital application.",

        amount: {
            min: 50000,
            max: 500000,
            step: 5000,
        },

        tenure: {
            min: 6,
            max: 36,
            unit: "months",
        },

        interestRate: {
            min: 12.99,
            max: 24.99,
            unit: "% p.a.",
        },

        features: [
            "Flexible loan amount",
            "Digital application",
            "Flexible repayment tenure",
        ],

        offers: [
            {
                id: "personal-offer-001",
                partner: {
                    id: "partner-bank-a",
                    name: "Partner Bank A",
                    type: "Bank",
                    logo: "partner-bank-a",
                },
                amount: {
                    min: 50000,
                    max: 500000,
                },
                interestRate: 12.99,
                tenure: {
                    min: 12,
                    max: 36,
                    unit: "months",
                },
                processingFee: "Up to 2%",
                status: "active",
            },

            {
                id: "personal-offer-002",
                partner: {
                    id: "partner-nbfc-a",
                    name: "Partner Finance A",
                    type: "NBFC",
                    logo: "partner-nbfc-a",
                },
                amount: {
                    min: 50000,
                    max: 400000,
                },
                interestRate: 14.49,
                tenure: {
                    min: 12,
                    max: 36,
                    unit: "months",
                },
                processingFee: "Up to 2.5%",
                status: "active",
            },

            {
                id: "personal-offer-003",
                partner: {
                    id: "partner-bank-b",
                    name: "Partner Bank B",
                    type: "Bank",
                    logo: "partner-bank-b",
                },
                amount: {
                    min: 75000,
                    max: 300000,
                },
                interestRate: 16.99,
                tenure: {
                    min: 6,
                    max: 24,
                    unit: "months",
                },
                processingFee: "Up to 2%",
                status: "active",
            },
        ],
    },

    // =========================================================
    // 2. HOME LOAN
    // =========================================================
    {
        id: "home-loan",
        name: "Home Loan",
        slug: "home-loan",
        category: "housing",
        description:
            "Finance your dream home with flexible repayment options and long-term tenure.",

        amount: {
            min: 500000,
            max: 5000000,
            step: 50000,
        },

        tenure: {
            min: 60,
            max: 360,
            unit: "months",
        },

        interestRate: {
            min: 8.5,
            max: 11.5,
            unit: "% p.a.",
        },

        features: [
            "High loan amount",
            "Long repayment tenure",
            "Competitive interest rates",
        ],

        offers: [
            {
                id: "home-offer-001",
                partner: {
                    id: "partner-bank-c",
                    name: "Partner Bank C",
                    type: "Bank",
                    logo: "partner-bank-c",
                },
                amount: {
                    min: 500000,
                    max: 5000000,
                },
                interestRate: 8.5,
                tenure: {
                    min: 60,
                    max: 360,
                    unit: "months",
                },
                processingFee: "Up to 0.5%",
                status: "active",
            },

            {
                id: "home-offer-002",
                partner: {
                    id: "partner-bank-d",
                    name: "Partner Bank D",
                    type: "Bank",
                    logo: "partner-bank-d",
                },
                amount: {
                    min: 1000000,
                    max: 4000000,
                },
                interestRate: 8.75,
                tenure: {
                    min: 60,
                    max: 300,
                    unit: "months",
                },
                processingFee: "Up to 0.5%",
                status: "active",
            },

            {
                id: "home-offer-003",
                partner: {
                    id: "partner-nbfc-b",
                    name: "Partner Finance B",
                    type: "NBFC",
                    logo: "partner-nbfc-b",
                },
                amount: {
                    min: 500000,
                    max: 3000000,
                },
                interestRate: 9.25,
                tenure: {
                    min: 60,
                    max: 240,
                    unit: "months",
                },
                processingFee: "Up to 1%",
                status: "active",
            },
        ],
    },

    // =========================================================
    // 3. BUSINESS LOAN
    // =========================================================
    {
        id: "business-loan",
        name: "Business Loan",
        slug: "business-loan",
        category: "business",
        description:
            "Get funding to manage business expenses, expansion and working capital needs.",

        amount: {
            min: 100000,
            max: 1000000,
            step: 10000,
        },

        tenure: {
            min: 12,
            max: 60,
            unit: "months",
        },

        interestRate: {
            min: 13.5,
            max: 24.0,
            unit: "% p.a.",
        },

        features: [
            "Working capital support",
            "Business expansion funding",
            "Flexible repayment options",
        ],

        offers: [
            {
                id: "business-offer-001",
                partner: {
                    id: "partner-bank-e",
                    name: "Partner Bank E",
                    type: "Bank",
                    logo: "partner-bank-e",
                },
                amount: {
                    min: 100000,
                    max: 1000000,
                },
                interestRate: 13.5,
                tenure: {
                    min: 12,
                    max: 60,
                    unit: "months",
                },
                processingFee: "Up to 2%",
                status: "active",
            },

            {
                id: "business-offer-002",
                partner: {
                    id: "partner-nbfc-c",
                    name: "Partner Finance C",
                    type: "NBFC",
                    logo: "partner-nbfc-c",
                },
                amount: {
                    min: 100000,
                    max: 750000,
                },
                interestRate: 15.5,
                tenure: {
                    min: 12,
                    max: 48,
                    unit: "months",
                },
                processingFee: "Up to 2.5%",
                status: "active",
            },

            {
                id: "business-offer-003",
                partner: {
                    id: "partner-bank-f",
                    name: "Partner Bank F",
                    type: "Bank",
                    logo: "partner-bank-f",
                },
                amount: {
                    min: 200000,
                    max: 800000,
                },
                interestRate: 17.25,
                tenure: {
                    min: 12,
                    max: 60,
                    unit: "months",
                },
                processingFee: "Up to 2%",
                status: "active",
            },
        ],
    },

    // =========================================================
    // 4. EDUCATION LOAN
    // =========================================================
    {
        id: "education-loan",
        name: "Education Loan",
        slug: "education-loan",
        category: "education",
        description:
            "Finance higher education expenses including tuition, accommodation and related costs.",

        amount: {
            min: 100000,
            max: 2000000,
            step: 25000,
        },

        tenure: {
            min: 36,
            max: 180,
            unit: "months",
        },

        interestRate: {
            min: 9.5,
            max: 14.5,
            unit: "% p.a.",
        },

        features: [
            "Tuition fee support",
            "Long repayment tenure",
            "Education-focused financing",
        ],

        offers: [
            {
                id: "education-offer-001",
                partner: {
                    id: "partner-bank-g",
                    name: "Partner Bank G",
                    type: "Bank",
                    logo: "partner-bank-g",
                },
                amount: {
                    min: 100000,
                    max: 2000000,
                },
                interestRate: 9.5,
                tenure: {
                    min: 36,
                    max: 180,
                    unit: "months",
                },
                processingFee: "Up to 1%",
                status: "active",
            },

            {
                id: "education-offer-002",
                partner: {
                    id: "partner-bank-h",
                    name: "Partner Bank H",
                    type: "Bank",
                    logo: "partner-bank-h",
                },
                amount: {
                    min: 100000,
                    max: 1500000,
                },
                interestRate: 10.25,
                tenure: {
                    min: 36,
                    max: 144,
                    unit: "months",
                },
                processingFee: "Up to 1%",
                status: "active",
            },

            {
                id: "education-offer-003",
                partner: {
                    id: "partner-nbfc-d",
                    name: "Partner Finance D",
                    type: "NBFC",
                    logo: "partner-nbfc-d",
                },
                amount: {
                    min: 100000,
                    max: 1000000,
                },
                interestRate: 12.5,
                tenure: {
                    min: 36,
                    max: 120,
                    unit: "months",
                },
                processingFee: "Up to 1.5%",
                status: "active",
            },
        ],
    },

    // =========================================================
    // 5. VEHICLE LOAN
    // =========================================================
    {
        id: "vehicle-loan",
        name: "Vehicle Loan",
        slug: "vehicle-loan",
        category: "vehicle",
        description:
            "Finance your new or used vehicle with flexible repayment options.",

        amount: {
            min: 100000,
            max: 2000000,
            step: 10000,
        },

        tenure: {
            min: 12,
            max: 84,
            unit: "months",
        },

        interestRate: {
            min: 9.25,
            max: 15.5,
            unit: "% p.a.",
        },

        features: [
            "New and used vehicle financing",
            "Flexible tenure",
            "Competitive rates",
        ],

        offers: [
            {
                id: "vehicle-offer-001",
                partner: {
                    id: "partner-bank-i",
                    name: "Partner Bank I",
                    type: "Bank",
                    logo: "partner-bank-i",
                },
                amount: {
                    min: 100000,
                    max: 2000000,
                },
                interestRate: 9.25,
                tenure: {
                    min: 12,
                    max: 84,
                    unit: "months",
                },
                processingFee: "Up to 1%",
                status: "active",
            },

            {
                id: "vehicle-offer-002",
                partner: {
                    id: "partner-bank-j",
                    name: "Partner Bank J",
                    type: "Bank",
                    logo: "partner-bank-j",
                },
                amount: {
                    min: 100000,
                    max: 1500000,
                },
                interestRate: 10.25,
                tenure: {
                    min: 12,
                    max: 72,
                    unit: "months",
                },
                processingFee: "Up to 1%",
                status: "active",
            },

            {
                id: "vehicle-offer-003",
                partner: {
                    id: "partner-nbfc-e",
                    name: "Partner Finance E",
                    type: "NBFC",
                    logo: "partner-nbfc-e",
                },
                amount: {
                    min: 100000,
                    max: 1000000,
                },
                interestRate: 12.75,
                tenure: {
                    min: 12,
                    max: 60,
                    unit: "months",
                },
                processingFee: "Up to 2%",
                status: "active",
            },
        ],
    },

    // =========================================================
    // 6. GOLD LOAN
    // =========================================================
    {
        id: "gold-loan",
        name: "Gold Loan",
        slug: "gold-loan",
        category: "secured",
        description:
            "Access funds against eligible gold jewellery with flexible repayment options.",

        amount: {
            min: 25000,
            max: 500000,
            step: 5000,
        },

        tenure: {
            min: 3,
            max: 36,
            unit: "months",
        },

        interestRate: {
            min: 9.99,
            max: 18.0,
            unit: "% p.a.",
        },

        features: [
            "Gold-backed financing",
            "Flexible repayment options",
            "Quick application process",
        ],

        offers: [
            {
                id: "gold-offer-001",
                partner: {
                    id: "partner-bank-k",
                    name: "Partner Bank K",
                    type: "Bank",
                    logo: "partner-bank-k",
                },
                amount: {
                    min: 25000,
                    max: 500000,
                },
                interestRate: 9.99,
                tenure: {
                    min: 3,
                    max: 36,
                    unit: "months",
                },
                processingFee: "Up to 1%",
                status: "active",
            },

            {
                id: "gold-offer-002",
                partner: {
                    id: "partner-nbfc-f",
                    name: "Partner Finance F",
                    type: "NBFC",
                    logo: "partner-nbfc-f",
                },
                amount: {
                    min: 25000,
                    max: 400000,
                },
                interestRate: 11.5,
                tenure: {
                    min: 3,
                    max: 24,
                    unit: "months",
                },
                processingFee: "Up to 1.5%",
                status: "active",
            },

            {
                id: "gold-offer-003",
                partner: {
                    id: "partner-bank-l",
                    name: "Partner Bank L",
                    type: "Bank",
                    logo: "partner-bank-l",
                },
                amount: {
                    min: 50000,
                    max: 300000,
                },
                interestRate: 13.25,
                tenure: {
                    min: 6,
                    max: 24,
                    unit: "months",
                },
                processingFee: "Up to 1%",
                status: "active",
            },
        ],
    },
];