
'use client';

import { Card, Metric, Text } from "@tremor/react";
import { cn } from "@/lib/utils";

interface NeonStatusProps {
  computeHours: string;
  branches: {
    id: string;
    name: string;
    current_state: string;
  }[];
  error?: string;
}

export default function NeonStatusClient({ computeHours, branches, error }: NeonStatusProps) {
  if (error) {
    return (
      <Card decoration="top" decorationColor="red" className="bg-zinc-900 border-zinc-800 ring-0">
        <Text className="text-zinc-400">Error fetching Neon Status</Text>
        <Text className="text-red-400 mt-2">{error}</Text>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Card */}
      <Card className="card-indie ring-0 bg-zinc-900 border-zinc-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-24 h-24 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
          </svg>
        </div>
        <Text className="text-zinc-400 font-medium">Total Compute Hours</Text>
        <Metric className="text-3xl text-zinc-100 mt-2 text-glow">{computeHours} <span className="text-lg text-zinc-600">hrs</span></Metric>
      </Card>

      {/* Individual Branch Cards */}
      <div className="flex flex-col gap-3">
        <Text className="text-zinc-500 text-sm font-semibold uppercase tracking-wider pl-1">Neon Branches</Text>
        {branches.map((branch) => (
          <Card key={branch.id} className="card-indie ring-0 bg-zinc-900 border-zinc-800 relative overflow-hidden group p-4">
            <div className="flex justify-between items-start z-10 relative">
              <div>
                <Text className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Branch</Text>
                <Metric className="text-xl text-zinc-200 group-hover:text-pink-200 transition-colors">{branch.name}</Metric>
              </div>
              <span className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset backdrop-blur-md",
                branch.current_state === 'active' 
                  ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30" 
                  : "bg-zinc-500/10 text-zinc-400 ring-zinc-500/30"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", branch.current_state === 'active' ? "bg-emerald-400" : "bg-zinc-400")}></span>
                {branch.current_state}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-zinc-800/50 flex justify-between items-center z-10 relative">
              <Text className="text-xs text-zinc-600">ID</Text>
              <span className="font-mono text-xs text-zinc-500 group-hover:text-pink-400/70 transition-colors">{branch.id}</span>
            </div>
            {/* Metallic Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </Card>
        ))}
      </div>
    </div>
  );
}
