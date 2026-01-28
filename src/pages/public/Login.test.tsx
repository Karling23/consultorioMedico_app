import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));


const mockLogin = jest.fn();
const mockAuthValue = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: mockLogin,
  logout: jest.fn(),
  register: jest.fn(),
};

const renderWithRouterAndAuth = (component: React.ReactNode) => {
  return render(
    <AuthContext.Provider value={mockAuthValue}>
      <BrowserRouter>{component}</BrowserRouter>
    </AuthContext.Provider>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe renderizar el formulario de login correctamente", () => {
    renderWithRouterAndAuth(<Login />);
    
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });

  test("debe permitir escribir en los campos de usuario y contraseña", () => {
    renderWithRouterAndAuth(<Login />);
    
    const userInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);

    fireEvent.change(userInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(userInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  test("debe llamar a la función login al enviar el formulario", async () => {
    renderWithRouterAndAuth(<Login />);
    
    const userInput = screen.getByLabelText(/Usuario/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const submitButton = screen.getByRole("button", { name: /Entrar/i });

    fireEvent.change(userInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        nombre_usuario: "testuser",
        password: "password123",
      });
    });
  });
});
