import { create } from 'zustand';
import { Project, Blueprint, ProjectVersion } from '../types';

interface ProjectState {
  projects: Project[];
  totalProjects: number;
  projectsPage: number;
  projectsLimit: number;
  hasMoreProjects: boolean;
  activeProject: Project | null;
  activeBlueprint: Blueprint | null;
  versions: ProjectVersion[];
  
  setProjects: (projects: Project[]) => void;
  addProjects: (projects: Project[]) => void;
  updateProjectInStore: (project: Project) => void;
  setPagination: (pagination: { total: number; page: number; limit: number; has_more: boolean }) => void;
  setActiveProject: (project: Project | null) => void;
  setActiveBlueprint: (blueprint: Blueprint | null) => void;
  setVersions: (versions: ProjectVersion[]) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  totalProjects: 0,
  projectsPage: 1,
  projectsLimit: 10,
  hasMoreProjects: false,
  activeProject: null,
  activeBlueprint: null,
  versions: [],
  
  setProjects: (projects) => set({ projects }),
  addProjects: (newProjects) => set((state) => ({ projects: [...state.projects, ...newProjects] })),
  updateProjectInStore: (updatedProject) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      ),
      activeProject:
        state.activeProject?.id === updatedProject.id
          ? updatedProject
          : state.activeProject,
    })),
  setPagination: (pag) =>
    set({
      totalProjects: pag.total,
      projectsPage: pag.page,
      projectsLimit: pag.limit,
      hasMoreProjects: pag.has_more,
    }),
  setActiveProject: (project) => set({ activeProject: project }),
  setActiveBlueprint: (blueprint) => set({ activeBlueprint: blueprint }),
  setVersions: (versions) => set({ versions }),
}));
