import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardProvider } from '@/contexts/DashboardContext';

// Pages
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import RidersPage from "./pages/RidersPage";
import DriversPage from "./pages/DriversPage";
import VehiclesPage from "./pages/VehiclesPage";
import BookingsPage from "./pages/BookingsPage";
import SupportPage from "./pages/SupportPage";
import TransactionsPage from "./pages/TransactionsPage";
import SettingsPage from "./pages/SettingsPage";
import VerificationPage from "./pages/VerificationPage";
import BroadcastPage from "./pages/BroadcastPage";
import NotFoundPage from "./pages/NotFoundPage";
import KYCVerifiction from "./pages/KYCVerification";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/dashboard" element={
            <DashboardProvider>
              <DashboardPage />
            </DashboardProvider>
          } />
          <Route path="/riders" element={
            <DashboardProvider>
              <RidersPage />
            </DashboardProvider>
          } />
          <Route path="/drivers" element={
            <DashboardProvider>
              <DriversPage />
            </DashboardProvider>
          } />
          <Route path="/vehicles" element={
            <DashboardProvider>
              <VehiclesPage />
            </DashboardProvider>
          } />
          <Route path="/bookings" element={
            <DashboardProvider>
              <BookingsPage />
            </DashboardProvider>
          } />
          <Route path="/support" element={
            <DashboardProvider>
              <SupportPage />
            </DashboardProvider>
          } />
          <Route path="/transactions" element={
            <DashboardProvider>
              <TransactionsPage />
            </DashboardProvider>
          } />
          <Route path="/settings" element={
            <DashboardProvider>
              <SettingsPage />
            </DashboardProvider>
          } />
          <Route path="/verification" element={
            <DashboardProvider>
              <VerificationPage />
            </DashboardProvider>
          } />

          <Route path="/kyc" element={
            <DashboardProvider>
              <KYCVerifiction />
            </DashboardProvider>
          } />


          <Route path="/broadcast" element={
            <DashboardProvider>
              <BroadcastPage />
            </DashboardProvider>
          } />
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
