
'use client';

import { Card, Title, List, ListItem } from "@tremor/react";
import { getDeterministicColor, cn } from "@/lib/utils";

interface ProjectListProps {
  projects: string[];
}

export default function ProjectListClient({ projects }: ProjectListProps) {
  return (
    <Card className="card-indie ring-0 bg-zinc-900 border-zinc-800">
      <Title className="text-zinc-100 font-bold mb-4 flex items-center gap-2">
        <span className="text-pink-500">◆</span> Active Projects
      </Title>
      <List className="mt-2">
        {projects.map((project) => {
          const colorClass = getDeterministicColor(project);
          return (
            <ListItem key={project} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors p-2 rounded-md">
              <span className="text-zinc-300 font-medium">{project}</span>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", colorClass)}>
                Active
              </span>
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
}
