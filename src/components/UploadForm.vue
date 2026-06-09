<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useCategoryStore } from '../stores/category'
import { useVideoStore } from '../stores/video'

const emit = defineEmits(['uploaded'])

const categoryStore = useCategoryStore()
const videoStore = useVideoStore()

const allowedVideoExtensions = ['mp4', 'webm', 'mov']
const allowedThumbnailExtensions = ['jpg', 'jpeg', 'png', 'webp']

const form = reactive({
  title: '',
  description: '',
  categoryId: '',
  status: 'pending',
  videoFile: null,
  thumbnailFile: null,
  duration: 0,
  thumbnailPreview: '',
})

const errors = reactive({})
const videoInput = ref(null)
const thumbnailInput = ref(null)
const submitting = ref(false)
const progress = ref(0)
const successMessage = ref('')
const errorMessage = ref('')

const categoryName = computed(() => {
  const category = categoryStore.categories.find((item) => item.id === Number(form.categoryId))
  return category?.name || ''
})

const durationLabel = computed(() => {
  if (!form.duration) return '0:00'
  const minutes = Math.floor(form.duration / 60)
  const seconds = String(Math.round(form.duration % 60)).padStart(2, '0')
  return `${minutes}:${seconds}`
})

onMounted(() => {
  categoryStore.loadCategories()
})

const fileExtension = (file) => file?.name.split('.').pop()?.toLowerCase() || ''

const isAllowedFile = (file, extensions) => extensions.includes(fileExtension(file))

const readVideoDuration = (file) =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const objectUrl = URL.createObjectURL(file)

    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(video.duration)
    }
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Unable to read video metadata.'))
    }
    video.src = objectUrl
  })

const clearError = (key) => {
  delete errors[key]
}

const clearVideoFile = () => {
  form.videoFile = null
  form.duration = 0
  if (videoInput.value) videoInput.value.value = ''
}

const clearThumbnailFile = () => {
  form.thumbnailFile = null
  form.thumbnailPreview = ''
  if (thumbnailInput.value) thumbnailInput.value.value = ''
}

const handleVideoChange = async (event) => {
  clearError('videoFile')
  const file = event.target.files?.[0]

  if (!file) {
    clearVideoFile()
    return
  }

  if (!isAllowedFile(file, allowedVideoExtensions)) {
    errors.videoFile = 'Video must be MP4, WebM, or MOV.'
    clearVideoFile()
    return
  }

  try {
    const duration = await readVideoDuration(file)

    if (!Number.isFinite(duration)) {
      throw new Error('Video duration could not be detected.')
    }

    if (duration > 600) {
      errors.videoFile = 'Video duration must be 10 minutes or less.'
      clearVideoFile()
      return
    }

    form.videoFile = file
    form.duration = duration
  } catch (error) {
    errors.videoFile = error.message || 'Unable to validate video duration.'
    clearVideoFile()
  }
}

const handleThumbnailChange = (event) => {
  clearError('thumbnailFile')
  const file = event.target.files?.[0]

  if (!file) {
    clearThumbnailFile()
    return
  }

  if (!isAllowedFile(file, allowedThumbnailExtensions)) {
    errors.thumbnailFile = 'Thumbnail must be JPG, JPEG, PNG, or WebP.'
    clearThumbnailFile()
    return
  }

  form.thumbnailFile = file
  form.thumbnailPreview = URL.createObjectURL(file)
}

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!form.title.trim()) errors.title = 'Title is required.'
  if (!form.description.trim()) errors.description = 'Description is required.'
  if (!form.categoryId) errors.categoryId = 'Category is required.'
  if (!form.status) errors.status = 'Status is required.'
  if (!form.videoFile) errors.videoFile = 'Video file is required.'
  if (!form.thumbnailFile) errors.thumbnailFile = 'Thumbnail is required.'
  if (form.duration > 600) errors.videoFile = 'Video duration must be 10 minutes or less.'

  return Object.keys(errors).length === 0
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.categoryId = ''
  form.status = 'pending'
  form.videoFile = null
  form.thumbnailFile = null
  form.duration = 0
  form.thumbnailPreview = ''
  if (videoInput.value) videoInput.value.value = ''
  if (thumbnailInput.value) thumbnailInput.value.value = ''
}

const submit = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!validateForm()) return

  submitting.value = true
  progress.value = 0

  try {
    const video = await videoStore.uploadVideo(
      {
        ...form,
        categoryName: categoryName.value,
      },
      (value) => {
        progress.value = value
      },
    )

    successMessage.value = 'Video uploaded successfully.'
    emit('uploaded', video)
    resetForm()
  } catch (error) {
    errorMessage.value = error.message || 'Upload failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="admin-card space-y-6" @submit.prevent="submit">
    <div class="grid gap-5 lg:grid-cols-2">
      <label class="form-label">
        Title
        <input v-model="form.title" class="form-input" type="text" placeholder="Episode title" @input="clearError('title')" />
        <span v-if="errors.title" class="form-help text-admin-red">{{ errors.title }}</span>
      </label>

      <label class="form-label">
        Category
        <select v-model="form.categoryId" class="form-input" @change="clearError('categoryId')">
          <option value="">Select category</option>
          <option v-for="category in categoryStore.activeCategories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <span v-if="errors.categoryId" class="form-help text-admin-red">{{ errors.categoryId }}</span>
      </label>

      <label class="form-label lg:col-span-2">
        Description
        <textarea v-model="form.description" class="form-input min-h-32 resize-y" placeholder="Video description" @input="clearError('description')" />
        <span v-if="errors.description" class="form-help text-admin-red">{{ errors.description }}</span>
      </label>

      <label class="form-label">
        Status
        <select v-model="form.status" class="form-input" @change="clearError('status')">
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
        </select>
      </label>

      <div class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <p class="text-sm font-semibold text-gray-700">Video Duration</p>
        <p class="mt-1 text-2xl font-bold text-gray-900">{{ durationLabel }}</p>
        <p class="mt-1 text-xs font-medium text-gray-500">Maximum 10:00</p>
      </div>

      <label class="form-label">
        Video File
        <input ref="videoInput" class="form-input" type="file" accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime" @change="handleVideoChange" />
        <span class="form-help">Allowed: mp4, webm, mov.</span>
        <span v-if="errors.videoFile" class="form-help text-admin-red">{{ errors.videoFile }}</span>
      </label>

      <label class="form-label">
        Thumbnail
        <input ref="thumbnailInput" class="form-input" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" @change="handleThumbnailChange" />
        <span class="form-help">Allowed: jpg, jpeg, png, webp.</span>
        <span v-if="errors.thumbnailFile" class="form-help text-admin-red">{{ errors.thumbnailFile }}</span>
      </label>
    </div>

    <div v-if="form.thumbnailPreview" class="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <img :src="form.thumbnailPreview" alt="Thumbnail preview" class="h-20 w-32 rounded-lg object-cover" />
      <div>
        <p class="text-sm font-semibold text-gray-900">{{ form.thumbnailFile?.name }}</p>
        <p class="text-xs text-gray-500">Thumbnail preview</p>
      </div>
    </div>

    <div v-if="submitting || progress > 0" class="space-y-2">
      <div class="flex justify-between text-xs font-semibold text-gray-500">
        <span>Upload progress</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="h-3 overflow-hidden rounded-full bg-gray-100">
        <div class="h-full rounded-full bg-admin-brand transition-all duration-200" :style="{ width: `${progress}%` }" />
      </div>
    </div>

    <div v-if="successMessage" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-admin-red">
      {{ errorMessage }}
    </div>

    <div class="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
      <button type="button" class="btn-secondary" :disabled="submitting" @click="resetForm">Reset</button>
      <button type="submit" class="btn-primary" :disabled="submitting">
        {{ submitting ? 'Uploading...' : 'Upload Video' }}
      </button>
    </div>
  </form>
</template>
