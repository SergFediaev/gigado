import {ToDoListItem, ToDoListItemType} from './ToDoListItem'
import {Button} from './Button'
import {Input} from './Input'
import {useState} from 'react'

export type ToDoListType = {
    id: number
    name: string
    items: ToDoListItemType[]
    isDone: boolean
    isPinned: boolean
    deleteCallback: (toDoListId: number) => void
    addItemCallback: (toDoListId: number, itemName: string) => void
    deleteItemCallback: (toDoListId: number, itemId: number) => void
    updateItemCallback: (toDoListId: number, itemId: number, isItemChecked: boolean) => void
}

export const ToDoList = ({
                             id,
                             name,
                             items,
                             isDone,
                             isPinned,
                             deleteCallback,
                             addItemCallback,
                             deleteItemCallback,
                             updateItemCallback,
                         }: ToDoListType) => {

    const itemElements = items.map(item => {
        const deleteItem = (itemId: number) => {
            deleteItemCallback(--id, itemId)
        }

        const updateItem = (toDoListId: number, itemId: number, isItemChecked: boolean) => {
            updateItemCallback(--id, --itemId, isItemChecked)
        }

        return <ToDoListItem
            key={item.id}
            id={item.id}
            toDoListId={id}
            name={item.name}
            isDone={item.isDone}
            deleteCallback={deleteItem}
            updateCallback={updateItem}
        />
    })

    const doneStyle = {
        opacity: .5,
    }

    const undoneStyle = {
        backgroundColor: 'yellow',
        opacity: 1,
    }

    const onDeleteHandler = () => {
        deleteCallback(id)
    }

    const [newItemName, setNewItemName] = useState<string>('')

    const addNewItem = () => {
        addItemCallback(--id, newItemName)
    }

    const onInputValueChange = (newInputValue: string) => {
        setNewItemName(newInputValue)
    }

    return <div style={isDone ? doneStyle : undoneStyle}>
        <h2>№ {id} {name} {isPinned && '📌'}</h2>
        <ul>
            {itemElements}
        </ul>

        <Input inputValue={newItemName} onChangeCallback={onInputValueChange}/><Button
        name="Add new item" onClick={addNewItem}/>
        <Button name="Delete" onClick={onDeleteHandler}/>
    </div>
}