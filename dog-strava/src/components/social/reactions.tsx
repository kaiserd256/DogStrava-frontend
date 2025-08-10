'use client';

import React, { useState } from "react";

type ReactionType = "like" | "love" | "laugh" | "wow" | "sad";

const reactionIcons: Record<ReactionType, string> = {
  like: "👍",
  love: "❤️",
  laugh: "😂",
  wow: "😮",
  sad: "😢",
};

type ReactionsProps = {
  postId: string;
};

const initialReactions: Record<ReactionType, number> = {
  like: 2,
  love: 1,
  laugh: 0,
  wow: 0,
  sad: 0,
};

export default function Reactions({ postId }: ReactionsProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);

  const handleReact = (type: ReactionType) => {
    if (userReaction) return; // Only one reaction per user for now
    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setUserReaction(type);
  };

  return (
    <div className="flex space-x-2 items-center">
      {Object.entries(reactionIcons).map(([type, icon]) => (
        <button
          key={type}
          className={`text-xl ${userReaction === type ? "opacity-100" : "opacity-60"}`}
          onClick={() => handleReact(type as ReactionType)}
          disabled={!!userReaction}
        >
          {icon} <span className="text-xs">{reactions[type as ReactionType]}</span>
        </button>
      ))}
    </div>
  );
}
