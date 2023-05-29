import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import { logout as doLogout } from "../apiCalls";
import Navbar from "./Navbar";

jest.mock("../apiCalls", () => ({
  logout: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
}));

describe("Navbar component", () => {
  const mockStore = configureMockStore();

  beforeEach(() => {
    const store = mockStore({
      user: { info: null },
      cart: { quantity: 0 },
    });

    render(
      <Provider store={store}>
        <Router>
          <Navbar />
        </Router>
      </Provider>
    );
  });

  test("Navbar renders correctly", () => {
    const logo = screen.getByRole("heading", { name: /Loja Virtual/i });
    expect(logo).toBeInTheDocument();
  });

  test("Search input updates value correctly", () => {
    const searchInput = screen.getByRole("textbox");
    const searchicon = screen.getByTestId("search-icon");
    fireEvent.change(searchInput, { target: { value: "searchtext" } });
    expect(searchInput.value).toBe("searchtext");
    fireEvent.click(searchicon);
    expect(window.location.href).toMatch(/searchtext/i);
  });

  test("Redirect to login and register when link is clicked", () => {
    const loginLink = screen.getAllByText("ENTRAR")[0];
    fireEvent.click(loginLink);
    expect(window.location.href).toMatch(/\/login/i);

    const registerLink = screen.getAllByText("CADASTRAR")[0];
    fireEvent.click(registerLink);
    expect(window.location.href).toMatch(/\/registrar/i);
  });

  test("logout user when the logout button is clicked", () => {
    const store = mockStore({
      user: { info: { firstname: "John", email: "johndeo@email.com" } },
      cart: { quantity: 0 },
    });

    render(
      <Provider store={store}>
        <Router>
          <Navbar />
        </Router>
      </Provider>
    );

    const logoutButton = screen.getAllByText("LOGOUT")[0];
    fireEvent.click(logoutButton);
    expect(doLogout).toHaveBeenCalled();
  });

  test("Side menu opens and closes correctly", () => {
    const sideMenuButton = screen.getByTestId("sidemenu-button");
    const sidemenu = screen.getByTestId("sidemenu");

    fireEvent.click(sideMenuButton);
    expect(document.body).toHaveClass("lockScroll");

    fireEvent.click(sideMenuButton);
    expect(sidemenu).toHaveStyle("left: -200px");
  });
});
