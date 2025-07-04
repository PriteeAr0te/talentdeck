"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import MenuBar from "./MenuBar";

interface RichTextEditorComponentProps {
  id: string;
  label?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const RichTextEditorComponent: React.FC<RichTextEditorComponentProps> = ({
  id,
  label,
  error,
  value,
  onChange,
  maxLength = 500,
}) => {
  const [charCount, setCharCount] = useState(value?.length || 0);

  const editor = useEditor({
    content: value || "<p></p>",
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc pl-3" } },
        orderedList: { HTMLAttributes: { class: "list-decimal pl-3" } },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
    ],
    editorProps: {
      attributes: {
        class:
          "prose border resize-none focus:border-primary text-foreground min-h-[140px] max-h-[300px] p-2.5 rounded-md focus:outline-none overflow-y-auto",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      onChange(html);
      setCharCount(editor.getText().length);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>", false);
    }
  }, [value, editor]);

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium dark:text-white text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div id={id}>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>{charCount}/{maxLength} characters</span>
        {error && <span className="text-red-500">{error}</span>}
      </div>
    </div>
  );
};

export default RichTextEditorComponent;
