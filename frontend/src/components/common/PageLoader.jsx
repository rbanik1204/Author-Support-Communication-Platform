export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/80"
    >
      <svg
        aria-hidden="true"
        className="!w-10 !h-10 shrink-0 animate-spin text-blue-500"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "40px", height: "40px" }}
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="10"
          opacity="0.25"
          fill="none"
        />
        <path
          d="M50 5 A45 45 0 0 1 95 50"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <span className="sr-only">Loading...</span>
    </div>
  )
}
