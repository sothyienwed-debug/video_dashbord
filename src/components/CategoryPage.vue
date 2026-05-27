<script setup lang="ts">
const categories = [
  { name: 'Travel', count: 248, tone: 'bg-blue-50 text-primaryBlue' },
  { name: 'Education', count: 196, tone: 'bg-emerald-50 text-emerald-700' },
  { name: 'Music', count: 174, tone: 'bg-violet-50 text-violet-700' },
  { name: 'Sport', count: 142, tone: 'bg-orange-50 text-orange-700' },
  { name: 'Entertainment', count: 305, tone: 'bg-rose-50 text-rose-700' },
  { name: 'News', count: 91, tone: 'bg-surfaceMuted text-textDark' },
]
</script>

<template>
  <section class="space-y-6">
    <div class="admin-card flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Library groups</p>
        <h2 class="mt-2 text-2xl font-extrabold text-textDark">Category</h2>
      </div>
      <button class="primary-button" type="button">Add Category</button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article v-for="category in categories" :key="category.name" class="admin-card">
        <div class="flex items-start justify-between gap-4">
          <div>
            <span class="rounded-full px-3 py-1 text-xs font-bold" :class="category.tone">
              {{ category.name }}
            </span>
            <p class="mt-5 text-3xl font-extrabold text-textDark">{{ category.count }}</p>
            <p class="mt-1 text-sm text-muted">videos in collection</p>
          </div>
          <button class="icon-button" type="button" :aria-label="`Edit ${category.name}`">...</button>
        </div>
      </article>
    </div>
  </section>
</template>
