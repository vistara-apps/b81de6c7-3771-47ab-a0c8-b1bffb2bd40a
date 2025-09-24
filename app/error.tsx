'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container py-8">
      <div className="card text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Something went wrong!
        </h2>
        <p className="text-text-secondary mb-6">
          We encountered an error while loading CircleUp.
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
