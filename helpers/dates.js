import { parse, formatISO } from 'date-fns'


export const formatDates = date => {
    const newDate = parse(date, 'dd/MM/yyyy', new Date())
    return formatISO(newDate)
}