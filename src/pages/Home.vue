<script setup>
import { computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import VideoCard from '@/components/VideoCard.vue'
import { useVideoStore } from '@/stores/video'

const videoStore = useVideoStore()

onMounted(() => {
  videoStore.loadVideos()
})

const videos = computed(() => videoStore.videos)
</script>

<template>
  <div class="min-h-screen bg-admin-page">
    <Navbar title="Video Library" variant="public" />

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section class="mb-8">
        <p class="text-sm font-semibold uppercase tracking-wide text-admin-brand">Home</p>
        <h1 class="mt-2 text-3xl font-bold text-gray-950 sm:text-4xl">Latest Videos</h1>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
          Choose a video to open its watch page. The home page always lives at the root URL.
        </p>
      </section>

      <div v-if="videoStore.loading" class="admin-card text-sm font-semibold text-gray-600">
        Loading videos...
      </div>

      <div v-else-if="videos.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <VideoCard v-for="video in videos" :key="video.id" :video="video" />
      </div>

      <div v-else class="admin-card text-sm font-semibold text-gray-600">
        No videos found.
      </div>
    </main>
  </div>
</template>
