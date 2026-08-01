import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getTeamComparison,
} from "../../analytics/team";

import type {
  TeamAnalytics,
  TeamFormatStats,
  TeamPlayerContribution,
  TeamYearStats,
} from "../../analytics/types";

import ContentCard from "../../components/common/ContentCard";
import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";
import TeamCrest from "../../components/common/TeamCrest";

import TeamHero from "../../components/teams/TeamHero";

import type {
  TeamId,
} from "../../types";

type TeamView = "comparison" | TeamId;

export default function TeamsPage() {
  const comparison = useMemo(
    () => getTeamComparison(),
    [],
  );

  const [activeView, setActiveView] =
    useState<TeamView>("comparison");

  return (
    <>
      <PageIntro
        eyebrow="The Rivalry"
        title="Team Navy vs Team Red"
        description="Two teams. One Cup. Explore the history, identity, defining strengths and leading contributors behind the Cyder Cup rivalry."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="flex flex-wrap gap-3">
          <ViewButton
            label="Rivalry"
            active={
              activeView ===
              "comparison"
            }
            onClick={() =>
              setActiveView(
                "comparison",
              )
            }
          />

          <ViewButton
            label="Team Navy"
            active={
              activeView ===
              "navy"
            }
            onClick={() =>
              setActiveView("navy")
            }
          />

          <ViewButton
            label="Team Red"
            active={
              activeView ===
              "red"
            }
            onClick={() =>
              setActiveView("red")
            }
          />
        </div>

        {activeView ===
        "comparison" ? (
          <RivalryOverview
            navy={
              comparison.navy
            }
            red={comparison.red}
          />
        ) : (
          <TeamProfile
            team={
              activeView ===
              "navy"
                ? comparison.navy
                : comparison.red
            }
          />
        )}
      </section>
    </>
  );
}

function RivalryOverview({
  navy,
  red,
}: {
  navy: TeamAnalytics;
  red: TeamAnalytics;
}) {
  const allFormats =
    Array.from(
      new Set([
        ...navy.formats.map(
          (item) =>
            item.format,
        ),
        ...red.formats.map(
          (item) =>
            item.format,
        ),
      ]),
    );

  const seasonYears =
    Array.from(
      new Set([
        ...navy.seasons.map(
          (season) =>
            season.year,
        ),
        ...red.seasons.map(
          (season) =>
            season.year,
        ),
      ]),
    ).sort(
      (a, b) => b - a,
    );

  const currentHolder =
    getCurrentHolder(
      navy,
      red,
    );

  return (
    <div className="mt-10">
      <section className="relative overflow-hidden border border-white/10 bg-[#04111e]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(205,164,73,0.12),transparent_45%)]" />

        <div className="relative grid min-h-[520px] items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[1fr_auto_1fr] lg:px-14">
          <TeamIdentity
            team="navy"
            analytics={navy}
          />

          <div className="flex flex-col items-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-amber-300">
              All-time rivalry
            </p>

            <p className="mt-4 font-serif text-5xl text-white lg:text-6xl">
              VS
            </p>

            <div className="mt-6 h-16 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

            <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Current holder
            </p>

            <p className="mt-2 text-center font-serif text-2xl text-white">
              {currentHolder
                ? teamName(
                    currentHolder,
                  )
                : "Level"}
            </p>
          </div>

          <TeamIdentity
            team="red"
            analytics={red}
            align="right"
          />
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <ContentCard className="overflow-hidden">
          <div className="border-b border-white/10 p-7 sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300">
              Head-to-head
            </p>

            <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
              The rivalry by the numbers
            </h2>
          </div>

          <ComparisonRow
            label="Career points"
            navyValue={formatPoints(
              navy.points,
            )}
            redValue={formatPoints(
              red.points,
            )}
            navyWins={
              navy.points >
              red.points
            }
            redWins={
              red.points >
              navy.points
            }
          />

          <ComparisonRow
            label="Match wins"
            navyValue={
              navy.wins
            }
            redValue={
              red.wins
            }
            navyWins={
              navy.wins >
              red.wins
            }
            redWins={
              red.wins >
              navy.wins
            }
          />

          <ComparisonRow
            label="Win percentage"
            navyValue={`${formatPoints(
              navy.winPercentage,
            )}%`}
            redValue={`${formatPoints(
              red.winPercentage,
            )}%`}
            navyWins={
              navy.winPercentage >
              red.winPercentage
            }
            redWins={
              red.winPercentage >
              navy.winPercentage
            }
          />

          <ComparisonRow
            label="Longest winning streak"
            navyValue={
              navy.longestWinningStreak
            }
            redValue={
              red.longestWinningStreak
            }
            navyWins={
              navy.longestWinningStreak >
              red.longestWinningStreak
            }
            redWins={
              red.longestWinningStreak >
              navy.longestWinningStreak
            }
          />

          <ComparisonRow
            label="Longest unbeaten streak"
            navyValue={
              navy.longestUnbeatenStreak
            }
            redValue={
              red.longestUnbeatenStreak
            }
            navyWins={
              navy.longestUnbeatenStreak >
              red.longestUnbeatenStreak
            }
            redWins={
              red.longestUnbeatenStreak >
              navy.longestUnbeatenStreak
            }
          />
        </ContentCard>

        <ContentCard className="p-7 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300">
            Team DNA
          </p>

          <h2 className="mt-3 font-serif text-3xl text-white">
            Format strengths
          </h2>

          <div className="mt-8 space-y-7">
            {allFormats.map(
              (format) => {
                const navyFormat =
                  navy.formats.find(
                    (item) =>
                      item.format ===
                      format,
                  );

                const redFormat =
                  red.formats.find(
                    (item) =>
                      item.format ===
                      format,
                  );

                return (
                  <FormatComparison
                    key={format}
                    format={format}
                    navy={
                      navyFormat
                    }
                    red={redFormat}
                  />
                );
              },
            )}
          </div>
        </ContentCard>
      </section>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Season by season"
          title="How the rivalry has evolved"
          description="A concise view of each completed edition without repeating the full tournament archive."
        />

        <div className="mt-10 overflow-hidden border border-white/10">
          <div className="grid grid-cols-[80px_1fr_1fr] border-b border-white/10 bg-white/[0.03] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:grid-cols-[120px_1fr_1fr]">
            <span>
              Year
            </span>

            <span className="text-center">
              Team Navy
            </span>

            <span className="text-center">
              Team Red
            </span>
          </div>

          {seasonYears.map(
            (year) => {
              const navySeason =
                navy.seasons.find(
                  (season) =>
                    season.year ===
                    year,
                );

              const redSeason =
                red.seasons.find(
                  (season) =>
                    season.year ===
                    year,
                );

              const leader =
                getSeasonLeader(
                  navySeason,
                  redSeason,
                );

              return (
                <div
                  key={year}
                  className="grid grid-cols-[80px_1fr_1fr] items-center border-b border-white/10 px-4 py-5 last:border-b-0 sm:grid-cols-[120px_1fr_1fr]"
                >
                  <div>
                    <p className="font-serif text-2xl text-white">
                      {year}
                    </p>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      {leader
                        ? `${teamName(
                            leader,
                          )} led`
                        : "Level"}
                    </p>
                  </div>

                  <SeasonResult
                    season={
                      navySeason
                    }
                    team="navy"
                    winner={
                      leader ===
                      "navy"
                    }
                  />

                  <SeasonResult
                    season={
                      redSeason
                    }
                    team="red"
                    winner={
                      leader ===
                      "red"
                    }
                  />
                </div>
              );
            },
          )}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading
          eyebrow="The players"
          title="Leading contributors"
          description="The players who have delivered the most points for each side."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <ContributorPanel
            team="navy"
            players={
              navy.playerContributions
            }
          />

          <ContributorPanel
            team="red"
            players={
              red.playerContributions
            }
          />
        </div>
      </section>
    </div>
  );
}

function TeamProfile({
  team,
}: {
  team: TeamAnalytics;
}) {
  const strongestFormat =
    [...team.formats].sort(
      (a, b) => {
        if (
          b.winPercentage !==
          a.winPercentage
        ) {
          return (
            b.winPercentage -
            a.winPercentage
          );
        }

        return (
          b.points - a.points
        );
      },
    )[0];

  return (
    <div className="mt-10">
      <TeamHero team={team} />

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        <TeamHighlight
          eyebrow="Best season"
          title={
            team.bestSeason
              ? team.bestSeason.year.toString()
              : "—"
          }
          description={
            team.bestSeason
              ? `${formatPoints(
                  team.bestSeason
                    .points,
                )} points with a ${formatPoints(
                  team.bestSeason
                    .winPercentage,
                )}% win rate.`
              : "No completed season data."
          }
        />

        <TeamHighlight
          eyebrow="Strongest format"
          title={
            strongestFormat?.format ??
            "—"
          }
          description={
            strongestFormat
              ? `${formatPoints(
                  strongestFormat.winPercentage,
                )}% win rate across ${strongestFormat.played} matches.`
              : "No format data available."
          }
        />

        <TeamHighlight
          eyebrow="Longest run"
          title={`${team.longestUnbeatenStreak} matches`}
          description="The longest unbeaten sequence in team history."
        />
      </section>

      <section className="mt-16">
        <SectionHeading
          eyebrow="Performance profile"
          title="Results by format"
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {team.formats.map(
            (format) => (
              <FormatCard
                key={
                  format.format
                }
                format={
                  format
                }
                team={
                  team.teamId
                }
              />
            ),
          )}
        </div>
      </section>

      <section className="mt-16 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <ContributorPanel
          team={team.teamId}
          players={
            team.playerContributions
          }
          limit={8}
        />

        <ContentCard className="p-7 sm:p-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300">
            Team timeline
          </p>

          <h2 className="mt-3 font-serif text-3xl text-white">
            Season history
          </h2>

          <div className="mt-8 space-y-4">
            {[...team.seasons]
              .sort(
                (a, b) =>
                  b.year -
                  a.year,
              )
              .map(
                (season) => (
                  <TeamSeasonCard
                    key={`${season.year}-${season.tournamentId}`}
                    season={
                      season
                    }
                    team={
                      team.teamId
                    }
                  />
                ),
              )}
          </div>
        </ContentCard>
      </section>
    </div>
  );
}

function TeamIdentity({
  team,
  analytics,
  align = "left",
}: {
  team: TeamId;
  analytics: TeamAnalytics;
  align?: "left" | "right";
}) {
  return (
    <div
      className={
        align === "right"
          ? "flex flex-col items-center text-center lg:items-end lg:text-right"
          : "flex flex-col items-center text-center lg:items-start lg:text-left"
      }
    >
      <TeamCrest
        team={team}
        className="h-32 w-32 sm:h-40 sm:w-40"
        imageClassName="h-full w-full object-contain"
      />

      <p
        className={`mt-6 text-[10px] font-bold uppercase tracking-[0.28em] ${
          team === "navy"
            ? "text-blue-300"
            : "text-red-300"
        }`}
      >
        {teamName(team)}
      </p>

      <p className="mt-2 font-serif text-5xl text-white">
        {formatPoints(
          analytics.points,
        )}
      </p>

      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500">
        Career points
      </p>

      <p className="mt-5 text-sm text-slate-300">
        {analytics.wins} wins ·{" "}
        {analytics.ties} ties ·{" "}
        {analytics.losses} losses
      </p>
    </div>
  );
}

function ComparisonRow({
  label,
  navyValue,
  redValue,
  navyWins,
  redWins,
}: {
  label: string;
  navyValue: string | number;
  redValue: string | number;
  navyWins: boolean;
  redWins: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_1.25fr_1fr] items-center border-b border-white/10 px-5 py-5 last:border-b-0 sm:px-8">
      <p
        className={`font-serif text-2xl text-center ${
          navyWins
            ? "text-blue-300"
            : "text-white"
        }`}
      >
        {navyValue}
      </p>

      <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p
        className={`font-serif text-2xl text-center ${
          redWins
            ? "text-red-300"
            : "text-white"
        }`}
      >
        {redValue}
      </p>
    </div>
  );
}

function FormatComparison({
  format,
  navy,
  red,
}: {
  format: string;
  navy:
    | TeamFormatStats
    | undefined;
  red:
    | TeamFormatStats
    | undefined;
}) {
  const navyPercentage =
    navy?.winPercentage ?? 0;

  const redPercentage =
    red?.winPercentage ?? 0;

  const total =
    navyPercentage +
    redPercentage;

  const navyShare =
    total === 0
      ? 50
      : (navyPercentage /
          total) *
        100;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-serif text-xl text-white">
            {format}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Win percentage
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <span className="text-blue-300">
            {formatPoints(
              navyPercentage,
            )}
            %
          </span>

          <span className="text-red-300">
            {formatPoints(
              redPercentage,
            )}
            %
          </span>
        </div>
      </div>

      <div className="mt-3 flex h-2 overflow-hidden bg-white/10">
        <div
          className="bg-blue-400"
          style={{
            width: `${navyShare}%`,
          }}
        />

        <div
          className="flex-1 bg-red-400"
        />
      </div>
    </div>
  );
}

function ContributorPanel({
  team,
  players,
  limit = 5,
}: {
  team: TeamId;
  players: TeamPlayerContribution[];
  limit?: number;
}) {
  return (
    <ContentCard className="p-7 sm:p-8">
      <div className="flex items-center justify-between gap-5">
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.28em] ${
              team === "navy"
                ? "text-blue-300"
                : "text-red-300"
            }`}
          >
            {teamName(team)}
          </p>

          <h3 className="mt-3 font-serif text-3xl text-white">
            Career contributors
          </h3>
        </div>

        <TeamCrest
          team={team}
          className="h-16 w-16"
          imageClassName="h-full w-full object-contain"
        />
      </div>

      <div className="mt-8 space-y-5">
        {players
          .slice(0, limit)
          .map(
            (
              player,
              index,
            ) => (
              <ContributorRow
                key={
                  player.playerId
                }
                player={
                  player
                }
                rank={
                  index + 1
                }
                team={team}
              />
            ),
          )}
      </div>
    </ContentCard>
  );
}

function ContributorRow({
  player,
  rank,
  team,
}: {
  player: TeamPlayerContribution;
  rank: number;
  team: TeamId;
}) {
  return (
    <Link
      to={`/players/${player.playerId}`}
      className="group flex items-center gap-4 border-b border-white/10 pb-5 last:border-b-0 last:pb-0"
    >
      <p
        className={`w-8 font-serif text-2xl ${
          team === "navy"
            ? "text-blue-300"
            : "text-red-300"
        }`}
      >
        {String(rank).padStart(
          2,
          "0",
        )}
      </p>

      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-xl text-white transition group-hover:text-amber-300">
          {player.playerName}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {player.wins} wins ·{" "}
          {player.ties} ties ·{" "}
          {player.losses} losses
        </p>
      </div>

      <div className="text-right">
        <p className="font-serif text-2xl text-white">
          {formatPoints(
            player.points,
          )}
        </p>

        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Points
        </p>
      </div>
    </Link>
  );
}

function FormatCard({
  format,
  team,
}: {
  format: TeamFormatStats;
  team: TeamId;
}) {
  return (
    <ContentCard className="p-6">
      <p
        className={`text-[10px] font-bold uppercase tracking-[0.24em] ${
          team === "navy"
            ? "text-blue-300"
            : "text-red-300"
        }`}
      >
        Match format
      </p>

      <h3 className="mt-3 font-serif text-3xl text-white">
        {format.format}
      </h3>

      <div className="mt-6 grid grid-cols-2 gap-5 border-y border-white/10 py-5">
        <MiniMetric
          label="Points"
          value={formatPoints(
            format.points,
          )}
        />

        <MiniMetric
          label="Win rate"
          value={`${formatPoints(
            format.winPercentage,
          )}%`}
        />
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {format.wins} wins ·{" "}
        {format.ties} ties ·{" "}
        {format.losses} losses across{" "}
        {format.played} matches.
      </p>
    </ContentCard>
  );
}

function TeamHighlight({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <ContentCard className="p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300">
        {eyebrow}
      </p>

      <h3 className="mt-3 font-serif text-3xl text-white">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-slate-400">
        {description}
      </p>
    </ContentCard>
  );
}

function TeamSeasonCard({
  season,
  team,
}: {
  season: TeamYearStats;
  team: TeamId;
}) {
  return (
    <div className="grid grid-cols-[80px_1fr_auto] items-center gap-4 border border-white/10 bg-white/[0.02] px-4 py-4">
      <p
        className={`font-serif text-2xl ${
          team === "navy"
            ? "text-blue-300"
            : "text-red-300"
        }`}
      >
        {season.year}
      </p>

      <div>
        <p className="text-sm text-white">
          {season.wins} wins ·{" "}
          {season.ties} ties ·{" "}
          {season.losses} losses
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {formatPoints(
            season.winPercentage,
          )}
          % win rate
        </p>
      </div>

      <p className="font-serif text-2xl text-white">
        {formatPoints(
          season.points,
        )}
      </p>
    </div>
  );
}

function SeasonResult({
  season,
  team,
  winner,
}: {
  season:
    | TeamYearStats
    | undefined;
  team: TeamId;
  winner: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className={`font-serif text-2xl ${
          winner
            ? team ===
              "navy"
              ? "text-blue-300"
              : "text-red-300"
            : "text-white"
        }`}
      >
        {season
          ? formatPoints(
              season.points,
            )
          : "—"}
      </p>

      <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-slate-500">
        {season
          ? `${season.wins}-${season.losses}-${season.ties}`
          : "No data"}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="font-serif text-2xl text-white">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function ViewButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 border px-5 text-xs font-bold uppercase tracking-[0.18em] transition ${
        active
          ? "border-amber-300 bg-amber-300 text-[#061626]"
          : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function getCurrentHolder(
  navy: TeamAnalytics,
  red: TeamAnalytics,
): TeamId | undefined {
  const latestYear =
    Math.max(
      navy.mostRecentSeason
        ?.year ?? 0,
      red.mostRecentSeason
        ?.year ?? 0,
    );

  const navySeason =
    navy.seasons.find(
      (season) =>
        season.year ===
        latestYear,
    );

  const redSeason =
    red.seasons.find(
      (season) =>
        season.year ===
        latestYear,
    );

  return getSeasonLeader(
    navySeason,
    redSeason,
  );
}

function getSeasonLeader(
  navy:
    | TeamYearStats
    | undefined,
  red:
    | TeamYearStats
    | undefined,
): TeamId | undefined {
  const navyPoints =
    navy?.points ?? 0;

  const redPoints =
    red?.points ?? 0;

  if (
    navyPoints === redPoints
  ) {
    return undefined;
  }

  return navyPoints >
    redPoints
    ? "navy"
    : "red";
}

function teamName(
  team: TeamId,
): string {
  return team === "navy"
    ? "Team Navy"
    : "Team Red";
}

function formatPoints(
  value: number,
): string {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(1);
}