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
    <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image */}
        <div>
          <label className="mb-2 block font-semibold">
            Item Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 h-64 w-full rounded-lg border object-cover"
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label className="mb-2 block font-semibold">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Canon DSLR Camera"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block font-semibold">
            Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Describe your item..."
          />
        </div>

        {/* Rates */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold">
              Daily Rate
            </label>

            <input
              type="number"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="500"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Deposit
            </label>

            <input
              type="number"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="2000"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block font-semibold">
            Category
          </label>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select Category</option>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? "Please wait..." : submitText}
        </button>
      </form>
    </div>
  );
}