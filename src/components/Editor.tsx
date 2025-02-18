"use client";

import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import {
  useLiveblocksExtension,
  Toolbar,
  FloatingThreads,
  FloatingComposer,
} from "@liveblocks/react-tiptap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Save, PlusCircle, ChevronDown, ChevronUp, Edit2, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useRoom, useSelf, useOthers } from "@liveblocks/react";

export function Editor() {
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});
  const [editingDocId, setEditingDocId] = useState<Id<"pageDocs"> | null>(null);
  const [localTitle, setLocalTitle] = useState("");

  const defaultPage = useQuery(api.pages.getPageBySlug, { slug: "default" });
  const docs = defaultPage
    ? useQuery(api.docs.getPageDocs, { pageId: defaultPage._id })
    : undefined;
  const createDoc = useMutation(api.docs.createDoc);
  const updateDoc = useMutation(api.docs.updateDoc);
  const deleteDoc = useMutation(api.docs.deleteDoc);

  const room = useRoom();
  const others = useOthers();
  const self = useSelf();

  // Get the current title from all users (including self)
  const currentTitle = self?.presence?.title || localTitle;
  const otherUserTyping = others.some((user) => user.presence?.title && user.presence.title !== "");

  const liveblocks = useLiveblocksExtension({
    initialContent: "Start typing here...",
  });

  const editor = useEditor({
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert sm:prose-base focus:outline-none min-h-[200px] border border-zinc-200 rounded-lg p-4 select-text [&_*::selection]:bg-blue-200 dark:[&_*::selection]:bg-blue-500/40",
      },
    },
  });

  const handleSave = async () => {
    if (!editor || !defaultPage) return;
    const content = editor.getHTML();
    const titleToSave = (currentTitle || "Untitled Document") as string;

    if (editingDocId) {
      await updateDoc({
        id: editingDocId,
        title: titleToSave,
        content,
      });
      setEditingDocId(null);
    } else {
      await createDoc({
        pageId: defaultPage._id,
        title: titleToSave,
        content,
      });
    }

    // Reset everything after saving
    setLocalTitle("");
    room.updatePresence({ title: "" });
    editor.commands.setContent("Start typing here...");
    setEditingDocId(null);
  };

  const handleNewDoc = () => {
    setEditingDocId(null);
    setLocalTitle("");
    room.updatePresence({ title: "" });
    editor?.commands.setContent("Start typing here...");
  };

  const handleDeleteDoc = async (id: Id<"pageDocs">) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDoc({ id });
      if (editingDocId === id) {
        setEditingDocId(null);
        setLocalTitle("");
        room.updatePresence({ title: "" });
        editor?.commands.setContent("Start typing here...");
      }
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setLocalTitle(newTitle);
    room.updatePresence({ title: newTitle });
  };

  // Handle loading states
  if (defaultPage === undefined || docs === undefined) {
    return <div className="p-4">Loading...</div>;
  }

  // Handle errors
  if (defaultPage === null) {
    return <div className="p-4 text-red-500">Error loading page</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={typeof currentTitle === "string" ? currentTitle : ""}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Document title..."
            className="w-full px-3 py-1 border border-zinc-200 rounded"
          />
          {otherUserTyping && (
            <div className="absolute -top-5 left-0 text-xs text-blue-500">Someone is typing...</div>
          )}
        </div>
        <button
          onClick={handleSave}
          className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-zinc-800 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save and Close
        </button>
        <button
          onClick={handleNewDoc}
          className="px-3 py-1 text-sm bg-zinc-100 text-black rounded hover:bg-zinc-200 flex items-center gap-2">
          <PlusCircle className="w-4 h-4" />
          New
        </button>
      </div>

      <div>
        <Toolbar editor={editor} />
        <div className="relative">
          <EditorContent editor={editor} />
        </div>
        <FloatingComposer editor={editor} style={{ width: "350px" }} />
        <FloatingThreads editor={editor} style={{ width: "350px" }} threads={[]} />
      </div>

      <div className="space-y-2">
        {(docs ?? []).map((doc) => (
          <div key={doc._id} className="border border-zinc-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{doc.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setExpandedDocs((prev) => ({ ...prev, [doc._id]: !prev[doc._id] }));
                  }}
                  className="hover:text-blue-500">
                  {expandedDocs[doc._id] ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditingDocId(doc._id);
                    setLocalTitle(doc.title);
                    handleTitleChange(doc.title);
                    editor?.commands.setContent(doc.content);
                  }}
                  className="hover:text-blue-500">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteDoc(doc._id)} className="hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {expandedDocs[doc._id] && (
              <div
                className="mt-2 prose prose-sm select-text"
                dangerouslySetInnerHTML={{ __html: doc.content }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
