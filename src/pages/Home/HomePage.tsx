import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import TeamCrest from "../../components/common/TeamCrest";
import HeroSection from "../../components/home/HeroSection";
import TournamentCountdown from "../../components/home/TournamentCountdown";

import {
  getPlayerRankings,
  getSiteRecordBook,
  getTeamComparison,
  type PlayerRankingEntry,
  type RecordCategory,
} from "../../analytics";

import generatedPlayers from "../../data/generated/players.json";
import generatedTournaments from "../../data/generated/tournaments.json";

import { formatTournamentDates } from "../../data/history";

import {
  getHomeFeaturedStory,
  getHomeGalleryPreview,
  getMediaAltText,
  getMediaObjectPosition,
  type PageMediaItem,
} from "../../data/pageMedia";

interface PlayerFeedRow {
  player_id: string;
  display_name: string;
  team_id: "navy" | "red";
  active: boolean;
  photo_key: string;
}

interface TournamentFeedRow {
  tournament_id: string;
  year: number;
  venue: string;
  city: string;
  region: string;
  start_date: number | string;
  end_date: number | string;
  status: string;
  winning_team: "navy" | "red" | null;
  navy_points: number;
  red_points: number;
}

const players =
  generatedPlayers as PlayerFeedRow[];

const tournaments =
  generatedTournaments as TournamentFeedRow[];

const currentTournament =
  tournaments.find(
    (item) => item.year === 2026,
  ) ??
  tournaments[tournaments.length - 1];

const completedTournaments =
  tournaments.filter(
    (item) => item.status === "complete",
  );

const latestCompleted = [
  ...completedTournaments,
].sort(
  (a, b) => b.year - a.year,
)[0];

const activePlayers =
  players.filter(
    (player) => player.active,
  );

const navyPlayers =
  activePlayers.filter(
    (player) =>
      player.team_id === "navy",
  );

const redPlayers =
  activePlayers.filter(
    (player) =>
      player.team_id === "red",
  );

const activePlayerIds =
  activePlayers.map(
    (player) => player.player_id,
  );

const rankings =
  getPlayerRankings(activePlayerIds);

const recordBook =
  getSiteRecordBook(activePlayerIds);

const teamComparison =
  getTeamComparison();

const navyCupWins =
  completedTournaments.filter(
    (item) =>
      item.winning_team === "navy",
  ).length;

const redCupWins =
  completedTournaments.filter(
    (item) =>
      item.winning_team === "red",
  ).length;

const fallbackFeaturedStory: PageMediaItem = {
  media_id: "fallback-home-feature",
  year: 2025,
  file_name: "2025-1.webp",
  file_path:
    "/history/2025/2025-1.webp",
  alt_text: "2025 Cyder Cup",
  object_position: "center",
};

const fallbackGallery: PageMediaItem[] = [
  {
    media_id: "fallback-gallery-1",
    year: 2025,
    file_name: "2025-2.webp",
    file_path:
      "/history/2025/2025-2.webp",
    alt_text:
      "Cyder Cup tournament photograph",
    object_position: "center",
  },
  {
    media_id: "fallback-gallery-2",
    year: 2022,
    file_name: "2022-2.webp",
    file_path:
      "/history/2022/2022-2.webp",
    alt_text:
      "Cyder Cup tournament photograph",
    object_position: "center",
  },
  {
    media_id: "fallback-gallery-3",
    year: 2021,
    file_name: "2021-3.webp",
    file_path:
      "/history/2021/2021-3.webp",
    alt_text:
      "Cyder Cup tournament photograph",
    object_position: "center",
  },
  {
    media_id: "fallback-gallery-4",
    year: 2025,
    file_name: "2025-4.webp",
    file_path:
      "/history/2025/2025-4.webp",
    alt_text:
      "Cyder Cup tournament photograph",
    object_position: "center",
  },
];

function SectionLabel({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-[#ad842f]">
      <span className="h-px w-9 bg-[#c59e49]/75" />
      {children}
    </div>
  );
}

function PlayerStrip({
  team,
}: {
  team: "navy" | "red";
}) {
  const teamPlayers =
    team === "navy"
      ? navyPlayers
      : redPlayers;

  return (
    <div className="mt-10 flex flex-wrap items-center gap-4 sm:flex-nowrap sm:gap-0 sm:-space-x-4">
      {teamPlayers.map(
        (player) => (
          <Link
            key={player.player_id}
            to={`/players/${player.player_id}`}
            aria-label={`View ${player.display_name}`}
            className="group relative block shrink-0"
          >
            <div className="h-24 w-24 overflow-hidden rounded-full border-[3px] border-[#071827] bg-[#071827] shadow-[0_16px_35px_rgba(0,0,0,0.34)] transition duration-300 group-hover:z-10 group-hover:-translate-y-1 group-hover:border-[#d7b15c] sm:h-28 sm:w-28 lg:h-[7.5rem] lg:w-[7.5rem]">
              <img
                src={`/player-profiles/${player.photo_key}.webp`}
                alt={player.display_name}
                title={player.display_name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
              />
            </div>
          </Link>
        ),
      )}
    </div>
  );
}

function getPlayer(
  playerId: string,
): PlayerFeedRow | undefined {
  return players.find(
    (player) =>
      player.player_id === playerId,
  );
}

function getPlayerName(
  playerId: string,
): string {
  return (
    getPlayer(playerId)
      ?.display_name ?? playerId
  );
}

function formatPoints(
  value: number,
): string {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(1);
}

function formatRecord(stats: {
  wins: number;
  losses: number;
  ties: number;
}): string {
  return `${stats.wins}-${stats.losses}-${stats.ties}`;
}

function teamLabel(
  team:
    | "navy"
    | "red"
    | undefined,
): string {
  if (team === "navy") {
    return "Team Navy";
  }

  if (team === "red") {
    return "Team Red";
  }

  return "Level";
}

export default function HomePage() {
  const tournamentDates =
    formatTournamentDates(
      currentTournament.start_date,
      currentTournament.end_date,
    );

  const featuredStory =
    getHomeFeaturedStory() ??
    fallbackFeaturedStory;

  const configuredGallery =
    getHomeGalleryPreview();

  const galleryItems =
    configuredGallery.length >= 4
      ? configuredGallery.slice(0, 4)
      : fallbackGallery;

  return (
    <div className="overflow-hidden bg-[#f2efe8] text-[#071827]">
      <HeroSection />

      <section className="relative z-10 -mt-px bg-[#f2efe8] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>
                Tournament at a glance
              </SectionLabel>

              <h2 className="mt-4 font-serif text-3xl tracking-tight text-[#071827] sm:text-4xl">
                Predator Ridge awaits.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-[#59666d]">
              Four days of golf,
              questionable decisions and
              the latest chapter of the
              Cyder Cup.
            </p>
          </div>

          <div className="mt-9 grid overflow-hidden border border-[#071827]/15 bg-[#f7f4ed] shadow-[0_18px_55px_rgba(7,24,39,0.07)] sm:grid-cols-2 lg:grid-cols-4">
            <AtGlanceCard
              label="Dates"
              value={tournamentDates}
              icon={<CalendarIcon />}
            />

            <AtGlanceCard
              label="Venue"
              value="Predator Ridge Resort"
              icon={<FlagIcon />}
            />

            <AtGlanceCard
              label="Host City"
              value="Vernon, B.C."
              icon={<LocationIcon />}
            />

            <AtGlanceCard
              label="Defending Champions"
              value={
                latestCompleted
                  ?.winning_team
                  ? teamLabel(
                      latestCompleted.winning_team,
                    )
                  : "To be confirmed"
              }
              icon={
                latestCompleted
                  ?.winning_team ? (
                  <TeamCrest
                    team={
                      latestCompleted.winning_team
                    }
                    className="h-14 w-14"
                    imageClassName="h-full w-full object-contain"
                  />
                ) : (
                  <TrophyIcon />
                )
              }
            />
          </div>
        </div>
      </section>

      <TournamentCountdown
        targetDate={
          currentTournament.start_date
        }
        tournamentYear={
          currentTournament.year
        }
        venue="Predator Ridge Resort in Vernon, B.C."
      />

      <section className="bg-[#071827] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>
                2026 scoreboard
              </SectionLabel>

              <h2 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl">
                The race to 15½.
              </h2>
            </div>

            <Link
              to="/live"
              className="home-text-link text-white"
            >
              Open live centre{" "}
              <span>→</span>
            </Link>
          </div>

          <div className="mt-10 overflow-hidden border border-white/15 bg-[#0b2034] shadow-[0_28px_80px_rgba(0,0,0,.3)]">
            <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#efd38d]">
                Predator Ridge Resort in
                Vernon, B.C. ·{" "}
                {currentTournament.year}
              </p>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                {currentTournament.status ===
                "upcoming"
                  ? "Tournament not started"
                  : currentTournament.status}
              </p>
            </div>

            <div className="grid items-stretch md:grid-cols-[1fr_auto_1fr]">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#0c2948] px-6 py-9 md:border-b-0 md:px-10 md:py-12">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-slate-300">
                    Team Navy
                  </p>

                  <p className="mt-2 font-serif text-3xl">
                    Navy
                  </p>
                </div>

                <TeamCrest
                  team="navy"
                  className="h-24 w-24"
                  imageClassName="h-full w-full object-contain"
                />
              </div>

              <div className="flex min-w-[280px] items-center justify-center gap-7 border-b border-white/10 px-8 py-9 md:border-x md:border-b-0 md:border-white/10">
                <span className="font-serif text-7xl text-white">
                  {
                    currentTournament.navy_points
                  }
                </span>

                <div className="text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#efd38d]">
                    Points
                  </p>

                  <div className="my-3 h-px w-12 bg-white/25" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
                    To win 15½
                  </p>
                </div>

                <span className="font-serif text-7xl text-white">
                  {
                    currentTournament.red_points
                  }
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 bg-[#3b1018] px-6 py-9 md:flex-row-reverse md:px-10 md:py-12">
                <div className="md:text-right">
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-slate-300">
                    Team Red
                  </p>

                  <p className="mt-2 font-serif text-3xl">
                    Red
                  </p>
                </div>

                <TeamCrest
                  team="red"
                  className="h-24 w-24"
                  imageClassName="h-full w-full object-contain"
                />
              </div>
            </div>

            <div className="grid divide-y divide-white/10 border-t border-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                "Scramble · 3 pts",
                "Fourball · 6 pts",
                "Singles · 16 pts",
              ].map((item) => (
                <p
                  key={item}
                  className="px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-300"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e7dfd1] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>
                The rivalry
              </SectionLabel>

              <h2 className="mt-5 max-w-4xl font-serif text-4xl tracking-tight sm:text-5xl">
                Two teams. One Cup.
                Years of unfinished business.
              </h2>
            </div>

            <Link
              to="/records"
              className="home-text-link"
            >
              Explore the record book{" "}
              <span>→</span>
            </Link>
          </div>

          <RivalryPanel />
        </div>
      </section>

      <section className="grid min-h-[680px] lg:grid-cols-[1.15fr_.85fr]">
        <div className="relative min-h-[480px] overflow-hidden">
          <img
            src={featuredStory.file_path}
            alt={getMediaAltText(
              featuredStory,
              "Cyder Cup featured story",
            )}
            style={{
              objectPosition:
                getMediaObjectPosition(
                  featuredStory,
                ),
            }}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

          <p className="absolute bottom-7 left-7 text-xs font-bold uppercase tracking-[0.24em] text-white/85">
            From the archives ·{" "}
            {featuredStory.year ?? 2025}
          </p>
        </div>

        <div className="flex items-center bg-[#e7dfd1] px-7 py-14 sm:px-12 lg:px-16">
          <div className="max-w-xl">
            <SectionLabel>
              Featured story
            </SectionLabel>

            <p className="mt-8 font-serif text-7xl leading-none text-[#a77f2d]/75">
              2025
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
              Team Navy reclaimed
              the Cup in Whistler.
            </h2>

            <p className="mt-6 text-base leading-7 text-[#3e4b54]">
              A commanding 9½–5½
              victory gave Team Navy
              its third championship
              and set the stage for the
              2026 defence at Predator
              Ridge.
            </p>

            <Link
              to="/history"
              className="home-text-link mt-8"
            >
              Read the full story{" "}
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#071827] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionLabel>
            The 2026 teams
          </SectionLabel>

          <div className="mt-10 grid overflow-hidden border border-white/10 lg:grid-cols-2">
            <article className="relative min-h-[560px] overflow-hidden bg-[#0b2948] p-8 sm:p-12">
              <div className="absolute -right-12 -top-10 h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-slate-300">
                      Four competitors
                    </p>

                    <h2 className="mt-3 font-serif text-5xl">
                      Team Navy
                    </h2>
                  </div>

                  <TeamCrest
                    team="navy"
                    className="h-32 w-32"
                    imageClassName="h-full w-full object-contain"
                  />
                </div>

                <PlayerStrip team="navy" />

                <p className="mt-auto max-w-md pt-10 text-base leading-7 text-slate-300">
                  The defending champions
                  return with three titles,
                  plenty of confidence and
                  no intention of giving the
                  Cup back.
                </p>

                <Link
                  to="/players"
                  className="home-text-link mt-6 text-white"
                >
                  Meet Team Navy{" "}
                  <span>→</span>
                </Link>
              </div>
            </article>

            <article className="relative min-h-[560px] overflow-hidden border-t border-white/10 bg-[#48131d] p-8 sm:p-12 lg:border-l lg:border-t-0">
              <div className="absolute -left-12 -top-10 h-72 w-72 rounded-full bg-red-300/10 blur-3xl" />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-slate-300">
                      Four competitors
                    </p>

                    <h2 className="mt-3 font-serif text-5xl">
                      Team Red
                    </h2>
                  </div>

                  <TeamCrest
                    team="red"
                    className="h-32 w-32"
                    imageClassName="h-full w-full object-contain"
                  />
                </div>

                <PlayerStrip team="red" />

                <p className="mt-auto max-w-md pt-10 text-base leading-7 text-slate-300">
                  Two-time champions
                  look to reclaim the
                  Cup in 2026.
                </p>

                <Link
                  to="/players"
                  className="home-text-link mt-6 text-white"
                >
                  Meet Team Red{" "}
                  <span>→</span>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#f2efe8] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>
                Six editions. One rivalry.
              </SectionLabel>

              <h2 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl">
                The Cyder Cup Story.
              </h2>
            </div>

            <Link
              to="/history"
              className="home-text-link"
            >
              Explore every tournament{" "}
              <span>→</span>
            </Link>
          </div>

          <div className="mt-12 overflow-x-auto pb-3">
            <div className="grid min-w-[880px] grid-cols-6 border-t border-[#071827]/20">
              {tournaments.map(
                (tournament) => (
                  <div
                    key={tournament.year}
                    className={`relative px-4 pt-8 first:pl-0 ${
                      tournament.status ===
                      "upcoming"
                        ? "bg-[#c59e49]/[0.07]"
                        : ""
                    }`}
                  >
                    <span
                      className={`absolute -top-[6px] left-4 h-3 w-3 rounded-full ${
                        tournament.winning_team ===
                        "red"
                          ? "bg-[#9f2d38]"
                          : tournament.winning_team ===
                              "navy"
                            ? "bg-[#123d65]"
                            : "bg-[#c59e49] shadow-[0_0_18px_rgba(197,158,73,.75)]"
                      }`}
                    />

                    <p className="font-serif text-3xl">
                      {tournament.year}
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      {tournament.winning_team ? (
                        <TeamCrest
                          team={
                            tournament.winning_team
                          }
                          className="h-9 w-9"
                          imageClassName="h-full w-full object-contain"
                        />
                      ) : (
                        <TrophyIcon />
                      )}

                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#806b43]">
                        {tournament.status ===
                        "upcoming"
                          ? "Pending results"
                          : teamLabel(
                              tournament.winning_team ??
                                undefined,
                            )}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e7dfd1] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>
                Career leaders
              </SectionLabel>

              <h2 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl">
                The standard everyone
                else is chasing.
              </h2>
            </div>

            <Link
              to="/records"
              className="home-text-link"
            >
              View the record book{" "}
              <span>→</span>
            </Link>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden bg-[#071827]/15 lg:grid-cols-3">
            <LeaderPanel
              eyebrow="Career points"
              category={
                recordBook.careerPoints
              }
            />

            <RankingPanel
              eyebrow="Power ranking"
              rankings={rankings.power}
              valueLabel="Power score"
              getValue={(entry) =>
                entry.powerScore
              }
            />

            <RankingPanel
              eyebrow="Current form"
              rankings={
                rankings.currentForm
              }
              valueLabel="Recent points"
              getValue={(entry) =>
                entry.currentFormPoints
              }
            />
          </div>
        </div>
      </section>

      <section className="bg-[#071827] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionLabel>
                The Cyder Cup Experience
              </SectionLabel>

              <h2 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl">
                The moments between
                the matches.
              </h2>
            </div>

            <Link
              to="/gallery"
              className="home-text-link text-white"
            >
              View the gallery{" "}
              <span>→</span>
            </Link>
          </div>

          <div className="mt-10 grid h-[760px] gap-3 sm:grid-cols-2 lg:h-[620px] lg:grid-cols-4 lg:grid-rows-2">
            {galleryItems.map(
              (item, index) => (
                <img
                  key={`${item.media_id}-${index}`}
                  src={item.file_path}
                  alt={getMediaAltText(item)}
                  style={{
                    objectPosition:
                      getMediaObjectPosition(
                        item,
                      ),
                  }}
                  className={`h-full w-full object-cover transition duration-700 hover:scale-[1.015] ${
                    index === 0
                      ? "lg:col-span-2 lg:row-span-2"
                      : index === 3
                        ? "sm:col-span-2 lg:col-span-2"
                        : ""
                  }`}
                />
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function RivalryPanel() {
  return (
    <div className="relative mt-10 overflow-hidden border border-[#071827]/15 bg-[#061626] text-white shadow-[0_28px_75px_rgba(7,24,39,0.2)]">
      <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_left_top,rgba(122,31,43,0.34),transparent_62%)]" />

      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_right_top,rgba(24,75,116,0.38),transparent_62%)]" />

      <div className="relative grid lg:grid-cols-[1fr_0.82fr_1fr]">
        <RivalryTeam
          team="red"
          cupWins={redCupWins}
          record={formatRecord(
            teamComparison.red,
          )}
          wins={
            teamComparison.red.wins
          }
          points={
            teamComparison.red.points
          }
          streak={
            teamComparison.red
              .longestUnbeatenStreak
          }
        />

        <div className="flex flex-col items-center justify-center border-y border-white/10 bg-black/10 px-7 py-12 text-center lg:border-x lg:border-y-0">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#e1bd6b]">
            Career points
          </p>

          <div className="mt-7 flex items-center gap-5">
            <span className="font-serif text-5xl text-red-200">
              {formatPoints(
                teamComparison.red.points,
              )}
            </span>

            <span className="text-2xl text-white/30">
              —
            </span>

            <span className="font-serif text-5xl text-blue-200">
              {formatPoints(
                teamComparison.navy.points,
              )}
            </span>
          </div>

          <p className="mt-6 max-w-[240px] text-sm leading-6 text-slate-300">
            {teamComparison.pointsLeader
              ? `${teamLabel(
                  teamComparison.pointsLeader,
                )} leads the all-time points race by ${formatPoints(
                  teamComparison.pointsDifference,
                )}.`
              : "The all-time points race is level."}
          </p>

          <div className="mt-8 h-px w-20 bg-[#d7b15c]/50" />

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-white/55">
            Established 2019
          </p>
        </div>

        <RivalryTeam
          team="navy"
          cupWins={navyCupWins}
          record={formatRecord(
            teamComparison.navy,
          )}
          wins={
            teamComparison.navy.wins
          }
          points={
            teamComparison.navy.points
          }
          streak={
            teamComparison.navy
              .longestUnbeatenStreak
          }
        />
      </div>
    </div>
  );
}

function RivalryTeam({
  team,
  cupWins,
  record,
  wins,
  points,
  streak,
}: {
  team: "navy" | "red";
  cupWins: number;
  record: string;
  wins: number;
  points: number;
  streak: number;
}) {
  const isNavy =
    team === "navy";

  return (
    <article className="relative px-7 py-10 sm:px-10 sm:py-12">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p
            className={`text-xs font-bold uppercase tracking-[0.28em] ${
              isNavy
                ? "text-blue-200"
                : "text-red-200"
            }`}
          >
            {teamLabel(team)}
          </p>

          <p className="mt-5 font-serif text-7xl leading-none">
            {cupWins}
          </p>

          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-white/55">
            Cup victories
          </p>
        </div>

        <TeamCrest
          team={team}
          className="h-24 w-24 sm:h-28 sm:w-28"
          imageClassName="h-full w-full object-contain"
        />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7 border-t border-white/10 pt-8">
        <DarkMetric
          label="Career record"
          value={record}
        />

        <DarkMetric
          label="Match wins"
          value={wins}
        />

        <DarkMetric
          label="Career points"
          value={formatPoints(points)}
        />

        <DarkMetric
          label="Best unbeaten run"
          value={streak}
        />
      </div>
    </article>
  );
}

function DarkMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4b466]">
        {label}
      </p>

      <p className="mt-2 font-serif text-2xl text-white">
        {value}
      </p>
    </div>
  );
}

function AtGlanceCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <article className="group relative min-h-44 border-b border-[#071827]/15 p-6 transition hover:bg-white/55 sm:border-r lg:border-b-0 lg:p-7">
      <div className="flex items-start justify-between gap-5">
        <div className="flex h-14 w-14 items-center justify-center text-[#a27d2e]">
          {icon}
        </div>

        <span className="h-px w-10 bg-[#c59e49]/45 transition-all duration-300 group-hover:w-14 group-hover:bg-[#c59e49]" />
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-[#806b43]">
        {label}
      </p>

      <p className="mt-3 font-serif text-2xl leading-tight text-[#071827]">
        {value}
      </p>
    </article>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path
        d="M6 3v3M18 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path
        d="M6 21V3m0 1h10l-2.2 3L16 10H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8"
      aria-hidden="true"
    >
      <path
        d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle
        cx="12"
        cy="10"
        r="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-8 w-8 text-[#a27d2e]"
      aria-hidden="true"
    >
      <path
        d="M8 4h8v3.5c0 3.2-1.8 5.5-4 5.5s-4-2.3-4-5.5V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M8 6H5.5v1.2c0 2.1 1.3 3.8 3.3 4.3M16 6h2.5v1.2c0 2.1-1.3 3.8-3.3 4.3M12 13v4M9 20h6M10 17h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LeaderPanel({
  eyebrow,
  category,
}: {
  eyebrow: string;
  category: RecordCategory;
}) {
  return (
    <article className="bg-[#f2efe8] p-8 sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#806b43]">
        {eyebrow}
      </p>

      <div className="mt-8 space-y-6">
        {category.entries
          .slice(0, 3)
          .map((entry) => (
            <LeaderRow
              key={entry.playerId}
              rank={entry.rank}
              playerId={
                entry.playerId
              }
              value={
                entry.displayValue
              }
            />
          ))}
      </div>
    </article>
  );
}

function RankingPanel({
  eyebrow,
  rankings: rankingEntries,
  valueLabel,
  getValue,
}: {
  eyebrow: string;
  rankings: PlayerRankingEntry[];
  valueLabel: string;
  getValue: (
    entry: PlayerRankingEntry,
  ) => number;
}) {
  return (
    <article className="bg-[#f2efe8] p-8 sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#806b43]">
        {eyebrow}
      </p>

      <div className="mt-8 space-y-6">
        {rankingEntries
          .slice(0, 3)
          .map(
            (
              entry,
              index,
            ) => (
              <LeaderRow
                key={entry.playerId}
                rank={index + 1}
                playerId={
                  entry.playerId
                }
                value={`${formatPoints(
                  getValue(entry),
                )} ${valueLabel}`}
              />
            ),
          )}
      </div>
    </article>
  );
}

function LeaderRow({
  rank,
  playerId,
  value,
}: {
  rank: number;
  playerId: string;
  value: string;
}) {
  const player =
    getPlayer(playerId);

  return (
    <div className="flex items-center gap-4 border-b border-[#071827]/10 pb-5 last:border-b-0 last:pb-0">
      <p className="w-8 font-serif text-3xl text-[#b68d37]">
        {String(rank).padStart(
          2,
          "0",
        )}
      </p>

      {player && (
        <img
          src={`/player-profiles/${player.photo_key}.webp`}
          alt={
            player.display_name
          }
          className="h-12 w-12 rounded-full object-cover"
        />
      )}

      <div className="min-w-0 flex-1">
        <Link
          to={`/players/${playerId}`}
          className="font-serif text-xl transition hover:text-[#b68d37]"
        >
          {getPlayerName(
            playerId,
          )}
        </Link>

        <p className="mt-1 text-sm text-[#59666d]">
          {value}
        </p>
      </div>
    </div>
  );
}