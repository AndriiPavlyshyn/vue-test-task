<template>
	<div class="p-4 border rounded-xl flex flex-col gap-3">
		<header class="flex items-center justify-between">
			<h2 class="text-lg font-bold">Your Bet Slip</h2>

			<div class="font-bold">{{ betsStore.selections.length }} / {{ maxBets }}</div>
		</header>

		<div v-if="betsStore.selections.length === 0" class="text-gray-400">
			No bets selected yet.
		</div>

		<div v-else class="flex flex-col gap-3">
			<div
				v-for="(selection, index) in betsStore.selections"
				:key="selection.game.id"
				class="p-3 border rounded flex flex-col gap-1 mb-3"
			>
				<div class="flex justify-between items-center">
          <span class="font-semibold text-sm">
            {{ index + 1 }}. {{ selection.game.homeTeam }} vs {{ selection.game.awayTeam }}
          </span>
					<button
						class="text-red-500 text-xs cursor-pointer"
						@click="betsStore.removeSelection(selection.game.id)"
					>
						✕
					</button>
				</div>

				<div class="flex justify-between items-center">
					<div class="text-xs text-gray-500">
						Sport: <strong>{{ selection.game.sport }}</strong>
					</div>
					<div class="text-xs text-gray-500">
						Bet: <strong>{{ selection.betType.toUpperCase() }}</strong> • Odds: {{ selection.odds.toFixed(2) }}
					</div>
				</div>

				<div class="flex items-center gap-2">
					<label class="text-sm">Stake (€)</label>
					<input
						type="number"
						v-model.number="selection.stake"
						class="border rounded p-1 w-20 text-sm"
						min="1"
						max="1000"
					/>
				</div>
			</div>

			<div class="flex justify-between font-medium mt-3 border-t pt-2">
				<span>Total Stake:</span>
				<span>€{{ betsStore.totalStake.toFixed(2) }}</span>
			</div>

			<div class="flex justify-between font-medium">
				<span>Potential Payout:</span>
				<span>€{{ totalPayout.toFixed(2) }}</span>
			</div>

			<div class="flex items-center gap-2 mt-2">
				<input id="terms" type="checkbox" v-model="acceptedTerms" />
				<label for="terms" class="text-sm">I accept the Terms & Conditions</label>
			</div>

			<ul v-if="validationErrors.length" class="text-red-500 text-sm ml-4">
				<li v-for="error in validationErrors" :key="error">{{ error }}</li>
			</ul>

			<button
				@click="placeBet"
				:disabled="!isFormValid || betsStore.loading"
				class="w-full py-2 mt-3 rounded bg-green-500 text-white font-semibold hover:bg-green-600 disabled:opacity-50"
			>
				<span v-if="betsStore.loading">Placing bet...</span>
				<span v-else>Place Bet</span>
			</button>

			<div v-if="betsStore.error" class="text-red-600 text-sm font-medium mt-2">
				{{ betsStore.error }}
			</div>
		</div>
	</div>

	<SuccessModal
		v-if="betsStore.success"
		:betId="getBetId()"
		:selections="betsStore.selections"
		:totalStake="betsStore.totalStake"
		:totalPotentialPayout="totalPayout"
		@close="clearFlow()"
	/>

	<ErrorModal
		v-if="betsStore.error"
		:message="betsStore.error"
		@retry="betsStore.retry()"
		@close="betsStore.resetFlags()"
	/>
</template>

<script setup lang="ts">
	import ErrorModal       from '@/components/ErrorModal.vue';
	import SuccessModal     from '@/components/SuccessModal.vue';
	import { CONFIG }       from '@/config';
	import { computed }     from 'vue'
	import { useBetsStore } from '@/stores/useBetsStore'

	const betsStore = useBetsStore();
	const { maxBets } = CONFIG;

	const acceptedTerms = computed({
		get: () => betsStore.acceptedTerms,
		set: (val) => (betsStore.acceptedTerms = val)
	});

	const validationErrors = computed(() => {
		const errors: string[] = []

		if (betsStore.selections.length === 0) {
			errors.push('Select at least one game.');
		}

		if (betsStore.selections.length > maxBets) {
			errors.push(`You can select a maximum of ${maxBets} games.`);
		}

		if (!acceptedTerms.value) {
			errors.push('You must accept terms & conditions.');
		}

		betsStore.selections.forEach(({game, stake}, i) => {
			const index = i + 1;

			if (game.status === 'finished') {
				errors.push(`${game.homeTeam} vs ${game.awayTeam} is finished.`);
			}

			if (stake < 1 || stake > 1000) {
				errors.push(`Stake for game ${index} (${game.homeTeam} vs ${game.awayTeam}) must be between €1 and €1000.`);
			}
		})

		return errors
	})

	const isFormValid = computed(() => {
		return validationErrors.value.length === 0;
	})

	const totalPayout = computed(() => {
		return betsStore.selections.reduce((sum, selection) => {
			return sum + (selection.stake * selection.odds);
		}, 0);
	})

	function getBetId(): string {
		return Math.floor(Math.random() * 1000000).toString();
	}

	function clearFlow(): void {
		betsStore.resetFlags();
		betsStore.clear();
	}

	async function placeBet() {
		if (!isFormValid.value) {
			return;
		}

		await betsStore.placeBet();
	}
</script>
