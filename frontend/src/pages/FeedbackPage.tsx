import { useLocation, useParams } from "react-router-dom";
import { getFeedbackByInterview } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import type { Feedback } from "../types";
import { EmptyState, ErrorBox, LinkButton, Spinner } from "../components/ui";

const tone = (s: number) => (s >= 75 ? "bg-green-500" : s >= 50 ? "bg-amber-500" : "bg-red-500");

export default function FeedbackPage() {
  const { id = "" } = useParams();
  const passed = (useLocation().state as { feedback?: Feedback | null } | null)?.feedback ?? null;
  const { data, error, loading, reload } = useAsync(
    () => (passed ? Promise.resolve(passed) : getFeedbackByInterview(id)),
    [id],
  );

  if (loading) return <Spinner label="Loading feedback..." />;
  if (error) return <ErrorBox message={error} onRetry={reload} />;
  if (!data)
    return (
      <EmptyState title="No feedback yet">
        <p>Complete the interview to receive feedback.</p>
        <LinkButton to={`/interview/${id}`} className="mt-4">Take interview</LinkButton>
      </EmptyState>
    );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Interview feedback</h1>
        <div className="flex gap-2">
          <LinkButton to={`/interview/${id}`} variant="outline">Retake</LinkButton>
          <LinkButton to="/">Dashboard</LinkButton>
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-8 text-center">
        <p className="text-sm font-medium text-indigo-600">Overall score</p>
        <p className="mt-1 text-5xl font-bold text-indigo-700">
          {data.totalScore}<span className="text-2xl text-indigo-400">/100</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.categoryScores.map((c) => (
          <div key={c.name} className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{c.name}</h3>
              <span className="font-bold text-indigo-600">{c.score}/100</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div className={`h-full ${tone(c.score)}`} style={{ width: `${Math.min(100, Math.max(0, c.score))}%` }} />
            </div>
            <p className="mt-3 text-sm text-zinc-600">{c.comment}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <List title="Strengths" items={data.strengths} cls="border-green-200 bg-green-50 text-green-900" />
        <List title="Areas for improvement" items={data.areasForImprovement} cls="border-amber-200 bg-amber-50 text-amber-900" />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <h3 className="font-semibold">Final assessment</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{data.finalAssessment}</p>
      </div>
    </section>
  );
}

function List({ title, items, cls }: { title: string; items: string[]; cls: string }) {
  return (
    <div className={`rounded-xl border p-5 ${cls}`}>
      <h3 className="font-semibold">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {items.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  );
}
