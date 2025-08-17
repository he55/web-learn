export const formatDate = (date: string) => {
  return date.slice(0, 10)
}

export const formatDateTime = (date: string) => {
  return date.replace('T', ' ').slice(0, 16)
}
