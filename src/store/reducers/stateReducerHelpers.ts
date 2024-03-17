import {CounterType, ItemType, ListType, TasksType, TaskType} from '../types/stateTypes'

export const isListType = (item: ItemType): boolean => (item as ListType).isPinned !== undefined

export const isCounterType = (item: ItemType): boolean => (item as CounterType).currentCount !== undefined

export const addNewTask = (tasks: TaskType[], index: number, task: TaskType): TaskType[] => {
    const tasksCopy = [...tasks]
    tasksCopy.splice(index, 0, task)
    return tasksCopy
}

export const isTasksCompleted = (tasks: TaskType[]): boolean => {
    if (tasks.length === 0) return false
    return tasks.every(task => task.isDone)
}

export const isAnyListSelected = (lists: ListType[]): boolean => lists.some(list => isListType(list) && (list as ListType).isSelected)

export const sortCompletedLists = (lists: ListType[]): ListType[] => lists.sort((listA, listB) => listA.isDone === listB.isDone ? 0 : listA.isDone ? 1 : -1)

export const sortPinnedLists = (lists: ListType[]): ListType[] => lists.sort((listA, listB) => listA.isPinned === listB.isPinned ? 0 : listA.isPinned ? -1 : 1)

export const completedListsCount = (lists: ListType[]) => lists.filter(list => (list as ListType).isDone).length

export const pinnedListsCount = (lists: ListType[]) => lists.filter(list => (list as ListType).isPinned).length

export const countersCount = (counters: CounterType[]) => counters.reduce((count, counter) => {
    if (isCounterType(counter)) count++
    return count
}, 0)

export const listsCount = (lists: ListType[]) => lists.reduce((count, list) => {
    if (isListType(list)) count++
    return count
}, 0)

export const selectedListsCount = (lists: ListType[]) => lists.reduce((count, list) => {
    if (isListType(list) && (list as ListType).isSelected) count++
    return count
}, 0)

export const tasksCount = (tasks: TasksType) => Object.values(tasks).reduce((count, tasks) => count + tasks.length, 0)

export const completedTasksCount = (tasks: TasksType) => Object.values(tasks).reduce((count, tasks) => {
    tasks.forEach(task => {
        if (task.isDone) count++
    })

    return count
}, 0)

export const isListsHaveTask = (tasks: TasksType): boolean => Object.values(tasks).some(tasks => tasks.length > 0)

export const isCountersHaveCount = (counters: ItemType[]): boolean => counters.some(counter => isCounterType(counter) && (counter as CounterType).currentCount !== (counter as CounterType).initialCount)