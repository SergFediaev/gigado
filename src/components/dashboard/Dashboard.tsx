import React, {memo, useEffect, useReducer, useState} from 'react'
import {Button} from '../button/Button'
import {List} from '../list/List'
import s from './Dashboard.module.css'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import {InputForm} from '../inputForm/InputForm'
import {Counter} from '../Counter/Counter'
import {stateReducer} from '../../store/reducers/stateReducer'
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
} from '../../store/actions/stateActions'
import {
    completedListsCount,
    completedTasksCount,
    countersCount,
    isAnyListSelected,
    isCountersHaveCount,
    isListsHaveTask,
    isListType,
    listsCount,
    pinnedListsCount,
    selectedListsCount,
    tasksCount,
} from '../../store/reducers/stateReducerHelpers'
import {CounterType, ListType, StateType, TaskType} from '../../store/types/stateTypes'
import {setLocalStorageState} from '../../store/state'
import {PROJECT, RENDERING, STRINGS} from '../../strings/strings'
import {useNavigate} from 'react-router-dom'
import {PATHS} from '../../strings/paths'
import {Select} from '../select/Select'
import {settings} from '../../store/settings'
import {dashboardItemOptions, DashboardItemOptionType} from '../../store/dashboard'

type DashboardPropsType = {
    initialState: StateType
}

export const Dashboard = memo(({initialState}: DashboardPropsType) => {
    if (settings.dev.logMainRender) console.log(RENDERING.DASHBOARD)

    //region Local state.
    const [state, dispatchState] = useReducer(stateReducer, initialState)
    useEffect(() => setLocalStorageState(state), [state])
    const navigate = useNavigate()
    const [inputName, setInputName] = useState<string>(STRINGS.EMPTY)
    const [selectedItemOption, setSelectedItemOption] = useState<string>(settings.dashboard.selectedItemOption)
    const [animate] = useAutoAnimate()
    //endregion

    //region Local handlers.
    const inputChangeHandler = (name: string) => setInputName(name)

    const addItemHandler = () => {
        switch (selectedItemOption as DashboardItemOptionType) {
            case STRINGS.LIST:
                addListHandler(undefined, inputName)
                break
            case STRINGS.COUNTER :
                addCounterHandler(inputName)
                break
            case STRINGS.NOTE:
                addListHandler(undefined, inputName)
                break
            case STRINGS.PICTURE:
                addListHandler(undefined, inputName)
                break
            case STRINGS.PLAYLIST:
                addListHandler(undefined, inputName)
                break
        }

        setInputName(STRINGS.EMPTY)
    }
    //endregion

    //region Dispatch handlers.
    const deleteListHandler = (listId: string) => dispatchState(deleteList(listId))

    const deleteTaskHandler = (listId: string, taskId: string) => dispatchState(deleteTask(listId, taskId))

    const updateTaskHandler = (listId: string, taskId: string, isDone: boolean) => dispatchState(updateTask(listId, taskId, isDone))

    const changeTaskNameHandler = (listId: string, taskId: string, name: string) => dispatchState(changeTaskName(listId, taskId, name))

    const moveTaskVerticalHandler = (listId: string, taskId: string, moveDown: boolean) => dispatchState(moveTaskVertical(listId, taskId, moveDown))

    const moveTaskHorizontalHandler = (listId: string, taskId: string, moveRight: boolean) => dispatchState(moveTaskHorizontal(listId, taskId, moveRight))

    const pinListHandler = (listId: string, isPinned: boolean) => dispatchState(pinList(listId, isPinned))

    const completeListHandler = (listId: string, isDone: boolean) => dispatchState(completeList(listId, isDone))

    const moveListHandler = (listId: string, moveLeft: boolean) => dispatchState(moveList(listId, moveLeft))

    const splitListHandler = (listId: string) => dispatchState(splitList(listId))

    const mergeListsHandler = (listId: string) => dispatchState(mergeLists(listId))

    const deleteAllItemsHandler = () => dispatchState(deleteAllItems())

    const deleteAllListsHandler = () => dispatchState(deleteAllLists())

    const deleteAllCountersHandler = () => dispatchState(deleteAllCounters())

    const clearAllListsHandler = () => dispatchState(clearAllLists())

    const clearSelectedListsHandler = () => dispatchState(clearSelectedLists())

    const resetAllCountersHandler = () => dispatchState(resetAllCounters())

    const addTaskHandler = (listId: string, taskName: string) => dispatchState(addTask(listId, taskName))

    const changeListNameHandler = (listId: string, name: string) => dispatchState(changeListName(listId, name))

    const addListHandler = (newTasks?: TaskType[], inputListName?: string) => {
        dispatchState(addList(newTasks, inputListName))
        setInputName(STRINGS.EMPTY)
    }

    const selectListHandler = (listId: string, isSelected: boolean) => dispatchState(selectList(listId, isSelected))

    const setListsSelectionHandler = (isSelected: boolean) => dispatchState(setListsSelection(isSelected))

    const deleteSelectedListsHandler = () => dispatchState(deleteSelectedLists())

    const clearListHandler = (listId: string) => dispatchState(clearList(listId))

    const addCounterHandler = (inputCounterName?: string) => {
        dispatchState(addCounter(inputCounterName))
        setInputName(STRINGS.EMPTY)
    }

    const setCountHandler = (counterId: string, count: number) => dispatchState(setCount(counterId, count))

    const addMockedListsHandler = () => dispatchState(addMockedLists())
    //endregion

    //region Elements.
    const listsElements = state.lists.map(list => isListType(list) ? <List
        key={list.id}
        id={list.id}
        name={list.name}
        changeListName={changeListNameHandler}
        tasks={state.tasks[list.id]}
        isDone={(list as ListType).isDone}
        isPinned={(list as ListType).isPinned}
        deleteList={deleteListHandler}
        addTask={addTaskHandler}
        deleteTask={deleteTaskHandler}
        updateTask={updateTaskHandler}
        changeTaskName={changeTaskNameHandler}
        pinList={pinListHandler}
        isSelected={(list as ListType).isSelected}
        completeList={completeListHandler}
        moveList={moveListHandler}
        splitList={splitListHandler}
        moveTaskVertical={moveTaskVerticalHandler}
        moveTaskHorizontal={moveTaskHorizontalHandler}
        mergeLists={mergeListsHandler}
        selectList={selectListHandler}
        clearList={clearListHandler}
        selectedListsCount={selectedListsCount(state.lists as ListType[])}
        itemsCount={state.lists.length}
        listsCount={listsCount(state.lists as ListType[])}
    /> : <Counter
        key={list.id}
        id={list.id}
        name={list.name}
        initialCount={(list as CounterType).initialCount}
        currentCount={(list as CounterType).currentCount}
        limitCount={(list as CounterType).limitCount}
        isDone={(list as CounterType).isDone}
        setCount={setCountHandler}
    />)
    //endregion

    return <>
        {state.lists.length === 0 && <div className={s.onboarding}>
            <span>Just create your first to-do list!</span>
        </div>}
        <main
            className={s.toDoLists}
            ref={settings.dev.animate ? animate : undefined}
        >
            {listsElements}
        </main>
        <aside
            className={s.controlPanel}
            ref={settings.dev.animate ? animate : undefined}
        >
            <h1
                className={s.appTitle}
                title={PROJECT.TRANSCRIPTION}
            >{PROJECT.LOGOTYPE}</h1>
            <InputForm
                buttonIcon="➕"
                inputValue={inputName}
                onClick={addItemHandler}
                onChange={inputChangeHandler}
                placeholder={`${dashboardItemOptions.find(option => option.name === selectedItemOption)?.icon + ' '}Enter ${selectedItemOption.toLowerCase()} name`}
                buttonTitle={`Create ${selectedItemOption}`}
            />
            <Select
                selectedOption={selectedItemOption}
                options={dashboardItemOptions}
                setSelected={setSelectedItemOption}/>
            {listsCount(state.lists as ListType[]) > 0 && <Button
                name={isAnyListSelected(state.lists as ListType[]) ? 'Unselect all lists' : 'Select all lists'}
                onClick={() => setListsSelectionHandler(!isAnyListSelected(state.lists as ListType[]))}
            />}
            <Button name={STRINGS.BUTTONS.SETTINGS} onClick={() => navigate(PATHS.SETTINGS)}/>
            <Button
                name={STRINGS.BUTTONS.LOGOUT}
                onClick={() => navigate(PATHS.ROOT)}
            />
            <Button
                name="Add mocked lists"
                onClick={addMockedListsHandler}
            />
            {countersCount(state.lists as CounterType[]) > 0 && isCountersHaveCount(state.lists) && <Button
                name="Reset all counters"
                onClick={resetAllCountersHandler}
                important={true}
            />}
            {listsCount(state.lists as ListType[]) > 0 && isListsHaveTask(state.tasks) && <Button
                name={isAnyListSelected(state.lists as ListType[]) ? 'Clear all tasks in selected lists' : 'Clear tasks in all lists'}
                onClick={isAnyListSelected(state.lists as ListType[]) ? clearSelectedListsHandler : clearAllListsHandler}
                important={true}
            />}
            {countersCount(state.lists as CounterType[]) > 0 && <Button
                name={'Delete all counters'}
                onClick={deleteAllCountersHandler}
                important={true}
            />}
            {listsCount(state.lists as ListType[]) > 0 && <Button
                name={isAnyListSelected(state.lists as ListType[]) ? 'Delete selected lists' : 'Delete all lists'}
                onClick={isAnyListSelected(state.lists as ListType[]) ? deleteSelectedListsHandler : deleteAllListsHandler}
                important={true}
            />}
            {state.lists.length > 0 && <Button
                name={'Delete all items'}
                onClick={deleteAllItemsHandler}
                important={true}
            />}
            {settings.lists.showTooltips && <div className={s.submenu}>
                <table>
                    <tbody>
                    <tr>
                        <td> Total items:</td>
                        <td>{state.lists.length}</td>
                    </tr>
                    <tr>
                        <td>Lists:</td>
                        <td>{listsCount(state.lists as ListType[])}</td>
                    </tr>
                    <tr>
                        <td>Completed lists:</td>
                        <td>{completedListsCount(state.lists as ListType[])}</td>
                    </tr>
                    <tr>
                        <td>Pinned lists:</td>
                        <td>{pinnedListsCount(state.lists as ListType[])}</td>
                    </tr>
                    <tr>
                        <td>Total tasks:</td>
                        <td>{tasksCount(state.tasks)}</td>
                    </tr>
                    <tr>
                        <td>Completed tasks:</td>
                        <td>{completedTasksCount(state.tasks)}</td>
                    </tr>
                    <tr>
                        <td>Counters:</td>
                        <td>{countersCount(state.lists as CounterType[])}</td>
                    </tr>
                    </tbody>
                </table>
            </div>}
        </aside>
    </>
})