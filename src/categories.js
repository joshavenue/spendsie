// Personal Account Category Keywords
export const PERSONAL_CATEGORIES = {
  'Food & Dining': {
    keywords: [
      // International Fast Food
      'restaurant', 'cafe', 'coffee', 'food', 'dining', 'mcd', 'mcdonalds', "mcdonald's", 'kfc', 'pizza', 'pizza hut',
      'domino', "domino's", 'burger king', 'subway', 'wendys', "wendy's", 'taco bell', "carl's jr", 'a&w',
      // Malaysian Fast Food & Chains
      'marrybrown', 'texas chicken', 'nandos', "nando's", 'kenny rogers', 'the chicken rice shop', 'tcrs',
      'secret recipe', 'oldtown', 'old town', 'papparich', 'pappa rich', 'mamak', 'kopitiam',
      // Asian Chains
      'sushi', 'sushi king', 'sushi zanmai', 'sakae sushi', 'genki sushi', 'boat noodle', 'absolute thai',
      'kim gary', 'dragon-i', 'paradise inn', 'nan xiang', 'din tai fung', 'ramen', 'ichiban',
      // Cafes & Coffee
      'starbucks', 'coffee bean', 'zus coffee', 'zus', 'luckin coffee', 'luckin', 'dôme', 'dome cafe',
      'san francisco coffee', "toby's estate", 'bean brothers', 'breakfast thieves', 'vCR',
      // Bubble Tea & Desserts
      'tealive', 'gong cha', 'tiger sugar', 'the alley', 'daboba', 'liho', 'each a cup', 'coolblog',
      'chatime', 'share tea', 'koi', 'llao llao', 'baskin robbins', 'haagen dazs', 'inside scoop',
      // Bakeries
      'tous les jours', 'lavender', 'rt pastry', 'breadtalk', 'rotiboy', 'komugi', 'barcook',
      // Food Delivery
      'foodpanda', 'grabfood', 'shopeefood', 'delivereat',
      // Local Keywords
      'restoran', 'kedai makan', 'warung', 'gerai', 'nasi', 'mee', 'laksa', 'char kuey teow',
      'roti canai', 'dim sum', 'steamboat', 'bbq', 'buffet', 'catering',
    ],
    priority: 2,
  },
  'Grab/E-hailing': {
    keywords: [
      'grab', 'grabcar', 'grabpay', 'gojek', 'maxim', 'mula', 'airasia ride',
      'indriver', 'riding pink', 'dacsee', 'jomride',
    ],
    priority: 1,
  },
  'EV & Petrol': {
    keywords: [
      // Petrol Stations
      'petrol', 'petronas', 'shell', 'petron', 'caltex', 'bhp', 'oil', 'fuel',
      // EV Charging
      'ev charging', 'chargev', 'charge ev', 'jomcharge', 'gentari', 'yinson greentech',
      'dc hansa', 'plus xcharge', 'tnb electron', 'plugshare', 'evme',
    ],
    priority: 1,
  },
  'Shopping': {
    keywords: [
      // Department Stores
      'parkson', 'aeon', 'isetan', 'sogo', 'metrojaya', 'mydin', 'econsave', 'nsk',
      // Hypermarkets & Supermarkets
      'tesco', 'giant', 'lotus', "lotus's", 'village grocer', 'cold storage', 'jaya grocer', 'mercato',
      'ben', 'sam', 'hero', 'speedmart', '99 speedmart', 'kk mart', 'family mart', '7-eleven', '7eleven',
      // Shopping Malls (common in transaction descriptions)
      'pavilion', 'mid valley', 'sunway pyramid', 'one utama', 'ioi city', 'bangsar village',
      // Fashion & Retail
      'uniqlo', 'h&m', 'zara', 'cotton on', 'padini', 'nike', 'adidas', 'puma', 'new balance',
      'vincci', 'bata', 'charles & keith', 'skechers', 'mr diy', 'daiso', 'kaison',
      // Electronics
      'harvey norman', 'senq', 'courts', 'best denki', 'challenger',
      // Online Shopping
      'lazada', 'shopee', 'zalora', 'amazon', 'taobao', 'aliexpress', 'shein',
    ],
    priority: 2,
  },
  'Entertainment': {
    keywords: [
      // Cinema
      'tgv', 'gsc', 'golden screen', 'mbo cinema', 'cinema', 'movie', 'mmcineplexes', 'dadi cinema',
      // Gaming & Digital
      'steam', 'playstation', 'xbox', 'nintendo', 'epic games', 'riot', 'garena', 'razer',
      // Theme Parks & Attractions
      'sunway lagoon', 'genting', 'legoland', 'escape', 'desaru', 'kidzania',
      // Music & Events
      'spotify', 'apple music', 'joox', 'kkbox', 'ticketmaster', 'eventbrite', 'ticket',
      // Hobbies
      'popular bookstore', 'mph', 'kinokuniya', 'times bookstore', 'hobby',
    ],
    priority: 2,
  },
  'Healthcare': {
    keywords: [
      // Hospitals
      'hospital', 'kpj', 'sunway medical', 'gleneagles', 'pantai hospital', 'columbia asia',
      'prince court', 'tung shin', 'assunta', 'sjmc', 'hsa', 'klinik',
      // Pharmacy
      'pharmacy', 'guardian', 'watsons', 'caring', 'alpro', 'big pharmacy', 'aa pharmacy',
      // Medical
      'dental', 'dentist', 'clinic', 'medical', 'doctor', 'specialist', 'physio', 'laboratory', 'lab',
      // Health & Wellness
      'optical', 'optometrist', 'vision', 'health screening',
    ],
    priority: 2,
  },
  'Insurance': {
    keywords: [
      'insurance', 'prudential', 'aia', 'great eastern', 'allianz', 'manulife', 'tokio marine',
      'zurich', 'axa', 'etiqa', 'takaful', 'fwd', 'hong leong assurance', 'sun life',
      'life insurance', 'motor insurance', 'medical card',
    ],
    priority: 1,
  },
  'Utilities': {
    keywords: [
      // Electricity
      'tnb', 'tenaga', 'electricity', 'electric', 'letrik', 'sesb', 'sesco', 'sarawak energy',
      // Water
      'air selangor', 'syabas', 'water', 'air', 'laku', 'sains', 'saj', 'pbapp',
      // Internet & Phone
      'tm', 'unifi', 'maxis', 'celcom', 'digi', 'u mobile', 'yes 4g', 'time', 'astro',
      'hotlink', 'xpax', 'tunetalk', 'redone', 'starlink',
      // Gas
      'gas malaysia', 'petronas gas', 'petgas',
    ],
    priority: 1,
  },
  'Subscriptions': {
    keywords: [
      'netflix', 'disney', 'hbo', 'youtube premium', 'youtube music', 'viu', 'wetv', 'iqiyi',
      'amazon prime', 'apple tv', 'subscription', 'monthly', 'icloud', 'google one', 'dropbox',
      'microsoft 365', 'adobe', 'canva', 'notion', 'chatgpt', 'openai', 'claude', 'anthropic',
      'medium', 'patreon', 'membership', 'member',
    ],
    priority: 1,
  },
  'Travel': {
    keywords: [
      // Airlines
      'airasia', 'malaysia airlines', 'mas', 'firefly', 'batik air', 'singapore airlines',
      'cathay', 'emirates', 'qatar', 'thai airways', 'jetstar', 'scoot', 'airline', 'flight',
      // Booking
      'booking.com', 'agoda', 'expedia', 'traveloka', 'klook', 'kkday', 'tripadvisor',
      // Accommodation
      'hotel', 'resort', 'airbnb', 'oyo', 'tune hotel', 'ibis',
      // Transport
      'ktm', 'ets', 'klia ekspres', 'klia transit', 'rapidkl', 'mrt', 'lrt', 'monorail', 'prasarana',
      'bus', 'easybook', 'redbus', 'terminal',
      // Road
      'toll', 'plus', 'touch n go', 'tng', 'smart tag', 'rfid',
      // Car Rental
      'hertz', 'avis', 'socar', 'gocar', 'trevo', 'flux', 'car rental',
    ],
    priority: 2,
  },
  'Gym & Fitness': {
    keywords: [
      'gym', 'fitness', 'fitness first', 'celebrity fitness', 'anytime fitness', 'chi fitness',
      'true fitness', 'kl fitness', 'yoga', 'pilates', 'crossfit', 'f45', 'barry',
      'spin', 'boxing', 'muay thai', 'mma', 'martial arts', 'swim', 'tennis', 'badminton',
      'golf', 'futsal', 'sports', 'running', 'marathon',
    ],
    priority: 2,
  },
  'Government': {
    keywords: [
      // Malaysian Government
      'jpj', 'jabatan', 'lhdn', 'hasil', 'kwsp', 'perkeso', 'socso', 'eis', 'pdrm', 'imigresen',
      'kementerian', 'jabatan', 'majlis', 'dewan', 'ptptn', 'mara', 'tekun', 'ssm', 'myeg',
      'epf', 'pcb',
      // Licenses & Permits
      'road tax', 'cukai', 'license', 'lesen', 'permit', 'summon', 'saman', 'fine',
      // Utilities (Government)
      'indah water', 'iwk', 'dbkl', 'mbpj', 'mbsa', 'mpsj', 'mpkl',
    ],
    priority: 1,
  },
  'PTPTN': {
    keywords: ['ptptn', 'perbadanan tabung pendidikan'],
    priority: 1,
  },
  'EPF/KWSP': {
    keywords: ['kwsp', 'epf', 'kumpulan wang simpanan pekerja', 'employees provident'],
    priority: 1,
  },
  'Transfer Out': {
    keywords: [
      'transfer from', 'transfer fr a/c', 'fund transfer from', 'ibk fund tfr fr',
      'instant transfer', 'ibg', 'wise', 'remittance', 'western union', 'moneygram', 'worldremit',
    ],
    priority: 1,
  },
  'Transfer In': {
    keywords: [
      'transfer to a/c', 'transfer to', 'fund transfer to', 'ibk fund tfr to',
      'duitnow', 'mae qr', 'fpx payment',
    ],
    priority: 1,
  },
  'Income': {
    keywords: [
      'salary', 'gaji', 'cr pymt', 'cash deposit', 'interest paid', 'interest earned',
      'cashback', 'rebate', 'dividend', 'bonus', 'commission', 'allowance',
      'reimbursement', 'claim', 'payment received', 'credit',
    ],
    priority: 2,
  },
  'Refund': {
    keywords: ['refund'],
    priority: 0,
  },
  'ATM/Cash': {
    keywords: ['atm', 'cash withdrawal', 'withdraw', 'pengeluaran', 'cash out', 'cwd'],
    priority: 1,
  },
  'Fees & Charges': {
    keywords: [
      'annual fee', 'service charge', 'service fee', 'bank charge', 'bank fee',
      'interest charge', 'late charge', 'late fee', 'penalty', 'stamp duty', 'setem',
      'processing fee', 'admin fee', 'bank charge',
    ],
    priority: 1,
  },
  'Investment': {
    keywords: [
      'stashaway', 'wahed', 'versa', 'raiz', 'akru', 'best invest', 'fundsupermart',
      'rakuten trade', 'mplus', 'cgs-cimb', 'maybank trade', 'public invest',
      'unit trust', 'asnb', 'asb', 'asn', 'mutual fund', 'etf', 'stock', 'share', 'dividend',
      'bursa', 'trading', 'invest', 'forex', 'crypto', 'bitcoin', 'luno', 'tokenize',
    ],
    priority: 2,
  },
  'Loan & Credit': {
    keywords: [
      'loan', 'pinjaman', 'financing', 'instalment', 'installment', 'ansuran',
      'mortgage', 'housing loan', 'car loan', 'personal loan', 'credit card payment',
      'bnpl', 'buy now pay later', 'atome', 'grabpay later', 'shopee paylater', 'split',
    ],
    priority: 2,
  },
  'Pets': {
    keywords: [
      'pet', 'veterinar', 'vet clinic', 'pet shop', 'petster', 'pet lovers',
      'dog', 'cat', 'pet food', 'pet grooming',
    ],
    priority: 2,
  },
  'Religious': {
    keywords: [
      'zakat', 'tithe', 'donation', 'derma', 'sedekah', 'wakaf', 'mosque', 'masjid',
      'church', 'temple', 'religious', 'charity', 'tabung',
    ],
    priority: 2,
  },
  'Payment': {
    keywords: [],
    priority: 99,
  },
};

// Company Account Category Keywords
export const COMPANY_CATEGORIES = {
  'Payments': {
    keywords: [
      'payment received', 'sales', 'invoice', 'customer payment', 'client payment',
      'cr pymt', 'cash deposit', 'cheque deposit', 'interest earned', 'interest paid',
    ],
    priority: 2,
  },
  'Expenses': {
    keywords: [
      'office', 'supplies', 'stationery', 'printing', 'marketing', 'advertising',
      'ads', 'facebook ads', 'google ads', 'tiktok ads', 'promotion', 'campaign',
      'travel', 'flight', 'hotel', 'accommodation', 'transport', 'mileage',
      'software', 'saas', 'subscription', 'license', 'hosting', 'domain', 'cloud',
    ],
    priority: 2,
  },
  'Payroll & Staff': {
    keywords: [
      'salary', 'gaji', 'wages', 'payroll', 'epf', 'kwsp', 'socso', 'perkeso',
      'eis', 'pcb', 'hrdf', 'staff', 'employee', 'bonus', 'commission', 'allowance',
    ],
    priority: 1,
  },
  'Rent & Property': {
    keywords: [
      'rent', 'sewa', 'rental', 'lease', 'tenancy', 'property', 'warehouse', 'office space',
      'maintenance', 'building management', 'service charge',
    ],
    priority: 1,
  },
  'Equipment & Assets': {
    keywords: [
      'equipment', 'machinery', 'computer', 'laptop', 'furniture', 'fixture',
      'vehicle', 'asset', 'capital expenditure', 'capex',
    ],
    priority: 2,
  },
  'Professional Services': {
    keywords: [
      'legal', 'lawyer', 'solicitor', 'accounting', 'accountant', 'audit', 'auditor',
      'consultant', 'consulting', 'advisory', 'professional fee', 'secretarial',
    ],
    priority: 1,
  },
  'Tax & Government': {
    keywords: [
      'lhdn', 'hasil', 'income tax', 'corporate tax', 'cukai', 'ssm', 'company registration',
      'jpj', 'license', 'permit', 'dbkl', 'majlis', 'assessment', 'cukai taksiran',
    ],
    priority: 1,
  },
  'Owner\'s Draw': {
    keywords: [
      'director', 'drawing', 'dividend', 'shareholder', 'owner', 'personal',
    ],
    priority: 3,
  },
  'Bank Fees': {
    keywords: [
      'bank charge', 'bank fee', 'service charge', 'annual fee', 'interest charge',
      'commission', 'stamp duty', 'telegraphic', 'swift', 'processing fee',
    ],
    priority: 1,
  },
  'Utilities': {
    keywords: [
      'tnb', 'tenaga', 'electricity', 'water', 'air', 'internet', 'unifi', 'maxis',
      'time', 'phone', 'telco', 'utility',
    ],
    priority: 1,
  },
  'Petrol/EV': {
    keywords: [
      'petrol', 'petronas', 'shell', 'petron', 'caltex', 'fuel', 'diesel',
      'ev charging', 'chargev', 'gentari',
    ],
    priority: 1,
  },
  'Insurance': {
    keywords: [
      'insurance', 'takaful', 'premium', 'coverage', 'policy',
    ],
    priority: 1,
  },
  'Loan Repayment': {
    keywords: [
      'loan', 'financing', 'instalment', 'installment', 'mortgage', 'repayment',
      'principal', 'interest', 'bank loan', 'credit facility',
    ],
    priority: 2,
  },
  'Transfer Out': {
    keywords: [
      'transfer from', 'transfer fr a/c', 'fund transfer from', 'ibk fund tfr fr',
      'instant transfer', 'ibg', 'wise', 'remittance', 'telegraphic transfer',
    ],
    priority: 1,
  },
  'Transfer In': {
    keywords: [
      'transfer to a/c', 'transfer to', 'fund transfer to', 'ibk fund tfr to',
      'duitnow', 'fpx payment',
    ],
    priority: 1,
  },
  'Refund': {
    keywords: ['refund'],
    priority: 0,
  },
};

// Personal Account Category Colors - Distinct palette
export const PERSONAL_COLORS = {
  'Food & Dining': '#E53935',      // Bright Red
  'Grab/E-hailing': '#00ACC1',     // Cyan
  'EV & Petrol': '#FF8F00',        // Amber Orange
  'Shopping': '#AB47BC',           // Orchid Purple
  'Entertainment': '#EC407A',      // Pink
  'Healthcare': '#42A5F5',         // Sky Blue
  'Insurance': '#5C6BC0',          // Indigo
  'Utilities': '#78909C',          // Blue Grey
  'Subscriptions': '#7E57C2',      // Deep Purple
  'Travel': '#26A69A',             // Teal
  'Gym & Fitness': '#FF7043',      // Coral
  'Government': '#546E7A',         // Dark Slate
  'PTPTN': '#8D6E63',              // Brown
  'EPF/KWSP': '#9CCC65',           // Lime Green
  'Transfer Out': '#EF6C00',       // Dark Orange
  'Transfer In': '#66BB6A',        // Medium Green
  'Income': '#2E7D32',             // Forest Green
  'Refund': '#00897B',             // Dark Teal
  'ATM/Cash': '#FDD835',           // Yellow
  'Fees & Charges': '#C62828',     // Dark Red
  'Investment': '#1565C0',         // Dark Blue
  'Loan & Credit': '#AD1457',      // Burgundy
  'Pets': '#A1887F',               // Taupe
  'Religious': '#6A1B9A',          // Deep Violet
  'Payment': '#90A4AE',            // Silver
};

// Company Account Category Colors - Distinct palette
export const COMPANY_COLORS = {
  'Payments': '#43A047',           // Green
  'Expenses': '#78909C',           // Blue Grey
  'Payroll & Staff': '#5C6BC0',    // Indigo
  'Rent & Property': '#8D6E63',    // Brown
  'Equipment & Assets': '#607D8B', // Slate
  'Professional Services': '#7E57C2', // Purple
  'Tax & Government': '#455A64',   // Dark Slate
  'Owner\'s Draw': '#FFB300',      // Amber
  'Bank Fees': '#E53935',          // Red
  'Utilities': '#26A69A',          // Teal
  'Petrol/EV': '#FF8F00',          // Orange
  'Insurance': '#AB47BC',          // Orchid
  'Loan Repayment': '#C62828',     // Dark Red
  'Transfer Out': '#EF6C00',       // Dark Orange
  'Transfer In': '#66BB6A',        // Medium Green
  'Income': '#2E7D32',             // Forest Green
  'Refund': '#00897B',             // Dark Teal
};
