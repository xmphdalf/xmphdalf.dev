import type { ArrayField } from "payload";

type RowLabelComponent = NonNullable<NonNullable<ArrayField["admin"]>["components"]>["RowLabel"];

/** Collapsed array rows show these sibling values instead of "Item 01". */
export const rowLabel = (fields: string[], fallback: string): RowLabelComponent => ({
  path: "/components/admin/RowLabel#RowLabel",
  clientProps: { fields, fallback },
});
