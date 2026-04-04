import { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Edit2, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { CategoryIcon } from "@/components/CategoryIcon";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { Transaction } from "@/data/mockData";
import { motion } from "framer-motion";

export default function Transactions() {
  const { transactions, role } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        const matchesSearch = 
          tx.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tx.notes && tx.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesType = typeFilter === "all" || tx.type === typeFilter;
        
        return matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, typeFilter]);

  const handleExportCSV = () => {
    const headers = ["Date", "Category", "Type", "Amount", "Notes"];
    const csvContent = [
      headers.join(","),
      ...filteredTransactions.map(tx => [
        format(parseISO(tx.date), 'yyyy-MM-dd'),
        tx.category,
        tx.type,
        tx.amount,
        `"${tx.notes || ''}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openEditModal = (tx: Transaction) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto h-full flex flex-col"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Transactions</h1>
          <p className="text-muted-foreground mt-1">Review and search your transaction history.</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV} className="shadow-sm">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="border-0 shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 bg-muted/20">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by category or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
              data-testid="input-search-tx"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] bg-background" data-testid="select-filter-type">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income Only</SelectItem>
              <SelectItem value="expense">Expense Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <CardContent className="p-0 flex-1 overflow-auto">
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No transactions found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredTransactions.map(tx => (
                <div 
                  key={tx.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/30 transition-colors gap-4"
                  data-testid={`row-tx-${tx.id}`}
                >
                  <div className="flex items-center gap-4">
                    <CategoryIcon category={tx.category} size={20} className="w-10 h-10" />
                    <div>
                      <p className="font-medium">{tx.category}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{format(parseISO(tx.date), 'MMM dd, yyyy')}</span>
                        {tx.notes && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[200px]">{tx.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pl-14 sm:pl-0">
                    <div className={`font-mono font-medium text-lg ${tx.type === 'income' ? 'text-green-600 dark:text-green-500' : 'text-foreground'}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                    {role === 'Admin' && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEditModal(tx)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        data-testid={`btn-edit-tx-${tx.id}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AddTransactionModal 
        open={isModalOpen} 
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setTimeout(() => setEditingTx(null), 200);
        }} 
        transactionToEdit={editingTx}
      />
    </motion.div>
  );
}
