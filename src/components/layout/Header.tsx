import { useState } from "react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Live", path: "/live" },
  { label: "History", path: "/history" },
  { label: "Players", path: "/players" },
  { label: "Records", path: "/records" },
  { label: "About", path: "/about" },
];

function NavigationLink({
  label,
  path,
  onClick,
}: {
  label: string;
  path: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      end={path === "/"}
      className={({ isActive }) =>
        [
          "relative py-2 text-xs font-semibold uppercase tracking-[0.2em]",
          "transition-colors duration-200",
          isActive
            ? "text-amber-300"
            : "text-slate-300 hover:text-white",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span
            className={[
              "absolute inset-x-0 -bottom-1 h-px bg-amber-300",
              "origin-left transition-transform duration-200",
              isActive ? "scale-x-100" : "scale-x-0",
            ].join(" ")}
          />
        </>
      )}
    </NavLink>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061626]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <NavLink
          to="/"
          className="flex items-center gap-3"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/70 bg-white/5">
            <span className="font-serif text-lg font-bold tracking-tight text-amber-300">
              CC
            </span>
          </div>

          <div>
            <p className="font-serif text-lg font-semibold tracking-wide text-white">
              Cyder Cup
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-slate-400">
              Established 2019
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-8 lg:flex">
          {navigationItems.map((item) => (
            <NavigationLink
              key={item.path}
              label={item.label}
              path={item.path}
            />
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 text-white lg:hidden"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
        >
          {isMenuOpen ? (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-white/10 bg-[#061626] px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {navigationItems.map((item) => (
              <NavigationLink
                key={item.path}
                label={item.label}
                path={item.path}
                onClick={() => setIsMenuOpen(false)}
              />
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}