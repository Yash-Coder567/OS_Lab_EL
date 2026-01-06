"use client"

import { AlgorithmType } from "@/lib/types"

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType
  onChange: (algorithm: AlgorithmType) => void
  onTimeQuantumChange?: (quantum: number) => void
  timeQuantum?: number
}

const ALGORITHMS = [
  { value: AlgorithmType.FCFS, label: "FCFS", description: "First Come First Served" },
  { value: AlgorithmType.SJF, label: "SJF", description: "Shortest Job First" },
  { value: AlgorithmType.PRIORITY, label: "Priority", description: "Non-Preemptive" },
  { value: AlgorithmType.RR, label: "Round Robin", description: "Time Quantum Based", hasQuantum: true },
  { value: AlgorithmType.SRTF, label: "SRTF", description: "Shortest Remaining" },
  {
    value: AlgorithmType.PREEMPTIVE_PRIORITY,
    label: "Preempt. Priority",
    description: "Preemptive Based",
  },
]

export function AlgorithmSelector({
  selectedAlgorithm,
  onChange,
  onTimeQuantumChange,
  timeQuantum = 2,
}: AlgorithmSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-1">Scheduling Algorithm</h3>
        <p className="text-xs text-muted-foreground">Select an algorithm to simulate</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {ALGORITHMS.map((algo) => (
          <button
            key={algo.value}
            onClick={() => onChange(algo.value)}
            className={`text-left p-3 rounded-lg border-2 transition-all duration-200 ${
              selectedAlgorithm === algo.value
                ? "border-primary bg-primary/15 shadow-lg shadow-primary/20"
                : "border-border/50 bg-secondary/30 hover:bg-secondary/50 hover:border-border"
            }`}
          >
            <div className="font-semibold text-sm text-foreground">{algo.label}</div>
            <div className="text-xs text-muted-foreground">{algo.description}</div>
          </button>
        ))}
      </div>

      {selectedAlgorithm === AlgorithmType.RR && onTimeQuantumChange && (
        <div className="space-y-3 p-4 bg-primary/10 rounded-lg border border-primary/30">
          <div>
            <label className="text-sm font-semibold text-foreground">
              Time Quantum: <span className="text-primary font-bold text-base">{timeQuantum}</span>
            </label>
            <p className="text-xs text-muted-foreground mt-1">Slice size for Round Robin scheduling</p>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={timeQuantum}
            onChange={(e) => onTimeQuantumChange(Number(e.target.value))}
            className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>10</span>
          </div>
        </div>
      )}
    </div>
  )
}
