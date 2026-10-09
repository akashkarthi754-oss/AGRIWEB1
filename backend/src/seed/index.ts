import bcrypt from 'bcryptjs';
import {
  User,
  IUser,
  Lot,
  Requirement,
  MarketPrice,
  StorageFacility,
  Vehicle,
  Booking,
} from '../models/index.js';

export const seedDatabase = async () => {
  try {
    console.log('Seeding demo database...');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const demoPassword = await bcrypt.hash('Demo@1234', salt);
    const adminPassword = await bcrypt.hash('Admin@1234', salt);

    // 1. Demo Users (4 Roles: Farmer, Buyer, Transporter, Admin)
    const usersData: Array<Partial<IUser> & { password: string; role: 'farmer' | 'buyer' | 'transporter' | 'admin' | 'logistics'; email: string }> = [
      {
        name: 'Ramesh Patel',
        phone: '9876543210',
        email: 'farmer@agriconnect.com',
        password: demoPassword,
        role: 'farmer',
        language: 'hi',
        location: {
          state: 'Maharashtra',
          district: 'Nagpur',
          village: 'Ramtek',
          address: 'Plot 42, Kisan Nagar',
          pincode: '441106',
        },
        organization: 'Vidarbha Krishi Sangha',
        farmerDetails: {
          farmName: 'Patel Organic Farms',
          farmSize: '15 Acres',
          primaryCrops: 'Tomatoes, Onions, Potatoes, Wheat',
        },
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Priya Sharma (Agro Mills)',
        phone: '9876543211',
        email: 'buyer1@agriconnect.com',
        password: demoPassword,
        role: 'buyer',
        language: 'en',
        location: {
          state: 'Maharashtra',
          district: 'Pune',
          village: 'Hadapsar',
          address: 'Industrial Area Phase 2',
          pincode: '411028',
        },
        organization: 'FreshField Foods India Pvt Ltd',
        buyerDetails: {
          businessType: 'Food Processing',
          city: 'Pune',
        },
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Anil Gupta (Kisan Mart)',
        phone: '9876543212',
        email: 'buyer2@agriconnect.com',
        password: demoPassword,
        role: 'buyer',
        language: 'en',
        location: {
          state: 'Gujarat',
          district: 'Ahmedabad',
          village: 'Sanand',
          address: 'GIDC Commercial Complex',
          pincode: '382110',
        },
        organization: 'Kisan Retail Network',
        buyerDetails: {
          businessType: 'Wholesaler',
          city: 'Ahmedabad',
        },
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Suresh Express Logistics',
        phone: '9876543213',
        email: 'transporter@agriconnect.com',
        password: demoPassword,
        role: 'transporter',
        language: 'en',
        location: {
          state: 'Maharashtra',
          district: 'Nagpur',
          village: 'MIDC Butibori',
          address: 'Transport Nagar Gate 3',
          pincode: '441108',
        },
        organization: 'Kisan Gati Transport Fleet',
        transporterDetails: {
          transportAgencyName: 'Kisan Gati Fleet Services',
          vehicleType: '6 Ton Truck',
          vehicleRegNumber: 'MH-31-TR-4589',
          vehicleCapacity: '6000 kg',
          driverName: 'Suresh Express',
          driverPhone: '9876543213',
          operatingState: 'Maharashtra',
          operatingDistrict: 'Nagpur',
        },
        isVerified: true,
        isActive: true,
      },
      {
        name: 'AgriConnect System Administrator',
        phone: '9876500000',
        email: 'admin@agriconnect.com',
        password: adminPassword,
        role: 'admin',
        language: 'en',
        location: {
          state: 'Tamil Nadu',
          district: 'Chennai',
          village: 'T. Nagar',
          address: 'AgriConnect HQ, Anna Salai',
          pincode: '600017',
        },
        organization: 'AgriConnect Governance Core',
        isVerified: true,
        isActive: true,
      },
    ];

    for (const u of usersData) {
      const exists = await User.findOne({
        $or: [{ phone: u.phone }, { email: u.email }],
      });
      if (!exists) {
        await User.create(u);
      } else {
        // Ensure role and details are updated to latest schema
        await User.updateOne(
          { _id: exists._id },
          {
            $set: {
              role: u.role,
              location: u.location,
              organization: u.organization,
              isVerified: true,
              isActive: true,
              ...(u.farmerDetails && { farmerDetails: u.farmerDetails }),
              ...(u.buyerDetails && { buyerDetails: u.buyerDetails }),
              ...(u.transporterDetails && { transporterDetails: u.transporterDetails }),
            },
          }
        );
      }
    }

    const farmer = await User.findOne({ phone: '9876543210' });
    const buyer1 = await User.findOne({ phone: '9876543211' });

    // 2. Demo Produce Lots
    if (farmer) {
      const lotsCount = await Lot.countDocuments();
      if (lotsCount === 0) {
        await Lot.create([
          {
            farmerId: farmer._id,
            farmerName: farmer.name,
            crop: 'Wheat (Sharbati)',
            variety: 'C-306 Desi Premium',
            quantity: 5000,
            unit: 'kg',
            expectedPrice: 32,
            harvestDate: '2026-03-15',
            location: farmer.location,
            photos: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600'],
            status: 'available',
            grade: 'A',
            qualityScore: 94,
            defects: ['Uniform grain size', 'Ideal golden luster'],
          },
          {
            farmerId: farmer._id,
            farmerName: farmer.name,
            crop: 'Soybean',
            variety: 'JS-335',
            quantity: 3500,
            unit: 'kg',
            expectedPrice: 48,
            harvestDate: '2026-03-20',
            location: farmer.location,
            photos: ['https://images.unsplash.com/photo-1599818816933-4f99589d8cfb?w=600'],
            status: 'available',
            grade: 'A',
            qualityScore: 91,
            defects: ['Low moisture content 10.2%'],
          },
          {
            farmerId: farmer._id,
            farmerName: farmer.name,
            crop: 'Nagpur Orange',
            variety: 'Mandarin Grade-1',
            quantity: 2000,
            unit: 'kg',
            expectedPrice: 55,
            harvestDate: '2026-03-25',
            location: farmer.location,
            photos: ['https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600'],
            status: 'available',
            grade: 'A',
            qualityScore: 96,
            defects: ['High brix sweetness rating'],
          },
        ]);
      }
    }

    // 3. Buyer Requirements
    if (buyer1) {
      const reqCount = await Requirement.countDocuments();
      if (reqCount === 0) {
        await Requirement.create([
          {
            buyerId: buyer1._id,
            buyerName: buyer1.name,
            crop: 'Wheat (Sharbati)',
            variety: 'C-306',
            quantity: 10000,
            unit: 'kg',
            targetPrice: 33,
            requiredDate: '2026-04-10',
            deliveryLocation: 'Pune Processing Plant #2',
            organization: buyer1.organization,
            minGrade: 'A',
            status: 'active',
          },
          {
            buyerId: buyer1._id,
            buyerName: buyer1.name,
            crop: 'Soybean',
            variety: 'JS-335',
            quantity: 8000,
            unit: 'kg',
            targetPrice: 49,
            requiredDate: '2026-04-15',
            deliveryLocation: 'Pune Processing Plant #2',
            organization: buyer1.organization,
            minGrade: 'B',
            status: 'active',
          },
        ]);
      }
    }

    // 4. Market Prices ( realistic Mandi Data )
    const pricesCount = await MarketPrice.countDocuments();
    if (pricesCount === 0) {
      await MarketPrice.create([
        {
          crop: 'Wheat (Sharbati)',
          variety: 'Desi',
          market: 'Nagpur APMC',
          district: 'Nagpur',
          state: 'Maharashtra',
          minPrice: 30,
          maxPrice: 34,
          modalPrice: 32.5,
          arrivalQty: 450,
          date: '2026-04-05',
        },
        {
          crop: 'Soybean',
          variety: 'Yellow',
          market: 'Latur APMC',
          district: 'Latur',
          state: 'Maharashtra',
          minPrice: 46,
          maxPrice: 51,
          modalPrice: 48.5,
          arrivalQty: 1200,
          date: '2026-04-05',
        },
        {
          crop: 'Nagpur Orange',
          variety: 'Mandarin',
          market: 'Kalmeshwar Mandi',
          district: 'Nagpur',
          state: 'Maharashtra',
          minPrice: 48,
          maxPrice: 58,
          modalPrice: 54.0,
          arrivalQty: 800,
          date: '2026-04-05',
        },
        {
          crop: 'Red Onion',
          variety: 'Nashik Red',
          market: 'Lasalgaon APMC',
          district: 'Nashik',
          state: 'Maharashtra',
          minPrice: 18,
          maxPrice: 24,
          modalPrice: 21.0,
          arrivalQty: 3500,
          date: '2026-04-05',
        },
        {
          crop: 'Tomato',
          variety: 'Hybrid Vaishali',
          market: 'Pimpalgaon APMC',
          district: 'Nashik',
          state: 'Maharashtra',
          minPrice: 16,
          maxPrice: 26,
          modalPrice: 22.0,
          arrivalQty: 1800,
          date: '2026-04-05',
        },
      ]);
    }

    // 5. Storage Facilities
    const storageCount = await StorageFacility.countDocuments();
    if (storageCount === 0) {
      await StorageFacility.create([
        {
          name: 'Kisan Cold Storage & Agrilog Hub',
          type: 'cold_storage',
          capacity: 80000,
          availableCapacity: 24000,
          ratePerDayPerQuintal: 45,
          location: { district: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
          contact: '+91 98221 00111',
        },
        {
          name: 'Vidarbha Central Warehousing Corp',
          type: 'warehouse',
          capacity: 150000,
          availableCapacity: 65000,
          ratePerDayPerQuintal: 25,
          location: { district: 'Wardha', state: 'Maharashtra', lat: 20.7453, lng: 78.6022 },
          contact: '+91 98221 00222',
        },
      ]);
    }

    // 6. Vehicles
    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0) {
      await Vehicle.create([
        {
          vehicleType: 'Tata Ace (1 Ton)',
          capacityKg: 1000,
          registrationNumber: 'MH-31-AG-1024',
          driverName: 'Kailash Yadav',
          driverPhone: '+91 98111 22334',
          ratePerKm: 18,
          status: 'available',
        },
        {
          vehicleType: 'Tata 407 (2.5 Ton)',
          capacityKg: 2500,
          registrationNumber: 'MH-31-BT-4071',
          driverName: 'Mahesh Deshmukh',
          driverPhone: '+91 98111 55667',
          ratePerKm: 28,
          status: 'available',
        },
        {
          vehicleType: 'Eicher Pro (4 Ton)',
          capacityKg: 4000,
          registrationNumber: 'MH-40-TR-8899',
          driverName: 'Santosh Shinde',
          driverPhone: '+91 98111 99001',
          ratePerKm: 36,
          status: 'available',
        },
      ]);
    }

    // 7. Sample Booking for tracking demonstration
    const sampleLot = await Lot.findOne();
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0 && sampleLot && farmer && buyer1) {
      await Booking.create({
        lotId: sampleLot._id,
        crop: sampleLot.crop,
        quantity: 2000,
        unit: 'kg',
        farmerId: farmer._id,
        farmerName: farmer.name,
        farmerPhone: farmer.phone,
        buyerId: buyer1._id,
        buyerName: buyer1.name,
        buyerPhone: buyer1.phone,
        pickupLocation: 'Ramtek Mandi Yard, Nagpur',
        deliveryLocation: 'FreshField Hub, Pune',
        vehicleType: 'Tata 407 (2.5 Ton)',
        estimatedCost: 6500,
        status: 'IN_TRANSIT',
        tracking: {
          lat: 19.8762,
          lng: 75.3433, // Aurangabad transit waypoint
          lastUpdated: new Date().toISOString(),
          routePoints: [
            { lat: 21.1458, lng: 79.0882 },
            { lat: 20.7453, lng: 78.6022 },
            { lat: 19.8762, lng: 75.3433 },
          ],
        },
        pickupDate: new Date(Date.now() - 12 * 3600000).toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 12 * 3600000).toISOString(),
      });
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
};
