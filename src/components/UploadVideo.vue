<script setup lang="ts">
import { reactive, ref } from 'vue'

type FieldName =
  | 'title'
  | 'category'
  | 'adsLinks'
  | 'requiredClicks'
  | 'thumbnail'
  | 'videoFile'
  | 'descriptions'

type FormState = {
  title: string
  category: string
  adsLinks: string
  requiredClicks: string
  thumbnail: File | null
  videoFile: File | null
  descriptions: string
}

const categories = ['Travel', 'Education', 'Music', 'Sport', 'Entertainment', 'News']

const form = reactive<FormState>({
  title: '',
  category: '',
  adsLinks: '',
  requiredClicks: '',
  thumbnail: null,
  videoFile: null,
  descriptions: '',
})

const errors = reactive<Partial<Record<FieldName, string>>>({})
const thumbnailPreview = ref('')
const successMessage = ref('')
const thumbnailInput = ref<HTMLInputElement | null>(null)
const videoInput = ref<HTMLInputElement | null>(null)

const thumbnailTypes = ['image/jpeg', 'image/png', 'image/webp']
const videoTypes = ['video/mp4', 'video/quicktime', 'video/webm']

const fieldClass = (field: FieldName) =>
  errors[field]
    ? 'border-thaiRed focus:border-thaiRed focus:ring-thaiRed/10'
    : 'border-border focus:border-primaryBlue focus:ring-primaryBlue/10'

const setError = (field: FieldName, message: string) => {
  errors[field] = message
}

const clearErrors = () => {
  Object.keys(errors).forEach((key) => {
    delete errors[key as FieldName]
  })
}

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

const validateForm = () => {
  clearErrors()

  const title = form.title.trim()
  const descriptions = form.descriptions.trim()
  const clickValue = Number(form.requiredClicks)
  const adsLinks = form.adsLinks
    .split(/\r?\n/)
    .map((link) => link.trim())
    .filter(Boolean)

  if (!title) {
    setError('title', 'Title is required.')
  } else if (title.length < 3) {
    setError('title', 'Title must be at least 3 characters.')
  } else if (title.length > 120) {
    setError('title', 'Title must be 120 characters or fewer.')
  }

  if (!form.category) {
    setError('category', 'Category is required.')
  }

  if (adsLinks.some((link) => !isValidUrl(link))) {
    setError('adsLinks', 'Every ads link must be a valid http or https URL.')
  }

  if (form.requiredClicks === '') {
    setError('requiredClicks', 'Required user clicks is required.')
  } else if (!Number.isInteger(clickValue) || clickValue < 0) {
    setError('requiredClicks', 'Required user clicks must be a whole number, minimum 0.')
  }

  if (!form.thumbnail) {
    setError('thumbnail', 'Thumbnail is required.')
  } else if (!thumbnailTypes.includes(form.thumbnail.type)) {
    setError('thumbnail', 'Thumbnail must be JPG, PNG, or WEBP.')
  }

  if (!form.videoFile) {
    setError('videoFile', 'Video file is required.')
  } else if (!videoTypes.includes(form.videoFile.type)) {
    setError('videoFile', 'Video file must be MP4, MOV, or WEBM.')
  }

  if (!descriptions) {
    setError('descriptions', 'Descriptions is required.')
  } else if (descriptions.length < 10) {
    setError('descriptions', 'Descriptions must be at least 10 characters.')
  } else if (descriptions.length > 1000) {
    setError('descriptions', 'Descriptions must be 1000 characters or fewer.')
  }

  return Object.keys(errors).length === 0
}

const handleThumbnailChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  form.thumbnail = file

  if (thumbnailPreview.value) {
    URL.revokeObjectURL(thumbnailPreview.value)
    thumbnailPreview.value = ''
  }

  if (file && thumbnailTypes.includes(file.type)) {
    thumbnailPreview.value = URL.createObjectURL(file)
  }
}

const handleVideoChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  form.videoFile = input.files?.[0] ?? null
}

const resetForm = () => {
  form.title = ''
  form.category = ''
  form.adsLinks = ''
  form.requiredClicks = ''
  form.thumbnail = null
  form.videoFile = null
  form.descriptions = ''

  if (thumbnailPreview.value) {
    URL.revokeObjectURL(thumbnailPreview.value)
    thumbnailPreview.value = ''
  }

  if (thumbnailInput.value) {
    thumbnailInput.value.value = ''
  }

  if (videoInput.value) {
    videoInput.value.value = ''
  }
}

const submitForm = () => {
  successMessage.value = ''

  if (!validateForm()) {
    return
  }

  successMessage.value = 'Video information saved successfully. Backend upload is not connected yet.'
  resetForm()
}
</script>

<template>
  <section class="mx-auto max-w-6xl">
    <form class="admin-card space-y-7" novalidate @submit.prevent="submitForm">
      <div class="flex flex-col gap-2 border-b border-border pb-5">
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Update Video</p>
        <h2 class="text-2xl font-extrabold text-textDark">Upload Video</h2>
      </div>

      <div
        v-if="successMessage"
        class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
      >
        {{ successMessage }}
      </div>

      <div class="grid gap-6 lg:grid-cols-2">
        <label class="form-field">
          <span>Title</span>
          <input
            v-model="form.title"
            type="text"
            maxlength="120"
            placeholder="Enter video title"
            :class="fieldClass('title')"
          />
          <p v-if="errors.title" class="mt-2 text-sm font-semibold text-thaiRed">{{ errors.title }}</p>
        </label>

        <label class="form-field">
          <span>Category</span>
          <select v-model="form.category" :class="fieldClass('category')">
            <option value="">Select category</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          <p v-if="errors.category" class="mt-2 text-sm font-semibold text-thaiRed">{{ errors.category }}</p>
        </label>

        <label class="form-field">
          <span>Links Ads</span>
          <textarea
            v-model="form.adsLinks"
            rows="4"
            placeholder="https://example.com/ad&#10;https://example.com/campaign"
            :class="fieldClass('adsLinks')"
          ></textarea>
          <p class="mt-2 text-xs text-muted">Add one URL per line.</p>
          <p v-if="errors.adsLinks" class="mt-2 text-sm font-semibold text-thaiRed">{{ errors.adsLinks }}</p>
        </label>

        <label class="form-field">
          <span>Required User Clicks To View Video</span>
          <input
            v-model="form.requiredClicks"
            type="number"
            min="0"
            step="1"
            placeholder="0"
            :class="fieldClass('requiredClicks')"
          />
          <p v-if="errors.requiredClicks" class="mt-2 text-sm font-semibold text-thaiRed">
            {{ errors.requiredClicks }}
          </p>
        </label>

        <div>
          <span class="mb-2 block text-sm font-bold text-textDark">Thumbnail</span>
          <label
            class="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed bg-surfaceMuted p-5 text-center transition hover:border-primaryBlue hover:bg-softPurple"
            :class="fieldClass('thumbnail')"
          >
            <input
              ref="thumbnailInput"
              type="file"
              class="sr-only"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              @change="handleThumbnailChange"
            />

            <img
              v-if="thumbnailPreview"
              :src="thumbnailPreview"
              alt="Thumbnail preview"
              class="h-44 w-full rounded-lg object-cover shadow-sm"
            />
            <template v-else>
              <span class="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-2xl font-black text-primaryBlue shadow-sm">
                +
              </span>
              <span class="mt-4 block text-sm font-bold text-textDark">Upload thumbnail</span>
              <span class="mt-1 block text-xs text-muted">JPG, PNG, or WEBP</span>
            </template>
          </label>
          <p v-if="errors.thumbnail" class="mt-2 text-sm font-semibold text-thaiRed">{{ errors.thumbnail }}</p>
        </div>

        <div>
          <span class="mb-2 block text-sm font-bold text-textDark">Video file</span>
          <label
            class="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed bg-surfaceMuted p-5 text-center transition hover:border-primaryBlue hover:bg-softPurple"
            :class="fieldClass('videoFile')"
          >
            <input
              ref="videoInput"
              type="file"
              class="sr-only"
              accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm"
              @change="handleVideoChange"
            />

            <span class="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-2xl font-black text-primaryBlue shadow-sm">
              +
            </span>
            <span class="mt-4 block text-sm font-bold text-textDark">
              {{ form.videoFile?.name || 'Upload video file' }}
            </span>
            <span class="mt-1 block text-xs text-muted">MP4, MOV, or WEBM</span>
          </label>
          <p v-if="errors.videoFile" class="mt-2 text-sm font-semibold text-thaiRed">{{ errors.videoFile }}</p>
        </div>

        <label class="form-field lg:col-span-2">
          <span>Descriptions</span>
          <textarea
            v-model="form.descriptions"
            rows="6"
            maxlength="1000"
            placeholder="Write a clear description for this video"
            :class="fieldClass('descriptions')"
          ></textarea>
          <div class="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <p v-if="errors.descriptions" class="text-sm font-semibold text-thaiRed">
              {{ errors.descriptions }}
            </p>
            <p class="text-xs text-muted sm:ml-auto">{{ form.descriptions.length }}/1000</p>
          </div>
        </label>
      </div>

      <div class="flex justify-end border-t border-border pt-6">
        <button class="primary-button" type="submit">Save Video</button>
      </div>
    </form>
  </section>
</template>
