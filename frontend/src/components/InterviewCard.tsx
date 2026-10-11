import type { Interview } from "../types";
import { LinkButton, TechBadges } from "./ui";

function Cover({ src, role }: { src: string; role: string }) {
  return (
    <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-indigo-100 font-semibold text-indigo-700">
      {role.charAt(0).toUpperCase()}
      {/* Cover files are served by the frontend (/covers/*); hide when missing. */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 size-full bg-white object-contain p-1"
        onError={(e) => (e.currentTarget.style.display = "none")}
      />
    </div>
  );
}

export default function InterviewCard({ interview }: { interview: Interview }) {
  const date = new Date(interview.createdAt);
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <Cover src={interview.coverImage} role={interview.role} />
        <div className="min-w-0">
          <h3 className="truncate font-semibold capitalize text-zinc-900">{interview.role} interview</h3>
          <p className="text-sm text-zinc-500">
            {interview.level} · {interview.type}
            {!isNaN(date.getTime()) && ` · ${date.toLocaleDateString()}`}
          </p>
        </div>
      </div>
      <TechBadges items={interview.techStack} />
      <p className="text-sm text-zinc-600">{interview.questions.length} questions</p>
      <div className="mt-auto flex gap-2">
        <LinkButton to={`/interview/${interview.id}`} className="flex-1">Start</LinkButton>
        <LinkButton to={`/interview/${interview.id}/feedback`} variant="outline" className="flex-1">Feedback</LinkButton>
      </div>
    </article>
  );
}
