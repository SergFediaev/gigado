import {ChangeEvent} from 'react'
import S from './ToDoListItem.module.css'

export type TaskType = {
    taskId: string
    listId: string
    name: string
    isDone: boolean
    deleteTask: (listId: string, taskId: string) => void
    updateTask: (listId: string, taskId: string, isTaskChecked: boolean) => void
}

export const Task = ({taskId, listId, name, isDone, deleteTask, updateTask}: TaskType) => {
    const onClickHandler = () => deleteTask(listId, taskId)

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => updateTask(listId, taskId, event.currentTarget.checked)

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