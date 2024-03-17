import {
    addCounter,
    addList,
    addMockedLists,
    addTask,
    changeListName,
    changeTaskName,
    clearAllLists,
    clearList,
    clearSelectedLists,
    completeList,
    deleteAllCounters,
    deleteAllItems,
    deleteAllLists,
    deleteList,
    deleteSelectedLists,
    deleteTask,
    mergeLists,
    moveList,
    moveTaskHorizontal,
    moveTaskVertical,
    pinList,
    resetAllCounters,
    selectList,
    setCount,
    setListsSelection,
    splitList,
    updateTask,
} from '../actions/stateActions'

export type StateActionType =
    DeleteListType
    | DeleteTaskType
    | UpdateTaskType
    | ChangeTaskNameType
    | MoveTaskVerticalType
    | MoveTaskHorizontalType
    | PinListType
    | CompleteListType
    | MoveListType
    | SplitListType
    | MergeListType
    | AddTaskType
    | ChangeListNameType
    | AddListType
    | SelectListType
    | SetListSelectionType
    | DeleteSelectedListsType
    | ClearListType
    | AddCounterType
    | SetCountType
    | DeleteAllItemsType
    | DeleteAllListsType
    | DeleteAllCountersType
    | ClearAllListsType
    | ClearSelectedListsType
    | ResetAllCountersType
    | AddMockedListsType

type DeleteListType = ReturnType<typeof deleteList>

type DeleteTaskType = ReturnType<typeof deleteTask>

type UpdateTaskType = ReturnType<typeof updateTask>

type ChangeTaskNameType = ReturnType<typeof changeTaskName>

type MoveTaskVerticalType = ReturnType<typeof moveTaskVertical>

type MoveTaskHorizontalType = ReturnType<typeof moveTaskHorizontal>

type PinListType = ReturnType<typeof pinList>

type CompleteListType = ReturnType<typeof completeList>

type MoveListType = ReturnType<typeof moveList>

type SplitListType = ReturnType<typeof splitList>

type MergeListType = ReturnType<typeof mergeLists>

type AddTaskType = ReturnType<typeof addTask>

type ChangeListNameType = ReturnType<typeof changeListName>

type AddListType = ReturnType<typeof addList>

type SelectListType = ReturnType<typeof selectList>

type SetListSelectionType = ReturnType<typeof setListsSelection>

type DeleteSelectedListsType = ReturnType<typeof deleteSelectedLists>

type ClearListType = ReturnType<typeof clearList>

type AddCounterType = ReturnType<typeof addCounter>

type SetCountType = ReturnType<typeof setCount>

type DeleteAllItemsType = ReturnType<typeof deleteAllItems>

type DeleteAllListsType = ReturnType<typeof deleteAllLists>

type DeleteAllCountersType = ReturnType<typeof deleteAllCounters>

type ClearAllListsType = ReturnType<typeof clearAllLists>

type ClearSelectedListsType = ReturnType<typeof clearSelectedLists>

type ResetAllCountersType = ReturnType<typeof resetAllCounters>

type AddMockedListsType = ReturnType<typeof addMockedLists>