import PageIntro from "../../components/common/PageIntro";

export default function PlayersPage() {
  return (
    <>
      <PageIntro
        eyebrow="The Competitors"
        title="Player Directory"
        description="Career profiles, team history, match records, points earned and individual Cyder Cup achievements."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="rounded-sm border border-dashed border-white/15 px-6 py-16 text-center">
          <p className="font-serif text-2xl text-white">
            Player profiles will be connected to the official roster data.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            The uploaded player photographs, biographies and historical records
            will populate this page in the data package.
          </p>
        </div>
      </section>
    </>
  );
}