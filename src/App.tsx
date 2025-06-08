
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import OfferDetails from "./pages/OfferDetails";
import Category from "./pages/Category";
import AboutUs from "./pages/AboutUs";
import UserPolicy from "./pages/UserPolicy";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoadingBar from "./components/LoadingBar";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize user tracking and analytics
    const initializeTracking = () => {
      console.log("Initializing user tracking and analytics");
    };
    initializeTracking();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-900 text-white">
            <LoadingBar />
            <Header />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/offer/:id" element={<OfferDetails />} />
                <Route path="/category/:category" element={<Category />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/policy" element={<UserPolicy />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <CookieConsent />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
