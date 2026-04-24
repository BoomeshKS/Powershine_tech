import { User, Product, Order, Coupon, Notification, RFQ, Equipment, Warranty, Ticket, Supplier } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    email: 'admin@shop.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    isBlocked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@shop.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
    isBlocked: false,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Industrial PLC Controller X100',
    sku: 'PLC-X100-PS',
    category: 'PLC',
    brand: 'Powershine',
    price: 12500,
    discountPrice: 11000,
    stock: 12,
    description: 'High-performance industrial PLC controller for factory automation systems.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    status: 'Active',
    specifications: {
      'Input Voltage': '24V DC',
      'I/O Points': '16 Inputs / 16 Outputs',
      'Communication': 'Ethernet, RS-485',
    },
    rating: 4.5,
    reviews: [],
  },
  {
    id: 'p2',
    name: 'Precision PCB Sensor S-500',
    sku: 'SNS-S500-PS',
    category: 'Sensors',
    brand: 'Powershine',
    price: 3500,
    stock: 4,
    description: 'Ultra-precise PCB-level sensor for industrial monitoring.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    status: 'Active',
    specifications: {
      'Accuracy': '±0.01mm',
      'Range': '0-500mm',
      'Interface': 'Analog 0-10V',
    },
    rating: 4.8,
    reviews: [],
  },
  {
    id: 'p3',
    name: 'Industrial VFD Drive V-200',
    sku: 'VFD-V200-PS',
    category: 'Drives',
    brand: 'Powershine',
    price: 8500,
    discountPrice: 7999,
    stock: 25,
    description: 'Variable Frequency Drive for precise motor control in industrial environments.',
    image: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&q=80&w=800',
    status: 'Active',
    specifications: {
      'Power': '5.5kW',
      'Input': '3-Phase 415V',
      'Output': '0-400Hz',
    },
    rating: 4.2,
    reviews: [],
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord1',
    userId: '2',
    items: [
      { productId: 'p1', quantity: 1, price: 11000, name: 'Industrial PLC Controller X100', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800' },
    ],
    total: 11000,
    status: 'Delivered',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    shippingAddress: '123 Factory Road, Tiruppur, Tamil Nadu',
    paymentMethod: 'Card',
  },
  {
    id: 'ord2',
    userId: '2',
    items: [
      { productId: 'p2', quantity: 2, price: 3500, name: 'Precision PCB Sensor S-500', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' },
    ],
    total: 7000,
    status: 'Processing',
    date: new Date().toISOString(),
    shippingAddress: '456 Industrial Ave, Coimbatore, Tamil Nadu',
    paymentMethod: 'UPI',
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discount: 10,
    type: 'percentage',
    expiryDate: '2026-12-31',
    usageLimit: 100,
    usedCount: 0,
  },
  {
    code: 'FLAT500',
    discount: 500,
    type: 'flat',
    expiryDate: '2026-12-31',
    usageLimit: 50,
    usedCount: 0,
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    message: 'New order received: ord2',
    isRead: false,
    date: new Date().toISOString(),
    type: 'order',
  },
  {
    id: 'n2',
    userId: '1',
    message: 'Low stock alert: Precision PCB Sensor S-500 (4 left)',
    isRead: false,
    date: new Date().toISOString(),
    type: 'inventory',
  },
];

export const INITIAL_RFQS: RFQ[] = [
  {
    id: 'RFQ-001',
    client: 'Bharath Electronics',
    contact: 'bharath@be.in',
    products: '50 pcs proximity sensors, 10 VFDs',
    qty: 60,
    delivery: '2026-05-01',
    priority: 'High',
    status: 'Pending',
    date: '2026-04-17',
    notes: 'Bulk requirement for new plant'
  },
  {
    id: 'RFQ-002',
    client: 'Sri Venkateswara Industries',
    contact: 'svi@gmail.com',
    products: 'Siemens S7-300 PLCs × 5',
    qty: 5,
    delivery: '2026-04-30',
    priority: 'Urgent',
    status: 'Quoted',
    date: '2026-04-16',
    notes: 'Replacement parts urgent'
  },
  {
    id: 'RFQ-003',
    client: 'MechTech Solutions',
    contact: 'info@mechtech.com',
    products: 'Schneider contactors 40A × 100',
    qty: 100,
    delivery: '2026-05-15',
    priority: 'Normal',
    status: 'Pending',
    date: '2026-04-15',
    notes: ''
  },
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  { id: '1', name: 'PLC Controller A', type: 'PLC', serial: 'SN-PLC-001', location: 'Unit 4, Line A', status: 'Online', lastMaint: '2026-03-10' },
  { id: '2', name: 'VFD Drive B', type: 'VFD', serial: 'SN-VFD-002', location: 'Unit 3, Pump Room', status: 'Online', lastMaint: '2026-02-20' },
  { id: '3', name: 'SMPS Unit C', type: 'SMPS', serial: 'SN-SMP-003', location: 'Control Panel 2', status: 'Warning', lastMaint: '2026-01-15' },
  { id: '4', name: 'HMI Panel D', type: 'HMI', serial: 'SN-HMI-004', location: 'Operator Desk 1', status: 'Offline', lastMaint: '2025-12-01' },
];

export const INITIAL_WARRANTIES: Warranty[] = [
  { id: '1', product: 'Siemens S7-1200', serial: 'SN-PLC-001', customer: 'Raman Industries', start: '2025-04-16', end: '2027-04-16', duration: 24 },
  { id: '2', product: 'ABB ACS550 VFD', serial: 'SN-VFD-022', customer: 'GreenPower Ltd', start: '2024-10-01', end: '2025-10-01', duration: 12 },
];

export const INITIAL_TICKETS: Ticket[] = [
  { id: 'TKT-001', title: 'PLC fault – Unit 4 line', priority: 'Critical', equip: 'PLC Controller A', assign: 'Rajan K', desc: 'PLC stopped responding, line halted', status: 'Open', date: '2026-04-17' },
  { id: 'TKT-002', title: 'VFD calibration needed', priority: 'High', equip: 'VFD Drive B', assign: '', desc: 'Speed reference off by 5Hz', status: 'Open', date: '2026-04-16' },
  { id: 'TKT-003', title: 'HMI touch not working', priority: 'Medium', equip: 'HMI Panel D', assign: 'Priya S', desc: 'Touch screen unresponsive', status: 'In Progress', date: '2026-04-15' },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Siemens India Pvt Ltd', category: 'PLC', contact: 'Mohan Raj', email: 'mohan@siemens.in', phone: '+91 98765 43210', lead: 7, terms: 'Net 30', rating: 5, status: 'Active' },
  { id: '2', name: 'ABB India Ltd', category: 'VFD', contact: 'Suresh Kumar', email: 'suresh@abb.in', phone: '+91 87654 32109', lead: 10, terms: 'Net 45', rating: 4, status: 'Active' },
];
