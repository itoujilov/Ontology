"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const { signOut } = useAuthenticator();
  return (
    <main>
      <button onClick={signOut}>Sign out</button>
      <h1>Ontology Modules</h1>
      <button>Create Ontology Module</button>
      <ul>
      </ul>
      <div>
        <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
          Review next steps of development.
        </a>
      </div>
    </main>
  );
}
