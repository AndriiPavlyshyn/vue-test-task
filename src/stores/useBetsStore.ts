import { BetSelection, Payload } from '@/types/interfaces';
import axios                     from 'axios';
import { defineStore }        from 'pinia'

export const useBetsStore = defineStore('bets', {
	state: () => ({
		selections: [] as BetSelection[],
		acceptedTerms: false as boolean,
		retryPayload: null as Payload | null,
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
			this.loading = true;
			this.success = false;
			this.error = null;

			try {
				await new Promise((resolve) => {
					return setTimeout(resolve, 1500);
				})

				const payload: Payload = {
					selections: this.selections.map(({ game, betType, stake, odds }: BetSelection) => ({
						gameId: game.id,
						betType,
						stake,
						odds,
						potentialPayout: +(stake * odds).toFixed(2)
					})),
					totalStake: +this.totalStake.toFixed(2),
					totalPotentialPayout: +this.totalPayout.toFixed(2),
					acceptedTerms: true,
					timestamp: new Date().toISOString()
				}

				this.retryPayload = payload;

				await this.createBet(payload);

				this.success = true;
			} catch (e: any) {
				this.error = e.message || 'Something went wrong.';
			} finally {
				this.loading = false;
			}
		},
		async retry() {
			this.error = null;
			this.loading = true;

			try {
				if (!this.retryPayload) {
				  console.error('No retry payload.');

					return;
				}

				await this.createBet(this.retryPayload);

				this.success = true;
			} catch (error: any) {
				this.error = error.message;
			} finally {
				this.loading = false;
			}
		},
		async createBet(payload: Payload) {
			await axios.post('http://localhost:3001/bets', payload);
		},
		addSelection(selection: BetSelection) {
			const {betType, odds, game} = selection;
			const exists = this.selections.find((selectionItem: BetSelection) => {
				return selectionItem.game.id === game.id;
			})

			if (exists) {
				exists.betType = betType;
				exists.odds = odds;
			} else {
				this.selections.push(selection);
			}
		},
		removeSelection(gameId: string) {
			this.selections = this.selections.filter(({ game }: BetSelection) => {
				return game.id !== gameId;
			})
		},
		clear() {
			this.selections = [];
			this.acceptedTerms = false;
			this.retryPayload = null;
		},
		resetFlags() {
			this.success = false;
			this.error = null;
			this.loading = false;
		}
	}
})
