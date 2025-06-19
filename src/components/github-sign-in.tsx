"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const GithubSignIn = () => {
  const handleSignIn = () => {
    signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <Button 
      onClick={handleSignIn} 
      variant="outline" 
      className="w-full"
      type="button"
    >
      <Github className="mr-2 h-4 w-4" />
      Continue with GitHub
    </Button>
  );
};

export { GithubSignIn };
