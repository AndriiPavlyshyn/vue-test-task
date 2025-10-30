import { Game }        from '@/types/interfaces';
import { defineStore } from 'pinia'
import axios           from 'axios'

export const useGamesStore = defineStore('games', {
	state: () => ({
		games: [] as Game[],
		loading: false as boolean,
		error: null as string | null
	}),

	actions: {
		async fetchGames() {
			try {
				this.loading = true
				const { data } = await axios.get('http://localhost:3001/games')
				this.games = data
			} catch (err: any) {
				this.error = err.message || 'Failed to load games'
			} finally {
				this.loading = false
			}
		}
	}
})
