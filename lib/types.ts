export enum AlgorithmType {
  FCFS = "FCFS",
  SJF = "SJF",
  PRIORITY = "PRIORITY",
  RR = "RR",
  SRTF = "SRTF",
  PREEMPTIVE_PRIORITY = "PREEMPTIVE_PRIORITY",
}

export interface Task {
  id: string
  arrivalTime: number
  burstTime: number
  priority?: number
  originalBurstTime?: number
}

export interface ScheduleEvent {
  taskId: string
  startTime: number
  endTime: number
  taskName: string
}

export interface ScheduleResult {
  events: ScheduleEvent[]
  waitingTimes: Record<string, number>
  turnaroundTimes: Record<string, number>
  completionTimes: Record<string, number>
  avgWaitingTime: number
  avgTurnaroundTime: number
}

export interface Metrics {
  avgWaitingTime: number
  avgTurnaroundTime: number
  avgCompletionTime: number
  maxWaitingTime: number
  minWaitingTime: number
}
