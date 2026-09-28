"use client";

import { generateClient } from "aws-amplify/data";
import outputs from "@/amplify_outputs.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { MultilingualEditor } from "./MultilingualEditor";
import { OntologyModuleCreator } from "./OntologyModuleCreator";

import type { Schema } from "@/amplify/data/resource";
import type { SupportedLanguage } from "./LanguageSelector";

import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();
const languages: SupportedLanguage[] = ["en", "de", "fr"];

export default function App() {
  const { user, signOut } = useAuthenticator();

  const [ ontologyModules, setOntologyModules ] =
    useState<Array<Schema["ontologyModule"]["type"]>>([]);

  const [ ontologyModulesSynced, setOntologyModulesSynced ] =
    useState<boolean>(false);

  useEffect(() => {
    client.models.ontologyModule
      .list()
      .then(({ data }) => {
              setOntologyModules(data);
              setOntologyModulesSynced(true);
      })
      .catch((error) => {
        console.error("ontologyModule fetch error:", error);
      });
    
    const createSubscription = client.models.ontologyModule
      .onCreate()
      .subscribe({
        next: (newItem) => {
          if (!newItem || !newItem.iri) return; 
          setOntologyModules((previous) => {
            if (previous.some((item) => item.iri === newItem.iri))
              return previous;
            return [...previous, newItem];
          });
        },
        error: (error) => console.warn(
          "ontologyModule creation handler exception:", error)
      });

    const deleteSubscription = client.models.ontologyModule
      .onDelete()
      .subscribe({
        next: (deletedItem) => {
          if (!deletedItem || !deletedItem.iri) return;
          setOntologyModules((previous) =>
            previous.filter((item) => item.iri !== deletedItem.iri)
          );
        },
        error: (error) => console.warn(
          "ontologyModule delete handler exception:", error)
      });

    return () => {
      createSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    };
  }, [ontologyModulesSynced]);

  function delete_ontology_module(id: string) {
    client.models.ontologyModule.delete({ id: id});
  }

  function isMultilingualDescription(value: unknown):
    value is Record<string, string> {
    return typeof value === "object" && value !== null;
  }

  return (
    <main>
      User {user?.signInDetails?.loginId}
      <button onClick={signOut}>Sign out</button>
      <h1>Ontology Modules</h1>
      <table>
        <thead>
          <tr>
            <th>IRI</th><th>Description</th>
          </tr>
        </thead>
        <tbody>
        {ontologyModules
          .sort((a, b) => a.iri!.localeCompare(b.iri!))
          .map((module) => {
            const description = isMultilingualDescription(module.description) ?
              module.description : {};

            const initialContent = Object.fromEntries(
              languages.map((l) => [l, description[l] ?? ""])
            ) as Record<SupportedLanguage, string>;

            return (
            <tr key={module.iri}>
              <td>
                {module.iri}<br/>
                <button onClick={() => delete_ontology_module(module.id)}>
                  Delete
                </button>
              </td>
              <td>
                  <MultilingualEditor
                    initialContent={initialContent}
                    onSave={(l: SupportedLanguage, html: string) => {}}
                  />
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
      {ontologyModulesSynced && (
      <OntologyModuleCreator
        ontologyModules={ontologyModules}
        onCreate={(newModule: string) => {
          client.models.ontologyModule.create({ iri: newModule });
        }}
      />
      )}
    </main>
  );
}
