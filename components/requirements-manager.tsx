"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, Trash2, CheckCircle, Clock, AlertTriangle, Circle, MoreHorizontal } from "lucide-react"
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

interface Requirement {
  id: number
  title: string
  description: string
  status: "Not Started" | "In Progress" | "Completed" | "Blocked"
  priority: "Low" | "Medium" | "High" | "Critical"
  assignee?: string
  estimatedHours?: number
  actualHours?: number
}

interface RequirementsManagerProps {
  projectId: number
  projectName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onRequirementsUpdate: (projectId: number, requirements: Requirement[]) => void
}

export function RequirementsManager({
  projectId,
  projectName,
  open,
  onOpenChange,
  onRequirementsUpdate,
}: RequirementsManagerProps) {
  const [requirements, setRequirements] = useState<Requirement[]>([
    {
      id: 1,
      title: "User Authentication System",
      description: "Implement secure login and registration functionality",
      status: "Completed",
      priority: "Critical",
      assignee: "John Doe",
      estimatedHours: 40,
      actualHours: 35,
    },
    {
      id: 2,
      title: "Product Catalog",
      description: "Create product listing and search functionality",
      status: "In Progress",
      priority: "High",
      assignee: "Jane Smith",
      estimatedHours: 60,
      actualHours: 25,
    },
    {
      id: 3,
      title: "Payment Integration",
      description: "Integrate Stripe payment processing",
      status: "Not Started",
      priority: "High",
      estimatedHours: 30,
    },
    {
      id: 4,
      title: "Admin Dashboard",
      description: "Build administrative interface for managing products",
      status: "Blocked",
      priority: "Medium",
      assignee: "Mike Johnson",
      estimatedHours: 50,
      actualHours: 10,
    },
  ])

  const [showRequirementForm, setShowRequirementForm] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState<Requirement | undefined>()
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [deleteRequirement, setDeleteRequirement] = useState<Requirement | undefined>()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Not Started" as const,
    priority: "Medium" as const,
    assignee: "",
    estimatedHours: 0,
    actualHours: 0,
  })

  const handleCreateRequirement = () => {
    setEditingRequirement(undefined)
    setFormMode("create")
    setFormData({
      title: "",
      description: "",
      status: "Not Started",
      priority: "Medium",
      assignee: "",
      estimatedHours: 0,
      actualHours: 0,
    })
    setShowRequirementForm(true)
  }

  const handleEditRequirement = (requirement: Requirement) => {
    setEditingRequirement(requirement)
    setFormMode("edit")
    setFormData({
      title: requirement.title,
      description: requirement.description,
      status: requirement.status,
      priority: requirement.priority,
      assignee: requirement.assignee || "",
      estimatedHours: requirement.estimatedHours || 0,
      actualHours: requirement.actualHours || 0,
    })
    setShowRequirementForm(true)
  }

  const handleSubmitRequirement = (e: React.FormEvent) => {
    e.preventDefault()
    const newRequirement: Requirement = {
      ...formData,
      id: formMode === "create" ? Math.max(...requirements.map((r) => r.id), 0) + 1 : editingRequirement!.id,
      assignee: formData.assignee || undefined,
      estimatedHours: formData.estimatedHours || undefined,
      actualHours: formData.actualHours || undefined,
    }

    if (formMode === "create") {
      const updatedRequirements = [...requirements, newRequirement]
      setRequirements(updatedRequirements)
      onRequirementsUpdate(projectId, updatedRequirements)
    } else {
      const updatedRequirements = requirements.map((r) => (r.id === editingRequirement!.id ? newRequirement : r))
      setRequirements(updatedRequirements)
      onRequirementsUpdate(projectId, updatedRequirements)
    }

    setShowRequirementForm(false)
  }

  const confirmDeleteRequirement = () => {
    if (deleteRequirement) {
      const updatedRequirements = requirements.filter((r) => r.id !== deleteRequirement.id)
      setRequirements(updatedRequirements)
      onRequirementsUpdate(projectId, updatedRequirements)
      setDeleteRequirement(undefined)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "In Progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "Blocked":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
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

  const completedRequirements = requirements.filter((r) => r.status === "Completed").length
  const totalRequirements = requirements.length
  const progressPercentage = totalRequirements > 0 ? Math.round((completedRequirements / totalRequirements) * 100) : 0

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Requirements - {projectName}</DialogTitle>
            <DialogDescription>Manage and track individual requirements for this project.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-medium">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-600">
                        {requirements.filter((r) => r.status === "Not Started").length}
                      </div>
                      <div className="text-xs text-gray-500">Not Started</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {requirements.filter((r) => r.status === "In Progress").length}
                      </div>
                      <div className="text-xs text-gray-500">In Progress</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {requirements.filter((r) => r.status === "Completed").length}
                      </div>
                      <div className="text-xs text-gray-500">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {requirements.filter((r) => r.status === "Blocked").length}
                      </div>
                      <div className="text-xs text-gray-500">Blocked</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add New Requirement Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Requirements List</h3>
              <Button onClick={handleCreateRequirement}>
                <Plus className="w-4 h-4 mr-2" />
                Add Requirement
              </Button>
            </div>

            {/* Requirements List */}
            <div className="space-y-4">
              {requirements.map((requirement) => (
                <Card key={requirement.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(requirement.status)}
                          <CardTitle className="text-base">{requirement.title}</CardTitle>
                        </div>
                        <CardDescription className="text-sm">{requirement.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditRequirement(requirement)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteRequirement(requirement)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getStatusColor(requirement.status)}`}>{requirement.status}</Badge>
                        <Badge className={`text-xs ${getPriorityColor(requirement.priority)}`}>
                          {requirement.priority}
                        </Badge>
                      </div>
                      {requirement.assignee && (
                        <div className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Assignee:</span> {requirement.assignee}
                        </div>
                      )}
                      {requirement.estimatedHours && (
                        <div className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Est:</span> {requirement.estimatedHours}h
                        </div>
                      )}
                      {requirement.actualHours && (
                        <div className="text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Actual:</span> {requirement.actualHours}h
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Requirement Form Dialog */}
      <Dialog open={showRequirementForm} onOpenChange={setShowRequirementForm}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? "Add New Requirement" : "Edit Requirement"}</DialogTitle>
            <DialogDescription>
              {formMode === "create"
                ? "Create a new requirement for this project."
                : "Update the requirement details below."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRequirement}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter requirement title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter requirement description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignee">Assignee (Optional)</Label>
                <Input
                  id="assignee"
                  value={formData.assignee}
                  onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                  placeholder="Enter assignee name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    min="0"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="actualHours">Actual Hours</Label>
                  <Input
                    id="actualHours"
                    type="number"
                    min="0"
                    value={formData.actualHours}
                    onChange={(e) => setFormData({ ...formData, actualHours: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowRequirementForm(false)}>
                Cancel
              </Button>
              <Button type="submit">{formMode === "create" ? "Create Requirement" : "Update Requirement"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRequirement} onOpenChange={() => setDeleteRequirement(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the requirement "{deleteRequirement?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRequirement} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
