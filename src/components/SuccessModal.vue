<template>
	<div class="fixed inset-0 top-0 left-0 flex items-center justify-center bg-black/80 z-50">
		<div class="bg-white rounded-xl shadow-xl w-[90%] max-w-md p-6 flex flex-col gap-2">
			<h2 class="text-xl text-black font-semibold text-center mb-4">🎉 Bet Confirmed!</h2>

			<p class="text-gray-600 text-sm text-center mb-4">
				Your bet has been successfully placed.<br />
				Reference number: <strong>#{{ betId }}</strong>
			</p>

			<div class="border-t border-b py-3 space-y-2 text-sm">
				<div v-for="selection in cachedSelections" :key="selection.game.id" class="flex justify-between">
					<div>
						<div class="text-gray-500 font-medium">Game #{{ selection.game.id }}</div>
						<div class="text-gray-500 text-xs">Bet: {{ selection.betType.toUpperCase() }}</div>
					</div>
					<div class="text-right">
						<div class="text-gray-500">Stake: €{{ selection.stake.toFixed(2) }}</div>
					</div>
				</div>
			</div>

			<div class="flex justify-between text-black font-medium">
				<span>Total Stake:</span>
				<span>€{{ totalStake.toFixed(2) }}</span>
			</div>
			<div class="flex justify-between text-black font-medium">
				<span>Total Payout:</span>
				<span>€{{ totalPotentialPayout?.toFixed(2) }}</span>
			</div>

			<button
				@click="$emit('close')"
				class="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 mt-3 font-semibold"
			>
				Place Another Bet
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { BetSelection }                       from '@/types/interfaces';
	import { computed, defineEmits, defineProps } from 'vue';

	const props = defineProps<{
		betId: string
		selections: BetSelection[],
		totalStake: number
		totalPotentialPayout: number
	}>()

	const cachedSelections = computed(() => {
		return [...props.selections];
	})

	const emit = defineEmits(['close'])
</script>
