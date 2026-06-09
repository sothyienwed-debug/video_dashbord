import { defineStore } from 'pinia'
import { videoService } from '../services/videoService'

export const useVideoStore = defineStore('video', {
  state: () => ({
    videos: [],
    loading: false,
    error: '',
  }),

  getters: {
    totalVideos: (state) => state.videos.length,
    pendingVideos: (state) => state.videos.filter((video) => video.status === 'pending').length,
    recentVideos: (state) => state.videos.slice(0, 6),
  },

  actions: {
    async loadVideos() {
      this.loading = true
      this.error = ''

      try {
        this.videos = await videoService.list()
      } catch (error) {
        this.error = error.message || 'Unable to load videos.'
      } finally {
        this.loading = false
      }
    },

    async uploadVideo(payload, onProgress) {
      const video = await videoService.create(payload, onProgress)
      this.videos = [video, ...this.videos]
      return video
    },

    async updateStatus(id, status) {
      const video = await videoService.updateStatus(id, status)
      this.videos = this.videos.map((item) => (item.id === id ? video : item))
    },

    async deleteVideo(id) {
      await videoService.remove(id)
      this.videos = this.videos.filter((video) => video.id !== id)
    },
  },
})
