import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#04543f]">
        404
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-zinc-900">Page not found</h1>
      <p className="mt-3 text-zinc-600">
        This page doesn’t exist or Hygraph isn’t configured. Check your environment variables and
        content entry slugs.
      </p>
      <Link
        className="mt-8 rounded-full bg-[#04543f] px-6 py-3 text-sm font-semibold text-white"
        href="/"
      >
        Back to home
      </Link>
    </div>
  );
}
