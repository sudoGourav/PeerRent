export default function ItemForm({
  title,
  setTitle,
  description,
  setDescription,
  dailyRate,
  setDailyRate,
  deposit,
  setDeposit,
  categoryId,
  setCategoryId,
  categories,
  preview,
  handleImageChange,
  handleSubmit,
  loading,
  submitText,
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl bg-white p-5 shadow-lg sm:p-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Image */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Item Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-5 h-56 w-full rounded-xl border object-cover shadow sm:h-72"
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Canon DSLR Camera"
            className="w-full rounded-xl border border-gray-300 p-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Describe your item..."
            className="w-full rounded-xl border border-gray-300 p-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Rates */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Daily Rate
            </label>

            <input
              type="number"
              value={dailyRate}
              onChange={(e) =>
                setDailyRate(e.target.value)
              }
              placeholder="500"
              className="w-full rounded-xl border border-gray-300 p-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Deposit
            </label>

            <input
              type="number"
              value={deposit}
              onChange={(e) =>
                setDeposit(e.target.value)
              }
              placeholder="2000"
              className="w-full rounded-xl border border-gray-300 p-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 p-3 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="">
              Select Category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 text-lg font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading
            ? "Please wait..."
            : submitText}
        </button>
      </form>
    </div>
  );
}