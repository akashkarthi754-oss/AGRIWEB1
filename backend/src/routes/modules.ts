import { Router } from 'express';
import { authRequired, roleRequired } from '../middleware/auth.js';
import {
  createLot,
  getMyLots,
  getLotById,
  updateLot,
  deleteLot,
  createRequirement,
  getMyRequirements,
  getRequirementById,
  updateRequirement,
  deleteRequirement,
  assessQuality,
  getLotQuality,
  getMarketPrices,
  getMarketTrend,
  getLotMatches,
  getNetRealisation,
  getStorageAdvice,
  getVehicleRecommendation,
  createBooking,
  getMyBookings,
  updateBookingStatus,
  getBookingTracking,
  updateBookingLocation,
  confirmDeliveryReceipt,
  initiatePayment,
  confirmPayment,
  getPaymentById,
  getLotTimeline,
  getAnalyticsSummary,
  createGrievance,
  getMyGrievances,
  getGrievanceById,
} from '../controllers/modules.js';
import {
  getMarketplaceListings,
  getMarketPricesFrontend,
  getStorageFacilitiesFrontend,
  getNotificationsFrontend,
} from '../controllers/frontendCompat.js';

export const apiRouter = Router();

// 1. Produce / Lots
apiRouter.post('/lots', authRequired, roleRequired('farmer', 'admin'), createLot);
apiRouter.get('/lots/mine', authRequired, getMyLots);
apiRouter.get('/lots/:id', getLotById);
apiRouter.put('/lots/:id', authRequired, updateLot);
apiRouter.delete('/lots/:id', authRequired, deleteLot);

// 2. Buyer Requirements
apiRouter.post('/requirements', authRequired, roleRequired('buyer', 'admin'), createRequirement);
apiRouter.get('/requirements/mine', authRequired, getMyRequirements);
apiRouter.get('/requirements/:id', getRequirementById);
apiRouter.put('/requirements/:id', authRequired, updateRequirement);
apiRouter.delete('/requirements/:id', authRequired, deleteRequirement);

// 3. Quality Assessment
apiRouter.post('/lots/:id/quality', assessQuality);
apiRouter.get('/lots/:id/quality', getLotQuality);

// 4. Market
apiRouter.get('/market/prices', (req, res, next) => {
  // If no params sent, return full frontend compatible format
  if (!req.query.crop && !req.query.district) {
    return getMarketPricesFrontend(req, res);
  }
  return getMarketPrices(req, res);
});
apiRouter.get('/market/trend', getMarketTrend);

// 5. Matching
apiRouter.get('/lots/:id/matches', getLotMatches);

// 6. Net Realisation
apiRouter.get('/lots/:id/realisation', getNetRealisation);

// 7. Storage Advice & Facilities
apiRouter.get('/lots/:id/storage-advice', getStorageAdvice);
apiRouter.get('/storage/facilities', getStorageFacilitiesFrontend);

// 8. Logistics & Bookings
apiRouter.get('/lots/:id/vehicle-recommendation', getVehicleRecommendation);
apiRouter.post('/bookings', authRequired, createBooking);
apiRouter.get('/bookings/mine', authRequired, getMyBookings);
apiRouter.put('/bookings/:id/status', authRequired, roleRequired('transporter', 'admin'), updateBookingStatus);

// 9. Tracking & Location
apiRouter.get('/bookings/:id/tracking', getBookingTracking);
apiRouter.put('/bookings/:id/location', authRequired, roleRequired('transporter', 'admin'), updateBookingLocation);

// 10. Delivery Receipt (Buyer)
apiRouter.post('/bookings/:id/confirm-receipt', authRequired, roleRequired('buyer', 'admin'), confirmDeliveryReceipt);

// 11. Payments (Sandbox)
apiRouter.post('/payments/initiate', authRequired, initiatePayment);
apiRouter.post('/payments/confirm', authRequired, confirmPayment);
apiRouter.get('/payments/:id', getPaymentById);

// 12. Timeline & Analytics
apiRouter.get('/lots/:id/timeline', getLotTimeline);
apiRouter.get('/analytics/summary', authRequired, getAnalyticsSummary);

// 13. Grievances
apiRouter.post('/grievances', authRequired, createGrievance);
apiRouter.get('/grievances/mine', authRequired, getMyGrievances);
apiRouter.get('/grievances/:id', getGrievanceById);

// Frontend compatibility endpoints
apiRouter.get('/marketplace', getMarketplaceListings);
apiRouter.get('/marketplace/:id', getLotById);
apiRouter.get('/notifications', getNotificationsFrontend);
apiRouter.put('/notifications/:id/read', (_req, res) => res.json({ success: true }));
apiRouter.put('/notifications/read-all', (_req, res) => res.json({ success: true }));
apiRouter.get('/transport/trips', authRequired, getMyBookings);
apiRouter.get('/transport/agencies', (_req, res) =>
  res.json([
    {
      id: 'ta_1',
      name: 'Kisan Gati Logistics',
      fleetSize: 45,
      rating: 4.8,
      verified: true,
      serviceAreas: ['Maharashtra', 'Madhya Pradesh', 'Gujarat'],
      contactPhone: '+91 98234 56789',
    },
  ])
);
