'use client';

import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { useState } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000); // Visual feedback
  };

  return (
    <button 
      onClick={handleRefresh}
      className="p-2 rounded-md hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200 transition-colors"
      title="Refresh Status"
      disabled={isRefreshing}
    >
      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
    </button>
  );
}
