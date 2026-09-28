import { useState } from "react";
import { Editor } from "./Editor";
import { LanguageSelector } from "./LanguageSelector";
import type { SupportedLanguage } from "./LanguageSelector";

interface Properties {
  initialContent: Record<SupportedLanguage, string>;
  onSave: (l: SupportedLanguage, html: string) => void;
}

export function MultilingualEditor({ initialContent, onSave }: Properties) {
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [content, setContent] = useState(initialContent);

  const handleSave = (html: string) => {
    setContent(previous => ({ ...previous, [language]: html }));
    onSave(language, html);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <LanguageSelector language={language} onChange={setLanguage} />

      <Editor
        key={language} // reinitialize editor when language changes
        initialHTML={content[language]}
        onSave={handleSave}
      />
    </div>
  );
}
