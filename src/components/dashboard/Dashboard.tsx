import React, {useState} from 'react'
import {Button} from '../button/Button'
import {Input} from '../input/Input'
import {List, ListType} from '../toDoList/List'
import {v1} from 'uuid'
import S from './Dashboard.module.css'
import '../common.css'
import {TaskType} from '../task/Task'
import {useAutoAnimate} from '@formkit/auto-animate/react'

export const Dashboard = () => {
    const [lists, setLists] = useState<ListType[]>([])

    const deleteList = (listId: string) => {
        const filteredLists = lists.filter(list => list.id !== listId)

        setLists(filteredLists)
    }

    const deleteTask = (listId: string, taskId: string) => {
        const index = lists.findIndex(list => list.id === listId)

        lists[index].tasks = lists[index].tasks.filter((task) => task.taskId !== taskId)

        setLists([...lists])
    }

    const sortCompletedLists = (index: number) => {
        lists[index].isDone = lists[index].tasks.every(task => task.isDone)

        lists.sort((listA, listB) => listA.isDone === listB.isDone ? 0 : listA.isDone ? 1 : -1)
    }

    const completedListsCount = () => lists.filter(list => list.isDone).length

    const pinnedListsCount = () => lists.filter(list => list.isPinned).length

    const tasksCount = () => lists.reduce((count, list) => count += list.tasks.length, 0)

    const completedTasksCount = () => lists.reduce((count, list) => {
        list.tasks.forEach(task => {
            if (task.isDone) count++
        })
        return count
    }, 0)

    const updateTask = (listId: string, taskId: string, isTaskChecked: boolean) => {
        const listIndex = lists.findIndex(list => list.id === listId)

        const taskIndex = lists[listIndex].tasks.findIndex(task => task.taskId === taskId)

        lists[listIndex].tasks[taskIndex].isDone = isTaskChecked

        sortCompletedLists(listIndex)

        if (lists[listIndex].isDone) {
            lists[listIndex].isPinned = false
        }

        setLists([...lists])
    }

    const pinList = (listId: string, isPinned: boolean) => {
        const index = lists.findIndex(list => list.id === listId)

        lists[index].isPinned = isPinned

        lists.sort((listA, listB) => listA.isPinned === listB.isPinned ? 0 : listA.isPinned ? -1 : 1)

        setLists([...lists])
    }

    const completedList = (listId: string, isCompleted: boolean) => {
        const index = lists.findIndex(list => list.id === listId)

        lists[index].isDone = isCompleted

        lists[index].tasks.map(task => task.isDone = isCompleted)

        setLists([...lists])
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
                if (swapIndex < 0 || swapIndex === lists.length) return

                const swapList = lists[swapIndex]
                lists[swapIndex] = lists[iteration]
                lists[iteration] = swapList
            }
        }

        setLists([...lists])
    }

    const splitList = (listId: string) => {
        const index = lists.findIndex(list => list.id === listId)

        const half = lists[index].tasks.length / 2
        if (half < 1) return

        const oldTasks = []
        const newTasks = []

        for (let iteration = 0; iteration < lists[index].tasks.length; iteration++) {
            if (iteration < half) oldTasks.push(lists[index].tasks[iteration])
            if (iteration >= half) newTasks.push(lists[index].tasks[iteration])
        }

        lists[index].tasks = oldTasks
        setLists([...lists])
        addList(newTasks)
    }

    const addTask = (listId: string, taskName: string) => {
        const index = lists.findIndex(list => list.id === listId)

        lists[index].tasks = [...lists[index].tasks, {
            taskId: v1(),
            listId: listId,
            name: taskName ? taskName : 'Task.',
            isDone: false,
            deleteTask: deleteTask,
            updateTask: updateTask,
        }]

        sortCompletedLists(index)

        setLists([...lists])
    }

    const addList = (tasks?: TaskType[]) => {
        setLists([...lists, {
            id: v1(),
            name: inputListName ? inputListName : 'To-do list #' + lists.length,
            tasks: tasks ? tasks : [],
            isDone: false,
            isPinned: false,
            deleteList: deleteList,
            addTask: addTask,
            deleteTask: deleteTask,
            updateTask: updateTask,
            pinList: pinList,
            isSelected: false,
            completeList: completedList,
            moveList: moveList,
            splitList: splitList,
        }])

        setInputListName('')
    }

    const listsElements = lists.map(list => <List
        key={list.id}
        id={list.id}
        name={list.name}
        tasks={list.tasks}
        isDone={list.isDone}
        isPinned={list.isPinned}
        deleteList={deleteList}
        addTask={addTask}
        deleteTask={deleteTask}
        updateTask={updateTask}
        pinList={pinList}
        isSelected={list.isSelected}
        completeList={completedList}
        moveList={moveList}
        splitList={splitList}
    />)

    const [inputListName, setInputListName] = useState<string>('')

    const inputListNameChangeHandler = (newListName: string) => {
        setInputListName(newListName)
    }

    const [disabled, setDisabled] = useState<boolean>(false)

    const [showMenu, setShowMenu] = useState<boolean>(false)

    const [listRef] = useAutoAnimate<HTMLUListElement>()

    return <div className={S.dashboard}>
        <main
            className={S.toDoLists}
            ref={listRef}>
            {listsElements}
        </main>
        <aside className={S.controlPanel}>
            <h1
                className={S.appTitle}
                title="Тудулия"
            >Todolia📌</h1>
            <Input
                inputValue={inputListName}
                onChangeCallback={inputListNameChangeHandler}
                placeholder={'Enter new to-do list name'}
            />
            <Button
                name="Create a new to-do list"
                onClick={addList}
                disabled={disabled}
            />
            <Button
                name={showMenu ? 'Hide statistics' : 'Show statistics'}
                onClick={() => setShowMenu(!showMenu)}
            />
            <Button
                name={'Hide menu'}
                onClick={() => {
                }}
                disabled={true}
            />
            <Button
                name={'Random wallpaper'}
                onClick={() => {
                }}
                disabled={true}
            />
            <Button
                name={'Hide lists ID'}
                onClick={() => {
                }}
                disabled={true}
            />
            <Button
                name={'Delete all lists'}
                onClick={() => {
                }}
                disabled={true}
                important={true}
            />
            {showMenu && <div className={S.submenu}>
                <table>
                    <tbody>
                    <tr>
                        <td>Total lists:</td>
                        <td>{lists.length}</td>
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
                    </tbody>
                </table>
            </div>}
        </aside>
    </div>
}