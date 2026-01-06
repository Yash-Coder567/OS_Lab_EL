"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlgorithmSelector } from "@/components/algorithm-selector"
import { TaskEditor } from "@/components/task-editor"
import { SingleGanttChart } from "@/components/single-gantt-chart"
import { OutputMetricsTable } from "@/components/output-metrics-table"
import { AlgorithmType, type Task } from "@/lib/types"
import { Zap } from "lucide-react"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>(AlgorithmType.FCFS)
  const [timeQuantum, setTimeQuantum] = useState(2)

  const handleAddTask = useCallback(() => {
    const newTaskId = `P${tasks.length + 1}`
    const newTask: Task = {
      id: newTaskId,
      arrivalTime: 0,
      burstTime: 1,
      priority: 0,
    }
    setTasks([...tasks, newTask])
  }, [tasks])

  const handleTasksChange = useCallback((newTasks: Task[]) => {
    setTasks(newTasks)
  }, [])

  const handleClearAll = useCallback(() => {
    setTasks([])
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="border-b border-border bg-gradient-to-r from-card via-blue-50 to-purple-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-primary/90 via-purple-500/80 to-accent/80 rounded-lg shadow-md">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">CPU Scheduler</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Visualize and analyze CPU scheduling algorithms with real-time adjustments
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Algorithm Selector - Primary Column */}
          <Card className="lg:col-span-1 p-6 border border-border shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-white to-blue-50/30">
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onChange={setSelectedAlgorithm}
              onTimeQuantumChange={setTimeQuantum}
              timeQuantum={timeQuantum}
            />
          </Card>

          {/* Task Management Panel */}
          <Card className="lg:col-span-2 p-6 border border-border shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-white to-teal-50/20">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">Task Management</h3>
                <p className="text-xs text-muted-foreground">Create and configure tasks for simulation</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAddTask}
                  className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground font-medium shadow-sm hover:shadow-md transition-all"
                >
                  + Add Task
                </Button>
                {tasks.length > 0 && (
                  <Button
                    onClick={handleClearAll}
                    variant="outline"
                    className="flex-1 border-destructive/30 hover:bg-destructive/5 hover:border-destructive/50 bg-transparent text-destructive hover:text-destructive"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="text-xs text-muted-foreground bg-gradient-to-r from-accent/10 to-cyan-100/40 border border-border rounded-lg p-3 font-medium">
                {tasks.length === 0 ? (
                  <span>No tasks added yet. Click "Add Task" to get started.</span>
                ) : (
                  <span>
                    {tasks.length} task{tasks.length !== 1 ? "s" : ""} configured
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Task Editor Section */}
        <div>
          <TaskEditor tasks={tasks} onTasksChange={handleTasksChange} onAddTask={handleAddTask} />
        </div>

        {/* Gantt Chart and Results - Only show when tasks exist */}
        {tasks.length > 0 && (
          <div className="space-y-6">
            <SingleGanttChart tasks={tasks} algorithm={selectedAlgorithm} timeQuantum={timeQuantum} />

            <OutputMetricsTable tasks={tasks} algorithm={selectedAlgorithm} timeQuantum={timeQuantum} />
          </div>
        )}
      </div>
    </main>
  )
}
