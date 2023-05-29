import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import Login from "./Login";
import { login, oauthLoginPopup } from "../apiCalls";

const mockStore = configureMockStore();

jest.mock("../apiCalls", () => ({
  login: jest.fn(),
  oauthLoginPopup: jest.fn(),
}));

describe("Login page", () => {
  let store;
  let state;

  beforeEach(() => {
    state = {
      user: {
        info: null,
        isFetching: false,
        error: null,
      },
      cart: { quantity: 0 },
    };
    store = mockStore(() => state);
  });

  it("should render the Login component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText("Já sou cliente:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Senha")).toBeInTheDocument();
    expect(screen.getByText("Criar uma nova Conta")).toBeInTheDocument();
    expect(
      screen.getByText("Ou entre com sua rede social:")
    ).toBeInTheDocument();
  });

  it("should call the login function when the login button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "test123" },
    });

    const buttons = screen.getAllByRole("button");

    const loginButton = buttons.filter((el, i) => {
      let hasText = [...el.childNodes].filter((el2, i2) => {
        return el2.nodeType == Node.TEXT_NODE && el2.nodeValue === "ENTRAR";
      });
      return hasText[0];
    })[0];

    fireEvent.click(loginButton);

    expect(login).toHaveBeenCalled();
  });

  it("should show an error message if the login fails", async () => {
    login.mockImplementation(() => {
      state = {
        user: {
          info: null,
          isFetching: false,
          error: true,
        },
        cart: { quantity: 1 },
      };
      store.dispatch({ type: "ANY_ACTION" });
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("E-mail"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Senha"), {
      target: { value: "test123" },
    });

    const buttons = screen.getAllByRole("button");

    const loginButton = buttons.filter((el, i) => {
      let hasText = [...el.childNodes].filter((el2, i2) => {
        return el2.nodeType == Node.TEXT_NODE && el2.nodeValue === "ENTRAR";
      });
      return hasText[0];
    })[0];

    fireEvent.click(loginButton);

    const error = "Usuário ou senha inválidos.";
    expect(await screen.findByText(error)).toBeInTheDocument();
  });

  it("should call the popup function when a social login button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    const buttons = screen.getAllByRole("button");

    let loginButton = buttons.filter((el, i) => {
      return el.getAttribute("data-provider") === "google";
    });
    loginButton = loginButton[0];

    fireEvent.click(loginButton);

    expect(oauthLoginPopup).toHaveBeenCalled();
  });
});
