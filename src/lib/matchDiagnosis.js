// Builds 1-3 short diagnostic sentences for a single match, entirely from stats already
// shown elsewhere in the match popup (ACS, first bloods/deaths, clutches, damage, economy,
// rivals) -- no invented data. Each rule scores how notable its signal is for this
// particular match; the top-scoring ones (up to 3) are kept, so a strong match naturally
// surfaces positive lines and a rough one negative ones, instead of defaulting to either.
export function getMatchDiagnosis(match, you) {
  if (!you) return [];
  const candidates = [];

  if (you.firstDeaths >= 2) {
    candidates.push({ key: 'matchDiagFirstDeaths', params: { count: you.firstDeaths }, score: you.firstDeaths });
  }
  if (you.firstBloods >= 2) {
    candidates.push({ key: 'matchDiagFirstBloods', params: { count: you.firstBloods }, score: you.firstBloods });
  }

  if (you.clutchesPlayed >= 1 && you.clutchesWon === you.clutchesPlayed) {
    candidates.push({ key: 'matchDiagClutchGood', params: { won: you.clutchesWon, played: you.clutchesPlayed }, score: 5 + you.clutchesPlayed });
  } else if (you.clutchesPlayed >= 1 && you.clutchesWon === 0) {
    candidates.push({ key: 'matchDiagClutchMissed', params: { won: you.clutchesWon, played: you.clutchesPlayed }, score: 5 + you.clutchesPlayed });
  }

  const damageGap = you.damageDealt - you.damageReceived;
  if (damageGap < -100) {
    candidates.push({ key: 'matchDiagDamageDeficit', params: { received: you.damageReceived, dealt: you.damageDealt }, score: Math.abs(damageGap) / 100 });
  } else if (damageGap > 150 && you.damageDealt > you.damageReceived * 1.4) {
    candidates.push({ key: 'matchDiagDamageDominant', params: { dealt: you.damageDealt, received: you.damageReceived }, score: damageGap / 100 });
  }

  const isMVP = match.players.every((p) => p === you || p.acs <= you.acs);
  const isTeamTop = !isMVP && match.players.every((p) => p.team !== you.team || p === you || p.acs <= you.acs);
  if (isMVP) {
    candidates.push({ key: 'matchDiagMVP', params: { acs: you.acs }, score: 6 });
  } else if (isTeamTop) {
    candidates.push({ key: 'matchDiagTeamTop', params: { acs: you.acs }, score: 3 });
  }

  if (you.rivals?.toughest?.count >= 3) {
    candidates.push({ key: 'matchDiagToughRival', params: { name: you.rivals.toughest.name, count: you.rivals.toughest.count }, score: you.rivals.toughest.count });
  }
  if (you.rivals?.favorite?.count >= 3) {
    candidates.push({ key: 'matchDiagFavoriteTarget', params: { name: you.rivals.favorite.name, count: you.rivals.favorite.count }, score: you.rivals.favorite.count * 0.9 });
  }

  if (you.economy?.ecoRoundsPlayed >= 2 && you.economy.ecoRoundsWon / you.economy.ecoRoundsPlayed >= 0.66) {
    candidates.push({ key: 'matchDiagEcoWins', params: { won: you.economy.ecoRoundsWon, played: you.economy.ecoRoundsPlayed }, score: you.economy.ecoRoundsWon * 1.5 });
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, 3);
}
