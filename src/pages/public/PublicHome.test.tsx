import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PublicHome from "./PublicHome";
import { BrowserRouter } from "react-router-dom";



describe("PublicHome Component", () => {
  test("debe renderizar el título principal", () => {
    render(
      <BrowserRouter>
        <PublicHome />
      </BrowserRouter>
    );

    expect(screen.getByText(/Cuidamos de ti/i)).toBeInTheDocument();
  });

  test("debe renderizar los botones de acción", () => {
    render(
      <BrowserRouter>
        <PublicHome />
      </BrowserRouter>
    );
    expect(screen.getByRole("link", { name: /Ingresar al Portal/i })).toBeInTheDocument();
  });

  test("debe mostrar las tarjetas de servicios", () => {
    render(
      <BrowserRouter>
        <PublicHome />
      </BrowserRouter>
    );
    expect(screen.getByText("Medicina General")).toBeInTheDocument();
    expect(screen.getByText("Especialidades")).toBeInTheDocument();
    expect(screen.getByText("Farmacia")).toBeInTheDocument();
  });
});
