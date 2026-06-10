<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import VideoCard from '@/components/VideoCard.vue'
import { useVideoStore } from '@/stores/video'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
})

const router = useRouter()
const videoStore = useVideoStore()
const adOpened = ref(false)

onMounted(() => {
  if (!videoStore.videos.length) {
    videoStore.loadVideos()
  }
})

const video = computed(() => videoStore.videos.find((item) => String(item.id) === String(props.id)))
const relatedVideos = computed(() => videoStore.videos.filter((item) => String(item.id) !== String(props.id)).slice(0, 3))

const durationLabel = computed(() => {
  const secondsTotal = video.value?.duration || 0
  const minutes = Math.floor(secondsTotal / 60)
  const seconds = String(secondsTotal % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
})

const isHttpUrl = (value) => {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

const openPopupAd = () => {
  const popupUrl = video.value?.popup_ads_url

  if (adOpened.value || !popupUrl || !isHttpUrl(popupUrl)) return

  window.open(popupUrl, '_blank', 'noopener,noreferrer')
  adOpened.value = true
}

watch(
  () => props.id,
  () => {
    adOpened.value = false
  },
)
</script>

<template>
  <div class="min-h-screen bg-admin-page">
    <Navbar title="Video Library" variant="public" />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div v-if="videoStore.loading" class="admin-card text-sm font-semibold text-gray-600">
        Loading video...
      </div>

      <section v-else-if="video" class="space-y-8">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" class="btn-secondary w-fit" @click="router.push('/')">Back Home</button>
          <p class="text-sm font-semibold text-gray-500">/watch/{{ video.id }}</p>
        </div>

        <div class="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <article class="overflow-hidden rounded-card border border-gray-200 bg-white shadow-soft">
            <div class="aspect-video bg-gray-950">
              <video v-if="video.videoUrl" class="h-full w-full" :src="video.videoUrl" controls @play="openPopupAd" />
              <div v-else class="flex h-full w-full flex-col items-center justify-center gap-4 text-sm font-semibold text-white">
                <button
                  type="button"
                  class="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-gray-950 shadow-lg transition hover:scale-105"
                  aria-label="Play video"
                  @click="openPopupAd"
                >
                  <svg class="ml-1 h-7 w-7" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M8 5v14l11-7L8 5Z" />
                  </svg>
                </button>
                <span>{{ video.format?.toUpperCase() || 'VIDEO' }} preview</span>
              </div>
            </div>

            <div class="space-y-4 p-5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="status-pill bg-indigo-50 text-indigo-700">{{ video.categoryName }}</span>
                <span class="status-pill bg-gray-100 text-gray-700">{{ durationLabel }}</span>
              </div>

              <div>
                <h1 class="text-2xl font-bold text-gray-950">{{ video.title }}</h1>
                <p class="mt-3 leading-7 text-gray-600">{{ video.description }}</p>
              </div>
            </div>
          </article>

          <aside class="space-y-4">
            <div class="admin-card">
              <h2 class="text-base font-bold text-gray-900">Video Details</h2>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="text-gray-500">File</dt>
                  <dd class="text-right font-semibold text-gray-900">{{ video.videoName }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-gray-500">Size</dt>
                  <dd class="font-semibold text-gray-900">{{ video.size }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-gray-500">Status</dt>
                  <dd class="font-semibold capitalize text-gray-900">{{ video.status }}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>

        <section v-if="relatedVideos.length" class="space-y-4">
          <h2 class="text-lg font-bold text-gray-900">More Videos</h2>
          <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <VideoCard v-for="item in relatedVideos" :key="item.id" :video="item" />
          </div>
        </section>
      </section>

      <section v-else class="admin-card">
        <h1 class="text-xl font-bold text-gray-950">Video not found</h1>
        <p class="mt-2 text-sm text-gray-600">The requested video does not exist.</p>
        <button type="button" class="btn-primary mt-5" @click="router.push('/')">Go Home</button>
      </section>
    </main>
  </div>
</template>
