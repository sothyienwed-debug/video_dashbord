const STORAGE_KEY = 'video-admin-categories'

const seedCategories = [
  { id: 1, name: 'Anime Series', slug: 'anime-series', status: 'active', permission: 'public', videoCount: 8 },
  { id: 2, name: 'Movies', slug: 'movies', status: 'active', permission: 'public', videoCount: 5 },
  { id: 3, name: 'Members Only', slug: 'members-only', status: 'inactive', permission: 'private', videoCount: 2 },
]

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const read = () => {
  if (typeof localStorage === 'undefined') return seedCategories

  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCategories))
    return seedCategories
  }

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCategories))
    return seedCategories
  }
}

const write = (categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
}

export const categoryService = {
  async list() {
    return read()
  },

  async create(payload) {
    const categories = read()
    const category = {
      id: Date.now(),
      name: payload.name.trim(),
      slug: payload.slug?.trim() || slugify(payload.name),
      status: payload.status,
      permission: payload.permission,
      videoCount: 0,
    }

    write([category, ...categories])
    return category
  },

  async update(id, payload) {
    const categories = read()
    const nextCategories = categories.map((category) =>
      category.id === id
        ? {
            ...category,
            name: payload.name.trim(),
            slug: payload.slug?.trim() || slugify(payload.name),
            status: payload.status,
            permission: payload.permission,
          }
        : category,
    )

    write(nextCategories)
    return nextCategories.find((category) => category.id === id)
  },

  async remove(id) {
    write(read().filter((category) => category.id !== id))
  },
}
