import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createFeedback, getInterview } from "../lib/api";
import { useAsync } from "../lib/useAsync";
import { canListen, canSpeak, listen, speak, stopSpeaking, type Listener } from "../lib/speech";
import type { Interview, TranscriptEntry } from "../types";
import { Button, ErrorBox, LinkButton, Spinner, TechBadges } from "../components/ui";

export default function InterviewSession() {
  const { id = "" } = useParams();
  const { data, error, loading, reload } = useAsync(() => getInterview(id), [id]);

  if (loading) return <Spinner label="Loading interview..." />;
  if (error || !data) return <ErrorBox message={error ?? "Interview not found."} onRetry={reload} />;
  return <Session interview={data} />;
}

function Session({ interview }: { interview: Interview }) {
  const navigate = useNavigate();
  const { questions } = interview;
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listener = useRef<Listener | null>(null);

  const isLast = index === questions.length - 1;
  const progress = Math.round(((started ? index + 1 : 0) / questions.length) * 100);

  // Read each question aloud when it becomes current.
  useEffect(() => {
    if (!started) return;
    setSpeaking(true);
    speak(questions[index], () => setSpeaking(false));
    return () => stopSpeaking();
  }, [started, index, questions]);

  useEffect(() => () => {
    listener.current?.stop();
    stopSpeaking();
  }, []);

  function toggleMic() {
    if (listening) return listener.current?.stop();
    stopSpeaking();
    setSpeaking(false);
    const base = answer ? answer + " " : "";
    listener.current = listen(
      (text) => setAnswer(base + text),
      (err) => {
        setListening(false);
        if (err && err !== "no-speech" && err !== "aborted") setError(`Microphone error: ${err}. You can type your answer instead.`);
      },
    );
    setListening(!!listener.current);
  }

  async function next() {
    listener.current?.stop();
    const entries: TranscriptEntry[] = [
      ...transcript,
      { role: "assistant", content: questions[index] },
      { role: "user", content: answer.trim() || "(no answer)" },
    ];
    setTranscript(entries);
    setAnswer("");
    setError(null);
    if (!isLast) return setIndex(index + 1);

    setSubmitting(true);
    try {
      const feedback = await createFeedback(interview.id, entries);
      navigate(`/interview/${interview.id}/feedback`, { state: { feedback } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate feedback.");
      // Let the user retry the final submission.
      setTranscript(transcript);
      setAnswer(answer);
      setSubmitting(false);
    }
  }

  if (submitting) return <Spinner label="Analysing your interview and generating feedback..." />;

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold capitalize">{interview.role} interview</h1>
        <p className="mb-2 text-zinc-600">{interview.level} · {interview.type}</p>
        <TechBadges items={interview.techStack} />
      </div>

      {!started ? (
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 text-center">
          <p className="text-sm text-zinc-600">
            You will be asked {questions.length} questions one at a time. Answer by speaking
            {canListen() ? "" : " (voice input is not supported in this browser, so type instead)"} or typing, then continue.
            {canSpeak() ? " Questions are read aloud." : ""}
          </p>
          <div className="flex justify-center gap-2">
            <Button onClick={() => setStarted(true)} disabled={questions.length === 0}>Start interview</Button>
            <LinkButton to={`/interview/${interview.id}/feedback`} variant="outline">Previous feedback</LinkButton>
          </div>
        </div>
      ) : (
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <div>
            <div className="flex justify-between text-sm font-medium text-indigo-700">
              <span>Question {index + 1} of {questions.length}</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-indigo-100">
              <div className="h-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="rounded-xl bg-indigo-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              Interviewer {speaking && "- speaking..."}
            </p>
            <p className="mt-1 text-lg leading-snug">{questions[index]}</p>
            {canSpeak() && (
              <button className="mt-2 text-xs text-indigo-600 underline" onClick={() => { setSpeaking(true); speak(questions[index], () => setSpeaking(false)); }}>
                Replay question
              </button>
            )}
          </div>

          <label className="block text-sm font-medium">
            Your answer
            <textarea
              className="mt-1.5 h-36 w-full rounded-lg border border-zinc-300 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Speak with the microphone or type here..."
            />
          </label>

          {error && <ErrorBox message={error} />}

          <div className="flex flex-wrap justify-between gap-2">
            {canListen() ? (
              <Button variant={listening ? "danger" : "outline"} onClick={toggleMic}>
                {listening ? "Stop recording" : "Record answer"}
              </Button>
            ) : <span />}
            <Button onClick={next}>{isLast ? "Finish & get feedback" : "Next question"}</Button>
          </div>
        </div>
      )}
    </section>
  );
}
