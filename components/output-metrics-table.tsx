"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { runScheduler } from "@/lib/schedulers"
import type { AlgorithmType, Task } from "@/lib/types"

interface OutputMetricsTableProps {
  tasks: Task[]
  algorithm: AlgorithmType
  timeQuantum: number
}

export function OutputMetricsTable({ tasks, algorithm, timeQuantum }: OutputMetricsTableProps) {
  const result = useMemo(() => {
    if (tasks.length === 0) return null
    return runScheduler(algorithm, tasks, timeQuantum)
  }, [tasks, algorithm, timeQuantum])

  if (!result || tasks.length === 0) {
    return null
  }

  return (
    <Card className="p-6 border border-border shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-white to-orange-50/20">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-foreground mb-1">Performance Metrics & Results</h2>
        <p className="text-xs text-muted-foreground">Detailed analysis of scheduling algorithm performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Avg Waiting Time"
          value={result.avgWaitingTime.toFixed(2)}
          unit="units"
          color="from-blue-50 to-blue-100 border-blue-200"
          accentColor="text-blue-600"
        />
        <MetricCard
          label="Avg Turnaround Time"
          value={result.avgTurnaroundTime.toFixed(2)}
          unit="units"
          color="from-purple-50 to-purple-100 border-purple-200"
          accentColor="text-purple-600"
        />
        <MetricCard
          label="Total Time"
          value={Math.max(...Object.values(result.completionTimes)).toFixed(2)}
          unit="units"
          color="from-teal-50 to-teal-100 border-teal-200"
          accentColor="text-teal-600"
        />
        <MetricCard
          label="Completed Tasks"
          value={tasks.length.toString()}
          unit="tasks"
          color="from-orange-50 to-orange-100 border-orange-200"
          accentColor="text-orange-600"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Task-wise Details</h3>
        <div className="overflow-x-auto border border-border rounded-lg bg-gradient-to-br from-white to-cyan-50/20 shadow-sm">
          <table className="w-full text-xs">
            <thead className="bg-gradient-to-r from-blue-100 via-purple-100 to-teal-100 border-b border-border sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Task</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Arrival</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Burst</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Completion</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Turnaround</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Waiting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.keys(result.waitingTimes)
                .sort((a, b) => a.localeCompare(b))
                .map((taskId) => (
                  <tr
                    key={taskId}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-foreground">{taskId}</td>
                    <td className="px-4 py-3 text-muted-foreground font-medium">
                      {tasks.find((t) => t.id === taskId)?.arrivalTime || 0}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-medium">
                      {tasks.find((t) => t.id === taskId)?.burstTime || 0}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-medium">
                      {result.completionTimes[taskId]?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-medium">
                      {(result.turnaroundTimes[taskId] || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-medium">
                      {result.waitingTimes[taskId]?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}

function MetricCard({
  label,
  value,
  unit,
  color,
  accentColor,
}: {
  label: string
  value: string
  unit: string
  color: string
  accentColor: string
}) {
  return (
    <div className={`bg-gradient-to-br ${color} border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`}>
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      <div className={`flex items-baseline gap-2 ${accentColor}`}>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs opacity-75">{unit}</p>
      </div>
    </div>
  )
}
