"use client"
import { Card } from "@/components/ui/card"
import type { Task } from "@/lib/types"
import { Trash2 } from "lucide-react"

interface TaskEditorProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
  onAddTask: () => void
}

export function TaskEditor({ tasks, onTasksChange, onAddTask }: TaskEditorProps) {
  const handleTaskChange = (index: number, field: keyof Task, value: number | string) => {
    const newTasks = [...tasks]
    if (field === "arrivalTime" || field === "burstTime" || field === "priority") {
      newTasks[index] = { ...newTasks[index], [field]: Math.max(0, Number(value)) }
    } else {
      newTasks[index] = { ...newTasks[index], [field]: value }
    }
    onTasksChange(newTasks)
  }

  const handleDeleteTask = (index: number) => {
    onTasksChange(tasks.filter((_, i) => i !== index))
  }

  return (
    <Card className="p-6 border border-border shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-white to-green-50/20">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-semibold text-foreground">Task Configuration</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Edit task parameters - Arrival Time, Burst Time, and Priority
          </p>
        </div>
        {tasks.length > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {tasks.length}
            </div>
            <div className="text-xs text-muted-foreground">tasks</div>
          </div>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg bg-gradient-to-br from-blue-50/40 to-purple-50/40">
          <p className="text-muted-foreground text-sm font-medium">No tasks added yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add a task to begin configuring your simulation</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-gradient-to-br from-white to-blue-50/20">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-blue-100 to-purple-100 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Task ID</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Arrival Time</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Burst Time</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Priority</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map((task, idx) => (
                <tr
                  key={task.id}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-foreground">{task.id}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={task.arrivalTime}
                      onChange={(e) => handleTaskChange(idx, "arrivalTime", e.target.value)}
                      className="w-20 px-3 py-2 rounded border border-border bg-input text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      value={task.burstTime}
                      onChange={(e) => handleTaskChange(idx, "burstTime", e.target.value)}
                      className="w-20 px-3 py-2 rounded border border-border bg-input text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={task.priority}
                      onChange={(e) => handleTaskChange(idx, "priority", e.target.value)}
                      className="w-20 px-3 py-2 rounded border border-border bg-input text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDeleteTask(idx)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-destructive/10 text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
