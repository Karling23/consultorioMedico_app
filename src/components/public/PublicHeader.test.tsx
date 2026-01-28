import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PublicHeader from "./PublicHeader";
import { BrowserRouter } from "react-router-dom";

describe("PublicHeader Component", () => {
  test("debe renderizar el nombre de la aplicación", () => {
    render(
      <BrowserRouter>
        <PublicHeader />
      </BrowserRouter>
    );
    expect(screen.getByText("VitaCare")).toBeInTheDocument();
  });

  test("debe contener enlaces de navegación", () => {
    render(
      <BrowserRouter>
        <PublicHeader />
      </BrowserRouter>
    );
    expect(screen.getByRole("link", { name: /Inicio/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Acceder/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Registrar/i })).toBeInTheDocument();
  });

  test("debe estar en la posición fixed (clase CSS de MUI AppBar)", () => {
    const { container } = render(
      <BrowserRouter>
        <PublicHeader />
      </BrowserRouter>
    );
    
    expect(container.querySelector("header")).toBeInTheDocument();
  });
});
