
import { getActiveProjects } from "@/actions/projects";
import ProjectListClient from "./project-list-client";

export default async function ProjectList() {
  const projects = await getActiveProjects();
  
  return <ProjectListClient projects={projects} />;
}
