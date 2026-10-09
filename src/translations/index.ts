export interface Translations {
  // Navigation
  brandName: string;
  brandTagline: string;
  navHome: string;
  navMarketplace: string;
  navSellVegetables: string;
  navHowItWorks: string;
  navTrackOrder: string;
  navAbout: string;
  navDashboard: string;
  navProcurement: string;
  navTransport: string;
  navLogin: string;
  navLogout: string;
  navProfile: string;
  navNotifications: string;
  navRoleSwitcher: string;
  navCart: string;

  // Hero Section
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroBtnSell: string;
  heroBtnBuy: string;
  heroBtnExplore: string;
  heroBadge: string;
  heroStatsFarmers: string;
  heroStatsVegetablesSold: string;
  heroStatsDistricts: string;
  heroStatsFastPayout: string;

  // How It Works Section
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;

  // Value Proposition / Business Model
  businessModelTitle: string;
  businessModelSubtitle: string;
  farmerBenefitTitle: string;
  farmerBenefitDesc: string;
  procurementBenefitTitle: string;
  procurementBenefitDesc: string;
  buyerBenefitTitle: string;
  buyerBenefitDesc: string;
  transportBenefitTitle: string;
  transportBenefitDesc: string;

  // Farmer Dashboard
  farmerDashboardTitle: string;
  farmerDashboardSubtitle: string;
  btnSellVegetables: string;
  statTotalListings: string;
  statPendingRequests: string;
  statAcceptedRequests: string;
  statSoldQuantity: string;
  statTotalEarnings: string;
  myListingsHeading: string;
  colVegetable: string;
  colQuantity: string;
  colExpectedPrice: string;
  colQuality: string;
  colLocation: string;
  colStatus: string;
  colPayment: string;
  colDate: string;
  colActions: string;
  statusPending: string;
  statusApproved: string;
  statusPurchased: string;
  statusCollected: string;
  statusCompleted: string;
  statusRejected: string;
  paymentPending: string;
  paymentProcessing: string;
  paymentPaid: string;

  // Sell Vegetable Form
  sellModalTitle: string;
  sellModalSubtitle: string;
  formVegetableName: string;
  formCategory: string;
  formQuantity: string;
  formUnit: string;
  formExpectedPrice: string;
  formQualityGrade: string;
  formHarvestDate: string;
  formLocation: string;
  formUploadImage: string;
  formAdditionalNotes: string;
  formSubmitBtn: string;
  formCancelBtn: string;
  sellSuccessMsg: string;
  sellSuccessSubtext: string;

  // Buyer Marketplace
  marketplaceTitle: string;
  marketplaceSubtitle: string;
  searchPlaceholder: string;
  filterAllCategories: string;
  filterQuality: string;
  filterLocation: string;
  filterPriceRange: string;
  sortBy: string;
  sortPriceLowHigh: string;
  sortPriceHighLow: string;
  sortAvailability: string;
  badgeFresh: string;
  gradeLabel: string;
  perKg: string;
  availableStock: string;
  btnAddToCart: string;
  btnBuyNow: string;
  viewDetails: string;
  noVegetablesFound: string;

  // Product Details Modal
  modalHarvestedOn: string;
  modalMinOrder: string;
  modalOrigin: string;
  modalDeliveryTime: string;
  modalQualityGuarantee: string;
  modalQuantitySelect: string;
  costBreakdownTitle: string;
  vegetableCost: string;
  transportCost: string;
  handlingCost: string;
  totalAmount: string;
  btnProceedToCheckout: string;

  // Buyer Checkout
  checkoutTitle: string;
  checkoutSubtitle: string;
  deliveryDetailsTitle: string;
  inputFullName: string;
  inputPhone: string;
  inputAddress: string;
  inputCity: string;
  paymentMethodTitle: string;
  payUPI: string;
  payCard: string;
  payCOD: string;
  payNetBanking: string;
  btnConfirmOrder: string;
  orderSuccessTitle: string;
  orderSuccessDesc: string;
  btnTrackYourOrder: string;

  // Procurement / Admin Center
  procurementCenterTitle: string;
  procurementSubtitle: string;
  tabFarmerRequests: string;
  tabInventory: string;
  tabBuyerOrders: string;
  tabProfitCalculator: string;
  tabAnalytics: string;
  reviewRequestTitle: string;
  btnReview: string;
  btnAccept: string;
  btnReject: string;
  btnSetPrice: string;
  inputProcurementPrice: string;
  calcTotalProcurementCost: string;
  inventoryTitle: string;
  availableForSale: string;
  procuredCostAvg: string;
  suggestedSellPrice: string;
  btnUpdateSellPrice: string;

  // Profit Calculator
  profitCalcTitle: string;
  profitCalcSubtitle: string;
  fieldFarmerPurchasePrice: string;
  fieldSellingPrice: string;
  fieldTransportCostPerKg: string;
  fieldHandlingCostPerKg: string;
  calcExpectedProfit: string;
  calcProfitPercentage: string;
  calcFormulaExplanation: string;
  calcPurchaseCostTotal: string;
  calcSellingRevenueTotal: string;
  calcGrossMargin: string;

  // Transport Management & Smart Transport
  transportDashboardTitle: string;
  transportSubtitle: string;
  tabAssignedTrips: string;
  tabSmartLogistics: string;
  tabAgencyFleet: string;
  colTripId: string;
  colPickup: string;
  colDestination: string;
  colDistance: string;
  colAgency: string;
  colTransportCost: string;
  btnAssignAgency: string;
  smartTransportTitle: string;
  smartTransportDesc: string;
  recommendedAgency: string;
  btnAcceptTrip: string;
  btnUpdateStatus: string;
  statusTransportRequested: string;
  statusAgencyAssigned: string;
  statusPickupScheduled: string;
  statusPickedUp: string;
  statusInTransit: string;
  statusDelivered: string;

  // Order Tracking
  trackingTitle: string;
  trackingSubtitle: string;
  enterOrderIdPlaceholder: string;
  btnSearchOrder: string;
  timelineOrderConfirmed: string;
  timelineProcurementCompleted: string;
  timelinePickupScheduled: string;
  timelineVegetablesCollected: string;
  timelineInTransit: string;
  timelineOutForDelivery: string;
  timelineDelivered: string;
  orderSummaryDetails: string;
  trackingFarmerSource: string;
  trackingVehicleNo: string;
  trackingDriver: string;
  trackingCallDriver: string;

  // Notification Center
  notificationCenterTitle: string;
  markAllAsRead: string;
  noNotifications: string;

  // Footer & Common
  allRightsReserved: string;
  quickLinks: string;
  contactSupport: string;
  transparentCommitment: string;
  close: string;
  save: string;

  // Authentication
  authLoginTitle: string;
  authLoginSubtitle: string;
  authSignupTitle: string;
  authSignupSubtitle: string;
  authIdentifier: string;
  authPhone: string;
  authEmail: string;
  authPassword: string;
  authConfirmPassword: string;
  authRole: string;
  authRoleFarmer: string;
  authRoleBuyer: string;
  authRoleLogistics: string;
  authOrgName: string;
  authState: string;
  authDistrict: string;
  authVillage: string;
  authRememberMe: string;
  authForgotPassword: string;
  authBtnSignIn: string;
  authBtnSignUp: string;
  authNoAccount: string;
  authHaveAccount: string;
  authLoggingIn: string;
  authSigningUp: string;
  authLoginSuccess: string;
  authSignupSuccess: string;
  authLoggedOut: string;
}

export const translations: Record<'en' | 'ta', Translations> = {
  en: {
    // Navigation
    brandName: 'AgriMarket',
    brandTagline: 'From Farm to Buyer, Made Simple',
    navHome: 'Home',
    navMarketplace: 'Marketplace',
    navSellVegetables: 'Sell Vegetables',
    navHowItWorks: 'How It Works',
    navTrackOrder: 'Track Order',
    navAbout: 'About Platform',
    navDashboard: 'Dashboard',
    navProcurement: 'Procurement Hub',
    navTransport: 'Transport Fleet',
    navLogin: 'Login / Register',
    navLogout: 'Sign Out',
    navProfile: 'Profile',
    navNotifications: 'Notifications',
    navRoleSwitcher: 'Role View',
    navCart: 'Cart',

    // Hero Section
    heroTitle: 'From Farm to Buyer,',
    heroHighlight: 'Made Simple.',
    heroSubtitle:
      'Sell directly through our platform, purchase fresh vegetables, and let us manage the transportation. We ensure fair farmer payouts, strict quality checks, and scheduled cold & dry transit to buyers.',
    heroBtnSell: 'Sell Vegetables as Farmer',
    heroBtnBuy: 'Buy Fresh Produce',
    heroBtnExplore: 'Explore Marketplace',
    heroBadge: 'Government Verified Farmer-to-Procurement Network',
    heroStatsFarmers: '12,500+ Registered Farmers',
    heroStatsVegetablesSold: '85,000+ Tonnes Procured',
    heroStatsDistricts: '32 Agricultural Districts',
    heroStatsFastPayout: 'Within 24 Hours Payout',

    // How It Works Section
    howItWorksTitle: 'Our Seamless 5-Stage Supply Chain',
    howItWorksSubtitle:
      'Our platform acts as the middle procurement partner. We purchase vegetables directly from farmers, verify quality, organize swift transport, and deliver directly to commercial & retail buyers.',
    step1Title: '1. Farmer Lists Produce',
    step1Desc:
      'Farmers input crop details, expected price, harvest date, and farm location with photos.',
    step2Title: '2. We Purchase the Produce',
    step2Desc:
      'Our procurement team inspects quality, locks a guaranteed fair price, and completes purchase.',
    step3Title: '3. We Arrange Transportation',
    step3Desc:
      'Our logistics algorithm assigns the optimal transport agency for farm gate pickup.',
    step4Title: '4. Buyer Places Order',
    step4Desc:
      'Commercial buyers, restaurants, and retail stores select produce with transparent pricing.',
    step5Title: '5. Vegetables Are Delivered',
    step5Desc:
      'Fresh farm-fresh vegetables reach the buyer on time with real-time GPS stage tracking.',

    // Value Proposition
    businessModelTitle: 'Why Our Procurement Model Works Best',
    businessModelSubtitle:
      'Eliminating erratic commission agents while providing complete post-harvest logistics guarantee.',
    farmerBenefitTitle: 'For Hardworking Farmers',
    farmerBenefitDesc:
      'No distress selling. Transparent grading, guaranteed 24-hr payment, and free farm-gate pickup.',
    procurementBenefitTitle: 'Strict Quality & Grading',
    procurementBenefitDesc:
      'Quality Grade A, B, and C inspection by trained agronomists. Moisture and freshness preserved.',
    buyerBenefitTitle: 'For Bulk & Retail Buyers',
    buyerBenefitDesc:
      'Consistent wholesale prices, verified farm origin, transparent transport billing, zero surprises.',
    transportBenefitTitle: 'For Transport Agencies',
    transportBenefitDesc:
      'Guaranteed backhaul loads, upfront distance pricing, and automated dispatch schedules.',

    // Farmer Dashboard
    farmerDashboardTitle: 'Farmer Selling Center',
    farmerDashboardSubtitle: 'Track your listings, accepted purchase offers, and instant payouts.',
    btnSellVegetables: '+ Sell Vegetables',
    statTotalListings: 'Total Listings',
    statPendingRequests: 'Pending Review',
    statAcceptedRequests: 'Accepted & Purchased',
    statSoldQuantity: 'Total Sold Quantity',
    statTotalEarnings: 'Total Earnings',
    myListingsHeading: 'Your Vegetable Selling Requests',
    colVegetable: 'Vegetable',
    colQuantity: 'Quantity',
    colExpectedPrice: 'Expected Price',
    colQuality: 'Quality Grade',
    colLocation: 'Farm Location',
    colStatus: 'Procurement Status',
    colPayment: 'Payment Status',
    colDate: 'Harvest Date',
    colActions: 'Action',
    statusPending: 'Pending Review',
    statusApproved: 'Approved by Team',
    statusPurchased: 'Purchased by Us',
    statusCollected: 'Collected from Farm',
    statusCompleted: 'Completed',
    statusRejected: 'Declined',
    paymentPending: 'Pending',
    paymentProcessing: 'Processing (24h)',
    paymentPaid: 'Paid to Bank',

    // Sell Form
    sellModalTitle: 'List Your Farm Vegetables for Sale',
    sellModalSubtitle:
      'Enter your harvest details. Our procurement team will review your offer and schedule pickup.',
    formVegetableName: 'Vegetable Name',
    formCategory: 'Produce Category',
    formQuantity: 'Available Quantity',
    formUnit: 'Unit of Measure',
    formExpectedPrice: 'Expected Price (₹ per kg)',
    formQualityGrade: 'Quality Grade',
    formHarvestDate: 'Harvest Date / Freshness',
    formLocation: 'Farm Location & District',
    formUploadImage: 'Vegetable Photo',
    formAdditionalNotes: 'Crop Details (Variety, Organic, Moisture, etc.)',
    formSubmitBtn: 'Submit Selling Request',
    formCancelBtn: 'Cancel',
    sellSuccessMsg: 'Your selling request has been submitted successfully!',
    sellSuccessSubtext:
      'Our procurement team will inspect the details and confirm the purchase price shortly.',

    // Buyer Marketplace
    marketplaceTitle: 'Fresh Farm Produce Marketplace',
    marketplaceSubtitle:
      'Procured directly from verified farms. Standardized grading, fair pricing, and managed transport.',
    searchPlaceholder: 'Search tomatoes, onions, potatoes, green chillies...',
    filterAllCategories: 'All Categories',
    filterQuality: 'Quality Grade',
    filterLocation: 'Source Region',
    filterPriceRange: 'Max Price (₹/kg)',
    sortBy: 'Sort By',
    sortPriceLowHigh: 'Price: Low to High',
    sortPriceHighLow: 'Price: High to Low',
    sortAvailability: 'Availability (Highest First)',
    badgeFresh: 'Farm Fresh',
    gradeLabel: 'Grade',
    perKg: '₹/kg',
    availableStock: 'Available',
    btnAddToCart: 'Add to Cart',
    btnBuyNow: 'Buy Now',
    viewDetails: 'View Details & Costs',
    noVegetablesFound: 'No vegetables match your search or filter criteria.',

    // Product Details Modal
    modalHarvestedOn: 'Harvested On',
    modalMinOrder: 'Min. Order Quantity',
    modalOrigin: 'Farm Origin & District',
    modalDeliveryTime: 'Estimated Transit Time',
    modalQualityGuarantee: '100% Quality Inspected Produce',
    modalQuantitySelect: 'Select Purchase Quantity',
    costBreakdownTitle: 'Transparent Price Breakdown',
    vegetableCost: 'Vegetable Cost',
    transportCost: 'Transport Logistics',
    handlingCost: 'Quality & Handling Cost',
    totalAmount: 'Total Amount Payable',
    btnProceedToCheckout: 'Proceed to Checkout',

    // Checkout
    checkoutTitle: 'Buyer Order Checkout',
    checkoutSubtitle: 'Confirm your delivery destination and select payment method.',
    deliveryDetailsTitle: 'Delivery & Warehouse Details',
    inputFullName: 'Contact Person / Business Name',
    inputPhone: 'Mobile Phone Number',
    inputAddress: 'Delivery Address / Market Stall / Warehouse',
    inputCity: 'City / District',
    paymentMethodTitle: 'Select Payment Method',
    payUPI: 'UPI (GPay / PhonePe / Paytm)',
    payCard: 'Debit / Credit Card',
    payCOD: 'Cash on Delivery (Verified buyers)',
    payNetBanking: 'Corporate Net Banking / RTGS',
    btnConfirmOrder: 'Confirm & Place Order',
    orderSuccessTitle: 'Order Placed Successfully!',
    orderSuccessDesc:
      'Your order has been recorded. Our logistics fleet is assigning a transport vehicle.',
    btnTrackYourOrder: 'Track Order Status',

    // Procurement Center
    procurementCenterTitle: 'Procurement & Logistics Command',
    procurementSubtitle:
      'Review incoming farmer crops, set purchase prices, allocate transport, and track profit margins.',
    tabFarmerRequests: 'Farmer Selling Requests',
    tabInventory: 'Active Inventory',
    tabBuyerOrders: 'Buyer Orders',
    tabProfitCalculator: 'Profit Management',
    tabAnalytics: 'Business Metrics',
    reviewRequestTitle: 'Review Farmer Offering',
    btnReview: 'Review Offer',
    btnAccept: 'Accept & Purchase',
    btnReject: 'Decline Offer',
    btnSetPrice: 'Lock Procurement Price',
    inputProcurementPrice: 'Agreed Purchase Price (₹/kg)',
    calcTotalProcurementCost: 'Total Procurement Cost',
    inventoryTitle: 'Warehouse & Farm Gate Inventory',
    availableForSale: 'In Stock for Buyers',
    procuredCostAvg: 'Avg. Procurement Cost',
    suggestedSellPrice: 'Selling Price to Buyers',
    btnUpdateSellPrice: 'Update Price',

    // Profit Calculator
    profitCalcTitle: 'Procurement & Profit Margin Calculator',
    profitCalcSubtitle:
      'Calculate net margins per kilogram considering farmer purchase price, transportation, and sorting fees.',
    fieldFarmerPurchasePrice: 'Farmer Purchase Price (₹/kg)',
    fieldSellingPrice: 'Buyer Selling Price (₹/kg)',
    fieldTransportCostPerKg: 'Transport Cost (₹/kg)',
    fieldHandlingCostPerKg: 'Other Handling & Storage (₹/kg)',
    calcExpectedProfit: 'Expected Net Profit',
    calcProfitPercentage: 'Profit Margin Percentage',
    calcFormulaExplanation: 'Profit = Selling Price - Purchase Price - Transport - Handling',
    calcPurchaseCostTotal: 'Total Purchase Cost',
    calcSellingRevenueTotal: 'Total Selling Revenue',
    calcGrossMargin: 'Gross Spread',

    // Transport Management
    transportDashboardTitle: 'Transport & Fleet Logistics',
    transportSubtitle:
      'Assign verified vehicle fleets, monitor farm-to-destination transit, and track freight expenses.',
    tabAssignedTrips: 'Assigned Shipments',
    tabSmartLogistics: 'Smart Transport Optimizer',
    tabAgencyFleet: 'Registered Fleets',
    colTripId: 'Trip ID',
    colPickup: 'Pickup Farm',
    colDestination: 'Buyer Destination',
    colDistance: 'Distance',
    colAgency: 'Transport Agency',
    colTransportCost: 'Freight Cost',
    btnAssignAgency: 'Assign Fleet Agency',
    smartTransportTitle: 'Smart Transport Optimizer',
    smartTransportDesc:
      'Our intelligent logistics algorithm pairs orders with the nearest truck based on payload and cooling.',
    recommendedAgency: 'Recommended Transport Partner',
    btnAcceptTrip: 'Accept Dispatch Trip',
    btnUpdateStatus: 'Update Delivery Status',
    statusTransportRequested: 'Transport Requested',
    statusAgencyAssigned: 'Agency Assigned',
    statusPickupScheduled: 'Pickup Scheduled',
    statusPickedUp: 'Vegetables Picked Up',
    statusInTransit: 'Vehicle In Transit',
    statusDelivered: 'Successfully Delivered',

    // Order Tracking
    trackingTitle: 'Real-Time Order & Logistics Tracker',
    trackingSubtitle: 'Follow the 7-stage journey of your fresh produce from the farm gate to delivery.',
    enterOrderIdPlaceholder: 'Enter Order ID (e.g., ORD-8492)',
    btnSearchOrder: 'Track Shipment',
    timelineOrderConfirmed: 'Order Confirmed',
    timelineProcurementCompleted: 'Procurement Completed',
    timelinePickupScheduled: 'Pickup Scheduled',
    timelineVegetablesCollected: 'Vegetables Collected',
    timelineInTransit: 'In Transit',
    timelineOutForDelivery: 'Out for Delivery',
    timelineDelivered: 'Delivered',
    orderSummaryDetails: 'Shipment Summary',
    trackingFarmerSource: 'Farm Origin',
    trackingVehicleNo: 'Vehicle Number',
    trackingDriver: 'Assigned Driver',
    trackingCallDriver: 'Call Driver',

    // Notification Center
    notificationCenterTitle: 'Platform Notifications',
    markAllAsRead: 'Mark all as read',
    noNotifications: 'You are all caught up! No unread notifications.',

    // Common
    allRightsReserved: 'All rights reserved. AgriMarket Technologies Pvt Ltd.',
    quickLinks: 'Quick Links',
    contactSupport: '24/7 Farmer & Buyer Helpline: 1800-425-AGRI (2474)',
    transparentCommitment:
      'We act as your reliable agricultural procurement and logistics partner. Direct, transparent, and fair.',
    close: 'Close',
    save: 'Save',

    // Authentication
    authLoginTitle: 'Sign in to AgriConnect',
    authLoginSubtitle: 'Access direct agricultural marketplace, price discovery & smart logistics.',
    authSignupTitle: 'Create your AgriConnect account',
    authSignupSubtitle: 'Join verified farmers, wholesale buyers, and logistics providers.',
    authIdentifier: 'Phone Number or Email',
    authPhone: 'Mobile Phone Number',
    authEmail: 'Email Address (Optional)',
    authPassword: 'Password',
    authConfirmPassword: 'Confirm Password',
    authRole: 'Select Role',
    authRoleFarmer: 'Farmer / FPO Producer',
    authRoleBuyer: 'Buyer / Retailer / Processor',
    authRoleLogistics: 'Logistics / Fleet Operator',
    authOrgName: 'Organization / Business Name',
    authState: 'State',
    authDistrict: 'District',
    authVillage: 'Village / City',
    authRememberMe: 'Remember me',
    authForgotPassword: 'Forgot password?',
    authBtnSignIn: 'Sign In',
    authBtnSignUp: 'Register Account',
    authNoAccount: "Don't have an account?",
    authHaveAccount: 'Already have an account?',
    authLoggingIn: 'Verifying credentials...',
    authSigningUp: 'Creating your account...',
    authLoginSuccess: 'Welcome back! Logged in successfully.',
    authSignupSuccess: 'Account created successfully! Welcome to AgriConnect.',
    authLoggedOut: 'You have been logged out.',
  },

  ta: {
    // Navigation
    brandName: 'அக்ரிமார்க்கெட்',
    brandTagline: 'விவசாயியிடம் இருந்து வாங்குபவர் வரை, மிக எளிதாக',
    navHome: 'முகப்பு',
    navMarketplace: 'காய்கறி சந்தை',
    navSellVegetables: 'காய்கறி விற்பனை',
    navHowItWorks: 'செயல்முறை விளக்கம்',
    navTrackOrder: 'ஆர்டர் கண்காணிப்பு',
    navAbout: 'தளம் பற்றி',
    navDashboard: 'டாஷ்போர்டு',
    navProcurement: 'கொள்முதல் மையம்',
    navTransport: 'போக்குவரத்து பிரிவு',
    navLogin: 'உள்நுழைவு / பதிவு',
    navLogout: 'வெளியேறு',
    navProfile: 'சுயவிவரம்',
    navNotifications: 'அறிவிப்புகள்',
    navRoleSwitcher: 'பயனர் பங்கு',
    navCart: 'கூடை',

    // Hero Section
    heroTitle: 'விவசாயியிடம் இருந்து வாங்குபவர் வரை,',
    heroHighlight: 'மிகவும் எளிதாக.',
    heroSubtitle:
      'எங்கள் தளம் மூலமாக காய்கறிகளை நேரடியாக விற்று உரிய லாபம் பெறுங்கள்; வாங்குபவர்கள் புதிய காய்கறிகளைப் பெறுங்கள். போக்குவரத்தை நாங்களே சீராக நிர்வகிக்கிறோம்.',
    heroBtnSell: 'விவசாயியாக காய்கறி விற்க',
    heroBtnBuy: 'காய்கறிகள் வாங்க',
    heroBtnExplore: 'சந்தையை காண்க',
    heroBadge: 'அரசு அங்கீகாரம் பெற்ற விவசாய கொள்முதல் & போக்குவரத்து நெட்வொர்க்',
    heroStatsFarmers: '12,500+ பதிவு செய்த விவசாயிகள்',
    heroStatsVegetablesSold: '85,000+ டன் கொள்முதல்',
    heroStatsDistricts: '32 விவசாய மாவட்டங்கள்',
    heroStatsFastPayout: '24 மணிநேர நேரடி வங்கி செலுத்துதல்',

    // How It Works Section
    howItWorksTitle: 'எங்களின் 5 படிநிலைகள் கொண்ட விநியோகச் சங்கிலி',
    howItWorksSubtitle:
      'எங்கள் நிறுவனம் இடைநிலை கொள்முதல் கூட்டாளியாக செயல்படுகிறது. விவசாயிகளிடமிருந்து காய்கறிகளை நியாயமான விலையில் கொள்முதல் செய்து, தரத்தை சோதித்து, போக்குவரத்து அமைத்து, வாங்குபவர்களுக்கு வழங்குகிறோம்.',
    step1Title: '1. விவசாயி பட்டியல் இடுதல்',
    step1Desc: 'விவசாயிகள் பயிர் விவரங்கள், எதிர்பார்க்கும் விலை, அறுவடை தேதி மற்றும் புகைப்படங்களை பதிவேற்றுகின்றனர்.',
    step2Title: '2. நாங்கள் கொள்முதல் செய்தல்',
    step2Desc: 'எங்கள் கொள்முதல் குழு தரத்தை பரிசீலித்து, உத்தரவாதமான நியாய விலையை நிர்ணயித்து வாங்குகிறது.',
    step3Title: '3. போக்குவரத்து ஏற்பாடு',
    step3Desc: 'எங்கள் போக்குவரத்து வழிமுறை தோட்டத்திற்கே சென்று காய்கறிகளை ஏற்றிச்செல்ல உகந்த வாகனத்தை ஒதுக்குகிறது.',
    step4Title: '4. வாங்குபவர் ஆர்டர் செய்தல்',
    step4Desc: 'வியாபாரிகள், உணவகங்கள் மற்றும் வாடிக்கையாளர்கள் தங்களுக்குத் தேவையான காய்கறிகளை தேர்வு செய்கிறார்கள்.',
    step5Title: '5. காய்கறிகள் ஒப்படைக்கப்படுதல்',
    step5Desc: 'புதிய, தரமான காய்கறிகள் உரிய நேரத்தில் வாங்குபவரிடம் நேரடி கண்காணிப்புடன் கொண்டு சேர்க்கப்படுகிறது.',

    // Value Proposition
    businessModelTitle: 'ஏன் எங்கள் கொள்முதல் மாதிரி சிறந்தது?',
    businessModelSubtitle: 'தேவையற்ற இடைத்தரகர்கள் மற்றும் கமிஷன் அற்ற, வெளிப்படையான விவசாய விநியோக முறை.',
    farmerBenefitTitle: 'கடின உழைப்பு விவசாயிகளுக்கு',
    farmerBenefitDesc: 'அவசர குறைவு விற்பனை இல்லை. வெளிப்படையான தரம், 24 மணிநேர நேரடி பணம், இலவச தோட்டப் பிக்கப்.',
    procurementBenefitTitle: 'கடுமையான தரப் பரிசோதனை',
    procurementBenefitDesc: 'தரம் A, B, C வகைப்படுத்துதல். குளிர்சாதனப் பாதுகாப்புடன் புதியதாக பராமரித்தல்.',
    buyerBenefitTitle: 'மொத்த & சில்லறை வாங்குபவர்களுக்கு',
    buyerBenefitDesc: 'நிலையான மொத்த விலை, உறுதிசெய்யப்பட்ட விவசாய தோட்டம், வெளிப்படையான போக்குவரத்து கட்டணம்.',
    transportBenefitTitle: 'போக்குவரத்து ஏஜென்சிகளுக்கு',
    transportBenefitDesc: 'தொடர்ச்சியான லோடு உத்தரவாதம், உடனடி தூரக் கட்டணம் மற்றும் தானியங்கி பயண அட்டவணை.',

    // Farmer Dashboard
    farmerDashboardTitle: 'விவசாயி விற்பனை மையம்',
    farmerDashboardSubtitle: 'உங்கள் பயிர் பட்டியல்கள், ஏற்றுக்கொள்ளப்பட்ட கொள்முதல் மற்றும் வங்கி செலுத்துதல்களை கண்காணிக்கவும்.',
    btnSellVegetables: '+ காய்கறி விற்க',
    statTotalListings: 'மொத்தப் பட்டியல்கள்',
    statPendingRequests: 'பரிசீலனையில் உள்ளவை',
    statAcceptedRequests: 'ஏற்றுக்கொள்ளப்பட்டவை',
    statSoldQuantity: 'விற்கப்பட்ட அளவு',
    statTotalEarnings: 'மொத்த வருமானம்',
    myListingsHeading: 'உங்கள் காய்கறி விற்பனை கோரிக்கைகள்',
    colVegetable: 'காய்கறி',
    colQuantity: 'அளவு',
    colExpectedPrice: 'எதிர்பார்க்கும் விலை',
    colQuality: 'தர வகை',
    colLocation: 'தோட்ட அமைவிடம்',
    colStatus: 'கொள்முதல் நிலை',
    colPayment: 'பணம் செலுத்துதல்',
    colDate: 'அறுவடை தேதி',
    colActions: 'செயல்',
    statusPending: 'பரிசீலனையில்',
    statusApproved: 'குழுவால் ஏற்கப்பட்டது',
    statusPurchased: 'கொள்முதல் செய்யப்பட்டது',
    statusCollected: 'தோட்டத்தில் பெறப்பட்டது',
    statusCompleted: 'முடிவடைந்தது',
    statusRejected: 'நிராகரிக்கப்பட்டது',
    paymentPending: 'நிலுவையில்',
    paymentProcessing: 'வங்கிக்கு அனுப்பப்படுகிறது',
    paymentPaid: 'வங்கிக்கு செலுத்தப்பட்டது',

    // Sell Form
    sellModalTitle: 'உங்கள் தோட்ட காய்கறிகளை விற்க பதிவு செய்க',
    sellModalSubtitle: 'விவரங்களை உள்ளிடவும். எங்கள் கொள்முதல் குழு உடனடியாக பரிசீலித்து பிக்கப் ஏற்பாடு செய்யும்.',
    formVegetableName: 'காய்கறியின் பெயர்',
    formCategory: 'பயிர் வகை',
    formQuantity: 'விற்பனைக்கு உள்ள அளவு',
    formUnit: 'அளவீட்டு அலகு',
    formExpectedPrice: 'எதிர்பார்க்கும் விலை (ரூ./கிலோ)',
    formQualityGrade: 'தர நிலை (Grade)',
    formHarvestDate: 'அறுவடை தேதி / புதிய தன்மை',
    formLocation: 'தோட்ட அமைவிடம் & மாவட்டம்',
    formUploadImage: 'காய்கறி புகைப்படம்',
    formAdditionalNotes: 'கூடுதல் குறிப்புகள் (இயற்கை உரம், ரகம் போன்றவை)',
    formSubmitBtn: 'விற்பனை கோரிக்கையை சமர்ப்பிக்கவும்',
    formCancelBtn: 'ரத்து செய்',
    sellSuccessMsg: 'உங்கள் விற்பனை கோரிக்கை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
    sellSuccessSubtext: 'எங்கள் கொள்முதல் குழு காய்கறியின் தரத்தை ஆய்வு செய்து கொள்முதல் விலையை விரைவில் உறுதிப்படுத்தும்.',

    // Buyer Marketplace
    marketplaceTitle: 'புதிய காய்கறிகள் சந்தை',
    marketplaceSubtitle: 'நேரடியாக விவசாயிகளிடம் கொள்முதல் செய்யப்பட்டவை. தர சான்றிதழ், நிலையான விலை, நம்பகமான போக்குவரத்து.',
    searchPlaceholder: 'தக்காளி, வெங்காயம், உருளைக்கிழங்கு, பச்சை மிளகாய் தேடவும்...',
    filterAllCategories: 'அனைத்து பிரிவுகள்',
    filterQuality: 'தர வகை',
    filterLocation: 'விளைந்த இடம்',
    filterPriceRange: 'அதிகபட்ச விலை (ரூ./கிலோ)',
    sortBy: 'வரிசைப்படுத்து',
    sortPriceLowHigh: 'விலை: குறைவில் இருந்து அதிகம்',
    sortPriceHighLow: 'விலை: அதிகத்தில் இருந்து குறைவு',
    sortAvailability: 'இருப்பு அளவு அதிகம்',
    badgeFresh: 'தோட்டத்து புதுமை',
    gradeLabel: 'தரம்',
    perKg: 'ரூ./கிலோ',
    availableStock: 'கையிருப்பில்',
    btnAddToCart: 'கூடையில் சேர்க்க',
    btnBuyNow: 'உடனே வாங்க',
    viewDetails: 'விலை விவரங்கள் காண்க',
    noVegetablesFound: 'உங்கள் தேடலுக்கு ஏற்ற காய்கறிகள் எதுவும் கிடைக்கவில்லை.',

    // Product Details Modal
    modalHarvestedOn: 'அறுவடை செய்யப்பட்ட நாள்',
    modalMinOrder: 'குறைந்தபட்ச ஆர்டர் அளவு',
    modalOrigin: 'தோட்ட மாவட்டம்',
    modalDeliveryTime: 'போக்குவரத்து நேரம்',
    modalQualityGuarantee: '100% தரம் பரிசோதிக்கப்பட்ட காய்கறி',
    modalQuantitySelect: 'தேவையான அளவை தேர்வு செய்க',
    costBreakdownTitle: 'வெளிப்படையான விலை விவரம்',
    vegetableCost: 'காய்கறி விலை',
    transportCost: 'போக்குவரத்து செலவு',
    handlingCost: 'தரப் பாதுகாப்பு & கையாளும் கட்டணம்',
    totalAmount: 'செலுத்த வேண்டிய மொத்தத் தொகை',
    btnProceedToCheckout: 'ஆர்டருக்கு தொடரவும்',

    // Checkout
    checkoutTitle: 'ஆர்டர் உறுதிப்படுத்தல் & பணம் செலுத்துதல்',
    checkoutSubtitle: 'டெலிவரி முகவரியை உள்ளிட்டு பணம் செலுத்தும் முறையை தேர்வு செய்யவும்.',
    deliveryDetailsTitle: 'டெலிவரி மற்றும் குடோன் விவரங்கள்',
    inputFullName: 'பெயர் / வணிக நிறுவனம்',
    inputPhone: 'கைபேசி எண்',
    inputAddress: 'டெலிவரி முகவரி / கடை / குடோன்',
    inputCity: 'நகரம் / மாவட்டம்',
    paymentMethodTitle: 'பணம் செலுத்தும் முறை',
    payUPI: 'யுபிஐ (GPay / PhonePe / Paytm)',
    payCard: 'டெபிட் / கிரெடிட் கார்டு',
    payCOD: 'பொருளைப் பெற்று பணம் செலுத்துதல் (COD)',
    payNetBanking: 'நெட் பேங்கிங் / RTGS',
    btnConfirmOrder: 'ஆர்டரை உறுதிப்படுத்துக',
    orderSuccessTitle: 'ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!',
    orderSuccessDesc: 'உங்கள் ஆர்டர் ஏற்கப்பட்டது. எங்கள் தளத்தின் போக்குவரத்து வாகனம் ஒதுக்கப்படுகிறது.',
    btnTrackYourOrder: 'ஆர்டரை கண்காணிக்க',

    // Procurement Center
    procurementCenterTitle: 'கொள்முதல் மற்றும் வணிகக் கட்டுப்பாட்டு மையம்',
    procurementSubtitle: 'விவசாயிகளின் பயிர் கோரிக்கைகளை பரிசீலித்து, கொள்முதல் விலையை நிர்ணயித்து, லாபத்தை நிர்வகிக்கவும்.',
    tabFarmerRequests: 'விவசாயி விற்பனை கோரிக்கைகள்',
    tabInventory: 'இருப்பு காய்கறிகள்',
    tabBuyerOrders: 'வாங்குபவர் ஆர்டர்கள்',
    tabProfitCalculator: 'லாபக் கணக்கீடு',
    tabAnalytics: 'வணிக அளவீடுகள்',
    reviewRequestTitle: 'விவசாயி கோரிக்கையை ஆய்வு செய்க',
    btnReview: 'ஆய்வு செய்க',
    btnAccept: 'ஏற்று கொள்முதல் செய்',
    btnReject: 'நிராகரி',
    btnSetPrice: 'கொள்முதல் விலையை பூட்டுக',
    inputProcurementPrice: 'ஒப்புக்கொள்ளப்பட்ட கொள்முதல் விலை (ரூ./கிலோ)',
    calcTotalProcurementCost: 'மொத்த கொள்முதல் செலவு',
    inventoryTitle: 'கிடங்கு & தோட்ட இருப்பு',
    availableForSale: 'விற்பனைக்கு தயாராக உள்ளவை',
    procuredCostAvg: 'சராசரி கொள்முதல் விலை',
    suggestedSellPrice: 'விற்பனை விலை',
    btnUpdateSellPrice: 'விலையை மாற்றுக',

    // Profit Calculator
    profitCalcTitle: 'கொள்முதல் & லாப வரம்பு கணக்கீட்டுக் கருவி',
    profitCalcSubtitle: 'விவசாயி விலை, போக்குவரத்து மற்றும் கையாளுதல் செலவுகளைக் கழித்து ஒரு கிலோவிற்கான நிகர லாபத்தைக் காண்க.',
    fieldFarmerPurchasePrice: 'விவசாயி கொள்முதல் விலை (ரூ./கிலோ)',
    fieldSellingPrice: 'விற்பனை விலை (ரூ./கிலோ)',
    fieldTransportCostPerKg: 'போக்குவரத்து செலவு (ரூ./கிலோ)',
    fieldHandlingCostPerKg: 'இதர கையாளுதல் கட்டணம் (ரூ./கிலோ)',
    calcExpectedProfit: 'எதிர்பார்க்கப்படும் நிகர லாபம்',
    calcProfitPercentage: 'லாப வரம்பு சதவீதம்',
    calcFormulaExplanation: 'லாபம் = விற்பனை விலை - கொள்முதல் விலை - போக்குவரத்து - கையாளுதல்',
    calcPurchaseCostTotal: 'மொத்த கொள்முதல் தொகை',
    calcSellingRevenueTotal: 'மொத்த விற்பனை வருமானம்',
    calcGrossMargin: 'மொத்த விளிம்பு',

    // Transport Management
    transportDashboardTitle: 'போக்குவரத்து & வாகனங்கள் கண்காணிப்பு',
    transportSubtitle: 'தோட்டத்தில் இருந்து வாங்குபவர் வரை காய்கறிகளை ஏற்றிச்செல்லும் வாகனங்களை நிர்வகிக்கவும்.',
    tabAssignedTrips: 'ஒதுக்கப்பட்ட பயணங்கள்',
    tabSmartLogistics: 'ஸ்மார்ட் போக்குவரத்து தேர்வு',
    tabAgencyFleet: 'பதிவுசெய்த வாகனங்கள்',
    colTripId: 'பயண எண்',
    colPickup: 'தோட்டம் (பிக்கப்)',
    colDestination: 'சென்றடையும் இடம்',
    colDistance: 'தூரம்',
    colAgency: 'போக்குவரத்து நிறுவனம்',
    colTransportCost: 'வாடகை செலவு',
    btnAssignAgency: 'வாகனத்தை ஒதுக்குக',
    smartTransportTitle: 'ஸ்மார்ட் போக்குவரத்து தேர்வு அமைப்பு',
    smartTransportDesc: 'தூரம், எடை கொள்ளளவு மற்றும் வழித்தடத்தின் அடிப்படையில் சிறந்த வாகனத்தை எங்கள் சிஸ்டம் பரிந்துரைக்கிறது.',
    recommendedAgency: 'பரிந்துரைக்கப்படும் போக்குவரத்து நிறுவனம்',
    btnAcceptTrip: 'பயணத்தை ஏற்றிடுக',
    btnUpdateStatus: 'டெலிவரி நிலையை மாற்று',
    statusTransportRequested: 'வாகனம் கோரப்பட்டது',
    statusAgencyAssigned: 'ஏஜென்சி ஒதுக்கப்பட்டது',
    statusPickupScheduled: 'பிக்கப் திட்டமிடப்பட்டது',
    statusPickedUp: 'காய்கறிகள் ஏற்றப்பட்டன',
    statusInTransit: 'வாகனம் பயணத்தில் உள்ளது',
    statusDelivered: 'வெற்றிகரமாக டெலிவரி செய்யப்பட்டது',

    // Order Tracking
    trackingTitle: 'நேரடி ஆர்டர் மற்றும் போக்குவரத்து கண்காணிப்பு',
    trackingSubtitle: 'விவசாயத் தோட்டம் முதல் உங்கள் கடை வரை 7 படிநிலைகளில் காய்கறி எங்கே உள்ளது என்பதை அறியவும்.',
    enterOrderIdPlaceholder: 'ஆர்டர் எண்ணை உள்ளிடவும் (எ.கா: ORD-8492)',
    btnSearchOrder: 'கண்காணிக்க',
    timelineOrderConfirmed: 'ஆர்டர் உறுதிப்படுத்தப்பட்டது',
    timelineProcurementCompleted: 'கொள்முதல் நிறைவடைந்தது',
    timelinePickupScheduled: 'பிக்கப் திட்டமிடப்பட்டது',
    timelineVegetablesCollected: 'காய்கறிகள் பெறப்பட்டன',
    timelineInTransit: 'வாகனம் வழியில் உள்ளது',
    timelineOutForDelivery: 'டெலிவரிக்கு புறப்பட்டது',
    timelineDelivered: 'டெலிவரி செய்யப்பட்டது',
    orderSummaryDetails: 'ஆர்டர் சுருக்கம்',
    trackingFarmerSource: 'விளைந்த தோட்டம்',
    trackingVehicleNo: 'வாகன எண்',
    trackingDriver: 'ஓட்டுநர் பெயர்',
    trackingCallDriver: 'ஓட்டுநரை அழைக்க',

    // Notification Center
    notificationCenterTitle: 'முக்கிய அறிவிப்புகள்',
    markAllAsRead: 'அனைத்தையும் வாசித்ததாக குறிக்கவும்',
    noNotifications: 'புதிய அறிவிப்புகள் எதுவும் இல்லை.',

    // Common
    allRightsReserved: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. அக்ரிமார்க்கெட் பிரைவேட் லிமிடெட்.',
    quickLinks: 'முக்கிய இணைப்புகள்',
    contactSupport: '24/7 விவசாயி & வாங்குபவர் உதவி எண்: 1800-425-AGRI (2474)',
    transparentCommitment:
      'நாங்கள் உங்கள் நம்பகமான விவசாய கொள்முதல் மற்றும் போக்குவரத்து கூட்டாளியாக செயல்படுகிறோம்.',
    close: 'மூடுக',
    save: 'சேமிக்க',

    // Authentication
    authLoginTitle: 'அக்ரிகனெக்டில் உள்நுழைக',
    authLoginSubtitle: 'நேரடி விவசாய சந்தை, விலை நிர்ணயம் மற்றும் ஸ்மார்ட் போக்குவரத்தை அணுகவும்.',
    authSignupTitle: 'புதிய கணக்கை உருவாக்கவும்',
    authSignupSubtitle: 'சரிபார்க்கப்பட்ட விவசாயிகள், மொத்த வியாபாரிகள் மற்றும் போக்குவரத்து நிறுவனங்களுடன் இணையுங்கள்.',
    authIdentifier: 'தொலைபேசி எண் அல்லது மின்னஞ்சல்',
    authPhone: 'மொபைல் எண்',
    authEmail: 'மின்னஞ்சல் (விருப்பத்தேர்வு)',
    authPassword: 'கடவுச்சொல்',
    authConfirmPassword: 'கடவுச்சொல்லை உறுதி செய்க',
    authRole: 'உங்கள் பிரிவைத் தேர்ந்தெடுக்கவும்',
    authRoleFarmer: 'விவசாயி / உற்பத்தியாளர் குழு (FPO)',
    authRoleBuyer: 'வாங்குபவர் / சில்லறை விற்பனையாளர்',
    authRoleLogistics: 'போக்குவரத்து / வாகன உரிமையாளர்',
    authOrgName: 'நிறுவனம் / வியாபார பெயர்',
    authState: 'மாநிலம்',
    authDistrict: 'மாவட்டம்',
    authVillage: 'கிராமம் / நகரம்',
    authRememberMe: 'என்னை நினைவில் கொள்க',
    authForgotPassword: 'கடவுச்சொல் மறந்துவிட்டதா?',
    authBtnSignIn: 'உள்நுழைக',
    authBtnSignUp: 'பதிவு செய்க',
    authNoAccount: 'கணக்கு இல்லையா?',
    authHaveAccount: 'ஏற்கனவே கணக்கு உள்ளதா?',
    authLoggingIn: 'சரிபார்க்கிறது...',
    authSigningUp: 'கணக்கு உருவாக்கப்படுகிறது...',
    authLoginSuccess: 'வரவேற்கிறோம்! வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்.',
    authSignupSuccess: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! அக்ரிகனெக்டிற்கு நல்வரவு.',
    authLoggedOut: 'வெற்றிகரமாக வெளியேறிவிட்டீர்கள்.',
  },
};
