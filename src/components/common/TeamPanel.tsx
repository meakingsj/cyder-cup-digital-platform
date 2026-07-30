import TeamCrest from "./TeamCrest";
import type { TeamId } from "../../types";

interface TeamPanelProps {
  team: TeamId;
  title?: string;
  description?: string;
}

const teamContent = {
  navy: {
    name: "Team Navy",
    accentClass: "border-slate-300/30 bg-slate-200/5",
    textClass: "text-slate-200",
  },
  red: {
    name: "Team Red",
    accentClass: "border-red-300/30 bg-red-500/5",
    textClass: "text-red-100",
  },
};

export default function TeamPanel({
  team,
  title,
  description,
}: TeamPanelProps) {
  const details = teamContent[team];

  return (
    <div
      className={`rounded-sm border p-6 ${details.accentClass}`}
    >
      <div className="flex items-center gap-5">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#071827] p-3">
          <TeamCrest
            team={team}
            className="flex h-full w-full items-center justify-center"
            imageClassName="max-h-full max-w-full object-contain"
          />
        </div>

        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-[0.28em] ${details.textClass}`}
          >
            {details.name}
          </p>

          <h3 className="mt-2 font-serif text-2xl text-white">
            {title ?? details.name}
          </h3>
        </div>
      </div>

      {description && (
        <p className="mt-5 text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}