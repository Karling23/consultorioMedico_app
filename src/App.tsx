import { useRoutes } from "react-router-dom";
import { appRoutes } from "./routes/app.routes";
import type { JSX } from "react";
import ScrollToHashElement from "./components/ScrollToHashElement";

export default function App(): JSX.Element | null {
  const element = useRoutes(appRoutes);
  return (
    <>
      <ScrollToHashElement />
      {element}
    </>
  );
}
