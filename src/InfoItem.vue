<script setup lang="ts">
import type { Vec } from './math'
import { displayParameter, parameter } from './parameters'

const paramString = (param: Vec) => {
  let les = ''
  const x = param.x
  const y = param.y

  les += x >= 0 ? ' ' : '-'
  les += ' '
  les += Math.abs(x).toFixed(6)
  les += ' '
  les += y >= 0 ? '+' : '-'
  les += ' '
  les += Math.abs(y).toFixed(6)
  les += 'i'

  return les
}
</script>

<template>
  <div id="base">
    <pre>
a = {{ paramString(parameter.a) }}
b = {{ paramString(parameter.b) }}
c = {{ paramString(parameter.c) }}
d = {{ paramString(parameter.d) }}</pre
    >
  </div>
</template>

<style scoped>
pre {
  margin: 0;
  padding: 0;
}

#base {
  /* margin: 0; */
  padding: 0.5em;
  /* color: white; */
  color: gray;
  background-color: #0008;
  /* background-color: grey; */
  backdrop-filter: blur(4px);
  font-family: monospace;
}
</style>
