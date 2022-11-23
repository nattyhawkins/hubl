import moment from 'moment'

export function unixTimestamp(timestamp){
  return moment(timestamp).format('X')
}  

export function getTimeElapsed(timestamp) {
  const now = new Date()
  const mins = Math.round((unixTimestamp(now) - unixTimestamp(timestamp)) / 60)
  const hours = Math.round(mins / 60)
  const days = Math.round(hours / 24)
  if (mins < 1) return 'Just now'
  if (mins < 2) return '1 minute ago'
  if (mins < 60) return mins + ' minutes ago'
  if (mins <= 90) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  if (hours < 48) return moment(timestamp).format('[Yesterday at] LT')
  if (days < 7) return moment(timestamp).format('ddd LT')
  if (days < 360) return moment(timestamp).format('MMM D LT')
  else return moment(timestamp).format('ll LT')
}