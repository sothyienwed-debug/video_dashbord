<script setup>
import { onMounted, ref } from 'vue'
import CategoryForm from '../components/CategoryForm.vue'
import { useCategoryStore } from '../stores/category'

const categoryStore = useCategoryStore()
const editingCategory = ref(null)
const message = ref('')

onMounted(() => {
  categoryStore.loadCategories()
})

const editCategory = (category) => {
  editingCategory.value = { ...category }
  message.value = ''
}

const saved = () => {
  message.value = editingCategory.value ? 'Category updated.' : 'Category created.'
  editingCategory.value = null
}

const deleteCategory = async (category) => {
  if (window.confirm(`Delete category "${category.name}"?`)) {
    await categoryStore.deleteCategory(category.id)
    message.value = 'Category deleted.'
  }
}
</script>

<template>
  <section class="grid gap-6 xl:grid-cols-[24rem_1fr]">
    <div class="space-y-4">
      <CategoryForm :category="editingCategory" @saved="saved" @cancel="editingCategory = null" />
      <div v-if="message" class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        {{ message }}
      </div>
    </div>

    <div class="table-wrap">
      <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h2 class="text-base font-bold text-gray-900">Categories</h2>
        <span class="text-sm font-semibold text-gray-500">{{ categoryStore.totalCategories }} total</span>
      </div>

      <div class="overflow-x-auto">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Permission</th>
              <th>Videos</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categoryStore.categories" :key="category.id">
              <td class="font-semibold text-gray-900">{{ category.name }}</td>
              <td>{{ category.slug }}</td>
              <td>
                <span class="status-pill" :class="category.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'">
                  {{ category.status }}
                </span>
              </td>
              <td>
                <span class="status-pill" :class="category.permission === 'public' ? 'bg-cyan-50 text-cyan-700' : 'bg-indigo-50 text-indigo-700'">
                  {{ category.permission }}
                </span>
              </td>
              <td>{{ category.videoCount }}</td>
              <td>
                <div class="flex flex-wrap gap-2">
                  <button type="button" class="btn-secondary py-1.5 text-xs" @click="editCategory(category)">Edit</button>
                  <button type="button" class="btn-danger py-1.5 text-xs" @click="deleteCategory(category)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
