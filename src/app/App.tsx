import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'sonner';
import ChatbotDrawer from './components/shared/ChatbotDrawer';

// Landing & Auth
import LandingPage from './pages/LandingPage';
import SignIn from './pages/auth/SignIn/SignIn';
import CustomerSignUp from './pages/auth/SignUp/Customer/CustomerSignUp';
import ProviderSignUp from './pages/auth/SignUp/Provider/ProviderSignUp';
import OTPVerification from './pages/auth/OTPVerification/OTPVerification';
import PendingApproval from './pages/auth/SignUp/Provider/PendingApproval';
import ForgotPassword from './pages/auth/ForgotPassword';
import ChangePassword from './pages/auth/ChangePassword';

// Customer Pages
import CustomerHome from './pages/customer/CustomerHome';
import ServicesPage from './pages/customer/Services/ServicesPage';
import MyRequestsPage from './pages/customer/Requests/MyRequestsPage';
import CustomerAbout from './pages/customer/CustomerAbout';
import CustomerProfile from './pages/customer/Profile/CustomerProfile';

// Provider Pages
import ProviderHome from './pages/provider/ProviderHome';
import ProviderRequests from './pages/provider/ProviderRequests';
import MyCalendar from './pages/provider/MyCalendar';
import Billing from './pages/provider/Billing';
import Checkout from './pages/provider/Checkout';
import ProviderAbout from './pages/provider/ProviderAbout';
import ProviderProfile from './pages/provider/ProviderProfile';

// Admin Pages
import AdminLogin from './pages/admin/Login/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCustomers from './pages/admin/ManageCustomers/ManageCustomers';
import ManageProviders from './pages/admin/ManageProviders/ManageProviders';
import ProviderApproval from './pages/admin/ProviderApproval/ProviderApproval';
import ManageRequests from './pages/admin/ManageRequests';
import ManageAdmins from './pages/admin/ManageAdmins/ManageAdmins';
import Settings from './pages/admin/Settings';

// Shared Pages
import CustomerRequestDetails from './pages/shared/CustomerRequestDetails';
import ProviderRequestDetails from './pages/shared/ProviderRequestDetails';
import AdminRequestDetails from './pages/shared/AdminRequestDetails';
import CustomerPublicProfile from './pages/shared/CustomerPublicProfile';
import ProviderPublicProfile from './pages/shared/ProviderPublicProfile';
import CompleteService from './pages/shared/CompleteService';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup/customer" element={<CustomerSignUp />} />
        <Route path="/signup/provider" element={<ProviderSignUp />} />
        <Route path="/verify-otp" element={<OTPVerification />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Customer Routes */}
        <Route path="/customer/home" element={<CustomerHome />} />
        <Route path="/customer/services" element={<ServicesPage />} />
        <Route path="/customer/requests" element={<MyRequestsPage />} />
        <Route path="/customer/requests/:id" element={<CustomerRequestDetails />} />
        <Route path="/customer/about" element={<CustomerAbout />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />

        {/* Provider Routes */}
        <Route path="/provider/home" element={<ProviderHome />} />
        <Route path="/provider/requests" element={<ProviderRequests />} />
        <Route path="/provider/requests/:id" element={<ProviderRequestDetails />} />
        <Route path="/provider/calendar" element={<MyCalendar />} />
        <Route path="/provider/billing" element={<Billing />} />
        <Route path="/provider/checkout" element={<Checkout />} />
        <Route path="/provider/about" element={<ProviderAbout />} />
        <Route path="/provider/profile" element={<ProviderProfile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<ManageCustomers />} />
        <Route path="/admin/providers" element={<ManageProviders />} />
        <Route path="/admin/provider-approval" element={<ProviderApproval />} />
        <Route path="/admin/requests" element={<ManageRequests />} />
        <Route path="/admin/requests/:id" element={<AdminRequestDetails />} />
        <Route path="/admin/admins" element={<ManageAdmins />} />
        <Route path="/admin/settings" element={<Settings />} />

        {/* Public Profiles */}
        <Route path="/profile/customer/:id" element={<CustomerPublicProfile />} />
        <Route path="/profile/provider/:id" element={<ProviderPublicProfile />} />

        {/* Shared Actions */}
        <Route path="/complete-service" element={<CompleteService />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatbotDrawer />
    </BrowserRouter>
  );
}

export default App;
