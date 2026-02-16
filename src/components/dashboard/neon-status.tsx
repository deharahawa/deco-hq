
import { getNeonProjectStatus } from "@/actions/neon";
import NeonStatusClient from "./neon-status-client";

export default async function NeonStatus() {
  try {
    const data = await getNeonProjectStatus();
    
    // Aggregate logic
    const totalCompute = data.branches.reduce((acc: number, b: any) => acc + (b.compute_time_seconds || 0), 0);
    const computeHours = (totalCompute / 3600).toFixed(2);
    
    return <NeonStatusClient computeHours={computeHours} branches={data.branches} />;
  } catch (e: any) {
    return <NeonStatusClient computeHours="0" branches={[]} error={e.message} />;
  }
}
