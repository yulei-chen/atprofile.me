<script setup lang="ts">
</script>

<template>
  <div class="skeleton-container">
    <!-- Profile skeleton -->
    <div class="mb-8">
      <!-- Avatar skeleton -->
      <div class="mb-4 rounded-full bg-gray-300 h-32 w-32 animate-pulse dark:bg-gray-700" />

      <!-- Name skeleton -->
      <div class="mb-4">
        <div class="mb-2 rounded bg-gray-300 h-8 w-48 animate-pulse dark:bg-gray-700" />
        <div class="mb-4 rounded bg-gray-300 h-6 w-32 animate-pulse dark:bg-gray-700" />
      </div>

      <!-- Description skeleton -->
      <div class="mb-6 max-w-2xl space-y-2">
        <div class="rounded bg-gray-300 h-4 animate-pulse dark:bg-gray-700" />
        <div class="rounded bg-gray-300 h-4 w-5/6 animate-pulse dark:bg-gray-700" />
      </div>

      <!-- Card skeleton -->

      <div class="space-y-4">
        <div class="p-5 border border-gray-200 rounded-3xl bg-white flex gap-4 dark:border-gray-700 dark:bg-gray-800">
          <div class="rounded-lg bg-gray-300 flex-shrink-0 h-8 w-8 animate-pulse dark:bg-gray-700" />
          <div class="mt-2 flex-1">
            <div class="rounded bg-gray-300 h-4 w-3/4 animate-pulse dark:bg-gray-700" />
          </div>
        </div>

        <div class="p-5 border border-gray-200 rounded-3xl bg-white flex gap-4 dark:border-gray-700 dark:bg-gray-800">
          <div class="rounded-lg bg-gray-300 flex-shrink-0 h-8 w-8 animate-pulse dark:bg-gray-700" />
          <div class="mt-2 flex-1">
            <div class="rounded bg-gray-300 h-4 w-3/4 animate-pulse dark:bg-gray-700" />
          </div>
        </div>

        <div class="p-5 border border-gray-200 rounded-3xl bg-white flex gap-4 dark:border-gray-700 dark:bg-gray-800">
          <div class="rounded-lg bg-gray-300 flex-shrink-0 h-8 w-8 animate-pulse dark:bg-gray-700" />
          <div class="mt-2 flex-1">
            <div class="rounded bg-gray-300 h-4 w-3/4 animate-pulse dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-container {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
