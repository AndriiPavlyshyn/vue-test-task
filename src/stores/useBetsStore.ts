import { BetSelection } from '@/types/interfaces';
import axios            from 'axios';
import { defineStore }        from 'pinia'

export const useBetsStore = defineStore('bets', {
	state: () => ({
		selections: [] as BetSelection[],
		acceptedTerms: false as boolean,
		loading: false as boolean,
		success: false as boolean,
		error: null as string | null
	}),

	getters: {
		totalStake: (state) => {
			return state.selections.reduce((sum, state) => {
				return sum + (state.stake || 0);
			}, 0);
		},
		totalPayout: (state) => {
			return state.selections.reduce((sum, state) => {
				return sum + state.stake * state.odds;
			}, 0);
		},
	},

	actions: {
		async placeBet() {
			this.loading = true
			this.success = false
			this.error = null

			try {
				await new Promise((resolve) => {
					return setTimeout(resolve, 1500);
				})

				const payload = {
					selections: this.selections.map((selection: BetSelection) => ({
						gameId: selection.game.id,
						betType: selection.betType,
						stake: selection.stake,
						odds: selection.odds,
						potentialPayout: +(selection.stake * selection.odds).toFixed(2)
					})),
					totalStake: +this.totalStake.toFixed(2),
					totalPotentialPayout: +this.totalPayout.toFixed(2),
					acceptedTerms: true,
					timestamp: new Date().toISOString()
				}

				const response = await axios.post('http://localhost:3001/bets', payload)

				console.log(response);

				this.success = true;
			} catch (e: any) {
				this.error = e.message || 'Something went wrong.';
			} finally {
				this.loading = false;
			}
		},
		addSelection(selection: BetSelection) {
			const exists = this.selections.find((selectionItem: BetSelection) => {
				return selectionItem.game.id === selection.game.id;
			})

			if (exists) {
				exists.betType = selection.betType;
				exists.odds = selection.odds;
			} else {
				this.selections.push(selection);
			}
		},
		removeSelection(gameId: string) {
			this.selections = this.selections.filter((selection: BetSelection) => {
				return selection.game.id !== gameId;
			})
		},
		clear() {
			this.success = false;
			this.selections = [];
			this.acceptedTerms = false;
		}
	}
})
