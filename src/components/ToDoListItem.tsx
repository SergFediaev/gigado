import {ChangeEvent} from 'react'

export type ToDoListItemType = {
    id: string
    toDoListId: string
    name: string
    isDone: boolean
    deleteCallback: (toDoListId: string, itemId: string) => void
    updateCallback: (toDoListId: string, itemId: string, isItemChecked: boolean) => void
}

export const ToDoListItem = ({id, toDoListId, name, isDone, deleteCallback, updateCallback}: ToDoListItemType) => {
    const onClickHandler = () => deleteCallback(toDoListId, id)

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => updateCallback(toDoListId, id, event.currentTarget.checked)

    return <li>
        List: {toDoListId} Task: {id}
        <button onClick={onClickHandler}>❌</button>
        <input type="checkbox" checked={isDone} onChange={onChangeHandler}/>
        {name}
    </li>
}