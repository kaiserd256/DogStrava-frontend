import React from "react";

import PostFeed from "../../../components/social/post-feed";
import CreatePostForm from "../../../components/social/create-post-form";

export default function SocialPage() {
  return (
    <>
      <CreatePostForm />
      <PostFeed />
    </>
  );
}
