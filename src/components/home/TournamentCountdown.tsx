import {
  useEffect,
  useMemo,
  useState,
} from "react";

interface TournamentCountdownProps {
  targetDate: number | string;
  tournamentYear: number;
  venue: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  hasStarted: boolean;
}

const MILLISECONDS_PER_DAY =
  24 * 60 * 60 * 1000;

function parseTournamentDate(
  value: number | string,
): Date | undefined {
  if (typeof value === "number") {
    const excelEpoch = Date.UTC(
      1899,
      11,
      30,
    );

    const parsedDate = new Date(
      excelEpoch +
        value *
          MILLISECONDS_PER_DAY,
    );

    return Number.isNaN(
      parsedDate.getTime(),
    )
      ? undefined
      : parsedDate;
  }

  const trimmedValue =
    value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  const parsedDate =
    new Date(trimmedValue);

  return Number.isNaN(
    parsedDate.getTime(),
  )
    ? undefined
    : parsedDate;
}

function calculateTimeRemaining(
  targetDate: Date,
): TimeRemaining {
  const difference =
    targetDate.getTime() -
    Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      hasStarted: true,
    };
  }

  const days = Math.floor(
    difference /
      MILLISECONDS_PER_DAY,
  );

  const hours = Math.floor(
    (difference /
      (60 * 60 * 1000)) %
      24,
  );

  const minutes = Math.floor(
    (difference /
      (60 * 1000)) %
      60,
  );

  const seconds = Math.floor(
    (difference / 1000) %
      60,
  );

  return {
    days,
    hours,
    minutes,
    seconds,
    hasStarted: false,
  };
}

function padValue(
  value: number,
): string {
  return value
    .toString()
    .padStart(2, "0");
}

export default function TournamentCountdown({
  targetDate,
  tournamentYear,
  venue,
}: TournamentCountdownProps) {
  const parsedTargetDate =
    useMemo(
      () =>
        parseTournamentDate(
          targetDate,
        ),
      [targetDate],
    );

  const [
    timeRemaining,
    setTimeRemaining,
  ] = useState<TimeRemaining>(() =>
    parsedTargetDate
      ? calculateTimeRemaining(
          parsedTargetDate,
        )
      : {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          hasStarted: false,
        },
  );

  useEffect(() => {
    if (!parsedTargetDate) {
      return;
    }

    const updateCountdown =
      () => {
        setTimeRemaining(
          calculateTimeRemaining(
            parsedTargetDate,
          ),
        );
      };

    updateCountdown();

    const intervalId =
      window.setInterval(
        updateCountdown,
        1000,
      );

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [parsedTargetDate]);

  if (!parsedTargetDate) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#e7dfd1] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <div
        className="home-grain absolute inset-0 opacity-[0.14]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-[#9b7425]">
              <span className="h-px w-9 bg-[#a07b2d]/70" />

              The next chapter
            </div>

            <h2 className="mt-5 max-w-xl font-serif text-4xl leading-tight tracking-tight text-[#071827] sm:text-5xl">
              Countdown to Cyder Cup{" "}
              {tournamentYear}.
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-[#46535b]">
              The rivalry resumes at{" "}
              {venue}. Every match,
              point and questionable
              decision will be tracked
              through the live centre.
            </p>
          </div>

          {timeRemaining.hasStarted ? (
            <div className="border-y border-[#071827]/15 py-9 text-center lg:text-right">
              <p className="font-serif text-5xl text-[#071827] sm:text-6xl">
                Tournament underway
              </p>

              <p className="mt-3 text-xs font-bold uppercase tracking-[0.24em] text-[#766544]">
                Follow the live scoreboard
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 overflow-hidden border border-[#071827]/15 bg-[#f7f4ed] shadow-[0_20px_55px_rgba(7,24,39,0.08)] sm:grid-cols-4">
              <CountdownMetric
                label="Days"
                value={
                  timeRemaining.days
                }
              />

              <CountdownMetric
                label="Hours"
                value={padValue(
                  timeRemaining.hours,
                )}
              />

              <CountdownMetric
                label="Minutes"
                value={padValue(
                  timeRemaining.minutes,
                )}
              />

              <CountdownMetric
                label="Seconds"
                value={padValue(
                  timeRemaining.seconds,
                )}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CountdownMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border-b border-r border-[#071827]/15 px-4 py-8 text-center last:border-r-0 sm:py-10">
      <p className="font-serif text-4xl leading-none text-[#071827] sm:text-5xl">
        {value}
      </p>

      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#766544]">
        {label}
      </p>
    </div>
  );
}