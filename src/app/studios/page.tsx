
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  image: string;
  overview: string;
}

type PageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
  }>;
};

export default async function ExploreStudios({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || "";
  const selectedSort = params.sort || "";

  let studios: Studio[] = [];

  try {
    const response = await fetch(`${API_URL}/api/studios`, {
      cache: "no-store",
    });

    if (response.ok) {
      const result = await response.json();
      studios = result.data || result;
    }
  } catch (error) {
    console.error("Failed to load studios:", error);
  }

  // Filter by category
  if (selectedCategory) {
    studios = studios.filter(
      (studio) => studio.category === selectedCategory
    );
  }

  // Sort by hourly rate
  if (selectedSort === "low-high") {
    studios.sort((a, b) => a.hourlyRate - b.hourlyRate);
  } else if (selectedSort === "high-low") {
    studios.sort((a, b) => b.hourlyRate - a.hourlyRate);
  }

  const categories = [
    "Photo Studios",
    "Sound Stages",
    "Podcast Rooms",
    "Music Suites",
    "Art Workshops",
  ];

  return (
    <section className="mx-auto min-h-screen max-w-7xl px-5 py-12">
      {/* Page Heading */}
      <div className="mb-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-primary">
          Find Your Creative Space
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          Explore Studios
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-muted">
          Discover inspiring creative spaces for your next project.
          Find the right studio and bring your ideas to life.
        </p>
      </div>

      {/* Filters */}
      <form
        action="/studios"
        method="GET"
        className="mb-10 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-semibold"
          >
            Filter by Category
          </label>

          <select
            id="category"
            name="category"
            defaultValue={selectedCategory}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label
            htmlFor="sort"
            className="mb-2 block text-sm font-semibold"
          >
            Sort by Price
          </label>

          <select
            id="sort"
            name="sort"
            defaultValue={selectedSort}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          >
            <option value="">Default</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-primary px-7 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Apply Filters
        </button>

        <Link
          href="/studios"
          className="rounded-xl border border-border px-7 py-3 text-center font-semibold transition hover:bg-secondary"
        >
          Reset
        </Link>
      </form>

      {/* Results */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Available Studios
        </h2>

        <p className="text-sm text-muted">
          {studios.length} Studios Found
        </p>
      </div>

      {studios.length > 0 ? (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <Link
              href={`/studios/${studio._id}`}
              key={studio._id}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="overflow-hidden">
                <img
                  src={studio.image}
                  alt={studio.title}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {studio.category}
                </span>

                <h3 className="mt-4 text-xl font-bold transition group-hover:text-primary">
                  {studio.title}
                </h3>

                <p className="mt-2 text-sm text-muted">
                  📍 {studio.location}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <p className="text-lg font-bold text-primary">
                    ৳{studio.hourlyRate}
                    <span className="text-sm font-normal text-muted">
                      /hour
                    </span>
                  </p>

                  <span className="text-sm font-semibold">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card px-5 py-16 text-center">
          <div className="mb-4 text-5xl">🏢</div>

          <h3 className="text-xl font-bold">
            No Studios Found
          </h3>

          <p className="mt-2 text-muted">
            No studios are available in this category yet.
          </p>

          <Link
            href="/studios"
            className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white"
          >
            View All Studios
          </Link>
        </div>
      )}
    </section>
  );
}
