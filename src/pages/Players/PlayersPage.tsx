import ContentCard from "../../components/common/ContentCard";
import PageIntro from "../../components/common/PageIntro";
import SectionHeading from "../../components/common/SectionHeading";
import TeamPanel from "../../components/common/TeamPanel";

export default function PlayersPage() {
  return (
    <>
      <PageIntro
        eyebrow="The Competitors"
        title="Player Directory"
        description="Career profiles, team history, match records, points earned and individual Cyder Cup achievements."
      />

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Current Players"
          title="Eight players. Two teams."
          description="The official player photographs, biographies and career records will populate this directory."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <TeamPanel
            team="navy"
            title="Team Navy Roster"
            description="Player profiles and career records will appear beneath the Team Navy identity."
          />

          <TeamPanel
            team="red"
            title="Team Red Roster"
            description="Player profiles and career records will appear beneath the Team Red identity."
          />
        </div>

        <ContentCard className="mt-10 px-6 py-16 text-center">
          <p className="font-serif text-3xl text-white">
            Player data integration is next.
          </p>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
            The uploaded biographies, photographs and historical records will
            be connected to reusable player profile cards.
          </p>
        </ContentCard>
      </section>
    </>
  );
}