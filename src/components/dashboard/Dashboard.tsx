import React, {useState} from 'react'
import {Button} from '../button/Button'
import {Input} from '../input/Input'
import {ToDoList, ToDoListType} from '../toDoList/ToDoList'
import {v1} from 'uuid'
import S from './Dashboard.module.css'
import '../common.css'

type ToDoListsType = {
    [toDoListId: string]: ToDoListType
}

export const Dashboard = () => {
    const [toDoLists, setToDoLists] = useState<ToDoListsType>({})

    const deleteToDoList = (toDoListId: string) => {
        delete toDoLists[toDoListId]

        setToDoLists({...toDoLists})
    }

    const deleteItem = (toDoListId: string, itemId: string) => {
        toDoLists[toDoListId].items = toDoLists[toDoListId].items.filter((item) => item.id !== itemId)

        setToDoLists({...toDoLists})
    }

    const sortCompletedToDoLists = (toDoListId: string) => {
        toDoLists[toDoListId].isDone = toDoLists[toDoListId].items.every(item => item.isDone)

        return Object.fromEntries(Object.entries(toDoLists).sort(([, a], [, b]) => a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1))
    }

    const completedToDoLists = () => Object.values(toDoLists).filter(toDoList => toDoList.isDone).length

    const pinnedToDoLists = () => Object.values(toDoLists).filter(toDoList => toDoList.isPinned).length

    const totalTasks = () => Object.values(toDoLists).reduce((tasks, toDoList) => tasks += toDoList.items.length, 0)

    const completedTasks = () => Object.values(toDoLists).reduce((completedTasks, toDoList) => {
        toDoList.items.forEach(item => {
            if (item.isDone) completedTasks++
        })
        return completedTasks
    }, 0)

    const updateItem = (toDoListId: string, itemId: string, isItemChecked: boolean) => {
        const foundedItemIndex = toDoLists[toDoListId].items.findIndex(item => item.id === itemId)

        toDoLists[toDoListId].items[foundedItemIndex].isDone = isItemChecked

        const sortedCompletedToDoLists = sortCompletedToDoLists(toDoListId)

        if (sortedCompletedToDoLists[toDoListId].isDone) {
            console.log('Founded list is done')
            sortedCompletedToDoLists[toDoListId].isPinned = false
            console.log('Founded list pinned: ', sortedCompletedToDoLists[toDoListId].isPinned)
        }

        console.log('Update Item in sortedCompletedToDoLists.isDOne? ', sortedCompletedToDoLists[toDoListId].isDone)

        setToDoLists(sortedCompletedToDoLists)
    }

    const setPin = (toDoListId: string, isPinned: boolean) => {
        toDoLists[toDoListId].isPinned = isPinned

        const sortedPinnedToDoLists = Object.fromEntries(Object.entries(toDoLists).sort(([, a], [, b]) => a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1))

        setToDoLists({...sortedPinnedToDoLists})
    }

    const addItem = (toDoListId: string, newItemName: string) => {
        toDoLists[toDoListId].items = [...toDoLists[toDoListId].items, {
            id: v1(),
            toDoListId: toDoListId,
            name: newItemName ? newItemName : 'Task.',
            isDone: false,
            deleteCallback: deleteItem,
            updateCallback: updateItem,
        }]

        const sortedCompletedToDoLists = sortCompletedToDoLists(toDoListId)

        setToDoLists(sortedCompletedToDoLists)
    }

    const addToDoList = () => {
        const newToDoListId = v1()

        toDoLists[newToDoListId] = {
            id: newToDoListId,
            name: inputValue ? inputValue : 'To-do list #' + toDoLists.length,
            items: [],
            isDone: false,
            isPinned: false,
            deleteCallback: deleteToDoList,
            addItemCallback: addItem,
            deleteItemCallback: deleteItem,
            updateItemCallback: updateItem,
            pinCallback: setPin,
        }

        setToDoLists({...toDoLists})
        setInputValue('')
    }

    const toDoListsElements = Object.values(toDoLists).map(toDoList => <ToDoList
        key={toDoList.id}
        id={toDoList.id}
        name={toDoList.name}
        items={toDoList.items}
        isDone={toDoList.isDone}
        isPinned={toDoList.isPinned}
        deleteCallback={deleteToDoList}
        addItemCallback={addItem}
        deleteItemCallback={deleteItem}
        updateItemCallback={updateItem}
        pinCallback={setPin}
    />)

    const [inputValue, setInputValue] = useState<string>('')

    const onInputChangeValueHandler = (newInputValue: string) => {
        setInputValue(newInputValue)
    }

    const [disabled, setDisabled] = useState<boolean>(false)

    const [showMenu, setShowMenu] = useState<boolean>(false)

    return <div className={S.dashboard}>
        <main className={S.toDoLists}>
            {toDoListsElements}
        </main>
        <aside className={S.controlPanel}>
            <h1
                className={S.appTitle}
                title="Тудулия"
            >Todolia📌</h1>
            <Input
                inputValue={inputValue}
                onChangeCallback={onInputChangeValueHandler}
                placeholder={'Enter new to-do list name'}
            />
            <Button
                name="Create a new to-do list"
                onClick={addToDoList}
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
                        <td>{Object.values(toDoLists).length}</td>
                    </tr>
                    <tr>
                        <td>Completed lists:</td>
                        <td>{completedToDoLists()}</td>
                    </tr>
                    <tr>
                        <td>Pinned lists:</td>
                        <td>{pinnedToDoLists()}</td>
                    </tr>
                    <tr>
                        <td>Total tasks:</td>
                        <td>{totalTasks()}</td>
                    </tr>
                    <tr>
                        <td>Completed tasks:</td>
                        <td>{completedTasks()}</td>
                    </tr>
                    </tbody>
                </table>
            </div>}
        </aside>
    </div>
}