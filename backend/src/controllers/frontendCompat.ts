import { Request, Response } from 'express';
import { MarketPrice, StorageFacility, Lot } from '../models/index.js';
import { AuthRequest } from '../middleware/auth.js';

// GET /api/marketplace
export const getMarketplaceListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, grade, location, status } = req.query;
    const query: any = {};
    if (crop) query.crop = new RegExp(String(crop), 'i');
    if (grade) query.grade = String(grade);
    if (status) query.status = String(status);

    const lots = await Lot.find(query).sort({ createdAt: -1 });

    const formatted = lots.map((lot) => ({
      id: lot._id.toString(),
      farmerId: lot.farmerId?.toString() || 'f1',
      farmerName: lot.farmerName || 'Dev Farmer',
      crop: lot.crop,
      variety: lot.variety || 'Desi Premium',
      quantity: lot.quantity,
      unit: lot.unit || 'kg',
      pricePerUnit: lot.expectedPrice,
      qualityGrade: (lot.grade || 'A') as 'A' | 'B' | 'C',
      location: `${lot.location?.district || 'Nagpur'}, ${lot.location?.state || 'Maharashtra'}`,
      harvestDate: lot.harvestDate || new Date().toISOString().split('T')[0],
      imageUrl:
        lot.photos && lot.photos.length > 0
          ? lot.photos[0]
          : 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      status: lot.status || 'available',
      negotiable: true,
      createdAt: lot.createdAt.toISOString(),
    }));

    res.json({ success: true, listings: formatted, data: formatted });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/market/prices
export const getMarketPricesFrontend = async (_req: Request, res: Response): Promise<void> => {
  try {
    const prices = await MarketPrice.find().limit(30);
    const formatted = prices.map((p, idx) => ({
      id: p._id.toString() || `mp_${idx}`,
      commodity: p.crop,
      variety: p.variety || 'FAQ',
      market: p.market,
      state: p.state || 'Maharashtra',
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      modalPrice: p.modalPrice,
      trend: p.modalPrice > 30 ? 'up' : p.modalPrice < 25 ? 'down' : 'stable',
      changePercent: Number(((p.maxPrice - p.minPrice) / (p.minPrice || 1) * 3).toFixed(1)),
      date: p.date || new Date().toISOString().split('T')[0],
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/storage/facilities
export const getStorageFacilitiesFrontend = async (_req: Request, res: Response): Promise<void> => {
  try {
    const facilities = await StorageFacility.find();
    const formatted = facilities.map((f, idx) => ({
      id: f._id.toString() || `sf_${idx}`,
      name: f.name,
      type: f.type,
      location: `${f.location.district}, ${f.location.state}`,
      totalCapacity: f.capacity,
      availableCapacity: f.availableCapacity,
      unit: 'quintals',
      pricePerQuintalPerMonth: f.ratePerDayPerQuintal * 30,
      temperatureRange: '2°C - 8°C',
      humidityControl: true,
      cctvMonitoring: true,
      insuranceIncluded: true,
      rating: 4.8,
      contactPhone: f.contact || '+91 98765 43210',
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/notifications
export const getNotificationsFrontend = async (_req: AuthRequest, res: Response): Promise<void> => {
  res.json([
    {
      id: 'n_1',
      userId: 'u_1',
      title: 'Optimal Selling Price Alert',
      message: 'Wheat prices reached 30-day peak of ₹32.50/kg at Nagpur APMC.',
      type: 'price_alert',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'n_2',
      userId: 'u_1',
      title: 'Booking Confirmed',
      message: 'Vehicle Tata 407 dispatched for pickup at your farm location.',
      type: 'logistics',
      read: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);
};
