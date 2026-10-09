import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  Lot,
  Requirement,
  MarketPrice,
  StorageFacility,
  Vehicle,
  Booking,
  Payment,
  TransactionEvent,
  Grievance,
  Quality,
} from '../models/index.js';
import { AuthRequest } from '../middleware/auth.js';

// ==========================================
// 1. PRODUCE / LOTS (FARMER)
// ==========================================
export const createLot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { crop, variety, quantity, unit, expectedPrice, harvestDate, location, photos } = req.body;
    const farmerId = req.user?._id;
    const farmerName = req.user?.name || 'Farmer';

    const newLot = await Lot.create({
      farmerId,
      farmerName,
      crop,
      variety: variety || '',
      quantity: Number(quantity),
      unit: unit || 'kg',
      expectedPrice: Number(expectedPrice),
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      location: location || req.user?.location || {},
      photos: photos || [],
      status: 'available',
      grade: 'A',
      qualityScore: 92,
    });

    // Record timeline event
    await TransactionEvent.create({
      lotId: newLot._id,
      eventType: 'LOT_CREATED',
      title: 'Produce Lot Listed',
      description: `Created lot for ${quantity} ${unit || 'kg'} of ${crop}`,
      performedBy: farmerName,
      role: 'farmer',
    });

    res.status(201).json({
      success: true,
      message: 'Lot listed successfully',
      lot: newLot,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyLots = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isSpecial = req.user?.role === 'admin' || req.user?.role === 'buyer';
    const lots = await Lot.find(isSpecial ? {} : { farmerId: req.user?._id }).sort({ createdAt: -1 });
    res.json({ success: true, lots });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLotById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lot = await Lot.findById(id);
    if (!lot) {
      res.status(404).json({ success: false, message: 'Lot not found' });
      return;
    }
    res.json({ success: true, lot });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lot = await Lot.findById(id);
    if (!lot) {
      res.status(404).json({ success: false, message: 'Lot not found' });
      return;
    }

    // Only owner or admin can update
    if (req.user?.role !== 'admin' && String(lot.farmerId) !== String(req.user?._id)) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own produce listings' });
      return;
    }

    const updated = await Lot.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, message: 'Lot updated', lot: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lot = await Lot.findById(id);
    if (!lot) {
      res.status(404).json({ success: false, message: 'Lot not found' });
      return;
    }

    // Only owner or admin can delete
    if (req.user?.role !== 'admin' && String(lot.farmerId) !== String(req.user?._id)) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own produce listings' });
      return;
    }

    await Lot.findByIdAndDelete(id);
    res.json({ success: true, message: 'Lot deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. BUYER REQUIREMENTS
// ==========================================
export const createRequirement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { crop, variety, quantity, unit, targetPrice, requiredDate, deliveryLocation, minGrade } = req.body;
    const buyerId = req.user?._id;
    const buyerName = req.user?.name || 'Buyer';

    const reqItem = await Requirement.create({
      buyerId,
      buyerName,
      crop,
      variety: variety || '',
      quantity: Number(quantity),
      unit: unit || 'kg',
      targetPrice: Number(targetPrice),
      requiredDate: requiredDate || '',
      deliveryLocation: deliveryLocation || '',
      minGrade: minGrade || 'B',
      organization: req.user?.organization || '',
      status: 'active',
    });

    res.status(201).json({ success: true, requirement: reqItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyRequirements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isSpecial = req.user?.role === 'admin' || req.user?.role === 'farmer';
    const requirements = await Requirement.find(isSpecial ? {} : { buyerId: req.user?._id }).sort({ createdAt: -1 });
    res.json({ success: true, requirements });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequirementById = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Requirement.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Requirement not found' });
      return;
    }
    res.json({ success: true, requirement: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRequirement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Requirement.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Requirement not found' });
      return;
    }

    if (req.user?.role !== 'admin' && String(item.buyerId) !== String(req.user?._id)) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own procurement requirements' });
      return;
    }

    const updated = await Requirement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, requirement: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRequirement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Requirement.findById(req.params.id);
    if (!item) {
      res.status(404).json({ success: false, message: 'Requirement not found' });
      return;
    }

    if (req.user?.role !== 'admin' && String(item.buyerId) !== String(req.user?._id)) {
      res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own procurement requirements' });
      return;
    }

    await Requirement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Requirement deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. QUALITY ASSESSMENT
// ==========================================
export const assessQuality = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lot = await Lot.findById(id);

    // Deterministic simulation based on lot crop or id string hash
    const seed = (id || 'default').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const score = 80 + (seed % 18); // 80 - 97
    const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : 'C';

    const defectsPool = ['Minor surface blemishes', 'Uniform shape', 'Ideal moisture level', 'Optimal color density'];
    const selectedDefects = score > 92 ? ['None detected'] : [defectsPool[seed % defectsPool.length]];

    const quality = await Quality.create({
      lotId: lot ? lot._id : new mongoose.Types.ObjectId(),
      grade,
      score,
      defects: selectedDefects,
      moistureContent: 11.5 + (seed % 4) * 0.5,
      foreignMatter: 0.5 + (seed % 3) * 0.4,
    });

    if (lot) {
      lot.grade = grade;
      lot.qualityScore = score;
      lot.defects = selectedDefects;
      await lot.save();

      await TransactionEvent.create({
        lotId: lot._id,
        eventType: 'QUALITY_ASSESSED',
        title: `Quality Verified: Grade ${grade}`,
        description: `Score: ${score}/100. Defects: ${selectedDefects.join(', ')}`,
        performedBy: 'AI Quality Engine',
        role: 'system',
      });
    }

    res.json({
      success: true,
      grade,
      score,
      defects: selectedDefects,
      quality,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLotQuality = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const quality = await Quality.findOne({ lotId: id }).sort({ createdAt: -1 });
    if (!quality) {
      res.json({
        success: true,
        grade: 'A',
        score: 92,
        defects: ['None detected'],
      });
      return;
    }
    res.json({ success: true, quality, grade: quality.grade, score: quality.score });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. MARKET PRICES
// ==========================================
export const getMarketPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, district } = req.query;
    const query: any = {};
    if (crop) query.crop = new RegExp(String(crop), 'i');
    if (district) query.district = new RegExp(String(district), 'i');

    const prices = await MarketPrice.find(query).limit(50);
    res.json({ success: true, prices });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMarketTrend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, days = 30 } = req.query;
    const numDays = Math.min(Number(days) || 30, 90);
    const cropName = String(crop || 'Wheat');

    // Generate trend points
    const basePrice = cropName.toLowerCase().includes('onion') ? 35 : cropName.toLowerCase().includes('tomato') ? 40 : 28;
    const series = [];
    const now = new Date();

    for (let i = numDays; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const variance = Math.sin(i / 3) * 4 + ((i * 13) % 5);
      series.push({
        date: d.toISOString().split('T')[0],
        price: Math.max(15, Math.round(basePrice + variance)),
        volume: 800 + ((i * 17) % 300),
      });
    }

    res.json({ success: true, crop: cropName, days: numDays, series });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. MATCHING ENGINE
// ==========================================
export const getLotMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lot = await Lot.findById(id);

    // Find requirements or generate ranked buyers
    const matchingRequirements = lot
      ? await Requirement.find({ crop: new RegExp(lot.crop, 'i') }).limit(10)
      : [];

    const matches = matchingRequirements.map((reqItem, idx) => {
      const matchScore = 95 - idx * 7;
      const priceOffered = reqItem.targetPrice || (lot ? lot.expectedPrice * 1.05 : 30);
      return {
        id: String(reqItem._id),
        buyerId: String(reqItem.buyerId),
        buyerName: reqItem.buyerName || `Premium Buyer ${idx + 1}`,
        organization: reqItem.organization || 'AgriTrade FPO Ltd',
        crop: reqItem.crop,
        quantity: reqItem.quantity,
        priceOffered,
        distanceKm: 25 + idx * 18,
        rating: 4.8 - idx * 0.2,
        matchScore,
        paymentTerms: 'Escrow guaranteed, instant on delivery',
      };
    });

    // Fallback if no matching buyers in database
    if (matches.length === 0) {
      matches.push(
        {
          id: 'demo_match_1',
          buyerId: 'demo_buyer_1',
          buyerName: 'Ramesh Agro Traders',
          organization: 'Kisan Mart FPO',
          crop: lot?.crop || 'Wheat',
          quantity: lot ? lot.quantity : 1000,
          priceOffered: lot ? Math.round(lot.expectedPrice * 1.08) : 32,
          distanceKm: 34,
          rating: 4.9,
          matchScore: 96,
          paymentTerms: 'Immediate UPI on weighbridge confirmation',
        },
        {
          id: 'demo_match_2',
          buyerId: 'demo_buyer_2',
          buyerName: 'Metro Food Processors',
          organization: 'Metro Direct Procure',
          crop: lot?.crop || 'Wheat',
          quantity: lot ? lot.quantity : 2500,
          priceOffered: lot ? Math.round(lot.expectedPrice * 1.03) : 30,
          distanceKm: 65,
          rating: 4.7,
          matchScore: 88,
          paymentTerms: 'Net 2 days via Escrow',
        }
      );
    }

    res.json({ success: true, lotId: id, matches });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 6. NET REALISATION
// ==========================================
export const getNetRealisation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { buyerId } = req.query;
    const lot = await Lot.findById(id);

    const qty = lot ? lot.quantity : 1000;
    const pricePerKg = lot ? lot.expectedPrice : 30;
    const gross = qty * pricePerKg;

    // Breakdown
    const transportCost = Math.round(qty * 1.8 + 800);
    const mandiFee = Math.round(gross * 0.015);
    const storageCost = 250;
    const net = gross - transportCost - mandiFee - storageCost;

    const insight = buyerId
      ? `Selecting direct FPO procurement yields ₹${Math.round(gross * 0.08)} more net profit than local mandi intermediaries.`
      : 'Direct buyer matching eliminates ₹3,400 in intermediary markups.';

    res.json({
      success: true,
      lotId: id,
      buyerId,
      gross,
      transportCost,
      mandiFee,
      storageCost,
      net,
      netPerUnit: Number((net / (qty || 1)).toFixed(2)),
      insight,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 7. STORAGE ADVICE
// ==========================================
export const getStorageAdvice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lot = await Lot.findById(id);

    // Realistic advice calculation
    const currentPrice = lot ? lot.expectedPrice : 30;
    const predictedPriceIn30Days = Math.round(currentPrice * 1.18);
    const storageCost30Days = 1.2 * 30; // ₹1.2 per kg for 30 days
    const profitDelta = predictedPriceIn30Days - currentPrice - storageCost30Days;

    const recommendation = profitDelta > 0 ? 'STORE' : 'SELL_NOW';
    const nearestFacility = await StorageFacility.findOne();

    res.json({
      success: true,
      lotId: id,
      recommendation,
      currentPrice,
      predictedPriceIn30Days,
      expectedGainPerKg: Number(profitDelta.toFixed(2)),
      reason:
        recommendation === 'STORE'
          ? `Expected price rise of +18% over next 30 days exceeds cold storage fees.`
          : `Current mandi demand is peak; holding produce incurs unnecessary storage fees.`,
      facility: nearestFacility || {
        name: 'Kisan Sheet Griha Cold Storage',
        type: 'cold_storage',
        capacity: 50000,
        availableCapacity: 12000,
        ratePerDayPerQuintal: 45,
        distanceKm: 18,
        contact: '+91 98765 43210',
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 8. LOGISTICS & VEHICLES
// ==========================================
export const getVehicleRecommendation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lot = await Lot.findById(id);
    const weight = lot ? lot.quantity : 1500;

    let vehicleType = 'Tata Ace (1 Ton)';
    if (weight > 5000) vehicleType = '10 Wheeler Truck (16 Ton)';
    else if (weight > 2000) vehicleType = 'Eicher Pro (4 Ton)';
    else if (weight > 1000) vehicleType = 'Tata 407 (2.5 Ton)';

    res.json({
      success: true,
      lotId: id,
      lotWeightKg: weight,
      recommendedVehicle: vehicleType,
      estimatedRatePerKm: 28,
      recommendedCapacityKg: weight > 2000 ? 5000 : 2500,
      alternatives: [
        { type: 'Tata Ace (1 Ton)', capacityKg: 1000, ratePerKm: 18 },
        { type: 'Tata 407 (2.5 Ton)', capacityKg: 2500, ratePerKm: 28 },
        { type: 'Eicher Pro (4 Ton)', capacityKg: 4000, ratePerKm: 38 },
      ],
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      lotId,
      crop,
      quantity,
      unit,
      farmerName,
      farmerPhone,
      buyerName,
      buyerPhone,
      pickupLocation,
      deliveryLocation,
      vehicleType,
      estimatedCost,
    } = req.body;

    const booking = await Booking.create({
      lotId: lotId ? new mongoose.Types.ObjectId(lotId) : undefined,
      crop: crop || 'Produce',
      quantity: Number(quantity) || 1000,
      unit: unit || 'kg',
      farmerId: req.user?.role === 'farmer' ? req.user._id : undefined,
      farmerName: farmerName || req.user?.name || 'Farmer',
      farmerPhone: farmerPhone || req.user?.phone || '9876543210',
      buyerId: req.user?.role === 'buyer' ? req.user._id : undefined,
      buyerName: buyerName || 'Buyer',
      buyerPhone: buyerPhone || '9876543211',
      pickupLocation: pickupLocation || 'Mandi Yard Gate 2',
      deliveryLocation: deliveryLocation || 'Central Warehouse, Delhi',
      vehicleType: vehicleType || 'Tata 407 (2.5 Ton)',
      estimatedCost: Number(estimatedCost) || 2800,
      status: 'BOOKED',
      tracking: {
        lat: 28.6139,
        lng: 77.209,
        lastUpdated: new Date().toISOString(),
        routePoints: [
          { lat: 28.6139, lng: 77.209 },
          { lat: 28.625, lng: 77.218 },
          { lat: 28.64, lng: 77.23 },
        ],
      },
      pickupDate: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    await TransactionEvent.create({
      bookingId: booking._id,
      lotId: booking.lotId,
      eventType: 'LOGISTICS_BOOKED',
      title: 'Transport Booked',
      description: `Transport reserved: ${booking.vehicleType} for ${booking.quantity} ${booking.unit}`,
      performedBy: req.user?.name || 'User',
      role: req.user?.role || 'farmer',
    });

    res.status(201).json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const role = req.user?.role;
    let query: any = {};
    if (role === 'farmer') query = { farmerId: req.user?._id };
    else if (role === 'buyer') query = { buyerId: req.user?._id };
    else if (role === 'transporter' || role === 'logistics') {
      query = {
        $or: [
          { transporterId: req.user?._id },
          { transporterId: { $exists: false } },
          { status: { $ne: 'CANCELLED' } },
        ],
      };
    } else if (role === 'admin') {
      query = {};
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    await TransactionEvent.create({
      bookingId: booking._id,
      lotId: booking.lotId,
      eventType: `STATUS_${status}`,
      title: `Shipment Status: ${status}`,
      description: `Logistics status moved to ${status}`,
      performedBy: req.user?.name || 'Logistics Partner',
      role: 'logistics',
    });

    res.json({ success: true, booking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 9. TRACKING & LIVE LOCATION
// ==========================================
export const getBookingTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    const steps = ['BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED'];
    const currentStepIndex = steps.indexOf(booking.status);

    res.json({
      success: true,
      bookingId: booking._id,
      status: booking.status,
      currentStepIndex: currentStepIndex >= 0 ? currentStepIndex : 0,
      steps,
      tracking: booking.tracking,
      estimatedDeliveryDate: booking.estimatedDeliveryDate,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    booking.tracking.lat = Number(lat);
    booking.tracking.lng = Number(lng);
    booking.tracking.lastUpdated = new Date().toISOString();
    booking.tracking.routePoints.push({ lat: Number(lat), lng: Number(lng) });

    await booking.save();
    res.json({ success: true, tracking: booking.tracking });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 10. DELIVERY CONFIRMATION (BUYER)
// ==========================================
export const confirmDeliveryReceipt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { receivedQty, receivedGrade } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    booking.receivedQty = Number(receivedQty);
    booking.receivedGrade = receivedGrade;
    booking.status = 'DELIVERED';
    booking.actualDeliveryDate = new Date().toISOString();

    // Check discrepancy
    const expectedQty = booking.quantity;
    const qtyDiffPercent = Math.abs((Number(receivedQty) - expectedQty) / expectedQty) * 100;
    const isMismatch = qtyDiffPercent > 5 || (receivedGrade && receivedGrade !== 'A');
    booking.qualityDiscrepancy = isMismatch;

    await booking.save();

    await TransactionEvent.create({
      bookingId: booking._id,
      lotId: booking.lotId,
      eventType: 'DELIVERY_CONFIRMED',
      title: 'Receipt Confirmed by Buyer',
      description: `Received ${receivedQty} ${booking.unit} (Grade ${receivedGrade}). Discrepancy: ${isMismatch ? 'YES' : 'NONE'}`,
      performedBy: req.user?.name || 'Buyer',
      role: 'buyer',
    });

    res.json({
      success: true,
      message: 'Delivery receipt recorded',
      booking,
      hasDiscrepancy: isMismatch,
      discrepancyNote: isMismatch
        ? `Warning: Received quantity or grade differs by ${qtyDiffPercent.toFixed(1)}%. Grievance check enabled.`
        : 'Quality and quantity matched verified specs.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 11. PAYMENTS (SANDBOX)
// ==========================================
export const initiatePayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bookingId, lotId, amount, payeeId } = req.body;

    const payment = await Payment.create({
      bookingId: bookingId ? new mongoose.Types.ObjectId(bookingId) : undefined,
      lotId: lotId ? new mongoose.Types.ObjectId(lotId) : undefined,
      payerId: req.user?._id || new mongoose.Types.ObjectId(),
      payeeId: payeeId ? new mongoose.Types.ObjectId(payeeId) : req.user?._id || new mongoose.Types.ObjectId(),
      amount: Number(amount) || 25000,
      currency: 'INR',
      status: 'ESCROW',
      gatewayTransactionId: `TXN_SANDBOX_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`,
      notes: 'Secured via AgriConnect Escrow Protection',
    });

    await TransactionEvent.create({
      bookingId: payment.bookingId,
      lotId: payment.lotId,
      eventType: 'PAYMENT_ESCROW',
      title: 'Payment Deposited in Escrow',
      description: `₹${payment.amount.toLocaleString()} locked safely until delivery confirmation.`,
      performedBy: req.user?.name || 'Buyer',
      role: 'buyer',
    });

    res.status(201).json({ success: true, payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const confirmPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentId } = req.body;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment record not found' });
      return;
    }

    payment.status = 'RELEASED';
    await payment.save();

    await TransactionEvent.create({
      bookingId: payment.bookingId,
      lotId: payment.lotId,
      eventType: 'PAYMENT_RELEASED',
      title: 'Payment Released to Farmer',
      description: `₹${payment.amount.toLocaleString()} transferred to beneficiary bank account.`,
      performedBy: 'Escrow Smart Contract',
      role: 'system',
    });

    res.json({ success: true, message: 'Payment released successfully', payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }
    res.json({ success: true, payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 12. TIMELINE & ANALYTICS
// ==========================================
export const getLotTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const events = await TransactionEvent.find({ lotId: id }).sort({ timestamp: -1 });

    res.json({ success: true, lotId: id, events });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnalyticsSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const role = req.user?.role || 'farmer';

    const lotsCount = await Lot.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    const requirementsCount = await Requirement.countDocuments();

    let summary: any = {};
    if (role === 'farmer') {
      summary = {
        totalProduceListed: `${lotsCount * 12} Quintals`,
        activeListings: lotsCount,
        completedDeals: bookingsCount,
        totalEarnings: '₹1,84,500',
        avgPriceRealized: '₹32.40 / kg',
        topCrop: 'Sharbati Wheat',
      };
    } else if (role === 'buyer') {
      summary = {
        totalRequirements: requirementsCount,
        activeOrders: bookingsCount,
        procuredQuantity: '48.5 MT',
        totalSpend: '₹14,20,000',
        avgCostSavings: '8.4%',
      };
    } else {
      summary = {
        activeTrips: bookingsCount,
        fleetUtilization: '88%',
        totalKilometers: '14,250 km',
        revenueGenerated: '₹3,45,000',
        onTimeDeliveryRate: '97.2%',
      };
    }

    res.json({ success: true, role, summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 13. GRIEVANCES
// ==========================================
export const createGrievance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lotId, bookingId, title, description, category, againstUser } = req.body;

    let consistency = {
      expectedQty: 1000,
      receivedQty: 950,
      expectedGrade: 'A',
      receivedGrade: 'B',
      hasDiscrepancy: true,
      recommendation: 'Resolution: Seller credit of ₹1,500 suggested based on digital weighbridge data.',
    };

    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (booking) {
        consistency = {
          expectedQty: booking.quantity,
          receivedQty: booking.receivedQty || booking.quantity,
          expectedGrade: 'A',
          receivedGrade: booking.receivedGrade || 'A',
          hasDiscrepancy: !!booking.qualityDiscrepancy,
          recommendation: booking.qualityDiscrepancy
            ? 'Discrepancy detected between origin QC certificate and destination buyer report.'
            : 'Origin and destination records conform within standard tolerance limits.',
        };
      }
    }

    const grievance = await Grievance.create({
      lotId: lotId ? new mongoose.Types.ObjectId(lotId) : undefined,
      bookingId: bookingId ? new mongoose.Types.ObjectId(bookingId) : undefined,
      raisedBy: req.user?._id || new mongoose.Types.ObjectId(),
      raisedByName: req.user?.name || 'User',
      raisedByRole: req.user?.role || 'buyer',
      againstUser: againstUser ? new mongoose.Types.ObjectId(againstUser) : undefined,
      title: title || 'Order Quality Concern',
      description: description || '',
      category: category || 'quality_mismatch',
      consistencyCheck: consistency,
      status: 'OPEN',
    });

    res.status(201).json({ success: true, grievance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyGrievances = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const grievances = await Grievance.find(req.user ? { raisedBy: req.user._id } : {}).sort({ createdAt: -1 });
    res.json({ success: true, grievances });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGrievanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    if (!grievance) {
      res.status(404).json({ success: false, message: 'Grievance not found' });
      return;
    }
    res.json({ success: true, grievance });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
