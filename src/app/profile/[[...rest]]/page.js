"use client";
import { UserProfile } from "@clerk/nextjs";
import ActivityPanel from "@/components/ActivityPanel";
import { FolderGit2 } from "lucide-react";

const FolderIcon = () => <FolderGit2 size={16} />;

export default function ProfilePage() {
  return (
    <div className="flex justify-center px-6 py-10">
      <UserProfile
        path="/profile"
        routing="path"
        appearance={{
          variables: {
            colorPrimary: "#6ee7b7",
            colorBackground: "#101311",
            colorInputBackground: "#0b0d0c",
            colorText: "#ffffff",
            colorTextSecondary: "#a3a3a3",
            borderRadius: "0.75rem",
          },
        }}
      >
        <UserProfile.Page label="Activity" labelIcon={<FolderIcon />} url="activity">
          <ActivityPanel />
        </UserProfile.Page>
      </UserProfile>
    </div>
  );
}