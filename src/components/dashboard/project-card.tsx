import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Activity, Database, HardDrive, Circle } from "lucide-react";
import { ProjectData } from "@/actions/projects";

interface ProjectCardProps {
  project: ProjectData;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isActive = project.status === 'active';

  return (
    <a 
      href={project.consoleUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block group"
    >
    <Card className="linear-card relative overflow-hidden h-full">
      {/* Active Glow Effect */}
      {isActive && (
        <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-emerald-500/10 blur-[50px] pointer-events-none" />
      )}

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-200 flex items-center gap-2">
          <Database className="h-4 w-4 text-zinc-500" />
          {project.name}
        </CardTitle>
        <div className={cn("flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border", 
          isActive 
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" 
            : "border-zinc-700 bg-zinc-800/50 text-zinc-400"
        )}>
          {isActive && <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>}
          {!isActive && <Circle className="h-1.5 w-1.5 fill-current" />}
          {isActive ? 'ACTIVE' : 'IDLE'}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline justify-between mt-1">
            <div className="text-2xl font-bold font-mono tracking-tight text-white">
                {project.storageSize}
            </div>
            <div className="text-xs text-zinc-500 font-mono">
                {project.storageBytes.toLocaleString()} B
            </div>
        </div>

        <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 flex items-center gap-1.5">
                    <HardDrive className="h-3 w-3" />
                    Storage
                </span>
                <span className="text-zinc-400 font-mono">{project.usagePercent}%</span>
            </div>
            <Progress 
                value={project.usagePercent} 
                className="h-1 bg-zinc-800" 
                indicatorClassName={isActive ? "bg-emerald-500" : "bg-zinc-600"} 
            />
            
            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                     <span className="px-1.5 py-0.5 rounded bg-zinc-800 border border-white/5 text-zinc-400 font-mono text-[10px]">
                        {project.branch}
                     </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Activity className="h-3 w-3" />
                    {project.lastActive}
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
    </a>
  );
}
