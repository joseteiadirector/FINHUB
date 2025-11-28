import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import TransactionsEnhanced from "./pages/TransactionsEnhanced";
import Services from "./pages/Services";
import Profile from "./pages/Profile";
import PixTransfer from "./pages/PixTransfer";
import BillPayment from "./pages/BillPayment";
import Recharge from "./pages/Recharge";
import Cashback from "./pages/Cashback";
import Insurance from "./pages/Insurance";
import Loan from "./pages/Loan";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Referrals from "./pages/Referrals";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const isDevMode = localStorage.getItem("dev_mode") === "true";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user && !isDevMode) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionsEnhanced />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pix"
              element={
                <ProtectedRoute>
                  <PixTransfer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bill-payment"
              element={
                <ProtectedRoute>
                  <BillPayment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recharge"
              element={
                <ProtectedRoute>
                  <Recharge />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cashback"
              element={
                <ProtectedRoute>
                  <Cashback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insurance"
              element={
                <ProtectedRoute>
                  <Insurance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loan"
              element={
                <ProtectedRoute>
                  <Loan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faq"
              element={
                <ProtectedRoute>
                  <FAQ />
                </ProtectedRoute>
              }
            />
            <Route
              path="/referrals"
              element={
                <ProtectedRoute>
                  <Referrals />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
