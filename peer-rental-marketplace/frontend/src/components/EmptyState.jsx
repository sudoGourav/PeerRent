import { Link } from "react-router-dom";

export default function EmptyState({
  icon = "📦",
  title,
  description,
  buttonText,
  buttonLink,
  onButtonClick,
}) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
      <div className="mb-5 text-7xl">{icon}</div>

      <h2 className="text-2xl font-bold text-gray-800">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-gray-500">
        {description}
      </p>

      {buttonText &&
        (buttonLink ? (
          <Link
            to={buttonLink}
            className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            {buttonText}
          </Link>
        ) : (
          <button
            onClick={onButtonClick}
            className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            {buttonText}
          </button>
        ))}
    </div>
  );
}