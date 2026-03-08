import Link from "next/link";

export function Navbar() {
  return (
    <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
      <Link href="/" className="text-xl font-bold text-indigo-300">
        Random Force Task
      </Link>
      <div className="flex gap-4 text-sm text-slate-300">
        <Link href="/" className="hover:text-white">
          Task Pool
        </Link>
        <Link href="/collection" className="hover:text-white">
          Collection Box
        </Link>
      </div>
    </nav>
  );
}
