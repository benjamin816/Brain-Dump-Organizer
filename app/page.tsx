import { auth } from "@/lib/auth";
import AuthButton from "@/app/components/AuthButton";
import AddDumpForm from "./components/add-dump-form/AddDumpForm";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Brain Dump Organizer</h1>
          <p className="text-lg text-gray-400 mt-1 mb-8">Sign in to turn your thoughts into organized actions.</p>
          <AuthButton />
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-screen">
      {/* <app-sidebar></app-sidebar> */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Brain Dump Organizer</h1>
              <p className="text-lg text-gray-400 mt-1">Your AI-powered second brain.</p>
            </div>
            <AuthButton />
          </header>
          
          <AddDumpForm />
          
          {/* <app-dashboard></app-dashboard> */}
          <div className="mt-8 p-6 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Dashboard coming soon...</h2>
            <p className="text-gray-400">Once you add brain dumps, they will be organized and displayed here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
