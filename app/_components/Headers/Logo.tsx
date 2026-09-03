// _components/headers/Logo.tsx

import Link from "next/link";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="text-2xl font-bold tracking-tight text-indigo-600"
    >
      ErrorNote
    </Link>
  );
};
