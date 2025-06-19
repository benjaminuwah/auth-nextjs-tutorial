import Sidebar from "@/components/ui/Sidebar";
import { auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import { deposit, send, withdraw } from "../../../public";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

const Page = async () => {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-y-auto p-8">
          <div className="w-full">
            {/* Dashboard Content */}
            <div className="py-2">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                    Welcome back, {session.user?.name || "User"} 👋🏼
                  </h2>
                  <p className="text-sm text-gray-500">
                    Here's what's happening with your account today.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt="User profile"
                      width={400}
                      height={400}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaUserCircle className="w-8 h-8 text-teal-800" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <p className="font-bold">{session.user?.name || "User"}</p>
                    <p className="text-sm text-gray-500">
                      {session.user?.email || "Email"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[65%]">
                <div className="bg-teal-800/10 p-10 rounded-lg">
                  <p className="text-2xl font-bold">Unlimited Cashback</p>
                  <p className="text-sm text-gray-500">
                    Instant 2% back on all your spend to your account
                  </p>
                </div>
              </div>
              <div className="w-[35%]">
                <div className="bg-white p-4 rounded-lg">
                  <div className="border p-4 rounded-lg">
                    <div className="border p-4 rounded-lg bg-teal-800 text-white">
                      <p className="font-bold">Account Number</p>
                      <p className="font-bold">Account Type</p>
                      <p className="font-bold">Account Balance</p>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <p className="flex flex-col items-center gap-2">
                        <Image
                          src={deposit}
                          alt="Deposit"
                          width={50}
                          height={50}
                          className="border p-2 rounded-lg"
                        />
                        <p>Deposit</p>
                      </p>
                      <p className="flex flex-col items-center gap-2">
                        <Image
                          src={withdraw}
                          alt="Withdraw"
                          width={50}
                          height={50}
                          className="border p-2 rounded-lg"
                        />
                        <p>Withdraw</p>
                      </p>
                      <p className="flex flex-col items-center gap-2">
                        <Image
                          src={send}
                          alt="Transfer"
                          width={50}
                          height={50}
                          className="border p-2 rounded-lg"
                        />
                        <p>Transfer</p>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
