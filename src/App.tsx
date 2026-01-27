import { useRoutes } from "react-router-dom";
import { appRoutes } from "./routes/app.routes";
import type { JSX } from "react";

export default function App(): JSX.Element | null {
  const element = useRoutes(appRoutes);
  return element;
}
