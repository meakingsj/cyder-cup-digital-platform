import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <section className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-[#071827]">
        <div
          className="absolute inset-0 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#04111e] via-[#061626]/95 to-[#061626]/50" />

        <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-5 py-20 sm:px-8 lg:px-10">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.34em] text-amber-300">
              The 2026 Cyder Cup
            </p>

            <h1 className="font-serif text-6xl font-semibold leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl">
              Competition.
              <br />
              Tradition.
              <br />
              <span className="text-amber-300">Cyder Cup.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Eight players. Two teams. Three sessions. The annual battle
              between Team Navy and Team Red continues at Predator Ridge,
              British Columbia.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/live"
                className="inline-flex min-h-12 items-center justify-center rounded-sm bg-amber-300 px-7 text-xs font-bold uppercase tracking-[0.18em] text-[#061626] transition hover:bg-amber-200"
              >
                View 2026 Event
              </Link>

              <Link
                to="/history"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-white/20 bg-white/5 px-7 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Explore History
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-[#04111e]/85 backdrop-blur">
          <div className="mx-auto grid max-w-7xl divide-y divide-white/10 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8 lg:px-10">
            <div className="py-5 sm:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Host Venue
              </p>
              <p className="mt-1 font-serif text-lg text-white">
                Predator Ridge
              </p>
            </div>

            <div className="py-5 sm:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Competition
              </p>
              <p className="mt-1 font-serif text-lg text-white">
                Team Navy vs Team Red
              </p>
            </div>

            <div className="py-5 sm:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Winning Score
              </p>
              <p className="mt-1 font-serif text-lg text-white">
                First to 15.5 Points
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}