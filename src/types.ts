export type Role = 'admin' | 'moderator' | 'user';

export interface User {
  id: string;
  email: string;
  password?: string; // Optional for safety, but used in mock
  name: string;
  role: Role;
  isBlocked: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  stock: number;
  description: string;
  image: string;
  status: 'Active' | 'Draft' | 'Out of Stock';
  specifications: Record<string, string>;
  rating: number;
  reviews: Review[];
  model?: string;
  hsn?: string;
  gst?: number;
  warranty?: number; // months
  origin?: string;
}

export interface RFQ {
  id: string;
  client: string;
  contact: string;
  products: string;
  qty: number;
  delivery: string;
  priority: 'Normal' | 'High' | 'Urgent';
  status: 'Pending' | 'Quoted' | 'Won' | 'Lost';
  date: string;
  notes: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  serial: string;
  location: string;
  status: 'Online' | 'Offline' | 'Warning' | 'Maintenance';
  lastMaint: string;
}

export interface Warranty {
  id: string;
  product: string;
  serial: string;
  customer: string;
  start: string;
  end: string;
  duration: number; // months
}

export interface Ticket {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  equip: string;
  assign: string;
  desc: string;
  status: 'Open' | 'In Progress' | 'Closed';
  date: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  phone: string;
  lead: number;
  terms: string;
  rating: number;
  status: 'Active' | 'Inactive';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: (CartItem & { price: number; name: string; image: string })[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface Coupon {
  code: string;
  discount: number; // percentage or flat
  type: 'percentage' | 'flat';
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  date: string;
  type: 'order' | 'system' | 'inventory';
}
