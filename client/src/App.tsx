/** Research Ledger design: one persistent indexed shell wraps every editorial documentation route. */
import { DocsShell } from "@/components/DocsShell";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Architecture from "@/pages/Architecture";
import ApiReference from "@/pages/ApiReference";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import ResearchLog from "@/pages/ResearchLog";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <DocsShell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/architecture" component={Architecture} />
        <Route path="/api" component={ApiReference} />
        <Route path="/research-log" component={ResearchLog} />
        <Route component={NotFound} />
      </Switch>
    </DocsShell>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
