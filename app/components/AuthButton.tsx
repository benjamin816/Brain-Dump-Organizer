'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-300">
          Signed in as {session.user?.email}
        </p>
        <button 
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button 
      onClick={() => signIn('google')}
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
    >
      Sign in with Google
    </button>
  );
}
