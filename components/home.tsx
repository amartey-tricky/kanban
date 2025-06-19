"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Calendar, User, Check, X, Edit3, Trash2, Play, CheckCircle } from "lucide-react";

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "review" | "done";
  reviewedBy?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  columns: Column[];
}

// Sample roles for assignment
const SAMPLE_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "Product Manager",
  "Product Owner",
  "QA Engineer",
  "DevOps Engineer"
];

const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-red-100 text-red-800 border-red-200"
};

// Default kanban columns
const DEFAULT_COLUMNS: Column[] = [
  { id: "todo", title: "To Do", tasks: [] },
  { id: "in-progress", title: "In Progress", tasks: [] },
  { id: "review", title: "Review", tasks: [] },
  { id: "done", title: "Done", tasks: [] }
];

const COLUMN_ORDER = ["todo", "in-progress", "review", "done"];

export default function KanbanProjectApp() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>("");

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: ""
  });

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    priority: "medium" as Task["priority"]
  });

  const createProject = () => {
    if (!projectForm.name.trim()) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: projectForm.name,
      description: projectForm.description,
      createdAt: new Date().toISOString(),
      columns: DEFAULT_COLUMNS.map(col => ({ ...col, id: crypto.randomUUID() }))
    };

    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    setProjectForm({ name: "", description: "" });
    setShowProjectForm(false);
  };

  const createTask = () => {
    if (!taskForm.title.trim() || !selectedColumn || !currentProject) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskForm.title,
      description: taskForm.description,
      assignee: taskForm.assignee,
      dueDate: taskForm.dueDate,
      completed: false,
      priority: taskForm.priority,
      status: selectedColumn as Task["status"]
    };

    const updatedProject = {
      ...currentProject,
      columns: currentProject.columns.map(col =>
        col.id === selectedColumn
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
    setTaskForm({
      title: "",
      description: "",
      assignee: "",
      dueDate: "",
      priority: "medium"
    });
    setShowTaskForm(false);
    setSelectedColumn("");
  };

  const moveTaskToInProgress = (taskId: string) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      columns: currentProject.columns.map(col => {
        if (col.id === "todo") {
          const taskToMove = col.tasks.find(task => task.id === taskId);
          if (taskToMove) {
            return { ...col, tasks: col.tasks.filter(task => task.id !== taskId) };
          }
        }
        if (col.id === "in-progress") {
          const taskToMove = currentProject.columns
            .find(c => c.id === "todo")?.tasks
            .find(task => task.id === taskId);
          if (taskToMove) {
            return { 
              ...col, 
              tasks: [...col.tasks, { ...taskToMove, status: "in-progress" as Task["status"] }] 
            };
          }
        }
        return col;
      })
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
  };

  const toggleTaskCompletion = (taskId: string, columnId: string) => {
    if (!currentProject) return;

    let updatedProject = { ...currentProject };

    if (columnId === "in-progress") {
      // Move completed task from In Progress to Review
      updatedProject = {
        ...currentProject,
        columns: currentProject.columns.map(col => {
          if (col.id === "in-progress") {
            const taskToMove = col.tasks.find(task => task.id === taskId);
            if (taskToMove) {
              return { ...col, tasks: col.tasks.filter(task => task.id !== taskId) };
            }
          }
          if (col.id === "review") {
            const taskToMove = currentProject.columns
              .find(c => c.id === "in-progress")?.tasks
              .find(task => task.id === taskId);
            if (taskToMove) {
              return { 
                ...col, 
                tasks: [...col.tasks, { ...taskToMove, completed: true, status: "review" as Task["status"] }] 
              };
            }
          }
          return col;
        })
      };
    } else {
      // Regular toggle for other columns
      updatedProject = {
        ...currentProject,
        columns: currentProject.columns.map(col =>
          col.id === columnId
            ? {
                ...col,
                tasks: col.tasks.map(task =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                )
              }
            : col
        )
      };
    }

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
  };

  const approveTask = (taskId: string, reviewerName: string) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      columns: currentProject.columns.map(col => {
        if (col.id === "review") {
          const taskToMove = col.tasks.find(task => task.id === taskId);
          if (taskToMove) {
            return { ...col, tasks: col.tasks.filter(task => task.id !== taskId) };
          }
        }
        if (col.id === "done") {
          const taskToMove = currentProject.columns
            .find(c => c.id === "review")?.tasks
            .find(task => task.id === taskId);
          if (taskToMove) {
            return { 
              ...col, 
              tasks: [...col.tasks, { 
                ...taskToMove, 
                status: "done" as Task["status"],
                reviewedBy: reviewerName
              }] 
            };
          }
        }
        return col;
      })
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
  };

  const deleteTask = (taskId: string, columnId: string) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      columns: currentProject.columns.map(col =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
          : col
      )
    };

    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === currentProject.id ? updatedProject : p));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Project Kanban</h1>
          <p className="text-slate-600">Manage your projects with visual task boards</p>
        </motion.header>

        {!currentProject ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-700">Your Projects</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProjectForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                New Project
              </motion.button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -2 }}
                    onClick={() => setCurrentProject(project)}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border border-slate-200"
                  >
                    <h3 className="font-semibold text-slate-800 mb-2">{project.name}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Created {formatDate(project.createdAt)}</span>
                      <span>{project.columns.reduce((acc, col) => acc + col.tasks.length, 0)} tasks</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {projects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-slate-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">No projects yet</h3>
                <p className="text-slate-500">Create your first project to get started</p>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <button
                  onClick={() => setCurrentProject(null)}
                  className="text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-1"
                >
                  ← Back to Projects
                </button>
                <h2 className="text-3xl font-bold text-slate-800">{currentProject.name}</h2>
                <p className="text-slate-600">{currentProject.description}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskForm(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={20} />
                Add Task
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProject.columns.map((column) => (
                <motion.div
                  key={column.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-md"
                >
                  <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between">
                    {column.title}
                    <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                      {column.tasks.length}
                    </span>
                  </h3>
                  
                  <div className="space-y-3">
                    <AnimatePresence>
                      {column.tasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`p-3 rounded-lg border transition-all ${
                            task.completed 
                              ? "bg-slate-50 border-slate-200 opacity-75" 
                              : "bg-white border-slate-200 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {column.id === "in-progress" ? (
                                <button
                                  onClick={() => toggleTaskCompletion(task.id, column.id)}
                                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    task.completed
                                      ? "bg-green-500 border-green-500 text-white"
                                      : "border-slate-300 hover:border-green-400"
                                  }`}
                                  title="Mark as complete and move to Review"
                                >
                                  {task.completed && <Check size={12} />}
                                </button>
                              ) : (
                                <button
                                  onClick={() => toggleTaskCompletion(task.id, column.id)}
                                  className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    task.completed
                                      ? "bg-green-500 border-green-500 text-white"
                                      : "border-slate-300 hover:border-green-400"
                                  }`}
                                >
                                  {task.completed && <Check size={12} />}
                                </button>
                              )}
                            </div>
                            <button
                              onClick={() => deleteTask(task.id, column.id)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          
                          <h4 className={`font-medium text-sm mb-1 ${
                            task.completed ? "line-through text-slate-500" : "text-slate-800"
                          }`}>
                            {task.title}
                          </h4>
                          
                          {task.description && (
                            <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="space-y-1">
                            {task.assignee && (
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <User size={12} />
                                {task.assignee}
                              </div>
                            )}
                            
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <Calendar size={12} />
                                {formatDate(task.dueDate)}
                              </div>
                            )}
                            
                            {task.reviewedBy && (
                              <div className="flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle size={12} />
                                Reviewed by {task.reviewedBy}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className={`inline-block px-2 py-1 rounded text-xs font-medium border ${PRIORITY_COLORS[task.priority]}`}>
                              {task.priority}
                            </div>
                            
                            {/* Action buttons based on column */}
                            {column.id === "todo" && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => moveTaskToInProgress(task.id)}
                                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                                title="Move to In Progress"
                              >
                                <Play size={10} />
                                Start
                              </motion.button>
                            )}
                            
                            {column.id === "review" && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => approveTask(task.id, "Product Owner")}
                                className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                                title="Approve and move to Done"
                              >
                                <CheckCircle size={10} />
                                Approve
                              </motion.button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Project Creation Modal */}
        <AnimatePresence>
          {showProjectForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4">Create New Project</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter project name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Describe your project"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createProject}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Create Project
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProjectForm(false)}
                    className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Creation Modal */}
        <AnimatePresence>
          {showTaskForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4">Add New Task</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Column
                    </label>
                    <select
                      value={selectedColumn}
                      onChange={(e) => setSelectedColumn(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select a column</option>
                      {currentProject?.columns.map((col) => (
                        <option key={col.id} value={col.id}>
                          {col.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Task Title
                    </label>
                    <input
                      type="text"
                      value={taskForm.title}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter task title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={taskForm.description}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={2}
                      placeholder="Task description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Assignee
                    </label>
                    <select
                      value={taskForm.assignee}
                      onChange={(e) => setTaskForm(prev => ({ ...prev, assignee: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select assignee</option>
                      {SAMPLE_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={taskForm.priority}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value as Task["priority"] }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={createTask}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Add Task
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowTaskForm(false);
                      setSelectedColumn("");
                    }}
                    className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}