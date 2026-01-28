import { render, screen } from "@testing-library/react";
import PublicFooter from "./PublicFooter";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

describe("PublicFooter Component", () => {
  test("debe renderizar el texto de copyright", () => {
    render(
      <BrowserRouter>
        <PublicFooter />
      </BrowserRouter>
    );
    expect(screen.getByText(/© 2026 VitaCare/i)).toBeInTheDocument();
    expect(screen.getByText(/Todos los derechos reservados/i)).toBeInTheDocument();
  });

  test("debe ser un elemento footer semántico", () => {
    render(
      <BrowserRouter>
        <PublicFooter />
      </BrowserRouter>
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
