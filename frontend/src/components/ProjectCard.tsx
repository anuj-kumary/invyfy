'use client';

import { Project } from '../types/project';
import { useDeleteProject } from '../hooks/useProjects';
import { format } from 'date-fns';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export default function ProjectCard({ project, onEdit }: ProjectCardProps) {
  const deleteProject = useDeleteProject();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject.mutateAsync(project.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(project);
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <Link href={`/projects/${project.id}`} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Client: {project.client_name}
            </p>
            {project.description && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-3 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[project.status]
            }`}
          >
            {project.status}
          </span>
        </div>

        <div className="flex flex-col gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">Start:</span>{' '}
            {format(new Date(project.start_date), 'MMM dd, yyyy')}
          </div>
          <div>
            <span className="font-medium">Due:</span>{' '}
            {format(new Date(project.due_date), 'MMM dd, yyyy')}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteProject.isPending}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {deleteProject.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Link>
  );
}

