// // frontend\src\app\dashboard\page.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/api';
// import { Plus, Trash2, CheckCircle, Circle, LogOut, Pencil, Check, X } from 'lucide-react';
// import { useSession, signOut } from "@/lib/auth-client";

// import axios from 'axios';

// interface Task {
//   id: number;
//   title: string;
//   description: string | null;
//   status: string;
// }

// export default function DashboardPage() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [newTitle, setNewTitle] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
//   const [editTitle, setEditTitle] = useState('');
//   const router = useRouter();
  
//   const { data: session, isPending } = useSession();

//   useEffect(() => {
//     if (!isPending && !session) {
//       router.push('/login');
//       return;
//     }
//     if (session) {
//       fetchTasks();
//     }
//   }, [session, isPending]);

//   const fetchTasks = async () => {
//     try {
//       // Manually attaching the session token for the cross-port request
//       const response = await api.get('/tasks/', {
//           headers: {
//               Authorization: `Bearer ${session?.session.token}`
//           }
//       });
//       setTasks(response.data);
//     } catch (error) {
//       console.error('Failed to fetch tasks', error);
//       if ((error as any).response?.status === 401) {
//         router.push('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addTask = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newTitle.trim() || !session) return;

//     try {
//       const response = await api.post('/tasks/', { title: newTitle }, {
//           headers: {
//               Authorization: `Bearer ${session.session.token}`
//           }
//       });
//       setTasks([...tasks, response.data]);
//       setNewTitle('');
//     } catch (error) {
//       console.error('Failed to add task', error);
//     }
//   };

//   const toggleTask = async (task: Task) => {
//     if (!session) return;
//     try {
//       const newStatus = task.status === 'completed' ? 'pending' : 'completed';
//       const response = await api.put(`/tasks/${task.id}`, { status: newStatus }, {
//           headers: {
//               Authorization: `Bearer ${session.session.token}`
//           }
//       });
//       setTasks(tasks.map(t => t.id === task.id ? response.data : t));
//     } catch (error) {
//       console.error('Failed to toggle task', error);
//     }
//   };

//   const updateTaskTitle = async (id: number) => {
//     if (!editTitle.trim() || !session) return;
//     try {
//       const response = await api.put(`/tasks/${id}`, { title: editTitle }, {
//           headers: {
//               Authorization: `Bearer ${session.session.token}`
//           }
//       });
//       setTasks(tasks.map(t => t.id === id ? response.data : t));
//       setEditingTaskId(null);
//     } catch (error) {
//       console.error('Failed to update task title', error);
//     }
//   };

//   const deleteTask = async (id: number) => {
//     if (!session) return;
//     try {
//       await api.delete(`/tasks/${id}`, {
//           headers: {
//               Authorization: `Bearer ${session.session.token}`
//           }
//       });
//       setTasks(tasks.filter(t => t.id !== id));
//     } catch (error) {
//       console.error('Failed to delete task', error);
//     }
//   };

//   const startEditing = (task: Task) => {
//     setEditingTaskId(task.id);
//     setEditTitle(task.title);
//   };

//   const cancelEditing = () => {
//     setEditingTaskId(null);
//     setEditTitle('');
//   };

//   const handleLogout = async () => {
//     await signOut({
//         fetchOptions: {
//             onSuccess: () => {
//                 router.push("/login");
//             }
//         }
//     });
//   };

//   if (isPending || loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
//       <div className="max-w-2xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
//             {session && <p className="text-sm text-gray-500">Logged in as {session.user.email}</p>}
//           </div>
//           <button 
//             onClick={handleLogout}
//             className="flex items-center text-gray-600 hover:text-red-600 transition"
//           >
//             <LogOut className="w-5 h-5 mr-1" />
//             Logout
//           </button>
//         </div>

//         <form onSubmit={addTask} className="flex gap-2 mb-8">
//           <input
//             type="text"
//             value={newTitle}
//             onChange={(e) => setNewTitle(e.target.value)}
//             placeholder="Add a new task..."
//             className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
//           >
//             <Plus className="w-6 h-6" />
//           </button>
//         </form>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {tasks.length === 0 ? (
//             <div className="p-8 text-center text-gray-500">
//               No tasks yet. Add your first one above!
//             </div>
//           ) : (
//             <ul className="divide-y divide-gray-200">
//               {tasks.map((task) => (
//                 <li key={task.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
//                   <div className="flex items-center gap-3 flex-1">
//                     <button onClick={() => toggleTask(task)} className="text-gray-400 hover:text-blue-500 transition shrink-0">
//                       {task.status === 'completed' ? (
//                         <CheckCircle className="w-6 h-6 text-green-500" />
//                       ) : (
//                         <Circle className="w-6 h-6" />
//                       )}
//                     </button>
//                     {editingTaskId === task.id ? (
//                       <input
//                         type="text"
//                         value={editTitle}
//                         onChange={(e) => setEditTitle(e.target.value)}
//                         className="flex-1 border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
//                         autoFocus
//                       />
//                     ) : (
//                       <span className={task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900 font-medium'}>
//                         {task.title}
//                       </span>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2 shrink-0">
//                     {editingTaskId === task.id ? (
//                       <>
//                         <button 
//                           onClick={() => updateTaskTitle(task.id)}
//                           className="text-green-600 hover:text-green-700 transition"
//                           title="Save"
//                         >
//                           <Check className="w-5 h-5" />
//                         </button>
//                         <button 
//                           onClick={cancelEditing}
//                           className="text-gray-400 hover:text-gray-600 transition"
//                           title="Cancel"
//                         >
//                           <X className="w-5 h-5" />
//                         </button>
//                       </>
//                     ) : (
//                       <>
//                         <button 
//                           onClick={() => startEditing(task)}
//                           className="text-gray-400 hover:text-blue-500 transition"
//                           title="Edit"
//                         >
//                           <Pencil className="w-5 h-5" />
//                         </button>
//                         <button 
//                           onClick={() => deleteTask(task.id)}
//                           className="text-gray-400 hover:text-red-500 transition"
//                           title="Delete"
//                         >
//                           <Trash2 className="w-5 h-5" />
//                         </button>
//                       </>
//                     )}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


























// frontend/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Plus, Trash2, CheckCircle, Circle, LogOut, Pencil, Check, X, Loader2 } from 'lucide-react';
import { useSession, signOut } from "@/lib/auth-client";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: string;
}

export default function DashboardPage() {
  // State Management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Editing State
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Auth Hooks
  const { data: session, isPending } = useSession();
  const router = useRouter();

  // API Configuration
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  // --- 1. Fetch Logic ---
  const fetchTasks = async () => {
    if (!session?.session?.token) return;

    try {
      const response = await axios.get(`${API_URL}/tasks/`, {
        headers: {
          Authorization: `Bearer ${session.session.token}`
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
         router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Auth & Initial Load Effect ---
  useEffect(() => {
    if (!isPending) {
        if (session?.session?.token) {
            fetchTasks();
        } else {
            router.push('/login');
        }
    }
  }, [session, isPending]);


  // --- 3. CRUD Operations ---

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !session?.session?.token) return;

    try {
      const response = await axios.post(`${API_URL}/tasks/`, 
        { title: newTitle }, 
        {
          headers: { Authorization: `Bearer ${session.session.token}` }
        }
      );
      setTasks([...tasks, response.data]);
      setNewTitle('');
    } catch (error) {
      console.error('Failed to add task', error);
    }
  };

  const toggleTask = async (task: Task) => {
    if (!session?.session?.token) return;

    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const response = await axios.put(`${API_URL}/tasks/${task.id}`, 
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${session.session.token}` }
        }
      );
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error) {
      console.error('Failed to toggle task', error);
    }
  };

  const updateTaskTitle = async (id: number) => {
    if (!editTitle.trim() || !session?.session?.token) return;

    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, 
        { title: editTitle },
        {
          headers: { Authorization: `Bearer ${session.session.token}` }
        }
      );
      setTasks(tasks.map(t => t.id === id ? response.data : t));
      setEditingTaskId(null);
    } catch (error) {
      console.error('Failed to update task title', error);
    }
  };

  const deleteTask = async (id: number) => {
    if (!session?.session?.token) return;

    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${session.session.token}` }
      });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  // --- 4. Helper Functions ---

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditTitle('');
  };

  const handleLogout = async () => {
    await signOut({
        fetchOptions: {
            onSuccess: () => {
                router.push("/login");
            }
        }
    });
  };

  // --- 5. Render UI ---

  if (isPending || isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-gray-500">Loading your tasks...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            {session && <p className="text-sm text-gray-500 mt-1">Welcome back, {session.user.name}</p>}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center text-gray-600 hover:text-red-600 transition bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-gray-900 bg-white"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="bg-blue-600 disabled:bg-blue-300 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </button>
        </form>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {tasks.length === 0 ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                 <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No tasks yet</p>
              <p className="text-sm">Add a task above to get started!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition group">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Toggle Button */}
                    <button 
                        onClick={() => toggleTask(task)} 
                        className="text-gray-400 hover:text-blue-600 transition shrink-0 focus:outline-none"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>

                    {/* Task Title / Edit Input */}
                    {editingTaskId === task.id ? (
                      <form 
                        onSubmit={(e) => { e.preventDefault(); updateTaskTitle(task.id); }} 
                        className="flex-1 flex gap-2"
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          autoFocus
                        />
                      </form>
                    ) : (
                      <span 
                        className={`text-lg ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900'}`}
                      >
                        {task.title}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {editingTaskId === task.id ? (
                      <>
                        <button 
                          onClick={() => updateTaskTitle(task.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Save"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={cancelEditing}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition"
                          title="Cancel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEditing(task)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
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
      </div>
    </div>
  );
}