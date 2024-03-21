import {v1} from 'uuid'
import {StateActionType} from '../types/stateActionTypes'
import {
    addNewTask,
    isCounterType,
    isListType,
    isTasksCompleted,
    sortCompletedLists,
    sortPinnedLists,
} from './stateReducerHelpers'
import {CounterType, ItemType, ListType, StateType, TasksType, TaskType} from '../types/stateTypes'
import {ERRORS} from '../../strings/errors'
import {ACTIONS} from '../../strings/actions'
import {getMockedData} from '../mockedData'
import {settings} from '../settings'

export const stateReducer = (state: StateType, action: StateActionType): StateType => {
    const {type, payload} = action
    switch (type) {

        case ACTIONS.DELETE_LIST: {
            const {listId} = payload
            const stateCopy: StateType = {
                ...state,
                lists: state.lists.filter(list => list.id !== listId),
            }

            delete stateCopy.tasks[listId]
            return stateCopy
        }

        case ACTIONS.DELETE_TASK: {
            const {listId, taskId} = payload
            const stateCopy: StateType = {
                ...state,
                tasks: {...state.tasks, [listId]: state.tasks[listId].filter(task => task.id !== taskId)},
            }

            const isDone = isTasksCompleted(stateCopy.tasks[listId])

            const updatedState: StateType = {
                ...stateCopy, lists: state.lists.map(list => list.id === listId ? {
                    ...list, isDone, isPinned: isDone ? false : (list as ListType).isPinned,
                } as ListType : list),
            }

            if (isDone) sortCompletedLists(stateCopy.lists as ListType[])
            return updatedState
        }

        case ACTIONS.UPDATE_TASK: {
            const {listId, taskId, isDone} = payload
            const stateCopy: StateType = {
                ...state, tasks: {
                    ...state.tasks,
                    [listId]: state.tasks[listId].map(task => task.id === taskId ? {...task, isDone} : task),
                },
            }

            const isListDone = isTasksCompleted(stateCopy.tasks[listId])

            const updatedState: StateType = {
                ...stateCopy, lists: state.lists.map(list => list.id === listId ? {
                    ...list,
                    isDone: isListDone,
                    isPinned: isListDone ? false : (list as ListType).isPinned,
                } as ListType : list),
            }

            if (isListDone) sortCompletedLists(updatedState.lists as ListType[])
            return updatedState
        }

        case ACTIONS.CHANGE_TASK_NAME: {
            const {listId, taskId, name} = payload
            return {
                ...state, tasks: {
                    ...state.tasks,
                    [listId]: state.tasks[listId].map(task => task.id === taskId ? {...task, name} : task),
                },
            } as StateType
        }

        case ACTIONS.MOVE_TASK_VERTICAL: {
            const {listId, taskId, moveDown} = payload
            const stateCopy: StateType = {...state, tasks: {...state.tasks, [listId]: [...state.tasks[listId]]}}
            const updatedTasks: TaskType[] = stateCopy.tasks[listId]
            const taskIndex = updatedTasks.findIndex(task => task.id === taskId)

            for (let iteration = 0; iteration < updatedTasks.length; iteration++) {
                if (iteration === taskIndex) {
                    let swapIndex

                    if (moveDown) {
                        swapIndex = taskIndex + 1
                        if (swapIndex === updatedTasks.length) swapIndex = 0
                    } else {
                        swapIndex = taskIndex - 1
                        if (swapIndex < 0) swapIndex = updatedTasks.length - 1
                    }

                    const swapTask = updatedTasks[swapIndex]
                    updatedTasks[swapIndex] = updatedTasks[iteration]
                    updatedTasks[iteration] = swapTask
                    break
                }
            }

            return stateCopy
        }

        case ACTIONS.MOVE_TASK_HORIZONTAL: {
            const {listId, taskId, moveRight} = payload
            const listIndex = state.lists.findIndex(list => list.id === listId)
            const taskIndex = state.tasks[listId].findIndex(task => task.id === taskId)
            const swapTask: TaskType = state.tasks[listId][taskIndex]
            let swapIndex

            debugger

            if (moveRight) {
                swapIndex = listIndex + 1
                if (swapIndex === state.lists.length) swapIndex = 0

                if (!isListType(state.lists[swapIndex])) {
                    for (let iteration = swapIndex + 1; iteration < state.lists.length; iteration++) {
                        if (isListType(state.lists[iteration])) {
                            swapIndex = iteration
                            break
                        }
                    }

                    if (!isListType(state.lists[swapIndex])) break
                }
            } else {
                swapIndex = listIndex - 1
                if (swapIndex < 0) swapIndex = state.lists.length - 1

                if (!isListType(state.lists[swapIndex])) {
                    for (let iteration = swapIndex - 1; iteration >= 0; iteration--) {
                        if (isListType(state.lists[iteration])) {
                            swapIndex = iteration
                            break
                        }
                    }

                    if (!isListType(state.lists[swapIndex])) break
                }
            }

            const swapListId = state.lists[swapIndex].id

            const stateCopy: StateType = {
                ...state, tasks: {
                    ...state.tasks,
                    [listId]: state.tasks[listId].filter(task => task.id !== taskId),
                    [swapListId]: state.tasks[swapListId][taskIndex] ? addNewTask(state.tasks[swapListId], taskIndex, swapTask) : [...state.tasks[swapListId], swapTask],
                },
            }

            return {
                ...stateCopy, lists: state.lists.map(list => list.id === listId || list.id === swapListId ? {
                    ...list,
                    isDone: isTasksCompleted(stateCopy.tasks[list.id]),
                    isPinned: isTasksCompleted(stateCopy.tasks[list.id]) ? false : (list as ListType).isPinned,
                } as ListType : list),
            } as StateType
        }

        case ACTIONS.PIN_LIST: {
            const {listId, isPinned} = payload
            const stateCopy: StateType = {
                ...state, lists: state.lists.map(list => list.id === listId ? {
                    ...list,
                    isPinned,
                    isDone: isPinned ? false : (list as ListType).isDone,
                    isSelected: (list as ListType).isSelected ? false : (list as ListType).isSelected,
                } as ListType : list),
            }

            sortPinnedLists(stateCopy.lists as ListType[])

            if (isPinned && state.lists.find(list => list.id === listId)?.isDone) return {
                ...stateCopy, tasks: {
                    ...stateCopy.tasks,
                    [listId]: stateCopy.tasks[listId].map(task => task.isDone ? {...task, isDone: false} : task),
                },
            } as StateType
            else return stateCopy
        }

        case ACTIONS.COMPLETE_LIST: {
            const {listId, isDone} = payload
            const updatedLists: StateType = {
                ...state, lists: state.lists.map(list => list.id === listId ? {
                    ...list,
                    isDone,
                    isPinned: isDone ? false : (list as ListType).isPinned,
                    isSelected: (list as ListType).isSelected ? false : (list as ListType).isSelected,
                } as ListType : list),
            }

            sortCompletedLists(updatedLists.lists as ListType[])

            return {
                ...updatedLists,
                tasks: {
                    ...updatedLists.tasks,
                    [listId]: updatedLists.tasks[listId].map(task => task.isDone === isDone ? task : {...task, isDone}),
                },
            } as StateType
        }

        case ACTIONS.MOVE_LIST: {
            const {listId, moveLeft} = payload

            const stateCopy: StateType = {
                ...state, lists: [...state.lists,
                ],
            }

            const listIndex = stateCopy.lists.findIndex(list => list.id === listId)

            for (let iteration = 0; iteration < stateCopy.lists.length; iteration++) {
                if (iteration === listIndex) {
                    let swapIndex

                    if (moveLeft) {
                        swapIndex = listIndex - 1
                        if (swapIndex < 0) swapIndex = stateCopy.lists.length - 1
                    } else {
                        swapIndex = listIndex + 1
                        if (swapIndex === stateCopy.lists.length) swapIndex = 0
                    }

                    const swapList: ItemType = stateCopy.lists[swapIndex]
                    stateCopy.lists[swapIndex] = stateCopy.lists[iteration]
                    stateCopy.lists[iteration] = swapList
                    break
                }
            }

            return stateCopy
        }

        case ACTIONS.SPLIT_LIST: {
            const {listId} = payload
            const half = state.tasks[listId].length / 2
            if (half < 1) break

            const oldTasks: TaskType[] = []
            const newTasks: TaskType[] = []

            for (let iteration = 0; iteration < state.tasks[listId].length; iteration++) {
                if (iteration < half) oldTasks.push(state.tasks[listId][iteration])
                if (iteration >= half) newTasks.push(state.tasks[listId][iteration])
            }

            const newListId = v1()

            const newList: ListType = {
                id: newListId,
                name: 'Splitted to-do list #' + state.lists.length,
                isDone: isTasksCompleted(newTasks),
                isPinned: false,
                isSelected: false,
            }

            const stateCopy: StateType = {
                ...state, lists: [newList, ...state.lists.map(list => list.id === listId ? {
                    ...list,
                    isSelected: (list as ListType).isSelected ? false : (list as ListType).isSelected,
                    isDone: isTasksCompleted(oldTasks),
                } as ListType : list)],
            }

            sortPinnedLists(stateCopy.lists as ListType[])
            sortCompletedLists(stateCopy.lists as ListType[])

            return {
                ...stateCopy,
                tasks: {...stateCopy.tasks, [listId]: oldTasks, [newListId]: newTasks},
            } as StateType
        }

        case ACTIONS.MERGE_LISTS: {
            const {listId} = payload
            const mergedTasks: TaskType[] = []
            const updatedTasks: StateType = {...state, tasks: {...state.tasks}}

            for (let iteration = 0; iteration < state.lists.length; iteration++) {
                if (isListType(state.lists[iteration]) && (state.lists[iteration] as ListType).isSelected) {
                    mergedTasks.push(...updatedTasks.tasks[state.lists[iteration].id])
                    delete updatedTasks.tasks[state.lists[iteration].id]
                }
            }

            const isMergedTasksDone = isTasksCompleted(mergedTasks)

            const updatedLists = state.lists.map(list => list.id === listId ? {
                ...list,
                isSelected: false,
                isDone: isMergedTasksDone,
                isPinned: isMergedTasksDone ? false : (list as ListType).isPinned,
            } : list)

            return {
                ...updatedTasks,
                tasks: {...updatedTasks.tasks, [listId]: mergedTasks},
                lists: updatedLists.filter(list => (list as ListType).isSelected ? list.id === listId : true),
            } as StateType
        }

        case ACTIONS.ADD_TASK: {
            const {listId, taskName} = payload
            const newTask: TaskType = {
                id: v1(),
                listId: listId,
                name: taskName ? taskName : 'Task.',
                isDone: false,
                isSelected: false,
            } as const

            return {
                ...state,
                tasks: {...state.tasks, [listId]: [...state.tasks[listId], newTask]},
                lists: state.lists.map(list => list.id === listId ? {
                    ...list,
                    isDone: (list as ListType).isDone ? false : (list as ListType).isDone,
                } as ListType : list),
            } as StateType
        }

        case ACTIONS.CHANGE_LIST_NAME:
            return {
                ...state, lists: state.lists.map(list => list.id === payload.listId ? {
                    ...list, name: payload.name,
                } : list),
            } as StateType

        case ACTIONS.ADD_LIST: {
            const {newTasks, inputListName} = payload
            const newListId = v1()

            const newList: ListType = {
                id: newListId,
                name: inputListName || 'To-do list #' + state.lists.length,
                isDone: false,
                isPinned: false,
                isSelected: false,
            }

            const stateCopy: StateType = {
                ...state, lists: [newList, ...state.lists,
                ],
            }

            sortPinnedLists(stateCopy.lists as ListType[])

            return {...stateCopy, tasks: {...stateCopy.tasks, [newListId]: newTasks || []}} as StateType
        }

        case ACTIONS.SELECT_LIST:
            return {
                ...state, lists: state.lists.map(list => list.id === payload.listId ? {
                    ...list,
                    isSelected: payload.isSelected,
                } : list),
            } as StateType

        case ACTIONS.SET_LISTS_SELECTION:
            return {
                ...state,
                lists: state.lists.map(list => ({...list, isSelected: payload.isSelected})),
            } as StateType

        case ACTIONS.DELETE_SELECTED_LISTS:
            return {
                ...state, lists: state.lists.filter(list => !isListType(list) || !(list as ListType).isSelected),
            } as StateType

        case ACTIONS.CLEAR_LIST:
            return {
                ...state, lists: state.lists.map(list => list.id === payload.listId ? {
                    ...list,
                    isSelected: (list as ListType).isSelected ? false : (list as ListType).isSelected,
                    isDone: (list as ListType).isDone ? false : (list as ListType).isDone,
                } as ListType : list), tasks: {...state.tasks, [payload.listId]: []},
            } as StateType

        case ACTIONS.ADD_COUNTER: {
            const counter: CounterType = {
                id: v1(),
                name: payload.inputCounterName || 'Counter',
                initialCount: 0,
                currentCount: 0,
                limitCount: 10,
                isDone: false,
            }

            const stateCopy: StateType = {...state, lists: [counter, ...state.lists]}
            sortPinnedLists(stateCopy.lists as ListType[])
            return stateCopy
        }

        case ACTIONS.SET_COUNT:
            return {
                ...state,
                lists: state.lists.map(counter => counter.id === payload.counterId ? {
                    ...counter,
                    currentCount: payload.count,
                } as CounterType : counter),
            } as StateType

        case ACTIONS.DELETE_ALL_ITEMS:
            return {lists: [], tasks: {}} as StateType

        case ACTIONS.DELETE_ALL_LISTS:
            return {...state, lists: state.lists.filter(list => !isListType(list))} as StateType

        case ACTIONS.DELETE_ALL_COUNTERS:
            return {...state, lists: state.lists.filter(counter => !isCounterType(counter))} as StateType

        case ACTIONS.CLEAR_ALL_LISTS: {
            let clearedTasks: TasksType = {...state.tasks}

            state.lists.forEach(list => {
                if (isListType(list) && state.tasks[list.id].length > 0) clearedTasks[list.id] = []
            })

            return {
                ...state, lists: state.lists.map(list => isListType(list) && state.tasks[list.id].length > 0 ? {
                    ...list,
                    isDone: (list as ListType).isDone ? false : (list as ListType).isDone,
                } as ListType : list), tasks: clearedTasks,
            } as StateType
        }

        case ACTIONS.CLEAR_SELECTED_LISTS: {
            const clearedTasks: TasksType = {...state.tasks}

            state.lists.forEach(list => {
                if (isListType(list) && (list as ListType).isSelected) clearedTasks[list.id] = []
            })

            return {
                ...state,
                lists: state.lists.map(list => isListType(list) && (list as ListType).isSelected && state.tasks[list.id].length > 0 ? {
                    ...list,
                    isDone: (list as ListType).isDone ? false : (list as ListType).isDone,
                    isSelected: false,
                } as ListType : list), tasks: clearedTasks,
            } as StateType
        }

        case ACTIONS.RESET_ALL_COUNTERS:
            return {
                ...state,
                lists: state.lists.map(counter => isCounterType(counter) && (counter as CounterType).currentCount !== (counter as CounterType).initialCount ? {
                    ...counter,
                    currentCount: 0,
                } : counter),
            } as StateType

        case ACTIONS.ADD_MOCKED_LISTS: {
            const mockedData: StateType = getMockedData()

            return {
                ...state,
                lists: [...mockedData.lists, ...state.lists],
                tasks: {...state.tasks, ...mockedData.tasks},
            } as StateType
        }

        default: {
            if (settings.dev.errors) throw new Error(ERRORS.INVALID_ACTION_TYPE)
            else return state
        }
    }

    return state
}