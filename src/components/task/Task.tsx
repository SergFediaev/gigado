import React, {ChangeEvent, MouseEvent, useState} from 'react'
import s from './Task.module.css'
import {ActionButton} from '../actionButton/ActionButton'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import {settings} from '../../store/settings'
import {RENDERING} from '../../strings/strings'

export type TaskPropsType = {
    id: string
    listId: string
    name: string
    isDone: boolean
    isSelected: boolean
    deleteTask: (listId: string, taskId: string) => void
    updateTask: (listId: string, taskId: string, isTaskChecked: boolean) => void
    changeTaskName: (listId: string, id: string, newTaskName: string) => void
    moveTaskVertical: (listId: string, taskId: string, moveDown: boolean) => void
    moveTaskHorizontal: (listId: string, taskId: string, moveRight: boolean) => void
    tasksCount: number
    listsCount: number
}

export const Task = ({
                         id,
                         listId,
                         name,
                         changeTaskName,
                         isDone,
                         isSelected,
                         deleteTask,
                         updateTask,
                         moveTaskVertical,
                         moveTaskHorizontal,
                         tasksCount,
                         listsCount,
                     }: TaskPropsType) => {
    if (settings.dev.logTasksRender) console.log(RENDERING.TASK_NAME, name)

    const onClickHandler = () => deleteTask(listId, id)

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => updateTask(listId, id, event.currentTarget.checked)

    const [editing, setEditing] = useState<boolean>(false)

    const [selected, setSelected] = useState<boolean>(isSelected)

    const [taskNameInput, setTaskNameInput] = useState<string>(name)

    const changeTaskNameHandler = () => {
        if (name !== taskNameInput) changeTaskName(listId, id, taskNameInput)
        setEditing(false)
    }

    const onTaskNameClickHandler = (event: MouseEvent<HTMLSpanElement>) => {
        if (event.ctrlKey) setEditing(true)
        else setSelected(!selected)
    }

    const [showTooltips, setShowTooltips] = useState(false)

    const [animateTaskRef] = useAutoAnimate<HTMLElement>()

    return <>
        <li
            className={`${s.task} ${selected && s.taskSelected}`}
            ref={animateTaskRef}
        >
            <div className={s.taskContainer}>
                {editing ? <textarea
                    className={s.editable}
                    value={taskNameInput}
                    onChange={(event) => setTaskNameInput(event.currentTarget.value)}
                    onBlur={changeTaskNameHandler}
                /> : <>
                    <input
                        type="checkbox"
                        checked={isDone}
                        onChange={onChangeHandler}
                        className={s.taskStatus}
                    />
                    <span
                        className={`${s.taskName} ${isDone && s.doneTask}`}
                        onClick={onTaskNameClickHandler}
                    >{name}</span>
                </>}
            </div>
            {selected && <div className={s.control}>
                <ActionButton
                    name={showTooltips ? 'Hide tooltips' : 'Show tooltips'}
                    icon={showTooltips ? '🙈' : '❓'}
                    onClickCallback={() => setShowTooltips(!showTooltips)}
                    tooltips={showTooltips}
                />
                <ActionButton
                    name="Delete"
                    icon="🗑️"
                    onClickCallback={onClickHandler}
                    tooltips={showTooltips}
                />
                {tasksCount > 1 && <>
                    <ActionButton
                        name="Move up"
                        icon="⬆️"
                        onClickCallback={() => moveTaskVertical(listId, id, false)}
                        tooltips={showTooltips}
                    />
                    <ActionButton
                        name="Move down"
                        icon="⬇️"
                        onClickCallback={() => moveTaskVertical(listId, id, true)}
                        tooltips={showTooltips}
                    />
                </>}
                {listsCount > 1 && <>
                    <ActionButton
                        name="Move left"
                        icon="⬅️"
                        onClickCallback={() => moveTaskHorizontal(listId, id, false)}
                        tooltips={showTooltips}
                    />
                    <ActionButton
                        name="Move right"
                        icon="➡️"
                        onClickCallback={() => moveTaskHorizontal(listId, id, true)}
                        tooltips={showTooltips}
                    />
                </>}
            </div>
            }
        </li>
    </>
}