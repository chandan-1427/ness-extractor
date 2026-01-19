import { useState, useEffect, useCallback } from 'react';
import { 
  History, Terminal, Search,
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

interface ApiResponse {
  success: boolean;
  message?: string;
  data: Transaction[];
  nextCursor: string | null;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({ type: 'all', limit: '10' });
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [rawText, setRawText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
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

      const response = await fetch(`${baseUrl}/secure/statements/fetch?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Vault sync failed');
      }

      setTransactions(prev => isLoadMore ? [...prev, ...result.data] : result.data);
      setNextCursor(result.nextCursor);

    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred during decryption.');
      }
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  }, [token, filters, debouncedSearch, baseUrl]); 

  // Re-fetch when filters OR debounced search changes
  useEffect(() => {
    fetchData(null, false);
  }, [filters, debouncedSearch, fetchData]);

  const handleExtraction = async () => {
    if (!rawText.trim()) return toast.error("Input required");
    setIsExtracting(true);

    const promise = fetch(`${baseUrl}/secure/statements/extract`, {
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
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* --- INTEGRATED SEARCH BAR --- */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 group-focus-within:text-white transition-colors" />
              <input 
                type="text"
                placeholder="SEARCH_LEDGER..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#181818] border border-white/10 rounded-md py-2 pl-9 pr-4 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-white/20 w-full sm:w-[220px] transition-all"
              />
            </div>

            <div className="flex gap-2">
              <Select value={filters.type} onValueChange={(v) => setFilters(f => ({...f, type: v}))}>
                <SelectTrigger className="w-[140px] bg-[#181818] border-white/10 text-xs font-mono uppercase">
                  <Filter className="w-3 h-3 mr-2 text-zinc-500" />
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-[#181818] border-white/10 text-white">
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="debit">Debits</SelectItem>
                  <SelectItem value="credit">Credits</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" onClick={() => fetchData(null, false)} className="border-white/10 bg-[#181818] hover:bg-white/5 transition-colors">
                <RefreshCw size={16} className={isLoading ? "animate-spin text-white" : "text-zinc-400"} />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- TERMINAL INGEST --- */}
{/* --- TERMINAL INGEST --- */}
<Card className="bg-[#181818] border-white/5 text-white h-fit shadow-2xl">
  <CardHeader>
    <CardTitle className="text-md flex items-center gap-2 font-mono">
      <Terminal size={16} className="text-green-500" /> STDIN_RAW
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    <textarea
      value={rawText}
      onChange={(e) => setRawText(e.target.value)}
      className="w-full h-48 bg-[#0F0F0F] border border-white/5 rounded p-3 text-xs font-mono text-green-500/80 focus:border-white/20 outline-none resize-none placeholder:text-zinc-800"
      placeholder="PASTE RAW STATEMENT FRAGMENT HERE..."
    />

    {/* ✅ SAMPLE TRANSACTIONS */}
    <div className="rounded border border-white/5 bg-[#101010] p-3 space-y-2">
      <p className="text-[11px] font-mono text-zinc-400">
        SAMPLE_INPUT (click to copy)
      </p>

      <div className="bg-black/40 border border-white/5 rounded p-2">
        <pre className="text-[11px] leading-relaxed font-mono text-green-400/80 whitespace-pre-wrap">
{`Your a/c XXXXX1234 is debited with INR 1,250.00 on 12-09-2025. Available balance: INR 23,540.50`}
        </pre>
      </div>

    </div>

    <Button
      onClick={handleExtraction}
      disabled={isExtracting}
      className="w-full bg-white text-black hover:bg-zinc-200 font-bold transition-all active:scale-[0.98]"
    >
      {isExtracting ? (
        <Loader2 className="animate-spin mr-2" />
      ) : (
        <Zap className="mr-2" size={16} />
      )}
      PARSE_STRING
    </Button>
  </CardContent>
</Card>


          {/* --- SECURE LEDGER TABLE --- */}
          <Card className="lg:col-span-2 bg-[#181818] border-white/5 text-white shadow-2xl overflow-hidden">
            <CardHeader className="pb-0 border-b border-white/5 bg-white/[0.01] px-6 py-4">
              <CardTitle className="text-md font-mono flex items-center gap-2">
                <History size={16} className="text-zinc-500" /> TRANSACTION_LEDGER
                {debouncedSearch && <Badge variant="outline" className="ml-2 font-mono text-[9px] border-white/10 text-zinc-400 uppercase">Filtered by: {debouncedSearch}</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="bg-[#1a1a1a] sticky top-0 z-10 shadow-sm">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase text-zinc-500 pl-6">Execution Date</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-zinc-500">Details & Type</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-zinc-500">Amount</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase text-zinc-500 text-right pr-6">Vault Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 && !isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-32 text-zinc-700 font-mono text-xs">
                          NO_DATA_STREAM_FOUND
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx._id} className="border-white/5 hover:bg-white/[0.03] group transition-colors">
                          <TableCell className="py-4 pl-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-white font-mono">
                                {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                              <span className="text-[10px] text-zinc-500 font-mono opacity-50">
                                {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-col gap-1.5">
                              <span className="text-[11px] text-zinc-300 font-mono tracking-tight line-clamp-1 group-hover:text-white transition-colors">
                                {tx.description || "NULL_DESC_PTR"}
                              </span>
                              <Badge 
                                className={`w-fit bg-transparent border-white/10 text-[8px] font-mono px-1.5 py-0 uppercase tracking-widest ${
                                  tx.type === 'debit' ? 'text-red-400/80' : 'text-green-400/80'
                                }`}
                              >
                                {tx.type}
                              </Badge>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className={`font-mono text-sm font-bold ${tx.type === 'debit' ? 'text-red-500' : 'text-green-400'}`}>
                              {tx.type === 'debit' ? '-' : '+'}
                              {tx.amount.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </span>
                            <span className="ml-1 text-[9px] text-zinc-600 font-mono uppercase">{tx.currency}</span>
                          </TableCell>

                          <TableCell className="text-right pr-6">
                            <span className="text-xs font-mono text-zinc-400 bg-white/5 px-2 py-1 rounded border border-white/5">
                              {tx.balance ? tx.balance.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              }) : '0.00'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                <div className="py-8 flex justify-center bg-gradient-to-t from-[#181818] to-transparent">
                  {nextCursor ? (
                    <Button 
                      variant="ghost" 
                      onClick={() => fetchData(nextCursor, true)} 
                      disabled={isFetchingMore}
                      className="text-[10px] font-mono text-zinc-500 hover:text-white border border-white/5 hover:bg-white/5"
                    >
                      {isFetchingMore ? <Loader2 className="animate-spin mr-2" size={14}/> : <ChevronDown className="mr-2" size={14}/>}
                      LOAD_NEXT_SEQUENCE
                    </Button>
                  ) : !isLoading && transactions.length > 0 && (
                    <div className="flex flex-col items-center gap-1 opacity-30">
                      <div className="h-[1px] w-12 bg-zinc-500" />
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">End of stream</p>
                    </div>
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