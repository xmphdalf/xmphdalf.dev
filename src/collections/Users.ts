import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: false,
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
