'use client';

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  activities: z.array(
    z.object({
      type: z.string().min(1),
      description: z.string().min(1),
    })
  ).min(1, "At least one activity required"),
  media: z.any(),
  visibility: z.enum(["public", "friends", "private"]),
});

type PostFormValues = z.infer<typeof postSchema>;

const presetActivities = ["Dog Park", "Training", "Walk", "Other"];

export default function CreatePostForm() {
  const [activityFields, setActivityFields] = useState([
    { type: "", description: "" },
  ]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      activities: [{ type: "", description: "" }],
      media: [],
      visibility: "public",
    },
  });

  const onSubmit = (data: PostFormValues) => {
    // Placeholder: send to backend
    alert("Post created! (not yet saved)");
    console.log(data);
  };

  const handleAddActivity = () => {
    setActivityFields((prev) => [...prev, { type: "", description: "" }]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-lg font-bold mb-4">Create a Post</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Title</label>
        <input
          {...register("title")}
          className="w-full border rounded px-3 py-2"
          placeholder="Post title"
        />
        {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Activities</label>
        {activityFields.map((_, idx) => (
          <div key={idx} className="flex space-x-2 mb-2">
            <select
              {...register(`activities.${idx}.type` as const)}
              className="border rounded px-2 py-1"
              defaultValue=""
            >
              <option value="" disabled>
                Select type
              </option>
              {presetActivities.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
            <input
              {...register(`activities.${idx}.description` as const)}
              className="border rounded px-2 py-1 flex-1"
              placeholder="Description"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddActivity}
          className="text-blue-500 hover:underline text-sm mt-1"
        >
          + Add Activity
        </button>
        {errors.activities && (
          <p className="text-red-500 text-xs">{errors.activities.message as string}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Media (photo/video)</label>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          {...register("media")}
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Visibility</label>
        <select {...register("visibility")} className="border rounded px-2 py-1">
          <option value="public">Public</option>
          <option value="friends">Friends</option>
          <option value="private">Private</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Post
      </button>
    </form>
  );
}
