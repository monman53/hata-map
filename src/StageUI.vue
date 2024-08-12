<script lang="ts">
const setColor = (t: any) => {
  displayParameter.value.minHue = t.minHue
  displayParameter.value.maxHue = t.maxHue
  displayParameter.value.saturation = t.saturation
  displayParameter.value.lightness = t.lightness
  displayParameter.value.lightnessOffset = t.lightnessOffset
  displayParameter.value.alpha = t.alpha
}

const setParameter = (t: any) => {
  setPrevParameter(t)
  setCurrentParameter(t)
  fitView()
  app.value.t = 0
  app.value.pause = true
}

const prevHistory = () => {
  app.value.pause = true
  app.value.randomHistoryPtr = Math.max(0, app.value.randomHistoryPtr - 1)
  setParameter(app.value.randomHistory[app.value.randomHistoryPtr])
}

const nextHistory = () => {
  app.value.pause = true
  app.value.randomHistoryPtr = Math.min(
    app.value.randomHistory.length - 1,
    app.value.randomHistoryMax - 1,
    app.value.randomHistoryPtr + 1
  )
  setParameter(app.value.randomHistory[app.value.randomHistoryPtr])
}

const pauseResume = () => {
  if (!app.value.pause && app.value.t < 0.5) {
    prevHistory()
  } else {
    app.value.pause = !app.value.pause
  }
}

window.addEventListener('keydown', (e: any) => {
  if (e.key === ' ') {
    pauseResume()
  }
  if (e.key === 'ArrowLeft') {
    prevHistory()
  }
  if (e.key === 'ArrowRight') {
    nextHistory()
  }
  if (e.key === 'f') {
    fitView()
  }
  if (e.key === 'r') {
    createAndSetRandomParameter()
    app.value.pause = true
  }
})
</script>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { app, fps } from './main'
import {
  createAndSetRandomParameter,
  fitView,
  humanReadable,
  resetParameter,
  setCurrentParameter,
  setPrevParameter
} from './utils'
import { displayParameter, displayProps, parameter, parameterProps } from './parameters'
import { canvas } from './StageCanvas.vue'
import { colorTemplates, parameterTemplates } from './templates'
import ParameterController from './ParameterController.vue'

type ModeType = 'control' | 'info' | ''
const mode: Ref<ModeType> = ref('')

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

const templateVisible = ref(false)
</script>

<template>
  <div id="base" v-if="app.mousePos.x < app.width / 2">
    <div class="mode-select">
      <div>
        <i v-if="mode === 'control'" class="bi bi-gear-fill pointer" @click="mode = ''" />
        <i v-else class="bi bi-gear pointer" @click="mode = 'control'" />
      </div>
      <!-- <div>
        <i v-if="mode === 'info'" class="bi bi-info-circle-fill pointer" @click="mode = ''" />
        <i v-else class="bi bi-info-circle pointer" @click="mode = 'info'" />
      </div> -->
      <div style="text-align: right">
        <a href="https://github.com/monman53/hata-map"><i class="bi bi-github pointer" /></a>
      </div>
    </div>

    <div class="content">
      <div v-if="mode === 'control'" id="controller">
        <!-- Animation controller -->
        <fieldset>
          <!-- <legend>Random Animation</legend> -->
          <!-- {{ app.pointerPos.x }}, {{ app.pointerPos.y }}<br>
          {{ app.c.x }}, {{ app.c.y }} -->
          <span id="animation">
            <i class="bi bi-skip-backward-fill pointer" @click="prevHistory"></i>
            <i v-if="!app.pause" class="bi bi-pause-fill pointer" @click="pauseResume"></i>
            <i v-if="app.pause" class="bi bi-play-fill pointer" @click="pauseResume"></i>
            <i class="bi bi-skip-forward-fill pointer" @click="nextHistory"></i>
            <span style="float: right">
              <!-- <i class="bi bi-arrows-fullscreen"></i> -->
              <i
                class="bi bi-camera pointer"
                style="padding-left: 0.2em; padding-right: 0.2em"
                @click="copyImage"
              ></i>
              <i class="bi bi-download pointer" @click="saveImage"></i>
            </span>
          </span>
          <br />
          <!-- <label>
            <input type="checkbox" v-model="app.randomAnimation" />
            Random parameter
          </label> -->
          <button @click="fitView">Fit view</button>
          <button
            @click="
              () => {
                createAndSetRandomParameter()
                app.pause = true
              }
            "
          >
            Random
          </button>
          FPS: {{ humanReadable(fps) }}
        </fieldset>

        <!-- Display parameters -->
        <template v-for="category of displayProps" :key="category.name">
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
                <template v-if="prop.name !== 'prevScale'">
                  <label>
                    {{ prop.name }}
                    <br />
                    <input
                      type="range"
                      v-model.number="displayParameter[prop.name as keyof typeof displayParameter]"
                      :step="prop.step"
                      :min="prop.min"
                      :max="prop.max"
                      @dblclick="
                        displayParameter[prop.name as keyof typeof displayParameter] = prop.default
                      "
                    />
                  </label>
                  <i
                    class="bi bi-arrow-clockwise pointer"
                    @click="
                      displayParameter[prop.name as keyof typeof displayParameter] = prop.default
                    "
                  ></i>
                  <span style="float: right">
                    {{
                      humanReadable(displayParameter[prop.name as keyof typeof displayParameter])
                    }}
                  </span>
                  <br />
                </template>
              </template>
            </template>
          </fieldset>
        </template>

        <!-- Hata parameters -->
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
                <ParameterController :prop></ParameterController>
                <br />
              </template>
            </template>
          </fieldset>
        </template>

        <!-- Templates -->
        <fieldset>
          <legend>
            <span class="pointer" @click="templateVisible = !templateVisible">
              <i class="bi bi-caret-down-fill" v-if="templateVisible"></i>
              <i class="bi bi-caret-right-fill" v-if="!templateVisible"></i>
              Templates
            </span>
          </legend>
          <template v-if="templateVisible">
            <!-- color -->
            <!-- <h4>Color</h4> -->
            <fieldset>
              <legend>Color</legend>
              <template v-for="(t, idx) of colorTemplates" :key="idx">
                <button @click="setColor(t)">{{ t.name }}</button>
                <br v-if="idx % 3 == 2" />
              </template>
            </fieldset>
            <!-- parameter -->
            <fieldset>
              <legend>Parameter</legend>
              <template v-for="(t, idx) of parameterTemplates" :key="idx">
                <button @click="setParameter(t)">{{ t.name }}</button>
                <br v-if="idx % 8 == 7" />
              </template>
            </fieldset>
          </template>
        </fieldset>
      </div>

      <!-- Infos -->
      <div v-if="mode === 'info'">
        <p>TBD</p>
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
