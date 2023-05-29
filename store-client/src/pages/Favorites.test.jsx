import { act, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import Favorites from "./Favorites";
import { getProduct } from "../apiCalls";

jest.mock("../apiCalls");

const mockStore = configureMockStore();

const mockProducts = [
  {
    id: 1,
    name: "Product1",
    variants: [{ name: "var1", price: 20, stock: 2 }],
  },
  {
    id: 2,
    name: "Product2",
    variants: [{ name: "var2", price: 30, stock: 3 }],
  },
  {
    id: 3,
    name: "Product3",
    variants: [{ name: "var3", price: 10, stock: 5 }],
  },
];

describe("Favorites page", () => {
  let component;
  let state = {
    user: {
      info: {
        id: 100,
        firstname: "John",
        email: "johndeo@email.com",
        favorites: [0, 1, 2],
      },
      isFetching: false,
      error: null,
      errorCode: 0,
    },
    cart: {
      items: [],
      totalItems: 0,
      totalValue: 0,
    },
  };
  let store = mockStore(() => state);

  beforeEach(() => {});

  it("should show spinner when fetching products, fetchs the correct number of product and hide the spinner", async () => {
    getProduct.mockImplementation((i) => {
      return Promise.resolve(mockProducts[i]);
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <Favorites />
          </Router>
        </Provider>
      );

      const spinner = screen.getByTestId("spinner");
      expect(spinner).toBeInTheDocument();
      await waitFor(() => expect(getProduct).toHaveBeenCalled());
      expect(spinner).not.toBeInTheDocument();
    });
  });

  it("should show the favorite products", async () => {
    getProduct.mockImplementation((i) => {
      return Promise.resolve(mockProducts[i]);
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <Favorites />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getProduct).toHaveBeenCalledTimes(3));
      expect(screen.getByText("Meus Produtos Favoritos")).toBeInTheDocument();
      expect(await screen.findByText("Product1")).toBeInTheDocument();
      expect(await screen.findByText("Product2")).toBeInTheDocument();
    });
  });

  it("should show message when no favorites found", async () => {
    getProduct.mockImplementation((i) => {
      return Promise.resolve(mockProducts[i]);
    });

    let store2 = mockStore({
      user: {
        info: {
          id: 100,
          firstname: "John",
          email: "johndeo@email.com",
          favorites: [],
        },
        isFetching: false,
        error: null,
        errorCode: 0,
      },
      cart: {
        items: [],
        totalItems: 0,
        totalValue: 0,
      },
    });

    await act(async () => {
      render(
        <Provider store={store2}>
          <Router>
            <Favorites />
          </Router>
        </Provider>
      );

      expect(
        await screen.findByText("Sua lista de favoritos está vazia!")
      ).toBeInTheDocument();
    });
  });
});
