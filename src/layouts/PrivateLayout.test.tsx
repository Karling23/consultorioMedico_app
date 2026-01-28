import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PrivateLayout from "./PrivateLayout";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const mockUser = {
  id: 1,
  username: "AdminUser",
  rol: "admin",
  token: "fake-token"
};

const mockAuthValue = {
  user: mockUser,
  token: "fake-token",
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  register: jest.fn(),
};

const renderWithAuth = () => {
  return render(
    <AuthContext.Provider value={mockAuthValue}>
      <BrowserRouter>
        <PrivateLayout />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

describe("PrivateLayout Component", () => {
  test("debe mostrar el nombre del usuario y rol en el sidebar", () => {
    renderWithAuth();
    
    // Abrir el drawer
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);

    // Usamos getAllByText porque el nombre puede aparecer en el header y en el drawer
    expect(screen.getAllByText("AdminUser").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/admin/i).length).toBeGreaterThan(0);
  });

  test("debe renderizar elementos del menú lateral", () => {
    renderWithAuth();
    
    // Abrir el drawer
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByText("Medicamentos")).toBeInTheDocument();
    expect(screen.getByText("Pacientes")).toBeInTheDocument();
    expect(screen.getByText("Citas medicas")).toBeInTheDocument();
  });

  test("debe mostrar opción de Usuarios solo para admin", () => {
    renderWithAuth();
    
    // Abrir el drawer
    const menuButton = screen.getByRole("button", { name: /menu/i });
    fireEvent.click(menuButton);

    expect(screen.getByText("Usuarios")).toBeInTheDocument();
  });
});
