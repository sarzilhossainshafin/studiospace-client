
"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed.");
      }

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
        throw new Error(result.message || "Google login failed.");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google login failed. Please try again."
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold">
            Studio<span className="text-primary">Space.</span>
          </Link>

          <h1 className="mt-6 text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-2 text-muted">
            Sign in to continue to your creative workspace.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
            />

            <div className="mt-2 text-right">
              <span className="text-xs text-muted">
                Forgot password?
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-xl bg-primary px-5 py-3.5 font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
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
                setError("Google login was unsuccessful. Please try again.");
              }}
              text="signin_with"
              shape="rectangular"
              theme="outline"
              size="large"
              width="320"
            />
          </div>
        </div>

        <p className="mt-7 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-primary hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </section>
  );
}
