import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockRegister = jest.fn();
const mockAuthValue = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: jest.fn(),
  logout: jest.fn(),
  register: mockRegister,
};

const renderWithRouterAndAuth = (component: React.ReactNode) => {
  return render(
    <AuthContext.Provider value={mockAuthValue}>
      <BrowserRouter>{component}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe renderizar el formulario de registro", () => {
    renderWithRouterAndAuth(<Register />);
    
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Registrar/i })).toBeInTheDocument();
  });

  test("debe mostrar el título de Registro", () => {
    renderWithRouterAndAuth(<Register />);
    expect(screen.getByRole("heading", { name: /Crear cuenta/i })).toBeInTheDocument();
  });

  test("debe llamar a register con los datos correctos", async () => {
    renderWithRouterAndAuth(<Register />);
    
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: "newuser" } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: "secret123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Registrar/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        nombre_usuario: "newuser",
        password: "secret123",
      });
    });
  });
});
