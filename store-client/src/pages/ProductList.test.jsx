import "@testing-library/jest-dom/extend-expect";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import ProductList from "./ProductList";
import {
  getAllProducts,
  getProductsByCategory,
  getProductsBySearch,
} from "../apiCalls";
import { useLocation } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("../apiCalls");

const mockStore = configureMockStore();

function elementContainsText(element, text) {
  if (element.nodeType === Node.TEXT_NODE && element.nodeValue.includes(text)) {
    return true;
  }

  if (element.nodeType === Node.ELEMENT_NODE) {
    for (let child of element.childNodes) {
      if (elementContainsText(child, text)) {
        return true;
      }
    }
  }

  return false;
}

describe("ProductList page", () => {
  let store;
  let state;
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

  test("renders loading spinner initially and remove it after getting products data", async () => {
    useLocation.mockImplementation(() => {
      return {
        search: "",
      };
    });

    getAllProducts.mockImplementation(() => {
      return Promise.resolve([
        {
          id: 1,
          name: "Product 1",
          variants: [{ name: "var1", price: 20, stock: 2 }],
        },
      ]);
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <ProductList />
          </Router>
        </Provider>
      );

      const spinner = screen.getByTestId("spinner");
      expect(spinner).toBeInTheDocument();

      await waitFor(() => expect(getAllProducts).toHaveBeenCalledTimes(1));
      expect(spinner).not.toBeInTheDocument();
    });
  });

  test("renders products after loading", async () => {
    useLocation.mockImplementation(() => {
      return {
        search: "",
      };
    });

    getAllProducts.mockImplementation(() => {
      return Promise.resolve([
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
      ]);
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <ProductList />
          </Router>
        </Provider>
      );

      await waitFor(() =>
        expect(screen.getByText(/Produtos:/)).toBeInTheDocument()
      );
      expect(await screen.findByText("Product1")).toBeInTheDocument();
      expect(await screen.findByText("Product2")).toBeInTheDocument();
    });
  });

  test("searches for products by query param", async () => {
    useLocation.mockImplementation(() => {
      return {
        search: "busca=shirt",
      };
    });

    getProductsBySearch.mockImplementation(() => {
      return Promise.resolve([
        {
          id: 1,
          name: "Shirt1",
          variants: [{ name: "var1", price: 20, stock: 2 }],
        },
      ]);
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <ProductList />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getProductsBySearch).toHaveBeenCalledTimes(1));
      expect(screen.getByText(/Resultado da busca por:/)).toBeInTheDocument();
      expect(await screen.findByText("Shirt1")).toBeInTheDocument();
    });
  });

  test("filters products by category", async () => {
    useLocation.mockImplementation(() => {
      return {
        search: "categoria=pants",
      };
    });

    getProductsByCategory.mockImplementation(() => {
      return Promise.resolve([
        {
          id: 1,
          name: "Pants1",
          variants: [{ name: "var1", price: 20, stock: 2 }],
        },
      ]);
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <ProductList />
          </Router>
        </Provider>
      );

      await waitFor(() =>
        expect(getProductsByCategory).toHaveBeenCalledTimes(1)
      );
      expect(screen.getByText(/Produtos:/)).toBeInTheDocument();
      expect(await screen.findByText("Pants1")).toBeInTheDocument();
    });
  });

  test("sorts products by price ascending and descending", async () => {
    useLocation.mockImplementation(() => {
      return {
        search: "",
      };
    });

    getAllProducts.mockImplementation(() => {
      return Promise.resolve([
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
      ]);
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <ProductList />
          </Router>
        </Provider>
      );

      await waitFor(() =>
        expect(screen.getByText(/Produtos:/)).toBeInTheDocument()
      );
      const product1 = await screen.findByText("Product1");
      const parent =
        product1.parentElement.parentElement.parentElement.parentElement;
      expect(parent.childElementCount).toBe(3);

      expect(elementContainsText(parent.children[0], "Product1")).toBe(true);
      userEvent.selectOptions(document.getElementById("sort"), "asc");
      await waitFor(() =>
        expect(elementContainsText(parent.children[0], "Product3")).toBe(true)
      );

      userEvent.selectOptions(document.getElementById("sort"), "desc");
      await waitFor(() =>
        expect(elementContainsText(parent.children[0], "Product2")).toBe(true)
      );
    });
  });
});
