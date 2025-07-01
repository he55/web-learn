<script setup>
import { ref, onMounted, useTemplateRef } from 'vue'
import logo from './assets/logo.svg'
let data = []
const list = ref({})
const player = useTemplateRef('player')
const selectedItem = ref(null)
const loadData = async () => {
  const res = await fetch('/data.json')
  data = await res.json()
  list.value = Object.groupBy(data, (x) => x.category)
}
const clickItem = (item) => {
  selectedItem.value = item
  player.value.src = item.url
}
onMounted(() => {
  loadData()
})
</script>

<template>
  <header>
    <img class="logo" :src="logo" alt="" />
    <p class="title">口腔HIS系统学习网站</p>
  </header>
  <nav>
    <div>
      <section v-for="(val, key) in list" :key="key">
        <p class="group-title">{{ key }}</p>
        <p
          class="link"
          :class="{ active: selectedItem === item }"
          @click="clickItem(item)"
          v-for="item in val"
          :key="item.title"
        >
          {{ item.title }}
        </p>
      </section>
    </div>
  </nav>
  <main>
    <video
      ref="player"
      controls
      autoplay
      src="https://d1ff4ea0-e3ef-438b-85c1-ed5a39c007d1.mdnplay.dev/shared-assets/videos/flower.mp4"
    ></video>
  </main>
</template>

<style scoped></style>
