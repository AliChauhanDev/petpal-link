import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Main pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Pet Store pages
import StoreHome from "./pages/store/StoreHome";
import ProductList from "./pages/store/ProductList";
import ProductDetail from "./pages/store/ProductDetail";
import Cart from "./pages/store/Cart";
import Checkout from "./pages/store/Checkout";
import Orders from "./pages/store/Orders";
import SellerDashboard from "./pages/store/SellerDashboard";
import SellerProducts from "./pages/store/SellerProducts";
import AddProduct from "./pages/store/AddProduct";
import SellerOrders from "./pages/store/SellerOrders";
import CreateStore from "./pages/store/CreateStore";

// Pet Care pages
import CareHome from "./pages/care/CareHome";
import Guide from "./pages/care/Guide";
import PetLove from "./pages/care/PetLove";
import Diseases from "./pages/care/Diseases";
import PetDoctor from "./pages/care/PetDoctor";
import PetsInfo from "./pages/care/PetsInfo";

// Pet Report pages
import ReportHome from "./pages/report/ReportHome";
import LostPet from "./pages/report/LostPet";
import FoundPet from "./pages/report/FoundPet";
import ReportLost from "./pages/report/ReportLost";
import ReportFound from "./pages/report/ReportFound";
import ShareExperience from "./pages/report/ShareExperience";
import CreateExperience from "./pages/report/CreateExperience";
import Matches from "./pages/report/Matches";

// Admin pages
import AdminPanel from "./pages/admin/AdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              
              {/* Pet Store routes */}
              <Route path="/store" element={<StoreHome />} />
              <Route path="/store/products" element={<ProductList />} />
              <Route path="/store/product/:id" element={<ProductDetail />} />
              <Route path="/store/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/store/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/store/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/store/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
              <Route path="/store/seller/products" element={<ProtectedRoute><SellerProducts /></ProtectedRoute>} />
              <Route path="/store/seller/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/store/seller/orders" element={<ProtectedRoute><SellerOrders /></ProtectedRoute>} />
              <Route path="/store/create-store" element={<ProtectedRoute><CreateStore /></ProtectedRoute>} />
              
              {/* Pet Care routes */}
              <Route path="/care" element={<CareHome />} />
              <Route path="/care/guide" element={<Guide />} />
              <Route path="/care/pet-love" element={<PetLove />} />
              <Route path="/care/diseases" element={<Diseases />} />
              <Route path="/care/pet-doctor" element={<ProtectedRoute><PetDoctor /></ProtectedRoute>} />
              <Route path="/care/pets-info" element={<PetsInfo />} />
              
              {/* Pet Report routes */}
              <Route path="/report" element={<ReportHome />} />
              <Route path="/report/lost" element={<LostPet />} />
              <Route path="/report/found" element={<FoundPet />} />
              <Route path="/report/create-lost" element={<ProtectedRoute><ReportLost /></ProtectedRoute>} />
              <Route path="/report/create-found" element={<ProtectedRoute><ReportFound /></ProtectedRoute>} />
              <Route path="/report/experiences" element={<ShareExperience />} />
              <Route path="/report/create-experience" element={<ProtectedRoute><CreateExperience /></ProtectedRoute>} />
              <Route path="/report/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
