<script setup>
import UploadForm from '../components/UploadForm.vue'
</script>

<template>
  <section class="mx-auto max-w-5xl space-y-6">
    <div>
      <h2 class="text-lg font-bold text-gray-900">Upload Video</h2>
      <p class="text-sm text-gray-500">Add video metadata, thumbnail, category, and publishing status.</p>
    </div>

    <UploadForm />
  </section>
</template>
