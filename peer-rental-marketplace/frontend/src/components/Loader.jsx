export default function Loader({
  text = "Loading...",
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

      <p className="mt-4 text-gray-600">
        {text}
      </p>
    </div>
  );
}