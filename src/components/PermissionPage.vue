<script setup lang="ts">
const roles = [
  { role: 'Admin', access: 'Full access to dashboard, settings, users, permissions, and video publishing.' },
  { role: 'Editor', access: 'Can upload, edit, categorize, and prepare videos for review.' },
  { role: 'Moderator', access: 'Can review pending videos, manage comments, and flag content.' },
  { role: 'Viewer', access: 'Can view public and permitted member videos only.' },
]
</script>

<template>
  <section class="admin-card overflow-hidden p-0">
    <div class="border-b border-border px-5 py-4">
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Access control</p>
      <h2 class="mt-2 text-2xl font-extrabold text-textDark">Permission</h2>
    </div>

    <div class="divide-y divide-border">
      <article v-for="role in roles" :key="role.role" class="grid gap-2 px-5 py-5 md:grid-cols-[180px_1fr]">
        <p class="font-extrabold text-primaryBlue">{{ role.role }}</p>
        <p class="text-sm leading-6 text-muted">{{ role.access }}</p>
      </article>
    </div>
  </section>
</template>
