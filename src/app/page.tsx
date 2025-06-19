import { SignOut } from "@/components/sign-out";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  return (
    <>
      <section>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-4xl font-bold mb-4">Welcome to First Sayve</h1>
          <p className="text-lg text-gray-600 mb-4">
            First Sayve is a personal finance management platform that helps you
            manage your money and track your expenses.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            <Link href="/sign-in">Sign In</Link>
          </button>
        </div>
      </section>
    </>
  );
};

export default Page;
