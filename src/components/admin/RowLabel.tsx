"use client";

import { useRowLabel } from "@payloadcms/ui";

type RowLabelProps = {
  /** Sibling field names joined to build the label, e.g. ["role", "company"]. */
  fields: string[];
  /** Shown when none of the fields have a value yet. */
  fallback: string;
  separator?: string;
};

export function RowLabel({ fields, fallback, separator = " · " }: RowLabelProps) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>();

  const parts = fields
    .map((name) => data?.[name])
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  const number = String((rowNumber ?? 0) + 1).padStart(2, "0");

  return <span>{parts.length > 0 ? parts.join(separator) : `${fallback} ${number}`}</span>;
}
