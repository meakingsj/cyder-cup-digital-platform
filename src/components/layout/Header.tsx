import { useState } from "react";
import { NavLink } from "react-router-dom";
import BrandLogo from "../common/BrandLogo";

const navigationItems = [
  { label: "Home", path: "/" },
  { label: "Live", path: "/live" },
  { label: "History", path: "/history" },
  { label: "Players", path: "/players" },
  { label: "Records", path: "/records" },
  { label: "About", path: "/about" },
];

interface NavigationLinkProps {
  label: string;
  path: string;
  onClick?: () => void;
}

function NavigationLink({
  label,
  path,
  onClick,
}: NavigationLinkProps) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      end={path === "/"}
      className={({ isActive }) =>
        [
          "group relative py-2 text-xs font-semibold uppercase",
          "tracking-[0.2em] transition-colors duration-200",
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
              "absolute inset-x-0 -bottom-1 h-px origin-left",
              "bg-amber-300 transition-transform duration-200",
              isActive
                ? "scale-x-100"
                : "scale-x-0 group-hover:scale-x-100",
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#061626]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <NavLink
          to="/"
          className="flex items-center gap-3"
          aria-label="Cyder Cup home"
          onClick={() => setIsMenuOpen(false)}
        >
          <BrandLogo
            priority
            className="flex h-14 w-16 items-center justify-center"
            imageClassName="max-h-full max-w-full object-contain"
          />

          <div className="hidden border-l border-white/15 pl-4 sm:block">
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
          className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/15 text-white transition hover:border-amber-300/60 hover:text-amber-300 lg:hidden"
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
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