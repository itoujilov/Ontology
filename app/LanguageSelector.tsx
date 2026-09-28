type SupportedLanguage = "en" | "de" | "fr";
export type { SupportedLanguage };

interface Properties {
  language: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
}

export function LanguageSelector({ language, onChange }: Properties) {
  return (
    <select
      value={language}
      onChange={e => onChange(e.target.value as SupportedLanguage)}
      style={{ marginBottom: 16 }}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="fr">Français</option>
    </select>
  );
}
