
"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";

interface BookingButtonProps {
  studioId: string;
  studioTitle: string;
  hourlyRate: number;
}

export default function BookingButton({
  studioId,
  studioTitle,
  hourlyRate,
}: BookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full rounded-xl bg-primary px-6 py-4 font-bold text-white transition hover:opacity-90"
      >
        Book Workspace Now
      </button>

      {isOpen && (
        <BookingModal
          studioId={studioId}
          studioTitle={studioTitle}
          hourlyRate={hourlyRate}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
