<script setup>
import { ref, onMounted, useTemplateRef, watch } from 'vue'
import logo from './assets/logo.svg'

let history = {}
let data = []
const list = ref({})
const player = useTemplateRef('player')
const selectedItem = ref(null)
const searchText = ref('')

const search = () => {
  const keywords = searchText.value
  let a = data
  if (keywords) {
    const regex = new RegExp(`(${keywords})`, 'g')
    a = data
      .filter((x) => x.title.includes(keywords))
      .map((x) => {
        x.text = x.title.replace(regex, '<em>$1</em>')
        return x
      })
  } else {
    a.map((x) => {
      x.text = x.title
      return x
    })
  }
  list.value = Object.groupBy(a, (x) => x.category)
}
const saveHistory = (a) => {
  history[a.md5] = player.value.currentTime
  localStorage.setItem('history', JSON.stringify(history))
}
const setCurrentTime = (a) => {
  const v = history[a.md5]
  if (v) {
    player.value.currentTime = v
  }
}
const loadHistory = () => {
  const a = localStorage.getItem('history')
  if (a) {
    history = JSON.parse(a)
  }
}
const clickItem = (item) => {
  const a = selectedItem.value
  if (a) {
    saveHistory(a)
  }
  selectedItem.value = item
  player.value.src = item.url
  setCurrentTime(item)
}

const loadData = async () => {
  const res = await fetch('/data.json')
  data = await res.json()
  search()
}

watch(searchText, () => {
  search()
})
onMounted(async () => {
  await loadData()
  loadHistory()
})
</script>

<template>
  <header>
    <img class="logo" :src="logo" alt="" />
    <p class="title">口腔HIS系统学习网站</p>
    <div class="search-wrapper">
      <input class="search" type="search" placeholder="搜索视频" v-model="searchText" />
    </div>
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
          v-html="item.text"
        ></p>
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
