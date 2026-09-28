"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Properties {
  initialHTML: string;
  onSave: (html: string) => void;
}

export function Editor({ initialHTML, onSave }: Properties) {
  const editor = useEditor({
    content: initialHTML,
    extensions: [StarterKit],
    immediatelyRender: false, // prevents SSR hydration mismatch
  });

  if (!editor) return null;
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => onSave(editor.getHTML())}>Save</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
