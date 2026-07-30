import { useMemo, useState } from "react";
import ContentCard from "../../components/common/ContentCard";
import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";
import {
  formatTournamentDates,
  getHistoryEntry,
  tournamentFeed,
} from "../../data/history";

export default function HistoryPage() {
  const completed = useMemo(
    () => [...tournamentFeed].filter((item) => item.status === "complete").sort((a, b) => b.year - a.year),
    [],
  );
  const [selectedYear, setSelectedYear] = useState(completed[0]?.year ?? 2025);
  const tournament = completed.find((item) => item.year === selectedYear) ?? completed[0];
  const recap = getHistoryEntry(selectedYear);

  return (
    <>
      <PageIntro
        eyebrow="Since 2019"
        title="Tournament History"
        description="Explore every completed Cyder Cup through official results, venues, photographs and the original written reflections from each tournament."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="The Archive"
          title="Every edition of the Cyder Cup"
          description="Select a year to revisit the final score, winning captain and stories that defined the tournament."
        />

        <div className="mt-10 flex flex-wrap gap-3">
          {completed.map((item) => (
            <button
              key={item.year}
              type="button"
              onClick={() => setSelectedYear(item.year)}
              className={`min-h-11 rounded-sm border px-5 text-xs font-bold uppercase tracking-[0.18em] transition ${
                selectedYear === item.year
                  ? "border-amber-300 bg-amber-300 text-[#061626]"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25"
              }`}
            >
              {item.year}
            </button>
          ))}
        </div>

        {tournament && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
            <ContentCard className="p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300">Cyder Cup {tournament.year}</p>
              <h2 className="mt-4 font-serif text-5xl text-white">
                Team {tournament.winning_team === "navy" ? "Navy" : "Red"}
              </h2>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Tournament champions</p>

              <div className="mt-8 grid grid-cols-2 gap-4 border-y border-white/10 py-6">
                <Score label="Team Navy" value={tournament.navy_points} />
                <Score label="Team Red" value={tournament.red_points} />
              </div>

              <dl className="mt-6 space-y-4 text-sm">
                <Detail label="Dates" value={formatTournamentDates(tournament.start_date, tournament.end_date)} />
                <Detail label="Location" value={[tournament.city, tournament.region].filter(Boolean).join(", ")} />
                <Detail label="Winning captain" value={tournament["winning captain"] ?? "—"} />
                <Detail label="Courses" value={tournament.venue.split(" | ").join(" · ")} />
              </dl>
            </ContentCard>

            <ContentCard className="overflow-hidden">
              {recap?.photos?.[0] ? (
                <img src={recap.photos[0]} alt={`Cyder Cup ${tournament.year}`} className="h-72 w-full object-cover sm:h-96" />
              ) : (
                <div className="flex h-72 items-center justify-center bg-[radial-gradient(circle_at_top_right,#29435d_0%,#0b2135_48%,#061421_100%)] sm:h-96">
                  <p className="font-serif text-7xl text-white/15">{tournament.year}</p>
                </div>
              )}
              <div className="p-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-amber-300">Tournament reflection</p>
                <p className="mt-4 text-base leading-7 text-slate-300">{recap?.overview || tournament.summary}</p>
              </div>
            </ContentCard>
          </div>
        )}
      </section>

      {recap && (
        <section className="border-y border-white/10 bg-[#04111e]/55">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
            <SectionHeading eyebrow={`${recap.year} Written Reflections`} title="The tournament, as it happened" />

            {recap.photos.length > 1 && (
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {recap.photos.slice(1, 4).map((photo, index) => (
                  <img key={photo} src={photo} alt={`${recap.year} Cyder Cup gallery ${index + 1}`} className="h-56 w-full rounded-sm border border-white/10 object-cover" />
                ))}
              </div>
            )}

            <div className="mt-10 w-full">
              {recap.writeup.map((paragraph, index) => {
                const heading = isWriteupHeading(paragraph);
                return heading ? (
                  <h3
                    key={`${paragraph}-${index}`}
                    className="mb-4 mt-10 font-serif text-2xl font-bold leading-tight text-white first:mt-0 sm:text-3xl"
                  >
                    {paragraph}
                  </h3>
                ) : (
                  <p
                    key={`${paragraph}-${index}`}
                    className="mb-6 max-w-none text-base leading-8 text-slate-300"
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeading eyebrow="Coming Next" title="Predator Ridge · 2026" description="The next chapter begins in Vernon, British Columbia, from August 20–23, 2026." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <img src="/course/predator-ridge-aerial.jpg" alt="Aerial view of Predator Ridge golf course" className="h-72 w-full rounded-sm border border-white/10 object-cover" />
          <img src="/course/predator-ridge-resort.jpg" alt="Predator Ridge resort and golf course" className="h-72 w-full rounded-sm border border-white/10 object-cover" />
        </div>
      </section>
    </>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return <div><p className="font-serif text-4xl text-white">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{label}</p></div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="grid grid-cols-[112px_1fr] gap-4"><dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</dt><dd className="leading-6 text-slate-200">{value}</dd></div>;
}


function isWriteupHeading(paragraph: string) {
  const text = paragraph.trim();

  if (/^(Session|Match|20\d{2}|Tournament Reflection|Overall Tournament)/i.test(text)) {
    return true;
  }

  const looksLikeMatchResult =
    text.length <= 120 &&
    /\b(defeats?|halves?|ties?|wins?|lost to|beat)\b/i.test(text) &&
    /(\d+&\d+|\d+UP|\bAS\b|halved|tie)/i.test(text);

  return looksLikeMatchResult;
}
