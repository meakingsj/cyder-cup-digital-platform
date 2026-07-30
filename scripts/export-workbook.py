#!/usr/bin/env python3
"""Export Cyder Cup website feed sheets from XLSX to JSON using Python stdlib only."""
from __future__ import annotations

import argparse
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main", "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
REL_NS = {"p": "http://schemas.openxmlformats.org/package/2006/relationships"}
CELL_RE = re.compile(r"([A-Z]+)(\d+)")


def col_number(cell_ref: str) -> int:
    letters = CELL_RE.match(cell_ref).group(1)
    value = 0
    for char in letters:
        value = value * 26 + ord(char) - 64
    return value - 1


def shared_strings(zf: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    except KeyError:
        return []
    values = []
    for item in root.findall("m:si", NS):
        values.append("".join(node.text or "" for node in item.iterfind(".//m:t", NS)))
    return values


def sheet_targets(zf: zipfile.ZipFile) -> dict[str, str]:
    workbook = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    relationships = {rel.attrib["Id"]: rel.attrib["Target"] for rel in rels.findall("p:Relationship", REL_NS)}
    result = {}
    for sheet in workbook.find("m:sheets", NS):
        name = sheet.attrib["name"]
        rel_id = sheet.attrib[f"{{{NS['r']}}}id"]
        target = relationships[rel_id].lstrip("/")
        if not target.startswith("xl/"):
            target = "xl/" + target
        result[name] = target
    return result


def cell_value(cell: ET.Element, strings: list[str]):
    cell_type = cell.attrib.get("t")
    value = cell.find("m:v", NS)
    if cell_type == "inlineStr":
        return "".join(node.text or "" for node in cell.iterfind(".//m:t", NS))
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


def sheet_rows(zf: zipfile.ZipFile, target: str, strings: list[str]) -> list[list]:
    root = ET.fromstring(zf.read(target))
    rows = []
    for row in root.findall(".//m:sheetData/m:row", NS):
        values = {}
        max_col = -1
        for cell in row.findall("m:c", NS):
            index = col_number(cell.attrib["r"])
            values[index] = cell_value(cell, strings)
            max_col = max(max_col, index)
        rows.append([values.get(i) for i in range(max_col + 1)] if max_col >= 0 else [])
    return rows


def slug(name: str) -> str:
    return {
        "Feed - Players": "players",
        "Feed - Tournaments": "tournaments",
        "Feed - Records": "records",
        "Feed - Matches": "matches",
        "Feed - Site Config": "site-config",
    }[name]


def normalize(rows: list[list], sheet_name: str):
    if not rows:
        return []
    headers = [str(value).strip() if value is not None else "" for value in rows[0]]
    output = []
    for row in rows[1:]:
        item = {header: (row[i] if i < len(row) else None) for i, header in enumerate(headers) if header}
        if not item or not any(value not in (None, "") for value in item.values()):
            continue
        if sheet_name == "Feed - Records" and not item.get("record_id"):
            continue
        output.append(item)
    if sheet_name == "Feed - Site Config":
        return {str(item["config_key"]): item.get("config_value") for item in output if item.get("config_key")}
    return output


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", nargs="?", default="data/Cyder Cup Master Databook.xlsx")
    parser.add_argument("--out", default="src/data/generated")
    args = parser.parse_args()
    workbook = Path(args.workbook)
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    feeds = ["Feed - Players", "Feed - Tournaments", "Feed - Records", "Feed - Matches", "Feed - Site Config"]
    with zipfile.ZipFile(workbook) as zf:
        strings = shared_strings(zf)
        targets = sheet_targets(zf)
        for feed in feeds:
            data = normalize(sheet_rows(zf, targets[feed], strings), feed)
            destination = out_dir / f"{slug(feed)}.json"
            destination.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            count = len(data) if isinstance(data, list) else len(data.keys())
            print(f"Exported {count:>2} rows → {destination}")

if __name__ == "__main__":
    main()
