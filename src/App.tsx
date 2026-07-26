import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Characters from "./pages/Characters";
import Games from "./pages/Games";
import Bestiary from "./pages/Bestiary";
import Locations from "./pages/Locations";
import Armory from "./pages/Armory";
import Timeline from "./pages/Timeline";
import FieldUpdates from "./pages/FieldUpdates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/games" element={<Games />} />
              <Route path="/bestiary" element={<Bestiary />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/armory" element={<Armory />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/updates" element={<FieldUpdates />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
