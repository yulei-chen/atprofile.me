<script setup lang="ts">
interface Props {
  src?: string
  icon?: string
  description?: string
  link?: string
}

defineProps<Props>()
</script>

<template>
  <NuxtLink
    v-if="link"
    :to="link"
    class="block"
    target="_blank"
  >
    <div class="p-5 border border-gray-200 rounded-3xl bg-white flex gap-4 cursor-pointer shadow-xs transition-shadow items-center dark:border-gray-700 dark:bg-gray-800 hover:shadow-sm">
      <!-- Left avatar/icon -->
      <div class="flex-shrink-0">
        <!-- Show image if src exists -->
        <img
          v-if="src"
          :src="src"
          alt="Avatar"
          class="rounded-lg h-8 w-8 object-cover"
        >
        <!-- Show icon if icon class exists -->
        <div
          v-else-if="icon"
          class="rounded-lg flex h-8 w-8 items-center justify-center dark:bg-gray-700"
        >
          <div :class="icon" text-2xl />
        </div>
        <!-- Default placeholder -->
        <div
          v-else
          class="rounded-lg flex h-8 w-8 items-center justify-center dark:bg-gray-700"
        >
          <div i-carbon-user text-2xl op-50 />
        </div>
      </div>

      <!-- Right text description -->
      <div>
        <p v-if="description" class="text-gray-700 break-words dark:text-gray-300">
          {{ description }}
        </p>
        <p v-else class="text-gray-400 italic dark:text-gray-500">
          No description
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
