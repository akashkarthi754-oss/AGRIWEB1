import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Language,
  FarmerListing,
  MarketplaceProduct,
  BuyerOrder,
  TransportAgency,
  TransportTrip,
  AppNotification,
  OrderStatus,
  TransportStatus,
  ListingStatus,
} from '../types';
import {
  initialFarmerListings,
  initialMarketplaceProducts,
  initialTransportAgencies,
  initialBuyerOrders,
  initialTransportTrips,
  initialNotifications,
} from '../data/mockData';
import { translations, Translations } from '../translations';
import { api, setAuthToken } from '../services/api';

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activePage: string;
  setActivePage: (page: string) => void;

  // Farmer listings
  farmerListings: FarmerListing[];
  addFarmerListing: (data: Omit<FarmerListing, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => void;
  reviewFarmerListing: (id: string, status: ListingStatus, procurementPrice?: number, rejectionReason?: string) => void;

  // Marketplace Products
  marketplaceProducts: MarketplaceProduct[];
  updateProductSellingPrice: (id: string, price: number) => void;

  // Orders
  buyerOrders: BuyerOrder[];
  createBuyerOrder: (orderData: Omit<BuyerOrder, 'id' | 'createdAt' | 'orderStatus'>) => BuyerOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignTransportToOrder: (orderId: string, agencyId: string) => void;

  // Transport
  transportAgencies: TransportAgency[];
  transportTrips: TransportTrip[];
  acceptTrip: (tripId: string) => void;
  updateTripStatus: (tripId: string, status: TransportStatus) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: MarketplaceProduct, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: {
    produceCost: number;
    transportCost: number;
    handlingCost: number;
    totalAmount: number;
    totalKg: number;
  };

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;

  // UI state modals
  isSellModalOpen: boolean;
  setIsSellModalOpen: (open: boolean) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  selectedProductForDetails: MarketplaceProduct | null;
  setSelectedProductForDetails: (product: MarketplaceProduct | null) => void;
  selectedTrackingOrderId: string;
  setSelectedTrackingOrderId: (id: string) => void;
  openCheckoutWithItem?: MarketplaceProduct | null;
  setOpenCheckoutWithItem: (prod: MarketplaceProduct | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('agri_lang') as Language) || 'en';
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [activePage, setActivePage] = useState<string>('home');

  // Persistence helpers
  const [farmerListings, setFarmerListings] = useState<FarmerListing[]>(() => {
    const saved = localStorage.getItem('agri_farmer_listings');
    return saved ? JSON.parse(saved) : initialFarmerListings;
  });

  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>(() => {
    const saved = localStorage.getItem('agri_products');
    return saved ? JSON.parse(saved) : initialMarketplaceProducts;
  });

  const [buyerOrders, setBuyerOrders] = useState<BuyerOrder[]>(() => {
    const saved = localStorage.getItem('agri_orders');
    return saved ? JSON.parse(saved) : initialBuyerOrders;
  });

  const [transportAgencies, setTransportAgencies] = useState<TransportAgency[]>(() => {
    const saved = localStorage.getItem('agri_agencies');
    return saved ? JSON.parse(saved) : initialTransportAgencies;
  });

  const [transportTrips, setTransportTrips] = useState<TransportTrip[]>(() => {
    const saved = localStorage.getItem('agri_trips');
    return saved ? JSON.parse(saved) : initialTransportTrips;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('agri_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('agri_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // UI Modals
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = useState<MarketplaceProduct | null>(null);
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string>('ORD-8492');
  const [openCheckoutWithItem, setOpenCheckoutWithItem] = useState<MarketplaceProduct | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('agri_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('agri_farmer_listings', JSON.stringify(farmerListings));
  }, [farmerListings]);

  useEffect(() => {
    localStorage.setItem('agri_products', JSON.stringify(marketplaceProducts));
  }, [marketplaceProducts]);

  useEffect(() => {
    localStorage.setItem('agri_orders', JSON.stringify(buyerOrders));
  }, [buyerOrders]);

  useEffect(() => {
    localStorage.setItem('agri_agencies', JSON.stringify(transportAgencies));
  }, [transportAgencies]);

  useEffect(() => {
    localStorage.setItem('agri_trips', JSON.stringify(transportTrips));
  }, [transportTrips]);

  useEffect(() => {
    localStorage.setItem('agri_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('agri_cart', JSON.stringify(cart));
  }, [cart]);

  // Synchronize authentication token with active simulation role
  useEffect(() => {
    const roleCredentials: Record<string, { email: string; pass: string }> = {
      farmer: { email: 'farmer@agrimarket.in', pass: 'farmer123' },
      buyer: { email: 'buyer@agrimarket.in', pass: 'buyer123' },
      procurement: { email: 'admin@agrimarket.in', pass: 'admin123' },
      transport: { email: 'transport@agrimarket.in', pass: 'transport123' },
    };

    const creds = roleCredentials[currentRole];
    if (creds) {
      api.auth
        .login(creds.email, creds.pass)
        .then((res) => {
          if (res?.data?.token) {
            setAuthToken(res.data.token);
          }
        })
        .catch(() => {
          // Fallback gracefully in case server is loading
        });
    } else {
      setAuthToken(null);
    }
  }, [currentRole]);

  // Sync initial produce catalog with backend
  useEffect(() => {
    api.marketplace
      .getAll()
      .then((res) => {
        if (res?.data?.items?.length) {
          setMarketplaceProducts((prev) => {
            const backendItems: MarketplaceProduct[] = res.data.items.map((item: any) => ({
              id: item.vegetableId || item.id,
              name: item.name,
              tamilName: item.name,
              category: item.category || 'Vegetables',
              qualityGrade: item.qualityGrade || 'Grade A',
              availableQuantity: item.availableQuantity || 500,
              unit: item.unit || 'kg',
              procurementPrice: Math.round((item.pricePerKg || 40) * 0.75),
              pricePerKg: item.pricePerKg || 40,
              imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800',
              sourceRegion: item.sourceRegion || 'Tamil Nadu Verified Farms',
              harvestDate: 'Fresh Today',
              minOrderQuantity: item.minOrderQuantity || 20,
              description: item.description || 'Quality inspected farm produce directly procured from verified farmers.',
              freshnessGuarantee: 'Quality Certified & Inspected',
              featured: true,
            }));

            // Merge with existing items
            const existingIds = new Set(backendItems.map((b) => b.id));
            const remaining = prev.filter((p) => !existingIds.has(p.id));
            return [...backendItems, ...remaining];
          });
        }
      })
      .catch(() => {
        // Safe offline fallback
      });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (lang === 'ta') {
      document.body.classList.add('font-tamil');
    } else {
      document.body.classList.remove('font-tamil');
    }
  };

  const t = translations[language];

  // Farmer listing operations
  const addFarmerListing = (data: Omit<FarmerListing, 'id' | 'createdAt' | 'status' | 'paymentStatus'>) => {
    const newListing: FarmerListing = {
      ...data,
      id: `LST-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'pending',
    };
    setFarmerListings((prev) => [newListing, ...prev]);

    // Add alert notification for Procurement Team
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Crop Listing Received',
      titleTa: 'புதிய காய்கறி விற்பனை கோரிக்கை வந்துள்ளது',
      message: `${newListing.farmerName} listed ${newListing.quantity} ${newListing.unit} of ${newListing.vegetableName} at ₹${newListing.expectedPrice}/${newListing.unit}.`,
      messageTa: `${newListing.farmerName} ${newListing.quantity} ${newListing.unit} ${newListing.vegetableName} ரூ.${newListing.expectedPrice} விலையில் விக்கப் பதிவு செய்துள்ளார்.`,
      targetRole: 'procurement',
      type: 'procurement',
      timestamp: 'Just now',
      read: false,
      relatedId: newListing.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const reviewFarmerListing = (
    id: string,
    status: ListingStatus,
    procurementPrice?: number,
    rejectionReason?: string
  ) => {
    setFarmerListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const finalProcurementPrice = procurementPrice || item.expectedPrice;
          const updated: FarmerListing = {
            ...item,
            status,
            procurementPrice: finalProcurementPrice,
            paymentAmount: finalProcurementPrice * item.quantity,
            rejectionReason,
            paymentStatus: status === 'completed' || status === 'purchased' ? 'paid' : item.paymentStatus,
          };

          // If approved/purchased, inject or update in marketplace inventory
          if (status === 'approved' || status === 'purchased') {
            const markupPerKg = Math.round(finalProcurementPrice * 1.35); // 35% margin for handling + transport + profit
            setMarketplaceProducts((prodList) => {
              const existingIdx = prodList.findIndex((p) => p.name.includes(item.vegetableName.split(' ')[0]));
              if (existingIdx >= 0) {
                const updatedList = [...prodList];
                updatedList[existingIdx] = {
                  ...updatedList[existingIdx],
                  availableQuantity: updatedList[existingIdx].availableQuantity + item.quantity,
                  procurementPrice: finalProcurementPrice,
                  pricePerKg: Math.max(updatedList[existingIdx].pricePerKg, markupPerKg),
                };
                return updatedList;
              } else {
                const newMarketProduct: MarketplaceProduct = {
                  id: `PRD-${Date.now().toString().slice(-4)}`,
                  name: item.vegetableName,
                  tamilName: item.vegetableName,
                  category: item.vegetableCategory || 'Vegetables',
                  qualityGrade: item.qualityGrade,
                  availableQuantity: item.quantity,
                  unit: item.unit,
                  procurementPrice: finalProcurementPrice,
                  pricePerKg: markupPerKg,
                  imageUrl: item.imageUrl,
                  sourceRegion: item.location,
                  harvestDate: item.harvestDate,
                  minOrderQuantity: Math.min(20, Math.round(item.quantity * 0.1)),
                  description: item.notes || `Freshly procured ${item.vegetableName} from ${item.farmName}. Quality graded.`,
                  freshnessGuarantee: 'Farm Gate Inspected & Protected',
                  featured: true,
                };
                return [newMarketProduct, ...prodList];
              }
            });
          }

          return updated;
        }
        return item;
      })
    );

    // Notify farmer
    const listing = farmerListings.find((l) => l.id === id);
    if (listing) {
      const isApproved = status === 'approved' || status === 'purchased';
      const notif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        title: isApproved ? 'Selling Request Accepted!' : 'Selling Request Update',
        titleTa: isApproved ? 'உங்கள் பயிர் விற்பனை ஏற்கப்பட்டது!' : 'விற்பனை கோரிக்கை விவரம்',
        message: isApproved
          ? `AgriMarket Procurement approved your ${listing.vegetableName} at ₹${procurementPrice || listing.expectedPrice}/kg. Pickup scheduled.`
          : `Your offer for ${listing.vegetableName} was declined: ${rejectionReason || 'Quality parameters mismatch'}.`,
        messageTa: isApproved
          ? `உங்கள் ${listing.vegetableName} கொள்முதல் விலை ரூ.${procurementPrice || listing.expectedPrice}/கிலோ என உறுதி செய்யப்பட்டது.`
          : `காரணம்: ${rejectionReason || 'தரக் குறியீடு பொருந்தவில்லை'}.`,
        targetRole: 'farmer',
        type: 'procurement',
        timestamp: 'Just now',
        read: false,
        relatedId: id,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const updateProductSellingPrice = (id: string, price: number) => {
    setMarketplaceProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, pricePerKg: price } : item))
    );
  };

  // Buyer orders & tracking
  const createBuyerOrder = (
    orderData: Omit<BuyerOrder, 'id' | 'createdAt' | 'orderStatus'>
  ): BuyerOrder => {
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: BuyerOrder = {
      ...orderData,
      id: newOrderId,
      createdAt: new Date().toISOString(),
      orderStatus: 'confirmed',
    };

    setBuyerOrders((prev) => [newOrder, ...prev]);

    // Deduct stock from marketplace products
    orderData.items.forEach((item) => {
      setMarketplaceProducts((prodList) =>
        prodList.map((p) => {
          if (p.id === item.productId) {
            return {
              ...p,
              availableQuantity: Math.max(0, p.availableQuantity - item.quantity),
            };
          }
          return p;
        })
      );
    });

    // Automatically create a transport dispatch trip ready for assignment
    const autoAgency = transportAgencies.find((a) => a.isAvailable) || transportAgencies[0];
    const newTrip: TransportTrip = {
      id: `TRP-${Math.floor(100 + Math.random() * 900)}`,
      orderId: newOrderId,
      buyerName: newOrder.buyerName,
      vegetableSummary: newOrder.items.map((i) => `${i.quantity}kg ${i.productName.split('(')[0]}`).join(', '),
      quantityKg: newOrder.items.reduce((acc, curr) => acc + curr.quantity, 0),
      pickupLocation: newOrder.pickupLocation,
      destination: `${newOrder.deliveryAddress}, ${newOrder.deliveryCity}`,
      distanceKm: newOrder.distanceKm || 180,
      agencyId: autoAgency.id,
      agencyName: autoAgency.name,
      vehicleType: autoAgency.vehicleType,
      driverName: autoAgency.driverName,
      driverContact: autoAgency.contact,
      estimatedCost: newOrder.transportCost,
      estimatedHours: Math.max(2, Math.round(newOrder.distanceKm / 45)),
      status: 'transport_requested',
      updatedAt: new Date().toISOString(),
    };
    setTransportTrips((prev) => [newTrip, ...prev]);

    // Send notifications
    const buyerNotif: AppNotification = {
      id: `NOTIF-${Date.now()}-1`,
      title: `Order ${newOrderId} Confirmed`,
      titleTa: `ஆர்டர் ${newOrderId} உறுதிசெய்யப்பட்டது`,
      message: `Your vegetable order of ₹${newOrder.totalAmount} has been confirmed. Sourcing and transport dispatch initiated.`,
      messageTa: `ரூ.${newOrder.totalAmount} மதிப்புள்ள காய்கறி ஆர்டர் உறுதிசெய்யப்பட்டது. வாகனம் ஒதுக்கப்படுகிறது.`,
      targetRole: 'buyer',
      type: 'order',
      timestamp: 'Just now',
      read: false,
      relatedId: newOrderId,
    };

    const adminNotif: AppNotification = {
      id: `NOTIF-${Date.now()}-2`,
      title: `New Buyer Order: ${newOrderId}`,
      titleTa: `புதிய வாங்குபவர் ஆர்டர்: ${newOrderId}`,
      message: `${newOrder.buyerName} placed an order for ₹${newOrder.totalAmount}. Destination: ${newOrder.deliveryCity}.`,
      messageTa: `${newOrder.buyerName} அவர்கள் ரூ.${newOrder.totalAmount} ஆர்டர் செய்துள்ளனர். நகரம்: ${newOrder.deliveryCity}.`,
      targetRole: 'procurement',
      type: 'order',
      timestamp: 'Just now',
      read: false,
      relatedId: newOrderId,
    };

    setNotifications((prev) => [buyerNotif, adminNotif, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setBuyerOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return { ...ord, orderStatus: status };
        }
        return ord;
      })
    );

    // Keep transport trip status in sync if present
    setTransportTrips((prev) =>
      prev.map((trip) => {
        if (trip.orderId === orderId) {
          let tripStatus: TransportStatus = trip.status;
          if (status === 'pickup_scheduled') tripStatus = 'pickup_scheduled';
          if (status === 'vegetables_collected') tripStatus = 'picked_up';
          if (status === 'in_transit') tripStatus = 'in_transit';
          if (status === 'delivered') tripStatus = 'delivered';
          return { ...trip, status: tripStatus, updatedAt: new Date().toISOString() };
        }
        return trip;
      })
    );

    const notif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Order ${orderId} Status: ${status.replace('_', ' ').toUpperCase()}`,
      titleTa: `ஆர்டர் ${orderId} நிலை மாறியுள்ளது`,
      message: `Shipment stage updated to ${status.replace('_', ' ')}.`,
      messageTa: `உங்கள் சரக்கு அடுத்த நிலைக்கு நகர்ந்துள்ளது: ${status}.`,
      targetRole: 'buyer',
      type: 'order',
      timestamp: 'Just now',
      read: false,
      relatedId: orderId,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const assignTransportToOrder = (orderId: string, agencyId: string) => {
    const agency = transportAgencies.find((a) => a.id === agencyId);
    if (!agency) return;

    setBuyerOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            assignedTransportAgencyId: agency.id,
            assignedAgencyName: agency.name,
            driverName: agency.driverName,
            driverContact: agency.contact,
            vehicleNumber: agency.vehicleNumber,
            orderStatus: ord.orderStatus === 'confirmed' ? 'pickup_scheduled' : ord.orderStatus,
          };
        }
        return ord;
      })
    );

    setTransportTrips((prev) =>
      prev.map((trip) => {
        if (trip.orderId === orderId) {
          return {
            ...trip,
            agencyId: agency.id,
            agencyName: agency.name,
            vehicleType: agency.vehicleType,
            driverName: agency.driverName,
            driverContact: agency.contact,
            status: 'agency_assigned',
            updatedAt: new Date().toISOString(),
          };
        }
        return trip;
      })
    );

    const notif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: `Transport Fleet Assigned: ${agency.name}`,
      titleTa: `போக்குவரத்து வாகனம் ஒதுக்கப்பட்டது: ${agency.name}`,
      message: `Driver ${agency.driverName} (${agency.vehicleNumber}) has been assigned to transport your produce.`,
      messageTa: `ஓட்டுநர் ${agency.driverName} (${agency.vehicleNumber}) உங்கள் பயிர்களை ஏற்றிச்செல்ல ஒதுக்கப்பட்டுள்ளார்.`,
      targetRole: 'all',
      type: 'transport',
      timestamp: 'Just now',
      read: false,
      relatedId: orderId,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const acceptTrip = (tripId: string) => {
    setTransportTrips((prev) =>
      prev.map((trip) => {
        if (trip.id === tripId) {
          return { ...trip, status: 'pickup_scheduled', updatedAt: new Date().toISOString() };
        }
        return trip;
      })
    );
  };

  const updateTripStatus = (tripId: string, status: TransportStatus) => {
    setTransportTrips((prev) =>
      prev.map((trip) => {
        if (trip.id === tripId) {
          // Sync associated order status
          if (trip.orderId) {
            let orderSt: OrderStatus = 'in_transit';
            if (status === 'pickup_scheduled') orderSt = 'pickup_scheduled';
            if (status === 'picked_up') orderSt = 'vegetables_collected';
            if (status === 'in_transit') orderSt = 'in_transit';
            if (status === 'delivered') orderSt = 'delivered';

            setBuyerOrders((orders) =>
              orders.map((o) => (o.id === trip.orderId ? { ...o, orderStatus: orderSt } : o))
            );
          }
          return { ...trip, status, updatedAt: new Date().toISOString() };
        }
        return trip;
      })
    );
  };

  // Cart operations
  const addToCart = (product: MarketplaceProduct, quantity: number) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (acc, curr) => {
      const itemProduceCost = curr.product.pricePerKg * curr.quantity;
      // Realistic logistics formula: ₹4/kg for transport + ₹1.5/kg handling
      const itemTransport = Math.round(curr.quantity * 4);
      const itemHandling = Math.round(curr.quantity * 1.5);
      return {
        produceCost: acc.produceCost + itemProduceCost,
        transportCost: acc.transportCost + itemTransport,
        handlingCost: acc.handlingCost + itemHandling,
        totalAmount: acc.totalAmount + itemProduceCost + itemTransport + itemHandling,
        totalKg: acc.totalKg + curr.quantity,
      };
    },
    { produceCost: 0, transportCost: 0, handlingCost: 0, totalAmount: 0, totalKg: 0 }
  );

  // Notification actions
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(
    (n) => !n.read && (currentRole === 'guest' || n.targetRole === 'all' || n.targetRole === currentRole)
  ).length;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentRole,
        setCurrentRole,
        activePage,
        setActivePage,
        farmerListings,
        addFarmerListing,
        reviewFarmerListing,
        marketplaceProducts,
        updateProductSellingPrice,
        buyerOrders,
        createBuyerOrder,
        updateOrderStatus,
        assignTransportToOrder,
        transportAgencies,
        transportTrips,
        acceptTrip,
        updateTripStatus,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        isSellModalOpen,
        setIsSellModalOpen,
        isCartOpen,
        setIsCartOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        selectedProductForDetails,
        setSelectedProductForDetails,
        selectedTrackingOrderId,
        setSelectedTrackingOrderId,
        openCheckoutWithItem,
        setOpenCheckoutWithItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
