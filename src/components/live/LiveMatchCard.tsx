import LiveEveningEventCard from "./LiveEveningEventCard";
import LiveGolfMatchCard from "./LiveGolfMatchCard";
import LiveScrambleCard from "./LiveScrambleCard";

import type { LiveMatch } from "../../data/live";

interface LiveMatchCardProps {
  match: LiveMatch;
}

export default function LiveMatchCard({
  match,
}: LiveMatchCardProps) {
  if (
    match.sessionId ===
    "scramble"
  ) {
    return (
      <LiveScrambleCard
        match={match}
      />
    );
  }

  if (
    match.sessionId ===
    "evening-events"
  ) {
    return (
      <LiveEveningEventCard
        match={match}
      />
    );
  }

  return (
    <LiveGolfMatchCard
      match={match}
    />
  );
}