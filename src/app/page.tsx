import { getDashboardData } from "@/actions/projects";
import { ProjectCard } from "@/components/dashboard/project-card";
import { RefreshButton } from "@/components/dashboard/refresh-button";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await getDashboardData();
  
  // Calculate aggregate stats for the header
  const activeCount = projects.filter(p => p.status === 'active').length;
  const totalStorage = projects.reduce((acc, p) => acc + p.storageBytes, 0);
  const formattedStorage = (totalStorage / (1024 * 1024)).toFixed(1) + ' MB';

  return (
    <main className="min-h-screen bg-zinc-950 text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Indie HQ</h1>
            <p className="text-sm text-zinc-500">
                Ecosystem Status • {activeCount} Active • {formattedStorage} Total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-600 font-mono hidden md:block uppercase tracking-wider">
                Region: aws-us-east-1
            </span>
            <div className="h-4 w-[1px] bg-zinc-800 hidden md:block"></div>
            <RefreshButton />
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}

          {/* New Project Placeholder (Optional, fills visual space) */}
          <button className="group relative flex flex-col items-center justify-center p-6 border border-dashed border-zinc-800 hover:border-zinc-700 rounded-lg hover:bg-zinc-900/30 transition-all gap-3 h-[220px]">
            <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover:border-zinc-700 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                <span className="text-xl">+</span>
            </div>
            <span className="text-sm text-zinc-500 font-medium">New Project</span>
          </button>
        </div>
      </div>
    </main>
  );
}
