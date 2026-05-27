<script setup lang="ts">
import { computed } from 'vue'

type ThemeId = 'light' | 'dark' | 'thai'

const props = defineProps<{
  theme: ThemeId
}>()

const emit = defineEmits<{
  updateTheme: [theme: ThemeId]
}>()

const themeModel = computed({
  get: () => props.theme,
  set: (value: ThemeId) => emit('updateTheme', value),
})
</script>

<template>
  <section class="mx-auto max-w-4xl">
    <form class="admin-card space-y-6">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Website setup</p>
        <h2 class="mt-2 text-2xl font-extrabold text-textDark">Setting</h2>
      </div>

      <label class="form-field">
        <span>Website name</span>
        <input type="text" value="TeenTH" />
      </label>

      <label class="form-field">
        <span>Website language</span>
        <select>
          <option>English</option>
          <option>Thai</option>
          <option>Khmer</option>
        </select>
      </label>

      <label class="form-field">
        <span>Website theme</span>
        <select v-model="themeModel">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="thai">Thai</option>
        </select>
      </label>

      <label class="form-field">
        <span>Website description</span>
        <textarea rows="5">TeenTH is a modern video platform for curated learning, culture, and entertainment content.</textarea>
      </label>

      <div class="flex justify-end">
        <button class="primary-button" type="button">Save Settings</button>
      </div>
    </form>
  </section>
</template>
