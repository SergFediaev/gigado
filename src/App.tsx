import React, {useState} from 'react'
import {Button} from './components/Button'
import {Input} from './components/Input'
import {ToDoList, ToDoListType} from './components/ToDoList'

type ToDoListsType = ToDoListType[]

export const App = () => {
    const [toDoLists, setToDoLists] = useState<ToDoListsType>([])

    const [toDoListName, setToDoListName] = useState<string>('')

    const deleteToDoList = (toDoListId: number) => {
        const filteredToDoLists = toDoLists.filter(toDoList => toDoList.id !== toDoListId)

        setToDoLists(filteredToDoLists)
    }


    const deleteItem = (toDoListId: number, itemId: number) => {
        const filtered = toDoLists[toDoListId].items.filter((item) => item.id !== itemId)
        toDoLists[toDoListId].items = filtered
        setToDoLists([...toDoLists])
    }

    const updateItem = (toDoListId: number, itemId: number, isItemChecked: boolean) => {
        toDoLists[toDoListId].items[itemId].isDone = isItemChecked
        setToDoLists([...toDoLists])
    }

    const addItem = (toDoListId: number, newItemName: string) => {
        console.log('toDoListId addItem: ', toDoListId)
        toDoLists[toDoListId].items = [...toDoLists[toDoListId].items, {
            id: toDoLists[toDoListId].items.length++ + 1,
            toDoListId: toDoListId,
            name: newItemName,
            isDone: false,
            deleteCallback: deleteItem,
            updateCallback: updateItem,

        }]
        setToDoLists([...toDoLists])
    }


    const addToDoList = () => setToDoLists([...toDoLists, {
        id: toDoLists.length++ + 1,
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