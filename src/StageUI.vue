<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { app, fps } from './main'
import { humanReadable, resetParameter } from './utils'
import { parameterTemplates } from './templates'
import { parameter, parameterProps } from './parameters'
import { canvas } from './StageCanvas.vue'

type ModeType = 'control' | 'info' | ''
const mode: Ref<ModeType> = ref('')

const setAndReset = ref(true)

const saveImage = () => {
  const link = document.createElement('a')
  if (link === null) {
    throw new Error()
  }
  link.download = 'image.png'
  link.href = canvas.value.toDataURL()
  link.click()
}

const copyImage = () => {
  canvas.value.toBlob((blob: any) => {
    navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
  }, 'image/png')
}
</script>

<template>
  <div id="base">
    <div class="mode-select">
      <div>
        <i v-if="mode === 'control'" class="bi bi-gear-fill pointer" @click="mode = ''" />
        <i v-else class="bi bi-gear pointer" @click="mode = 'control'" />
      </div>
      <div>
        <i v-if="mode === 'info'" class="bi bi-info-circle-fill pointer" @click="mode = ''" />
        <i v-else class="bi bi-info-circle pointer" @click="mode = 'info'" />
      </div>
      <div style="text-align: right">
        <a href="https://github.com/monman53/snowflake"><i class="bi bi-github pointer" /></a>
      </div>
    </div>

    <div class="content">
      <div v-if="mode === 'control'" id="controller">
        <fieldset>
          <legend>Animation</legend>
          <span id="animation">
            <i v-if="!app.pause" class="bi bi-pause-fill pointer" @click="app.pause = true"></i>
            <i v-if="app.pause" class="bi bi-play-fill pointer" @click="app.pause = false"></i>
            <span style="float: right">
              <i
                class="bi bi-camera pointer"
                style="padding-left: 0.2em; padding-right: 0.2em"
                @click="copyImage"
              ></i>
              <i class="bi bi-download pointer" @click="saveImage"></i>
            </span>
          </span>
          <br />
          FPS: {{ humanReadable(fps) }}<br />
        </fieldset>
        <template v-for="category of parameterProps" :key="category.name">
          <fieldset>
            <legend>
              <span class="pointer" @click="category.visible = !category.visible">
                <i class="bi bi-caret-down-fill" v-if="category.visible"></i>
                <i class="bi bi-caret-right-fill" v-if="!category.visible"></i>
                {{ category.name }}
              </span>
              &nbsp;
              <span class="pointer">
                <i class="bi bi-arrow-clockwise" @click="resetParameter(category)"></i>
              </span>
            </legend>
            <template v-if="category.visible">
              <template v-for="prop of category.props" :key="prop.name">
                <label>
                  {{ prop.name }}
                  <br />
                  <input
                    type="range"
                    v-model.number="parameter[prop.name as keyof typeof parameter]"
                    :step="prop.step"
                    :min="prop.min"
                    :max="prop.max"
                    @dblclick="parameter[prop.name as keyof typeof parameter] = prop.default"
                  />
                </label>
                <i
                  class="bi bi-arrow-clockwise pointer"
                  @click="parameter[prop.name as keyof typeof parameter] = prop.default"
                ></i>
                <span style="float: right">
                  {{ humanReadable(parameter[prop.name as keyof typeof parameter]) }}
                </span>
                <br />
              </template>
            </template>
          </fieldset>
        </template>
        <!-- <fieldset>
          <legend>Templates</legend>
          <template v-for="(t, idx) of parameterTemplates" :key="idx">
            <button @click="setParameter(t)">{{ t.name }}</button>
            <br v-if="idx % 8 == 7" />
          </template>
        </fieldset> -->
      </div>
      <div v-if="mode === 'info'">
        <p>
          TBD
        </p>
      </div>
    </div>
    <div v-if="mode !== ''" class="footer">
      <small>Created by <a href="https://monman53.github.io/">monman53</a></small>
    </div>
  </div>
</template>

<style scoped>
#base {
  max-height: 90vh;
  overflow-y: auto;

  margin: 1em;
  padding: 0.5em;
  max-width: 30em;
  border-radius: 1em;
  color: white;
  background-color: #0008;
  backdrop-filter: blur(4px);
}

fieldset {
  margin-bottom: 1em;
}

#controller {
  user-select: none;
}

#controller p {
  margin: 0;
}

legend {
  font-weight: bold;
}

.content {
  max-height: 80vh;
  overflow: auto;
}

a {
  color: white;
  text-decoration: none;
}

#animation {
  font-size: 2em;
}

.mode-select {
  margin: 0.3em;
  font-size: 1.5em;
  display: grid;
  grid-template-columns: auto auto auto auto 1fr;
  gap: 0.3em;
}

.pointer {
  cursor: pointer;
}

p {
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.footer {
  padding: 0.3em;
  text-align: right;
}
</style>
