import type { Metrics } from "@/lib/types"

interface MetricsDisplayProps {
  metrics: Metrics
  waitingTimes: Record<string, number>
  turnaroundTimes: Record<string, number>
  completionTimes: Record<string, number>
}

export function MetricsDisplay({ metrics, waitingTimes, turnaroundTimes, completionTimes }: MetricsDisplayProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Performance Metrics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground">Average Waiting Time</p>
          <p className="text-2xl font-bold text-primary mt-1">{metrics.avgWaitingTime.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground">Average Turnaround Time</p>
          <p className="text-2xl font-bold text-accent mt-1">{metrics.avgTurnaroundTime.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border border-chart-3/30 rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground">Avg Completion Time</p>
          <p className="text-2xl font-bold text-chart-3 mt-1">{metrics.avgCompletionTime.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border border-chart-4/30 rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground">Max Waiting Time</p>
          <p className="text-2xl font-bold text-chart-4 mt-1">{metrics.maxWaitingTime.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-foreground">Task Details</h4>
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-xs">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-foreground">Task</th>
                <th className="px-3 py-2 text-left font-semibold text-foreground">Waiting</th>
                <th className="px-3 py-2 text-left font-semibold text-foreground">Turnaround</th>
                <th className="px-3 py-2 text-left font-semibold text-foreground">Completion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.entries(waitingTimes)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([taskId, waitTime]) => (
                  <tr key={taskId} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-3 py-2 font-medium text-foreground">{taskId}</td>
                    <td className="px-3 py-2 text-muted-foreground">{waitTime.toFixed(2)}</td>
                    <td className="px-3 py-2 text-muted-foreground">{turnaroundTimes[taskId]?.toFixed(2) || "0.00"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{completionTimes[taskId]?.toFixed(2) || "0.00"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
