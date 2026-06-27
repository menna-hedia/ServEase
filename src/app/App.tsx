import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ChatbotDrawer from './components/shared/Chatbot/ChatbotDrawer';

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
import CustomerGuard from './pages/shared/Guard/CustomerGuard';

// Provider Pages
import ProviderHome from './pages/provider/Home/ProviderHome';
import ProviderRequests from './pages/provider/Requests/ProviderRequests';
import MyCalendar from './pages/provider/Calendar/MyCalendar';
import Billing from './pages/provider/Billing/Billing';
import PaymentSuccess from './pages/provider/Billing/PaymentSuccess';
import PaymentFailed from './pages/provider/Billing/PaymentFailed';
import Checkout from './pages/provider/Checkout';
import ProviderAbout from './pages/provider/About/ProviderAbout';
import ProviderProfile from './pages/provider/Profile/ProviderProfile';
import RequestDetails from './pages/provider/Requests/RequestDetails';
import ProviderBroadcastPage from './pages/provider/Broadcast/ProviderBroadcastPage';
import ProviderGuard from './pages/shared/Guard/ProviderGuard';

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
import AdminGuard from './pages/shared/Guard/AdminGuard';

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
        <Route path="/customer/home" element={<CustomerGuard><CustomerHome /></CustomerGuard>} />
        <Route path="/customer/services" element={<CustomerGuard><ServicesPage /></CustomerGuard>} />
        <Route path="/customer/requests" element={<CustomerGuard><MyRequestsPage /></CustomerGuard>} />
        <Route path="/customer/requests/:id" element={<CustomerGuard><CustomerRequestDetails /></CustomerGuard>} />
        <Route path="/customer/about" element={<CustomerGuard><CustomerAbout /></CustomerGuard>} />
        <Route path="/customer/profile" element={<CustomerGuard><CustomerProfile /></CustomerGuard>} />
        <Route path="/customer/broadcast/:id/offers" element={<CustomerGuard><BroadcastOffersPage /></CustomerGuard>} />

        {/* Provider Routes */}
        <Route path="/provider/home" element={<ProviderGuard><ProviderHome /></ProviderGuard>} />
        <Route path="/provider/requests" element={<ProviderGuard><ProviderRequests /></ProviderGuard>} />
        <Route path="/provider/requests/:id" element={<ProviderGuard><RequestDetails /></ProviderGuard>} />
        <Route path="/provider/calendar" element={<ProviderGuard><MyCalendar /></ProviderGuard>} />
        <Route path="/provider/billing" element={<ProviderGuard><Billing /></ProviderGuard>} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/provider/checkout" element={<ProviderGuard><Checkout /></ProviderGuard>} />
        <Route path="/provider/about" element={<ProviderGuard><ProviderAbout /></ProviderGuard>} />
        <Route path="/provider/profile" element={<ProviderGuard><ProviderProfile /></ProviderGuard>} />
        <Route path="/provider/broadcasts" element={<ProviderGuard><ProviderBroadcastPage /></ProviderGuard>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/customers" element={<AdminGuard><ManageCustomers /></AdminGuard>} />
        <Route path="/admin/providers" element={<AdminGuard><ManageProviders /></AdminGuard>} />
        <Route path="/admin/provider-approval" element={<AdminGuard><ProviderApproval /></AdminGuard>} />
        <Route path="/admin/requests" element={<AdminGuard><ManageRequests /></AdminGuard>} />
        <Route path="/admin/requests/:id" element={<AdminGuard><AdminRequestDetails /></AdminGuard>} />
        <Route path="/admin/admins" element={<AdminGuard><ManageAdmins /></AdminGuard>} />
        <Route path="/admin/settings" element={<AdminGuard><Settings /></AdminGuard>} />
        <Route path="/admin/details/:id" element={<AdminGuard><Details /></AdminGuard>} />
        <Route path="/admin/services" element={<AdminGuard><ManageServices /></AdminGuard>} />

        {/* Public Profiles */}
        <Route path="/profile/customer/:id" element={<ProviderGuard><CustomerPublicProfile /></ProviderGuard>} />
        <Route path="/profile/provider/:id" element={<CustomerGuard><ProviderPublicProfile /></CustomerGuard>} />

        {/* Shared Actions */}
        <Route path="/complete-service" element={<CompleteService />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* <ChatbotDrawer /> */}
    </BrowserRouter>
  );
}

export default App;

