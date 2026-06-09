const STORAGE_KEY = 'video-admin-videos'

const seedVideos = [
  {
    id: 101,
    title: 'Spring Premiere Highlights',
    description: 'Opening preview reel for the season.',
    categoryId: 1,
    categoryName: 'Anime Series',
    status: 'published',
    duration: 484,
    format: 'mp4',
    videoName: 'spring-premiere.mp4',
    thumbnailName: 'spring-premiere.jpg',
    thumbnailUrl: '',
    size: '142 MB',
    createdAt: '2026-06-08T09:20:00.000Z',
    owner: 'Admin',
  },
  {
    id: 102,
    title: 'Midnight Feature Trailer',
    description: 'Movie category upload waiting for review.',
    categoryId: 2,
    categoryName: 'Movies',
    status: 'pending',
    duration: 356,
    format: 'webm',
    videoName: 'midnight-feature.webm',
    thumbnailName: 'midnight-feature.png',
    thumbnailUrl: '',
    size: '96 MB',
    createdAt: '2026-06-07T14:05:00.000Z',
    owner: 'Editor',
  },
  {
    id: 103,
    title: 'Private Bonus Episode',
    description: 'Draft upload for private members.',
    categoryId: 3,
    categoryName: 'Members Only',
    status: 'draft',
    duration: 592,
    format: 'mov',
    videoName: 'bonus-episode.mov',
    thumbnailName: 'bonus-episode.webp',
    thumbnailUrl: '',
    size: '188 MB',
    createdAt: '2026-06-06T18:45:00.000Z',
    owner: 'Admin',
  },
]

const read = () => {
  if (typeof localStorage === 'undefined') return seedVideos

  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedVideos))
    return seedVideos
  }

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedVideos))
    return seedVideos
  }
}

const write = (videos) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos))
}

const formatSize = (file) => {
  if (!file?.size) return '0 MB'
  return `${(file.size / 1024 / 1024).toFixed(1)} MB`
}

const waitForProgress = (onProgress) =>
  new Promise((resolve) => {
    let progress = 0
    const timer = window.setInterval(() => {
      progress = Math.min(progress + 10 + Math.round(Math.random() * 12), 100)
      onProgress?.(progress)

      if (progress >= 100) {
        window.clearInterval(timer)
        resolve()
      }
    }, 120)
  })

export const videoService = {
  async list() {
    return read().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async create(payload, onProgress) {
    await waitForProgress(onProgress)

    const videos = read()
    const video = {
      id: Date.now(),
      title: payload.title.trim(),
      description: payload.description.trim(),
      categoryId: Number(payload.categoryId),
      categoryName: payload.categoryName,
      status: payload.status,
      duration: Math.round(payload.duration),
      format: payload.videoFile.name.split('.').pop()?.toLowerCase() || 'mp4',
      videoName: payload.videoFile.name,
      thumbnailName: payload.thumbnailFile.name,
      thumbnailUrl: payload.thumbnailPreview || '',
      size: formatSize(payload.videoFile),
      createdAt: new Date().toISOString(),
      owner: 'Admin',
    }

    write([video, ...videos])
    return video
  },

  async updateStatus(id, status) {
    const videos = read()
    const nextVideos = videos.map((video) => (video.id === id ? { ...video, status } : video))
    write(nextVideos)
    return nextVideos.find((video) => video.id === id)
  },

  async remove(id) {
    write(read().filter((video) => video.id !== id))
  },
}
