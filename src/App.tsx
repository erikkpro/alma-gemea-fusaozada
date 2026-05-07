import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Chat from "./pages/Chat.tsx";
import Oferta from "./pages/Oferta.tsx";
import BackRedirect from "./pages/BackRedirect.tsx";
import Upsell1 from "./pages/Upsell1.tsx";
import Upsell2 from "./pages/Upsell2.tsx";
import Obrigado from "./pages/Obrigado.tsx";
import AdminLeads from "./pages/AdminLeads.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/oferta" element={<Oferta />} />
          <Route path="/back-redirect" element={<BackRedirect />} />
          <Route path="/upsell-1" element={<Upsell1 />} />
          <Route path="/upsell-2" element={<Upsell2 />} />
          <Route path="/obrigado" element={<Obrigado />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
