import api from './api'

const unwrap = (response) => response.data?.data ?? response.data

const collectionItems = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  return []
}

const normalizeCategory = (category) => ({
  ...category,
  permission: category.permission || 'public',
  videoCount: Number(category.video_count ?? category.videos_count ?? category.videoCount ?? 0),
})

const categoryPayload = (payload) => ({
  name: payload.name.trim(),
  description: payload.description || '',
  status: payload.status,
})

export const categoryService = {
  async list(params = {}) {
    const response = await api.get('/categories', {
      params: {
        status: params.status || undefined,
      },
    })

    return collectionItems(unwrap(response)).map(normalizeCategory)
  },

  async create(payload) {
    const response = await api.post('/categories', categoryPayload(payload))

    return normalizeCategory(unwrap(response))
  },

  async update(id, payload) {
    const response = await api.put(`/categories/${id}`, categoryPayload(payload))

    return normalizeCategory(unwrap(response))
  },

  async remove(id) {
    await api.delete(`/categories/${id}`)
  },
}
