import { defineStore } from 'pinia'
import { categoryService } from '../services/categoryService'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    loading: false,
    error: '',
  }),

  getters: {
    totalCategories: (state) => state.categories.length,
    activeCategories: (state) => state.categories.filter((category) => category.status === 'active'),
  },

  actions: {
    async loadCategories() {
      this.loading = true
      this.error = ''

      try {
        this.categories = await categoryService.list()
      } catch (error) {
        this.error = error.message || 'Unable to load categories.'
      } finally {
        this.loading = false
      }
    },

    async createCategory(payload) {
      const category = await categoryService.create(payload)
      this.categories = [category, ...this.categories]
      return category
    },

    async updateCategory(id, payload) {
      const category = await categoryService.update(id, payload)
      this.categories = this.categories.map((item) => (item.id === id ? category : item))
      return category
    },

    async deleteCategory(id) {
      await categoryService.remove(id)
      this.categories = this.categories.filter((category) => category.id !== id)
    },
  },
})
