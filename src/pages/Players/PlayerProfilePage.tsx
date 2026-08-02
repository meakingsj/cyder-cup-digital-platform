import type { ReactNode } from "react";

import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import TeamCrest from "../../components/common/TeamCrest";

import {
  getPlayerProfile,
  players,
} from "../../data";

import type {
  MatchFormat,
  MatchResult,
  PlayerFormatStats,
} from "../../data";

import {
  getMediaAltText,
  getMediaObjectPosition,
  getPlayerProfileMedia,
  type PageMediaItem,
} from "../../data/pageMedia";

import type { Player } from "../../types";

const formats: MatchFormat[] = [
  "Singles",
  "Fourball",
  "Scramble",
  "4-man Scramble",
];

const captainIds = new Set([
  "navy-george",
  "red-kevin",
]);

function initials(player: Player): string {
  return `${player.firstName.charAt(0)}${player.lastName.charAt(0)}`;
}

function formatRecord(stats: {
  wins: number;
  losses: number;
  ties: number;
}): string {
  return `${stats.wins}-${stats.losses}-${stats.ties}`;
}

function formatPoints(points: number): string {
  return Number.isInteger(points)
    ? points.toString()
    : points.toFixed(1);
}

function getFormatStats(
  playerFormats: PlayerFormatStats[],
  format: MatchFormat,
): PlayerFormatStats | undefined {
  return playerFormats.find(
    (item) => item.format === format,
  );
}

function formatLabel(format: MatchFormat): string {
  if (format === "Fourball") {
    return "Four-ball";
  }

  if (format === "4-man Scramble") {
    return "Four-man scramble";
  }

  return format;
}

function formatResultWord(
  result: MatchResult,
  count = 1,
): string {
  if (result === "W") {
    return count === 1 ? "Win" : "Wins";
  }

  if (result === "L") {
    return count === 1 ? "Loss" : "Losses";
  }

  return count === 1 ? "Tie" : "Ties";
}

function formatStreak(
  streak:
    | {
        result: MatchResult;
        length: number;
      }
    | undefined,
): string {
  if (!streak || streak.length === 0) {
    return "No active streak";
  }

  return `${streak.length} ${formatResultWord(
    streak.result,
    streak.length,
  )}`;
}

function getResultClasses(
  result: MatchResult,
): string {
  if (result === "W") {
    return "border-emerald-300/40 bg-emerald-300/10 text-emerald-200";
  }

  if (result === "L") {
    return "border-red-300/40 bg-red-300/10 text-red-200";
  }

  return "border-amber-300/40 bg-amber-300/10 text-amber-200";
}

function getResultLabel(
  result: MatchResult,
): string {
  if (result === "W") {
    return "Win";
  }

  if (result === "L") {
    return "Loss";
  }

  return "Tie";
}

function getFormatTier(
  winPercentage: number,
): {
  label: string;
  bars: number;
} {
  if (winPercentage >= 70) {
    return {
      label: "Elite",
      bars: 5,
    };
  }

  if (winPercentage >= 60) {
    return {
      label: "Major strength",
      bars: 4,
    };
  }

  if (winPercentage >= 50) {
    return {
      label: "Proven",
      bars: 3,
    };
  }

  if (winPercentage >= 35) {
    return {
      label: "Developing",
      bars: 2,
    };
  }

  return {
    label: "Opportunity",
    bars: 1,
  };
}

function getPlayerIdentity(
  formatStats: PlayerFormatStats[],
): string {
  const eligible = formatStats
    .filter((item) => item.played > 0)
    .slice()
    .sort((a, b) => {
      if (b.winPercentage !== a.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }

      return b.points - a.points;
    });

  const best = eligible[0];

  if (!best) {
    return "Cyder Cup competitor";
  }

  return `${formatLabel(best.format)} specialist`;
}

function getFormNarrative(
  currentForm: {
    played: number;
    wins: number;
    losses: number;
    ties: number;
    points: number;
    winPercentage: number;
  },
): string {
  if (currentForm.played === 0) {
    return "Recent match results are not yet available.";
  }

  if (currentForm.wins >= 4) {
    return `One of the tournament's hottest players, with ${currentForm.wins} wins across the latest ${currentForm.played} matches.`;
  }

  if (
    currentForm.wins +
      currentForm.ties >=
    4
  ) {
    return `A strong recent stretch, earning points in ${
      currentForm.wins +
      currentForm.ties
    } of the latest ${currentForm.played} matches.`;
  }

  if (currentForm.winPercentage >= 50) {
    return `A positive recent run with ${formatPoints(
      currentForm.points,
    )} points earned across the latest ${currentForm.played} matches.`;
  }

  return `Searching for momentum after earning ${formatPoints(
    currentForm.points,
  )} points across the latest ${currentForm.played} matches.`;
}

function findPlayer(
  playerId: string | null | undefined,
): Player | undefined {
  if (!playerId) {
    return undefined;
  }

  return players.find(
    (candidate) =>
      candidate.id === playerId,
  );
}

function getCompetitorLabel(
  playerId: string,
): string {
  return captainIds.has(playerId)
    ? "2026 Cyder Cup Captain"
    : "2026 Cyder Cup Competitor";
}

export default function PlayerProfilePage() {
  const { playerId } = useParams();

  const index = players.findIndex(
    (item) => item.id === playerId,
  );

  if (index < 0 || !playerId) {
    return (
      <Navigate
        to="/players"
        replace
      />
    );
  }

  const profile =
    getPlayerProfile(playerId);

  if (!profile) {
    return (
      <Navigate
        to="/players"
        replace
      />
    );
  }

  const {
    player,
    stats,
    partnerAnalytics,
    headToHeadAnalytics,
    trendAnalytics,
    ranking,
    gallery: fallbackGallery,
    records: playerRecords,
    appearances,
    appearanceYears,
  } = profile;

  const isNavy =
    player.teamId === "navy";

  const previous =
    players[
      (index - 1 + players.length) %
        players.length
    ];

  const next =
    players[
      (index + 1) %
        players.length
    ];

  const currentForm =
    trendAnalytics.currentForm;

  const bestSeason =
    trendAnalytics.bestSeason;

  const bestPartner =
    partnerAnalytics.bestPartner;

  const mostFrequentPartner =
    partnerAnalytics.mostFrequentPartner;

  const topRivalries =
    headToHeadAnalytics.opponents.slice(
      0,
      3,
    );

  const playerIdentity =
    getPlayerIdentity(stats.formats);

  const workbookGallery =
    getPlayerProfileMedia(playerId);

  const galleryItems:
    | PageMediaItem[]
    | undefined =
    workbookGallery.length > 0
      ? workbookGallery
      : undefined;

  return (
    <main className="min-h-screen overflow-hidden bg-[#061626] text-white">
      <section
        className={`relative min-h-[760px] overflow-hidden border-b border-white/10 ${
          isNavy
            ? "bg-[radial-gradient(circle_at_76%_30%,#315a7b_0%,#12324d_31%,#071a2b_61%,#04111d_100%)]"
            : "bg-[radial-gradient(circle_at_76%_30%,#b13a45_0%,#5d2028_31%,#281017_61%,#10080d_100%)]"
        }`}
      >
        <div
          className="home-grain absolute inset-0 opacity-[0.075]"
          aria-hidden="true"
        />

        <div
          className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#061626] via-[#061626]/65 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl gap-6 px-5 pt-28 sm:px-8 lg:grid-cols-[1fr_.92fr] lg:px-10 lg:pt-32">
          <div className="relative z-20 flex flex-col justify-center pb-20 lg:pb-28">
            <Link
              to="/players"
              className="inline-flex w-fit items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-white/70 transition hover:text-amber-300"
            >
              <span aria-hidden="true">←</span>
              Player directory
            </Link>

            <div className="mt-10 flex items-center gap-4">
              <TeamCrest
                team={player.teamId}
                className="h-16 w-16"
                imageClassName="h-full w-full object-contain"
              />

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-amber-300">
                  Team{" "}
                  {isNavy
                    ? "Navy"
                    : "Red"}
                </p>

                <p className="mt-2 text-sm font-medium text-white/80">
                  {getCompetitorLabel(
                    player.id,
                  )}
                </p>
              </div>
            </div>

            <h1 className="mt-8 max-w-3xl font-serif text-6xl leading-[0.92] sm:text-7xl lg:text-[6.8rem]">
              {player.firstName}
              <br />
              {player.lastName}
            </h1>

            <p className="mt-8 max-w-2xl font-serif text-xl leading-8 text-white/90 sm:text-2xl sm:leading-9">
              {player.bio ??
                `${player.displayName} represents Team ${
                  isNavy
                    ? "Navy"
                    : "Red"
                } in the Cyder Cup.`}
            </p>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
              <span>
                Handicap
                <strong className="ml-2 text-amber-300">
                  {player.handicap}
                </strong>
              </span>

              {player.hometown && (
                <span>
                  {player.hometown}
                </span>
              )}
            </div>
          </div>

          <div className="relative mx-auto h-[480px] w-full max-w-[520px] lg:h-[650px]">
            <div className="absolute inset-x-8 bottom-0 top-16 rounded-t-[48%] border border-white/10 bg-black/10" />

            {player.photoPath ? (
              <img
                src={player.photoPath}
                alt={player.displayName}
                className="relative z-10 h-full w-full object-contain object-bottom drop-shadow-[0_30px_35px_rgba(0,0,0,.38)]"
              />
            ) : (
              <div className="relative z-10 flex h-full items-center justify-center font-serif text-8xl">
                {initials(player)}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#081b2c]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:grid-cols-3 sm:px-8 lg:grid-cols-6 lg:px-10">
          <SignatureMetric
            label="Career rank"
            value={
              ranking
                ? `#${ranking.careerRank}`
                : "—"
            }
          />

          <SignatureMetric
            label="Power rank"
            value={
              ranking
                ? `#${ranking.powerRank}`
                : "—"
            }
          />

          <SignatureMetric
            label="Matches"
            value={stats.played}
          />

          <SignatureMetric
            label="Career points"
            value={formatPoints(
              stats.points,
            )}
          />

          <SignatureMetric
            label="Record"
            value={formatRecord(stats)}
          />

          <SignatureMetric
            label="Win rate"
            value={`${stats.winPercentage}%`}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="grid gap-16 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionLabel>
              Player identity
            </SectionLabel>

            <h2 className="mt-5 max-w-lg font-serif text-5xl leading-[0.98] sm:text-6xl">
              Beyond the scorecard.
            </h2>

            <p className="mt-7 max-w-lg text-base leading-8 text-slate-300">
              A career shaped by format
              strengths, trusted partnerships,
              familiar opponents and the
              performances that defined each
              Cyder Cup appearance.
            </p>

            <div className="mt-10 border-l-2 border-amber-300 pl-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">
                Competitive profile
              </p>

              <p className="mt-3 font-serif text-3xl text-amber-300">
                {playerIdentity}
              </p>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
            <ProfileDetail
              label="Home course"
              value={player.homeCourse}
            />

            <ProfileDetail
              label="Hometown"
              value={player.hometown}
            />

            <ProfileDetail
              label="Favorite drink"
              value={player.favoriteDrink}
            />

            <ProfileDetail
              label="Walkout song"
              value={player.walkoutMusic}
            />

            <ProfileDetail
              label="Cyder Cup appearances"
              value={appearances.toString()}
            />

            <ProfileDetail
              label="Years represented"
              value={
                appearanceYears.length
                  ? appearanceYears.join(" · ")
                  : undefined
              }
            />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#04121f]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-16 xl:grid-cols-[1.12fr_.88fr]">
            <div>
              <SectionLabel>
                Current form
              </SectionLabel>

              <div className="mt-5 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <h2 className="max-w-2xl font-serif text-5xl leading-none sm:text-6xl">
                  The latest five.
                </h2>

                {ranking && (
                  <div className="border-l-2 border-amber-300 pl-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
                      Form rank
                    </p>

                    <p className="mt-1 font-serif text-3xl text-amber-300">
                      #{ranking.formRank}
                    </p>
                  </div>
                )}
              </div>

              {currentForm.formSequence.length >
              0 ? (
                <>
                  <div className="mt-12 flex flex-wrap gap-3 sm:gap-4">
                    {currentForm.formSequence.map(
                      (
                        result,
                        resultIndex,
                      ) => (
                        <div
                          key={`${result}-${resultIndex}`}
                          className={`group flex h-20 w-20 flex-col items-center justify-center border transition hover:-translate-y-1 sm:h-24 sm:w-24 ${getResultClasses(
                            result,
                          )}`}
                        >
                          <span className="font-serif text-4xl">
                            {result}
                          </span>

                          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] opacity-80">
                            {getResultLabel(
                              result,
                            )}
                          </span>
                        </div>
                      ),
                    )}
                  </div>

                  <p className="mt-10 max-w-3xl font-serif text-2xl leading-9 text-white/90 sm:text-3xl sm:leading-10">
                    {getFormNarrative(
                      currentForm,
                    )}
                  </p>
                </>
              ) : (
                <div className="mt-10">
                  <EmptyState>
                    Recent match results are not
                    yet available.
                  </EmptyState>
                </div>
              )}
            </div>

            <article className="border border-white/10 bg-[#071827]">
              <div className="border-b border-white/10 p-7 sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">
                  Recent performance
                </p>

                <p className="mt-4 font-serif text-4xl">
                  Momentum report
                </p>
              </div>

              <div className="grid grid-cols-2 gap-px bg-white/10">
                <CompactMetric
                  label="Record"
                  value={formatRecord(
                    currentForm,
                  )}
                />

                <CompactMetric
                  label="Points"
                  value={formatPoints(
                    currentForm.points,
                  )}
                />

                <CompactMetric
                  label="Win rate"
                  value={`${currentForm.winPercentage}%`}
                />

                <CompactMetric
                  label="Points per match"
                  value={formatPoints(
                    trendAnalytics.currentFormPointsPerMatch,
                  )}
                />
              </div>

              {ranking && (
                <div className="border-t border-white/10 p-7 sm:p-8">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
                        Momentum
                      </p>

                      <p className="mt-2 font-serif text-3xl text-white">
                        {ranking.momentum >= 0
                          ? "+"
                          : ""}
                        {ranking.momentum}%
                      </p>
                    </div>

                    <p className="text-right text-sm leading-6 text-slate-300">
                      Power rank
                      <span className="ml-2 font-serif text-2xl text-amber-300">
                        #{ranking.powerRank}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>
              Format strengths
            </SectionLabel>

            <h2 className="mt-5 font-serif text-5xl leading-none sm:text-6xl">
              How the game travels.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-300">
            Career performance across the four
            competitive formats used throughout the
            Cyder Cup.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {formats.map((format) => {
            const formatStats =
              getFormatStats(
                stats.formats,
                format,
              );

            return (
              <FormatStrengthCard
                key={format}
                label={formatLabel(format)}
                record={
                  formatStats
                    ? formatRecord(formatStats)
                    : "0-0-0"
                }
                points={
                  formatStats?.points ?? 0
                }
                played={
                  formatStats?.played ?? 0
                }
                winPercentage={
                  formatStats?.winPercentage ??
                  0
                }
              />
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#04121f]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-8 lg:grid-cols-2">
            <PartnerChemistry
              player={player}
              bestPartner={bestPartner}
              mostFrequentPartner={
                mostFrequentPartner
              }
            />

            <RivalryBoard
              rivalries={topRivalries}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr]">
          <div>
            <SectionLabel>
              Career timeline
            </SectionLabel>

            <h2 className="mt-5 font-serif text-5xl leading-none sm:text-6xl">
              Season by season.
            </h2>

            <p className="mt-7 max-w-md text-base leading-8 text-slate-300">
              Every completed campaign, from first
              appearance to the player's strongest
              Cyder Cup season.
            </p>

            {bestSeason && (
              <div className="mt-10 border-l-2 border-amber-300 pl-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
                  Career-best season
                </p>

                <p className="mt-2 font-serif text-4xl text-amber-300">
                  {bestSeason.year}
                </p>

                <p className="mt-2 text-sm text-slate-300">
                  {formatRecord(bestSeason)} ·{" "}
                  {formatPoints(
                    bestSeason.points,
                  )}{" "}
                  points
                </p>
              </div>
            )}
          </div>

          {trendAnalytics.seasons.length >
          0 ? (
            <div className="relative">
              <div className="absolute bottom-0 left-[25px] top-0 w-px bg-white/10 sm:left-[33px]" />

              <div className="space-y-5">
                {trendAnalytics.seasons
                  .slice()
                  .sort(
                    (a, b) =>
                      b.year - a.year,
                  )
                  .map((season) => {
                    const isBestSeason =
                      bestSeason?.year ===
                      season.year;

                    return (
                      <article
                        key={season.year}
                        className={`relative ml-14 border p-6 transition hover:-translate-y-0.5 sm:ml-20 sm:p-7 ${
                          isBestSeason
                            ? "border-amber-300/35 bg-amber-300/[0.06]"
                            : "border-white/10 bg-[#071827]"
                        }`}
                      >
                        <div
                          className={`absolute -left-[45px] top-8 h-4 w-4 rounded-full border-4 border-[#061626] sm:-left-[55px] ${
                            isBestSeason
                              ? "bg-amber-300"
                              : "bg-slate-500"
                          }`}
                        />

                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                          <div>
                            <div className="flex items-center gap-4">
                              <p className="font-serif text-4xl">
                                {season.year}
                              </p>

                              {isBestSeason && (
                                <span className="border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-amber-200">
                                  Best season
                                </span>
                              )}
                            </div>

                            <p className="mt-3 text-sm text-slate-300">
                              {season.played} matches
                              played
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-7 sm:text-right">
                            <TimelineMetric
                              label="Record"
                              value={formatRecord(
                                season,
                              )}
                            />

                            <TimelineMetric
                              label="Points"
                              value={formatPoints(
                                season.points,
                              )}
                            />

                            <TimelineMetric
                              label="Win rate"
                              value={`${season.winPercentage}%`}
                            />
                          </div>
                        </div>
                      </article>
                    );
                  })}
              </div>
            </div>
          ) : (
            <EmptyState>
              Tournament results are not yet
              available for this player.
            </EmptyState>
          )}
        </div>
      </section>

      {playerRecords.length > 0 && (
        <section className="border-y border-white/10 bg-[#04121f]">
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-28">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>
                  Record book
                </SectionLabel>

                <h2 className="mt-5 font-serif text-5xl leading-none sm:text-6xl">
                  Marks that stand.
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-7 text-slate-300">
                Official Cyder Cup records currently
                held by {player.displayName}.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {playerRecords.map(
                (record) => (
                  <article
                    key={record.id}
                    className="group min-h-72 border border-white/10 bg-[#071827] p-8 transition hover:-translate-y-1 hover:border-amber-300/30"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">
                      {record.category}
                    </p>

                    <p className="mt-8 font-serif text-5xl text-amber-300">
                      {record.displayValue}
                    </p>

                    <h3 className="mt-5 font-serif text-2xl text-white">
                      {record.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      {record.description}
                    </p>
                  </article>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>
              Tournament photography
            </SectionLabel>

            <h2 className="mt-5 font-serif text-5xl leading-none sm:text-6xl">
              Across the years.
            </h2>
          </div>

          {appearanceYears.length > 0 && (
            <p className="text-sm text-slate-300">
              {appearanceYears.join(" · ")}
            </p>
          )}
        </div>

        {galleryItems ? (
          <WorkbookGallery
            items={galleryItems}
            player={player}
          />
        ) : fallbackGallery.length ? (
          <FallbackGallery
            items={fallbackGallery}
            player={player}
          />
        ) : (
          <p className="mt-10 border border-white/10 p-8 text-slate-300">
            Supplemental tournament photography will
            appear here as it becomes available.
          </p>
        )}
      </section>

      <nav className="grid border-t border-white/10 md:grid-cols-2">
        <PlayerNav
          player={previous}
          label="Previous player"
          align="left"
        />

        <PlayerNav
          player={next}
          label="Next player"
          align="right"
        />
      </nav>
    </main>
  );
}

function PartnerChemistry({
  player,
  bestPartner,
  mostFrequentPartner,
}: {
  player: Player;
  bestPartner:
    | {
        partnerId: string;
        partnerName?: string;
        wins: number;
        losses: number;
        ties: number;
        points: number;
        winPercentage: number;
        played: number;
      }
    | undefined;
  mostFrequentPartner:
    | {
        partnerId: string;
        partnerName?: string;
        played: number;
      }
    | undefined;
}) {
  return (
    <article className="overflow-hidden border border-white/10 bg-[#071827]">
      <div className="border-b border-white/10 px-7 py-7 sm:px-9">
        <SectionLabel>
          Partner chemistry
        </SectionLabel>

        <h2 className="mt-5 font-serif text-5xl leading-none">
          Best partnership.
        </h2>
      </div>

      {bestPartner ? (
        <>
          <div className="p-7 sm:p-9">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">
              Most successful pairing
            </p>

            <div className="mt-7 flex items-center gap-5">
              <PlayerPortrait
                player={player}
                size="large"
              />

              <div className="h-px w-10 bg-amber-300/70" />

              <PlayerPortrait
                player={findPlayer(
                  bestPartner.partnerId,
                )}
                fallbackName={
                  bestPartner.partnerName ??
                  bestPartner.partnerId
                }
                size="large"
              />
            </div>

<p className="mt-8 font-serif text-4xl leading-tight">
  {player.displayName}
  <span className="mx-3 text-amber-300">
    &
  </span>
  {findPlayer(bestPartner.partnerId)?.displayName ??
    bestPartner.partnerName ??
    bestPartner.partnerId}
</p>

<p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
  The strongest recorded partnership in{" "}
  {player.displayName}'s Cyder Cup career.
</p>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden bg-white/10 sm:grid-cols-4">
              <CompactMetric
                label="Record"
                value={formatRecord(
                  bestPartner,
                )}
              />

              <CompactMetric
                label="Points"
                value={formatPoints(
                  bestPartner.points,
                )}
              />

              <CompactMetric
                label="Win rate"
                value={`${bestPartner.winPercentage}%`}
              />

              <CompactMetric
                label="Matches"
                value={bestPartner.played}
              />
            </div>
          </div>

          {mostFrequentPartner && (
            <div className="border-t border-white/10 bg-[#081b2c] px-7 py-6 sm:px-9">
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <PlayerPortrait
                    player={findPlayer(
                      mostFrequentPartner.partnerId,
                    )}
                    fallbackName={
                      mostFrequentPartner.partnerName ??
                      mostFrequentPartner.partnerId
                    }
                    size="small"
                  />

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
                      Most frequent partner
                    </p>

<p className="mt-2 font-serif text-2xl">
  {findPlayer(mostFrequentPartner.partnerId)?.displayName ??
    mostFrequentPartner.partnerName ??
    mostFrequentPartner.partnerId}
</p>
                  </div>
                </div>

                <p className="text-right text-sm text-amber-300">
                  {mostFrequentPartner.played}
                  <br />
                  matches together
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-8">
          <EmptyState>
            Partner results are not yet
            available.
          </EmptyState>
        </div>
      )}
    </article>
  );
}

function RivalryBoard({
  rivalries,
}: {
  rivalries: Array<{
    opponentId: string;
    opponentName?: string;
    wins: number;
    losses: number;
    ties: number;
    played: number;
    singles: {
      wins: number;
      losses: number;
      ties: number;
    };
    lastMatch?: {
      year: number;
    };
    currentStreak?: {
      result: MatchResult;
      length: number;
    };
  }>;
}) {
  return (
    <article className="overflow-hidden border border-white/10 bg-[#071827]">
      <div className="border-b border-white/10 px-7 py-7 sm:px-9">
        <SectionLabel>
          Familiar opponents
        </SectionLabel>

        <h2 className="mt-5 font-serif text-5xl leading-none">
          Rivalry board.
        </h2>
      </div>

      {rivalries.length > 0 ? (
        <div>
          {rivalries.map(
            (
              rivalry,
              rivalryIndex,
            ) => (
              <div
                key={rivalry.opponentId}
                className={`group px-7 py-7 transition hover:bg-white/[0.025] sm:px-9 ${
                  rivalryIndex <
                  rivalries.length - 1
                    ? "border-b border-white/10"
                    : ""
                }`}
              >
                <div className="flex items-start gap-5">
                  <PlayerPortrait
                    player={findPlayer(
                      rivalry.opponentId,
                    )}
                    fallbackName={
                      rivalry.opponentName ??
                      rivalry.opponentId
                    }
                    size="medium"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
                          Opponent{" "}
                          {String(
                            rivalryIndex + 1,
                          ).padStart(2, "0")}
                        </p>

                        <p className="mt-2 font-serif text-3xl">
                          {rivalry.opponentName ??
                            rivalry.opponentId}
                        </p>
                      </div>

                      <p className="font-serif text-3xl text-amber-300">
                        {formatRecord(
                          rivalry,
                        )}
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
                      <RivalryDetail
                        label="Matches"
                        value={rivalry.played}
                      />

                      <RivalryDetail
                        label="Singles"
                        value={formatRecord(
                          rivalry.singles,
                        )}
                      />

                      <RivalryDetail
                        label="Last met"
                        value={
                          rivalry.lastMatch
                            ?.year ?? "—"
                        }
                      />

                      <RivalryDetail
                        label="Streak"
                        value={formatStreak(
                          rivalry.currentStreak,
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      ) : (
        <div className="p-8">
          <EmptyState>
            Head-to-head results are not yet
            available.
          </EmptyState>
        </div>
      )}
    </article>
  );
}

function PlayerPortrait({
  player,
  fallbackName,
  size,
}: {
  player?: Player;
  fallbackName?: string;
  size:
    | "small"
    | "medium"
    | "large";
}) {
  const classes = {
    small: "h-12 w-12 text-sm",
    medium: "h-16 w-16 text-lg",
    large: "h-20 w-20 text-2xl",
  }[size];

  const fallbackInitials = (
    fallbackName ??
    player?.displayName ??
    "CC"
  )
    .split(" ")
    .map((part) =>
      part.charAt(0),
    )
    .slice(0, 2)
    .join("");

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.05] font-serif text-white ${classes}`}
    >
      {player?.photoPath ? (
        <img
          src={player.photoPath}
          alt={player.displayName}
          className="h-full w-full object-cover"
        />
      ) : (
        fallbackInitials
      )}
    </div>
  );
}

function WorkbookGallery({
  items,
  player,
}: {
  items: PageMediaItem[];
  player: Player;
}) {
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items
        .slice(0, 12)
        .map((item, index) => (
          <figure
            key={`${item.media_id}-${item.file_path}-${index}`}
            className="group relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#081b2c]"
          >
            <img
              src={item.file_path}
              alt={getMediaAltText(
                item,
                `${player.displayName} at the Cyder Cup`,
              )}
              style={{
                objectPosition:
                  getMediaObjectPosition(
                    item,
                  ),
              }}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />

            <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />
          </figure>
        ))}
    </div>
  );
}

function FallbackGallery({
  items,
  player,
}: {
  items: Array<{
    path: string;
    year: number;
  }>;
  player: Player;
}) {
  return (
    <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items
        .slice(0, 12)
        .map((image) => (
          <figure
            key={image.path}
            className="group relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#081b2c]"
          >
            <img
              src={image.path}
              alt={`${player.displayName} at the ${image.year} Cyder Cup`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />

            <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />
          </figure>
        ))}
    </div>
  );
}

function SignatureMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-h-32 border-b border-r border-white/10 px-6 py-7 text-center sm:min-h-36 sm:px-7 sm:py-8">
      <p className="font-serif text-4xl text-white sm:text-5xl">
        {value}
      </p>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-300">
        {label}
      </p>
    </div>
  );
}

function ProfileDetail({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="min-h-40 bg-[#071827] p-7 sm:p-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300/90">
        {label}
      </p>

      <p className="mt-5 font-serif text-2xl leading-8 text-white">
        {value ?? "Not yet provided"}
      </p>
    </div>
  );
}

function CompactMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-h-28 bg-[#071827] p-5">
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">
        {label}
      </p>

      <p className="mt-3 font-serif text-2xl text-white">
        {value}
      </p>
    </div>
  );
}

function RivalryDetail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-slate-100">
        {value}
      </p>
    </div>
  );
}

function TimelineMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-300">
        {label}
      </p>

      <p className="mt-2 font-serif text-xl text-white">
        {value}
      </p>
    </div>
  );
}

function FormatStrengthCard({
  label,
  record,
  points,
  played,
  winPercentage,
}: {
  label: string;
  record: string;
  points: number;
  played: number;
  winPercentage: number;
}) {
  const tier =
    getFormatTier(winPercentage);

  return (
    <article className="group border border-white/10 bg-[#071827] p-7 transition hover:-translate-y-1 hover:border-white/20 sm:p-8">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">
            Competitive format
          </p>

          <h3 className="mt-3 font-serif text-3xl text-white">
            {label}
          </h3>
        </div>

        <p className="font-serif text-4xl text-amber-300">
          {formatPoints(points)}
        </p>
      </div>

      <div className="mt-8 flex gap-2">
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <span
            key={index}
            className={`h-1.5 flex-1 ${
              index < tier.bars
                ? "bg-amber-300"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
          {tier.label}
        </p>

        <p className="text-sm text-slate-300">
          {winPercentage}% win rate
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-px bg-white/10">
        <CompactMetric
          label="Record"
          value={record}
        />

        <CompactMetric
          label="Matches"
          value={played}
        />

        <CompactMetric
          label="Points"
          value={formatPoints(points)}
        />
      </div>
    </article>
  );
}

function SectionLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-300">
      {children}
    </p>
  );
}

function EmptyState({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="border border-white/10 bg-[#071827] p-7 text-sm leading-7 text-slate-300">
      {children}
    </p>
  );
}

function PlayerNav({
  player,
  label,
  align,
}: {
  player: Player;
  label: string;
  align: "left" | "right";
}) {
  return (
    <Link
      to={`/players/${player.id}`}
      className={`group relative overflow-hidden bg-[#071827] px-8 py-14 transition hover:bg-[#0a2034] ${
        align === "right"
          ? "text-right md:border-l md:border-white/10"
          : ""
      }`}
    >
      <div
        className={`absolute inset-y-0 w-1 bg-amber-300 transition-all duration-300 ${
          align === "right"
            ? "right-0 translate-x-full group-hover:translate-x-0"
            : "left-0 -translate-x-full group-hover:translate-x-0"
        }`}
      />

      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">
        {align === "left" ? "← " : ""}
        {label}
        {align === "right" ? " →" : ""}
      </p>

      <p className="mt-4 font-serif text-3xl transition group-hover:text-amber-300 sm:text-4xl">
        {player.displayName}
      </p>

      <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/55">
        Team{" "}
        {player.teamId === "navy"
          ? "Navy"
          : "Red"}
      </p>
    </Link>
  );
}