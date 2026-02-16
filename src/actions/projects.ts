'use server';

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
// We need to import getNeonProjectStatus. 
// If it's not exported or needs adjustment, we might need to fix that too.
// Based on previous read, it is exported.
import { getNeonProjectStatus } from "./neon";

export interface ProjectData {
  name: string;
  branch: string;
  status: 'active' | 'idle';
  storageSize: string;
  storageBytes: number;
  usagePercent: number;
  lastActive: string;
  consoleUrl: string;
}

const MOCK_PROJECTS: ProjectData[] = [
  {
    name: "brief-trello",
    branch: "main",
    status: "active",
    storageSize: "4.2 MB",
    storageBytes: 4200000,
    usagePercent: 12,
    lastActive: "Just now",
    consoleUrl: "https://console.neon.tech/app/projects/mock-project-id?branchId=br-mock-main"
  },
  {
    name: "fast-blog",
    branch: "dev",
    status: "idle",
    storageSize: "1.8 MB",
    storageBytes: 1800000,
    usagePercent: 5,
    lastActive: "2 days ago",
    consoleUrl: "https://console.neon.tech/app/projects/mock-project-id?branchId=br-mock-dev"
  },
  {
    name: "saas-starter",
    branch: "main",
    status: "idle",
    storageSize: "12.5 MB",
    storageBytes: 12500000,
    usagePercent: 45,
    lastActive: "5 days ago",
    consoleUrl: "https://console.neon.tech/app/projects/mock-project-id?branchId=br-mock-main-2"
  },
  {
    name: "ai-playground",
    branch: "experiment-1",
    status: "active",
    storageSize: "8.9 MB",
    storageBytes: 8900000,
    usagePercent: 28,
    lastActive: "1 hour ago",
    consoleUrl: "https://console.neon.tech/app/projects/mock-project-id?branchId=br-mock-exp"
  }
];

export async function getDashboardData(): Promise<ProjectData[]> {
  // 1. Check for Neon API Key - if either is missing, return MOCK data immediately to unblock UI dev
  if (!process.env.NEON_API_KEY || !process.env.NEON_PROJECT_ID) {
    console.warn("NEON credentials missing (NEON_API_KEY or NEON_PROJECT_ID), returning mock data");
    return MOCK_PROJECTS;
  }

  try {
    let schemas: string[] = [];
    // Key: schema_name, Value: { pretty, bytes }
    let schemaSizes: Record<string, { pretty: string, bytes: number }> = {};
    
    // 2. Fetch Schemas & Sizes (Projects) from DB
    try {
      // Get Schemas
      const schemaResult = await db.execute(sql`
        SELECT schema_name 
        FROM information_schema.schemata 
        WHERE schema_name NOT IN ('information_schema', 'public', 'drizzle') 
          AND schema_name NOT LIKE 'pg_%';
      `);
      schemas = schemaResult.rows.map((row: any) => row.schema_name as string);

      // Get Sizes
      const sizeResult = await db.execute(sql`
        SELECT schemaname as schema_name, 
          pg_size_pretty(sum(pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename)))::bigint) as size_pretty,
          sum(pg_total_relation_size(quote_ident(schemaname) || '.' || quote_ident(tablename)))::bigint as size_bytes
        FROM pg_tables 
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
        GROUP BY schemaname;
      `);
      
      sizeResult.rows.forEach((row: any) => {
        schemaSizes[row.schema_name as string] = {
          pretty: row.size_pretty as string,
          bytes: Number(row.size_bytes)
        };
      });

    } catch (dbError) {
      console.error("Database fetch failed (likely spun down):", dbError);
      // Fallback to MOCKs if DB is unreachable
      throw dbError; 
    }

    // 3. Fetch Neon Branch Status
    const neonStatus = await getNeonProjectStatus();
    // Assuming a single project, we usually care about the primary branch's logical state
    const primaryBranch = neonStatus.branches.find((b: any) => b.primary) || neonStatus.branches[0];
    
    // Determine status. 
    let isProjectActive = false;
    if (primaryBranch) {
        const state = (primaryBranch.current_state || '').toLowerCase();
        isProjectActive = ['running', 'active'].includes(state);
    }

    // Construct Console URLBase
    // URL Format: https://console.neon.tech/app/projects/<project_id>?branchId=<branch_id>
    const projectId = process.env.NEON_PROJECT_ID;
    const branchId = primaryBranch?.id;
    const consoleUrl = `https://console.neon.tech/app/projects/${projectId}?branchId=${branchId}`;
    
    // 4. Merge Data
    const projects: ProjectData[] = schemas.map(schemaName => {
      const sizeInfo = schemaSizes[schemaName] || { pretty: '0 B', bytes: 0 };
      
      // Calculate a rough "usage percent" based on 500MB free tier (soft limit for visual)
      const limit = 500 * 1024 * 1024; 
      let usagePercent = (sizeInfo.bytes / limit) * 100;
      usagePercent = Math.min(100, Math.max(1, Math.round(usagePercent)));

      return {
        name: schemaName,
        branch: primaryBranch?.name || 'main',
        status: isProjectActive ? 'active' : 'idle',
        storageSize: sizeInfo.pretty,
        storageBytes: sizeInfo.bytes,
        usagePercent: usagePercent,
        lastActive: isProjectActive ? 'Now' : 'Unknown',
        consoleUrl: consoleUrl
      };
    });

    return projects;

  } catch (error) {
    console.error("Dashboard Data Fetch Error:", error);
    // Fallback to mocks to ensure UI is visible even if DB is suspended or key is invalid
    return MOCK_PROJECTS;
  }
}
