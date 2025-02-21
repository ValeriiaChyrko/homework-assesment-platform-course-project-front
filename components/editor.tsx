"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()), });
    return <EditorContent editor={editor} className="bg-white p-4" />;
};