import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';

// Layouts
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const UserLayout = lazy(() => import('./layouts/UserLayout'));

// Pages
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductManager = lazy(() => import('./pages/admin/ProductManager'));
const OrderManager = lazy(() => import('./pages/admin/OrderManager'));
const UserManager = lazy(() => import('./pages/admin/UserManager'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'));
const SiteSettings = lazy(() => import('./pages/admin/SiteSettings'));
const RFQManager = lazy(() => import('./pages/admin/RFQManager'));
const EquipmentMonitor = lazy(() => import('./pages/admin/EquipmentMonitor'));
const WarrantyTracker = lazy(() => import('./pages/admin/WarrantyTracker'));
const ServiceTickets = lazy(() => import('./pages/admin/ServiceTickets'));
const SupplierManager = lazy(() => import('./pages/admin/SupplierManager'));

const ProductList = lazy(() => import('./pages/user/ProductList'));
const UserHome = lazy(() => import('./pages/user/Home'));
const ProductDetail = lazy(() => import('./pages/user/ProductDetail'));
const Cart = lazy(() => import('./pages/user/Cart'));
const Checkout = lazy(() => import('./pages/user/Checkout'));
const MyOrders = lazy(() => import('./pages/user/MyOrders'));
const Wishlist = lazy(() => import('./pages/user/Wishlist'));
const Profile = lazy(() => import('./pages/user/Profile'));

import Preloader from './components/Preloader';
import FloatingButtons from './components/FloatingButtons';

const LoadingFallback = () => (
  <div className="h-screen flex items-center justify-center bg-dark-bg text-primary">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-accent rounded-full animate-spin" />
  </div>
);

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'admin' | 'user' }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingFallback />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Preloader />
        <FloatingButtons />
        <Router>
          <Toaster position="top-right" />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="orders" element={<OrderManager />} />
                <Route path="users" element={<UserManager />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="settings" element={<SiteSettings />} />
                <Route path="rfq" element={<RFQManager />} />
                <Route path="equipment" element={<EquipmentMonitor />} />
                <Route path="warranty" element={<WarrantyTracker />} />
                <Route path="service" element={<ServiceTickets />} />
                <Route path="suppliers" element={<SupplierManager />} />
              </Route>

              {/* User Routes */}
              <Route path="/" element={<UserLayout />}>
                <Route index element={<UserHome />} />
                <Route path="products" element={<ProductList />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </StoreProvider>
    </AuthProvider>
  );
}
