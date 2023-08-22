import { parse, formatISO, format} from 'date-fns'
import es from 'date-fns/locale/es/index.js'


export const formatDates = date => {
    const newDate = parse(date, 'dd/MM/yyyy', new Date())
    return formatISO(newDate)
}


export const formatEmailDate = date => {
    return format(date, 'PPPP', {locale: es})
}