import {Task, TaskType} from '../task/Task'
import React, {MouseEvent, useState} from 'react'
import S from './ToDoList.module.css'
import {ActionButton} from '../actionButton/ActionButton'
import {InputForm} from '../inputForm/InputForm'
import {useAutoAnimate} from '@formkit/auto-animate/react'

export type ListType = {
    id: string
    name: string
    changeListName: (listId: string, newListName: string) => void
    tasks: TaskType[]
    isDone: boolean
    isPinned: boolean
    deleteList: (listId: string) => void
    addTask: (listId: string, taskName: string) => void
    deleteTask: (listId: string, taskId: string) => void
    updateTask: (listId: string, taskId: string, isTaskChecked: boolean) => void
    changeTaskName: (listId: string, taskId: string, newTaskName: string) => void
    moveTaskVertical: (listId: string, taskId: string, moveDown: boolean) => void
    moveTaskHorizontal: (listId: string, taskId: string, moveRight: boolean) => void
    pinList: (listId: string, isPinned: boolean) => void
    isSelected: boolean
    completeList: (listId: string, isComplete: boolean) => void
    moveList: (listId: string, moveLeft: boolean) => void
    splitList: (listId: string) => void
    viewList: (listId: string) => void
}

export const List = ({
                         id,
                         name,
                         changeListName,
                         tasks,
                         isDone,
                         isPinned,
                         deleteList,
                         addTask,
                         deleteTask,
                         updateTask,
                         changeTaskName,
                         pinList,
                         isSelected,
                         completeList,
                         moveList,
                         splitList,
                         viewList,
                         moveTaskVertical,
                         moveTaskHorizontal,
                     }: ListType) => {

    const tasksElements = tasks.map(task => {

        const deleteTaskHandler = (listId: string, taskId: string) => {
            deleteTask(id, taskId)
        }

        const updateTaskHandler = (listId: string, taskId: string, isTaskChecked: boolean) => {
            updateTask(id, taskId, isTaskChecked)
        }

        const changeTaskNameHandler = (listId: string, taskId: string, newTaskName: string) => {
            changeTaskName(id, taskId, newTaskName)
        }

        const moveTaskVerticalHandler = (listId: string, taskId: string, moveDown: boolean) => {
            moveTaskVertical(listId, taskId, moveDown)
        }

        const moveTaskHorizontalHandler = (listId: string, taskId: string, moveRight: boolean) => {
            moveTaskHorizontal(listId, taskId, moveRight)
        }

        return <Task
            key={task.id}
            id={task.id}
            listId={id}
            name={task.name}
            changeTaskName={changeTaskNameHandler}
            isDone={task.isDone}
            isSelected={task.isSelected}
            deleteTask={deleteTaskHandler}
            updateTask={updateTaskHandler}
            moveTaskVertical={moveTaskVerticalHandler}
            moveTaskHorizontal={moveTaskHorizontalHandler}
        />
    })

    const deleteListHandler = () => {
        deleteList(id)
    }

    const [inputTaskName, setInputTaskName] = useState<string>('')

    const addTaskHandler = () => {
        addTask(id, inputTaskName)
        setInputTaskName('')
    }

    const inputTaskNameChange = (inputTaskName: string) => {
        setInputTaskName(inputTaskName)
    }

    const [isListSelected, selectList] = useState<boolean>(isSelected)

    const selectListHandler = (event: MouseEvent<HTMLSpanElement>) => {
        if (event.ctrlKey) setListNameEditing(true)
        else selectList(!isListSelected)
    }

    const [showTooltips, setShowTooltips] = useState(false)

    const [listNameEditing, setListNameEditing] = useState<boolean>(false)

    const [listNameInput, setListNameInput] = useState<string>(name)

    const changeListNameHandler = () => {
        setListNameEditing(false)
        if (name !== listNameInput) changeListName(id, listNameInput)
    }

    const [taskRef] = useAutoAnimate<HTMLOListElement>()

    return <div
        className={`${S.toDoList} ${isDone ? S.completedToDoList : isPinned ? S.pinnedToDoList : undefined} ${isListSelected && S.selected}`}>
        <h2>{isPinned && '📍 '}{isDone && '✅ '}{listNameEditing ? <textarea
            className={S.editable}
            value={listNameInput}
            onChange={(event) => setListNameInput(event.currentTarget.value)}
            onBlur={changeListNameHandler}
            autoFocus
        /> : <span
            className={`${isDone && S.completedToDoListName} ${S.listTitle}`}
            onClick={(event) => selectListHandler(event)}
        >{name}</span>}</h2>
        {isListSelected && <div className={S.control}>
            <ActionButton
                name={showTooltips ? 'Hide tooltips' : 'Show tooltips'}
                icon={showTooltips ? '🙈' : '❓'}
                onClickCallback={() => setShowTooltips(!showTooltips)}
                tooltips={showTooltips}
            />
            <ActionButton
                name={isPinned ? 'Unpin' : 'Pin'}
                icon={isPinned ? '📌' : '📍'}
                onClickCallback={() => pinList(id, !isPinned)}
                tooltips={showTooltips}
            />
            <ActionButton
                name={isDone ? 'Uncomplete' : 'Complete'}
                icon={isDone ? '❎' : '✅'}
                onClickCallback={() => completeList(id, !isDone)}
                tooltips={showTooltips}
            />
            <ActionButton
                name="Move left"
                icon="⬅️"
                onClickCallback={() => moveList(id, true)}
                tooltips={showTooltips}
            />
            <ActionButton
                name="Move right"
                icon="➡️"
                onClickCallback={() => moveList(id, false)}
                tooltips={showTooltips}
            />
            {tasks.length > 1 && <ActionButton
                name="Split"
                icon="🔪"
                onClickCallback={() => splitList(id)}
                tooltips={showTooltips}
            />}
            <ActionButton
                name="View"
                icon="👀"
                onClickCallback={() => viewList(id)}
                tooltips={showTooltips}
            />
            <ActionButton
                name="Delete"
                icon="🗑️"
                onClickCallback={deleteListHandler}
                important
                tooltips={showTooltips}
            />
        </div>}
        <p className={S.listId}>List ID: {id}</p>
        <ol
            ref={taskRef}
            className={S.tasks}
        >{tasksElements.length > 0 ? tasksElements :
            <span>The task list is empty for now. Added tasks will be displayed here.</span>}
        </ol>
        <InputForm
            inputValue={inputTaskName}
            placeholder="Enter new task"
            onChange={inputTaskNameChange}
            buttonIcon="➕"
            onClick={addTaskHandler}
        />
    </div>
}