
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api";

const categories = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

type User = {
  name: string;
  email: string;
};

export default function AddStudioPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [amenities, setAmenities] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load logged-in user information
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok || !result.user) {
          setError("Please login first to add a studio.");
          return;
        }

        setUser({
          name: result.user.name,
          email: result.user.email,
        });
      } catch (err) {
        console.error("User loading error:", err);
        setError("Unable to load your account information.");
      } finally {
        setUserLoading(false);
      }
    };

    getUser();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setError("Please login first.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const studioData = {
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
      hostName: user.name,
      hostEmail: user.email,
    };

    try {
      const response = await fetch(`${API_URL}/studios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(studioData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create studio");
      }

      setMessage("Studio created successfully!");

      setTimeout(() => {
        router.push("/my-listings");
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error("Studio creation error:", err);
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#e9e6df] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#f36b38]";

  const labelClass = "mb-2 block text-sm font-semibold text-[#20201e]";

  if (userLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6]">
        <p className="text-sm text-[#77756f]">
          Loading your account...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6] px-5">
        <div className="rounded-2xl border border-[#e9e6df] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">Login Required</h1>
          <p className="mt-3 text-sm text-[#77756f]">
            {error || "Please login to add a studio."}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-6 rounded-full bg-[#f36b38] px-6 py-3 text-sm font-bold text-white"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12 md:px-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#f36b38]">
            SHARE YOUR CREATIVE SPACE
          </p>

          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Add a New Studio
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#77756f]">
            Provide the details of your workspace so creators can discover it.
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
              placeholder="Enter studio name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select
              name="category"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select a category
              </option>
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
                placeholder="1200"
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
                placeholder="2000"
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
                placeholder="10"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Location *</label>
            <input
              name="location"
              required
              placeholder="Dhanmondi, Dhaka"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Full Address *</label>
            <input
              name="address"
              required
              placeholder="House, road, area and city"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Studio Image URL *</label>
            <input
              name="image"
              type="url"
              required
              placeholder="https://example.com/studio.jpg"
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
              placeholder="Wi-Fi, Air Conditioning, Lighting Equipment"
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
              placeholder="Describe your studio and its facilities..."
              className={inputClass}
            />
          </div>

          <div className="border-t border-[#e9e6df] pt-6">
            <h2 className="mb-5 text-lg font-bold">Host Information</h2>

            <div className="mb-5">
              <label className={labelClass}>Host Name</label>
              <input
                value={user.name}
                readOnly
                className={`${inputClass} bg-gray-100 text-gray-600`}
              />
            </div>

            <div>
              <label className={labelClass}>Host Email</label>
              <input
                value={user.email}
                readOnly
                className={`${inputClass} bg-gray-100 text-gray-600`}
              />
            </div>
            <p className="mt-2 text-xs text-[#77756f]">
              Host information is taken from your logged-in account.
            </p>
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
            disabled={loading}
            className="w-full rounded-full bg-[#f36b38] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#dc5828] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Publishing Studio..." : "Publish Studio"}
          </button>
        </form>
      </div>
    </main>
  );
}
