import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { register } from "../apiCalls";
import Register from "./Register";

const mockStore = configureMockStore();

jest.mock("../apiCalls", () => ({
  register: jest.fn(),
}));

describe("Register page", () => {
  let store;
  let state;
  let registerButton;

  beforeEach(() => {
    state = {
      user: {
        info: null,
        isFetching: false,
        error: null,
        errorCode: 0,
      },
      cart: { quantity: 0 },
    };
    store = mockStore(() => state);

    render(
      <Provider store={store}>
        <Router>
          <Register />
        </Router>
      </Provider>
    );

    registerButton = screen.getByRole("button", { name: /cadastrar/i });
  });

  it("should render all input fields", () => {
    expect(screen.getByPlaceholderText("Nome")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sobrenome")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Repetir senha")).toBeInTheDocument();
  });

  it("should display an error message when submitting the form with empty fields or some input is missing", () => {
    fireEvent.click(registerButton);
    expect(
      screen.getByText("Todos os campos devem ser preenchidos.")
    ).toBeInTheDocument();
  });

  it("should display an error message when the password and repeated password fields do not match", () => {
    const passwordInput = screen.getByPlaceholderText("Senha");
    const repeatedPasswordInput = screen.getByPlaceholderText("Repetir senha");

    fireEvent.change(screen.getByPlaceholderText("Nome"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Sobrenome"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "johndoe@example.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(repeatedPasswordInput, {
      target: { value: "password1234" },
    });
    fireEvent.click(registerButton);

    expect(
      screen.getByText("As senhas informadas devem ser idênticas.")
    ).toBeInTheDocument();
    expect(passwordInput.value).toEqual("password123");
    expect(repeatedPasswordInput.value).toEqual("password1234");
  });

  it("should call the register function with the correct user information when submitting the form", () => {
    fireEvent.change(screen.getByPlaceholderText("Nome"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Sobrenome"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "johndoe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir senha"), {
      target: { value: "password123" },
    });
    fireEvent.click(registerButton);

    expect(register).toHaveBeenCalledWith({
      firstname: "John",
      lastname: "Doe",
      email: "johndoe@example.com",
      password: "password123",
    });
  });

  it("should displays error message when registration fails", async () => {
    register.mockImplementation(() => {
      store.dispatch({ type: "ANY_ACTION" });
    });

    fireEvent.change(screen.getByPlaceholderText("Nome"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Sobrenome"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "johndoe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repetir senha"), {
      target: { value: "password123" },
    });

    state = {
      user: {
        info: null,
        isFetching: false,
        error: true,
        errorCode: 500,
      },
      cart: { quantity: 1 },
    };
    fireEvent.click(registerButton);
    expect(
      await screen.findByText("Ocorreu um erro no cadastro, tente novamente.")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "johndoe2@example.com" },
    });
    state = {
      user: {
        info: null,
        isFetching: false,
        error: true,
        errorCode: 11000,
      },
      cart: { quantity: 1 },
    };
    fireEvent.click(registerButton);
    expect(
      screen.getByText(
        "Já existe um cadastro com este e-mail. Use um e-mail diferente."
      )
    ).toBeInTheDocument();
  });
});
