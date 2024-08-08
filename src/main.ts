import './assets/main.css'

import { createApp, ref } from 'vue'
import App from './App.vue'
import { resetAllParameter } from './utils'
import { vec } from './math'

export const app = ref({
  width: window.innerWidth,
  height: window.innerHeight,
  n: 10,
  pause: false,
  t: 2, // > 1 for initial Bezier creation
  c: vec(0, 0),
  prevC: vec(0, 0),
  pointerPos: vec(0, 0)
})

export const fps = ref(0)

resetAllParameter()

const resize = () => {
  app.value.width = window.innerWidth
  app.value.height = window.innerHeight
}
resize()
window.addEventListener('resize', resize)

createApp(App).mount('#app')
