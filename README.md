# Cyder Cup Digital Platform

React, Vite, TypeScript and Tailwind website for the Cyder Cup.

## Local development

```bash
npm install
npm run dev
```

## Refresh website data from the master databook

The workbook is stored at:

```text
data/Cyder Cup Master Databook.xlsx
```

After saving workbook changes, run:

```bash
npm run build-data
```

This regenerates the JSON feeds in `src/data/generated`. A production build runs the data export automatically:

```bash
npm run build
```

The export script uses the Python standard library and requires Python 3 to be available as `python` on Windows or `python3` on macOS/Linux. If Windows does not recognize `python`, replace `python` with `py` in the `build-data` script in `package.json`.

## Included editorial and media assets

- Labeled player profile photographs are stored in `public/player-profiles` and are linked by the workbook `photo_key` field.
- Original prior-year written recaps are stored as generated website content in `src/data/generated/history.json`.
- Selected, web-optimized historical gallery photographs are stored in `public/history/<year>`.
- Predator Ridge course photographs are stored in `public/course`.

The History page currently includes the completed 2019, 2020, 2021, 2022 and 2025 tournaments. The original recap wording is preserved from the source documents.
