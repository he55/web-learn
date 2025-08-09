import { reactive } from 'vue'
import type { Person, PersonList } from '@/types'

export default function () {
  const list = reactive<PersonList>([
    { id: 12, name: 'zhang', age: 18 },
    { id: 34, name: 'liu', age: 25 },
    { id: 65, name: 'he', age: 5 },
  ])

  function addPerson() {
    const data: Person = { id: 98, name: 'lili', age: 22 }
    list.push(data)
  }
  function removePerson(item: Person) {
    if (list.length < 2) {
      alert('不能移除所有项目')
      return
    }

    list.splice(list.indexOf(item), 1)
  }
  return { list, addPerson, removePerson }
}
