<script setup>
import { reactive, ref, watch } from 'vue'
import { useCategoryStore } from '../stores/category'

const props = defineProps({
  category: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['saved', 'cancel'])
const categoryStore = useCategoryStore()

const form = reactive({
  name: '',
  slug: '',
  status: 'active',
  permission: 'public',
})

const error = ref('')
const saving = ref(false)

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

watch(
  () => props.category,
  (category) => {
    form.name = category?.name || ''
    form.slug = category?.slug || ''
    form.status = category?.status || 'active'
    form.permission = category?.permission || 'public'
    error.value = ''
  },
  { immediate: true },
)

const updateSlug = () => {
  if (!props.category) {
    form.slug = slugify(form.name)
  }
}

const reset = () => {
  form.name = ''
  form.slug = ''
  form.status = 'active'
  form.permission = 'public'
  error.value = ''
  emit('cancel')
}

const submit = async () => {
  error.value = ''

  if (!form.name.trim()) {
    error.value = 'Category name is required.'
    return
  }

  saving.value = true

  try {
    if (props.category) {
      await categoryStore.updateCategory(props.category.id, form)
    } else {
      await categoryStore.createCategory(form)
      form.name = ''
      form.slug = ''
      form.status = 'active'
      form.permission = 'public'
    }

    emit('saved')
  } catch (err) {
    error.value = err.message || 'Unable to save category.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="admin-card space-y-5" @submit.prevent="submit">
    <div>
      <h2 class="text-lg font-bold text-gray-900">{{ category ? 'Edit Category' : 'Create Category' }}</h2>
    </div>

    <label class="form-label">
      Category Name
      <input v-model="form.name" class="form-input" type="text" placeholder="Category name" @input="updateSlug" />
    </label>

    <label class="form-label">
      Category Slug
      <input v-model="form.slug" class="form-input" type="text" placeholder="category-slug" />
    </label>

    <div class="grid gap-4 sm:grid-cols-2">
      <label class="form-label">
        Status
        <select v-model="form.status" class="form-input">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>

      <label class="form-label">
        Permission
        <select v-model="form.permission" class="form-input">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </label>
    </div>

    <div v-if="error" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-admin-red">
      {{ error }}
    </div>

    <div class="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
      <button type="button" class="btn-secondary" :disabled="saving" @click="reset">Cancel</button>
      <button type="submit" class="btn-primary" :disabled="saving">
        {{ saving ? 'Saving...' : category ? 'Update Category' : 'Create Category' }}
      </button>
    </div>
  </form>
</template>
