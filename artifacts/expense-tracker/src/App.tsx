import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "@/components/Navbar";
import { AddTransactionModal } from "@/components/AddTransactionModal";

import Dashboard from "@/pages/Dashboard";
import Transactions from "@/pages/Transactions";
import Insights from "@/pages/Insights";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Layout() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full bg-background font-sans text-foreground flex flex-col">
      <Navbar onAddTransaction={() => setIsAddModalOpen(true)} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Switch>
          <Route path="/" component={() => <Dashboard onAddTransaction={() => setIsAddModalOpen(true)} />} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/insights" component={Insights} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <AddTransactionModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
