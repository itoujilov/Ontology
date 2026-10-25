import { MultilingualEditor } from "./MultilingualEditor";
import { languages } from "./languages";
import { useState } from "react";
import type { Schema } from "@/amplify/data/resource";
import type { V6Client } from "@aws-amplify/api-graphql";

function parseDescription(descriptionField: unknown): Record<string, string> {
    if (!descriptionField) return {};
    if (typeof descriptionField !== "string") return {};
    try {
        const parsed = JSON.parse(descriptionField);
        return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
        return {};
    }
}

interface OntologyModuleRowProperties {
  module: Schema["ontologyModule"]["type"];
  client: V6Client<Schema>;
  onDelete: (id: string) => void;
}

// Helper component to keep tracking separate per row
export function OntologyModuleRow({ module, client, onDelete }:
OntologyModuleRowProperties) {
  const [saveStatus, setSaveStatus] =
    useState<"idle" | "saving" | "saved">("idle");

  const descriptionMap = parseDescription(module.description);

  const initialContent = Object.fromEntries(
    languages.map((l) => [l.code, descriptionMap[l.code] ?? ""])
  ) as Record<string, string>;

  return (
    <tr 
      key={module.id} 
      className={`module-row status-${saveStatus}`}
    >
      <td>
        <strong>{module.iri}</strong>
        <br />
        <button onClick={() => onDelete(module.id)}>Delete</button>
      </td>
      <td style={{ position: "relative" }}>
        <div className={`editor-container ${saveStatus === "saving" ? "shimmer-pulse" : ""}`}>
          <MultilingualEditor
            initialContent={initialContent}
            onSave={async (languageCode: string, html: string) => {
              setSaveStatus("saving");

              const updatedDescription = {
                ...descriptionMap,
                [languageCode]: html,
              };

              const { errors } = await client.models.ontologyModule.update({
                id: module.id,
                description: JSON.stringify(updatedDescription),
              });

              if (errors && errors.length > 0) {
                console.error("Amplify update errors:", errors);
                setSaveStatus("idle");
                return;
              }

              // Flash a success checkmark, then revert to idle
              setSaveStatus("saved");
              setTimeout(() => {
                setSaveStatus("idle");
              }, 1500);
            }}
          />
        </div>

        {/* Success Overlay Checkmark Pop */}
        {saveStatus === "saved" && (
          <div className="save-success-badge">
            ✓ Saved Successfully
          </div>
        )}
      </td>
    </tr>
  );
}
