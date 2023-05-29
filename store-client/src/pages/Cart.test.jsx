import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import Cart from "./Cart";
import {
  decraseOne,
  incraseOne,
  removeCartItem,
  saveCartThunk,
} from "../redux/cartSlice";
import Navbar from "../components/Navbar";

const mockStore = configureMockStore([]);

jest.mock("../components/Navbar");

jest.mock("../redux/cartSlice", () => ({
  ...jest.requireActual("../redux/cartSlice"),
  saveCartThunk: jest.fn(),
}));

describe("Cart page", () => {
  let component;
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
    cart: {
      items: [
        {
          productId: 1,
          productName: "Product 1",
          variantId: 1,
          variantName: "Variant 1",
          variantPrice: 10,
          quantity: 2,
          productImage: "/img/product1.jpg",
        },
        {
          productId: 2,
          productName: "Product 2",
          variantId: 2,
          variantName: "Variant 2",
          variantPrice: 20,
          quantity: 1,
          productImage: "/img/product2.jpg",
        },
      ],
      totalItems: 3,
      totalValue: 40,
    },
  };
  let store = mockStore(() => state);

  beforeEach(() => {
    Navbar.mockImplementation(() => {
      return <div></div>;
    });

    saveCartThunk.mockImplementation(() => {
      return {
        type: "cart/saveCartThunk",
      };
    });

    component = render(
      <Provider store={store}>
        <Router>
          <Cart />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    component.unmount();
    store = mockStore(() => state);
  });

  it("should render cart items and summary", () => {
    expect(screen.getByText("Carrinho de Compras")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getByText("Resumo da Compra")).toBeInTheDocument();
    expect(screen.getByText("Subtotal:")).toBeInTheDocument();
    expect(screen.getByText("R$ 40,00")).toBeInTheDocument();
  });

  it("should increase item quantity when clicking plus button", async () => {
    const increaseButton = screen.getAllByTestId("increase")[0];
    fireEvent.click(increaseButton);
    const actions = store.getActions();
    expect(actions).toHaveLength(2);
    expect(actions[0].type).toEqual("cart/incraseOne");
    expect(actions[1].type).toEqual("cart/saveCartThunk");
  });

  it("should decrease item quantity when clicking minus button", () => {
    const decreaseButton = screen.getAllByTestId("decrease")[0];
    fireEvent.click(decreaseButton);
    const actions = store.getActions();
    expect(actions).toHaveLength(2);
    expect(actions[0].type).toEqual("cart/decraseOne");
    expect(actions[1].type).toEqual("cart/saveCartThunk");
  });

  it("should remove item when clicking remove button", () => {
    const removeButton = screen.getAllByTestId("remove")[0];
    fireEvent.click(removeButton);
    const actions = store.getActions();
    expect(actions).toHaveLength(2);
    expect(actions[0].type).toEqual("cart/removeCartItem");
    expect(actions[1].type).toEqual("cart/saveCartThunk");
  });

  it("should displays empty cart message", () => {
    let store2 = mockStore({
      cart: {
        items: [],
        totalItems: 0,
        totalValue: 0,
      },
    });

    component.rerender(
      <Provider store={store2}>
        <Router>
          <Cart />
        </Router>
      </Provider>
    );

    expect(screen.getByText("Carrinho de compras vazio!")).toBeInTheDocument();
  });
});
