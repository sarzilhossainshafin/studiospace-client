
"use client";

import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface BookingModalProps {
  studioId: string;
  studioTitle: string;
  hourlyRate: number;
  onClose: () => void;
}

export default function BookingModal({
  studioId,
  studioTitle,
  hourlyRate,
  onClose,
}: BookingModalProps) {
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const hours =
    startTime && endTime
      ? Math.max(
          0,
          (new Date(`2000-01-01T${endTime}`).getTime() -
            new Date(`2000-01-01T${startTime}`).getTime()) /
            3600000
        )
      : 0;

  const totalPrice = hours * hourlyRate;

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    if (!bookingDate || hours <= 0) {
      setMessage("Please select a valid date and time.");
      return;
    }

    setLoading(true);

    try {
      const userResponse = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include",
      });

      const userResult = await userResponse.json();
      const user = userResult.user || userResult.data;

      if (!userResponse.ok || !user?.email) {
        throw new Error("Please login before booking.");
      }

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          studioId,
          studioTitle,
          customerName: user.name,
          customerEmail: user.email,
          bookingDate,
          startTime,
          endTime,
          totalHours: hours,
          totalPrice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking failed.");
      }

      setMessage("Booking request submitted successfully!");
      setTimeout(onClose, 1200);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Book Workspace
          </h2>
          <button type="button" onClick={onClose} className="text-2xl text-gray-500">
            ×
          </button>
        </div>

        <p className="mb-5 text-sm text-gray-600">{studioTitle}</p>

        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Booking Date
            </label>
            <input
              type="date"
              required
              min={new Date().toLocaleDateString("en-CA")}
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 p-3 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 text-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-3 text-gray-900"
              />
            </div>
          </div>

          <div className="rounded-xl bg-gray-100 p-4 text-gray-800">
            <div className="flex justify-between text-sm">
              <span>Hourly Rate</span>
              <span>৳{hourlyRate}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span>Total Hours</span>
              <span>{hours}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-gray-300 pt-3 font-bold">
              <span>Total Price</span>
              <span className="text-primary">৳{totalPrice}</span>
            </div>
          </div>

          {message && (
            <p className="rounded-lg bg-gray-100 p-3 text-sm text-gray-800">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 font-bold text-white disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}
