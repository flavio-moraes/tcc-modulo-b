import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import App from "./App";
import {
  getSession,
  setDispatch,
  publicRequest,
  privateRequest,
} from "./apiCalls";

jest.mock("./apiCalls", () => ({
  ...jest.requireActual("./apiCalls"),
  getSession: jest.fn(),
  publicRequest: jest.fn(),
}));

const mockStore = configureMockStore();

describe("App", () => {
  beforeEach(() => {
    getSession.mockImplementation(() => {
      return Promise.resolve({});
    });

    publicRequest.mockImplementation(() => {
      get: jest.fn().mockResolvedValue([{}]);
    });
  });

  it("renders customer-facing components for regular users", async () => {
    const state = {
      user: {
        info: {
          firstname: "John",
          lastname: "Doe",
          email: "johndoe@example.com",
          role: "client",
        },
      },
      cart: { quantity: 0 },
    };
    const store = mockStore(() => state);

    await act(async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      expect(
        screen.getByText("Conectando-se ao servidor.")
      ).toBeInTheDocument();

      await waitFor(() =>
        expect(screen.getByTestId("left-arrow")).toBeInTheDocument()
      );
      expect(
        screen.getByPlaceholderText("Qual produto você procura?")
      ).toBeInTheDocument();
      expect(screen.getAllByText(/Ver produto/i)[0]).toBeInTheDocument();
      expect(
        screen.getByText(/Copyright © Loja Virtual S.A./i)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Painel Administrativo/i)
      ).not.toBeInTheDocument();
    });
  });
});
