import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import HomePage from "./pages/HomePage";
import SearchResultPage from "./pages/SearchResultPage";
import MapPage from "./pages/MapPage";
import StoreDetailPage from "./pages/StoreDetailPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import UserFavoritePage from "./pages/UserFavoritePage";
import UserProfilePage from "./pages/UserProfilePage";
import RecommendationPage from "./pages/RecommendationPage";
import NotificationPage from "./pages/NotificationPage";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <NotificationProvider>
                <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/search" element={<SearchResultPage />} />
                            <Route path="/map" element={<MapPage />} />
                            <Route path="/recommend" element={<RecommendationPage />} />
                            <Route path="/store/:id" element={<StoreDetailPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/favorites" element={<UserFavoritePage />} />
                            <Route path="/profile" element={<UserProfilePage />} />
                            <Route path="/notifications" element={<NotificationPage />} />
                            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </NotificationProvider>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
