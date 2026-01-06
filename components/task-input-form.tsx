"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Task } from "@/lib/types"

interface TaskInputFormProps {
  onGenerateTasks: (tasks: Task[]) => void
  currentTaskCount: number
}

export function TaskInputForm({ onGenerateTasks, currentTaskCount }: TaskInputFormProps) {
  const [numTasks, setNumTasks] = useState<string>(currentTaskCount.toString())

  const handleGenerate = () => {
    const count = Math.max(1, Math.min(20, Number.parseInt(numTasks) || 1))
    const tasks: Task[] = []

    for (let i = 1; i <= count; i++) {
      tasks.push({
        id: `P${i}`,
        arrivalTime: Math.floor(Math.random() * 10),
        burstTime: Math.floor(Math.random() * 8) + 1,
        priority: Math.floor(Math.random() * 5),
      })
    }

    onGenerateTasks(tasks)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Number of Tasks</h3>
      <div className="flex gap-2">
        <Input
          type="number"
          min="1"
          max="20"
          value={numTasks}
          onChange={(e) => setNumTasks(e.target.value)}
          className="text-sm"
        />
        <Button onClick={handleGenerate} className="bg-primary hover:bg-primary/90">
          Generate
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Generate random tasks for testing (1-20)</p>
    </div>
  )
}
