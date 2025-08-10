'use client';

import React, { useState } from "react";

type Comment = {
  id: string;
  user: string;
  text: string;
  createdAt: string;
};

type CommentsProps = {
  postId: string;
};

const mockComments: Comment[] = [
  {
    id: "c1",
    user: "John Smith",
    text: "Great job!",
    createdAt: "2025-08-09T12:00:00Z",
  },
  {
    id: "c2",
    user: "Jane Doe",
    text: "So proud of your pup!",
    createdAt: "2025-08-09T12:05:00Z",
  },
];

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [text, setText] = useState("");

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setComments([
      ...comments,
      {
        id: Math.random().toString(36).slice(2),
        user: "You",
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setText("");
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2 text-sm">Comments</h3>
      <div className="space-y-2 mb-2">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-100 rounded px-3 py-2 text-sm">
            <span className="font-medium">{c.user}:</span> {c.text}
            <span className="ml-2 text-xs text-gray-400">{new Date(c.createdAt).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddComment} className="flex space-x-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          placeholder="Add a comment..."
        />
        <button type="submit" className="text-blue-500 hover:underline text-sm">
          Post
        </button>
      </form>
    </div>
  );
}
