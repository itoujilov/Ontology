import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// The section below creates database tables. The authorization rule below
// specifies that any user authenticated via an API key can "create", "read",
// "update", and "delete" any records.
const schema = a.schema({
  ontology_module: a
    .model({
      id: a.url(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
