import fs from 'fs';

const sports = ["Football", "Basketball", "Hockey"];
const statuses = ["upcoming", "live", "finished"];

const games = Array.from({ length: 20 }, (_, i) => ({
	id: `${i + 1}`,
	sport: sports[i % sports.length],
	homeTeam: `Team ${i + 1}A`,
	awayTeam: `Team ${i + 1}B`,
	startTime: new Date(Date.now() + i * 3600000).toISOString(),
	odds: { homeWin: Math.random() * 3, draw: Math.random() * 3, awayWin: Math.random() * 3 },
	status: statuses[i % statuses.length]
}));

fs.writeFileSync('database.json', JSON.stringify({ games, bets: [] }, null, 2));
