import { NavLink } from "react-router-dom";

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
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/60">
                <span className="font-serif font-bold text-amber-300">CC</span>
              </div>

              <div>
                <p className="font-serif text-lg font-semibold text-white">
                  Cyder Cup
                </p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">
                  Golf · Competition · Tradition
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-lg text-sm leading-6 text-slate-400">
              The official digital home of the Cyder Cup, documenting its
              players, matches, records, venues and history since 2019.
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

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Cyder Cup.</p>
          <p>Team Navy versus Team Red.</p>
        </div>
      </div>
    </footer>
  );
}