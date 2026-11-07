
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import BookingButton from "./BookingButton";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Studio {
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
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudioDetails({ params }: PageProps) {
  const { id } = await params;

  let studio: Studio;

  try {
    const response = await fetch(`${API_URL}/api/studios/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) notFound();

    const result = await response.json();
    studio = result.data || result;
  } catch {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <Link
        href="/studios"
        className="mb-8 inline-flex text-sm font-semibold text-primary hover:underline"
      >
        ← Back to Studios
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative h-75 overflow-hidden rounded-3xl bg-secondary sm:h-112.5">
          {studio.image && (
            <Image
              src={studio.image}
              alt={studio.title}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-col justify-center">
          <span className="mb-4 w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            {studio.category}
          </span>

          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
            {studio.title}
          </h1>

          <p className="mb-6 text-muted">📍 {studio.location}</p>

          <p className="mb-8 leading-8 text-muted">
            {studio.overview}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted">Hourly Rate</p>
              <h2 className="mt-2 text-2xl font-bold text-primary">
                ৳{studio.hourlyRate}/hour
              </h2>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted">Security Deposit</p>
              <h2 className="mt-2 text-2xl font-bold">
                ৳{studio.securityDeposit}
              </h2>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted">Maximum Capacity</p>
              <h2 className="mt-2 text-2xl font-bold">
                {studio.maxCapacity} People
              </h2>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm text-muted">Category</p>
              <h2 className="mt-2 text-lg font-bold">
                {studio.category}
              </h2>
            </div>
          </div>

          <div className="mt-8">
            <BookingButton
              studioId={studio._id}
              studioTitle={studio.title}
              hourlyRate={studio.hourlyRate}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-7">
          <h2 className="mb-4 text-xl font-bold">Studio Address</h2>
          <p className="leading-7 text-muted">{studio.address}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-7">
          <h2 className="mb-5 text-xl font-bold">Amenities</h2>

          {studio.amenities?.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {studio.amenities.map((amenity, index) => (
                <span
                  key={`${amenity}-${index}`}
                  className="rounded-full bg-secondary px-4 py-2 text-sm"
                >
                  ✓ {amenity}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted">No amenities listed.</p>
          )}
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-border bg-card p-7">
        <h2 className="mb-5 text-xl font-bold">Hosted By</h2>
        <p className="font-semibold">{studio.hostName}</p>
        <p className="mt-2 text-sm text-muted">{studio.hostEmail}</p>
      </div>
    </section>
  );
}
