import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { isIri } from "@hyperjump/uri";

// The section below creates database tables.
const schema = a.schema({
  ontologyModule: a
    .model({
      iri: a.string(),

      // Description
      // This is a Dublin Core description of the ontology module.
      // It is a multilingual object with the language keys and HTML content,
      // for example:
      // {
      //   en: "<p>Hello</p>",
      //   de: "<p>Hallo</p>",
      //   fr: "<p>Bonjour</p>"
      // }
      description: a.json(),
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
