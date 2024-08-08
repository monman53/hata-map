<script setup lang="ts">
import { computed, ref } from 'vue'
import { vec, type Vec } from './math'
import { parameter } from './parameters'

const props = defineProps<{
  prop: {
    name: string
    default: Vec
    min: number
    max: number
    step: number
  }
}>()

const width = 200
const height = 200
const center = vec(0, 0)
const scale = (width * 0.5) / props.prop.max

const svgViewBox = computed(() => {
  const x = center.x - (width * 0.5) / scale
  const y = center.y - (height * 0.5) / scale
  const w = width / scale
  const h = height / scale
  return `${x} ${y} ${w} ${h}`
})

const strokeWidth = computed(() => {
  return 1 / scale
})

const radius = computed(() => {
  return 5 / scale
})

const svg = ref()

const getPositionOnSvg = (e: any) => {
  const rect = svg.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = rect.bottom - e.clientY
  return vec(x, y)
}

const getPositionOnSvgApp = (e: any) => {
  const m = getPositionOnSvg(e)
  const x = (m.x - width / 2) / scale + center.x
  const y = (m.y - height / 2) / scale + center.y
  return vec(x, -y)
}

let drag = false
let m0 = vec(0,0)

const moveStart = (e: any) => {
  const pos = getPositionOnSvgApp(e)
  m0 = pos
  drag = true
}

const move = (e: any) => {
  if (drag) {
    const param = getParam()
    let pos = getPositionOnSvgApp(e)
    if (e.shiftKey) {
      pos.inplaceNormalize().inplaceMul(m0.length())
    }
    if (e.ctrlKey) {
      pos = m0.normalize().mul(pos.length())
    }
    param.x = pos.x
    param.y = pos.y
  }
}

const moveEnd = () => {
  drag = false
}

const reset = () => {
  //   parameter.value[props.prop.name as keyof typeof parameter.value] = props.prop.default
  const param = getParam()
  param.x = props.prop.default.x
  param.y = props.prop.default.y
}

const getParam = () => {
  // TODO: Not good
  return parameter.value[props.prop.name as keyof typeof parameter.value]
}

const visible = ref(true)
</script>

<template>
  <fieldset>
    <legend>
      <span class="pointer" @click="visible = !visible">
        <i class="bi bi-caret-down-fill" v-if="visible"></i>
        <i class="bi bi-caret-right-fill" v-if="!visible"></i>
        {{ prop.name }}
      </span>
    </legend>
    <template v-if="visible">
      <svg
        ref="svg"
        :width
        :height
        :view-box.camel="svgViewBox"
        @dblclick="reset"
        @mousedown="moveStart"
        @mousemove="move"
        @mouseup="moveEnd"
      >
        <line :x1="-width" :y1="0" :x2="width" :y2="0"></line>
        <line :x1="0" :y1="-height" :x2="0" :y2="height"></line>
        <circle :cx="getParam().x" :cy="getParam().y" :r="radius"></circle>
      </svg>
      <br />
      <!-- input -->
      <label>
        Re
        <input type="number" :step="prop.step" v-model.number="getParam().x" />
      </label>
      <label>
        Im
        <input type="number" :step="prop.step" v-model.number="getParam().y" />
      </label>
      <i class="bi bi-arrow-clockwise pointer" @click="reset"></i>
    </template>
  </fieldset>
</template>

<style scoped>
input {
  width: 6em;
}

line {
  stroke: white;
  stroke-width: v-bind('strokeWidth');
}

circle {
  stroke: white;
  stroke-width: v-bind('strokeWidth');
  fill: transparent;
}

/* TODO: duplicate */
.pointer {
  cursor: pointer;
}
</style>
