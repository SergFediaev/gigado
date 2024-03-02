import {ChangeEvent} from 'react'
import S from './ToDoListItem.module.css'

export type TaskType = {
    id: string
    listId: string
    name: string
    isDone: boolean
    deleteTask: (listId: string, taskId: string) => void
    updateTask: (listId: string, taskId: string, isTaskChecked: boolean) => void
}

export const Task = ({id, listId, name, isDone, deleteTask, updateTask}: TaskType) => {
    const onClickHandler = () => deleteTask(listId, id)

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => updateTask(listId, id, event.currentTarget.checked)

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