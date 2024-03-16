import s from './Counter.module.css'
import {useState} from 'react'

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
    const [spin, setSpin] = useState(false)

    const resetHandler = () => {
        if (currentCount !== initialCount) {
            setSpin(true)
            setCount(id, 0)
        }
    }

    return <div
        className={`${s.counter} ${spin && s.spinAnimation}`}
        onAnimationEnd={() => setSpin(false)}
    >
        <h3>{name}</h3>
        <div className={s.control}>
            <button onClick={() => setCount(id, --currentCount)}>-</button>
            <span className={s.count}>{currentCount}</span>
            <button onClick={() => setCount(id, ++currentCount)}>+</button>
        </div>
        {currentCount !== initialCount && <button onClick={resetHandler}>Reset</button>}
    </div>
}