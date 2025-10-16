export type DataItem = {
  no: number
  doctor: string
  patient: string
  method: string
  status: string
}

export const getList = async () => {
  const res = await fetch('/api/getList.json')
  const list: DataItem[] = await res.json()
  return list
}
