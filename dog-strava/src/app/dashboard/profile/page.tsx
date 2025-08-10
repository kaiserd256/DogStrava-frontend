import React from "react";
import UserInfoCard from "../../../components/profile/user-info-card";
import DogList from "../../../components/profile/dog-list";
import UserPostFeed from "../../../components/profile/user-post-feed";

export default function DashboardProfilePage() {
  return (
    <div className="space-y-8">
      <UserInfoCard />
      <DogList />
      <UserPostFeed />
    </div>
  );
}
