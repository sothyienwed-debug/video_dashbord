<script setup>
const stats = [
  { label: 'Total Videos', value: '1,284', detail: '+24 this week' },
  { label: 'Categories', value: '18', detail: '6 featured' },
  { label: 'Users', value: '9,420', detail: '+312 this month' },
  { label: 'Pending Review', value: '37', detail: 'Needs action' },
]

const uploads = [
  { id: 'VID-1048', title: 'Bangkok Street Food Night', category: 'Travel', status: 'Published' },
  { id: 'VID-1047', title: 'Intro to Thai Grammar', category: 'Education', status: 'Review' },
  { id: 'VID-1046', title: 'Indie Music Session', category: 'Music', status: 'Draft' },
  { id: 'VID-1045', title: 'Weekend Football Recap', category: 'Sport', status: 'Published' },
]
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-card bg-primaryBlue p-6 text-white shadow-soft sm:p-8">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">Welcome back</p>
        <h2 class="mt-3 text-3xl font-extrabold sm:text-4xl">TeenTH video operations are ready.</h2>
        <p class="mt-3 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
          Review uploads, manage categories, and keep your publishing flow moving from one clean admin space.
        </p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="item in stats" :key="item.label" class="admin-card">
        <p class="text-sm font-semibold text-muted">{{ item.label }}</p>
        <div class="mt-4 flex items-end justify-between gap-3">
          <p class="text-3xl font-extrabold text-textDark">{{ item.value }}</p>
          <span class="rounded-full bg-softPurple px-3 py-1 text-xs font-bold text-primaryBlue">
            {{ item.detail }}
          </span>
        </div>
      </article>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1fr_360px]">
      <article class="admin-card overflow-hidden p-0">
        <div class="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 class="text-lg font-bold text-textDark">Latest uploads</h3>
            <p class="text-sm text-muted">Recent content submitted to TeenTH.</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Video Title</th>
                <th>Category</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="video in uploads" :key="video.id">
                <td class="font-semibold text-primaryBlue">{{ video.id }}</td>
                <td>{{ video.title }}</td>
                <td>{{ video.category }}</td>
                <td>
                  <span class="status-pill">{{ video.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>

      <article class="admin-card">
        <h3 class="text-lg font-bold text-textDark">Admin flow</h3>
        <div class="mt-5 space-y-4">
          <div class="flow-step">
            <span>1</span>
            <div>
              <p class="font-bold text-textDark">Upload</p>
              <p class="text-sm text-muted">Add title, category, permission, and source file.</p>
            </div>
          </div>
          <div class="flow-step">
            <span>2</span>
            <div>
              <p class="font-bold text-textDark">Review</p>
              <p class="text-sm text-muted">Check metadata and approve content for publishing.</p>
            </div>
          </div>
          <div class="flow-step">
            <span>3</span>
            <div>
              <p class="font-bold text-textDark">Publish</p>
              <p class="text-sm text-muted">Make approved videos visible to the right audience.</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
