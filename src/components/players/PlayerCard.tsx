import type { Player } from "../../types";

interface PlayerCardProps {
  player: Player;
}

function percentage(player: Player): string {
  const { pointsWon, pointsAvailable } = player.overallRecord;
  return pointsAvailable > 0
    ? `${Math.round((pointsWon / pointsAvailable) * 100)}%`
    : "—";
}

function initials(player: Player): string {
  return `${player.firstName.charAt(0)}${player.lastName.charAt(0)}`;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  const isNavy = player.teamId === "navy";

  return (
    <article className="group overflow-hidden rounded-sm border border-white/10 bg-[#081b2c] shadow-[0_18px_55px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div
        className={`relative flex min-h-52 items-end overflow-hidden p-6 ${
          isNavy
            ? "bg-[radial-gradient(circle_at_top_right,#36516b_0%,#102a42_42%,#071827_100%)]"
            : "bg-[radial-gradient(circle_at_top_right,#9f2c35_0%,#4b1720_42%,#180b12_100%)]"
        }`}
      >
        <div className="absolute -right-4 -top-8 select-none font-serif text-[10rem] leading-none text-white/[0.045]">
          {player.handicap}
        </div>

        <div className="relative flex w-full items-end gap-5">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/20 bg-black/20 font-serif text-3xl text-white shadow-xl backdrop-blur-sm">
            {player.photoPath ? (
              <img
                src={player.photoPath}
                alt={player.displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">{initials(player)}</div>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/60">
              Team {isNavy ? "Navy" : "Red"}
            </p>
            <h3 className="mt-2 font-serif text-3xl leading-none text-white">
              {player.displayName}
            </h3>
            <p className="mt-3 text-sm text-white/70">
              Handicap {player.handicap}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-2 border-b border-white/10 pb-5 text-center">
          <Stat label="W" value={player.overallRecord.wins} />
          <Stat label="L" value={player.overallRecord.losses} />
          <Stat label="T" value={player.overallRecord.halves} />
          <Stat label="PTS%" value={percentage(player)} />
        </div>

        <dl className="mt-5 space-y-3 text-sm">
          <Detail label="Hometown" value={player.hometown} />
          <Detail label="Home course" value={player.homeCourse} />
          <Detail label="Drink" value={player.favoriteDrink} />
          <Detail label="Walkout" value={player.walkoutMusic} />
        </dl>

        {player.bio && (
          <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-6 text-slate-400">
            {player.bio}
          </p>
        )}
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="font-serif text-2xl text-white">{value}</p>
      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <div className="grid grid-cols-[92px_1fr] gap-3">
      <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </dt>
      <dd className="text-slate-200">{value}</dd>
    </div>
  );
}
