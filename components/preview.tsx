"use client";

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface PreviewProps {
    value: string;
}

export const Preview = ({ value }: PreviewProps) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        editable: false,
    });

    return (
        <div className="text-sm mt-2">
            <EditorContent editor={editor} />
        </div>
    );
};