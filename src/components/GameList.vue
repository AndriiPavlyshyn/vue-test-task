<template>
	<div class="flex flex-col gap-3">
		<div class="flex gap-3">
			<select v-model="selectedSport" class="border p-2 rounded">
				<option value="all">All Sports</option>
				<option v-for="sport in gameNames" :key="sport" :value="sport">
					{{ sport }}
				</option>
			</select>

			<select v-model="selectedStatus" class="border p-2 rounded">
				<option value="all">All Statuses</option>
				<option v-for="status in gameStatuses" :key="status" :value="status">{{ status }}</option>
			</select>
		</div>

		<div v-if="gamesStore.loading" class="text-gray-500">Loading games...</div>
		<div v-else-if="filteredGames.length === 0" class="text-gray-400">
			No games found.
		</div>

		<div v-else class="grid grid-cols-2 gap-3">
			<div
				v-for="game in filteredGames"
				:key="game.id"
				class="border p-4 rounded-lg shadow-sm flex flex-col gap-2"
			>
				<div class="flex justify-between items-center">
					<div>
						<div class="font-semibold">{{ game.homeTeam }} vs {{ game.awayTeam }}</div>
						<div class="text-sm text-gray-500">
							{{ new Date(game.startTime).toLocaleString() }} • {{ game.sport }} • {{ game.status }}
						</div>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-2 mt-2">
					<button
						@click="selectBet(game, 'home')"
						:disabled="isButtonDisabled(game.status)"
						class="py-1 rounded border hover:bg-green-100 hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400"
						:class="{'bg-green-200 text-black': checkType(game, 'home')}"
					>
						Home ({{ getFixedNumber(game.odds.homeWin) }})
					</button>

					<button
						v-if="game.odds.draw"
						@click="selectBet(game, 'draw')"
						:disabled="isButtonDisabled(game.status)"
						class="py-1 rounded border hover:bg-green-100 hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400"
						:class="{'bg-yellow-200 text-black': checkType(game, 'draw')}"
					>
						Draw ({{ getFixedNumber(game.odds.draw) }})
					</button>

					<button
						@click="selectBet(game, 'away')"
						:disabled="isButtonDisabled(game.status)"
						class="py-1 rounded border hover:bg-green-100 hover:text-black disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-400"
						:class="{'bg-blue-200 text-black': checkType(game, 'away')}"
					>
						Away ({{ getFixedNumber(game.odds.awayWin) }})
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { CONFIG }                   from '@/config';
	import { useBetsStore }             from '@/stores/useBetsStore';
	import { useGamesStore }            from '@/stores/useGamesStore';
	import { GameStatuses, Sports }     from '@/types/enums';
	import { Game }                     from '@/types/interfaces';
	import { BetType }                  from '@/types/types';
	import { computed, onMounted, ref } from 'vue';

	const {maxBets} = CONFIG;
	const betsStore = useBetsStore();
	const gamesStore = useGamesStore();
	const selectedSport = ref<Sports | 'all'>('all');
	const selectedStatus = ref<GameStatuses | 'all'>('all');

	onMounted(() => {
		gamesStore.fetchGames();
	});

	const gameNames = Object.values(Sports);
	const gameStatuses = Object.values(GameStatuses);

	const filteredGames = computed(() => {
		return gamesStore.games.filter((game) => {
			const sportMatch = selectedSport.value === 'all' || game.sport.toLowerCase() === selectedSport.value.toLowerCase();
			const statusMatch = selectedStatus.value === 'all' || game.status.toLowerCase() === selectedStatus.value.toLowerCase();

			return sportMatch && statusMatch;
		})
	})

	const isEnoughSelections = computed(() => {
		return betsStore.selections.length >= maxBets;
	})

	function checkType(game: Game, betType: BetType): boolean {
		return betsStore.selections.some((selection) => {
			return selection.game.id === game.id && selection.betType === betType;
		});
	}

	function isButtonDisabled(status: GameStatuses): boolean {
		return status === GameStatuses.Finished || isEnoughSelections.value;
	}

	function getFixedNumber(number: number): string {
		return number.toFixed(2);
	}

	function selectBet(game: Game, type: BetType) {
		if (game.status === 'finished') {
			return alert('Cannot bet on finished games');
		}

		if (isEnoughSelections.value) {
			return alert(`Cannot add more games. Maximum ${maxBets}.`);
		}

		const odds =
			type === 'home' ? game.odds.homeWin :
				type === 'draw' ? game.odds.draw :
					game.odds.awayWin;

		betsStore.addSelection({
			game,
			betType: type,
			stake: 0,
			odds: odds || 1
		});
	}
</script>

<style scoped lang="scss">

</style>
