
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  image: string;
  hostEmail: string;
}

export default function MyListingsPage() {
  const router = useRouter();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(async () => {
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

        const studioResponse = await fetch(`${API_URL}/api/studios`, {
          cache: "no-store",
        });

        if (!studioResponse.ok) {
          throw new Error("Failed to load studios.");
        }

        const studioResult = await studioResponse.json();

        const allStudios: Studio[] =
          studioResult.data || studioResult.studios || [];

        setStudios(
          allStudios.filter(
            (studio) =>
              studio.hostEmail?.toLowerCase() ===
              user.email.toLowerCase()
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  const handleDelete = async () => {
    if (!selectedStudio) return;

    try {
      setDeleting(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/studios/${selectedStudio._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete studio.");
      }

      setStudios((previous) =>
        previous.filter((studio) => studio._id !== selectedStudio._id)
      );

      setSelectedStudio(null);
      setMessage("Studio deleted successfully.");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-semibold text-primary">Loading your listings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-20 text-center">
        <h2 className="text-2xl font-bold">{error}</h2>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white"
        >
          Sign In
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-5 py-12">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
            Host Dashboard
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            My Studio Listings
          </h1>
          <p className="mt-3 text-muted">
            Manage the creative spaces you have listed.
          </p>
        </div>

        <Link
          href="/studios/add"
          className="rounded-xl bg-primary px-6 py-3 text-center font-bold text-white transition hover:opacity-90"
        >
          + Add New Studio
        </Link>
      </div>

      {message && (
        <p className="mb-6 rounded-xl border border-border bg-card p-4 text-sm">
          {message}
        </p>
      )}

      {studios.length > 0 ? (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <div
              key={studio._id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <Image
                src={studio.image}
                alt={studio.title}
                width={600}
                height={350}
                unoptimized
                className="h-52 w-full object-cover"
              />

              <div className="p-5">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {studio.category}
                </span>

                <h2 className="mt-4 text-xl font-bold">
                  {studio.title}
                </h2>

                <p className="mt-2 text-sm text-muted">
                  📍 {studio.location}
                </p>

                <p className="mt-4 text-lg font-bold text-primary">
                  ৳{studio.hourlyRate}/hour
                </p>

                <div className="mt-5 flex gap-3 border-t border-border pt-4">
                  <Link
                    href={`/studios/edit/${studio._id}`}
                    className="flex-1 rounded-lg border border-border px-4 py-2 text-center text-sm font-semibold transition hover:bg-secondary"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSelectedStudio(studio)}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card px-5 py-16 text-center">
          <div className="mb-4 text-5xl">🏢</div>
          <h2 className="text-2xl font-bold">No Listings Yet</h2>
          <p className="mt-3 text-muted">
            You have not listed any creative studios yet.
          </p>
          <Link
            href="/studios/add"
            className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-bold text-white"
          >
            Add Your First Studio
          </Link>
        </div>
      )}

      {selectedStudio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5">
          <div className="w-full max-w-md rounded-2xl bg-card p-7 shadow-2xl">
            <h2 className="text-xl font-bold">Delete Studio?</h2>

            <p className="mt-3 leading-7 text-muted">
              Are you sure you want to delete{" "}
              <strong>{selectedStudio.title}</strong>? This action cannot be
              undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedStudio(null)}
                disabled={deleting}
                className="rounded-lg border border-border px-5 py-2 font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
