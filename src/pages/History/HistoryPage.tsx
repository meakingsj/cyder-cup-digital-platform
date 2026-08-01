import { useMemo, useState } from "react";

import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";
import TeamCrest from "../../components/common/TeamCrest";

import {
  formatTournamentDates,
  getHistoryEntry,
  tournamentFeed,
} from "../../data/history";

import {
  getHistoryFeaturedMedia,
  getHistoryGalleryMedia,
  getMediaAltText,
  getMediaObjectPosition,
  type PageMediaItem,
} from "../../data/pageMedia";

type WinningTeam = "navy" | "red" | null;

export default function HistoryPage() {
  const completedTournaments = useMemo(
    () =>
      [...tournamentFeed]
        .filter((tournament) => tournament.status === "complete")
        .sort((a, b) => b.year - a.year),
    [],
  );

  const [selectedYear, setSelectedYear] = useState(
    completedTournaments[0]?.year ?? 2025,
  );

  const tournament =
    completedTournaments.find((item) => item.year === selectedYear) ??
    completedTournaments[0];

  const recap = getHistoryEntry(selectedYear);

  if (!tournament) {
    return (
      <PageIntro
        eyebrow="Since 2019"
        title="Tournament History"
        description="The Cyder Cup archive is currently unavailable."
      />
    );
  }

  const winner: WinningTeam =
    tournament.winning_team === "navy" ||
    tournament.winning_team === "red"
      ? tournament.winning_team
      : null;

  const featuredMedia = getHistoryFeaturedMedia(selectedYear);
  const workbookGallery = getHistoryGalleryMedia(selectedYear);

  const heroImage = resolveHeroImage(
    featuredMedia,
    recap?.photos?.[0],
    selectedYear,
  );

  const galleryImages =
    workbookGallery.length > 0
      ? workbookGallery
      : createFallbackGallery(recap?.photos?.slice(1) ?? [], selectedYear);

  const overview = recap?.overview || tournament.summary;

  return (
    <>
      <PageIntro
        eyebrow="Since 2019"
        title="Tournament History"
        description="Revisit every completed Cyder Cup through official results, tournament photographs and the stories that shaped the rivalry."
      />

      <main>
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <SectionHeading
            eyebrow="The Archive"
            title="Every edition tells a different story."
            description="Select a year to revisit the champions, venue, final score and moments that defined the tournament."
          />

          <YearSelector
            years={completedTournaments.map((item) => item.year)}
            selectedYear={selectedYear}
            onSelect={setSelectedYear}
          />

          <div className="mt-8 grid overflow-hidden border border-white/10 bg-[#071827] shadow-[0_28px_80px_rgba(0,0,0,0.28)] lg:grid-cols-[0.82fr_1.18fr]">
            <TournamentSummary
              year={tournament.year}
              winner={winner}
              navyPoints={tournament.navy_points}
              redPoints={tournament.red_points}
              dates={formatTournamentDates(
                tournament.start_date,
                tournament.end_date,
              )}
              location={[tournament.city, tournament.region]
                .filter(Boolean)
                .join(", ")}
              winningCaptain={tournament["winning captain"] ?? "—"}
              courses={tournament.venue.split(" | ").join(" · ")}
            />

            <TournamentHero image={heroImage} year={selectedYear} />
          </div>
        </section>

        {galleryImages.length > 0 && (
          <section className="border-y border-white/10 bg-[#04111e]/55">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
              <SectionHeading
                eyebrow={`${selectedYear} Gallery`}
                title="The moments that shaped the weekend."
                description="Selected photographs from the official Cyder Cup archive."
              />

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((image, index) => (
                  <GalleryImage
                    key={`${image.media_id}-${image.file_path}-${index}`}
                    item={image}
                    index={index}
                    year={selectedYear}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {recap && recap.writeup.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <SectionHeading
              eyebrow={`${recap.year} Written Reflection`}
              title="The tournament, as it happened."
            />

            <div className="mt-10 max-w-4xl">
              {overview && (
                <div className="mb-12 border-l-2 border-amber-300 pl-6 sm:pl-8">
                  <p className="text-lg leading-8 text-slate-200 sm:text-xl sm:leading-9">
                    {overview}
                  </p>
                </div>
              )}

              {recap.writeup.map((paragraph, index) => {
                if (isWriteupHeading(paragraph)) {
                  return (
                    <h3
                      key={`${paragraph}-${index}`}
                      className="mb-5 mt-12 font-serif text-2xl font-bold leading-tight text-white first:mt-0 sm:text-3xl"
                    >
                      {paragraph}
                    </h3>
                  );
                }

                return (
                  <p
                    key={`${paragraph}-${index}`}
                    className="mb-6 text-base leading-8 text-slate-300"
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </section>
        )}

        <section className="border-t border-white/10 bg-[#081b2d]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
            <SectionHeading
              eyebrow="Coming Next"
              title="Predator Ridge · 2026"
              description="The next chapter begins in Vernon, British Columbia, from August 20–23, 2026."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <img
                src="/course/predator-ridge-aerial.jpg"
                alt="Aerial view of Predator Ridge golf course"
                className="h-72 w-full border border-white/10 object-cover"
              />

              <img
                src="/course/predator-ridge-resort.jpg"
                alt="Predator Ridge resort and golf course"
                className="h-72 w-full border border-white/10 object-cover"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function YearSelector({
  years,
  selectedYear,
  onSelect,
}: {
  years: number[];
  selectedYear: number;
  onSelect: (year: number) => void;
}) {
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      {years.map((year) => {
        const isSelected = year === selectedYear;

        return (
          <button
            key={year}
            type="button"
            onClick={() => onSelect(year)}
            className={[
              "min-h-11 border px-5",
              "text-xs font-bold uppercase tracking-[0.18em]",
              "transition",
              isSelected
                ? "border-amber-300 bg-amber-300 text-[#061626]"
                : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white",
            ].join(" ")}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}

function TournamentSummary({
  year,
  winner,
  navyPoints,
  redPoints,
  dates,
  location,
  winningCaptain,
  courses,
}: {
  year: number;
  winner: WinningTeam;
  navyPoints: number;
  redPoints: number;
  dates: string;
  location: string;
  winningCaptain: string;
  courses: string;
}) {
  return (
    <div className="relative flex flex-col p-7 sm:p-9 lg:p-11">
      <div
        className={[
          "absolute inset-0 opacity-70",
          winner === "navy"
            ? "bg-[radial-gradient(circle_at_top_left,rgba(38,93,137,0.36),transparent_60%)]"
            : winner === "red"
              ? "bg-[radial-gradient(circle_at_top_left,rgba(139,34,48,0.34),transparent_60%)]"
              : "bg-[radial-gradient(circle_at_top_left,rgba(215,177,92,0.18),transparent_60%)]",
        ].join(" ")}
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
              Cyder Cup {year}
            </p>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
              Tournament champions
            </p>
          </div>

          {winner !== null && (
            <TeamCrest
              team={winner}
              className="h-20 w-20 sm:h-24 sm:w-24"
              imageClassName="h-full w-full object-contain"
            />
          )}
        </div>

        <h2 className="mt-7 font-serif text-5xl leading-none text-white sm:text-6xl">
          {winner === "navy"
            ? "Team Navy"
            : winner === "red"
              ? "Team Red"
              : "Result pending"}
        </h2>

        <div className="mt-9 grid grid-cols-2 overflow-hidden border-y border-white/10">
          <Score label="Team Navy" value={navyPoints} team="navy" />
          <Score label="Team Red" value={redPoints} team="red" />
        </div>

        <dl className="mt-8 space-y-5">
          <Detail label="Dates" value={dates} />
          <Detail label="Location" value={location} />
          <Detail label="Winning captain" value={winningCaptain} />
          <Detail label="Courses" value={courses} />
        </dl>
      </div>
    </div>
  );
}

function TournamentHero({
  image,
  year,
}: {
  image?: PageMediaItem;
  year: number;
}) {
  return (
    <div className="relative min-h-[430px] overflow-hidden lg:min-h-full">
      {image ? (
        <img
          src={image.file_path}
          alt={getMediaAltText(image, `Cyder Cup ${year}`)}
          style={{
            objectPosition: getMediaObjectPosition(image),
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top_right,#29435d_0%,#0b2135_48%,#061421_100%)]">
          <p className="font-serif text-8xl text-white/10">{year}</p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
    </div>
  );
}

function Score({
  label,
  value,
  team,
}: {
  label: string;
  value: number;
  team: "navy" | "red";
}) {
  return (
    <div className="px-4 py-6 text-center first:border-r first:border-white/10 sm:px-6">
      <p
        className={[
          "font-serif text-5xl",
          team === "navy" ? "text-sky-200" : "text-red-200",
        ].join(" ")}
      >
        {value}
      </p>

      <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
        {label}
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4">
      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/85">
        {label}
      </dt>

      <dd className="leading-6 text-slate-200">{value}</dd>
    </div>
  );
}

function GalleryImage({
  item,
  year,
}: {
  item: PageMediaItem;
  index: number;
  year: number;
}) {
  return (
    <figure className="group relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#071827]">
      <img
        src={item.file_path}
        alt={getMediaAltText(
          item,
          `${year} Cyder Cup photograph`,
        )}
        style={{
          objectPosition:
            getMediaObjectPosition(item),
        }}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />
    </figure>
  );
}

function resolveHeroImage(
  featuredMedia: PageMediaItem | undefined,
  fallbackPath: string | undefined,
  year: number,
): PageMediaItem | undefined {
  if (featuredMedia) {
    return featuredMedia;
  }

  if (!fallbackPath) {
    return undefined;
  }

  return {
    media_id: `history-hero-fallback-${year}`,
    year,
    file_name: fallbackPath.split("/").pop() ?? `history-${year}`,
    file_path: fallbackPath,
    alt_text: `${year} Cyder Cup`,
    object_position: "center",
    active: true,
  };
}

function createFallbackGallery(
  paths: string[],
  year: number,
): PageMediaItem[] {
  return paths.map((path, index) => ({
    media_id: `history-gallery-fallback-${year}-${index}`,
    year,
    file_name: path.split("/").pop() ?? `history-${year}-${index}`,
    file_path: path,
    alt_text: `${year} Cyder Cup photograph`,
    object_position: "center",
    active: true,
  }));
}

function isWriteupHeading(paragraph: string): boolean {
  const text = paragraph.trim();

  if (
    /^(Session|Match|20\d{2}|Tournament Reflection|Overall Tournament)/i.test(
      text,
    )
  ) {
    return true;
  }

  return (
    text.length <= 120 &&
    /\b(defeats?|halves?|ties?|wins?|lost to|beat)\b/i.test(text) &&
    /(\d+&\d+|\d+UP|\bAS\b|halved|tie)/i.test(text)
  );
}