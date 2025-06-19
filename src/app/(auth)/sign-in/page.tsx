import { auth } from "@/lib/auth";

import { signIn } from "@/lib/auth";
import { GithubSignIn } from "@/components/github-sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { executeAction } from "@/lib/executeAction";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { iphone } from "../../../../public";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <>
      <section>
        <div className="w-[60%] mx-auto min-h-screen gap-10 items-center grid grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome to First Sayve Online Banking Service
            </h1>
            <p className="text-gray-600">
              Sign in with your Internet Banking details to access your account.
            </p>
            <div className="py-5">
              <GithubSignIn />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>
              <form
                className="space-y-4"
                action={async (formData) => {
                  "use server";
                  await executeAction({
                    actionFn: async () => {
                      await signIn("credentials", formData);
                    },
                  });
                }}
              >
                <Input
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                  autoComplete="email"
                />
                <Input
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
                <Button className="w-full" type="submit">
                  Sign In
                </Button>
              </form>
              <div className="text-center">
                <Button asChild variant="link">
                  <Link href="/sign-up">
                    Don&apos;t have an account? Sign up
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div>
            <Image
              src={iphone}
              alt="Logo"
              width={400}
              height={400}
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-[60%] mx-auto pb-4">
          <p>&copy; 2025 First Sayve. All rights reserved.</p>
        </div>
      </section>
    </>
  );
};

export default Page;
