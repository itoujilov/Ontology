import { languages } from "./languages";

interface Properties {
  language_code: string;
  onChange: (language_code: string) => void;
}

export function LanguageSelector({ language_code, onChange }: Properties) {
  return (
    <select
      value={language_code}
      onChange={e => onChange(e.target.value as string)}
      style={{ marginBottom: 16 }}
    >
      {languages.map(({ code, name }) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
