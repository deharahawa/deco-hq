
import { getProjectSizes } from "@/actions/projects";
import StorageChart from "./storage-chart-client";

export default async function ProjectSizes() {
  const sizes = await getProjectSizes();
  
  const data = sizes.map(p => ({
    name: p.name,
    value: p.bytes,
    href: "#",
    icon: undefined
  }));

  return <StorageChart data={data} />;
}
