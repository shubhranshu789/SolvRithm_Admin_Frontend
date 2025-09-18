"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Mail, User, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";

import Navbar from "../../Components/Navbar/page"

interface Student {
  studentId: string;
  name: string;
  email: string;
  uniRoll: string;
  members: string[];
  githubLink: string;
}

export default function ProjectStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`https://solvrithm-admin-backend.onrender.com/project/${projectId}/students`);
        const data = await res.json();
        setProjectName(data.projectName);
        setStudents(data.students);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [projectId]);

  if (loading) return <p className="text-center text-lg font-semibold">Loading students...</p>;

  return (
    <div>
        <Navbar/>
        <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-3xl font-bold text-center mb-6">{projectName} – Students</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {students.map((s, idx) => (
            <Card key={idx} className="shadow-lg hover:shadow-2xl transition duration-300 rounded-2xl border border-gray-200">
                <CardHeader className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.name}`} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{s.name}</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="flex items-center gap-2 text-gray-700"><Mail size={18} /> {s.email}</p>
                <p className="flex items-center gap-2 text-gray-700"><Users size={18} /> Roll: {s.uniRoll}</p>

                {s.members.length > 0 && (
                    <div className="mt-2">
                    <p className="text-sm font-semibold">Team Members:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        {s.members.map((m, i) => <li key={i}>{m}</li>)}
                    </ul>
                    </div>
                )}

                <div className="mt-3">
                    {s.githubLink !== "Not submitted" ? (
                    <a 
                        href={s.githubLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <Github size={20} /> GitHub Repo
                    </a>
                    ) : (
                    <p className="text-red-500 font-semibold">❌ GitHub not submitted</p>
                    )}
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        </div>
    </div>

  );
}
