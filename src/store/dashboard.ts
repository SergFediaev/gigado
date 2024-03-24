import {OptionType} from '../components/select/Select'
import {EMOJIS, STRINGS} from '../strings/strings'

export type DashboardItemOptionType =
    typeof STRINGS.LIST
    | typeof STRINGS.COUNTER
    | typeof STRINGS.NOTE
    | typeof STRINGS.PICTURE
    | typeof STRINGS.PLAYLIST

export const dashboardItemOptions: OptionType[] = [
    {
        icon: EMOJIS.LIST,
        name: STRINGS.LIST,
    },
    {
        icon: EMOJIS.COUNTER,
        name: STRINGS.COUNTER,
    },
    {
        icon: EMOJIS.NOTE,
        name: STRINGS.NOTE,
    },
    {
        icon: EMOJIS.PICTURE,
        name: STRINGS.PICTURE,
    },
    {
        icon: EMOJIS.PLAYLIST,
        name: STRINGS.PLAYLIST,
    },
]