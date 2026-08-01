import type { ReactNode } from "react";
import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";
import TeamCrest from "../../components/common/TeamCrest";

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
    background:
      "bg-[radial-gradient(circle_at_top_right,rgba(77,145,194,0.2),transparent_52%),#081b2d]",
    accent: "bg-sky-300",
  },

  red: {
    label: "Team Red",
    text: "text-red-200",
    border: "border-red-300/25",
    background:
      "bg-[radial-gradient(circle_at_top_right,rgba(189,67,78,0.2),transparent_52%),#181016]",
    accent: "bg-red-300",
  },
} as const;

function getTeamStyle(
  record: CyderCupRecord,
) {
  return record.teamId
    ? teamStyles[record.teamId]
    : undefined;
}

export default function RecordsPage() {
  const careerRecords =
    recordsByCategory("career");

  const teamRecords = records
    .filter(
      (record) =>
        record.category === "team" ||
        record.category === "captain",
    )
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder,
    );

  const formatRecords =
    recordsByCategory("format");

  const singlesRecords =
    formatRecords.filter((record) =>
      record.id.startsWith(
        "singles-",
      ),
    );

  const fourballRecords =
    formatRecords.filter((record) =>
      record.id.startsWith(
        "fourball-",
      ),
    );

  const scrambleRecords =
    formatRecords.filter((record) =>
      record.id.startsWith(
        "scramble-",
      ),
    );

  return (
    <>
      <PageIntro
        eyebrow="The Record Book"
        title="Cyder Cup Records"
        description="The defining performances, career benchmarks and team achievements from every completed edition of the Cyder Cup."
      />

      <main className="bg-[#061626] text-white">
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <SectionHeading
            eyebrow="Career Leaders"
            title="The standards everyone is chasing."
            description="Career results are calculated directly from the completed match history in the official Cyder Cup databook."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {careerRecords
              .slice(0, 2)
              .map(
                (
                  record,
                  index,
                ) => (
                  <FeaturedRecord
                    key={record.id}
                    record={record}
                    rank={index + 1}
                  />
                ),
              )}
          </div>

          {careerRecords.length > 2 && (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {careerRecords
                .slice(2)
                .map((record) => (
                  <StandardRecord
                    key={record.id}
                    record={record}
                  />
                ))}
            </div>
          )}
        </section>

        {teamRecords.length > 0 && (
          <section className="border-y border-white/10 bg-[#04121f]">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
              <SectionHeading
                eyebrow="Cup & Captaincy"
                title="Winning the event."
                description="Championship and leadership benchmarks from the completed history of the competition."
              />

              <div className="mt-12 grid gap-5 lg:grid-cols-2">
                {teamRecords.map(
                  (record) => (
                    <TeamRecord
                      key={record.id}
                      record={record}
                    />
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <SectionHeading
            eyebrow="Format Leaders"
            title="Different formats. Different pressure."
            description="The leading career performances in singles, four-ball and scramble match play."
          />

          <div className="mt-14 space-y-20">
            <FormatSection
              title="Singles"
              eyebrow="One player. One opponent."
              records={singlesRecords}
              icon={<SinglesIcon />}
            />

            <FormatSection
              title="Four-ball"
              eyebrow="Partnership golf"
              records={fourballRecords}
              icon={<PartnerIcon />}
            />

            <FormatSection
              title="Scramble"
              eyebrow="Opening-session teamwork"
              records={scrambleRecords}
              icon={<FlagIcon />}
            />
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#081b2d]">
          <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-8 lg:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
              Official Cyder Cup record book
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Records reflect the completed
              match history currently captured
              in the master databook. New
              results will update automatically
              after each tournament.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

function FeaturedRecord({
  record,
  rank,
}: {
  record: CyderCupRecord;
  rank: number;
}) {
  const style =
    getTeamStyle(record);

  return (
    <article
      className={[
        "group relative min-h-[430px]",
        "overflow-hidden border",
        "p-8 transition duration-300",
        "hover:-translate-y-1",
        "hover:shadow-[0_28px_75px_rgba(0,0,0,0.28)]",
        style?.border ??
          "border-amber-300/25",
        style?.background ??
          "bg-[radial-gradient(circle_at_top_right,rgba(215,177,92,0.16),transparent_52%),#081b2d]",
      ].join(" ")}
    >
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">
              Career benchmark{" "}
              {String(rank).padStart(
                2,
                "0",
              )}
            </p>

            <h2 className="mt-5 max-w-md font-serif text-3xl leading-tight text-white sm:text-4xl">
              {record.title}
            </h2>
          </div>

          <TrophyIcon className="h-10 w-10 shrink-0 text-amber-300" />
        </div>

        <div className="mt-12">
          <p className="font-serif text-7xl leading-none tracking-tight text-white sm:text-8xl">
            {record.displayValue}
          </p>

          <div className="mt-7">
            <RecordHolder
              record={record}
              large
            />
          </div>
        </div>

        <p className="mt-auto max-w-xl pt-10 text-sm leading-7 text-slate-300">
          {record.description}
        </p>
      </div>
    </article>
  );
}

function StandardRecord({
  record,
}: {
  record: CyderCupRecord;
}) {
  const style =
    getTeamStyle(record);

  return (
    <article
      className={[
        "group relative min-h-[310px]",
        "overflow-hidden border",
        "bg-[#071827] p-7",
        "transition duration-300",
        "hover:-translate-y-1",
        style?.border ??
          "border-white/10",
      ].join(" ")}
    >
      <div
        className={[
          "absolute inset-y-0 left-0 w-1",
          style?.accent ??
            "bg-amber-300",
        ].join(" ")}
      />

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-300">
          {record.title}
        </p>

        <p className="mt-8 font-serif text-6xl leading-none text-white">
          {record.displayValue}
        </p>

        <div className="mt-6">
          <RecordHolder
            record={record}
          />
        </div>

        <p className="mt-7 border-t border-white/10 pt-6 text-sm leading-7 text-slate-300">
          {record.description}
        </p>
      </div>
    </article>
  );
}

function TeamRecord({
  record,
}: {
  record: CyderCupRecord;
}) {
  const style =
    getTeamStyle(record);

  return (
    <article
      className={[
        "relative overflow-hidden border",
        "p-8 sm:p-10",
        style?.border ??
          "border-white/10",
        style?.background ??
          "bg-[#071827]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
            {record.category}
          </p>

          <h3 className="mt-4 max-w-md font-serif text-3xl leading-tight text-white">
            {record.title}
          </h3>
        </div>

        {record.teamId ? (
          <TeamCrest
            team={record.teamId}
            className="h-20 w-20 shrink-0"
            imageClassName="h-full w-full object-contain"
          />
        ) : (
          <TrophyIcon className="h-10 w-10 shrink-0 text-amber-300" />
        )}
      </div>

      <div className="mt-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
        <div>
          <p className="font-serif text-6xl leading-none text-white">
            {record.displayValue}
          </p>

          <div className="mt-5">
            <RecordHolder
              record={record}
            />
          </div>
        </div>

        <p className="max-w-sm text-sm leading-7 text-slate-300">
          {record.description}
        </p>
      </div>
    </article>
  );
}

function FormatSection({
  title,
  eyebrow,
  records: formatRecords,
  icon,
}: {
  title: string;
  eyebrow: string;
  records: CyderCupRecord[];
  icon: ReactNode;
}) {
  if (formatRecords.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="flex items-end justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
            {eyebrow}
          </p>

          <h3 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            {title}
          </h3>
        </div>

        <div className="text-white/35">
          {icon}
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {formatRecords.map(
          (record) => (
            <FormatRecord
              key={record.id}
              record={record}
            />
          ),
        )}
      </div>
    </section>
  );
}

function FormatRecord({
  record,
}: {
  record: CyderCupRecord;
}) {
  const style =
    getTeamStyle(record);

  return (
    <article
      className={[
        "group border bg-[#071827]",
        "p-7 transition duration-300",
        "hover:-translate-y-1",
        style?.border ??
          "border-white/10",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
            {record.title}
          </p>

          <p className="mt-6 font-serif text-5xl leading-none text-white">
            {record.displayValue}
          </p>
        </div>

        {record.teamId && (
          <TeamCrest
            team={record.teamId}
            className="h-14 w-14"
            imageClassName="h-full w-full object-contain"
          />
        )}
      </div>

      <div className="mt-6">
        <RecordHolder
          record={record}
        />
      </div>

      <p className="mt-6 border-t border-white/10 pt-6 text-sm leading-7 text-slate-300">
        {record.description}
      </p>
    </article>
  );
}

function RecordHolder({
  record,
  large = false,
}: {
  record: CyderCupRecord;
  large?: boolean;
}) {
  const style =
    getTeamStyle(record);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <p
        className={[
          "font-serif font-semibold text-white",
          large
            ? "text-2xl sm:text-3xl"
            : "text-xl sm:text-2xl",
        ].join(" ")}
      >
        {record.holderName}
      </p>

      {style && (
        <span
          className={[
            "inline-flex items-center gap-2",
            "text-[10px] font-bold uppercase",
            "tracking-[0.2em]",
            style.text,
          ].join(" ")}
        >
          <span
            className={[
              "h-1.5 w-1.5 rounded-full",
              style.accent,
            ].join(" ")}
          />

          {style.label}
        </span>
      )}
    </div>
  );
}

function TrophyIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
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

function FlagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-9 w-9"
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

function SinglesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-9 w-9"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="7"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M6.5 21c.6-4.4 2.4-7 5.5-7s4.9 2.6 5.5 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PartnerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-9 w-9"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <circle
        cx="16"
        cy="8"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />

      <path
        d="M3.5 20c.4-3.7 1.9-6 4.5-6 1.7 0 3 1 4 2.6 1-1.6 2.3-2.6 4-2.6 2.6 0 4.1 2.3 4.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}