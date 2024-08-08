<script setup lang="ts">
import { computed } from 'vue'
import StageCanvas from './StageCanvas.vue'
import StageUI from './StageUI.vue'
import { app } from './main'
import Info from './InfoItem.vue';

const heightPx = computed(() => {
  return app.value.height + 'px'
})

const widthPx = computed(() => {
  return app.value.width + 'px'
})
</script>

<template>
  <div id="stage">
    <div id="canvas">
      <StageCanvas></StageCanvas>
    </div>
    <div id="svg">
      <StageUI></StageUI>
    </div>
    <div id="info">
      <Info></Info>
    </div>
  </div>
</template>

<style scoped>
#stage {
  position: relative;
}

#canvas,
#svg,
#info {
  overflow: hidden;
  position: absolute;
  height: v-bind(heightPx);
  /* width: v-bind(widthPx); */
}

#info {
  right: 0;
}
</style>
