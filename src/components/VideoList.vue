<script setup lang="ts">
const videos = [
  {
    id: 1048,
    title: 'Bangkok Street Food Night',
    category: 'Travel',
    thumbnail: 'BS',
    thumbnailTone: 'bg-blue-100 text-primaryBlue',
    videoFile: 'bangkok-street-food.mp4',
    status: 'Published',
  },
  {
    id: 1047,
    title: 'Intro to Thai Grammar',
    category: 'Education',
    thumbnail: 'TG',
    thumbnailTone: 'bg-emerald-100 text-emerald-700',
    videoFile: 'thai-grammar-intro.mp4',
    status: 'Pending',
  },
  {
    id: 1046,
    title: 'Indie Music Session',
    category: 'Music',
    thumbnail: 'IM',
    thumbnailTone: 'bg-violet-100 text-violet-700',
    videoFile: 'indie-music-session.mp4',
    status: 'Draft',
  },
  {
    id: 1045,
    title: 'Weekend Football Recap',
    category: 'Sport',
    thumbnail: 'WF',
    thumbnailTone: 'bg-orange-100 text-orange-700',
    videoFile: 'football-recap-weekend.mp4',
    status: 'Published',
  },
  {
    id: 1044,
    title: 'Daily Entertainment Brief',
    category: 'Entertainment',
    thumbnail: 'DE',
    thumbnailTone: 'bg-rose-100 text-rose-700',
    videoFile: 'entertainment-brief.mp4',
    status: 'Review',
  },
]
</script>

<template>
  <section class="admin-card overflow-hidden p-0">
    <div class="flex flex-col justify-between gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Update Video</p>
        <h2 class="mt-2 text-2xl font-extrabold text-textDark">Video List</h2>
      </div>
      <button class="primary-button" type="button">New Upload</button>
    </div>

    <div class="overflow-x-auto">
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Video Title</th>
            <th>Category</th>
            <th>Thumbnail</th>
            <th>Video File</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="video in videos" :key="video.id">
            <td class="font-semibold text-primaryBlue">#{{ video.id }}</td>
            <td>{{ video.title }}</td>
            <td>{{ video.category }}</td>
            <td>
              <div class="video-thumbnail" :class="video.thumbnailTone">
                {{ video.thumbnail }}
              </div>
            </td>
            <td>
              <span class="video-file-chip">{{ video.videoFile }}</span>
            </td>
            <td>
              <span class="status-pill">{{ video.status }}</span>
            </td>
            <td>
              <div class="table-actions" :aria-label="`Actions for ${video.title}`">
                <button class="action-button action-button-view" type="button">
                  View
                </button>
                <button class="action-button action-button-edit" type="button">
                  Edit
                </button>
                <button class="action-button action-button-delete" type="button">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
