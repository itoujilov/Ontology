"use client";
import { isIri } from "@hyperjump/uri";
import { useState } from "react";

export default function OntologyModuleCreator() {
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
