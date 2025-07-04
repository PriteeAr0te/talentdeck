"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import MenuBar from './MenuBar'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'

const RichTextEditor = () => {

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-3',
          },
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
    ],
    content: '<p>Hello World!</p>',
    editorProps: {
      attributes: {
        class: 'border focus:border-primary text-foreground h-[140px] p-2.5 rounded-md focus:outline-none overflow-y-auto',
      }
    },
    onUpdate: ({ editor }) => {
      console.log(editor.getHTML())
    },
  })

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor