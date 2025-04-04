
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";

import Index from "./pages/Index";
import Customers from "./pages/Customers";
import AIAssistantPage from "./pages/AIAssistantPage";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/customers" element={
            <AppLayout>
              <Customers />
            </AppLayout>
          } />
          <Route path="/ai-assistant" element={
            <AppLayout>
              <AIAssistantPage />
            </AppLayout>
          } />
          <Route path="/calendar" element={
            <AppLayout>
              <Calendar />
            </AppLayout>
          } />
          <Route path="/analytics" element={
            <AppLayout>
              <Analytics />
            </AppLayout>
          } />
          <Route path="/settings" element={
            <AppLayout>
              <Settings />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
