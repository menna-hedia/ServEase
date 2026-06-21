import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import CustomerHome from './pages/customer/Home/CustomerHome';
import ServicesPage from './pages/customer/Services/ServicesPage';
import MyRequestsPage from './pages/customer/Requests/MyRequestsPage';
import CustomerAbout from './pages/customer/About/CustomerAbout';
import CustomerProfile from './pages/customer/Profile/CustomerProfile';
import CustomerRequestDetails from './pages/customer/Requests/RequestDetails';
import BroadcastOffersPage from './pages/customer/Broadcast/BroadcastOffersPage';

// Provider Pages
import ProviderHome from './pages/provider/ProviderHome';
import ProviderRequests from './pages/provider/Requests/ProviderRequests';
import MyCalendar from './pages/provider/Calendar/MyCalendar';
import Billing from './pages/provider/Billing';
import Checkout from './pages/provider/Checkout';
import ProviderAbout from './pages/provider/ProviderAbout';
import ProviderProfile from './pages/provider/Profile/ProviderProfile';
import ProviderGuard from './pages/shared/Guard/ProviderGuard';
import RequestDetails from './pages/provider/Requests/RequestDetails';
import ProviderBroadcastPage from './pages/provider/Broadcast/ProviderBroadcastPage';

// Admin Pages
import AdminLogin from './pages/admin/Login/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCustomers from './pages/admin/ManageCustomers/ManageCustomers';
import ManageProviders from './pages/admin/ManageProviders/ManageProviders';
import ProviderApproval from './pages/admin/ProviderApproval/ProviderApproval';
import ManageRequests from './pages/admin/ManageRequests/ManageRequests';
import ManageAdmins from './pages/admin/ManageAdmins/ManageAdmins';
import Settings from './pages/admin/Settings/Settings';
import Details from './pages/admin/Details/Details';
import AdminRequestDetails from './pages/admin/ManageRequests/AdminRequestDetails';
import ManageServices from './pages/admin/ManageServices/ManageServices';

// Shared Pages
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
        <Route path="/customer/broadcast/:id/offers" element={<BroadcastOffersPage />} />

        {/* Provider Routes */}
        <Route path="/provider/home" element={<ProviderGuard><ProviderHome /></ProviderGuard>} />
        <Route path="/provider/requests" element={<ProviderGuard><ProviderRequests /></ProviderGuard>} />
        <Route path="/provider/requests/:id" element={<ProviderGuard><RequestDetails /></ProviderGuard>} />
        <Route path="/provider/calendar" element={<ProviderGuard><MyCalendar /></ProviderGuard>} />
        <Route path="/provider/billing" element={<ProviderGuard><Billing /></ProviderGuard>} />
        <Route path="/provider/checkout" element={<ProviderGuard><Checkout /></ProviderGuard>} />
        <Route path="/provider/about" element={<ProviderGuard><ProviderAbout /></ProviderGuard>} />
        <Route path="/provider/profile" element={<ProviderGuard><ProviderProfile /></ProviderGuard>} />
        <Route path="/provider/broadcasts" element={<ProviderBroadcastPage />} />

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
        <Route path="/admin/details/:id" element={<Details />} />
        <Route path="/admin/services" element={<ManageServices />} />

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

