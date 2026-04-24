import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, CartItem, Coupon, Notification, User, RFQ, Equipment, Warranty, Ticket, Supplier } from '../types';
import { 
  INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_NOTIFICATIONS, INITIAL_USERS,
  INITIAL_RFQS, INITIAL_EQUIPMENT, INITIAL_WARRANTIES, INITIAL_TICKETS, INITIAL_SUPPLIERS
} from '../lib/mockData';
import toast from 'react-hot-toast';

interface StoreContextType {
  products: Product[];
  orders: Order[];
  users: User[];
  coupons: Coupon[];
  notifications: Notification[];
  cart: CartItem[];
  wishlist: string[];
  rfqs: RFQ[];
  equipment: Equipment[];
  warranties: Warranty[];
  tickets: Ticket[];
  suppliers: Supplier[];
  
  // Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateUserRole: (id: string, role: User['role']) => void;
  toggleUserBlock: (id: string) => void;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (order: Omit<Order, 'id' | 'date'>) => void;
  addNotification: (userId: string, message: string, type: Notification['type']) => void;
  markNotificationRead: (id: string) => void;
  addReview: (productId: string, review: { userId: string; userName: string; rating: number; comment: string }) => void;
  
  // Industrial Actions
  addRFQ: (rfq: Omit<RFQ, 'id' | 'date'>) => void;
  updateRFQStatus: (id: string, status: RFQ['status']) => void;
  deleteRFQ: (id: string) => void;
  updateEquipmentStatus: (id: string, status: Equipment['status']) => void;
  addTicket: (ticket: Omit<Ticket, 'id' | 'date'>) => void;
  updateTicketStatus: (id: string, status: Ticket['status']) => void;
  addWarranty: (warranty: Omit<Warranty, 'id'>) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [rfqs, setRFQs] = useState<RFQ[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const loadData = <T,>(key: string, initial: T): T => {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    };

    setProducts(loadData('products', INITIAL_PRODUCTS));
    setOrders(loadData('orders', INITIAL_ORDERS));
    setUsers(loadData('users', INITIAL_USERS));
    setCoupons(loadData('coupons', INITIAL_COUPONS));
    setNotifications(loadData('notifications', INITIAL_NOTIFICATIONS));
    setCart(loadData('cart', []));
    setWishlist(loadData('wishlist', []));
    setRFQs(loadData('rfqs', INITIAL_RFQS));
    setEquipment(loadData('equipment', INITIAL_EQUIPMENT));
    setWarranties(loadData('warranties', INITIAL_WARRANTIES));
    setTickets(loadData('tickets', INITIAL_TICKETS));
    setSuppliers(loadData('suppliers', INITIAL_SUPPLIERS));
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('coupons', JSON.stringify(coupons));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    localStorage.setItem('rfqs', JSON.stringify(rfqs));
    localStorage.setItem('equipment', JSON.stringify(equipment));
    localStorage.setItem('warranties', JSON.stringify(warranties));
    localStorage.setItem('tickets', JSON.stringify(tickets));
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }, [products, orders, users, coupons, notifications, cart, wishlist, rfqs, equipment, warranties, tickets, suppliers]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: 'p' + Math.random().toString(36).substr(2, 5) };
    setProducts([...products, newProduct as Product]);
    toast.success('Product added successfully');
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    const order = orders.find(o => o.id === id);
    if (order) {
      addNotification(order.userId, `Your order ${id} status has been updated to ${status}`, 'order');
    }
    toast.success('Order status updated');
  };

  const updateUserRole = (id: string, role: User['role']) => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
    toast.success('User role updated');
  };

  const toggleUserBlock = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isBlocked: !u.isBlocked } : u));
    toast.success('User status updated');
  };

  const addToCart = (productId: string, quantity: number) => {
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
      setCart(cart.map(item => item.productId === productId 
        ? { ...item, quantity: item.quantity + quantity } 
        : item));
    } else {
      setCart([...cart, { productId, quantity }]);
    }
    toast.success('Added to cart');
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
    toast.success('Removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      toast.success('Removed from wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      toast.success('Added to wishlist');
    }
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'date'>) => {
    const newOrder: Order = {
      ...orderData,
      id: 'ORD' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      date: new Date().toISOString(),
    };
    setOrders([newOrder, ...orders]);
    clearCart();
    addNotification('1', `New order received: ${newOrder.id}`, 'order');
    newOrder.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const newStock = product.stock - item.quantity;
        updateProduct(product.id, { stock: newStock });
        if (newStock < 5) {
          addNotification('1', `Low stock alert: ${product.name} (${newStock} left)`, 'inventory');
        }
      }
    });
    toast.success('Order placed successfully!');
  };

  const addNotification = (userId: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      message,
      type,
      isRead: false,
      date: new Date().toISOString(),
    };
    setNotifications([newNotif, ...notifications]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const addReview = (productId: string, reviewData: { userId: string; userName: string; rating: number; comment: string }) => {
    const newReview = {
      ...reviewData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      isApproved: true,
    };
    setProducts(products.map(p => {
      if (p.id === productId) {
        const newReviews = [...(p.reviews || []), newReview];
        const newRating = (newReviews.reduce((acc, r) => acc + r.rating, 0) / newReviews.length) || 0;
        return { ...p, reviews: newReviews, rating: newRating };
      }
      return p;
    }));
    toast.success('Review submitted successfully!');
  };

  const addRFQ = (rfqData: Omit<RFQ, 'id' | 'date'>) => {
    const newRFQ: RFQ = {
      ...rfqData,
      id: 'RFQ-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      date: new Date().toISOString().split('T')[0]
    };
    setRFQs([newRFQ, ...rfqs]);
    toast.success('RFQ submitted successfully');
  };

  const updateRFQStatus = (id: string, status: RFQ['status']) => {
    setRFQs(rfqs.map(r => r.id === id ? { ...r, status } : r));
    toast.success('RFQ status updated');
  };

  const deleteRFQ = (id: string) => {
    setRFQs(rfqs.filter(r => r.id !== id));
    toast.success('RFQ deleted');
  };

  const updateEquipmentStatus = (id: string, status: Equipment['status']) => {
    setEquipment(equipment.map(e => e.id === id ? { ...e, status } : e));
    toast.success('Equipment status updated');
  };

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'date'>) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: 'TKT-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      date: new Date().toISOString().split('T')[0]
    };
    setTickets([newTicket, ...tickets]);
    toast.success('Ticket created');
  };

  const updateTicketStatus = (id: string, status: Ticket['status']) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status } : t));
    toast.success('Ticket status updated');
  };

  const addWarranty = (warrantyData: Omit<Warranty, 'id'>) => {
    const newWarranty: Warranty = {
      ...warrantyData,
      id: Math.random().toString(36).substr(2, 5)
    };
    setWarranties([newWarranty, ...warranties]);
    toast.success('Warranty registered');
  };

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Math.random().toString(36).substr(2, 5)
    };
    setSuppliers([newSupplier, ...suppliers]);
    toast.success('Supplier added');
  };

  return (
    <StoreContext.Provider value={{
      products, orders, users, coupons, notifications, cart, wishlist,
      rfqs, equipment, warranties, tickets, suppliers,
      addProduct, updateProduct, deleteProduct, updateOrderStatus,
      updateUserRole, toggleUserBlock, addToCart, removeFromCart,
      updateCartQuantity, clearCart, toggleWishlist, placeOrder,
      addNotification, markNotificationRead, addReview,
      addRFQ, updateRFQStatus, deleteRFQ, updateEquipmentStatus,
      addTicket, updateTicketStatus, addWarranty, addSupplier
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
