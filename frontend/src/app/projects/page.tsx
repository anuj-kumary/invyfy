'use client';

import { useState } from 'react';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import Navigation from '../../components/Navigation';
import { useProjects } from '../../hooks/useProjects';
import ProjectCard from '../../components/ProjectCard';
import AddProjectModal from '../../components/AddProjectModal';
import { Project } from '../../types/project';
import Link from 'next/link';

export default function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your projects and track their progress
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              + Add New Project
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No projects yet. Create your first project!
              </p>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onEdit={handleEdit} />
              ))}
            </div>
          )}

          <AddProjectModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            project={editingProject}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

