import React, {useState} from 'react'
import {Button} from '../button/Button'
import {Input} from '../input/Input'
import {ToDoList, ToDoListType} from '../toDoList/ToDoList'
import {v1} from 'uuid'
import S from './Dashboard.module.css'
import '../common.css'

type ToDoListsType = ToDoListType[]

export const Dashboard = () => {
    const [toDoLists, setToDoLists] = useState<ToDoListsType>([])

    const deleteToDoList = (toDoListId: string) => {
        const filteredToDoLists = toDoLists.filter(toDoList => toDoList.id !== toDoListId)

        setToDoLists(filteredToDoLists)
    }

    const deleteItem = (toDoListId: string, itemId: string) => {
        const foundedToDoListIndex = toDoLists.findIndex(toDoList => toDoList.id === toDoListId)

        toDoLists[foundedToDoListIndex].items = toDoLists[foundedToDoListIndex].items.filter((item) => item.id !== itemId)

        setToDoLists([...toDoLists])
    }

    const sortCompletedToDoLists = (foundedToDoListIndex: number) => {
        toDoLists[foundedToDoListIndex].isDone = toDoLists[foundedToDoListIndex].items.every(item => item.isDone)

        toDoLists.sort((a, b) => a.isDone === b.isDone ? 0 : a.isDone ? 1 : -1)
    }

    const completedToDoLists = () => toDoLists.filter(toDoList => toDoList.isDone).length

    const pinnedToDoLists = () => toDoLists.filter(toDoList => toDoList.isPinned).length

    const totalTasks = () => toDoLists.reduce((tasks, toDoList) => tasks += toDoList.items.length, 0)

    const completedTasks = () => toDoLists.reduce((completedTasks, toDoList) => {
        toDoList.items.forEach(item => {
            if (item.isDone) completedTasks++
        })
        return completedTasks
    }, 0)

    const updateItem = (toDoListId: string, itemId: string, isItemChecked: boolean) => {
        const foundedToDoListIndex = toDoLists.findIndex(toDoList => toDoList.id === toDoListId)

        const foundedItemIndex = toDoLists[foundedToDoListIndex].items.findIndex(item => item.id === itemId)

        toDoLists[foundedToDoListIndex].items[foundedItemIndex].isDone = isItemChecked

        sortCompletedToDoLists(foundedToDoListIndex)

        if (toDoLists[foundedToDoListIndex].isDone) {
            console.log('Founded list is done')
            toDoLists[foundedToDoListIndex].isPinned = false
            console.log('Founded list pinned: ', toDoLists[foundedToDoListIndex].isPinned)

        }

        console.log('Update Item in todolis.isDOne? ', toDoLists[foundedToDoListIndex].isDone)

        setToDoLists([...toDoLists])
    }

    const setPin = (toDoListId: string, isPinned: boolean) => {
        const foundedToDoListIndex = toDoLists.findIndex(toDoList => toDoList.id === toDoListId)

        toDoLists[foundedToDoListIndex].isPinned = isPinned

        toDoLists.sort((a, b) => a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1)

        setToDoLists([...toDoLists])
    }

    const addItem = (toDoListId: string, newItemName: string) => {
        const foundedToDoListIndex = toDoLists.findIndex(toDoList => toDoList.id === toDoListId)

        toDoLists[foundedToDoListIndex].items = [...toDoLists[foundedToDoListIndex].items, {
            id: v1(),
            toDoListId: toDoListId,
            name: newItemName ? newItemName : 'Task.',
            isDone: false,
            deleteCallback: deleteItem,
            updateCallback: updateItem,
        }]

        sortCompletedToDoLists(foundedToDoListIndex)

        setToDoLists([...toDoLists])
    }

    const addToDoList = () => {
        setToDoLists([...toDoLists, {
            id: v1(),
            name: inputValue ? inputValue : 'To-do list #' + toDoLists.length,
            items: [],
            isDone: false,
            isPinned: false,
            deleteCallback: deleteToDoList,
            addItemCallback: addItem,
            deleteItemCallback: deleteItem,
            updateItemCallback: updateItem,
            pinCallback: setPin,
        }])

        setInputValue('')
    }

    const toDoListsElements = toDoLists.map(toDoList => <ToDoList
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
                        <td>{toDoLists.length}</td>
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