import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AppProvider } from '@/context/AppContext';
import '@/i18n/config';


const App = () => (
  <ThemeProvider // ThemeProvider is now the top-level provider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </AppProvider>
  </ThemeProvider>
);

export default App;
