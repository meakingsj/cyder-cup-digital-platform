import { Link } from "react-router-dom";
import cyderCupLogo from "../../assets/logos/cyder-cup-logo.png";
import TeamCrest from "../common/TeamCrest";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071827]">
      <div
        className="absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.055]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 76% 46%, transparent 0, transparent 58px, rgba(255,255,255,0.75) 59px, transparent 60px)",
        }}
      />

      <div
        className="absolute inset-0 bg-gradient-to-r from-[#04111e] via-[#061626]/95 to-[#061626]/45"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 lg:py-16">
        <div className="relative z-20 max-w-3xl">
          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-10 bg-amber-300" />

            <p className="text-xs font-bold uppercase tracking-[0.34em] text-amber-300">
              The 2026 Cyder Cup
            </p>
          </div>

          <h1 className="font-serif text-6xl font-semibold leading-[1.07] tracking-tight text-white sm:text-7xl lg:text-[5.2rem]">
            <span className="block">Competition.</span>
            <span className="block mt-2">Tradition.</span>
            <span className="mt-2 block text-amber-300">Cyder Cup.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Eight players. Two teams. Three sessions. The annual battle
            between Team Navy and Team Red continues at Predator Ridge in
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

        <div className="relative hidden min-h-[640px] items-center justify-center lg:flex">
          <div
            className="absolute h-[640px] w-[640px] rounded-full border border-amber-300/15"
            aria-hidden="true"
          />

          <div
            className="absolute h-[500px] w-[500px] rounded-full border border-white/10"
            aria-hidden="true"
          />

          <div
            className="absolute h-[370px] w-[370px] rounded-full border border-amber-300/10"
            aria-hidden="true"
          />

          <div className="relative z-10 grid w-full grid-cols-[165px_minmax(380px,1fr)_165px] items-center justify-center gap-3">
            <div className="flex items-center justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/45 bg-gradient-to-br from-slate-100/70 via-slate-200/45 to-slate-400/30 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div
                  className="absolute inset-2 rounded-full border border-white/30"
                  aria-hidden="true"
                />

                <div
                  className="absolute inset-5 rounded-full bg-white/[0.16]"
                  aria-hidden="true"
                />

                <TeamCrest
                  team="navy"
                  className="relative z-10 flex h-full w-full items-center justify-center"
                  imageClassName="h-[112px] w-[112px] object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>

            <div className="relative flex min-h-[560px] items-center justify-center">
              <div
                className="absolute h-[500px] w-[500px] rounded-full bg-amber-300/[0.08] blur-3xl"
                aria-hidden="true"
              />

              <div
                className="absolute h-[420px] w-[420px] rounded-full border border-amber-300/10"
                aria-hidden="true"
              />

              <img
                src={cyderCupLogo}
                alt="2026 Cyder Cup logo"
                className="relative z-10 max-h-[540px] w-auto max-w-[540px] object-contain drop-shadow-[0_36px_60px_rgba(0,0,0,0.62)]"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="flex items-center justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-white/45 bg-gradient-to-br from-red-50/70 via-red-100/45 to-red-300/30 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div
                  className="absolute inset-2 rounded-full border border-white/30"
                  aria-hidden="true"
                />

                <div
                  className="absolute inset-5 rounded-full bg-white/[0.15]"
                  aria-hidden="true"
                />

                <TeamCrest
                  team="red"
                  className="relative z-10 flex h-full w-full items-center justify-center"
                  imageClassName="h-[112px] w-[112px] object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-[#04111e]/90 backdrop-blur">
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
  );
}