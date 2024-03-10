import React, {useEffect, useState} from 'react'
import {Button} from '../button/Button'
import {List, ListType} from '../list/List'
import {v1} from 'uuid'
import s from './Dashboard.module.css'
import '../common.css'
import {TaskType} from '../task/Task'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom'
import {Error404} from '../error404/Error404'
import {InputForm} from '../inputForm/InputForm'
import {Counter, CounterType} from '../Counter/Counter'

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
} as const

const CONSTANTS = {
    RANDOM_BACKGROUND_IMAGE_URL: 'https://source.unsplash.com/random/?nature,landscape',
} as const

const addNewTask = (tasks: TaskType[], index: number, task: TaskType): TaskType[] => {
    const copy = [...tasks]
    copy.splice(index, 0, task)
    return copy
}

type DataType = ItemType[]

type ItemType = ListType | CounterType

export const Dashboard = () => {

    const loadListsFromLocalStorage = (): DataType => {
        const listsFromLocalStorage = localStorage.getItem(KEYS.LISTS)
        return listsFromLocalStorage ? JSON.parse(listsFromLocalStorage) : Array<ListType>()
    }

    const saveListsToLocalStorage = (lists: DataType) => localStorage.setItem(KEYS.LISTS, JSON.stringify(lists))

    const [lists, setLists] = useState<DataType>(loadListsFromLocalStorage)

    useEffect(() => {
        saveListsToLocalStorage(lists)
    }, [lists])

    const deleteList = (listId: string) => setLists(lists.filter(list => list.id !== listId))

    const deleteTask = (listId: string, taskId: string) => {
        const listsWithDeletedTask = lists.map(list => list.id === listId ? {
            ...list, tasks: (list as ListType).tasks.filter(task => task.id !== taskId),
        } : list)

        setLists(listsWithDeletedTask.map(list => list.id === listId ? {
            ...list, isDone: isListCompleted((list as ListType)),
        } : list))
    }

    const sortCompletedLists = (lists: ListType[]): ListType[] => lists.sort((listA, listB) => listA.isDone === listB.isDone ? 0 : listA.isDone ? 1 : -1)

    const sortPinnedLists = (lists: ListType[]): ListType[] => lists.sort((listA, listB) => listA.isPinned === listB.isPinned ? 0 : listA.isPinned ? -1 : 1)

    const completedListsCount = () => lists.filter(list => (list as ListType).isDone).length

    const pinnedListsCount = () => lists.filter(list => (list as ListType).isPinned).length

    const countersCount = lists.reduce((count, list) => {
        if (isCounterType(list)) count++
        return count
    }, 0)

    const listsCount = lists.reduce((count, list) => {
        if (isListType(list)) count++
        return count
    }, 0)

    const tasksCount = () => lists.reduce((count, list) => {
        if (isListType(list)) count += (list as ListType).tasks.length
        return count
    }, 0)

    const completedTasksCount = () => lists.reduce((count, list) => {
        if (isListType(list)) {
            (list as ListType).tasks.forEach(task => {
                if (task.isDone) count++
            })
        }

        return count
    }, 0)

    const updateTask = (listId: string, taskId: string, isDone: boolean) => {
        const listsWithUpdatedTask = lists.map(list => list.id === listId ? {
            ...list,
            tasks: (list as ListType).tasks.map(task => task.id === taskId ? {...task, isDone} : task),
        } : list)

        const listsWithUpdatedCompletion = listsWithUpdatedTask.map(list => list.id === listId ? {
            ...list,
            isDone: isListCompleted(list as ListType),
            isPinned: isListCompleted(list as ListType) ? false : (list as ListType).isPinned,
        } : list)

        const sortedLists = sortCompletedLists(listsWithUpdatedCompletion as ListType[])

        setLists([...sortedLists])
    }

    const changeTaskName = (listId: string, taskId: string, newTaskName: string) => setLists(
        lists.map(list => list.id === listId ? {
            ...list,
            tasks: (list as ListType).tasks.map(task => task.id === taskId ? {...task, name: newTaskName} : task),
        } : list),
    )

    const moveTaskVertical = (listId: string, taskId: string, moveDown: boolean) => {
        const listIndex = lists.findIndex(list => list.id === listId)
        const taskIndex = (lists[listIndex] as ListType).tasks.findIndex(task => task.id === taskId)

        for (let iteration = 0; iteration < (lists[listIndex] as ListType).tasks.length; iteration++) {
            if (iteration === taskIndex) {
                let swapIndex

                if (moveDown) {
                    swapIndex = taskIndex + 1
                    if (swapIndex === (lists[listIndex] as ListType).tasks.length) swapIndex = 0
                } else {
                    swapIndex = taskIndex - 1
                    if (swapIndex < 0) swapIndex = (lists[listIndex] as ListType).tasks.length - 1
                }

                const swapTask = (lists[listIndex] as ListType).tasks[swapIndex];
                (lists[listIndex] as ListType).tasks[swapIndex] = (lists[listIndex] as ListType).tasks[iteration];
                (lists[listIndex] as ListType).tasks[iteration] = swapTask
            }
        }

        setLists([...lists])
    }

    const moveTaskHorizontal = (listId: string, taskId: string, moveRight: boolean) => {
        const listIndex = lists.findIndex(list => list.id === listId)
        const taskIndex = (lists[listIndex] as ListType).tasks.findIndex(task => task.id === taskId)
        const swapTask = (lists[listIndex] as ListType).tasks[taskIndex]

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

        const listsWithRemovedTask = lists.map(list => list.id === listId ? {
            ...list,
            tasks: (list as ListType).tasks.filter(task => task.id !== taskId),
        } : list)

        const listsWithAddedTask = listsWithRemovedTask.map(list => list.id === swapListId ? {
            ...list,
            tasks: (list as ListType).tasks[taskIndex] ? addNewTask((list as ListType).tasks, taskIndex, swapTask) : [...(list as ListType).tasks, swapTask],
        } : list)

        const updatedLists = listsWithAddedTask.map(list => list.id === listId || list.id === swapListId ? {
            ...list, isDone: isListCompleted((list as ListType)),
        } : list)

        setLists(updatedLists)
    }

    const isListCompleted = (list: ListType): boolean => {
        if (list.tasks.length === 0) return false
        return list.tasks.every(task => task.isDone)
    }

    const pinList = (listId: string, isPinned: boolean) => {
        const listsWithUpdatedPin = lists.map(list => list.id === listId ? {
            ...list,
            isPinned,
            isDone: isPinned ? !isPinned : (list as ListType).isDone,
            tasks: isListCompleted(list as ListType) ? (list as ListType).tasks.map(task => task.isDone ? {
                ...task,
                isDone: !isPinned,
            } : task) : (list as ListType).tasks,
            isSelected: false,
        } : list)

        const sortedLists = sortPinnedLists(listsWithUpdatedPin as ListType[])

        setLists(sortedLists)
    }

    const completeList = (listId: string, isDone: boolean) => {
        const mappedLists = lists.map(list => list.id === listId ? {
            ...list,
            isDone,
            isPinned: false,
            tasks: (list as ListType).tasks.map(task => task.isDone === isDone ? task : {...task, isDone}),
            isSelected: false,
        } : list)

        const sortedLists = sortCompletedLists(mappedLists as ListType[])

        setLists(sortedLists)
    }

    const moveList = (listId: string, moveLeft: boolean) => {
        const listIndex = lists.findIndex(list => list.id === listId)

        let swapIndex

        if (moveLeft) {
            swapIndex = listIndex - 1
        } else {
            swapIndex = listIndex + 1
        }

        for (let iteration = 0; iteration < lists.length; iteration++) {
            if (iteration === listIndex) {
                if (swapIndex < 0) swapIndex = lists.length - 1
                if (swapIndex === lists.length) swapIndex = 0

                const swapList = lists[swapIndex]
                lists[swapIndex] = lists[iteration]
                lists[iteration] = swapList
            }
        }

        setLists([...lists])
    }

    const splitList = (listId: string) => {
        const index = lists.findIndex(list => list.id === listId)

        const half = (lists[index] as ListType).tasks.length / 2
        if (half < 1) return

        const oldTasks: TaskType[] = []
        const newTasks: TaskType[] = []

        for (let iteration = 0; iteration < (lists[index] as ListType).tasks.length; iteration++) {
            if (iteration < half) oldTasks.push((lists[index] as ListType).tasks[iteration])
            if (iteration >= half) newTasks.push((lists[index] as ListType).tasks[iteration])
        }

        const listsWithOldTasks = lists.map((list) => list.id === listId ? {
            ...list, tasks: oldTasks, isSelected: false,
        } : list)

        const newList: ListType = {
            id: v1(),
            name: 'Splitted to-do list #' + lists.length,
            changeListName: changeListName,
            tasks: newTasks,
            isDone: false,
            isPinned: false,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            changeTaskName: changeTaskName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
            pinList: pinList,
            isSelected: false,
            completeList: completeList,
            moveList: moveList,
            splitList: splitList,
            viewList: viewList,
            mergeLists: mergeLists,
            selectList: selectList,
        }

        const listsWithNewTasks = [newList, ...listsWithOldTasks]

        const sortedLists = sortPinnedLists(listsWithNewTasks as ListType[])

        setLists(sortedLists)
    }

    const mergeLists = (listId: string) => {
        const mergedTasks: TaskType[] = []

        for (let iteration = 0; iteration < lists.length; iteration++) {
            if (isListType(lists[iteration]) && (lists[iteration] as ListType).isSelected) {
                mergedTasks.push(...(lists[iteration] as ListType).tasks)
            }
        }

        const listsWithMergedTasks = lists.map(list => list.id === listId ? {
            ...list,
            tasks: mergedTasks,
            isSelected: false,
        } : list)

        setLists(listsWithMergedTasks.filter(list => (list as ListType).isSelected ? list.id === listId : true))
    }

    const viewList = (listId: string) => {
        const list = lists.find(list => list.id === listId)

        if (list) {
            setViewableListId(list.id)
            navigate(`${PATH.DASHBOARD}${PATH.LIST}/${list.id}`)
        }
    }

    const addTask = (listId: string, taskName: string) => {
        const newTask = {
            id: v1(),
            listId: listId,
            name: taskName ? taskName : 'Task.',
            isDone: false,
            isSelected: false,
            deleteTask: deleteTask,
            updateTask: updateTask,
            changeTaskName: changeTaskName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
        }

        setLists(lists.map(list => list.id === listId ? {
            ...list,
            tasks: [...(list as ListType).tasks, newTask],
            isDone: (list as ListType).isDone ? !(list as ListType).isDone : (list as ListType).isDone,
        } : list))
    }

    const changeListName = (listId: string, newListName: string) => setLists(lists.map(list => list.id === listId ? {
        ...list,
        name: newListName,
    } : list))

    const addList = (tasks?: TaskType[]) => {
        const newList: ListType = {
            id: v1(),
            name: inputListName ? inputListName : 'To-do list #' + lists.length,
            changeListName: changeListName,
            tasks: tasks || [],
            isDone: false,
            isPinned: false,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            changeTaskName: changeTaskName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
            pinList: pinList,
            isSelected: false,
            completeList: completeList,
            moveList: moveList,
            splitList: splitList,
            viewList: viewList,
            mergeLists: mergeLists,
            selectList: selectList,
        }

        const updatedLists = [newList, ...lists]

        const sortedLists = sortPinnedLists(updatedLists as ListType[])

        setLists(sortedLists)

        setInputListName('')
    }

    const selectList = (id: string, isSelected: boolean) => setLists(lists.map(list => list.id === id ? {
        ...list,
        isSelected,
    } : list))

    const addCounter = () => {
        const counter: CounterType = {
            id: v1(),
            name: inputCounterName ? inputCounterName : 'Counter',
            initialCount: 0,
            currentCount: 0,
            limitCount: 10,
            isDone: false,
            setCount: setCount,
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

    const mockListId1 = v1()
    const mockListId2 = v1()
    const mockListId3 = v1()
    const mockListId4 = v1()
    const mockListId5 = v1()
    const mockListId6 = v1()
    const mockListId7 = v1()
    const mockListId8 = v1()

    const mockLists: DataType = [
        {
            id: mockListId1,
            name: 'Список продуктов',
            tasks: [
                {
                    id: v1(),
                    listId: mockListId1,
                    name: 'Хлеб',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId1,
                    name: 'Макароны',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId1,
                    name: 'Молоко',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId1,
                    name: 'Овощи',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId1,
                    name: 'Сладости',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId1,
                    name: 'Орехи',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
            ],
            isDone: false,
            isPinned: true,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            pinList: pinList,
            isSelected: false,
            completeList: completeList,
            moveList: moveList,
            splitList: splitList,
            viewList: viewList,
            changeListName: changeListName,
            changeTaskName: changeTaskName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
            mergeLists: mergeLists,
            selectList: selectList,
        },
        /*        {
                    id: v1(),
                    name: 'Exercises',
                    initialCount: 0,
                    currentCount: 0,
                    limitCount: 10,
                    setCount: setCount,
                    isDone: false,
                },*/
        {
            id: mockListId2,
            name: 'Надо изучить',
            tasks: [
                {
                    id: v1(),
                    listId: mockListId2,
                    name: 'HTML',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId2,
                    name: 'CSS',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId2,
                    name: 'Native',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId2,
                    name: 'React',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
            ],
            isDone: false,
            isPinned: true,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            pinList: pinList,
            isSelected: false,
            completeList: completeList,
            moveList: moveList,
            splitList: splitList,
            viewList: viewList,
            changeListName: changeListName,
            changeTaskName: changeTaskName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
            mergeLists: mergeLists,
            selectList: selectList,
        },
        {
            id: mockListId3,
            name: 'Докупить',
            tasks: [
                {
                    id: v1(),
                    listId: mockListId3,
                    name: 'Масло',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId3,
                    name: 'Огурцы',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId3,
                    name: 'Помидоры',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId3,
                    name: 'Яблоки',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
            ],
            isDone: false,
            isPinned: false,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            pinList: pinList,
            isSelected: false,
            completeList: completeList,
            moveList: moveList,
            splitList: splitList,
            viewList: viewList,
            changeListName: changeListName,
            changeTaskName: changeTaskName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
            mergeLists: mergeLists,
            selectList: selectList,
        },
        {
            id: mockListId4,
            name: 'Доделать в проекте',
            tasks: [
                {
                    id: v1(),
                    listId: mockListId4,
                    name: 'Имутабельность',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId4,
                    name: 'Случайный задний фон по клику кнопки',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId4,
                    name: 'Ассоциативные массивы',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId4,
                    name: 'Удалить все листы разом',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId4,
                    name: 'Меню-гамбургер',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
            ],
            isDone: false,
            isPinned: false,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            pinList: pinList,
            isSelected: false,
            completeList: completeList,
            moveList: moveList,
            splitList: splitList,
            viewList: viewList,
            changeListName: changeListName,
            changeTaskName: changeTaskName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
            mergeLists: mergeLists,
            selectList: selectList,
        },
        {
            id: mockListId5,
            name: 'Пустой список без названия',
            tasks: [],
            isDone: false,
            isPinned: false,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            changeTaskName: changeTaskName,
            pinList: pinList,
            isSelected: false,
            completeList: completeList,
            moveList: moveList,
            splitList: splitList,
            viewList: viewList,
            changeListName: changeListName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
            mergeLists: mergeLists,
            selectList: selectList,
        },
        {
            id: mockListId6,
            name: 'Почитать',
            tasks: [
                {
                    id: v1(),
                    listId: mockListId6,
                    name: 'Маршрутизация в реакте',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId6,
                    name: 'Сравнение ссылок под капотом',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId6,
                    name: 'Многопоточность',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId6,
                    name: 'Асинхронные функции',
                    isDone: false,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
            ],
            isDone: false,
            isPinned: false,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            pinList: pinList,
            isSelected: false,
            completeList: completeList,
            moveList: moveList,
            splitList: splitList,
            viewList: viewList,
            changeListName: changeListName,
            changeTaskName: changeTaskName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
            mergeLists: mergeLists,
            selectList: selectList,
        },
        {
            id: mockListId7,
            name: 'Ремонт',
            tasks: [
                {
                    id: v1(),
                    listId: mockListId7,
                    name: 'Выбрать обои',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId7,
                    name: 'Разобрать старую мебель',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId7,
                    name: 'Собрать новую кухню',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
            ],
            isDone: true,
            isPinned: false,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            pinList: pinList,
            isSelected: false,
            completeList: completeList,
            moveList: moveList,
            splitList: splitList,
            viewList: viewList,
            changeListName: changeListName,
            changeTaskName: changeTaskName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
            mergeLists: mergeLists,
            selectList: selectList,
        },
        {
            id: mockListId8,
            name: 'Посмотреть',
            tasks: [
                {
                    id: v1(),
                    listId: mockListId8,
                    name: 'Вёрстка на Styled Components',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId8,
                    name: 'TDD подход к разработке',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
                {
                    id: v1(),
                    listId: mockListId8,
                    name: 'ООП, СОЛИД и вот это вот всё',
                    isDone: true,
                    isSelected: false,
                    deleteTask: deleteTask,
                    updateTask: updateTask,
                    changeTaskName: changeTaskName,
                    moveTaskVertical: moveTaskVertical,
                    moveTaskHorizontal: moveTaskHorizontal,
                },
            ],
            isDone: true,
            isPinned: false,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            pinList: pinList,
            isSelected: false,
            completeList: completeList,
            moveList: moveList,
            splitList: splitList,
            viewList: viewList,
            changeListName: changeListName,
            changeTaskName: changeTaskName,
            moveTaskVertical: moveTaskVertical,
            moveTaskHorizontal: moveTaskHorizontal,
            mergeLists: mergeLists,
            selectList: selectList,
        },
    ]

    const listsElements = lists.map(list => isListType(list) ? <List
        key={list.id}
        id={list.id}
        name={list.name}
        changeListName={changeListName}
        tasks={(list as ListType).tasks}
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

    const deleteAllLists = () => setLists([])

    const [backgroundImage, setBackgroundImage] = useState<string>(CONSTANTS.RANDOM_BACKGROUND_IMAGE_URL)

    const setBackgroundImageHandler = () => setBackgroundImage(CONSTANTS.RANDOM_BACKGROUND_IMAGE_URL)

    const addMockedListsHandler = () => setLists([...mockLists, ...lists])

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
                            name="Delete all lists"
                            onClick={deleteAllLists}
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
                        tasks={(viewableList as ListType).tasks}
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
                    />
                </div> : <Error404/>
            }/>
            <Route path={`${PATH.DASHBOARD}${PATH.LIST}${PATH.ALL}`} element={<Error404/>}/>
            <Route path={PATH.ALL} element={<Error404/>}/>
        </Routes>
    </div>
}

const isListType = (item: ItemType): boolean => (item as ListType).tasks !== undefined

const isCounterType = (item: ItemType): boolean => (item as CounterType).currentCount !== undefined