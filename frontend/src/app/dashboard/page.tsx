// frontend\src\app\dashboard\page.tsx
"use client"

import type React from "react"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Trash2, CheckCircle, Circle, LogOut, Pencil, Check, X, User } from 'lucide-react';
import { ThemeToggle } from "@/components/theme-toggle"

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token")
    const email = localStorage.getItem("user_email")
    if (!token) {
      router.push("/login")
      return
    }
    if (email) setUserEmail(email)
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks/")
      setTasks(response.data)
    } catch (error) {
      console.error("Failed to fetch tasks", error)
      if ((error as any).response?.status === 401) {
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      const response = await api.post("/tasks/", { title: newTitle })
      setTasks([...tasks, response.data])
      setNewTitle("")
    } catch (error) {
      console.error("Failed to add task", error)
    }
  }

  const toggleTask = async (task: Task) => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed"
      const response = await api.put(`/tasks/${task.id}`, { status: newStatus })
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)))
    } catch (error) {
      console.error("Failed to toggle task", error)
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
  };

  const updateTaskTitle = async (id: number) => {
    if (!editTitle.trim()) return;
    try {
      const response = await api.put(`/tasks/${id}`, { title: editTitle });
      setTasks(tasks.map(t => t.id === id ? response.data : t));
      setEditingTaskId(null);
    } catch (error) {
      console.error('Failed to update task title', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user_email")
    router.push("/login")
  }

  const completedCount = tasks.filter((t) => t.status === "completed").length
  const pendingCount = tasks.filter((t) => t.status === "pending").length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">TaskFlow</h1>
                <p className="text-xs text-muted-foreground">Organize your day</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{userEmail}</span>
              </div>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Circle className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-card-foreground">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-card-foreground">Add New Task</h2>
          <form onSubmit={addTask} className="flex gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-primary/25"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </form>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-card-foreground">Your Tasks</h2>
          </div>

          {tasks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg mb-2">No tasks yet</p>
              <p className="text-sm text-muted-foreground">Add your first task above to get started!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-4 hover:bg-black transition">
                  <div className="flex items-center gap-3 flex-1">
                    <button onClick={() => toggleTask(task)} className="text-gray-400 hover:text-blue-500 transition shrink-0">
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
                        autoFocus
                      />
                    ) : (
                      <span className={task.status === 'completed' ? 'line-through text-gray-400' : 'text-white-900 font-medium'}>
                        {task.title}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {editingTaskId === task.id ? (
                      <>
                        <button 
                          onClick={() => updateTaskTitle(task.id)}
                          className="text-green-600 hover:text-green-700 transition"
                          title="Save"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={cancelEditing}
                          className="text-gray-400 hover:text-gray-600 transition"
                          title="Cancel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEditing(task)}
                          className="text-gray-400 hover:text-blue-500 transition"
                          title="Edit"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-400 hover:text-red-500 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
