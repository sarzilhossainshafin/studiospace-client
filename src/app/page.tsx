
import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/home/HeroSlider";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Studio {
  _id: string;
  title: string;
  category: string;
  location: string;
  hourlyRate: number;
  image: string;
}

const categories = [
  { icon: "📸", name: "Photo Studios", count: "Photography spaces" },
  { icon: "🎬", name: "Sound Stages", count: "Film & production" },
  { icon: "🎙️", name: "Podcast Rooms", count: "Record your voice" },
  { icon: "🎵", name: "Music Suites", count: "Make some music" },
  { icon: "🎨", name: "Art Workshops", count: "Create something new" },
];

const steps = [
  {
    number: "01",
    icon: "⌕",
    title: "Discover a space",
    description:
      "Explore unique creative studios that match your vision, style and budget.",
  },
  {
    number: "02",
    icon: "◷",
    title: "Choose your time",
    description:
      "Select your preferred date and booking duration with just a few clicks.",
  },
  {
    number: "03",
    icon: "✓",
    title: "Confirm your booking",
    description:
      "Send your booking request and get ready for your creative session.",
  },
  {
    number: "04",
    icon: "✦",
    title: "Create something great",
    description:
      "Show up, make something amazing and bring your creative vision to life.",
  },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  let studios: Studio[] = [];

  try {
    const response = await fetch(`${API_URL}/api/studios`, {
      cache: "no-store",
    });

    if (response.ok) {
      const result = await response.json();
      studios = result.data || [];
    }
  } catch (error) {
    console.error("Failed to load studios:", error);
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#20201e]">
      <HeroSlider />

      <section className="mx-auto 	max-w-360 px-5 py-24 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#f36b38]">
              EXPLORE BY CATEGORY
            </p>

            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Find your creative space.
            </h2>
          </div>

          <Link
            href="/studios"
            className="text-sm font-bold text-[#f36b38] hover:underline"
          >
            View all categories ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((item) => (
            <Link
              href={`/studios?category=${encodeURIComponent(item.name)}`}
              key={item.name}
              className="group rounded-2xl border border-[#e9e6df] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#f36b38] hover:shadow-lg"
            >
              <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#faf1e9] text-3xl transition group-hover:bg-[#fce0d2]">
                {item.icon}
              </span>

              <h3 className="mb-2 text-base font-bold">{item.name}</h3>

              <p className="text-xs text-[#77756f]">{item.count}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f0eee8] py-24">
        <div className="mx-auto 	max-w-360 px-5 md:px-10">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#f36b38]">
                HANDPICKED FOR YOU
              </p>

              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Spaces worth creating in.
              </h2>

              <p className="mt-3 text-sm text-[#77756f]">
                Discover some of the most inspiring creative spaces.
              </p>
            </div>

            <Link
              href="/studios"
              className="rounded-full border border-[#20201e] px-6 py-3 text-sm font-bold transition hover:bg-[#20201e] hover:text-white"
            >
              Explore all studios ↗
            </Link>
          </div>

          {studios.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {studios.map((studio) => (
                <article
                  key={studio._id}
                  className="group overflow-hidden rounded-2xl bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link href={`/studios/${studio._id}`}>
                    <div className="relative h-60 overflow-hidden">
                      {studio.image && (
                        <Image
                          src={studio.image}
                          alt={studio.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>

                    <div className="p-5">
                      <p className="mb-2 text-xs font-semibold text-[#f36b38]">
                        {studio.category}
                      </p>

                      <h3 className="mb-2 text-lg font-bold">
                        {studio.title}
                      </h3>

                      <p className="mb-5 text-sm text-[#77756f]">
                        <span className="mr-1">⌖</span>
                        {studio.location}
                      </p>

                      <div className="flex items-center justify-between border-t border-[#eeeae3] pt-4">
                        <p className="text-sm text-[#77756f]">
                          <span className="text-lg font-bold text-[#20201e]">
                            ৳{studio.hourlyRate.toLocaleString("en-IN")}
                          </span>{" "}
                          / hour
                        </p>

                        <span className="text-sm font-bold text-[#f36b38]">
                          View Details ↗
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white px-5 py-16 text-center">
              <p className="text-lg font-semibold">
                No studios available yet.
              </p>
              <p className="mt-2 text-sm text-[#77756f]">
                Check back later for creative spaces.
              </p>
            </div>
          )}
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto 	max-w-360 px-5 py-24 md:px-10"
      >
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#f36b38]">
            SIMPLE AS IT SHOULD BE
          </p>

          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            From discovery to creation.
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#77756f]">
            Your perfect creative space is just a few simple steps away.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fce7dc] text-2xl text-[#f36b38]">
                {step.icon}
              </span>

              <p className="mb-3 text-xs font-bold tracking-widest text-[#f36b38]">
                STEP {step.number}
              </p>

              <h3 className="mb-3 text-lg font-bold">{step.title}</h3>

              <p className="text-sm leading-7 text-[#77756f]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="px-5 pb-24 md:px-10">
        <div className="mx-auto grid 	max-w-360 overflow-hidden rounded-[28px] bg-[#242421] md:grid-cols-2">
          <div className="flex flex-col justify-center px-8 py-16 text-white md:px-16">
            <p className="mb-4 text-xs font-bold tracking-[0.2em] text-[#f68a61]">
              FOR SPACE OWNERS
            </p>

            <h2 className="mb-6 text-3xl font-semibold leading-tight md:text-5xl">
              Your space has a story. Let creators tell it.
            </h2>

            <p className="mb-8 max-w-lg text-sm leading-7 text-white/60">
              Turn your creative space into an opportunity. List your studio,
              connect with creators and earn from your space.
            </p>

            <Link
              href="/studios"
              className="w-fit rounded-full bg-[#f36b38] px-7 py-4 text-sm font-bold text-white transition hover:bg-[#dc5828]"
            >
              Host Your Space ↗
            </Link>
          </div>

          <div
            className="	min-h-80 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85')",
            }}
          />
        </div>

        <div className="mx-auto mt-12 grid  gap	max-w-360-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e9e6df] bg-white p-7">
            <span className="text-2xl">🛡️</span>

            <h3 className="mt-4 mb-2 text-lg font-bold">Host Guarantee</h3>

            <p className="text-sm leading-7 text-[#77756f]">
              A transparent booking experience designed to help hosts manage
              their creative spaces with confidence.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9e6df] bg-white p-7">
            <span className="text-2xl">✦</span>

            <h3 className="mt-4 mb-2 text-lg font-bold">Creator Support</h3>

            <p className="text-sm leading-7 text-[#77756f]">
              Discover inspiring spaces and get the support you need to focus
              on what you do best: creating.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
