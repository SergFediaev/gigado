import s from './Counter.module.css'
import {useState} from 'react'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import {settings} from '../../store/settings'
import {RENDERING} from '../../strings/strings'

type CounterPropsType = {
    id: string
    name: string
    initialCount: number
    currentCount: number
    limitCount: number
    setCount: (counterId: string, count: number) => void
    isDone: boolean
}

export const Counter = ({
                            id,
                            name,
                            initialCount,
                            currentCount,
                            setCount,
                        }: CounterPropsType) => {
    if (settings.dev.logMainRender) console.log(RENDERING.COUNTER_NAME, name)

    const [spin, setSpin] = useState(false)
    const [editing, setEditing] = useState(false)
    const [animate] = useAutoAnimate<HTMLDivElement>()

    const resetHandler = () => {
        if (currentCount !== initialCount) {
            setSpin(true)
            setCount(id, 0)
        }
    }

    return <div>
        {editing ? <div ref={animate}>
            <div className={s.top}>
                <h3 onClick={() => setEditing(false)}>{name}</h3>
            </div>
            <div className={s.bottom}>
                <span className={s.count}>{currentCount}</span>
                {currentCount !== initialCount && <button onClick={resetHandler}>Reset</button>}
            </div>
        </div> : <div
            className={`${s.counter} ${spin && s.spinAnimation}`}
            onAnimationEnd={() => setSpin(false)}
            ref={animate}
        >
            <h3 onClick={() => setEditing(true)}>{name}</h3>
            <div className={s.control}>
                <button onClick={() => setCount(id, --currentCount)}>-</button>
                <span className={s.count}>{currentCount}</span>
                <button onClick={() => setCount(id, ++currentCount)}>+</button>
            </div>
            {currentCount !== initialCount && <button onClick={resetHandler}>Reset</button>}
        </div>}
    </div>
}