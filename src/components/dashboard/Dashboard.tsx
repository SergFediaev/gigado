import React, {useEffect, useReducer, useState} from 'react'
import {Button} from '../button/Button'
import {List} from '../list/List'
import s from './Dashboard.module.css'
import '../common.css'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom'
import {Error404} from '../error404/Error404'
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
import {STRINGS} from '../../strings/strings'
import {PATHS} from '../../strings/paths'

type DashboardPropsType = {
    initialState: StateType
}

export const Dashboard = ({initialState}: DashboardPropsType) => {
    //region Local state.
    const [state, dispatchState] = useReducer(stateReducer, initialState)
    useEffect(() => setLocalStorageState(state), [state])

    const [inputCounterName, setInputCounterName] = useState<string>(STRINGS.EMPTY)
    const [inputListName, setInputListName] = useState<string>(STRINGS.EMPTY)
    const [showMenu, setShowMenu] = useState<boolean>(true)
    const [backgroundImage, setBackgroundImage] = useState<string>(STRINGS.RANDOM_BACKGROUND_IMAGE_URL)

    const [animateListsRef] = useAutoAnimate<HTMLElement>()
    //endregion

    //region Local handlers.
    const inputListNameChangeHandler = (newListName: string) => setInputListName(newListName)

    const inputCounterNameChangeHandler = (newCounterName: string) => setInputCounterName(newCounterName)
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
        setInputListName(STRINGS.EMPTY)
    }

    const selectListHandler = (listId: string, isSelected: boolean) => dispatchState(selectList(listId, isSelected))

    const setListsSelectionHandler = (isSelected: boolean) => dispatchState(setListsSelection(isSelected))

    const deleteSelectedListsHandler = () => dispatchState(deleteSelectedLists())

    const clearListHandler = (listId: string) => dispatchState(clearList(listId))

    const addCounterHandler = (inputCounterName?: string) => {
        dispatchState(addCounter(inputCounterName))
        setInputCounterName(STRINGS.EMPTY)
    }

    const setCountHandler = (counterId: string, count: number) => dispatchState(setCount(counterId, count))

    const setBackgroundImageHandler = () => setBackgroundImage(STRINGS.RANDOM_BACKGROUND_IMAGE_URL)

    const addMockedListsHandler = () => dispatchState(addMockedLists())
    //endregion

    //region Routing.
    const viewList = (listId: string) => {
        const list = state.lists.find(list => list.id === listId)

        if (list) {
            setViewableListId(list.id)
            navigate(`${PATHS.DASHBOARD}${PATHS.LIST}/${list.id}`)
        }
    }

    const navigate = useNavigate()

    const [viewableListId, setViewableListId] = useState<string>(STRINGS.EMPTY)

    const viewableList = state.lists.find(list => list.id === viewableListId)
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
        viewList={viewList}
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

    return <div
        className={s.dashboard}
        style={{backgroundImage: `url(${backgroundImage})`}}
    >
        <Routes>
            <Route path={PATHS.DASHBOARD} element={
                <div>
                    {state.lists.length === 0 && <div className={s.onboarding}>
                        <span>Just create your first to-do list!</span>
                    </div>}
                    <main
                        className={s.toDoLists}
                        ref={animateListsRef}
                    >
                        {listsElements}
                    </main>
                    <aside className={s.controlPanel}>
                        <h1
                            className={s.appTitle}
                            title="Тудулия"
                        >Todolia📌</h1>
                        <InputForm
                            buttonIcon="➕"
                            inputValue={inputListName}
                            onClick={addListHandler}
                            onChange={inputListNameChangeHandler}
                            placeholder="Enter new to-do list name"
                            buttonTitle="Create a new to-do list"
                        />
                        <InputForm
                            buttonIcon="➕"
                            inputValue={inputCounterName}
                            onClick={addCounterHandler}
                            onChange={inputCounterNameChangeHandler}
                            placeholder="Enter new counter name"
                            buttonTitle="Create a new counter"
                        />
                        <Button
                            name={isAnyListSelected(state.lists as ListType[]) ? 'Unselect all lists' : 'Select all lists'}
                            onClick={() => setListsSelectionHandler(!isAnyListSelected(state.lists as ListType[]))}
                            disabled={listsCount(state.lists as ListType[]) === 0}
                        />
                        <Button
                            name={showMenu ? 'Hide statistics' : 'Show statistics'}
                            onClick={() => setShowMenu(!showMenu)}
                        />
                        <Button
                            name="Hide menu"
                            onClick={() => {
                            }}
                            disabled={true}
                        />
                        <Button
                            name="Random wallpaper"
                            onClick={setBackgroundImageHandler}
                            disabled={true}
                        />
                        <Button
                            name="Hide lists ID"
                            onClick={() => {
                            }}
                            disabled={true}
                        />
                        <Button
                            name="Add mocked lists"
                            onClick={addMockedListsHandler}
                        />
                        <Button
                            name="Reset all counters"
                            onClick={resetAllCountersHandler}
                            disabled={countersCount(state.lists as CounterType[]) === 0 || !isCountersHaveCount(state.lists)}
                            important={true}
                        />
                        <Button
                            name={isAnyListSelected(state.lists as ListType[]) ? 'Clear all tasks in selected lists' : 'Clear tasks in all lists'}
                            onClick={isAnyListSelected(state.lists as ListType[]) ? clearSelectedListsHandler : clearAllListsHandler}
                            disabled={listsCount(state.lists as ListType[]) === 0 || !isListsHaveTask(state.tasks)}
                            important={true}
                        />
                        <Button
                            name={'Delete all counters'}
                            onClick={deleteAllCountersHandler}
                            disabled={countersCount(state.lists as CounterType[]) === 0}
                            important={true}
                        />
                        <Button
                            name={isAnyListSelected(state.lists as ListType[]) ? 'Delete selected lists' : 'Delete all lists'}
                            onClick={isAnyListSelected(state.lists as ListType[]) ? deleteSelectedListsHandler : deleteAllListsHandler}
                            disabled={listsCount(state.lists as ListType[]) === 0}
                            important={true}
                        />
                        <Button
                            name={'Delete all items'}
                            onClick={deleteAllItemsHandler}
                            disabled={state.lists.length === 0}
                            important={true}
                        />
                        {showMenu && <div className={s.submenu}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>Total items:</td>
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
                </div>}
            />
            <Route path={PATHS.ROOT} element={<Navigate to={PATHS.DASHBOARD}/>}/>
            <Route path={PATHS.ERROR_404} element={<Error404/>}/>
            <Route path={`${PATHS.DASHBOARD}${PATHS.LIST}${PATHS.ID}`} element={
                viewableList ? <div className={s.listDetails}>
                    <Button name={'Back to dashboard 📊'} onClick={() => navigate(PATHS.DASHBOARD)}/>
                    <List
                        id={viewableList.id}
                        name={viewableList.name}
                        changeListName={changeListNameHandler}
                        tasks={state.tasks[viewableList.id]}
                        isDone={(viewableList as ListType).isDone}
                        isPinned={(viewableList as ListType).isPinned}
                        deleteList={deleteListHandler}
                        addTask={addTaskHandler}
                        deleteTask={deleteTaskHandler}
                        updateTask={updateTaskHandler}
                        changeTaskName={changeTaskNameHandler}
                        moveTaskVertical={moveTaskVerticalHandler}
                        moveTaskHorizontal={moveTaskHorizontalHandler}
                        pinList={pinListHandler}
                        isSelected={(viewableList as ListType).isSelected}
                        completeList={completeListHandler}
                        moveList={moveListHandler}
                        splitList={splitListHandler}
                        viewList={viewList}
                        mergeLists={mergeListsHandler}
                        selectList={selectListHandler}
                        clearList={clearListHandler}
                        itemsCount={listsCount(state.lists as ListType[])}
                        selectedListsCount={selectedListsCount(state.lists as ListType[])}
                        listsCount={listsCount(state.lists as ListType[])}
                    />
                </div> : <Error404/>
            }/>
            <Route path={`${PATHS.DASHBOARD}${PATHS.LIST}${PATHS.ALL}`} element={<Error404/>}/>
            <Route path={PATHS.ALL} element={<Error404/>}/>
        </Routes>
    </div>
}