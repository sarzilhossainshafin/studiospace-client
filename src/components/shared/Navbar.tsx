
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  name: string;
  email: string;
  photoURL?: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const result = await response.json();
        setUser(result.user || result.data || null);
      } catch {
        setUser(null);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      closeMenus();
      router.push("/");
      router.refresh();
    } catch {
      console.error("Logout failed.");
    }
  };

  const navLinkClass = (path: string) =>
    `transition hover:text-[#f36b38] ${
      pathname === path ? "font-bold text-[#f36b38]" : ""
    }`;

  const accountLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Add New Studio", href: "/studios/add" },
    { label: "My Studio Listings", href: "/my-listings" },
    { label: "My Bookings", href: "/my-bookings" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e6df] bg-[#faf9f6]/95 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2.5" onClick={closeMenus}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f36b38] text-xl text-white">
            ◉
          </div>
          <span className="text-xl font-bold tracking-tight">
            Studio<span className="text-[#f36b38]">Space.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#55534e] lg:flex">
          <Link href="/" className={navLinkClass("/")}>Home</Link>
          <Link href="/studios" className={navLinkClass("/studios")}>
            Explore Studios
          </Link>
          <Link href="/#how-it-works" className="transition hover:text-[#f36b38]">
            How It Works
          </Link>
          <Link href="/#about" className="transition hover:text-[#f36b38]">
            About Us
          </Link>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-[#e9e6df] px-3 py-2 transition hover:border-[#f36b38]"
              >
                {user.photoURL ? (
                  <Image
  src={user.photoURL}
  alt={user.name}
  width={36}
  height={36}
  unoptimized
  className="h-9 w-9 rounded-full object-cover"
/>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f36b38] font-bold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="max-w-32 truncate text-sm font-semibold">
                  {user.name || "My Account"}
                </span>
                <span>⌄</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-14 z-50 w-60 rounded-2xl border border-[#e9e6df] bg-white p-2 shadow-xl">
                  <div className="border-b border-[#e9e6df] px-4 py-3">
                    <p className="font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-[#77756f]">
                      {user.email}
                    </p>
                  </div>

                  {accountLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenus}
                      className="block rounded-xl px-4 py-3 text-sm transition hover:bg-[#faf9f6] hover:text-[#f36b38]"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="rounded-full px-4 py-2.5 text-sm font-semibold hover:text-[#f36b38]">
                Login
              </Link>
              <Link href="/register" className="rounded-full bg-[#f36b38] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#dc5828]">
                Get Started ↗
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e9e6df] text-xl text-[#20201e] sm:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#e9e6df] bg-[#faf9f6] px-5 py-5 sm:hidden">
          <nav className="flex flex-col gap-5 text-sm font-medium text-[#55534e]">
            <Link href="/" onClick={closeMenus}>Home</Link>
            <Link href="/studios" onClick={closeMenus}>Explore Studios</Link>
            <Link href="/#how-it-works" onClick={closeMenus}>How It Works</Link>
            <Link href="/#about" onClick={closeMenus}>About Us</Link>

            <div className="border-t border-[#e9e6df] pt-4">
              {user ? (
                <>
                  <p className="mb-3 font-bold">{user.name}</p>
                  <p className="mb-3 text-xs text-[#77756f]">{user.email}</p>

                  {accountLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenus}
                      className="block rounded-xl py-3 hover:text-[#f36b38]"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 font-semibold text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <Link href="/login" onClick={closeMenus} className="rounded-full border border-[#e9e6df] px-5 py-2.5">
                    Login
                  </Link>
                  <Link href="/register" onClick={closeMenus} className="rounded-full bg-[#f36b38] px-5 py-2.5 text-white">
                    Get Started ↗
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
