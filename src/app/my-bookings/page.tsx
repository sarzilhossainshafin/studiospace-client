
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Booking {
  _id: string;
  studioTitle: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
  status: string;
}

export default function MyBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const loadBookings = useCallback(async () => {
    try {
      const userResponse = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
        cache: "no-store",
      });

      const userResult = await userResponse.json();
      const user = userResult.user || userResult.data;

      if (!userResponse.ok || !user?.email) {
        router.replace("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/bookings`, {
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load bookings.");
      }

      const bookingData = result.data || result.bookings || [];

      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBookings();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadBookings]);

  const handleCancel = async () => {
    if (!cancelId) return;

    setCancelling(true);

    try {
      const response = await fetch(
        `${API_URL}/api/bookings/${cancelId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to cancel booking.");
      }

      setMessage("Booking cancelled successfully.");
      setCancelId(null);
      await loadBookings();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="font-semibold text-muted">
          Loading your bookings...
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-5 py-16">
      <div className="mb-10">
        <p className="mb-3 font-semibold uppercase tracking-widest text-primary">
          Your Workspace
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          My Bookings
        </h1>

        <p className="mt-3 text-muted">
          Manage your creative workspace reservations.
        </p>
      </div>

      {message && (
        <p className="mb-6 rounded-xl bg-secondary p-4 text-sm">
          {message}
        </p>
      )}

      {bookings.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card px-6 py-16 text-center">
          <h2 className="text-xl font-bold">No bookings yet</h2>

          <p className="mt-3 text-muted">
            Explore studios and book your next creative workspace.
          </p>

          <Link
            href="/studios"
            className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white"
          >
            Explore Studios
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex flex-col justify-between gap-5 sm:flex-row">
                <div>
                  <h2 className="text-xl font-bold">
                    {booking.studioTitle}
                  </h2>

                  <p className="mt-3 text-sm text-muted">
                    Date: {booking.bookingDate}
                  </p>

                  <p className="mt-2 text-sm text-muted">
                    Time: {booking.startTime} – {booking.endTime}
                  </p>

                  <p className="mt-2 text-sm text-muted">
                    Duration: {booking.totalHours} hours
                  </p>

                  <p className="mt-3 text-lg font-bold text-primary">
                    ৳{booking.totalPrice}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-4 sm:items-end">
                  <span className="rounded-full bg-secondary px-4 py-2 text-sm font-semibold">
                    {booking.status}
                  </span>

                  {booking.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => setCancelId(booking._id)}
                      className="rounded-xl border border-red-300 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Cancel Confirmation Modal */}
      {cancelId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
            <h2 className="text-xl font-bold text-[#20201e]">
              Cancel Booking?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Are you sure you want to cancel this booking? This action
              cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelId(null)}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancel}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
