
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const slides = [
  {
    eyebrow: "YOUR SPACE. YOUR CREATION.",
    title: "Find the perfect space to bring your ideas to life.",
    description:
      "Discover inspiring photography studios, podcast rooms and creative spaces made for your next big project.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1800&q=85",
  },
  {
    eyebrow: "CREATE WITHOUT LIMITS.",
    title: "Great ideas deserve extraordinary spaces.",
    description:
      "From professional production studios to intimate creative corners, find a space that fits your vision.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1800&q=85",
  },
  {
    eyebrow: "MAKE ROOM FOR CREATIVITY.",
    title: "Your next masterpiece starts somewhere.",
    description:
      "Book beautiful, fully equipped creative spaces by the hour. Your next project starts here.",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800&q=85",
  },
];

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const router = useRouter();

  const currentSlide = slides[activeSlide];

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (location.trim()) params.set("location", location.trim());
    if (category) params.set("category", category);

    router.push(`/studios?${params.toString()}`);
  };

  return (
    <>
     
      <section className="px-4 pt-5 md:px-8">
        <div
          className="relative mx-auto flex min-h-[520px] max-w-[1440px] items-center overflow-hidden rounded-[28px] bg-cover bg-center transition-all duration-500 sm:min-h-[570px] md:min-h-[640px]"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(20,20,18,.83) 0%, rgba(20,20,18,.53) 55%, rgba(20,20,18,.12) 100%), url("${currentSlide.image}")`,
          }}
        >
          <div className="w-full max-w-3xl px-5 py-16 text-white sm:px-8 sm:py-20 md:px-16 md:py-24 lg:px-20">
            <span className="mb-7 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] backdrop-blur-sm">
              ✦ {currentSlide.eyebrow}
            </span>

            <h1 className="mb-5 text-3xl font-semibold leading-[1.2] tracking-tight sm:text-4xl md:mb-6 md:text-6xl lg:text-7xl">
              {currentSlide.title}
            </h1>

            <p className="mb-9 max-w-xl text-base leading-8 text-white/75 md:text-lg">
              {currentSlide.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/studios"
                className="rounded-full bg-[#f36b38] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#dc5828]"
              >
                Explore Studios ↗
              </Link>

              <Link
                href="/studios"
                className="rounded-full border border-white/50 px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[#20201e]"
              >
                Host Your Space
              </Link>
            </div>
          </div>

         
          <div className="absolute bottom-8 right-7 flex items-center gap-3 md:bottom-12 md:right-12">
            <span className="mr-2 text-sm font-medium text-white">
              0{activeSlide + 1} / 03
            </span>

            <button
              type="button"
              onClick={() =>
                setActiveSlide(
                  (activeSlide - 1 + slides.length) % slides.length
                )
              }
              aria-label="Previous slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 text-xl text-white transition hover:bg-white hover:text-black"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSlide((activeSlide + 1) % slides.length)
              }
              aria-label="Next slide"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 text-xl text-white transition hover:bg-white hover:text-black"
            >
              →
            </button>
          </div>
        </div>
      </section>

      
      <section className="relative z-10 mx-auto -mt-1 max-w-6xl px-5 md:-mt-9">
        <div className="grid grid-cols-1 gap-5 rounded-2xl border border-[#e9e6df] bg-white p-4 shadow-xl shadow-black/5 sm:p-5 md:grid-cols-[1fr_1fr_auto] md:items-end md:p-6">
          <div className="px-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#77756f]">
              Where are you creating?
            </label>

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter a city or location"
              className="w-full border-b border-[#e9e6df] bg-transparent py-2 text-sm outline-none placeholder:text-[#aaa] focus:border-[#f36b38]"
            />
          </div>

          <div className="px-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#77756f]">
              Studio category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-b border-[#e9e6df] bg-transparent py-2 text-sm outline-none focus:border-[#f36b38]"
            >
              <option value="">All Categories</option>
              <option value="Photo Studios">Photo Studios</option>
              <option value="Sound Stages">Sound Stages</option>
              <option value="Podcast Rooms">Podcast Rooms</option>
              <option value="Music Suites">Music Suites</option>
              <option value="Art Workshops">Art Workshops</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="w-full rounded-xl bg-[#f36b38] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#dc5828] md:w-auto"
          >
            Search Spaces ↗
          </button>
        </div>
      </section>
    </>
  );
}
