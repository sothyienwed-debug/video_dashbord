<script setup>
import { computed, onMounted, ref } from 'vue'
import VideoCard from '../components/VideoCard.vue'
import { useVideoStore } from '../stores/video'

const videoStore = useVideoStore()
const search = ref('')
const status = ref('all')

onMounted(() => {
  videoStore.loadVideos()
})

const filteredVideos = computed(() => {
  return videoStore.videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = status.value === 'all' || video.status === status.value
    return matchesSearch && matchesStatus
  })
})

const statusClass = (value) => {
  if (value === 'published') return 'bg-emerald-50 text-emerald-700'
  if (value === 'pending') return 'bg-amber-50 text-amber-700'
  return 'bg-gray-100 text-gray-700'
}

const formatDate = (value) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))

const deleteVideo = async (video) => {
  if (window.confirm(`Delete "${video.title}"?`)) {
    await videoStore.deleteVideo(video.id)
  }
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-lg font-bold text-gray-900">Manage Videos</h2>
        <p class="text-sm text-gray-500">Review, publish, and delete uploaded videos.</p>
      </div>
      <RouterLink to="/upload-video" class="btn-primary">Upload Video</RouterLink>
    </div>

    <div class="admin-card">
      <div class="grid gap-4 md:grid-cols-[1fr_14rem]">
        <input v-model="search" class="form-input mt-0" type="search" placeholder="Search by title" />
        <select v-model="status" class="form-input mt-0">
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
        </select>
      </div>
    </div>

    <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <VideoCard v-for="video in filteredVideos.slice(0, 3)" :key="video.id" :video="video" />
    </div>

    <div class="table-wrap">
      <div class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Video</th>
              <th>Category</th>
              <th>Status</th>
              <th>Uploaded</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="video in filteredVideos" :key="video.id">
              <td>
                <p class="font-semibold text-gray-900">{{ video.title }}</p>
                <p class="text-xs text-gray-500">{{ video.videoName }} · {{ video.size }}</p>
              </td>
              <td>{{ video.categoryName }}</td>
              <td><span class="status-pill" :class="statusClass(video.status)">{{ video.status }}</span></td>
              <td>{{ formatDate(video.createdAt) }}</td>
              <td>{{ video.owner }}</td>
              <td>
                <div class="flex flex-wrap items-center gap-2">
                  <select class="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold" :value="video.status" @change="videoStore.updateStatus(video.id, $event.target.value)">
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="published">Published</option>
                  </select>
                  <button type="button" class="btn-danger py-1.5 text-xs" @click="deleteVideo(video)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
