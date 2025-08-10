import React from "react";
import Reactions from "./reactions";
import Comments from "./comments";

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

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{post.user}</span>
        <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <div className="mb-2">
        {post.activities.map((activity, idx) => (
          <div key={idx} className="text-sm text-gray-700">
            <span className="font-medium">{activity.type}:</span> {activity.description}
          </div>
        ))}
      </div>
      {post.media.length > 0 && (
        <div className="flex space-x-2 mb-2">
          {post.media.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt="Post media"
              className="w-32 h-32 object-cover rounded"
            />
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-500">Visibility: {post.visibility}</span>
        <Reactions postId={post.id} />
      </div>
      <Comments postId={post.id} />
    </div>
  );
}
