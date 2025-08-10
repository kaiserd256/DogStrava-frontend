import React from "react";

// Placeholder user info
type User = {
  name: string;
  email: string;
  accountType: "owner" | "rescue";
  joined: string;
};

const user: User = {
  name: "Jane Doe",
  email: "jane@example.com",
  accountType: "owner",
  joined: "2024-11-01T10:00:00Z",
};

export default function UserInfoCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-2">User Information</h2>
      <div className="mb-1"><span className="font-medium">Name:</span> {user.name}</div>
      <div className="mb-1"><span className="font-medium">Email:</span> {user.email}</div>
      <div className="mb-1"><span className="font-medium">Account Type:</span> {user.accountType === "owner" ? "Dog Owner" : "Rescue"}</div>
      <div className="mb-1"><span className="font-medium">Joined:</span> {new Date(user.joined).toLocaleDateString()}</div>
    </div>
  );
}
