import {ChangeEvent} from 'react'

export type ToDoListItemType = {
    id: number
    toDoListId: number
    name: string
    isDone: boolean
    deleteCallback: (toDoListId: number, itemId: number) => void
    updateCallback: (toDoListId: number, itemId: number, isItemChecked: boolean) => void
}

export const ToDoListItem = ({id, toDoListId, name, isDone, deleteCallback, updateCallback}: ToDoListItemType) => {

    const onClickHandler = () => {
        deleteCallback(toDoListId, id)
    }

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event.currentTarget.checked)
        updateCallback(toDoListId, id, event.currentTarget.checked)
    }

    return <li>
        List: {toDoListId} Task: {id}
        <button onClick={onClickHandler}>❌</button>
        <input type="checkbox" checked={isDone} onChange={onChangeHandler}/>
        {name}
    </li>
}