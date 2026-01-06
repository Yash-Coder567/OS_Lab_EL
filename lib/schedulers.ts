import { type Task, type ScheduleEvent, type ScheduleResult, AlgorithmType } from "./types"

export function scheduleWithFCFS(tasks: Task[]): ScheduleResult {
  const sortedTasks = [...tasks].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const events: ScheduleEvent[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}
  const completionTimes: Record<string, number> = {}

  let currentTime = 0

  for (const task of sortedTasks) {
    const startTime = Math.max(currentTime, task.arrivalTime)
    const endTime = startTime + task.burstTime

    events.push({
      taskId: task.id,
      startTime,
      endTime,
      taskName: task.id,
    })

    waitingTimes[task.id] = startTime - task.arrivalTime
    completionTimes[task.id] = endTime
    turnaroundTimes[task.id] = endTime - task.arrivalTime
    currentTime = endTime
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / tasks.length
  const avgTurnaroundTime = Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / tasks.length

  return {
    events,
    waitingTimes,
    turnaroundTimes,
    completionTimes,
    avgWaitingTime,
    avgTurnaroundTime,
  }
}

export function scheduleWithSJF(tasks: Task[]): ScheduleResult {
  const availableTasks = [...tasks]
  const events: ScheduleEvent[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}
  const completionTimes: Record<string, number> = {}

  let currentTime = 0

  while (availableTasks.length > 0) {
    const readyTasks = availableTasks.filter((t) => t.arrivalTime <= currentTime)

    if (readyTasks.length === 0) {
      const nextArrival = availableTasks[0].arrivalTime
      currentTime = nextArrival
      continue
    }

    const shortestTask = readyTasks.reduce((prev, curr) => (prev.burstTime < curr.burstTime ? prev : curr))

    const startTime = currentTime
    const endTime = startTime + shortestTask.burstTime

    events.push({
      taskId: shortestTask.id,
      startTime,
      endTime,
      taskName: shortestTask.id,
    })

    waitingTimes[shortestTask.id] = startTime - shortestTask.arrivalTime
    completionTimes[shortestTask.id] = endTime
    turnaroundTimes[shortestTask.id] = endTime - shortestTask.arrivalTime

    availableTasks.splice(availableTasks.indexOf(shortestTask), 1)
    currentTime = endTime
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / tasks.length
  const avgTurnaroundTime = Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / tasks.length

  return {
    events,
    waitingTimes,
    turnaroundTimes,
    completionTimes,
    avgWaitingTime,
    avgTurnaroundTime,
  }
}

export function scheduleWithPriority(tasks: Task[]): ScheduleResult {
  const availableTasks = [...tasks].map((t) => ({ ...t, priority: t.priority || 0 }))
  const events: ScheduleEvent[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}
  const completionTimes: Record<string, number> = {}

  let currentTime = 0

  while (availableTasks.length > 0) {
    const readyTasks = availableTasks.filter((t) => t.arrivalTime <= currentTime)

    if (readyTasks.length === 0) {
      const nextArrival = availableTasks[0].arrivalTime
      currentTime = nextArrival
      continue
    }

    const highestPriority = readyTasks.reduce((prev, curr) => (prev.priority! > curr.priority! ? prev : curr))

    const startTime = currentTime
    const endTime = startTime + highestPriority.burstTime

    events.push({
      taskId: highestPriority.id,
      startTime,
      endTime,
      taskName: highestPriority.id,
    })

    waitingTimes[highestPriority.id] = startTime - highestPriority.arrivalTime
    completionTimes[highestPriority.id] = endTime
    turnaroundTimes[highestPriority.id] = endTime - highestPriority.arrivalTime

    availableTasks.splice(availableTasks.indexOf(highestPriority), 1)
    currentTime = endTime
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / tasks.length
  const avgTurnaroundTime = Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / tasks.length

  return {
    events,
    waitingTimes,
    turnaroundTimes,
    completionTimes,
    avgWaitingTime,
    avgTurnaroundTime,
  }
}

export function scheduleWithRoundRobin(tasks: Task[], timeQuantum: number): ScheduleResult {
  const taskQueue = [...tasks].sort((a, b) => a.arrivalTime - b.arrivalTime)
  const events: ScheduleEvent[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}
  const completionTimes: Record<string, number> = {}

  const remainingBurst: Record<string, number> = {}
  taskQueue.forEach((t) => {
    remainingBurst[t.id] = t.burstTime
  })

  let currentTime = 0
  const queue: Task[] = []
  let taskIndex = 0

  while (taskIndex < taskQueue.length || queue.length > 0) {
    while (taskIndex < taskQueue.length && taskQueue[taskIndex].arrivalTime <= currentTime) {
      queue.push(taskQueue[taskIndex])
      taskIndex++
    }

    if (queue.length === 0) {
      currentTime = taskQueue[taskIndex].arrivalTime
      queue.push(taskQueue[taskIndex])
      taskIndex++
      continue
    }

    const task = queue.shift()!
    const burst = Math.min(remainingBurst[task.id], timeQuantum)
    const startTime = currentTime
    const endTime = startTime + burst

    events.push({
      taskId: task.id,
      startTime,
      endTime,
      taskName: task.id,
    })

    remainingBurst[task.id] -= burst
    currentTime = endTime

    while (taskIndex < taskQueue.length && taskQueue[taskIndex].arrivalTime <= currentTime) {
      queue.push(taskQueue[taskIndex])
      taskIndex++
    }

    if (remainingBurst[task.id] > 0) {
      queue.push(task)
    } else {
      completionTimes[task.id] = endTime
      turnaroundTimes[task.id] = endTime - task.arrivalTime
      waitingTimes[task.id] = turnaroundTimes[task.id] - task.burstTime
    }
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / tasks.length
  const avgTurnaroundTime = Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / tasks.length

  return {
    events,
    waitingTimes,
    turnaroundTimes,
    completionTimes,
    avgWaitingTime,
    avgTurnaroundTime,
  }
}

export function scheduleWithSRTF(tasks: Task[]): ScheduleResult {
  const taskList = [...tasks]
  const events: ScheduleEvent[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}
  const completionTimes: Record<string, number> = {}

  const remainingBurst: Record<string, number> = {}
  taskList.forEach((t) => {
    remainingBurst[t.id] = t.burstTime
  })

  let currentTime = 0
  let completedCount = 0
  let lastScheduledTask: string | null = null

  while (completedCount < taskList.length) {
    const readyTasks = taskList.filter((t) => t.arrivalTime <= currentTime && remainingBurst[t.id] > 0)

    if (readyTasks.length === 0) {
      const nextArrival = taskList.find((t) => t.arrivalTime > currentTime && remainingBurst[t.id] > 0)?.arrivalTime
      currentTime = nextArrival || currentTime + 1
      continue
    }

    const shortestTask = readyTasks.reduce((prev, curr) =>
      remainingBurst[prev.id] < remainingBurst[curr.id] ? prev : curr,
    )

    const startTime = currentTime
    const endTime = startTime + 1

    if (lastScheduledTask !== shortestTask.id && lastScheduledTask !== null) {
      if (events.length > 0 && events[events.length - 1].taskId === shortestTask.id) {
        events[events.length - 1].endTime = endTime
      } else {
        events.push({
          taskId: shortestTask.id,
          startTime,
          endTime,
          taskName: shortestTask.id,
        })
      }
    } else {
      if (events.length > 0 && events[events.length - 1].taskId === shortestTask.id) {
        events[events.length - 1].endTime = endTime
      } else {
        events.push({
          taskId: shortestTask.id,
          startTime,
          endTime,
          taskName: shortestTask.id,
        })
      }
    }

    remainingBurst[shortestTask.id]--
    lastScheduledTask = shortestTask.id

    if (remainingBurst[shortestTask.id] === 0) {
      completionTimes[shortestTask.id] = endTime
      turnaroundTimes[shortestTask.id] = endTime - shortestTask.arrivalTime
      waitingTimes[shortestTask.id] = turnaroundTimes[shortestTask.id] - shortestTask.burstTime
      completedCount++
    }

    currentTime = endTime
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / tasks.length
  const avgTurnaroundTime = Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / tasks.length

  return {
    events,
    waitingTimes,
    turnaroundTimes,
    completionTimes,
    avgWaitingTime,
    avgTurnaroundTime,
  }
}

export function scheduleWithPreemptivePriority(tasks: Task[]): ScheduleResult {
  const taskList = [...tasks]
  const events: ScheduleEvent[] = []
  const waitingTimes: Record<string, number> = {}
  const turnaroundTimes: Record<string, number> = {}
  const completionTimes: Record<string, number> = {}

  const remainingBurst: Record<string, number> = {}
  taskList.forEach((t) => {
    remainingBurst[t.id] = t.burstTime
  })

  let currentTime = 0
  let completedCount = 0
  let lastScheduledTask: string | null = null

  while (completedCount < taskList.length) {
    const readyTasks = taskList.filter((t) => t.arrivalTime <= currentTime && remainingBurst[t.id] > 0)

    if (readyTasks.length === 0) {
      const nextArrival = taskList.find((t) => t.arrivalTime > currentTime && remainingBurst[t.id] > 0)?.arrivalTime
      currentTime = nextArrival || currentTime + 1
      continue
    }

    const highestPriority = readyTasks.reduce((prev, curr) =>
      (prev.priority || 0) > (curr.priority || 0) ? prev : curr,
    )

    const startTime = currentTime
    const endTime = startTime + 1

    if (lastScheduledTask !== highestPriority.id && lastScheduledTask !== null) {
      if (events.length > 0 && events[events.length - 1].taskId === highestPriority.id) {
        events[events.length - 1].endTime = endTime
      } else {
        events.push({
          taskId: highestPriority.id,
          startTime,
          endTime,
          taskName: highestPriority.id,
        })
      }
    } else {
      if (events.length > 0 && events[events.length - 1].taskId === highestPriority.id) {
        events[events.length - 1].endTime = endTime
      } else {
        events.push({
          taskId: highestPriority.id,
          startTime,
          endTime,
          taskName: highestPriority.id,
        })
      }
    }

    remainingBurst[highestPriority.id]--
    lastScheduledTask = highestPriority.id

    if (remainingBurst[highestPriority.id] === 0) {
      completionTimes[highestPriority.id] = endTime
      turnaroundTimes[highestPriority.id] = endTime - highestPriority.arrivalTime
      waitingTimes[highestPriority.id] = turnaroundTimes[highestPriority.id] - highestPriority.burstTime
      completedCount++
    }

    currentTime = endTime
  }

  const avgWaitingTime = Object.values(waitingTimes).reduce((a, b) => a + b, 0) / tasks.length
  const avgTurnaroundTime = Object.values(turnaroundTimes).reduce((a, b) => a + b, 0) / tasks.length

  return {
    events,
    waitingTimes,
    turnaroundTimes,
    completionTimes,
    avgWaitingTime,
    avgTurnaroundTime,
  }
}

export function runScheduler(algorithm: AlgorithmType, tasks: Task[], timeQuantum?: number): ScheduleResult {
  switch (algorithm) {
    case AlgorithmType.FCFS:
      return scheduleWithFCFS(tasks)
    case AlgorithmType.SJF:
      return scheduleWithSJF(tasks)
    case AlgorithmType.PRIORITY:
      return scheduleWithPriority(tasks)
    case AlgorithmType.RR:
      return scheduleWithRoundRobin(tasks, timeQuantum || 2)
    case AlgorithmType.SRTF:
      return scheduleWithSRTF(tasks)
    case AlgorithmType.PREEMPTIVE_PRIORITY:
      return scheduleWithPreemptivePriority(tasks)
    default:
      return scheduleWithFCFS(tasks)
  }
}
