import React, {useEffect, useState} from 'react'
import {Button} from '../button/Button'
import {List} from '../list/List'
import {v1} from 'uuid'
import s from './Dashboard.module.css'
import '../common.css'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom'
import {Error404} from '../error404/Error404'
import {InputForm} from '../inputForm/InputForm'
import {Counter} from '../Counter/Counter'
import {mockedTasks, mockLists} from '../../mock/mockedLists'

export const PATH = {
    ROOT: '/',
    ALL: '/*',
    DASHBOARD: '/dashboard',
    LIST: '/list',
    ID: '/:id',
    ERROR_404: '/error404',
} as const

const KEYS = {
    LISTS: 'lists',
    TASKS: 'tasks',
} as const

const CONSTANTS = {
    RANDOM_BACKGROUND_IMAGE_URL: 'https://source.unsplash.com/random/?nature,landscape',
} as const

const addNewTask = (tasks: TaskType[], index: number, task: TaskType): TaskType[] => {
    const tasksCopy = [...tasks]
    tasksCopy.splice(index, 0, task)
    return tasksCopy
}

export type DataType = ItemType[]

type ItemType = ListType | CounterType

export type ListType = {
    id: string
    name: string
    isSelected: boolean
    isPinned: boolean
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

export type CounterType = {
    id: string
    name: string
    initialCount: number
    currentCount: number
    limitCount: number
    isDone: boolean
}

export const Dashboard = () => {
    const loadListsFromLocalStorage = (): DataType => {
        const listsFromLocalStorage = localStorage.getItem(KEYS.LISTS)
        return listsFromLocalStorage ? JSON.parse(listsFromLocalStorage) : Array<ListType>()
    }

    const loadTasksFromLocalStorage = (): TasksType => {
        const tasksFromLocalStorage = localStorage.getItem(KEYS.TASKS)
        return tasksFromLocalStorage ? JSON.parse(tasksFromLocalStorage) : {}
    }

    const saveListsToLocalStorage = (lists: DataType) => localStorage.setItem(KEYS.LISTS, JSON.stringify(lists))

    const saveTasksToLocalStorage = (tasks: TasksType) => localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks))

    const [lists, setLists] = useState<DataType>(loadListsFromLocalStorage)

    const [tasks, setTasks] = useState<TasksType>(loadTasksFromLocalStorage)

    useEffect(() => {
        saveListsToLocalStorage(lists)
    }, [lists])

    useEffect(() => {
        saveTasksToLocalStorage(tasks)
    }, [tasks])

    const deleteList = (listId: string) => {
        const tasksCopy: TasksType = {...tasks}
        delete tasksCopy[listId]

        setLists(lists.filter(list => list.id !== listId))
        setTasks(tasksCopy)
    }

    const deleteTask = (listId: string, taskId: string) => {
        const tasksWithDeletedTask: TasksType = {...tasks, [listId]: tasks[listId].filter(task => task.id !== taskId)}
        const isDone = isTasksCompleted(tasksWithDeletedTask[listId])

        const updatedLists = lists.map(list => list.id === listId ? {
            ...list, isDone, isPinned: isDone ? false : (list as ListType).isPinned,
        } as ListType : list)

        if (isDone) sortCompletedLists(updatedLists as ListType[])

        setTasks(tasksWithDeletedTask)
        setLists(updatedLists)
    }

    const sortCompletedLists = (lists: ListType[]): ListType[] => lists.sort((listA, listB) => listA.isDone === listB.isDone ? 0 : listA.isDone ? 1 : -1)

    const sortPinnedLists = (lists: ListType[]): ListType[] => lists.sort((listA, listB) => listA.isPinned === listB.isPinned ? 0 : listA.isPinned ? -1 : 1)

    const completedListsCount = () => lists.filter(list => (list as ListType).isDone).length

    const pinnedListsCount = () => lists.filter(list => (list as ListType).isPinned).length

    const countersCount = lists.reduce((count, counter) => {
        if (isCounterType(counter)) count++
        return count
    }, 0)

    const listsCount = lists.reduce((count, list) => {
        if (isListType(list)) count++
        return count
    }, 0)

    const selectedListsCount = lists.reduce((count, list) => {
        if (isListType(list) && (list as ListType).isSelected) count++
        return count
    }, 0)

    const tasksCount = () => Object.values(tasks).reduce((count, tasks) => count + tasks.length, 0)

    const completedTasksCount = () => Object.values(tasks).reduce((count, tasks) => {
        tasks.forEach(task => {
            if (task.isDone) count++
        })

        return count
    }, 0)

    const updateTask = (listId: string, taskId: string, isDone: boolean) => {
        const updatedTasks: TasksType = {
            ...tasks,
            [listId]: tasks[listId].map(task => task.id === taskId ? {...task, isDone} : task),
        }

        const isListDone = isTasksCompleted(updatedTasks[listId])

        const updatedLists = lists.map(list => list.id === listId ? {
            ...list,
            isDone: isListDone,
            isPinned: isListDone ? false : (list as ListType).isPinned,
        } as ListType : list)

        if (isListDone) sortCompletedLists(updatedLists as ListType[])

        setTasks(updatedTasks)
        setLists(updatedLists)
    }

    const changeTaskName = (listId: string, taskId: string, name: string) => setTasks({
        ...tasks,
        [listId]: tasks[listId].map(task => task.id === taskId ? {...task, name} : task),
    })

    const moveTaskVertical = (listId: string, taskId: string, moveDown: boolean) => {
        const tasksCopy: TasksType = {...tasks}
        const updatedTasks: TaskType[] = tasksCopy[listId]
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

        setTasks(tasksCopy)
    }

    const moveTaskHorizontal = (listId: string, taskId: string, moveRight: boolean) => {
        const listIndex = lists.findIndex(list => list.id === listId)
        const taskIndex = tasks[listId].findIndex(task => task.id === taskId)
        const swapTask = tasks[listId][taskIndex]
        let swapIndex

        if (moveRight) {
            swapIndex = listIndex + 1
            if (swapIndex === lists.length) swapIndex = 0

            if (!isListType(lists[swapIndex])) {
                for (let iteration = swapIndex + 1; iteration < lists.length; iteration++) {
                    if (isListType(lists[iteration])) {
                        swapIndex = iteration
                        break
                    }
                }

                if (!isListType(lists[swapIndex])) return
            }
        } else {
            swapIndex = listIndex - 1
            if (swapIndex < 0) swapIndex = lists.length - 1

            if (!isListType(lists[swapIndex])) {
                for (let iteration = swapIndex - 1; iteration >= 0; iteration--) {
                    if (isListType(lists[iteration])) {
                        swapIndex = iteration
                        break
                    }
                }

                if (!isListType(lists[swapIndex])) return
            }
        }

        const swapListId = lists[swapIndex].id

        const updatedTasks: TasksType = {
            ...tasks,
            [listId]: tasks[listId].filter(task => task.id !== taskId),
            [swapListId]: tasks[swapListId][taskIndex] ? addNewTask(tasks[swapListId], taskIndex, swapTask) : [...tasks[swapListId], swapTask],
        }

        setLists(lists.map(list => list.id === listId || list.id === swapListId ? {
            ...list,
            isDone: isTasksCompleted(updatedTasks[list.id]),
            isPinned: isTasksCompleted(updatedTasks[list.id]) ? false : (list as ListType).isPinned,
        } as ListType : list))

        setTasks(updatedTasks)
    }

    const isListCompleted = (list: ListType): boolean => {
        if (tasks[list.id].length === 0) return false
        return tasks[list.id].every(task => task.isDone)
    }

    const isTasksCompleted = (tasks: TaskType[]): boolean => {
        if (tasks.length === 0) return false
        return tasks.every(task => task.isDone)
    }

    const pinList = (listId: string, isPinned: boolean) => {
        const updatedLists = lists.map(list => list.id === listId ? {
            ...list,
            isPinned,
            isDone: isPinned ? false : (list as ListType).isDone,
            isSelected: (list as ListType).isSelected ? false : (list as ListType).isSelected,
        } as ListType : list)

        sortPinnedLists(updatedLists as ListType[])

        setLists(updatedLists)
        if (isPinned && lists.find(list => list.id === listId)?.isDone) setTasks({
            ...tasks,
            [listId]: tasks[listId].map(task => task.isDone ? {...task, isDone: false} : task),
        })
    }

    const completeList = (listId: string, isDone: boolean) => {
        const updatedLists = lists.map(list => list.id === listId ? {
            ...list,
            isDone,
            isPinned: isDone ? false : (list as ListType).isPinned,
            isSelected: (list as ListType).isSelected ? false : (list as ListType).isSelected,
        } as ListType : list)

        sortCompletedLists(updatedLists as ListType[])

        setTasks({...tasks, [listId]: tasks[listId].map(task => task.isDone === isDone ? task : {...task, isDone})})
        setLists(updatedLists)
    }

    const moveList = (listId: string, moveLeft: boolean) => {
        const updatedLists: ItemType[] = [...lists]
        const listIndex = updatedLists.findIndex(list => list.id === listId)

        for (let iteration = 0; iteration < updatedLists.length; iteration++) {
            if (iteration === listIndex) {
                let swapIndex

                if (moveLeft) {
                    swapIndex = listIndex - 1
                    if (swapIndex < 0) swapIndex = updatedLists.length - 1
                } else {
                    swapIndex = listIndex + 1
                    if (swapIndex === updatedLists.length) swapIndex = 0
                }

                const swapList: ItemType = updatedLists[swapIndex]
                updatedLists[swapIndex] = updatedLists[iteration]
                updatedLists[iteration] = swapList
                break
            }
        }

        setLists(updatedLists)
    }

    const splitList = (listId: string) => {
        const half = tasks[listId].length / 2
        if (half < 1) return

        const oldTasks: TaskType[] = []
        const newTasks: TaskType[] = []

        for (let iteration = 0; iteration < tasks[listId].length; iteration++) {
            if (iteration < half) oldTasks.push(tasks[listId][iteration])
            if (iteration >= half) newTasks.push(tasks[listId][iteration])
        }

        const newListId = v1()

        const newList: ListType = {
            id: newListId,
            name: 'Splitted to-do list #' + lists.length,
            isDone: isTasksCompleted(newTasks),
            isPinned: false,
            isSelected: false,
        }

        const updatedLists = [newList, ...lists.map(list => list.id === listId ? {
            ...list,
            isSelected: (list as ListType).isSelected ? false : (list as ListType).isSelected,
            isDone: isTasksCompleted(oldTasks),
        } as ListType : list)]

        sortPinnedLists(updatedLists as ListType[])
        sortCompletedLists(updatedLists as ListType[])

        setTasks({...tasks, [listId]: oldTasks, [newListId]: newTasks})
        setLists(updatedLists)
    }

    const mergeLists = (listId: string) => {
        const mergedTasks: TaskType[] = []
        const updatedTasks: TasksType = {...tasks}

        for (let iteration = 0; iteration < lists.length; iteration++) {
            if (isListType(lists[iteration]) && (lists[iteration] as ListType).isSelected) {
                mergedTasks.push(...updatedTasks[lists[iteration].id])
                delete updatedTasks[lists[iteration].id]
            }
        }

        const isMergedTasksDone = isTasksCompleted(mergedTasks)

        const updatedLists = lists.map(list => list.id === listId ? {
            ...list,
            isSelected: false,
            isDone: isMergedTasksDone,
            isPinned: isMergedTasksDone ? false : (list as ListType).isPinned,
        } : list)

        setTasks({...updatedTasks, [listId]: mergedTasks})
        setLists(updatedLists.filter(list => (list as ListType).isSelected ? list.id === listId : true))
    }

    const viewList = (listId: string) => {
        const list = lists.find(list => list.id === listId)

        if (list) {
            setViewableListId(list.id)
            navigate(`${PATH.DASHBOARD}${PATH.LIST}/${list.id}`)
        }
    }

    const addTask = (listId: string, taskName: string) => {
        const newTask: TaskType = {
            id: v1(),
            listId: listId,
            name: taskName ? taskName : 'Task.',
            isDone: false,
            isSelected: false,
        }

        setTasks({...tasks, [listId]: [...tasks[listId], newTask]})
        setLists(lists.map(list => list.id === listId ? {
            ...list,
            isDone: (list as ListType).isDone ? false : (list as ListType).isDone,
        } as ListType : list))
    }

    const changeListName = (listId: string, name: string) => setLists(lists.map(list => list.id === listId ? {
        ...list, name,
    } : list))

    const addList = (newTasks?: TaskType[]) => {
        const newListId = v1()

        const newList: ListType = {
            id: newListId,
            name: inputListName ? inputListName : 'To-do list #' + lists.length,
            isDone: false,
            isPinned: false,
            isSelected: false,
        }

        const updatedLists = [newList, ...lists]
        sortPinnedLists(updatedLists as ListType[])

        setLists(updatedLists)
        setTasks({...tasks, [newListId]: newTasks || []})
        setInputListName('')
    }

    const selectList = (listId: string, isSelected: boolean) => setLists(lists.map(list => list.id === listId ? {
        ...list,
        isSelected,
    } : list))

    const setListsSelection = (isSelected: boolean) => setLists(lists.map(list => ({...list, isSelected})))

    const isAnyListSelected = (): boolean => lists.some(list => isListType(list) && (list as ListType).isSelected)

    const deleteSelectedLists = () => setLists(lists.filter(list => !isListType(list) || !(list as ListType).isSelected))

    const clearList = (listId: string) => {
        setLists(lists.map(list => list.id === listId ? {
            ...list,
            isSelected: (list as ListType).isSelected ? false : (list as ListType).isSelected,
            isDone: (list as ListType).isDone ? false : (list as ListType).isDone,
        } as ListType : list))

        setTasks({...tasks, [listId]: []})
    }

    const addCounter = () => {
        const counter: CounterType = {
            id: v1(),
            name: inputCounterName ? inputCounterName : 'Counter',
            initialCount: 0,
            currentCount: 0,
            limitCount: 10,
            isDone: false,
        }

        const updatedLists = [counter, ...lists]

        const sortedLists = sortPinnedLists(updatedLists as ListType[])

        setLists(sortedLists)

        setInputCounterName('')
    }

    const setCount = (counterId: string, count: number) => {
        const counter = lists.find(counter => counter.id === counterId);

        (counter as CounterType).currentCount = count

        setLists([...lists])
    }

    const listsElements = lists.map(list => isListType(list) ? <List
        key={list.id}
        id={list.id}
        name={list.name}
        changeListName={changeListName}
        tasks={tasks[list.id]}
        isDone={(list as ListType).isDone}
        isPinned={(list as ListType).isPinned}
        deleteList={deleteList}
        addTask={addTask}
        deleteTask={deleteTask}
        updateTask={updateTask}
        changeTaskName={changeTaskName}
        pinList={pinList}
        isSelected={(list as ListType).isSelected}
        completeList={completeList}
        moveList={moveList}
        splitList={splitList}
        viewList={viewList}
        moveTaskVertical={moveTaskVertical}
        moveTaskHorizontal={moveTaskHorizontal}
        mergeLists={mergeLists}
        selectList={selectList}
        clearList={clearList}
        selectedListsCount={selectedListsCount}
        itemsCount={lists.length}
        listsCount={listsCount}
    /> : <Counter
        key={list.id}
        id={list.id}
        name={list.name}
        initialCount={(list as CounterType).initialCount}
        currentCount={(list as CounterType).currentCount}
        limitCount={(list as CounterType).limitCount}
        isDone={(list as CounterType).isDone}
        setCount={setCount}
    />)

    const [inputListName, setInputListName] = useState<string>('')

    const inputListNameChangeHandler = (newListName: string) => {
        setInputListName(newListName)
    }

    const [inputCounterName, setInputCounterName] = useState<string>('')

    const inputCounterNameChangeHandler = (newCounterName: string) => {
        setInputCounterName(newCounterName)
    }

    const [showMenu, setShowMenu] = useState<boolean>(true)

    const [animateListsRef] = useAutoAnimate<HTMLElement>()

    const navigate = useNavigate()

    const [viewableListId, setViewableListId] = useState<string>('')

    const viewableList = lists.find(list => list.id === viewableListId)

    const deleteAllItems = () => setLists([])

    const deleteAllLists = () => setLists(lists.filter(list => !isListType(list)))

    const deleteAllCounters = () => setLists(lists.filter(counter => !isCounterType(counter)))

    const clearAllLists = () => {
        let clearedTasks: TasksType = {...tasks}

        lists.forEach(list => {
            if (isListType(list) && tasks[list.id].length > 0) clearedTasks[list.id] = []
        })

        setTasks(clearedTasks)
        setLists(lists.map(list => isListType(list) && tasks[list.id].length > 0 ? {
            ...list,
            isDone: (list as ListType).isDone ? false : (list as ListType).isDone,
        } as ListType : list))
    }

    const clearSelectedLists = () => {
        const clearedTasks: TasksType = {...tasks}

        lists.forEach(list => {
            if (isListType(list) && (list as ListType).isSelected) clearedTasks[list.id] = []
        })

        setTasks(clearedTasks)
        setLists(lists.map(list => isListType(list) && (list as ListType).isSelected && tasks[list.id].length > 0 ? {
            ...list,
            isDone: (list as ListType).isDone ? false : (list as ListType).isDone,
            isSelected: false,
        } as ListType : list))
    }

    const resetAllCounters = () => setLists(lists.map(counter => isCounterType(counter) && (counter as CounterType).currentCount !== (counter as CounterType).initialCount ? {
        ...counter,
        currentCount: 0,
    } : counter))

    const isListsHaveTask = (): boolean => Object.values(tasks).some(tasks => tasks.length > 0)

    const isCountersHaveCount = (): boolean => lists.some(counter => isCounterType(counter) && (counter as CounterType).currentCount !== (counter as CounterType).initialCount)

    const [backgroundImage, setBackgroundImage] = useState<string>(CONSTANTS.RANDOM_BACKGROUND_IMAGE_URL)

    const setBackgroundImageHandler = () => setBackgroundImage(CONSTANTS.RANDOM_BACKGROUND_IMAGE_URL)

    const addMockedListsHandler = () => {
        setLists([...mockLists, ...lists])
        setTasks({...tasks, ...mockedTasks})
    }

    return <div
        className={s.dashboard}
        style={{backgroundImage: `url(${backgroundImage})`}}
    >
        <Routes>
            <Route path={PATH.DASHBOARD} element={
                <div>
                    {lists.length === 0 && <div className={s.onboarding}>
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
                            onClick={addList}
                            onChange={inputListNameChangeHandler}
                            placeholder="Enter new to-do list name"
                            buttonTitle="Create a new to-do list"
                        />
                        <InputForm
                            buttonIcon="➕"
                            inputValue={inputCounterName}
                            onClick={addCounter}
                            onChange={inputCounterNameChangeHandler}
                            placeholder="Enter new counter name"
                            buttonTitle="Create a new counter"
                        />
                        <Button
                            name={isAnyListSelected() ? 'Unselect all lists' : 'Select all lists'}
                            onClick={() => setListsSelection(!isAnyListSelected())}
                            disabled={listsCount === 0}
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
                            onClick={resetAllCounters}
                            disabled={countersCount === 0 || !isCountersHaveCount()}
                            important={true}
                        />
                        <Button
                            name={isAnyListSelected() ? 'Clear all tasks in selected lists' : 'Clear tasks in all lists'}
                            onClick={isAnyListSelected() ? clearSelectedLists : clearAllLists}
                            disabled={listsCount === 0 || !isListsHaveTask()}
                            important={true}
                        />
                        <Button
                            name={'Delete all counters'}
                            onClick={deleteAllCounters}
                            disabled={countersCount === 0}
                            important={true}
                        />
                        <Button
                            name={isAnyListSelected() ? 'Delete selected lists' : 'Delete all lists'}
                            onClick={isAnyListSelected() ? deleteSelectedLists : deleteAllLists}
                            disabled={listsCount === 0}
                            important={true}
                        />
                        <Button
                            name={'Delete all items'}
                            onClick={deleteAllItems}
                            disabled={lists.length === 0}
                            important={true}
                        />
                        {showMenu && <div className={s.submenu}>
                            <table>
                                <tbody>
                                <tr>
                                    <td>Total items:</td>
                                    <td>{lists.length}</td>
                                </tr>
                                <tr>
                                    <td>Lists:</td>
                                    <td>{listsCount}</td>
                                </tr>
                                <tr>
                                    <td>Completed lists:</td>
                                    <td>{completedListsCount()}</td>
                                </tr>
                                <tr>
                                    <td>Pinned lists:</td>
                                    <td>{pinnedListsCount()}</td>
                                </tr>
                                <tr>
                                    <td>Total tasks:</td>
                                    <td>{tasksCount()}</td>
                                </tr>
                                <tr>
                                    <td>Completed tasks:</td>
                                    <td>{completedTasksCount()}</td>
                                </tr>
                                <tr>
                                    <td>Counters:</td>
                                    <td>{countersCount}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>}
                    </aside>
                </div>}
            />
            <Route path={PATH.ROOT} element={<Navigate to={PATH.DASHBOARD}/>}/>
            <Route path={PATH.ERROR_404} element={<Error404/>}/>
            <Route path={`${PATH.DASHBOARD}${PATH.LIST}${PATH.ID}`} element={
                viewableList ? <div className={s.listDetails}>
                    <Button name={'Back to dashboard 📊'} onClick={() => navigate(PATH.DASHBOARD)}/>
                    <List
                        id={viewableList.id}
                        name={viewableList.name}
                        changeListName={changeListName}
                        tasks={tasks[viewableList.id]}
                        isDone={(viewableList as ListType).isDone}
                        isPinned={(viewableList as ListType).isPinned}
                        deleteList={deleteList}
                        addTask={addTask}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                        changeTaskName={changeTaskName}
                        moveTaskVertical={moveTaskVertical}
                        moveTaskHorizontal={moveTaskHorizontal}
                        pinList={pinList}
                        isSelected={(viewableList as ListType).isSelected}
                        completeList={completeList}
                        moveList={moveList}
                        splitList={splitList}
                        viewList={viewList}
                        mergeLists={mergeLists}
                        selectList={selectList}
                        clearList={clearList}
                        itemsCount={listsCount}
                        selectedListsCount={selectedListsCount}
                        listsCount={listsCount}
                    />
                </div> : <Error404/>
            }/>
            <Route path={`${PATH.DASHBOARD}${PATH.LIST}${PATH.ALL}`} element={<Error404/>}/>
            <Route path={PATH.ALL} element={<Error404/>}/>
        </Routes>
    </div>
}

const isListType = (item: ItemType): boolean => (item as ListType).isPinned !== undefined

const isCounterType = (item: ItemType): boolean => (item as CounterType).currentCount !== undefined