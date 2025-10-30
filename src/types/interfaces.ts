import { GameStatuses } from '@/types/enums';
import { BetType }      from '@/types/types';


export interface Game {
	id: string
	sport: string
	homeTeam: string
	awayTeam: string
	startTime: string
	odds: {
		homeWin: number
		draw?: number
		awayWin: number
	}
	status: GameStatuses
}

export interface BetSelection {
	game: Game
	betType: BetType
	stake: number
	odds: number
}

export interface Payload {
	selections: BetSelection[]
	totalStake: number
	totalPotentialPayout: number
	acceptedTerms: boolean
	timestamp: string
}
