
"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const { name, email, password } = formData;

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          photoURL: formData.photoURL,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed.");
      }

      setMessage("Registration successful! Redirecting...");
      
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setError("");
    setMessage("");

    try {
      setGoogleLoading(true);

      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ credential }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Google registration failed.");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google registration failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold">
            Studio<span className="text-primary">Space.</span>
          </Link>

          <h1 className="mt-6 text-3xl font-bold">
            Create Your Account
          </h1>

          <p className="mt-2 text-muted">
            Join StudioSpace and discover creative spaces.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="photoURL" className="mb-2 block text-sm font-semibold">
              Photo URL
            </label>

            <input
              id="photoURL"
              name="photoURL"
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={formData.photoURL}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
            />

            <p className="mt-2 text-xs text-muted">
              At least 6 characters, including uppercase and lowercase letters.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-xl bg-primary px-5 py-3.5 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="flex justify-center">
          <div className={googleLoading ? "pointer-events-none opacity-60" : ""}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  handleGoogleSuccess(credentialResponse.credential);
                } else {
                  setError("Google did not provide a login credential.");
                }
              }}
              onError={() => {
                setError("Google sign up was unsuccessful. Please try again.");
              }}
              text="signup_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="320"
            />
          </div>
        </div>

        <p className="mt-7 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </section>
  );
}
