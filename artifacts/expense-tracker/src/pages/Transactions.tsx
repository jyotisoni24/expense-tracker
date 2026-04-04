import { useState, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Edit2, FileText, Receipt } from "lucide-react";
import { format, parseISO } from "date-fns";
import { CategoryIcon } from "@/components/CategoryIcon";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { Transaction } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

const floatAnim = {
  animate: {
    y: [0, -10, 0],
    rotate: [-3, 3, -3],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function Transactions() {
  const { transactions, role } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
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
      ...filteredTransactions.map((tx) =>
        [
          format(parseISO(tx.date), "yyyy-MM-dd"),
          tx.category,
          tx.type,
          tx.amount,
          `"${tx.notes || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `transactions_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
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
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6 relative"
    >
      {/* Floating stickers */}
      <motion.div
        variants={floatAnim}
        animate="animate"
        className="absolute -top-4 right-6 text-4xl pointer-events-none select-none hidden lg:block"
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.12))" }}
      >
        🧾
      </motion.div>
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, -5, 5, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 } }}
        className="absolute top-20 -right-2 text-3xl pointer-events-none select-none hidden xl:block"
        style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.1))" }}
      >
        💳
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans flex items-center gap-2">
            Transactions
            <motion.span
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1.5, delay: 1.2, repeat: Infinity, repeatDelay: 5 }}
            >
              <Receipt className="h-6 w-6 text-primary" />
            </motion.span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Search, filter, and review your transaction history.</p>
        </div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button variant="outline" onClick={handleExportCSV} className="shadow-sm gap-2" data-testid="btn-export-csv">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </motion.div>
      </motion.div>

      {/* Filter bar + list */}
      <motion.div variants={fadeUp}>
        <Card className="border-0 shadow-sm overflow-hidden">
          {/* Filter bar */}
          <div className="p-4 border-b flex flex-col sm:flex-row gap-3 bg-muted/20">
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
              <SelectTrigger className="w-full sm:w-[180px] bg-background" data-testid="select-filter-type">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expense Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {filteredTransactions.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64 text-center px-4"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4"
                  >
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-foreground">No transactions found</h3>
                  <p className="text-muted-foreground mt-1 text-sm">Try adjusting your search or filters.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  variants={stagger}
                  initial="hidden"
                  animate="show"
                  className="divide-y"
                >
                  {filteredTransactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      variants={fadeUp}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/25 transition-colors gap-4 group"
                      data-testid={`row-tx-${tx.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div whileHover={{ scale: 1.12, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                          <CategoryIcon category={tx.category} size={20} className="w-10 h-10" />
                        </motion.div>
                        <div>
                          <p className="font-medium">{tx.category}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{format(parseISO(tx.date), "MMM dd, yyyy")}</span>
                            {tx.notes && (
                              <>
                                <span>·</span>
                                <span className="truncate max-w-[180px]">{tx.notes}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full pl-14 sm:pl-0">
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`font-mono font-semibold text-lg ${
                            tx.type === "income"
                              ? "text-green-600 dark:text-green-500"
                              : "text-red-600 dark:text-red-500"
                          }`}
                        >
                          {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                        </motion.div>
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                            tx.type === "income"
                              ? "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                          }`}>
                            {tx.type}
                          </span>
                          {role === "Admin" && (
                            <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditModal(tx)}
                                className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                data-testid={`btn-edit-tx-${tx.id}`}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

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
