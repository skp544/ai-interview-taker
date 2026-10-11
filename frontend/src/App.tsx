import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import InterviewSession from "./pages/InterviewSession";
import FeedbackPage from "./pages/FeedbackPage";
import { EmptyState, LinkButton } from "./components/ui";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="interview/new" element={<CreateInterview />} />
        <Route path="interview/:id" element={<InterviewSession />} />
        <Route path="interview/:id/feedback" element={<FeedbackPage />} />
        <Route
          path="*"
          element={
            <EmptyState title="Page not found">
              <LinkButton to="/" className="mt-2">Back to dashboard</LinkButton>
            </EmptyState>
          }
        />
      </Route>
    </Routes>
  );
}
