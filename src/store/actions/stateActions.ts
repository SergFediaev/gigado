import {TaskType} from '../types/stateTypes'
import {ACTIONS} from '../../strings/actions'

export const deleteList = (listId: string) => ({
    type: ACTIONS.DELETE_LIST,
    payload: {
        listId,
    },
} as const)

export const deleteTask = (listId: string, taskId: string) => ({
    type: ACTIONS.DELETE_TASK,
    payload: {
        listId,
        taskId,
    },
} as const)

export const updateTask = (listId: string, taskId: string, isDone: boolean) => ({
    type: ACTIONS.UPDATE_TASK,
    payload: {
        listId,
        taskId,
        isDone,
    },
} as const)

export const changeTaskName = (listId: string, taskId: string, name: string) => ({
    type: ACTIONS.CHANGE_TASK_NAME,
    payload: {
        listId,
        taskId,
        name,
    },
} as const)

export const moveTaskVertical = (listId: string, taskId: string, moveDown: boolean) => ({
    type: ACTIONS.MOVE_TASK_VERTICAL,
    payload: {
        listId,
        taskId,
        moveDown,
    },
} as const)

export const moveTaskHorizontal = (listId: string, taskId: string, moveRight: boolean) => ({
    type: ACTIONS.MOVE_TASK_HORIZONTAL,
    payload: {
        listId,
        taskId,
        moveRight,
    },
} as const)

export const pinList = (listId: string, isPinned: boolean) => ({
    type: ACTIONS.PIN_LIST,
    payload: {
        listId,
        isPinned,
    },
} as const)

export const completeList = (listId: string, isDone: boolean) => ({
    type: ACTIONS.COMPLETE_LIST,
    payload: {
        listId,
        isDone,
    },
} as const)

export const moveList = (listId: string, moveLeft: boolean) => ({
    type: ACTIONS.MOVE_LIST,
    payload: {
        listId,
        moveLeft,
    },
} as const)

export const splitList = (listId: string) => ({
    type: ACTIONS.SPLIT_LIST,
    payload: {
        listId,
    },
} as const)

export const mergeLists = (listId: string) => ({
    type: ACTIONS.MERGE_LISTS,
    payload: {
        listId,
    },
} as const)

export const addTask = (listId: string, taskName: string) => ({
    type: ACTIONS.ADD_TASK,
    payload: {
        listId,
        taskName,
    },
} as const)

export const changeListName = (listId: string, name: string) => ({
    type: ACTIONS.CHANGE_LIST_NAME,
    payload: {
        listId,
        name,
    },
} as const)

export const addList = (newTasks?: TaskType[], inputListName?: string) => ({
    type: ACTIONS.ADD_LIST,
    payload: {
        newTasks,
        inputListName,
    },
} as const)

export const selectList = (listId: string, isSelected: boolean) => ({
    type: ACTIONS.SELECT_LIST,
    payload: {
        listId,
        isSelected,
    },
} as const)

export const setListsSelection = (isSelected: boolean) => ({
    type: ACTIONS.SET_LISTS_SELECTION,
    payload: {
        isSelected,
    },
} as const)

export const deleteSelectedLists = () => ({
    type: ACTIONS.DELETE_SELECTED_LISTS,
} as const)

export const clearList = (listId: string) => ({
    type: ACTIONS.CLEAR_LIST,
    payload: {
        listId,
    },
} as const)

export const addCounter = (inputCounterName?: string) => ({
    type: ACTIONS.ADD_COUNTER,
    payload: {
        inputCounterName,
    },
} as const)

export const setCount = (counterId: string, count: number) => ({
    type: ACTIONS.SET_COUNT,
    payload: {
        counterId,
        count,
    },
} as const)

export const deleteAllItems = () => ({
    type: ACTIONS.DELETE_ALL_ITEMS,
} as const)

export const deleteAllLists = () => ({
    type: ACTIONS.DELETE_ALL_LISTS,
} as const)

export const deleteAllCounters = () => ({
    type: ACTIONS.DELETE_ALL_COUNTERS,
} as const)

export const clearAllLists = () => ({
    type: ACTIONS.CLEAR_ALL_LISTS,
} as const)

export const clearSelectedLists = () => ({
    type: ACTIONS.CLEAR_SELECTED_LISTS,
} as const)

export const resetAllCounters = () => ({
    type: ACTIONS.RESET_ALL_COUNTERS,
} as const)

export const addMockedLists = () => ({
    type: ACTIONS.ADD_MOCKED_LISTS,
} as const)