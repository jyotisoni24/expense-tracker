import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowDownRight, ArrowUpRight, Plus, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { SkeletonCard, SkeletonChart, SkeletonRow } from "@/components/SkeletonCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, parseISO } from "date-fns";
import { CategoryIcon } from "@/components/CategoryIcon";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { transactions, role } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === 'income') acc.totalIncome += curr.amount;
        if (curr.type === 'expense') acc.totalExpense += curr.amount;
        acc.balance = acc.totalIncome - acc.totalExpense;
        return acc;
      },
      { totalIncome: 0, totalExpense: 0, balance: 0 }
    );
  }, [transactions]);

  const chartData = useMemo(() => {
    // Generate last 14 days of data
    const data = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'MMM dd');
      
      // Find transactions for this day
      const dayTransactions = transactions.filter(t => {
        const txDate = parseISO(t.date);
        return format(txDate, 'MMM dd') === dateStr;
      });

      const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      data.push({
        date: dateStr,
        income,
        expense,
        balance: income - expense
      });
    }
    return data;
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-muted rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <SkeletonChart />
          <Card className="col-span-1">
            <CardHeader>
              <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Overview</h1>
          <p className="text-muted-foreground mt-1">Here's a summary of your finances.</p>
        </div>
        {role === 'Admin' && (
          <Button onClick={() => setIsAddModalOpen(true)} className="shadow-sm hover-elevate" data-testid="btn-add-tx">
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-sm bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary-foreground/80" />
          </CardHeader>
          <CardContent className="z-10 relative">
            <div className="text-3xl font-bold font-mono tracking-tight" data-testid="text-total-balance">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-primary-foreground/70 mt-1 flex items-center">
              <Activity className="h-3 w-3 mr-1" />
              Active over last 14 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground font-mono tracking-tight" data-testid="text-total-income">
              ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time income
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-card hover:border-border transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
              <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground font-mono tracking-tight" data-testid="text-total-expense">
              ${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time expenses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="col-span-1 md:col-span-3 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-sans">Cash Flow (Last 14 Days)</CardTitle>
            <CardDescription>Income vs expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `$${value}`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                    itemStyle={{ fontFamily: 'var(--font-mono)' }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, undefined]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorIncome)" 
                    name="Income"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorExpense)" 
                    name="Expense"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="font-sans">Recent Activity</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-1">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <CategoryIcon category={tx.category} />
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium truncate">{tx.category}</p>
                      <p className="text-xs text-muted-foreground truncate">{format(parseISO(tx.date), 'MMM dd')}</p>
                    </div>
                  </div>
                  <div className={`font-mono text-sm font-medium ${tx.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-foreground'}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddTransactionModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </motion.div>
  );
}
