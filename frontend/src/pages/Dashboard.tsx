import { useState, useEffect, useCallback } from 'react';
import { 
  History, Terminal, 
  Zap, Loader2, RefreshCw, Filter, ChevronDown 
} from 'lucide-react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Transaction {
  createdAt: string | number | Date;
  _id: string;
  amount: number;
  balance: number;
  currency: string;
  type: 'debit' | 'credit';
  date: string;
  description: string;
  rawText: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({ type: 'all', limit: '10' });
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [rawText, setRawText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const token = localStorage.getItem('accessToken');

  // --- SEARCH DEBOUNCING LOGIC ---
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- CORE FETCH FUNCTION ---
  const fetchData = useCallback(async (cursor: string | null = null, isLoadMore = false) => {
    if (isLoadMore) setIsFetchingMore(true);
    else setIsLoading(true);

    try {
      const queryParams = new URLSearchParams();
      if (cursor) queryParams.append('cursor', cursor);
      if (filters.type !== 'all') queryParams.append('type', filters.type);
      if (debouncedSearch) queryParams.append('search', debouncedSearch);
      queryParams.append('limit', filters.limit);

      const response = await fetch(`http://localhost:5000/secure/statements/fetch?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Vault sync failed');

      setTransactions(prev => isLoadMore ? [...prev, ...result.data] : result.data);
      setNextCursor(result.nextCursor);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [token, filters, debouncedSearch]);

  // Re-fetch when filters OR debounced search changes
  useEffect(() => {
    fetchData(null, false);
  }, [filters, debouncedSearch, fetchData]);

  const handleExtraction = async () => {
    if (!rawText.trim()) return toast.error("Input required");
    setIsExtracting(true);

    const promise = fetch('http://localhost:5000/secure/statements/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ text: rawText }),
    }).then(res => res.ok ? res.json() : Promise.reject());

    toast.promise(promise, {
      loading: 'Extracting primitives...',
      success: () => {
        setRawText("");
        fetchData(null, false);
        return "Transaction secured.";
      },
      error: "Extraction failed."
    });
    
    try { await promise; } finally { setIsExtracting(false); }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0] p-6 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- TOP NAV / STATS --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-white italic">Ness_Vault.exe</h1>
            <p className="text-[#9CA3AF] text-xs font-mono">Status: Connected | Encryption: AES-256</p>
          </header>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">

            <div className="flex gap-2">
              <Select value={filters.type} onValueChange={(v) => setFilters(f => ({...f, type: v}))}>
                <SelectTrigger className="w-[140px] bg-[#181818] border-white/10 text-xs">
                  <Filter className="w-3 h-3 mr-2" />
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-[#181818] border-white/10 text-white">
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="debit">Debits</SelectItem>
                  <SelectItem value="credit">Credits</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={() => fetchData(null, false)} className="border-white/10 bg-[#181818]">
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- TERMINAL INGEST --- */}
          <Card className="bg-[#181818] border-white/5 text-white h-fit">
            <CardHeader><CardTitle className="text-md flex items-center gap-2 font-mono"><Terminal size={16}/> STDIN</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full h-48 bg-[#0F0F0F] border border-white/5 rounded p-3 text-xs font-mono text-green-500/80 focus:border-white/20 outline-none resize-none"
                placeholder="READY FOR INPUT..."
              />
              <Button onClick={handleExtraction} disabled={isExtracting} className="w-full bg-white text-black hover:bg-zinc-200 font-bold">
                {isExtracting ? <Loader2 className="animate-spin mr-2"/> : <Zap className="mr-2" size={16}/>}
                PARSE_STRING
              </Button>
            </CardContent>
          </Card>

{/* --- SECURE LEDGER TABLE --- */}
<Card className="lg:col-span-2 bg-[#181818] border-white/5 text-white">
  <CardHeader className="pb-0">
    <CardTitle className="text-md font-mono flex items-center gap-2">
      <History size={16} className="text-zinc-500" /> TRANSACTION_LEDGER
    </CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <ScrollArea className="h-[550px] px-6">
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-[10px] font-bold uppercase text-zinc-500">Execution Date</TableHead>
            <TableHead className="text-[10px] font-bold uppercase text-zinc-500">Transaction Details</TableHead>
            <TableHead className="text-[10px] font-bold uppercase text-zinc-500">Amount</TableHead>
            <TableHead className="text-[10px] font-bold uppercase text-zinc-500 text-right">Available Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 && !isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-24 text-zinc-700 font-mono text-xs">
                NO TRANSACTIONS DETECTED IN THIS VAULT
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx._id} className="border-white/5 hover:bg-white/[0.02] group transition-colors">
                {/* 1. Execution Date */}
                <TableCell className="py-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white">
                      {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </TableCell>

                {/* 2. Transaction Type Badge */}
                <TableCell>
                  <Badge 
                    className={`bg-zinc-900 border-white/5 text-[9px] font-mono px-2 py-0.5 uppercase tracking-tighter ${
                      tx.type === 'debit' ? 'text-red-400 border-red-900/50' : 'text-green-400 border-green-900/50'
                    }`}
                  >
                    {tx.type}
                  </Badge>
                </TableCell>

                {/* 3. Dynamic Amount Formatting */}
                <TableCell>
                  <span className={`font-mono text-sm font-bold ${tx.type === 'debit' ? 'text-red-500' : 'text-green-500'}`}>
                    {tx.type === 'debit' ? '-' : '+'}
                    {tx.amount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span >
                  <span className="ml-1 text-[10px] text-zinc-500 font-mono">{tx.currency}</span>
                </TableCell>

                {/* 4. Available Balance After Transaction */}
                <TableCell className="text-right">
                  <span className="text-xs font-mono text-zinc-300">
                    {tx.balance ? tx.balance.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }) : '---'}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Pagination stays below */}
      <div className="py-6 flex justify-center border-t border-white/5 mt-4">
        {nextCursor ? (
          <Button 
            variant="ghost" 
            onClick={() => fetchData(nextCursor, true)} 
            disabled={isFetchingMore}
            className="text-[10px] font-mono text-zinc-500 hover:text-white"
          >
            {isFetchingMore ? <Loader2 className="animate-spin mr-2" size={14}/> : <ChevronDown className="mr-2" size={14}/>}
            LOAD_NEXT_SEQUENCE
          </Button>
        ) : !isLoading && transactions.length > 0 && (
          <p className="text-[10px] font-mono text-zinc-600">-- SECURE END OF STREAM --</p>
        )}
      </div>
    </ScrollArea>
  </CardContent>
</Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;