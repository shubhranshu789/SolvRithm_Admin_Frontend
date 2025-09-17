"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Upload, Calendar, AlertCircle } from "lucide-react"

import Navbar from "../../Components/Navbar/page"

interface ProjectFormData {
  name: string
  img: string
  desc: string
  bigDesc: string
  googleForm: string
  priority: string
  dueDate?: string
}

interface UploadProjectFormProps {
  onSuccess?: (project: any) => void
  apiEndpoint?: string
}

export default function UploadProjectForm({ onSuccess, apiEndpoint = `https://solvrithm-admin-backend.onrender.com/projects` }: UploadProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<ProjectFormData>({
    defaultValues: {
      name: "",
      img: "",
      desc: "",
      bigDesc: "",
      priority: "",
      dueDate: "",
      googleForm : ""
    },
  })

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          ...data,
          dueDate: data.dueDate || undefined, // Convert empty string to undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create project")
      }

      const result = await response.json()

      // Reset form on success
      form.reset()

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result.project)
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <div>
      <Navbar/>
      <Card style={{marginTop : "20px"}} className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="size-5" />
            Upload New Project
          </CardTitle>
          <CardDescription>
            Fill in the details below to create a new project. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Project Name */}
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Project name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image URL */}
              <FormField
                control={form.control}
                name="img"
                rules={{
                  required: "Image URL is required",
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Please enter a valid URL",
                  },
                }}
                render={({ field }) => (
                  // <FormItem>
                  //   <FormLabel>Image URL *</FormLabel>
                  //   <FormControl>
                  //     <Input placeholder="https://res.cloudinary.com/..." {...field} />
                  //   </FormControl>
                  //   <FormDescription>Cloudinary URL or any valid image URL</FormDescription>
                  //   <FormMessage />
                  // </FormItem>

                  <FormItem>
                    <FormLabel>Upload Image *</FormLabel>
                    <FormControl>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const data = new FormData();
                            data.append("file", file);
                            data.append("upload_preset", "Solvrithm");
                            data.append("cloud_name", "dls0mpbjp");

                            try {
                              const res = await fetch(
                                "https://api.cloudinary.com/v1_1/dls0mpbjp/image/upload",
                                { method: "POST", body: data }
                              );

                              const uploadResult = await res.json();
                              if (uploadResult.secure_url) {
                                // ✅ set Cloudinary URL into react-hook-form state
                                form.setValue("img", uploadResult.secure_url, {
                                  shouldValidate: true,
                                });
                                console.log("Image uploaded successfully!");
                              } else {
                                console.log("Image upload failed!");
                              }
                            } catch (err) {
                              console.log("Error uploading image");
                              console.error(err);
                            }
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

                )}
              />

              {/* Short Description */}
              <FormField
                control={form.control}
                name="desc"
                rules={{ required: "Short description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description *</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief project description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Detailed Description */}
              <FormField
                control={form.control}
                name="bigDesc"
                rules={{ required: "Detailed description is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a comprehensive description of the project..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              {/* GoogleForm */}
              <FormField
                control={form.control}
                name="googleForm"
                rules={{ required: "GoogleForm" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Form *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a comprehensive description of the project..."
                        className="min-h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                rules={{ required: "Priority is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      Due Date (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>Leave empty if no specific deadline</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Display */}
              {submitError && (
                <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertCircle className="size-4" />
                  {submitError}
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Project..." : "Create Project"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>

  )
}
