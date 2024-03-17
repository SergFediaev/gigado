import s from './Error404.module.css'
import {Button} from '../button/Button'
import {useNavigate} from 'react-router-dom'
import {PATHS} from '../../strings/paths'

export const Error404 = () => {
    const navigate = useNavigate()

    return <div className={s.error}>
        <div className={s.marquee}>
            <ul className={s.marquee__list}>
                <li>Page not found 404</li>
                <li>Страница не найдена 404</li>
            </ul>
            <ul className={s.marquee__list} aria-hidden="true">
                <li>Page not found 404</li>
                <li>Страница не найдена 404</li>
            </ul>
        </div>
        <div className={s.overlay}>
            <Button name="Back to dashboard 📊" onClick={() => navigate(PATHS.DASHBOARD)}/>
        </div>
    </div>
}