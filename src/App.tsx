import { useRoutes } from "react-router-dom";
import { appRoutes } from "./routes/app.routes";
import { AuthProvider } from "./context/AuthContext";
import type { JSX } from "react";

export default function App(): JSX.Element {
  const element = useRoutes(appRoutes);
  return <AuthProvider>{element}</AuthProvider>;
}