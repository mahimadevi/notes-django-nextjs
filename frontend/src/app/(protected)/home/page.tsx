"use client";
import { useState, useEffect } from "react";
import api from "@/api";
import Note from "../../../components/Note";
import { useRouter } from "next/navigation";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";

interface NoteType {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

function Home() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [editingNote, setEditingNote] = useState<NoteType | null>(null);
  const router = useRouter();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data: NoteType[]) => {
        setNotes(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id: number) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) {
          alert("Note deleted!");
          getNotes();
        } else {
          alert("Failed to delete note.");
        }
      })
      .catch((error) => alert(error));
  };

  const startEditing = (note: NoteType) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  const createOrUpdateNote = (e: React.FormEvent) => {
    e.preventDefault();
    const apiCall = editingNote
      ? api.put(`/api/notes/update/${editingNote.id}/`, { title, content })
      : api.post("/api/notes/", { title, content });

    apiCall
      .then((res) => {
        if (res.status === (editingNote ? 200 : 201)) {
          alert(`Note ${editingNote ? "updated" : "created"}!`);
          setTitle("");
          setContent("");
          setEditingNote(null);
          getNotes();
        } else {
          alert(`Failed to ${editingNote ? "update" : "create"} note.`);
        }
      })
      .catch((err) => alert(err));
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="font-sans p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Notes</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="space-y-3 mb-8">
        {notes.map((note) => (
          <div key={note.id} className="group relative">
            <Note note={note} onDelete={deleteNote} />
            <button
              onClick={() => startEditing(note)}
              className="absolute top-2 right-2 bg-yellow-500 text-white py-1 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          {editingNote ? "Edit Note" : "Create a Note"}
        </h2>
        <form onSubmit={createOrUpdateNote} className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-bold mb-1">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="content" className="block font-bold mb-1">
              Content:
            </label>
            <textarea
              id="content"
              name="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md h-32"
            ></textarea>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingNote ? "Update" : "Submit"}
            </button>
            {editingNote && (
              <button
                type="button"
                onClick={cancelEditing}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
