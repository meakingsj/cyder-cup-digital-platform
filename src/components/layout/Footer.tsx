import { NavLink } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";
import TeamCrest from "../common/TeamCrest";

const footerLinks = [
  { label: "Live", path: "/live" },
  { label: "History", path: "/history" },
  { label: "Players", path: "/players" },
  { label: "Records", path: "/records" },
  { label: "About", path: "/about" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#04111e]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="flex items-center gap-4">
              <BrandLogo
                className="flex h-16 w-20 items-center justify-center"
                imageClassName="max-h-full max-w-full object-contain"
              />

              <div className="border-l border-white/15 pl-4">
                <p className="font-serif text-xl font-semibold text-white">
                  Cyder Cup
                </p>

                <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Golf · Competition · Tradition
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-lg text-sm leading-6 text-slate-400">
              The official digital home of the Cyder Cup, documenting
              its players, matches, records, venues and history since
              2019.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 transition-colors hover:text-white"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-10 grid gap-6 border-t border-white/10 pt-7 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="flex items-center gap-3 sm:justify-self-start">
            <TeamCrest
              team="navy"
              className="flex h-10 w-10 items-center justify-center"
              imageClassName="max-h-full max-w-full object-contain"
            />

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Team Navy
            </p>
          </div>

          <p className="text-center font-serif text-sm italic text-amber-300/80">
            The rivalry continues
          </p>

          <div className="flex items-center gap-3 sm:justify-self-end">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Team Red
            </p>

            <TeamCrest
              team="red"
              className="flex h-10 w-10 items-center justify-center"
              imageClassName="max-h-full max-w-full object-contain"
            />
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Cyder Cup.</p>
          <p>Established 2019.</p>
        </div>
      </div>
    </footer>
  );
}