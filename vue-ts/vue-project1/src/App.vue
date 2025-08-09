<script setup lang="ts">
import usePerson from '@/hooks/usePerson'
import PersonView from '@/components/PersonView.vue'

const { list, addPerson, removePerson } = usePerson()
</script>

<template>
  <div class="container">
    <h1>
      You did it!
      <button class="btn-add" @click="addPerson">Add Person</button>
    </h1>

    <PersonView :persons="list" @remove="removePerson" />
  </div>
</template>

<style scoped>
.container {
  padding: 10px;
  border: 2px solid purple;
  border-radius: 10px;
}
.btn-add {
  padding: 5px;
  font-size: 15px;
  vertical-align: middle;
}
</style>
