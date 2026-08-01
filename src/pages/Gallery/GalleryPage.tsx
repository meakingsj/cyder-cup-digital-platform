import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PageIntro from "../../components/common/PageIntro";

import {
  getMediaAltText,
  getMediaObjectPosition,
  pageMedia,
  type PageMediaItem,
} from "../../data/pageMedia";

function getUniqueGalleryPhotos(): PageMediaItem[] {
  const uniquePhotos =
    new Map<string, PageMediaItem>();

  pageMedia.forEach((item) => {
    if (
      item.active === false ||
      !item.file_path
    ) {
      return;
    }

    const key =
      item.file_path
        .trim()
        .toLowerCase();

    const existing =
      uniquePhotos.get(key);

    if (!existing) {
      uniquePhotos.set(
        key,
        item,
      );

      return;
    }

    const existingOrder =
      existing.display_order ??
      Number.MAX_SAFE_INTEGER;

    const nextOrder =
      item.display_order ??
      Number.MAX_SAFE_INTEGER;

    if (nextOrder < existingOrder) {
      uniquePhotos.set(
        key,
        item,
      );
    }
  });

  return Array.from(
    uniquePhotos.values(),
  ).sort((a, b) => {
    const yearDifference =
      (b.year ?? 0) -
      (a.year ?? 0);

    if (yearDifference !== 0) {
      return yearDifference;
    }

    const sequenceDifference =
      (a.sequence ??
        Number.MAX_SAFE_INTEGER) -
      (b.sequence ??
        Number.MAX_SAFE_INTEGER);

    if (sequenceDifference !== 0) {
      return sequenceDifference;
    }

    return a.file_name.localeCompare(
      b.file_name,
    );
  });
}

export default function GalleryPage() {
  const allPhotos = useMemo(
    () =>
      getUniqueGalleryPhotos(),
    [],
  );

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          allPhotos
            .map(
              (photo) =>
                photo.year,
            )
            .filter(
              (
                year,
              ): year is number =>
                typeof year ===
                "number",
            ),
        ),
      ).sort(
        (a, b) => b - a,
      ),
    [allPhotos],
  );

  const [
    selectedYear,
    setSelectedYear,
  ] = useState<number | "all">(
    "all",
  );

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState<
    number | null
  >(null);

  const visiblePhotos =
    useMemo(
      () =>
        selectedYear === "all"
          ? allPhotos
          : allPhotos.filter(
              (photo) =>
                photo.year ===
                selectedYear,
            ),
      [
        allPhotos,
        selectedYear,
      ],
    );

  const selectedPhoto =
    selectedIndex !== null
      ? visiblePhotos[
          selectedIndex
        ]
      : undefined;

  useEffect(() => {
    setSelectedIndex(null);
  }, [selectedYear]);

  useEffect(() => {
    if (
      selectedIndex === null
    ) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key ===
        "Escape"
      ) {
        setSelectedIndex(
          null,
        );

        return;
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        setSelectedIndex(
          (current) => {
            if (
              current === null
            ) {
              return 0;
            }

            return (
              (current + 1) %
              visiblePhotos.length
            );
          },
        );

        return;
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        setSelectedIndex(
          (current) => {
            if (
              current === null
            ) {
              return 0;
            }

            return (
              current -
                1 +
                visiblePhotos.length
            ) %
              visiblePhotos.length;
          },
        );
      }
    }

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    selectedIndex,
    visiblePhotos.length,
  ]);

  function showPrevious() {
    setSelectedIndex(
      (current) => {
        if (
          current === null
        ) {
          return 0;
        }

        return (
          current -
            1 +
            visiblePhotos.length
        ) %
          visiblePhotos.length;
      },
    );
  }

  function showNext() {
    setSelectedIndex(
      (current) => {
        if (
          current === null
        ) {
          return 0;
        }

        return (
          (current + 1) %
          visiblePhotos.length
        );
      },
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="The Archive"
        title="Cyder Cup Gallery"
        description="The golf, celebrations, questionable decisions and moments that have shaped the Cyder Cup since 2019."
      />

      <main className="min-h-screen bg-[#061626] text-white">
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-300">
                Tournament photography
              </p>

              <h2 className="mt-5 max-w-3xl font-serif text-5xl leading-none sm:text-6xl">
                Every year.
                <br />
                Every team.
                <br />
                Almost every memory.
              </h2>
            </div>

            <div className="max-w-md">
              <p className="text-base leading-7 text-slate-300">
                Browse the full photo
                archive by tournament
                year. Select any image
                to open the full-screen
                gallery.
              </p>

              <p className="mt-4 text-sm text-slate-400">
                {allPhotos.length}{" "}
                photographs across{" "}
                {years.length} completed
                editions.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <YearButton
              label="All years"
              active={
                selectedYear === "all"
              }
              onClick={() =>
                setSelectedYear(
                  "all",
                )
              }
            />

            {years.map((year) => (
              <YearButton
                key={year}
                label={year.toString()}
                active={
                  selectedYear ===
                  year
                }
                onClick={() =>
                  setSelectedYear(
                    year,
                  )
                }
              />
            ))}
          </div>

          <div className="mt-12">
            {selectedYear ===
            "all" ? (
              <AllYearsGallery
                years={years}
                photos={allPhotos}
                onOpen={(
                  photo,
                ) => {
                  const index =
                    visiblePhotos.findIndex(
                      (candidate) =>
                        candidate.file_path ===
                        photo.file_path,
                    );

                  setSelectedIndex(
                    index >= 0
                      ? index
                      : null,
                  );
                }}
              />
            ) : (
              <PhotoGrid
                photos={
                  visiblePhotos
                }
                onOpen={(
                  index,
                ) =>
                  setSelectedIndex(
                    index,
                  )
                }
              />
            )}
          </div>
        </section>
      </main>

      {selectedPhoto &&
        selectedIndex !==
          null && (
          <Lightbox
            photo={
              selectedPhoto
            }
            index={
              selectedIndex
            }
            total={
              visiblePhotos.length
            }
            onClose={() =>
              setSelectedIndex(
                null,
              )
            }
            onPrevious={
              showPrevious
            }
            onNext={
              showNext
            }
          />
        )}
    </>
  );
}

function AllYearsGallery({
  years,
  photos,
  onOpen,
}: {
  years: number[];
  photos: PageMediaItem[];
  onOpen: (
    photo: PageMediaItem,
  ) => void;
}) {
  return (
    <div className="space-y-24">
      {years.map((year) => {
        const yearPhotos =
          photos.filter(
            (photo) =>
              photo.year === year,
          );

        if (
          yearPhotos.length ===
          0
        ) {
          return null;
        }

        return (
          <section key={year}>
            <div className="flex items-end justify-between gap-5 border-b border-white/10 pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-amber-300">
                  Cyder Cup
                </p>

                <h3 className="mt-2 font-serif text-5xl">
                  {year}
                </h3>
              </div>

              <p className="text-sm text-slate-400">
                {
                  yearPhotos.length
                }{" "}
                photos
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {yearPhotos.map(
                (
                  photo,
                  index,
                ) => (
                  <GalleryTile
                    key={`${photo.file_path}-${index}`}
                    photo={
                      photo
                    }
                    onClick={() =>
                      onOpen(
                        photo,
                      )
                    }
                  />
                ),
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PhotoGrid({
  photos,
  onOpen,
}: {
  photos: PageMediaItem[];
  onOpen: (
    index: number,
  ) => void;
}) {
  if (
    photos.length === 0
  ) {
    return (
      <p className="border border-white/10 bg-[#071827] p-8 text-slate-300">
        No active photographs are
        assigned to this year.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map(
        (
          photo,
          index,
        ) => (
          <GalleryTile
            key={`${photo.file_path}-${index}`}
            photo={photo}
            onClick={() =>
              onOpen(index)
            }
          />
        ),
      )}
    </div>
  );
}

function GalleryTile({
  photo,
  onClick,
}: {
  photo: PageMediaItem;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#071827] text-left transition duration-300 hover:-translate-y-1 hover:border-amber-300/35 hover:shadow-[0_22px_55px_rgba(0,0,0,0.32)]"
      aria-label={`Open ${getMediaAltText(
        photo,
      )}`}
    >
      <img
        src={photo.file_path}
        alt={getMediaAltText(
          photo,
        )}
        style={{
          objectPosition:
            getMediaObjectPosition(
              photo,
            ),
        }}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />

      <span className="pointer-events-none absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/25 bg-black/35 text-xl text-white opacity-0 backdrop-blur-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        +
      </span>
    </button>
  );
}

function YearButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "min-h-11 border px-5",
        "text-xs font-bold uppercase",
        "tracking-[0.18em]",
        "transition duration-200",
        active
          ? [
              "border-amber-300",
              "bg-amber-300",
              "text-[#061626]",
            ].join(" ")
          : [
              "border-white/10",
              "bg-white/[0.03]",
              "text-slate-300",
              "hover:border-white/25",
              "hover:text-white",
            ].join(" "),
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function Lightbox({
  photo,
  index,
  total,
  onClose,
  onPrevious,
  onNext,
}: {
  photo: PageMediaItem;
  index: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#02070d]/95 px-4 py-5 backdrop-blur-md sm:px-8"
      role="dialog"
      aria-modal="true"
      aria-label="Cyder Cup photograph"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/35 text-2xl text-white transition hover:border-amber-300 hover:text-amber-300 sm:right-8 sm:top-8"
        aria-label="Close gallery"
      >
        ×
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(
              event,
            ) => {
              event.stopPropagation();
              onPrevious();
            }}
            className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-3xl text-white transition hover:border-amber-300 hover:text-amber-300 sm:left-8 sm:h-14 sm:w-14"
            aria-label="Previous photograph"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(
              event,
            ) => {
              event.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-3xl text-white transition hover:border-amber-300 hover:text-amber-300 sm:right-8 sm:h-14 sm:w-14"
            aria-label="Next photograph"
          >
            ›
          </button>
        </>
      )}

      <div
        className="relative flex h-full w-full max-w-[1500px] flex-col items-center justify-center"
        onClick={(
          event,
        ) =>
          event.stopPropagation()
        }
      >
        <img
          src={photo.file_path}
          alt={getMediaAltText(
            photo,
          )}
          className="max-h-[calc(100vh-9rem)] max-w-full object-contain shadow-[0_30px_100px_rgba(0,0,0,0.65)]"
        />

        <div className="mt-5 flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">
          {photo.year && (
            <>
              <span>
                Cyder Cup{" "}
                {photo.year}
              </span>

              <span className="h-1 w-1 rounded-full bg-amber-300" />
            </>
          )}

          <span>
            {index + 1} of{" "}
            {total}
          </span>
        </div>
      </div>
    </div>
  );
}