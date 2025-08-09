import React from "react";
import PostCard from "./post-card";

// Placeholder data for now
type Activity = {
  type: string;
  description: string;
};

type Post = {
  id: string;
  user: string;
  title: string;
  activities: Activity[];
  media: string[]; // URLs
  createdAt: string;
  visibility: "public" | "friends" | "private";
};

const mockPosts: Post[] = [
  {
    id: "1",
    user: "Jane Doe",
    title: "Great day at the park!",
    activities: [
      { type: "Dog Park", description: "Played fetch and practiced recall." },
      { type: "Training", description: "Worked on 'stay' with distractions." },
    ],
    media: ["/public/paw-print.png"],
    createdAt: "2025-08-09T10:00:00Z",
    visibility: "public",
  },
  {
    id: "2",
    user: "Rescue Paws",
    title: "Training update for Max",
    activities: [
      { type: "Training", description: "Max nailed 'sit' 8/10 times!" },
    ],
    media: [],
    createdAt: "2025-08-08T15:30:00Z",
    visibility: "friends",
  },
];

export default function PostFeed() {
  return (
    <div className="space-y-6">
      {mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
