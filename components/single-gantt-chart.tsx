"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { runScheduler } from "@/lib/schedulers"
import type { AlgorithmType, Task } from "@/lib/types"

const TASK_COLORS = [
  "#5b7cfa",
  "#f06292",
  "#00c9a7",
  "#ff9500",
  "#7c3aed",
  "#00d4ff",
  "#ff3838",
  "#ffa502",
  "#13c2c2",
  "#52c41a",
  "#f5222d",
  "#1890ff",
]

interface SingleGanttChartProps {
  tasks: Task[]
  algorithm: AlgorithmType
  timeQuantum: number
}

export function SingleGanttChart({ tasks, algorithm, timeQuantum }: SingleGanttChartProps) {
  const result = useMemo(() => {
    if (tasks.length === 0) return null
    return runScheduler(algorithm, tasks, timeQuantum)
  }, [tasks, algorithm, timeQuantum])

  if (!result || tasks.length === 0) {
    return null
  }

  const maxTime = Math.max(...result.events.map((e) => e.endTime))

  return (
    <Card className="p-6 border border-border shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-white to-violet-50/30">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground mb-1">{algorithm} - Gantt Chart</h2>
        <p className="text-xs text-muted-foreground">Visual representation of task execution timeline</p>
      </div>

      <div className="space-y-4">
        {/* Main Gantt Bar */}
        <div className="relative w-full h-20 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-lg border border-border overflow-hidden shadow-sm">
          {result.events.map((event, idx) => {
            const taskIndex = tasks.findIndex((t) => t.id === event.taskId)
            const taskColor = TASK_COLORS[taskIndex % TASK_COLORS.length]
            const startPercent = (event.startTime / maxTime) * 100
            const widthPercent = ((event.endTime - event.startTime) / maxTime) * 100

            return (
              <div
                key={`${algorithm}-${idx}`}
                className="absolute h-full flex items-center justify-center text-sm font-bold text-white rounded-sm transition-all duration-200 hover:shadow-lg hover:scale-y-110 cursor-pointer"
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`,
                  backgroundColor: taskColor,
                  minWidth: "40px",
                  filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15))",
                }}
                title={`${event.taskId}: ${event.startTime}-${event.endTime}`}
              >
                {widthPercent > 12 && <span className="drop-shadow-lg">{event.taskId}</span>}
              </div>
            )
          })}
        </div>

        {/* Time Axis */}
        <div className="flex justify-between text-xs text-muted-foreground px-2 font-semibold">
          <span>0</span>
          {[...Array(4)].map((_, i) => (
            <span key={i}>{Math.round((maxTime / 4) * (i + 1))}</span>
          ))}
          <span>{maxTime}</span>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-xs font-semibold text-foreground mb-4">Task Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-border hover:from-blue-100 hover:to-purple-100 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                style={{ backgroundColor: TASK_COLORS[idx % TASK_COLORS.length] }}
              />
              <span className="text-xs font-medium text-foreground">{task.id}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
