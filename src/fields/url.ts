import type { TextField } from "payload";

const isHttpUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

type UrlFieldArgs = {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
};

export const urlField = ({ name, label, description, required = false }: UrlFieldArgs): TextField => ({
  name,
  label,
  required,
  type: "text",
  admin: {
    placeholder: "https://",
    ...(description ? { description } : {}),
  },
  validate: (value: string | null | undefined) => {
    if (!value) return required ? "This field is required." : true;
    return isHttpUrl(value) || "Enter a full URL starting with http:// or https://";
  },
});
