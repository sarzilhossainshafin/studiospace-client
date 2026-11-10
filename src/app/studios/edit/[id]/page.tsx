
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

const categories = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  address: string;
  image: string;
  amenities: string[];
  overview: string;
  hostName: string;
  hostEmail: string;
};

export default function EditStudioPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [studio, setStudio] = useState<Studio | null>(null);
  const [amenities, setAmenities] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const [studioResponse, userResponse] = await Promise.all([
          fetch(`${API_URL}/studios/${id}`),
          fetch(`${API_URL}/auth/me`, {
            credentials: "include",
          }),
        ]);

        const studioResult = await studioResponse.json();
        const userResult = await userResponse.json();

        if (!studioResponse.ok) {
          throw new Error(studioResult.message || "Studio not found");
        }

        if (!userResponse.ok || !userResult.user) {
          router.push("/login");
          return;
        }

        const currentStudio = studioResult.data as Studio;

        if (
          currentStudio.hostEmail?.toLowerCase() !==
          userResult.user.email?.toLowerCase()
        ) {
          setError("You are not authorized to edit this studio.");
          return;
        }

        setStudio(currentStudio);
        setAmenities(currentStudio.amenities.join(", "));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load studio"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudio();
  }, [id, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!studio) return;

    setSaving(true);
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    const updatedData = {
      title: formData.get("title"),
      category: formData.get("category"),
      hourlyRate: Number(formData.get("hourlyRate")),
      securityDeposit: Number(formData.get("securityDeposit")),
      maxCapacity: Number(formData.get("maxCapacity")),
      location: formData.get("location"),
      address: formData.get("address"),
      image: formData.get("image"),
      amenities: amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      overview: formData.get("overview"),
    };

    try {
      const response = await fetch(`${API_URL}/studios/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update studio");
      }

      setMessage("Studio updated successfully!");

      setTimeout(() => {
        router.push("/my-listings");
        router.refresh();
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#e9e6df] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#f36b38]";

  const labelClass = "mb-2 block text-sm font-semibold text-[#20201e]";

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6]">
        <p className="text-sm text-[#77756f]">Loading studio information...</p>
      </main>
    );
  }

  if (error && !studio) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6] px-5">
        <div className="rounded-2xl border border-[#e9e6df] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold">Unable to Edit Studio</h1>
          <p className="mt-3 text-sm text-red-600">{error}</p>
          <button
            onClick={() => router.push("/my-listings")}
            className="mt-6 rounded-full bg-[#f36b38] px-6 py-3 text-sm font-bold text-white"
          >
            Back to My Listings
          </button>
        </div>
      </main>
    );
  }

  if (!studio) return null;

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#f36b38]">
            MANAGE YOUR CREATIVE SPACE
          </p>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Edit Studio
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#77756f]">
            Update your studio information and save your changes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7 rounded-2xl border border-[#e9e6df] bg-white p-6 shadow-sm md:p-9"
        >
          <div>
            <label className={labelClass}>Studio Title *</label>
            <input
              name="title"
              required
              defaultValue={studio.title}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select
              name="category"
              required
              defaultValue={studio.category}
              className={inputClass}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className={labelClass}>Hourly Rate (৳) *</label>
              <input
                name="hourlyRate"
                type="number"
                min="1"
                required
                defaultValue={studio.hourlyRate}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Security Deposit (৳) *</label>
              <input
                name="securityDeposit"
                type="number"
                min="0"
                required
                defaultValue={studio.securityDeposit}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Max Capacity *</label>
              <input
                name="maxCapacity"
                type="number"
                min="1"
                required
                defaultValue={studio.maxCapacity}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Location *</label>
            <input
              name="location"
              required
              defaultValue={studio.location}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Full Address *</label>
            <input
              name="address"
              required
              defaultValue={studio.address}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Studio Image URL *</label>
            <input
              name="image"
              type="url"
              required
              defaultValue={studio.image}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Amenities *</label>
            <textarea
              value={amenities}
              onChange={(event) => setAmenities(event.target.value)}
              required
              rows={3}
              className={inputClass}
            />
            <p className="mt-2 text-xs text-[#77756f]">
              Separate each amenity with a comma.
            </p>
          </div>

          <div>
            <label className={labelClass}>Studio Overview *</label>
            <textarea
              name="overview"
              required
              rows={5}
              defaultValue={studio.overview}
              className={inputClass}
            />
          </div>

          <div className="border-t border-[#e9e6df] pt-6">
            <h2 className="mb-5 text-lg font-bold">Host Information</h2>

            <div className="mb-5">
              <label className={labelClass}>Host Name</label>
              <input
                value={studio.hostName}
                readOnly
                className={`${inputClass} bg-gray-100 text-gray-600`}
              />
            </div>

            <div>
              <label className={labelClass}>Host Email</label>
              <input
                value={studio.hostEmail}
                readOnly
                className={`${inputClass} bg-gray-100 text-gray-600`}
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {message && (
            <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-[#f36b38] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#dc5828] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Updating Studio..." : "Update Studio"}
          </button>
        </form>
      </div>
    </main>
  );
}
