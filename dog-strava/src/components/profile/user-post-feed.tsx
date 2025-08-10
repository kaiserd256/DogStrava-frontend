
import React from "react";
import PostCard from "../social/post-card";

type Activity = {
  type: string;
  description: string;
};

type Post = {
  id: string;
  user: string;
  title: string;
  activities: Activity[];
  media: string[];
  createdAt: string;
  visibility: "public" | "friends" | "private";
};

const userPosts: Post[] = [
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
    id: "3",
    user: "Jane Doe",
    title: "Recall training success!",
    activities: [
      { type: "Training", description: "Recall with treats and hand signals." },
    ],
    media: [],
    createdAt: "2025-08-07T09:00:00Z",
    visibility: "friends",
  },
];

export default function UserPostFeed() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">My Timeline</h2>
      <div className="space-y-6">
        {userPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
