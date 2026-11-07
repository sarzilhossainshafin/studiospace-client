"use client";
import Link from "next/link";

const categories = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

export default function Footer() {
  return (
    <footer id="about" className="mt-auto bg-[#20201e] text-white">
      <div className="mx-auto max-w-360 px-5 py-14 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f36b38] text-xl text-white">
                ◉
              </span>
              <span className="text-xl font-bold tracking-tight">
                Studio<span className="text-[#f36b38]">Space.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#aaa8a1]">
              A creative home for creators. Discover inspiring spaces, connect
              with hosts, and bring your next big idea to life.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm transition hover:border-[#f36b38] hover:bg-[#f36b38]"
              >
                IG
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm transition hover:border-[#f36b38] hover:bg-[#f36b38]"
              >
                f
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm font-semibold transition hover:border-[#f36b38] hover:bg-[#f36b38]"
              >
                𝕏
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-6 space-y-4 text-sm text-[#aaa8a1]">
              <li><Link className="transition hover:text-[#f36b38]" href="/">Home</Link></li>
              <li><Link className="transition hover:text-[#f36b38]" href="/studios">Explore Studios</Link></li>
              <li><Link className="transition hover:text-[#f36b38]" href="/login">Login</Link></li>
              <li><Link className="transition hover:text-[#f36b38]" href="/register">Become a Member</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Explore Categories
            </h3>
            <ul className="mt-6 space-y-4 text-sm text-[#aaa8a1]">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category)}`}
                    className="transition hover:text-[#f36b38]"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Stay Inspired
            </h3>
            <p className="mt-6 text-sm leading-7 text-[#aaa8a1]">
              Get creative space updates and inspiration delivered to your
              inbox.
            </p>

            <form
              className="mt-5 flex flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                className="min-w-0 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-[#77756f] focus:border-[#f36b38]"
              />
              <button
                type="submit"
                className="rounded-full bg-[#f36b38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#dc5828]"
              >
                Subscribe <span className="ml-1">↗</span>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-[#aaa8a1] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
