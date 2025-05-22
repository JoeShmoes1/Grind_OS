
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { XPProvider } from "./contexts/XPContext";
import { RoomStateProvider } from "./contexts/RoomStateContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import OnboardingRoute from "./components/auth/OnboardingRoute";
import { MainLayout } from "./components/layout/MainLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import PremiumCheckout from "./pages/PremiumCheckout";
import PackageSelection from "./pages/PackageSelection";
import SearchRoom from "./components/rooms/SearchRoom";
import JournalRoom from "./components/rooms/JournalRoom";
import VisionRoom from "./components/rooms/VisionRoom";
import NoteRoom from "./components/rooms/NoteRoom";
import AIAssistantRoom from "./pages/AIAssistantRoom";
import DashboardRoom from "./pages/DashboardRoom";
import CashflowRoom from "./components/rooms/CashflowRoom";
import CalendarRoom from "./components/rooms/CalendarRoom";
import ResetRoom from "./components/rooms/ResetRoom";
import MindmapRoom from "./components/rooms/MindmapRoom";
import VaultRoom from "./components/rooms/VaultRoom";
import ArenaRoom from "./components/rooms/ArenaRoom";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <XPProvider>
          <RoomStateProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Landing page - entry point for the app */}
                  <Route path="/welcome" element={<Landing />} />

                  {/* Public routes */}
                  <Route path="/auth" element={<Auth />} />

                  {/* Onboarding route - only accessible after authentication but before onboarding */}
                  <Route
                    path="/onboarding"
                    element={
                      <OnboardingRoute>
                        <Onboarding />
                      </OnboardingRoute>
                    }
                  />
                  <Route path="/package-selection" element={<ProtectedRoute />}>
                    <Route path="" element={<PackageSelection />} />
                  </Route>

                  <Route path="/premium-checkout" element={<ProtectedRoute />}>
                    <Route path="" element={<PremiumCheckout />} />
                  </Route>

                  {/* Protected routes - require authentication and completed onboarding */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/gm" element={<Index />} />
                    <Route path="/tasks" element={<Index />} />
                    <Route path="/rituals" element={<Index />} />
                    <Route path="/vision" element={
                      <MainLayout>
                        <VisionRoom />
                      </MainLayout>
                    } />
                    <Route path="/journal" element={
                      <MainLayout>
                        <JournalRoom />
                      </MainLayout>
                    } />
                    <Route path="/notes" element={
                      <MainLayout>
                        <NoteRoom />
                      </MainLayout>
                    } />
                    <Route path="/search" element={
                      <MainLayout>
                        <SearchRoom />
                      </MainLayout>
                    } />
                    <Route path="/ai-assistant" element={
                      <MainLayout>
                        <AIAssistantRoom />
                      </MainLayout>
                    } />
                    <Route path="/dashboard" element={
                      <MainLayout>
                        <DashboardRoom />
                      </MainLayout>
                    } />
                    <Route path="/cashflow" element={
                      <MainLayout>
                        <CashflowRoom />
                      </MainLayout>
                    } />
                    <Route path="/calendar" element={
                      <MainLayout>
                        <CalendarRoom />
                      </MainLayout>
                    } />
                    <Route path="/reset" element={
                      <MainLayout>
                        <ResetRoom />
                      </MainLayout>
                    } />
                    <Route path="/mindmap" element={
                      <MainLayout>
                        <MindmapRoom />
                      </MainLayout>
                    } />
                    <Route path="/vault" element={
                      <MainLayout>
                        <VaultRoom />
                      </MainLayout>
                    } />
                    <Route path="/arena" element={
                      <MainLayout>
                        <ArenaRoom />
                      </MainLayout>
                    } />
                    <Route path="/settings" element={<Settings />} />
                  </Route>

                  {/* Redirect root to welcome page if not authenticated */}
                  <Route path="" element={<Navigate to="/welcome" replace />} />

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </RoomStateProvider>
        </XPProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
