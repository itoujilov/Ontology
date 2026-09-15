"use client";
import { isIri } from "@hyperjump/uri";
import React, { useState } from "react";
import type { Schema } from '@/amplify/data/resource'

type OntologyModule = Schema['ontologyModule']['type'];

interface OntologyModuleCreatorProperties {
  ontologyModules: OntologyModule[];
  onCreate: {(newModule: string): void}
}

export const OntologyModuleCreator: React.FC<OntologyModuleCreatorProperties> =
  ({ontologyModules, onCreate}) => {

  const [error, setError] = useState("");

  function createOntologyModule() {
    const IRI = window.prompt(
      "IRI (required and must be unique in your namespace as a user)"
    );

    if (IRI === null)
      return;

    if (!IRI) {
      setError("You must enter an IRI.");
      return;
    }

    if (!isIri(IRI)) {
      setError("IRI must be a well-formed RFC 3987 IRI.");
      return;
    }

    if (ontologyModules.some(m => m.iri === IRI)) {
      setError("IRI must be unique within your namespace.");
      return;
    }

    try {
      onCreate(IRI);
    }
    catch {
      
    }

    setError("");
  }

  return (
    <div>
      <button onClick={createOntologyModule}>Create Ontology Module</button>

      {error && (
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          background: "#ffe6e6",
          border: "1px solid #ff4d4d",
          borderRadius: "6px",
          color: "#990000"
        }}>
          {error}
          <button onClick={() => setError("")}> OK</button>
        </div>
      )}
    </div>
  );
}
