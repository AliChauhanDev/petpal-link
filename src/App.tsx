import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AddPet from "./pages/AddPet";
import MyPets from "./pages/MyPets";
import LostPets from "./pages/LostPets";
import FoundPets from "./pages/FoundPets";
import ReportLost from "./pages/ReportLost";
import ReportFound from "./pages/ReportFound";
import SearchPets from "./pages/SearchPets";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-pet" element={<ProtectedRoute><AddPet /></ProtectedRoute>} />
            <Route path="/my-pets" element={<ProtectedRoute><MyPets /></ProtectedRoute>} />
            <Route path="/lost-pets" element={<LostPets />} />
            <Route path="/found-pets" element={<FoundPets />} />
            <Route path="/report-lost" element={<ProtectedRoute><ReportLost /></ProtectedRoute>} />
            <Route path="/report-found" element={<ProtectedRoute><ReportFound /></ProtectedRoute>} />
            <Route path="/search" element={<SearchPets />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
