import React from "react";

interface NoteProps {
  note: {
    id: number;
    title: string;
    content: string;
    created_at: string;
  };
  onDelete: (id: number) => void;
}

function Note({ note, onDelete }: NoteProps) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

  return (
    <div className="p-2.5 my-5 border border-gray-300 rounded-md">
      <p className="text-gray-800 font-medium">{note.title}</p>
      <p className="text-gray-600 my-2">{note.content}</p>
      <p className="text-gray-400 text-sm">{formattedDate}</p>
      <button
        className="bg-red-600 text-white py-2 px-5 rounded-md hover:bg-red-700 transition-colors mt-3"
        onClick={() => onDelete(note.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default Note;
