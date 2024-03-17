export type StateType = {
    lists: ItemType[]
    tasks: TasksType
}

export type ItemType = ListType | CounterType

export type ListType = {
    id: string
    name: string
    isSelected: boolean
    isPinned: boolean
    isDone: boolean
}

export type CounterType = {
    id: string
    name: string
    initialCount: number
    currentCount: number
    limitCount: number
    isDone: boolean
}

export type TasksType = {
    [listId: string]: TaskType[]
}

export type TaskType = {
    id: string
    listId: string
    name: string
    isSelected: boolean
    isDone: boolean
}