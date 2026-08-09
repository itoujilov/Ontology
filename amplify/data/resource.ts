import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { isIri } from "@hyperjump/uri";

// The section below creates database tables.
const schema = a.schema({
  ontologyModule: a
    .model({
      iri: a.url(),
    })
    .authorization(allow => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    // This tells the data client in the app (generateClient())
    // to sign API requests with the user authentication token. 
    defaultAuthorizationMode: 'userPool',
  },
});
