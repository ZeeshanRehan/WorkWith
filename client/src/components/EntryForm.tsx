import { useState } from "react";

type EntryFormProps = {
  onSuccess: () => void;
};

type EntryFormState = {
  metric: string;
  value: string;
};

function EntryForm({ onSuccess }: EntryFormProps) {
  const [formData, setFormData] = useState<EntryFormState>({
    metric: "",
    value: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupId: "default",
          metric: formData.metric,
          value: formData.value,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.message || "Failed to create entry");
      }

      setFormData({
        metric: "",
        value: "",
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-700"
            htmlFor="metric"
          >
            Metric
          </label>
          <input
            id="metric"
            name="metric"
            type="text"
            value={formData.metric}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
            placeholder="LC"
            required
          />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-medium text-slate-700"
            htmlFor="value"
          >
            Value
          </label>
          <input
            id="value"
            name="value"
            type="text"
            value={formData.value}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-slate-500"
            placeholder="Enter value"
            required
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Saving..." : "Add Entry"}
      </button>
    </form>
  );
}

export default EntryForm;
