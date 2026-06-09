<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  video: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

const statusClass = computed(() => {
  if (props.video.status === 'published') return 'bg-emerald-50 text-emerald-700'
  if (props.video.status === 'pending') return 'bg-amber-50 text-amber-700'
  return 'bg-gray-100 text-gray-700'
})

const durationLabel = computed(() => {
  const minutes = Math.floor((props.video.duration || 0) / 60)
  const seconds = String((props.video.duration || 0) % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
})

const openVideo = () => {
  router.push(`/watch/${props.video.id}`)
}
</script>

<template>
  <button type="button" class="admin-card block overflow-hidden p-0 text-left transition hover:-translate-y-0.5 hover:shadow-lg" @click="openVideo">
    <div class="aspect-video bg-gray-100">
      <img
        v-if="video.thumbnailUrl"
        :src="video.thumbnailUrl"
        :alt="video.title"
        class="h-full w-full object-cover"
      />
      <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 via-indigo-50 to-cyan-50 text-sm font-semibold text-gray-500">
        {{ video.format?.toUpperCase() || 'VIDEO' }}
      </div>
    </div>

    <div class="space-y-4 p-4">
      <div>
        <div class="mb-2 flex items-center justify-between gap-3">
          <span class="status-pill" :class="statusClass">{{ video.status }}</span>
          <span class="text-xs font-semibold text-gray-500">{{ durationLabel }}</span>
        </div>
        <h3 class="line-clamp-1 text-base font-bold text-gray-900">{{ video.title }}</h3>
        <p class="mt-1 line-clamp-2 text-sm text-gray-500">{{ video.description }}</p>
      </div>

      <div class="flex items-center justify-between border-t border-gray-100 pt-3 text-xs font-semibold text-gray-500">
        <span>{{ video.categoryName }}</span>
        <span>{{ video.size }}</span>
      </div>
    </div>
  </button>
</template>
