"use client"

import { useMemo } from "react"
import type { ScheduleEvent } from "@/lib/types"

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
]

interface TimelineVisualizationProps {
  events: ScheduleEvent[]
}

export function TimelineVisualization({ events }: TimelineVisualizationProps) {
  const { maxTime, taskMap, colors } = useMemo(() => {
    const max = events.length > 0 ? Math.max(...events.map((e) => e.endTime)) : 10
    const tasks = new Map<string, ScheduleEvent[]>()
    const colorMap = new Map<string, string>()

    let colorIndex = 0
    events.forEach((event) => {
      if (!tasks.has(event.taskId)) {
        tasks.set(event.taskId, [])
        colorMap.set(event.taskId, COLORS[colorIndex % COLORS.length])
        colorIndex++
      }
      tasks.get(event.taskId)?.push(event)
    })

    return { maxTime: max, taskMap: tasks, colors: colorMap }
  }, [events])

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg border border-dashed border-border">
        <p className="text-muted-foreground">Run a scheduler to see the timeline</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">CPU Timeline</h3>
      <div className="space-y-3 border border-border rounded-lg p-4 bg-card">
        {Array.from(taskMap.entries()).map(([taskId, taskEvents]) => (
          <div key={taskId} className="space-y-2">
            <p className="text-xs font-medium text-foreground">{taskId}</p>
            <div className="flex items-center h-8 bg-secondary/50 rounded relative overflow-hidden border border-border">
              {taskEvents.map((event, idx) => {
                const startPercent = (event.startTime / maxTime) * 100
                const widthPercent = ((event.endTime - event.startTime) / maxTime) * 100
                const color = colors.get(event.taskId)

                return (
                  <div
                    key={`${taskId}-${idx}`}
                    className="absolute h-full flex items-center justify-center text-xs font-bold text-white border border-white/20 transition-all duration-200 hover:opacity-80"
                    style={{
                      left: `${startPercent}%`,
                      width: `${widthPercent}%`,
                      backgroundColor: color,
                      minWidth: "40px",
                    }}
                    title={`${event.taskName}: ${event.startTime}-${event.endTime}`}
                  >
                    {widthPercent > 8 && <span>{event.startTime}</span>}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>0</span>
              <span>{maxTime}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Timeline Info</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                Total Time: <span className="font-medium text-foreground">{maxTime}</span>
              </li>
              <li>
                Total Tasks: <span className="font-medium text-foreground">{taskMap.size}</span>
              </li>
              <li>
                Total Events: <span className="font-medium text-foreground">{events.length}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
