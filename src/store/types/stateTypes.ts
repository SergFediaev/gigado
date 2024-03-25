import {STRINGS} from '../../strings/strings'

export type StateType = {
    lists: ItemType[]
    tasks: TasksType
    selectedItemOption: ItemOptionType
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

export type ItemOptionType =
    typeof STRINGS.LIST
    | typeof STRINGS.COUNTER
    | typeof STRINGS.NOTE
    | typeof STRINGS.PICTURE
    | typeof STRINGS.PLAYLIST