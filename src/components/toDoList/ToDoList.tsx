import {ToDoListItem, ToDoListItemType} from '../task/ToDoListItem'
import {Button} from '../button/Button'
import {Input} from '../input/Input'
import {useState} from 'react'
import S from './ToDoList.module.css'

export type ToDoListType = {
    id: string
    name: string
    items: ToDoListItemType[]
    isDone: boolean
    isPinned: boolean
    deleteCallback: (toDoListId: string) => void
    addItemCallback: (toDoListId: string, itemName: string) => void
    deleteItemCallback: (toDoListId: string, itemId: string) => void
    updateItemCallback: (toDoListId: string, itemId: string, isItemChecked: boolean) => void
    pinCallback: (toDoListId: string, isPinned: boolean) => void
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
                             pinCallback,
                         }: ToDoListType) => {

    const itemElements = items.map(item => {
        const deleteItem = (toDoListId: string, itemId: string) => {
            deleteItemCallback(id, itemId)
        }

        const updateItem = (toDoListId: string, itemId: string, isItemChecked: boolean) => {
            updateItemCallback(id, itemId, isItemChecked)
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

    const onDeleteHandler = () => {
        deleteCallback(id)
    }

    const [newItemName, setNewItemName] = useState<string>('')

    const addNewItem = () => {
        addItemCallback(id, newItemName)
        setNewItemName('')
    }

    const onInputValueChange = (newInputValue: string) => {
        setNewItemName(newInputValue)
    }
    console.log('inside todolist is pinned: ', isPinned)

    return <div className={`${S.toDoList} ${isDone ? S.completedToDoList : isPinned ? S.pinnedToDoList : undefined}`}>
        <h2>{isPinned && '📌 '}{isDone && '✅ '}<span className={`${isDone && S.completedToDoListName}`}>{name}</span>
        </h2>
        <p className={S.listId}>List ID: {id}</p>
        <ol className={S.tasks}>
            {itemElements.length > 0 ? itemElements :
                <span>The task list is empty for now. Added tasks will be displayed here.</span>}
        </ol>
        <Input
            inputValue={newItemName}
            onChangeCallback={onInputValueChange}
            placeholder={'Enter new task'}
        />
        <Button
            name="Add new task"
            onClick={addNewItem}
        />
        {isDone ? undefined : <Button
            name={isPinned ? 'Unpin list' : 'Pin list'}
            onClick={() => pinCallback(id, !isPinned)}
        />}
        <Button
            name="Delete list"
            onClick={onDeleteHandler}
            important
        />
    </div>
}