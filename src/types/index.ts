export type UserRole = 'farmer' | 'buyer' | 'procurement' | 'transport' | 'guest';

export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C';

export type ListingStatus = 'pending' | 'approved' | 'purchased' | 'collected' | 'completed' | 'rejected';

export type PaymentStatus = 'pending' | 'processing' | 'paid';

export type OrderStatus =
  | 'confirmed'
  | 'procurement_completed'
  | 'pickup_scheduled'
  | 'vegetables_collected'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

export type TransportStatus =
  | 'transport_requested'
  | 'agency_assigned'
  | 'pickup_scheduled'
  | 'picked_up'
  | 'in_transit'
  | 'delivered';

export type UnitType = 'kg' | 'ton' | 'box' | 'quintal';

export interface FarmerListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  contact: string;
  vegetableName: string;
  vegetableCategory: string;
  quantity: number;
  unit: UnitType;
  expectedPrice: number; // ₹ per unit
  procurementPrice?: number; // ₹ price agreed by our team
  qualityGrade: QualityGrade;
  harvestDate: string;
  location: string;
  state: string;
  imageUrl: string;
  notes?: string;
  status: ListingStatus;
  paymentStatus: PaymentStatus;
  paymentAmount?: number;
  createdAt: string;
  rejectionReason?: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  tamilName?: string;
  category: string;
  qualityGrade: QualityGrade;
  availableQuantity: number;
  unit: UnitType;
  procurementPrice: number; // cost to us per kg
  pricePerKg: number; // selling price to buyer
  imageUrl: string;
  sourceRegion: string;
  harvestDate: string;
  minOrderQuantity: number;
  description: string;
  freshnessGuarantee: string;
  featured?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  qualityGrade: QualityGrade;
  quantity: number;
  pricePerKg: number;
  subtotal: number;
  imageUrl: string;
}

export interface BuyerOrder {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerContact: string;
  deliveryAddress: string;
  deliveryCity: string;
  items: OrderItem[];
  vegetableCost: number;
  transportCost: number;
  handlingCost: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'COD' | 'NetBanking';
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  pickupLocation: string;
  destination: string;
  distanceKm: number;
  assignedTransportAgencyId?: string;
  assignedAgencyName?: string;
  driverName?: string;
  driverContact?: string;
  vehicleNumber?: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  notes?: string;
}

export interface TransportAgency {
  id: string;
  name: string;
  vehicleType: string;
  capacityKg: number;
  costPerKm: number;
  baseCharge: number;
  driverName: string;
  contact: string;
  vehicleNumber: string;
  rating: number;
  completedTrips: number;
  currentLocation: string;
  isAvailable: boolean;
  avatarUrl?: string;
}

export interface TransportTrip {
  id: string;
  orderId: string;
  buyerName: string;
  vegetableSummary: string;
  quantityKg: number;
  pickupLocation: string;
  destination: string;
  distanceKm: number;
  agencyId: string;
  agencyName: string;
  vehicleType: string;
  driverName: string;
  driverContact: string;
  estimatedCost: number;
  estimatedHours: number;
  status: TransportStatus;
  updatedAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  titleTa?: string;
  message: string;
  messageTa?: string;
  targetRole: UserRole | 'all';
  type: 'order' | 'procurement' | 'transport' | 'payment';
  timestamp: string;
  read: boolean;
  relatedId?: string;
}

export type Language = 'en' | 'ta';
