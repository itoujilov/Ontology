"use client";

import { generateClient } from "aws-amplify/data";
import { languages } from "./languages";
import outputs from "@/amplify_outputs.json";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { MultilingualEditor } from "./MultilingualEditor";
import { OntologyModuleCreator } from "./OntologyModuleCreator";

import type { Schema } from "@/amplify/data/resource";

import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

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

    const updateSubscription = client.models.ontologyModule
      .onUpdate()
      .subscribe({
        next: (updatedItem) => {
          if (!updatedItem || !updatedItem.id) return;
          setOntologyModules((previous) =>
            previous.map((item) => (item.id === updatedItem.id ? updatedItem : item))
          );
        },
        error: (error) => console.warn(
          "ontologyModule update handler exception:", error)
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
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    };
  }, []);

  async function delete_ontology_module(id: string) {
    try {
      await client.models.ontologyModule.delete({ id });
    } catch (error) {
      console.error("Failed to delete module:", error);
    }
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
            const description =
              typeof module.description === "string"
                ? JSON.parse(module.description)
                : module.description;

            const initialContent = Object.fromEntries(
              languages.map((l) => (
                description
                ? [l, description[l.code] ?? ""]
                : [l, ""]
              ))
            ) as Record<string, string>;

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
                  onSave={async (l: string, html: string) => {
                    const raw = module.description ?? {};

                    const currentDescription =
                      typeof raw === "string"
                        ? JSON.parse(raw)
                        // strips non‑JSON fields
                        : JSON.parse(JSON.stringify(raw));

                    const updatedDescription = {
                      ...currentDescription,
                      [l]: html,
                    };

                    const { data, errors } =
                      await client.models.ontologyModule.update({
                      id: module.id,
                      description: JSON.stringify(updatedDescription)
                    });

                    if (errors && errors.length > 0) {
                      console.error("Amplify update errors:", errors);
                      return;
                    }
                  }}
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
