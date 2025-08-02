<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'

const highlight = new Highlight()
CSS.highlights.set('search-text', highlight)

const search = ref('')
const p_ele = useTemplateRef('p_ele')
let textNode: Node

onMounted(() => {
  textNode = p_ele.value!.firstChild!
  console.log('my_name', import.meta.env.VITE_MY_NAME)
})

watch(search, (newValue) => {
  highlight.clear()

  if (!newValue) {
    return
  }

  const regex = new RegExp(newValue, 'gi')
  while (regex.test(textNode.textContent!)) {
    const range = new Range()
    range.setStart(textNode, regex.lastIndex - newValue.length)
    range.setEnd(textNode, regex.lastIndex)
    highlight.add(range)
  }
})
</script>

<template>
  <div class="container">
    <div><input type="search" v-model="search" /></div>
    <p class="content" ref="p_ele">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit. Optio harum velit voluptatibus fugit
      ratione sint numquam eaque qui atque corporis nostrum mollitia voluptate, eligendi facilis
      enim reiciendis minus ea illo. Lorem ipsum dolor sit amet consectetur, adipisicing elit.
      Nostrum cum officiis nemo fuga quidem rerum numquam iste officia ipsa laboriosam, animi et
      voluptate voluptatum eligendi doloremque eaque! Distinctio, a voluptatum. Lorem, ipsum dolor
      sit amet consectetur adipisicing elit. Dignissimos illo quis culpa, voluptas molestiae
      perferendis suscipit maiores soluta nostrum obcaecati optio rerum molestias. Labore non,
      obcaecati impedit eveniet commodi maiores.
    </p>
  </div>
</template>

<style scoped>
.container {
  width: 300px;
  padding: 5px;
  border: 1px solid blue;
  background-color: bisque;
}
.content {
  overflow-y: auto;
  height: 300px;
}
.content::highlight(search-text) {
  color: red;
  font-weight: bold;
}
</style>
