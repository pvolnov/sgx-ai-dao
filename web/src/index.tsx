import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { H2, Text } from "@uikit/typographic";
import App from "./App";

function Fallback({ error }: any) {
  console.error(error);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", flex: 1, padding: 24, textAlign: "center", gap: 24, justifyContent: "center", alignItems: "center" }}>
      <H2>Something went wrong:</H2>
      <Text style={{ maxWidth: 600 }}>{error.message}</Text>
    </div>
  );
}

function RootApp() {
  return (
    <>
      <ErrorBoundary FallbackComponent={Fallback}>
        <App />
      </ErrorBoundary>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<RootApp />);
