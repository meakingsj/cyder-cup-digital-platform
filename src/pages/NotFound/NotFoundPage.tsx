import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-5 py-20 text-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300">
          Error 404
        </p>

        <h1 className="mt-5 font-serif text-6xl font-semibold text-white">
          Out of bounds.
        </h1>

        <p className="mx-auto mt-5 max-w-md leading-7 text-slate-400">
          The page you requested does not exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-sm bg-amber-300 px-7 text-xs font-bold uppercase tracking-[0.18em] text-[#061626]"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}