import api from './api'

const unwrap = (response) => response.data?.data ?? response.data

const collectionItems = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  return []
}

const fileNameFromPath = (value) => {
  if (!value) return ''

  return String(value).split('/').pop() || ''
}

const fileExtension = (value) => fileNameFromPath(value).split('.').pop()?.toLowerCase() || ''

const formatBytes = (value) => {
  const bytes = Number(value || 0)

  if (!bytes) return '0 MB'

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const categoryName = (video) => {
  if (typeof video.category === 'object' && video.category?.name) return video.category.name
  if (typeof video.category === 'string') return video.category

  return video.categoryName || 'Uncategorized'
}

const normalizeVideo = (video) => ({
  ...video,
  categoryId: Number(video.category_id ?? video.categoryId ?? 0),
  categoryName: categoryName(video),
  popup_ads_url: video.popup_ads_url || video.ad_link || '',
  duration: Number(video.duration || 0),
  format: fileExtension(video.video_file || video.video_url || video.videoName) || 'mp4',
  videoName: fileNameFromPath(video.video_file || video.video_url) || video.videoName || 'video',
  videoUrl: video.stream_full_url || video.compressed_video_full_url || video.video_url || '',
  thumbnailName: fileNameFromPath(video.thumbnail || video.thumbnail_url) || video.thumbnailName || 'thumbnail',
  thumbnailUrl: video.thumbnail_url || video.thumbnailUrl || '',
  size: formatBytes(video.original_size || video.compressed_size),
  createdAt: video.created_at || video.createdAt || new Date().toISOString(),
  owner: video.owner || 'Admin',
})

const createFormData = (payload) => {
  const formData = new FormData()

  formData.append('title', payload.title.trim())
  formData.append('description', payload.description.trim())
  formData.append('category_id', String(payload.categoryId))
  formData.append('status', payload.status)
  formData.append('duration', String(Math.round(payload.duration || 0)))
  formData.append('popup_ads_url', payload.popup_ads_url.trim())
  formData.append('video_file', payload.videoFile)
  formData.append('thumbnail', payload.thumbnailFile)

  return formData
}

export const videoService = {
  async list(params = {}) {
    const response = await api.get('/videos', {
      params: {
        per_page: params.per_page || 100,
        status: params.status || undefined,
        search: params.search || undefined,
        sort: params.sort || undefined,
      },
    })

    return collectionItems(unwrap(response)).map(normalizeVideo)
  },

  async create(payload, onProgress) {
    const response = await api.post('/videos', createFormData(payload), {
      onUploadProgress(event) {
        if (!event.total) return

        onProgress?.(Math.round((event.loaded * 100) / event.total))
      },
    })

    onProgress?.(100)

    return normalizeVideo(unwrap(response))
  },

  async updateStatus(id, status) {
    const response = await api.patch(`/videos/${id}`, { status })

    return normalizeVideo(unwrap(response))
  },

  async remove(id) {
    await api.delete(`/videos/${id}`)
  },
}
