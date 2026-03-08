import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Drops from "./pages/Drops";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

import { FavoritesProvider } from "./context/FavoritesContext";
import { BucketlistProvider } from "./context/BucketlistContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FavoritesProvider>
      <BucketlistProvider>
        <TooltipProvider>
          <BrowserRouter>
        <ScrollToTop />
        <Toaster />
        <Sonner />
        <div className="flex flex-col min-h-screen">
          {/* Grain overlay for gritty effect */}
          <div className="grain-overlay" />
          
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/drops" element={<Drops />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              {/* <Route path="/admin" element={<Admin />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
        </BrowserRouter>
      </TooltipProvider>
    </BucketlistProvider>
  </FavoritesProvider>
</QueryClientProvider>
);

export default App;
