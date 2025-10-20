export type DataItem = {
  id: number
  doctor: string
  patient: string
  method: string
  status: string
  created_at: string
}

export const getList = async () => {
  const res = await fetch('/api/getList.json')
  const list: DataItem[] = await res.json()
  return list
}
