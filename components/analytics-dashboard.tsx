"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Clock, CheckCircle, AlertTriangle } from "lucide-react"

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

interface AnalyticsDashboardProps {
  projects: Project[]
}

export function AnalyticsDashboard({ projects }: AnalyticsDashboardProps) {
  // Calculate analytics data
  const totalProjects = projects.length
  const completedProjects = projects.filter((p) => p.status === "Completed").length
  const inProgressProjects = projects.filter((p) => p.status === "In Progress").length
  const blockedProjects = projects.filter((p) => p.status === "Blocked").length
  const planningProjects = projects.filter((p) => p.status === "Planning").length

  const totalRequirements = projects.reduce((sum, p) => sum + p.requirements, 0)
  const completedRequirements = projects.reduce((sum, p) => sum + p.completedRequirements, 0)
  const overallProgress = totalRequirements > 0 ? Math.round((completedRequirements / totalRequirements) * 100) : 0

  // Priority distribution
  const priorityData = [
    { name: "Critical", value: projects.filter((p) => p.priority === "Critical").length, color: "#ef4444" },
    { name: "High", value: projects.filter((p) => p.priority === "High").length, color: "#f97316" },
    { name: "Medium", value: projects.filter((p) => p.priority === "Medium").length, color: "#3b82f6" },
    { name: "Low", value: projects.filter((p) => p.priority === "Low").length, color: "#6b7280" },
  ]

  // Status distribution
  const statusData = [
    { name: "Completed", value: completedProjects, color: "#10b981" },
    { name: "In Progress", value: inProgressProjects, color: "#3b82f6" },
    { name: "Planning", value: planningProjects, color: "#f59e0b" },
    { name: "Blocked", value: blockedProjects, color: "#ef4444" },
  ]

  // Progress by project for bar chart
  const progressData = projects.map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
    progress: p.progress,
    requirements: p.requirements,
    completed: p.completedRequirements,
  }))

  // Timeline data (mock data for demonstration)
  const timelineData = [
    { month: "Jan", completed: 2, started: 3 },
    { month: "Feb", completed: 1, started: 2 },
    { month: "Mar", completed: 3, started: 4 },
    { month: "Apr", completed: 2, started: 1 },
    { month: "May", completed: 4, started: 2 },
    { month: "Jun", completed: 1, started: 3 },
  ]

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <p className="text-xs text-blue-200">
              {completedRequirements} of {totalRequirements} requirements
            </p>
            <Progress value={overallProgress} className="mt-2 bg-blue-400" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
            </div>
            <p className="text-xs text-green-200">
              {completedProjects} of {totalProjects} projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-orange-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressProjects}</div>
            <p className="text-xs text-orange-200">Currently in development</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-100">Critical Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.filter((p) => p.priority === "Critical").length}</div>
            <p className="text-xs text-red-200">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress Overview</CardTitle>
            <CardDescription>Progress percentage by project</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "progress" ? `${value}%` : value,
                    name === "progress" ? "Progress" : name === "completed" ? "Completed" : "Total Requirements",
                  ]}
                />
                <Bar dataKey="progress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
            <CardDescription>Current status of all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Projects by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{item.value} projects</span>
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        backgroundColor: `${item.color}20`,
                        color: item.color,
                        border: `1px solid ${item.color}40`,
                      }}
                    >
                      {totalProjects > 0 ? Math.round((item.value / totalProjects) * 100) : 0}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timeline Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
            <CardDescription>Projects completed vs started over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
                <Line type="monotone" dataKey="started" stroke="#3b82f6" strokeWidth={2} name="Started" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Project Breakdown</CardTitle>
          <CardDescription>Comprehensive view of all project metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Project</th>
                  <th className="text-left p-2 font-medium">Status</th>
                  <th className="text-left p-2 font-medium">Priority</th>
                  <th className="text-left p-2 font-medium">Progress</th>
                  <th className="text-left p-2 font-medium">Requirements</th>
                  <th className="text-left p-2 font-medium">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{project.name}</div>
                        <div className="text-xs text-muted-foreground">{project.description}</div>
                      </div>
                    </td>
                    <td className="p-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          project.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : project.status === "In Progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                              : project.status === "Planning"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          project.priority === "Critical"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : project.priority === "High"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                              : project.priority === "Medium"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                        }`}
                      >
                        {project.priority}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="flex-1 h-2" />
                        <span className="text-xs font-medium w-10">{project.progress}%</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-xs">
                        {project.completedRequirements}/{project.requirements}
                      </span>
                    </td>
                    <td className="p-2 text-xs">{project.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
