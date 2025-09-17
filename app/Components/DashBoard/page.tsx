"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectForm } from "@/components/project-form"
import { RequirementsManager } from "@/components/requirements-manager"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

// import { useSearchParams } from "next/navigation"

import { useRouter } from "next/navigation"

import Navbar from "../../Components/Navbar/page"

// import "../../Components/ParticularProject"


import {
  Plus,
  FolderOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Edit,
  Trash2,
  MoreHorizontal,
  List,
  TrendingUp,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Project {
  id: number
  name: string
  description: string
  status: string
  progress: number
  requirements: number
  completedRequirements: number
  priority: string
  dueDate: string
}

interface Project {
  _id: string
  name: string
  img: string
  desc: string
  bigDesc: string
  priority: string
  dueDate: string
}

// import "../../Components/CreateActivity"

export default function AdminDashboard() {
  // const [projects, setProjects] = useState<Project[]>([
  //   {
  //     id: 1,
  //     name: "E-commerce Platform",
  //     description: "Modern online shopping platform with advanced features",
  //     status: "In Progress",
  //     progress: 65,
  //     requirements: 12,
  //     completedRequirements: 8,
  //     priority: "High",
  //     dueDate: "2024-12-15",
  //   },
  //   {
  //     id: 2,
  //     name: "Mobile Banking App",
  //     description: "Secure mobile banking application for iOS and Android",
  //     status: "Planning",
  //     progress: 25,
  //     requirements: 18,
  //     completedRequirements: 4,
  //     priority: "Critical",
  //     dueDate: "2024-11-30",
  //   },
  //   {
  //     id: 3,
  //     name: "CRM Dashboard",
  //     description: "Customer relationship management system",
  //     status: "Completed",
  //     progress: 100,
  //     requirements: 8,
  //     completedRequirements: 8,
  //     priority: "Medium",
  //     dueDate: "2024-10-20",
  //   },
  // ])




  const [projects, setProjects] = useState<Project[]>([])

  const fetchProjects = async () => {
    try {
      const res = await fetch(`https://solvrithm-admin-backend.onrender.com/projects`) // adjust API URL
      const data: Project[] = await res.json()
      setProjects(data)
    } catch (err) {
      console.error("Error fetching projects:", err)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | undefined>()
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [deleteProject, setDeleteProject] = useState<Project | undefined>()

  const [showRequirementsManager, setShowRequirementsManager] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | undefined>()


  const router = useRouter()


  const gotoCreateProject = () => {
    router.push("/Components/CreateActivity")
  }


  const gotoParticularProject = (id: string) => {
    router.push(`/Components/ParticularProject/?id=${id}`)
  }


  const handleCreateProject = () => {
    setEditingProject(undefined)
    setFormMode("create")
    setShowProjectForm(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setFormMode("edit")
    setShowProjectForm(true)
  }

  const handleDeleteProject = (project: Project) => {
    setDeleteProject(project)
  }

  const handleManageRequirements = (project: Project) => {
    setSelectedProject(project)
    setShowRequirementsManager(true)
  }

  const handleRequirementsUpdate = (projectId: number, requirements: any[]) => {
    const completedCount = requirements.filter((r) => r.status === "Completed").length
    const totalCount = requirements.length
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    setProjects(
      projects.map((p) =>
        p.id === projectId
          ? {
            ...p,
            requirements: totalCount,
            completedRequirements: completedCount,
            progress: progressPercentage,
          }
          : p,
      ),
    )
  }

  const confirmDeleteProject = () => {
    if (deleteProject) {
      setProjects(projects.filter((p) => p.id !== deleteProject.id))
      setDeleteProject(undefined)
    }
  }

  const handleSubmitProject = (projectData: Omit<Project, "id">) => {
    if (formMode === "create") {
      const newProject: Project = {
        ...projectData,
        id: Math.max(...projects.map((p) => p.id), 0) + 1,
      }
      setProjects([...projects, newProject])
    } else if (editingProject) {
      setProjects(projects.map((p) => (p.id === editingProject.id ? { ...projectData, id: editingProject.id } : p)))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Planning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "On Hold":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "High":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "Medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          {/* <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Project Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics & Reports
            </TabsTrigger>
          </TabsList> */}

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Total Projects
                  </CardTitle>
                  <FolderOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{projects.length}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Active projects</p>
                </CardContent>
              </Card>

              {/* <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {projects.filter((p) => p.status === "Completed").length}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Projects finished</p>
                </CardContent>
              </Card> */}

              {/* <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {projects.filter((p) => p.status === "In Progress").length}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Active development</p>
                </CardContent>
              </Card> */}

              {/* <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Critical Priority
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {projects.filter((p) => p.priority === "Critical").length}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Urgent attention</p>
                </CardContent>
              </Card> */}
            </div>

            {/* Projects Grid */}
            {/* <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Project Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                            {project.name}
                          </CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                            {project.description}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleManageRequirements(project)}>
                              <List className="mr-2 h-4 w-4" />
                              Manage Requirements
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteProject(project)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={`text-xs px-2 py-1 ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                        <Badge className={`text-xs px-2 py-1 ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600 dark:text-slate-400">Progress</span>
                            <span className="font-medium text-slate-900 dark:text-slate-100">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Requirements</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {project.completedRequirements}/{project.requirements}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Due Date</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{project.dueDate}</span>
                        </div>

                        <Button variant="outline" className="w-full mt-4 bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div> */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Project Overview</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card
                    key={project._id}
                    className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {project.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {project.desc}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={`text-xs px-2 py-1 ${getPriorityColor(project.priority)}`}>
                          {project.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <img
                          src={project.img}
                          alt={project.name}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                          {project.bigDesc}
                        </p>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Due Date</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {new Date(project.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <Button onClick={() => { gotoParticularProject(project._id) }} variant="outline" className="w-full mt-4 bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard projects={projects} />
          </TabsContent>
        </Tabs>
      </main>

      {/* <ProjectForm
        open={showProjectForm}
        onOpenChange={setShowProjectForm}
        project={editingProject}
        onSubmit={handleSubmitProject}
        mode={formMode}
      /> */}

      {selectedProject && (
        <RequirementsManager
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          open={showRequirementsManager}
          onOpenChange={setShowRequirementsManager}
          onRequirementsUpdate={handleRequirementsUpdate}
        />
      )}

      <AlertDialog open={!!deleteProject} onOpenChange={() => setDeleteProject(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project "{deleteProject?.name}" and all of
              its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
