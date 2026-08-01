import {
  getPlayerCareerStats,
} from "./player";

import {
  getPlayerTrendAnalytics,
} from "./trends";

import type {
  PlayerRankingEntry,
  PlayerRankings,
} from "./types";

import {
  roundPercentage,
} from "./utils";

interface UnrankedPlayer {
  playerId: string;

  careerPoints: number;
  careerWins: number;
  careerMatches: number;
  careerWinPercentage: number;
  careerUnbeatenPercentage: number;

  currentFormPoints: number;
  currentFormWins: number;
  currentFormMatches: number;
  currentFormWinPercentage: number;
  currentFormUnbeatenPercentage: number;

  powerScore: number;
  momentum: number;
}

function calculatePowerScore(
  careerWinPercentage: number,
  careerUnbeatenPercentage: number,
  currentFormWinPercentage: number,
): number {
  /*
   * Power score weighting:
   *
   * 45% career win percentage
   * 20% career unbeaten percentage
   * 35% current form win percentage
   */
  return roundPercentage(
    careerWinPercentage * 0.45 +
      careerUnbeatenPercentage * 0.2 +
      currentFormWinPercentage * 0.35,
  );
}

function buildUnrankedPlayer(
  playerId: string,
): UnrankedPlayer {
  const career =
    getPlayerCareerStats(playerId);

  const trends =
    getPlayerTrendAnalytics(playerId);

  const currentForm =
    trends.currentForm;

  return {
    playerId,

    careerPoints:
      career.points,

    careerWins:
      career.wins,

    careerMatches:
      career.played,

    careerWinPercentage:
      career.winPercentage,

    careerUnbeatenPercentage:
      career.unbeatenPercentage,

    currentFormPoints:
      currentForm.points,

    currentFormWins:
      currentForm.wins,

    currentFormMatches:
      currentForm.played,

    currentFormWinPercentage:
      currentForm.winPercentage,

    currentFormUnbeatenPercentage:
      currentForm.unbeatenPercentage,

    powerScore:
      calculatePowerScore(
        career.winPercentage,
        career.unbeatenPercentage,
        currentForm.winPercentage,
      ),

    momentum:
      roundPercentage(
        currentForm.winPercentage -
          career.winPercentage,
      ),
  };
}

function compareCareer(
  a: UnrankedPlayer,
  b: UnrankedPlayer,
): number {
  if (
    b.careerPoints !==
    a.careerPoints
  ) {
    return (
      b.careerPoints -
      a.careerPoints
    );
  }

  if (
    b.careerWinPercentage !==
    a.careerWinPercentage
  ) {
    return (
      b.careerWinPercentage -
      a.careerWinPercentage
    );
  }

  if (
    b.careerWins !==
    a.careerWins
  ) {
    return (
      b.careerWins -
      a.careerWins
    );
  }

  if (
    b.careerMatches !==
    a.careerMatches
  ) {
    return (
      b.careerMatches -
      a.careerMatches
    );
  }

  return a.playerId.localeCompare(
    b.playerId,
  );
}

function compareCurrentForm(
  a: UnrankedPlayer,
  b: UnrankedPlayer,
): number {
  if (
    b.currentFormPoints !==
    a.currentFormPoints
  ) {
    return (
      b.currentFormPoints -
      a.currentFormPoints
    );
  }

  if (
    b.currentFormWinPercentage !==
    a.currentFormWinPercentage
  ) {
    return (
      b.currentFormWinPercentage -
      a.currentFormWinPercentage
    );
  }

  if (
    b.currentFormWins !==
    a.currentFormWins
  ) {
    return (
      b.currentFormWins -
      a.currentFormWins
    );
  }

  return a.playerId.localeCompare(
    b.playerId,
  );
}

function comparePower(
  a: UnrankedPlayer,
  b: UnrankedPlayer,
): number {
  if (
    b.powerScore !==
    a.powerScore
  ) {
    return (
      b.powerScore -
      a.powerScore
    );
  }

  if (
    b.currentFormWinPercentage !==
    a.currentFormWinPercentage
  ) {
    return (
      b.currentFormWinPercentage -
      a.currentFormWinPercentage
    );
  }

  if (
    b.careerPoints !==
    a.careerPoints
  ) {
    return (
      b.careerPoints -
      a.careerPoints
    );
  }

  return a.playerId.localeCompare(
    b.playerId,
  );
}

function assignRanks(
  players: UnrankedPlayer[],
  careerOrder: UnrankedPlayer[],
  formOrder: UnrankedPlayer[],
  powerOrder: UnrankedPlayer[],
): PlayerRankingEntry[] {
  const careerRankMap = new Map(
    careerOrder.map(
      (player, index) => [
        player.playerId,
        index + 1,
      ],
    ),
  );

  const formRankMap = new Map(
    formOrder.map(
      (player, index) => [
        player.playerId,
        index + 1,
      ],
    ),
  );

  const powerRankMap = new Map(
    powerOrder.map(
      (player, index) => [
        player.playerId,
        index + 1,
      ],
    ),
  );

  return players.map(
    (player): PlayerRankingEntry => ({
      ...player,

      careerRank:
        careerRankMap.get(
          player.playerId,
        ) ?? 0,

      formRank:
        formRankMap.get(
          player.playerId,
        ) ?? 0,

      powerRank:
        powerRankMap.get(
          player.playerId,
        ) ?? 0,
    }),
  );
}

export function getPlayerRankings(
  playerIds: string[],
): PlayerRankings {
  const uniquePlayerIds =
    Array.from(
      new Set(
        playerIds.filter(Boolean),
      ),
    );

  const players =
    uniquePlayerIds.map(
      buildUnrankedPlayer,
    );

  const careerOrder = [
    ...players,
  ].sort(compareCareer);

  const formOrder = [
    ...players,
  ].sort(compareCurrentForm);

  const powerOrder = [
    ...players,
  ].sort(comparePower);

  const rankedPlayers =
    assignRanks(
      players,
      careerOrder,
      formOrder,
      powerOrder,
    );

  const rankingMap = new Map(
    rankedPlayers.map(
      (player) => [
        player.playerId,
        player,
      ],
    ),
  );

  return {
    playerIds:
      uniquePlayerIds,

    career:
      careerOrder
        .map((player) =>
          rankingMap.get(
            player.playerId,
          ),
        )
        .filter(
          (
            player,
          ): player is PlayerRankingEntry =>
            Boolean(player),
        ),

    currentForm:
      formOrder
        .map((player) =>
          rankingMap.get(
            player.playerId,
          ),
        )
        .filter(
          (
            player,
          ): player is PlayerRankingEntry =>
            Boolean(player),
        ),

    power:
      powerOrder
        .map((player) =>
          rankingMap.get(
            player.playerId,
          ),
        )
        .filter(
          (
            player,
          ): player is PlayerRankingEntry =>
            Boolean(player),
        ),
  };
}

export function getPlayerRanking(
  playerId: string,
  playerIds: string[],
): PlayerRankingEntry | undefined {
  return getPlayerRankings(
    playerIds,
  ).power.find(
    (player) =>
      player.playerId === playerId,
  );
}