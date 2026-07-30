import ContentCard from "../../components/common/ContentCard";
import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";
import {
  records,
  recordsByCategory,
  type CyderCupRecord,
} from "../../data/records";

const teamStyles = {
  navy: {
    label: "Team Navy",
    text: "text-sky-200",
    border: "border-sky-300/25",
    wash: "from-sky-300/10",
    dot: "bg-sky-300",
  },
  red: {
    label: "Team Red",
    text: "text-red-200",
    border: "border-red-300/25",
    wash: "from-red-300/10",
    dot: "bg-red-300",
  },
} as const;

function getTeamStyle(record: CyderCupRecord) {
  return record.teamId ? teamStyles[record.teamId] : teamStyles.navy;
}

function HolderLine({ record }: { record: CyderCupRecord }) {
  const style = getTeamStyle(record);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <p className="font-serif text-xl font-semibold text-white sm:text-2xl">
        {record.holderName}
      </p>
      <span
        className={`inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] ${style.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
        {style.label}
      </span>
    </div>
  );
}

function FeaturedRecord({ record, rank }: { record: CyderCupRecord; rank: number }) {
  const style = getTeamStyle(record);

  return (
    <ContentCard hover className={`min-h-80 border ${style.border} p-7 sm:p-8`}>
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.wash} via-transparent to-transparent`}
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-amber-300">
              Career record {String(rank).padStart(2, "0")}
            </p>
            <h2 className="mt-4 max-w-sm font-serif text-2xl font-semibold leading-tight text-white sm:text-3xl">
              {record.title}
            </h2>
          </div>

          <TrophyIcon className="h-9 w-9 shrink-0 text-amber-300/80" />
        </div>

        <div className="mt-10">
          <p className="font-serif text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl">
            {record.displayValue}
          </p>
          <div className="mt-5">
            <HolderLine record={record} />
          </div>
        </div>

        <p className="mt-auto pt-8 text-sm leading-6 text-slate-400">
          {record.description}
        </p>
      </div>
    </ContentCard>
  );
}

function RecordCard({ record }: { record: CyderCupRecord }) {
  const style = getTeamStyle(record);

  return (
    <ContentCard hover className={`border ${style.border} p-6`}>
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.wash} via-transparent to-transparent opacity-70`}
        aria-hidden="true"
      />

      <div className="relative">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-slate-400">
          {record.title}
        </p>

        <p className="mt-5 font-serif text-4xl font-semibold tracking-tight text-white">
          {record.displayValue}
        </p>

        <div className="mt-4">
          <HolderLine record={record} />
        </div>

        <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-6 text-slate-400">
          {record.description}
        </p>
      </div>
    </ContentCard>
  );
}

function FormatGroup({
  title,
  eyebrow,
  records: groupRecords,
}: {
  title: string;
  eyebrow: string;
  records: CyderCupRecord[];
}) {
  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.25em] text-amber-300">
            {eyebrow}
          </p>
          <h3 className="mt-2 font-serif text-3xl font-semibold text-white">
            {title}
          </h3>
        </div>
        <FlagIcon className="h-7 w-7 text-white/25" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {groupRecords.map((record) => (
          <RecordCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}

export default function RecordsPage() {
  const careerRecords = recordsByCategory("career");
  const teamAndCaptainRecords = records
    .filter((record) => record.category === "team" || record.category === "captain")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const formatRecords = recordsByCategory("format");

  const singlesRecords = formatRecords.filter((record) => record.id.startsWith("singles-"));
  const fourballRecords = formatRecords.filter((record) => record.id.startsWith("fourball-"));
  const scrambleRecords = formatRecords.filter((record) => record.id.startsWith("scramble-"));

  return (
    <>
      <PageIntro
        eyebrow="The Record Book"
        title="Cyder Cup Records"
        description="The defining performances, career benchmarks and team achievements from every completed edition of the Cyder Cup."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Career Leaders"
          title="The standards everyone is chasing"
          description="Career results are calculated from the historical match record and presented from the official Cyder Cup databook."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {careerRecords.slice(0, 2).map((record, index) => (
            <FeaturedRecord key={record.id} record={record} rank={index + 1} />
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {careerRecords.slice(2).map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#041321]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <SectionHeading
            eyebrow="Cup & Captaincy"
            title="Winning the event"
            description="Team success and captaincy records across the completed history of the competition."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {teamAndCaptainRecords.map((record) => (
              <RecordCard key={record.id} record={record} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <SectionHeading
          eyebrow="Format Leaders"
          title="Different formats. Different pressure."
          description="The leading career performances in singles, fourball and scramble match play."
        />

        <div className="mt-12 space-y-14">
          <FormatGroup title="Singles" eyebrow="One player. One opponent." records={singlesRecords} />
          <FormatGroup title="Fourball" eyebrow="Partnership golf" records={fourballRecords} />
          <FormatGroup title="Scramble" eyebrow="Opening-session teamwork" records={scrambleRecords} />
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#081b2d]">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.26em] text-amber-300">
            Official record book
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">
            Records reflect the completed Cyder Cup match history currently captured in the master databook. Tied leaders display the first matching holder returned by the workbook feed.
          </p>
        </div>
      </section>
    </>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 4h8v3.5c0 3.2-1.8 5.5-4 5.5s-4-2.3-4-5.5V4Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 6H5.5v1.2c0 2.1 1.3 3.8 3.3 4.3M16 6h2.5v1.2c0 2.1-1.3 3.8-3.3 4.3M12 13v4M9 20h6M10 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 21V3m0 1h10l-2.2 3L16 10H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
