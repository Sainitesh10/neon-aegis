import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8 text-slate-800">
      <main className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Our SaaS Platform</h1>
        <p className="text-lg text-gray-600">
          This is a completely normal, public-facing landing page. Legitimate users click here to log in or learn more about the product.
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Get Started
        </button>

        {/* THE HONEYPOT (Invisible to real users, but web scrapers and hacker bots will see and click it) */}
        <Link href="http://127.0.0.1:8000/api/v1/secure/admin-portal" className="hidden" aria-hidden="true" rel="nofollow">
          Admin Portal Login
        </Link>
      </main>
    </div>
  );
}
