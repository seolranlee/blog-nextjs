import { format, parseISO } from 'date-fns'

export default function Date({ dateString }) {
  const date = parseISO(dateString)
  // 데이터 표기법을 정의
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>
}
