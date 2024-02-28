import {ToDoListItem, ToDoListItemType} from '../task/ToDoListItem'
import {Button} from '../button/Button'
import {Input} from '../input/Input'
import {useState} from 'react'
import S from './ToDoList.module.css'
import {ActionButton} from '../actionButton/ActionButton'

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
    isSelected: boolean
    completeListCallback: (listId: string, isComplete: boolean) => void
    moveListCallback: (listId: string, moveLeft: boolean) => void
    splitListCallback: (listId: string) => void
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
                             isSelected,
                             completeListCallback,
                             moveListCallback,
                             splitListCallback,
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

    const [select, setSelect] = useState<boolean>(isSelected)

    const onSelectHandler = () => {
        setSelect(!select)
    }

    const [showTooltips, setShowTooltips] = useState(false)

    return <div
        className={`${S.toDoList} ${isDone ? S.completedToDoList : isPinned ? S.pinnedToDoList : undefined} ${select && S.selected}`}>
        <h2>{isPinned && '📍 '}{isDone && '✅ '}<span
            className={`${isDone && S.completedToDoListName} ${S.listTitle}`}
            onClick={onSelectHandler}>{name}</span>
        </h2>
        {select && <div className={S.control}>
            <ActionButton
                name={showTooltips ? 'Hide tooltips' : 'Show tooltips'}
                icon={showTooltips ? '🙈' : '❓'}
                onClickCallback={() => setShowTooltips(!showTooltips)}
                tooltips={showTooltips}
            />
            <ActionButton
                name={isPinned ? 'Unpin' : 'Pin'}
                icon={isPinned ? '📌' : '📍'}
                onClickCallback={() => pinCallback(id, !isPinned)}
                tooltips={showTooltips}
            />
            <ActionButton
                name={isDone ? 'Uncomplete' : 'Complete'}
                icon={isDone ? '❎' : '✅'}
                onClickCallback={() => completeListCallback(id, !isDone)}
                tooltips={showTooltips}
            />
            <ActionButton
                name="Move left"
                icon="⬅️"
                onClickCallback={() => moveListCallback(id, true)}
                tooltips={showTooltips}
            />
            <ActionButton
                name="Move right"
                icon="➡️"
                onClickCallback={() => moveListCallback(id, false)}
                tooltips={showTooltips}
            />
            {items.length > 1 && <ActionButton
                name="Split"
                icon="💔"
                onClickCallback={() => splitListCallback(id)}
                tooltips={showTooltips}
            />}
            <ActionButton
                name="Delete"
                icon="❌"
                onClickCallback={onDeleteHandler}
                important
                tooltips={showTooltips}
            />
        </div>}
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
    </div>
}