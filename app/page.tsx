"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import OntologyModuleCreator from "./OntologyModuleCreator";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const { user, signOut } = useAuthenticator();

  return (
    <main>
      User {user?.signInDetails?.loginId}
      <button onClick={signOut}>Sign out</button>
      <h1>Ontology Modules</h1>
      <ul>
      </ul>
      <OntologyModuleCreator/>
    </main>
  );
}
