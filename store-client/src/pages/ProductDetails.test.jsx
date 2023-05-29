import React from "react";
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { addUserFavorite, getProduct, removeUserFavorite } from "../apiCalls";
import ProductDetails from "./ProductDetails";
import { saveCartThunk } from "../redux/cartSlice";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

jest.mock("../apiCalls");

jest.mock("../redux/cartSlice", () => ({
  ...jest.requireActual("../redux/cartSlice"),
  saveCartThunk: jest.fn(),
}));

const mockStore = configureMockStore();

const mockProduct = {
  name: "Test Product",
  description: "This is a test product",
  variants: [
    {
      id: "1",
      name: "Test Variant 1",
      price: 10,
      stock: 2,
    },
    {
      id: "2",
      name: "Test Variant 2",
      price: 20,
      stock: 1,
    },
  ],
  categories: [],
  image: "product.jpg",
};

describe("ProductDetails page", () => {
  let state = {
    user: {
      info: {
        id: 100,
        firstname: "John",
        email: "johndeo@email.com",
      },
      isFetching: false,
      error: null,
      errorCode: 0,
    },
    cart: { quantity: 0 },
  };
  let store = mockStore(() => state);

  beforeEach(() => {
    useLocation.mockImplementation(() => {
      return {
        pathname: "loja/produto/123",
      };
    });

    getProduct.mockImplementation(() => {
      return Promise.resolve(mockProduct);
    });

    saveCartThunk.mockImplementation(() => {
      return {
        type: "cart/saveCartThunk",
      };
    });
  });

  it("renders the product information correctly", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <ProductDetails />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getProduct).toHaveBeenCalledTimes(1));
      expect(await screen.findByText("Test Product")).toBeInTheDocument();
      expect(
        await screen.findByText("This is a test product")
      ).toBeInTheDocument();
      expect(await screen.findByText("Test Variant 1")).toBeInTheDocument();
      expect(await screen.findByText("R$ 10,00")).toBeInTheDocument();
    });
  });

  it("adds product to cart when clicking add button", async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <ProductDetails />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getProduct).toHaveBeenCalledTimes(1));

      fireEvent.click(screen.getByText(/Adicionar ao carrinho/i));

      const actions = store.getActions();
      expect(actions).toHaveLength(2);
      expect(actions[0].type).toEqual("cart/addCartItem");
      expect(actions[1].type).toEqual("cart/saveCartThunk");
    });
  });

  it("shows an error message when product variant is out of stock", async () => {
    getProduct.mockImplementation(() => {
      return Promise.resolve({
        name: "Test Product",
        description: "This is a test product",
        variants: [
          {
            id: "3",
            name: "Test Variant 3",
            price: 30,
            stock: 0,
          },
          {
            id: "4",
            name: "Test Variant 4",
            price: 40,
            stock: 4,
          },
        ],
        categories: [],
        image: "product.jpg",
      });
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <Router>
            <ProductDetails />
          </Router>
        </Provider>
      );

      await waitFor(() => expect(getProduct).toHaveBeenCalledTimes(1));

      expect(await screen.findByText("Test Variant 3")).toBeInTheDocument();
      expect(await screen.findByText(/R\$ 30,00/)).toBeInTheDocument();
      const noStock = await screen.findByText("Sem estoque.");
      expect(noStock).toBeInTheDocument();

      userEvent.selectOptions(document.getElementById("select"), "1");
      expect(await screen.findByText("Test Variant 4")).toBeInTheDocument();
      expect(await screen.findByText(/R\$ 40,00/)).toBeInTheDocument();
    });
  });
});
