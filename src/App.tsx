import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/ThemeProvider";
import Dashboard from "./pages/admin/Dashboard";
import PostsPage from "./pages/admin/Posts";
import OffersPageAdmin from "./pages/admin/Offers";
import CategoriesPage from "./pages/admin/Categories";
import BannersPage from "./pages/admin/Banners";
import AccessoriesPage from "./pages/admin/Accessories";
import ReviewPage from "./pages/Review";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import { SessionProvider } from "./contexts/SessionContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import CategoryPage from "./pages/Category";
import OffersPage from "./pages/Offers";
import ComparisonsPage from "./pages/Comparisons";
import AboutPage from "./pages/About";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/update-password');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/review/:id" element={<ReviewPage />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/offers" element={<OffersPage />} />
      <Route path="/comparisons" element={<ComparisonsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/posts" 
        element={
          <ProtectedRoute>
            <PostsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/accessories" 
        element={
          <ProtectedRoute>
            <AccessoriesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/offers" 
        element={
          <ProtectedRoute>
            <OffersPageAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/categories" 
        element={
          <ProtectedRoute>
            <CategoriesPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/banners" 
        element={
          <ProtectedRoute>
            <BannersPage />
          </ProtectedRoute>
        } 
      />

      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SessionProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SessionProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;