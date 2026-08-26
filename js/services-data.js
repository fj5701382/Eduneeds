/* =========================================================
   Eduneeds — SERVICES DATA
   All scratch card / result services
   ========================================================= */

var SERVICES_DATA = {

    // =========================================
    // SCRATCH CARDS / RESULT SERVICES (9)
    // =========================================

    'waec-scratch': {
        slug: 'waec-scratch',
        name: 'WAEC Scratch Card',
        price: 3500,
        desc: 'Official WAEC Result checking PIN. Valid for all WAEC examinations including May/June and Nov/Dec GCE. Each card allows for a maximum of 5 uses.',
        inStock: true,
        priceTiers: [
            { min: 1, max: 4, price: 3500 },
            { min: 5, max: 19, price: 3400 },
            { min: 20, max: 49, price: 3300 },
            { min: 50, max: null, price: 3200 }
        ],
        instructions: [
            'Visit the official WAEC result checking portal.',
            'Enter your Examination Number, Year, and Type.',
            'Input the purchased PIN and Serial Number.',
            'Click "Submit" to view and print your result.'
        ]
    },

    'neco-token': {
        slug: 'neco-token',
        name: 'NECO Result Token',
        price: 1300,
        desc: 'Official NECO result token for checking NECO examination results online. Secure and instant delivery.',
        inStock: true,
        priceTiers: [
            { min: 1, max: 4, price: 1300 },
            { min: 5, max: 19, price: 1250 },
            { min: 20, max: 49, price: 1200 },
            { min: 50, max: null, price: 1150 }
        ],
        instructions: [
            'Visit the official NECO result checking portal.',
            'Enter your examination number.',
            'Select the examination year.',
            'Enter the NECO token code.',
            'Click Submit to view and print your result.'
        ]
    },

    'nabteb-scratch': {
        slug: 'nabteb-scratch',
        name: 'NABTEB Scratch Card',
        price: 1000,
        desc: 'Official NABTEB scratch card for checking NABTEB examination results online. Valid for all NABTEB examinations.',
        inStock: true,
        priceTiers: [
            { min: 1, max: 4, price: 1000 },
            { min: 5, max: 19, price: 950 },
            { min: 20, max: 49, price: 900 },
            { min: 50, max: null, price: 850 }
        ],
        instructions: [
            'Visit the official NABTEB Result Checking Portal.',
            'Enter your candidate number.',
            'Select the examination type and year.',
            'Enter the Serial number from the scratch card.',
            'Enter the PIN code and click Submit to view your result.'
        ]
    },

    'nbais-scratch': {
        slug: 'nbais-scratch',
        name: 'NBAIS Scratch Card',
        price: 900,
        desc: 'Official NBAIS scratch card for checking NBAIS examination results. Valid for Arabic and Islamic studies examinations.',
        inStock: true,
        priceTiers: [
            { min: 1, max: 4, price: 900 },
            { min: 5, max: 19, price: 850 },
            { min: 20, max: 49, price: 800 },
            { min: 50, max: null, price: 750 }
        ],
        instructions: [
            'Visit the official NBAIS result checking portal.',
            'Enter your candidate number.',
            'Select the examination year.',
            'Enter the Serial number from the scratch card.',
            'Enter the PIN code and click Submit to view your result.'
        ]
    },

    'waec-gce': {
        slug: 'waec-gce',
        name: 'WAEC GCE Registration PIN',
        price: 16500,
        desc: 'Official WAEC GCE registration pin for private candidates. Valid for Nov/Dec GCE examinations.',
        inStock: true,
        priceTiers: [
            { min: 1, max: 4, price: 16500 },
            { min: 5, max: 19, price: 16000 },
            { min: 20, max: 49, price: 15500 },
            { min: 50, max: null, price: 15000 }
        ],
        instructions: [
            'Visit the WAEC GCE registration portal.',
            'Create a profile or log in with existing credentials.',
            'Enter your personal and academic details.',
            'Input the registration pin code.',
            'Review your application and submit.',
            'Print your confirmation and exam docket.'
        ]
    },

    'neco-verification': {
        slug: 'neco-verification',
        name: 'NECO Result Verification PIN',
        price: 1000,
        desc: 'Official NECO result verification PIN for verifying NECO results online. Used for authentication and verification purposes.',
        inStock: true,
        priceTiers: [
            { min: 1, max: 4, price: 1000 },
            { min: 5, max: 19, price: 950 },
            { min: 20, max: 49, price: 900 },
            { min: 50, max: null, price: 850 }
        ],
        instructions: [
            'Visit the NECO verification portal.',
            'Enter the candidate details.',
            'Input the verification PIN code.',
            'Click Verify to confirm and authenticate the result.'
        ]
    },

    'waec-verification': {
        slug: 'waec-verification',
        name: 'WAEC Verification PIN NYSC',
        price: 1500,
        desc: 'Official WAEC verification pin for NYSC mobilization. Used to verify WAEC results for National Youth Service Corps registration.',
        inStock: true,
        priceTiers: [
            { min: 1, max: 4, price: 1500 },
            { min: 5, max: 19, price: 1450 },
            { min: 20, max: 49, price: 1400 },
            { min: 50, max: null, price: 1350 }
        ],
        instructions: [
            'Visit the WAEC verification portal for NYSC.',
            'Enter your examination number.',
            'Select the examination year.',
            'Enter the verification PIN.',
            'Verify your result for NYSC mobilization.'
        ]
    },

    'nabteb-olevel': {
        slug: 'nabteb-olevel',
        name: 'NABTEB Nov/Dec O-Level',
        price: 23500,
        desc: 'Official NABTEB Nov/Dec O-Level registration pin. For ordinary level examinations in Nigeria.',
        inStock: true,
        priceTiers: [
            { min: 1, max: 4, price: 23500 },
            { min: 5, max: 19, price: 23000 },
            { min: 20, max: 49, price: 22500 },
            { min: 50, max: null, price: 22000 }
        ],
        instructions: [
            'Visit the official NABTEB Nov/Dec registration portal.',
            'Register the candidate using NABTEB offline application software.',
            'Create username and password for each candidate.',
            'Enter the registration pin to complete the process.',
            'Submit application and print the exam photocard.'
        ]
    },

    'nabteb-alevel': {
        slug: 'nabteb-alevel',
        name: 'NABTEB Nov/Dec A-Level',
        price: 27000,
        desc: 'Official NABTEB Nov/Dec A-Level registration pin. For advanced level examinations in Nigeria.',
        inStock: true,
        priceTiers: [
            { min: 1, max: 4, price: 27000 },
            { min: 5, max: 19, price: 26500 },
            { min: 20, max: 49, price: 26000 },
            { min: 50, max: null, price: 25500 }
        ],
        instructions: [
            'Visit the official NABTEB registration portal.',
            'Enter your personal details and examination information.',
            'Input the registration pin code.',
            'Complete the registration form and submit.',
            'Print your examination photocard.'
        ]
    }

};