export type ProjectStatus = 'active' | 'completed';

export interface Project {
  id: string;
  name: string;
  client_name: string;
  description: string | null;
  start_date: string;
  due_date: string;
  status: ProjectStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  name: string;
  clientName: string;
  description?: string;
  startDate: string;
  dueDate: string;
  status?: ProjectStatus;
}

export interface UpdateProjectData {
  name?: string;
  clientName?: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  status?: ProjectStatus;
}

export interface ProjectResponse {
  success: boolean;
  data: {
    project: Project;
  };
  message?: string;
}

export interface ProjectsResponse {
  success: boolean;
  data: {
    projects: Project[];
  };
}

