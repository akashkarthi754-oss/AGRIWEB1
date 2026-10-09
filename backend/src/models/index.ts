import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  email: string;
  password?: string;
  role: 'farmer' | 'buyer' | 'transporter' | 'admin' | 'logistics';
  language?: string;
  location?: {
    state?: string;
    district?: string;
    village?: string;
    address?: string;
    pincode?: string;
  };
  organization?: string;
  farmerDetails?: {
    farmName?: string;
    farmSize?: string;
    primaryCrops?: string;
  };
  buyerDetails?: {
    businessType?: string;
    city?: string;
  };
  transporterDetails?: {
    transportAgencyName?: string;
    vehicleType?: string;
    vehicleRegNumber?: string;
    vehicleCapacity?: string;
    driverName?: string;
    driverPhone?: string;
    operatingState?: string;
    operatingDistrict?: string;
  };
  isVerified?: boolean;
  isActive?: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'transporter', 'admin', 'logistics'],
      required: true,
      default: 'farmer',
      index: true,
    },
    language: { type: String, default: 'en' },
    location: {
      state: { type: String, default: '' },
      district: { type: String, default: '' },
      village: { type: String, default: '' },
      address: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    organization: { type: String, default: '' },
    farmerDetails: {
      farmName: { type: String, default: '' },
      farmSize: { type: String, default: '' },
      primaryCrops: { type: String, default: '' },
    },
    buyerDetails: {
      businessType: { type: String, default: '' },
      city: { type: String, default: '' },
    },
    transporterDetails: {
      transportAgencyName: { type: String, default: '' },
      vehicleType: { type: String, default: '' },
      vehicleRegNumber: { type: String, default: '' },
      vehicleCapacity: { type: String, default: '' },
      driverName: { type: String, default: '' },
      driverPhone: { type: String, default: '' },
      operatingState: { type: String, default: '' },
      operatingDistrict: { type: String, default: '' },
    },
    isVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

// Lot (Produce)
export interface ILot extends Document {
  farmerId: mongoose.Types.ObjectId;
  farmerName: string;
  crop: string;
  variety: string;
  quantity: number;
  unit: string;
  expectedPrice: number;
  harvestDate: string;
  location: {
    state?: string;
    district?: string;
    village?: string;
  };
  photos: string[];
  status: 'available' | 'matched' | 'sold' | 'stored';
  grade?: string;
  qualityScore?: number;
  defects?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const LotSchema = new Schema<ILot>(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: { type: String, default: '' },
    crop: { type: String, required: true },
    variety: { type: String, default: '' },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    expectedPrice: { type: Number, required: true },
    harvestDate: { type: String, default: '' },
    location: {
      state: { type: String, default: '' },
      district: { type: String, default: '' },
      village: { type: String, default: '' },
    },
    photos: [{ type: String }],
    status: { type: String, enum: ['available', 'matched', 'sold', 'stored'], default: 'available' },
    grade: { type: String, default: 'A' },
    qualityScore: { type: Number, default: 90 },
    defects: [{ type: String }],
  },
  { timestamps: true }
);

export const Lot = mongoose.model<ILot>('Lot', LotSchema);

// Quality Report
export interface IQuality extends Document {
  lotId: mongoose.Types.ObjectId;
  grade: 'A' | 'B' | 'C';
  score: number;
  defects: string[];
  moistureContent: number;
  foreignMatter: number;
  certifiedAt: Date;
}

const QualitySchema = new Schema<IQuality>(
  {
    lotId: { type: Schema.Types.ObjectId, ref: 'Lot', required: true },
    grade: { type: String, enum: ['A', 'B', 'C'], required: true },
    score: { type: Number, required: true },
    defects: [{ type: String }],
    moistureContent: { type: Number, default: 12 },
    foreignMatter: { type: Number, default: 1.5 },
    certifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Quality = mongoose.model<IQuality>('Quality', QualitySchema);

// Market Price
export interface IMarketPrice extends Document {
  crop: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  arrivalQty: number;
  date: string;
}

const MarketPriceSchema = new Schema<IMarketPrice>(
  {
    crop: { type: String, required: true, index: true },
    variety: { type: String, default: '' },
    market: { type: String, required: true },
    district: { type: String, required: true, index: true },
    state: { type: String, default: '' },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    modalPrice: { type: Number, required: true },
    arrivalQty: { type: Number, default: 100 },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  { timestamps: true }
);

export const MarketPrice = mongoose.model<IMarketPrice>('MarketPrice', MarketPriceSchema);

// Buyer Requirement
export interface IRequirement extends Document {
  buyerId: mongoose.Types.ObjectId;
  buyerName: string;
  crop: string;
  variety?: string;
  quantity: number;
  unit: string;
  targetPrice: number;
  requiredDate: string;
  deliveryLocation: string;
  status: 'active' | 'fulfilled' | 'cancelled';
  organization?: string;
  minGrade?: string;
}

const RequirementSchema = new Schema<IRequirement>(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    buyerName: { type: String, default: '' },
    crop: { type: String, required: true },
    variety: { type: String, default: '' },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    targetPrice: { type: Number, required: true },
    requiredDate: { type: String, default: '' },
    deliveryLocation: { type: String, default: '' },
    status: { type: String, enum: ['active', 'fulfilled', 'cancelled'], default: 'active' },
    organization: { type: String, default: '' },
    minGrade: { type: String, default: 'B' },
  },
  { timestamps: true }
);

export const Requirement = mongoose.model<IRequirement>('Requirement', RequirementSchema);

// Storage Facility
export interface IStorageFacility extends Document {
  name: string;
  type: 'cold_storage' | 'warehouse' | 'silo';
  capacity: number;
  availableCapacity: number;
  ratePerDayPerQuintal: number;
  location: {
    district: string;
    state: string;
    lat: number;
    lng: number;
  };
  contact: string;
}

const StorageFacilitySchema = new Schema<IStorageFacility>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['cold_storage', 'warehouse', 'silo'], default: 'cold_storage' },
    capacity: { type: Number, required: true },
    availableCapacity: { type: Number, required: true },
    ratePerDayPerQuintal: { type: Number, required: true },
    location: {
      district: { type: String, required: true },
      state: { type: String, default: '' },
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
    },
    contact: { type: String, default: '' },
  },
  { timestamps: true }
);

export const StorageFacility = mongoose.model<IStorageFacility>('StorageFacility', StorageFacilitySchema);

// Vehicle
export interface IVehicle extends Document {
  vehicleType: string;
  capacityKg: number;
  registrationNumber: string;
  driverName: string;
  driverPhone: string;
  ratePerKm: number;
  status: 'available' | 'in_transit' | 'maintenance';
}

const VehicleSchema = new Schema<IVehicle>(
  {
    vehicleType: { type: String, required: true },
    capacityKg: { type: Number, required: true },
    registrationNumber: { type: String, required: true },
    driverName: { type: String, default: '' },
    driverPhone: { type: String, default: '' },
    ratePerKm: { type: Number, default: 25 },
    status: { type: String, enum: ['available', 'in_transit', 'maintenance'], default: 'available' },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);

// Logistics Booking
export interface IBooking extends Document {
  lotId?: mongoose.Types.ObjectId;
  crop: string;
  quantity: number;
  unit: string;
  farmerId?: mongoose.Types.ObjectId;
  farmerName: string;
  farmerPhone: string;
  buyerId?: mongoose.Types.ObjectId;
  buyerName: string;
  buyerPhone: string;
  pickupLocation: string;
  deliveryLocation: string;
  vehicleType: string;
  estimatedCost: number;
  status: 'BOOKED' | 'PICKED_UP' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED';
  tracking: {
    lat: number;
    lng: number;
    lastUpdated: string;
    routePoints: { lat: number; lng: number }[];
  };
  pickupDate: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  receivedQty?: number;
  receivedGrade?: string;
  qualityDiscrepancy?: boolean;
}

const BookingSchema = new Schema<IBooking>(
  {
    lotId: { type: Schema.Types.ObjectId, ref: 'Lot' },
    crop: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User' },
    farmerName: { type: String, default: '' },
    farmerPhone: { type: String, default: '' },
    buyerId: { type: Schema.Types.ObjectId, ref: 'User' },
    buyerName: { type: String, default: '' },
    buyerPhone: { type: String, default: '' },
    pickupLocation: { type: String, required: true },
    deliveryLocation: { type: String, required: true },
    vehicleType: { type: String, default: 'Tata 407 (2.5T)' },
    estimatedCost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['BOOKED', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED', 'DELIVERED'],
      default: 'BOOKED',
    },
    tracking: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.209 },
      lastUpdated: { type: String, default: () => new Date().toISOString() },
      routePoints: [
        {
          lat: { type: Number },
          lng: { type: Number },
        },
      ],
    },
    pickupDate: { type: String, default: () => new Date().toISOString() },
    estimatedDeliveryDate: { type: String, default: '' },
    actualDeliveryDate: { type: String },
    receivedQty: { type: Number },
    receivedGrade: { type: String },
    qualityDiscrepancy: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);

// Payment
export interface IPayment extends Document {
  bookingId?: mongoose.Types.ObjectId;
  lotId?: mongoose.Types.ObjectId;
  payerId: mongoose.Types.ObjectId;
  payeeId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'PENDING' | 'ESCROW' | 'RELEASED' | 'REFUNDED' | 'FAILED';
  gatewayTransactionId: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    lotId: { type: Schema.Types.ObjectId, ref: 'Lot' },
    payerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    payeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['PENDING', 'ESCROW', 'RELEASED', 'REFUNDED', 'FAILED'],
      default: 'PENDING',
    },
    gatewayTransactionId: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);

// Transaction / Timeline Event
export interface ITransactionEvent extends Document {
  lotId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  eventType: string;
  title: string;
  description: string;
  performedBy: string;
  role: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const TransactionEventSchema = new Schema<ITransactionEvent>(
  {
    lotId: { type: Schema.Types.ObjectId, ref: 'Lot' },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    eventType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    performedBy: { type: String, default: 'System' },
    role: { type: String, default: 'system' },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const TransactionEvent = mongoose.model<ITransactionEvent>('TransactionEvent', TransactionEventSchema);

// Grievance
export interface IGrievance extends Document {
  lotId?: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  raisedBy: mongoose.Types.ObjectId;
  raisedByName: string;
  raisedByRole: string;
  againstUser?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: 'quality_mismatch' | 'quantity_shortage' | 'payment_delay' | 'delivery_delay' | 'other';
  consistencyCheck: {
    expectedQty?: number;
    receivedQty?: number;
    expectedGrade?: string;
    receivedGrade?: string;
    hasDiscrepancy: boolean;
    recommendation: string;
  };
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GrievanceSchema = new Schema<IGrievance>(
  {
    lotId: { type: Schema.Types.ObjectId, ref: 'Lot' },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    raisedByName: { type: String, default: '' },
    raisedByRole: { type: String, default: '' },
    againstUser: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['quality_mismatch', 'quantity_shortage', 'payment_delay', 'delivery_delay', 'other'],
      default: 'quality_mismatch',
    },
    consistencyCheck: {
      expectedQty: { type: Number },
      receivedQty: { type: Number },
      expectedGrade: { type: String },
      receivedGrade: { type: String },
      hasDiscrepancy: { type: Boolean, default: false },
      recommendation: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED'],
      default: 'OPEN',
    },
    resolutionNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Grievance = mongoose.model<IGrievance>('Grievance', GrievanceSchema);
