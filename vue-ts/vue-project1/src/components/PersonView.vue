<script setup lang="ts">
import type { PersonList, Person } from '@/types'

interface PersonProps {
  persons?: PersonList
}

const { persons = [] } = defineProps<PersonProps>()

defineEmits<{
  remove: [item: Person]
}>()
</script>

<template>
  <div class="box">
    <ul>
      <li v-for="item in persons" :key="item.id">
        {{ item.name }} -- {{ item.age }}
        <button @click="$emit('remove', item)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.box {
  background-color: bisque;
  border: 2px solid red;
}
ul {
  font-size: 18px;
}
</style>
