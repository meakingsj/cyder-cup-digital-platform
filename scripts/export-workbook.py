#!/usr/bin/env python3
"""
Export Cyder Cup website feed sheets from XLSX to JSON.

Uses Python's standard library only.

Current capabilities:
- Exports all website feed sheets
- Exports historical match data
- Exports awards and media references
- Exports page-specific photography assignments
- Validates required worksheets and headers
- Detects duplicate IDs
- Validates player references
- Standardizes known terminology
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import zipfile
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET


NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}

REL_NS = {
    "p": "http://schemas.openxmlformats.org/package/2006/relationships",
}

CELL_RE = re.compile(r"([A-Z]+)(\d+)")

FEEDS = {
    "Feed - Players": "players",
    "Feed - Tournaments": "tournaments",
    "Feed - Records": "records",
    "Feed - Matches": "matches",
    "Feed - Site Config": "site-config",
    "Feed - Match History": "match-history",
    "Feed - Awards": "awards",
    "Feed - Media": "media",
    "Feed - Page Media": "page-media",
}

REQUIRED_HEADERS = {
    "Feed - Players": {
        "player_id",
        "display_name",
        "team_id",
    },
    "Feed - Tournaments": {
        "tournament_id",
        "year",
        "name",
    },
    "Feed - Records": {
        "record_id",
        "category",
        "title",
    },
    "Feed - Matches": {
        "match_id",
        "tournament_id",
        "format",
        "status",
    },
    "Feed - Site Config": {
        "config_key",
        "config_value",
    },
    "Feed - Match History": {
        "match_id",
        "tournament_id",
        "year",
        "session_id",
        "format",
        "player_id",
        "team_id",
        "result",
        "points_earned",
    },
    "Feed - Awards": {
        "award_id",
        "tournament_id",
        "year",
        "award_title",
    },
    "Feed - Media": {
        "media_id",
        "asset_type",
        "scope_type",
        "scope_id",
    },
    "Feed - Page Media": {
        "media_id",
        "year",
        "file_name",
        "file_path",
        "page_id",
        "section_id",
        "scope_id",
        "display_order",
        "priority",
        "featured",
        "active",
        "object_position",
    },
}

ID_FIELDS = {
    "Feed - Players": "player_id",
    "Feed - Tournaments": "tournament_id",
    "Feed - Records": "record_id",
    "Feed - Matches": "match_id",
    "Feed - Awards": "award_id",
    "Feed - Media": "media_id",
}

PLAYER_REFERENCE_FIELDS = {
    "Feed - Records": ["player_id"],
    "Feed - Matches": [
        "navy_player_1",
        "navy_player_2",
        "red_player_1",
        "red_player_2",
    ],
    "Feed - Match History": [
        "player_id",
        "opponent_1_id",
        "opponent_2_id",
    ],
    "Feed - Awards": ["player_id"],
}


class ExportValidationError(Exception):
    """Raised when workbook data cannot be safely exported."""


def col_number(cell_ref: str) -> int:
    match = CELL_RE.match(cell_ref)

    if not match:
        raise ExportValidationError(
            f"Unable to parse Excel cell reference: {cell_ref}"
        )

    letters = match.group(1)
    value = 0

    for char in letters:
        value = value * 26 + ord(char) - 64

    return value - 1


def shared_strings(zf: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    except KeyError:
        return []

    values: list[str] = []

    for item in root.findall("m:si", NS):
        text = "".join(
            node.text or ""
            for node in item.iterfind(".//m:t", NS)
        )
        values.append(text)

    return values


def sheet_targets(zf: zipfile.ZipFile) -> dict[str, str]:
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))

    relationships = {
        rel.attrib["Id"]: rel.attrib["Target"]
        for rel in rels.findall("p:Relationship", REL_NS)
    }

    result: dict[str, str] = {}

    sheets = workbook.find("m:sheets", NS)

    if sheets is None:
        raise ExportValidationError(
            "Workbook does not contain any worksheets."
        )

    for sheet in sheets:
        name = sheet.attrib["name"]
        rel_id = sheet.attrib[f"{{{NS['r']}}}id"]

        target = relationships[rel_id].lstrip("/")

        if not target.startswith("xl/"):
            target = "xl/" + target

        result[name] = target

    return result


def cell_value(
    cell: ET.Element,
    strings: list[str],
) -> Any:
    cell_type = cell.attrib.get("t")
    value = cell.find("m:v", NS)

    if cell_type == "inlineStr":
        return "".join(
            node.text or ""
            for node in cell.iterfind(".//m:t", NS)
        )

    if value is None or value.text is None:
        return None

    raw = value.text

    if cell_type == "s":
        return strings[int(raw)]

    if cell_type == "b":
        return raw == "1"

    if cell_type in {"str", "e"}:
        return raw

    try:
        number = float(raw)
        return int(number) if number.is_integer() else number
    except ValueError:
        return raw


def sheet_rows(
    zf: zipfile.ZipFile,
    target: str,
    strings: list[str],
) -> list[list[Any]]:
    root = ET.fromstring(zf.read(target))
    rows: list[list[Any]] = []

    for row in root.findall(".//m:sheetData/m:row", NS):
        values: dict[int, Any] = {}
        max_col = -1

        for cell in row.findall("m:c", NS):
            index = col_number(cell.attrib["r"])
            values[index] = cell_value(cell, strings)
            max_col = max(max_col, index)

        if max_col >= 0:
            rows.append(
                [values.get(index) for index in range(max_col + 1)]
            )
        else:
            rows.append([])

    return rows


def clean_string(value: str) -> str:
    """
    Apply project-wide spelling and terminology standards.
    """

    replacements = {
        "Nickolas": "Nicklaus",
        "nickolas": "nicklaus",
        "NICKOLAS": "NICKLAUS",
    }

    cleaned = value

    for original, replacement in replacements.items():
        cleaned = cleaned.replace(original, replacement)

    cleaned = re.sub(
        r"\bversus\b",
        "Vs.",
        cleaned,
        flags=re.IGNORECASE,
    )

    return cleaned.strip()


def clean_value(value: Any) -> Any:
    if isinstance(value, str):
        return clean_string(value)

    return value


def find_header_row(
    rows: list[list[Any]],
    sheet_name: str,
) -> int:
    """
    Locate the actual header row.

    Most feed sheets begin with headers in row 1. Feed - Page Media
    may include a title, instructions and a blank row above its headers.
    """

    required_headers = REQUIRED_HEADERS[sheet_name]

    for row_index, row in enumerate(rows):
        actual_headers = {
            clean_string(str(value))
            for value in row
            if value is not None and str(value).strip()
        }

        if required_headers.issubset(actual_headers):
            return row_index

    expected = ", ".join(sorted(required_headers))

    raise ExportValidationError(
        f"{sheet_name} does not contain a valid header row. "
        f"Expected headers include: {expected}"
    )


def normalize(
    rows: list[list[Any]],
    sheet_name: str,
) -> list[dict[str, Any]] | dict[str, Any]:
    if not rows:
        return []

    header_row_index = find_header_row(
        rows,
        sheet_name,
    )

    headers = [
        clean_string(str(value))
        if value is not None
        else ""
        for value in rows[header_row_index]
    ]

    output: list[dict[str, Any]] = []

    for row in rows[header_row_index + 1 :]:
        item = {
            header: (
                clean_value(row[index])
                if index < len(row)
                else None
            )
            for index, header in enumerate(headers)
            if header
        }

        if sheet_name == "Feed - Page Media":
            for path_field in (
                "file_name",
                "file_path",
            ):
                raw_path = item.get(
                    path_field
                )

                if isinstance(
                    raw_path,
                    str,
                ):
                    item[path_field] = (
                        raw_path
                        .strip()
                        .lower()
                    )
                    
        if not item:
            continue

        if not any(
            value not in (None, "")
            for value in item.values()
        ):
            continue

        if (
            sheet_name == "Feed - Records"
            and not item.get("record_id")
        ):
            continue

        if (
            sheet_name == "Feed - Page Media"
            and not item.get("media_id")
        ):
            continue

        output.append(item)

    if sheet_name == "Feed - Site Config":
        return {
            str(item["config_key"]): item.get("config_value")
            for item in output
            if item.get("config_key")
        }

    return output


def validate_required_sheets(
    targets: dict[str, str],
) -> None:
    missing = [
        sheet_name
        for sheet_name in FEEDS
        if sheet_name not in targets
    ]

    if missing:
        formatted = "\n".join(
            f"  - {sheet_name}"
            for sheet_name in missing
        )

        raise ExportValidationError(
            "Workbook is missing required feed sheets:\n"
            f"{formatted}"
        )


def validate_headers(
    rows: list[list[Any]],
    sheet_name: str,
) -> None:
    if not rows:
        raise ExportValidationError(
            f"{sheet_name} is empty."
        )

    find_header_row(
        rows,
        sheet_name,
    )


def validate_duplicate_ids(
    sheet_name: str,
    data: list[dict[str, Any]],
) -> None:
    id_field = ID_FIELDS.get(sheet_name)

    if not id_field:
        return

    seen: dict[str, int] = {}
    duplicates: list[str] = []

    for row_number, item in enumerate(data, start=2):
        raw_id = item.get(id_field)

        if raw_id in (None, ""):
            continue

        item_id = str(raw_id).strip()

        if item_id in seen:
            duplicates.append(
                f"{item_id} "
                f"(export rows {seen[item_id]} and {row_number})"
            )
        else:
            seen[item_id] = row_number

    if duplicates:
        formatted = "\n".join(
            f"  - {duplicate}"
            for duplicate in duplicates
        )

        raise ExportValidationError(
            f"Duplicate {id_field} values found in "
            f"{sheet_name}:\n{formatted}"
        )


def validate_match_history(
    data: list[dict[str, Any]],
) -> None:
    """
    Validate historical player-match rows.

    Points vary by tournament year and scoring segment:

    - Standard one-point match:
      W = 1, T = 0.5, L = 0

    - Historical two-point singles match:
      W = 2, T = 1, L = 0

    - 2026 segmented singles:
      Front 9: W = 1, T = 0.5, L = 0
      Back 9: W = 1, T = 0.5, L = 0
      Match:   W = 2, T = 1, L = 0

    Because the workbook stores the applicable points directly,
    validation checks that the result and points are compatible
    rather than assuming one universal scoring scale.
    """

    allowed_results = {"W", "L", "T"}
    allowed_points = {0, 0.5, 1, 2}

    valid_points_by_result = {
        "L": {0},
        "T": {0.5, 1},
        "W": {1, 2},
    }

    errors: list[str] = []

    for row_number, item in enumerate(data, start=2):
        match_id = item.get("match_id")
        player_id = item.get("player_id")
        result = item.get("result")
        points = item.get("points_earned")

        if not match_id:
            errors.append(
                f"Row {row_number}: missing match_id."
            )

        if not player_id:
            errors.append(
                f"Row {row_number}: missing player_id."
            )

        if result not in allowed_results:
            errors.append(
                f"Row {row_number}: result must be W, L, or T; "
                f"found {result!r}."
            )
            continue

        if points not in allowed_points:
            errors.append(
                f"Row {row_number}: points_earned must be "
                f"0, 0.5, 1, or 2; found {points!r}."
            )
            continue

        valid_points = valid_points_by_result[result]

        if points not in valid_points:
            valid_values = ", ".join(
                str(value)
                for value in sorted(valid_points)
            )

            errors.append(
                f"Row {row_number}: result {result} permits "
                f"points of {valid_values}; found {points}."
            )

    if errors:
        preview = errors[:20]

        formatted = "\n".join(
            f"  - {error}"
            for error in preview
        )

        if len(errors) > 20:
            formatted += (
                f"\n  - ...and {len(errors) - 20} more errors"
            )

        raise ExportValidationError(
            "Feed - Match History validation failed:\n"
            f"{formatted}"
        )


def validate_page_media(
    data: list[dict[str, Any]],
) -> None:
    """
    Validate page-media assignments.

    media_id identifies the underlying photograph and may therefore
    appear more than once when the same photo is used in multiple
    website placements.

    A placement is considered unique based on:
    - media_id
    - page_id
    - section_id
    - scope_id
    - display_order
    """

    allowed_pages = {
        "home",
        "history",
        "player-profile",
        "gallery",
        "teams",
        "players",
        "about",
        "live",
        "records",
    }

    errors: list[str] = []

    featured_groups: dict[
        tuple[str, str, str],
        list[str],
    ] = {}

    seen_placements: dict[
        tuple[str, str, str, str, str],
        int,
    ] = {}

    for row_number, item in enumerate(
        data,
        start=2,
    ):
        media_id = str(
            item.get("media_id") or ""
        ).strip()

        page_id = str(
            item.get("page_id") or ""
        ).strip()

        section_id = str(
            item.get("section_id") or ""
        ).strip()

        scope_id = str(
            item.get("scope_id") or ""
        ).strip()

        display_order = str(
            item.get("display_order") or ""
        ).strip()

        file_path = str(
            item.get("file_path") or ""
        ).strip()

        active = item.get("active")
        featured = item.get("featured")

        if not media_id:
            errors.append(
                f"Row {row_number}: missing media_id."
            )

        if not file_path:
            errors.append(
                f"Row {row_number} ({media_id}): "
                "missing file_path."
            )

        if (
            page_id
            and page_id not in allowed_pages
        ):
            errors.append(
                f"Row {row_number} ({media_id}): "
                f"unknown page_id {page_id!r}."
            )

        if section_id and not page_id:
            errors.append(
                f"Row {row_number} ({media_id}): "
                "section_id is set but page_id is blank."
            )

        if scope_id and not page_id:
            errors.append(
                f"Row {row_number} ({media_id}): "
                "scope_id is set but page_id is blank."
            )

        is_active = active is not False
        is_featured = featured is True

        if (
            is_active
            and page_id
            and section_id
        ):
            placement_key = (
                media_id,
                page_id,
                section_id,
                scope_id,
                display_order,
            )

            if placement_key in seen_placements:
                first_row = seen_placements[
                    placement_key
                ]

                errors.append(
                    f"Rows {first_row} and {row_number}: "
                    "duplicate page-media placement for "
                    f"{media_id} at "
                    f"{page_id} / {section_id} / "
                    f"{scope_id or 'no scope'} / "
                    f"display order "
                    f"{display_order or 'blank'}."
                )
            else:
                seen_placements[
                    placement_key
                ] = row_number

        if (
            is_active
            and is_featured
            and page_id
            and section_id
        ):
            featured_group = (
                page_id,
                section_id,
                scope_id,
            )

            featured_groups.setdefault(
                featured_group,
                [],
            ).append(media_id)

    for (
        page_id,
        section_id,
        scope_id,
    ), media_ids in featured_groups.items():
        if len(media_ids) <= 1:
            continue

        errors.append(
            "Multiple active featured images found for "
            f"{page_id} / {section_id} / "
            f"{scope_id or 'no scope'}: "
            f"{', '.join(media_ids)}"
        )

    if errors:
        preview = errors[:20]

        formatted = "\n".join(
            f"  - {error}"
            for error in preview
        )

        if len(errors) > 20:
            formatted += (
                f"\n  - ...and "
                f"{len(errors) - 20} more errors"
            )

        raise ExportValidationError(
            "Feed - Page Media validation failed:\n"
            f"{formatted}"
        )

def validate_player_references(
    exported: dict[str, Any],
) -> None:
    players = exported.get(
        "Feed - Players",
        [],
    )

    if not isinstance(players, list):
        return

    valid_player_ids = {
        str(player["player_id"]).strip()
        for player in players
        if player.get("player_id")
    }

    errors: list[str] = []

    for sheet_name, fields in PLAYER_REFERENCE_FIELDS.items():
        sheet_data = exported.get(
            sheet_name,
            [],
        )

        if not isinstance(
            sheet_data,
            list,
        ):
            continue

        for row_number, item in enumerate(
            sheet_data,
            start=2,
        ):
            for field in fields:
                raw_value = item.get(field)

                if raw_value in (
                    None,
                    "",
                ):
                    continue

                values = [
                    part.strip()
                    for part in str(
                        raw_value
                    ).split("|")
                    if part.strip()
                ]

                for player_id in values:
                    special_ids = {
                        "all-navy",
                        "all-red",
                    }

                    if player_id in special_ids:
                        continue

                    if player_id not in valid_player_ids:
                        errors.append(
                            f"{sheet_name} row {row_number}: "
                            f"{field} references unknown player "
                            f"ID {player_id!r}."
                        )

    if errors:
        preview = errors[:20]

        formatted = "\n".join(
            f"  - {error}"
            for error in preview
        )

        if len(errors) > 20:
            formatted += (
                f"\n  - ...and {len(errors) - 20} more errors"
            )

        raise ExportValidationError(
            "Unknown player references found:\n"
            f"{formatted}"
        )


def remove_inactive_templates(
    sheet_name: str,
    data: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Exclude inactive rows from exported website data.

    The rows remain fully populated in Excel and can be restored by
    changing active from FALSE to TRUE and rebuilding the site.
    """

    if sheet_name not in {
        "Feed - Awards",
        "Feed - Media",
        "Feed - Page Media",
    }:
        return data

    return [
        item
        for item in data
        if item.get("active") is not False
    ]


def export_workbook(
    workbook: Path,
    out_dir: Path,
) -> None:
    if not workbook.exists():
        raise ExportValidationError(
            f"Workbook not found: {workbook}"
        )

    out_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    exported: dict[str, Any] = {}

    with zipfile.ZipFile(workbook) as zf:
        strings = shared_strings(zf)
        targets = sheet_targets(zf)

        validate_required_sheets(
            targets,
        )

        for sheet_name in FEEDS:
            rows = sheet_rows(
                zf,
                targets[sheet_name],
                strings,
            )

            validate_headers(
                rows,
                sheet_name,
            )

            data = normalize(
                rows,
                sheet_name,
            )

            if isinstance(data, list):
                validate_duplicate_ids(
                    sheet_name,
                    data,
                )

                if sheet_name == "Feed - Match History":
                    validate_match_history(
                        data,
                    )

                if sheet_name == "Feed - Page Media":
                    validate_page_media(
                        data,
                    )

                data = remove_inactive_templates(
                    sheet_name,
                    data,
                )

            exported[sheet_name] = data

        validate_player_references(
            exported,
        )

        for sheet_name, output_slug in FEEDS.items():
            data = exported[sheet_name]

            destination = (
                out_dir
                / f"{output_slug}.json"
            )

            destination.write_text(
                json.dumps(
                    data,
                    indent=2,
                    ensure_ascii=False,
                )
                + "\n",
                encoding="utf-8",
            )

            count = (
                len(data)
                if isinstance(data, list)
                else len(data.keys())
            )

            print(
                f"Exported {count:>3} rows "
                f"→ {destination}"
            )


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Export Cyder Cup workbook feeds to JSON."
        )
    )

    parser.add_argument(
        "workbook",
        nargs="?",
        default=(
            "data/Cyder Cup Master Databook.xlsx"
        ),
    )

    parser.add_argument(
        "--out",
        default="src/data/generated",
    )

    args = parser.parse_args()

    try:
        export_workbook(
            Path(args.workbook),
            Path(args.out),
        )
    except (
        ExportValidationError,
        KeyError,
        zipfile.BadZipFile,
    ) as error:
        print()
        print(
            "CYDER CUP DATA EXPORT FAILED"
        )
        print("=" * 32)
        print(error)
        print()
        sys.exit(1)


if __name__ == "__main__":
    main()