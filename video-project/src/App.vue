<script setup>
import { ref, onMounted, useTemplateRef, watch } from 'vue'

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
  player.value.src = import.meta.env.BASE_URL + '/videos/' + item.url
  setCurrentTime(item)
}

const loadData = async () => {
  const res = await fetch(import.meta.env.BASE_URL + '/videos/data.json')
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
    <img class="logo" src="./assets/logo.png" />
    <p class="title">HIS系统学习</p>
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
    <video ref="player" controls autoplay></video>
  </main>
</template>
