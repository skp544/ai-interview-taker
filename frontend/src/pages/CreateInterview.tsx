import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, createInterview } from "../lib/api";
import { Button, ErrorBox } from "../components/ui";

const LEVELS = ["Junior", "Mid", "Senior", "Lead"];
const TYPES = ["Technical", "Behavioural", "Mixed"];
const field =
  "mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200";

export default function CreateInterview() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Junior");
  const [type, setType] = useState("Mixed");
  const [stack, setStack] = useState("React, Node.js, TypeScript");
  const [amount, setAmount] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const techStack = stack.split(",").map((s) => s.trim()).filter(Boolean);
  const valid = role.trim() && techStack.length > 0 && amount >= 1 && amount <= 20;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await createInterview({ role: role.trim(), type, level, techStack, amount });
      navigate(`/interview/${created.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : "Failed to create interview.");
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold">Create interview</h1>
      <p className="mt-2 text-sm text-zinc-600">
        AI generates tailored questions for the role you describe. This can take a few seconds.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <label className="block text-sm font-medium">
          Job role
          <input className={field} value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Backend Developer" required />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Experience level
            <select className={field} value={level} onChange={(e) => setLevel(e.target.value)}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Interview focus
            <select className={field} value={type} onChange={(e) => setType(e.target.value)}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium">
          Tech stack <span className="font-normal text-zinc-500">(comma-separated)</span>
          <input className={field} value={stack} onChange={(e) => setStack(e.target.value)} required />
        </label>
        <label className="block text-sm font-medium">
          Number of questions <span className="font-normal text-zinc-500">(1-20)</span>
          <input
            className={field}
            type="number"
            min={1}
            max={20}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>

        {error && <ErrorBox message={error} />}

        <Button type="submit" className="w-full" disabled={!valid || submitting}>
          {submitting ? "Generating questions..." : "Generate interview"}
        </Button>
      </form>
    </section>
  );
}
