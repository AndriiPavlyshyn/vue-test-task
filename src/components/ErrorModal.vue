<template>
	<div class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
		<div class="flex flex-col gap-4 bg-white rounded-xl w-[90%] max-w-sm p-6">
			<h2 class="text-lg font-semibold text-center text-red-600">
				Error placing bet
			</h2>

			<p class="text-sm text-gray-700 text-center">
				{{ message }}
			</p>

			<div class="grid grid-cols-2 gap-2">
				<button
					class="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
					@click="$emit('retry')"
				>
					Retry
				</button>

				<button
					class="bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
					@click="$emit('close')"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
	message: string
}>()

const emit = defineEmits(['retry', 'close'])
</script>
