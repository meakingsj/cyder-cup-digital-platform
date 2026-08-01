import { Link } from "react-router-dom";

import cyderCupLogo from "../../assets/logos/cyder-cup-logo.png";

import TeamCrest from "../common/TeamCrest";

export default function HeroSection() {
  return (
    <section className="home-hero relative isolate overflow-hidden bg-[#020b13]">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_48%,rgba(119,28,40,0.44),transparent_38%),radial-gradient(circle_at_82%_48%,rgba(18,61,101,0.54),transparent_38%),linear-gradient(90deg,#250b12_0%,#03101b_38%,#03101b_62%,#05192a_100%)]"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(225,190,105,0.20),transparent_26%),linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.18)_55%,#020b13_100%)]"
        aria-hidden="true"
      />

      <div
        className="absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-red-400/[0.08] blur-[110px]"
        aria-hidden="true"
      />

      <div
        className="absolute -right-40 top-1/3 h-[520px] w-[520px] rounded-full bg-blue-400/[0.08] blur-[110px]"
        aria-hidden="true"
      />

      <div
        className="home-grain absolute inset-0 opacity-[0.16]"
        aria-hidden="true"
      />

      <div
        className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#d7b15c]/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1560px] flex-col px-5 pb-10 pt-12 sm:px-8 lg:px-12 lg:pb-14">
        <div className="flex items-center justify-center gap-4 text-[11px] font-bold uppercase tracking-[0.34em] text-[#efd38d] sm:text-xs">
          <span className="h-px w-12 bg-[#d7b15c]/70" />

          The 2026 Cyder Cup

          <span className="h-px w-12 bg-[#d7b15c]/70" />
        </div>

        <div className="grid flex-1 items-center gap-7 py-7 lg:grid-cols-[1fr_minmax(500px,700px)_1fr] lg:gap-4">
          <div className="order-2 flex items-center justify-center gap-5 lg:order-1 lg:-translate-x-5 lg:flex-col lg:gap-6">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-slate-200 lg:text-sm">
              Team Red
            </p>

            <TeamCrest
              team="red"
              className="flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40 lg:h-48 lg:w-48"
              imageClassName="max-h-full max-w-full object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,.55)] transition duration-500 hover:scale-[1.025]"
            />

            <span className="hidden h-14 w-px bg-gradient-to-b from-[#d7b15c]/55 to-transparent lg:block" />
          </div>

          <div className="order-1 flex flex-col items-center text-center lg:order-2">
            <div className="relative">
              <div
                className="absolute inset-10 rounded-full bg-[#d7b15c]/20 blur-[70px]"
                aria-hidden="true"
              />

              <div
                className="absolute inset-20 rounded-full bg-white/[0.05] blur-3xl"
                aria-hidden="true"
              />

              <img
                src={cyderCupLogo}
                alt="2026 Cyder Cup shield"
                className="home-shield relative z-10 mx-auto h-auto w-[315px] object-contain drop-shadow-[0_42px_58px_rgba(0,0,0,.78)] sm:w-[420px] lg:w-[520px]"
                loading="eager"
                decoding="async"
              />
            </div>

            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.42em] text-[#efd38d]">
              Established 2019
            </p>

            <h1 className="mt-5 font-serif text-[2.75rem] font-medium leading-none tracking-[-0.04em] text-white sm:text-[3.5rem] lg:text-[4.15rem]">
              Competition. Tradition.{" "}
              <span className="text-[#f0c96b]">
                Cyder Cup.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              Eight weekend golfers. Two colours. One Cup.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/live"
                className="home-button-primary min-w-52"
              >
                Enter the 2026 Cup
              </Link>

              <Link
                to="/history"
                className="home-button-secondary min-w-52"
              >
                Explore History
              </Link>
            </div>
          </div>

          <div className="order-3 flex items-center justify-center gap-5 lg:translate-x-5 lg:flex-col lg:gap-6">
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-slate-200 lg:text-sm">
              Team Navy
            </p>

            <TeamCrest
              team="navy"
              className="flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40 lg:h-48 lg:w-48"
              imageClassName="max-h-full max-w-full object-contain drop-shadow-[0_24px_36px_rgba(0,0,0,.55)] transition duration-500 hover:scale-[1.025]"
            />

            <span className="hidden h-14 w-px bg-gradient-to-b from-[#d7b15c]/55 to-transparent lg:block" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          <span className="h-px w-16 bg-white/20" />

          Scroll to enter

          <span className="h-px w-16 bg-white/20" />
        </div>
      </div>
    </section>
  );
}