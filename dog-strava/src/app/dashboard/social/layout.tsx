import React from "react";

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Social Feed</h1>
        {children}
      </div>
    </div>
  );
}
