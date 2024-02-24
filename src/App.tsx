import React, {useState} from 'react'
import {Button} from './components/Button'
import {Input} from './components/Input'
import {ToDoList, ToDoListType} from './components/ToDoList'
import {v1} from 'uuid'

type ToDoListsType = ToDoListType[]

export const App = () => {
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

    const updateItem = (toDoListId: string, itemId: string, isItemChecked: boolean) => {
        const foundedToDoListIndex = toDoLists.findIndex(toDoList => toDoList.id === toDoListId)

        const foundedItemIndex = toDoLists[foundedToDoListIndex].items.findIndex(item => item.id === itemId)

        toDoLists[foundedToDoListIndex].items[foundedItemIndex].isDone = isItemChecked

        setToDoLists([...toDoLists])
    }

    const addItem = (toDoListId: string, newItemName: string) => {
        const foundedToDoListIndex = toDoLists.findIndex(toDoList => toDoList.id === toDoListId)

        toDoLists[foundedToDoListIndex].items = [...toDoLists[foundedToDoListIndex].items, {
            id: v1(),
            toDoListId: toDoListId,
            name: newItemName,
            isDone: false,
            deleteCallback: deleteItem,
            updateCallback: updateItem,
        }]

        setToDoLists([...toDoLists])
    }

    const addToDoList = () => setToDoLists([...toDoLists, {
        id: v1(),
        name: inputValue,
        items: [],
        isDone: false,
        isPinned: true,
        deleteCallback: deleteToDoList,
        addItemCallback: addItem,
        deleteItemCallback: deleteItem,
        updateItemCallback: updateItem,
    }])

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
        updateItemCallback={updateItem}/>)

    const [inputValue, setInputValue] = useState<string>('')

    const onInputChangeValueHandler = (newInputValue: string) => setInputValue(newInputValue)

    return <>
        <Input
            inputValue={inputValue}
            onChangeCallback={onInputChangeValueHandler}/><Button
        name="Create a new to-do list"
        onClick={addToDoList}/>
        <div>
            {toDoListsElements}
        </div>
    </>
}