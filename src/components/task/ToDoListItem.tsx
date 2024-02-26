import {ChangeEvent} from 'react'
import S from './ToDoListItem.module.css'

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

    return <li className={S.task}>
        <button onClick={onClickHandler}>❌</button>
        <input
            type="checkbox"
            checked={isDone}
            onChange={onChangeHandler}
            className={S.taskStatus}
        />
        <span className={`${isDone && S.doneTask}`}>{name}</span>
    </li>
}