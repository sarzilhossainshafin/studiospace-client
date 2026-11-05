"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  name: string;
  email: string;
}

interface Studio {
  _id: string;
  hostEmail: string;
}

interface Booking {
  _id: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [studioCount, setStudioCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const userResponse = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
          cache: "no-store",
        });

        if (!userResponse.ok) {
          router.replace("/login");
          return;
        }

        const userResult = await userResponse.json();
        const currentUser = userResult.user || userResult.data;

        if (!currentUser) {
          router.replace("/login");
          return;
        }

        setUser(currentUser);

        const [studioResponse, bookingResponse] = await Promise.all([
          fetch(`${API_URL}/api/studios`, {
            cache: "no-store",
          }),
          fetch(`${API_URL}/api/bookings`, {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        if (studioResponse.ok) {
          const studioResult = await studioResponse.json();
          const studios: Studio[] = Array.isArray(studioResult)
            ? studioResult
            : studioResult.data || [];

          const myStudios = studios.filter(
            (studio) =>
              studio.hostEmail?.toLowerCase() ===
              currentUser.email?.toLowerCase()
          );

          setStudioCount(myStudios.length);
        }

        if (bookingResponse.ok) {
          const bookingResult = await bookingResponse.json();
          const bookings: Booking[] = bookingResult.data || [];

          setBookingCount(bookings.length);
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-500">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Welcome Section */}
        <section className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#f36b38]">
            Dashboard
          </p>

          <h1 className="text-3xl font-bold text-[#20201e] md:text-4xl">
            Welcome back, {user?.name || "User"}!
          </h1>

          <p className="mt-3 text-gray-500">
            Manage your studios and keep track of your bookings.
          </p>
        </section>

        {/* Statistics */}
        <section className="mb-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#e9e6df] bg-white p-7 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              🎬
            </div>

            <p className="text-sm font-medium text-gray-500">
              My Studio Listings
            </p>

            <h2 className="mt-2 text-4xl font-bold text-[#20201e]">
              {studioCount}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#e9e6df] bg-white p-7 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              📅
            </div>

            <p className="text-sm font-medium text-gray-500">
              My Bookings
            </p>

            <h2 className="mt-2 text-4xl font-bold text-[#20201e]">
              {bookingCount}
            </h2>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="mb-5 text-2xl font-bold text-[#20201e]">
            Quick Actions
          </h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/studios/add"
              className="rounded-2xl border border-[#e9e6df] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">➕</span>
              <h3 className="mt-4 font-bold text-[#20201e]">
                Add New Studio
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                List your creative space.
              </p>
            </Link>

            <Link
              href="/my-listings"
              className="rounded-2xl border border-[#e9e6df] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">🏢</span>
              <h3 className="mt-4 font-bold text-[#20201e]">
                My Studio Listings
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Manage your listed studios.
              </p>
            </Link>

            <Link
              href="/my-bookings"
              className="rounded-2xl border border-[#e9e6df] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">📋</span>
              <h3 className="mt-4 font-bold text-[#20201e]">
                My Bookings
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                View your booking history.
              </p>
            </Link>

            <Link
              href="/studios"
              className="rounded-2xl border border-[#e9e6df] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl">🔍</span>
              <h3 className="mt-4 font-bold text-[#20201e]">
                Explore Studios
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Find your next creative space.
              </p>
            </Link>
          </div>
        </section>

        {/* Account Information */}
        <section className="mt-10 rounded-2xl border border-[#e9e6df] bg-white p-6">
          <h2 className="mb-4 text-xl font-bold text-[#20201e]">
            Account Information
          </h2>

          <p className="text-sm text-gray-500">
            Name:{" "}
            <span className="font-medium text-[#20201e]">
              {user?.name}
            </span>
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Email:{" "}
            <span className="font-medium text-[#20201e]">
              {user?.email}
            </span>
          </p>
        </section>
      </div>
    </main>
  );
}