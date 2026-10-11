import { useState } from "react";
import { listInterviews } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import InterviewCard from "../components/InterviewCard";
import { Button, EmptyState, ErrorBox, LinkButton, Spinner } from "../components/ui";

const LIMIT = 9;

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useAsync(() => listInterviews(page, LIMIT), [page]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-indigo-600 p-6 text-white sm:p-8">
        <div>
          <h1 className="text-2xl font-bold">Practice interviews with AI</h1>
          <p className="mt-1 text-indigo-100">Generate tailored questions, answer them, and get scored feedback.</p>
        </div>
        <LinkButton to="/interview/new" className="!bg-white !text-indigo-700 hover:!bg-indigo-50">
          Create interview
        </LinkButton>
      </div>

      <h2 className="text-lg font-semibold">Your interviews</h2>

      {loading ? (
        <Spinner label="Loading interviews..." />
      ) : error ? (
        <ErrorBox message={error} onRetry={reload} />
      ) : !data || data.length === 0 ? (
        page > 1 ? (
          <EmptyState title="No more interviews">
            <Button variant="outline" onClick={() => setPage(page - 1)}>Previous page</Button>
          </EmptyState>
        ) : (
          <EmptyState title="No interviews yet">Create your first mock interview to get started.</EmptyState>
        )
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((i) => (
              <InterviewCard key={i.id} interview={i} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="text-sm text-zinc-500">Page {page}</span>
            <Button variant="outline" disabled={data.length < LIMIT} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </>
      )}
    </section>
  );
}
