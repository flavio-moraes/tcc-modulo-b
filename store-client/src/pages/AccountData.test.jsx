import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import AccountData from "./AccountData";
import { getSession, updateUser } from "../apiCalls";
import { toast } from "react-toastify";

jest.mock("../apiCalls");

const mockStore = configureMockStore();

describe("AccountData page", () => {
  let state;
  let store;
  let component;
  const initialState = {
    user: {
      info: {
        firstname: "John",
        lastname: "Doe",
        email: "johndoe@example.com",
        password: "000000",
        address: {
          streetName: "Rua A",
          streetNumber: "123",
          cityName: "Test City",
          stateName: "JS",
          zipCode: "12345-678",
        },
        image: "user.jpg",
      },
    },
    cart: { quantity: 0 },
  };

  beforeEach(() => {
    state = { ...initialState };
    store = mockStore(() => state);

    updateUser.mockImplementation(() => {
      return Promise.resolve({
        msg: "success",
      });
    });

    getSession.mockImplementation(() => {
      store.dispatch({ type: "ANY_ACTION" });
    });

    component = render(
      <Provider store={store}>
        <Router>
          <AccountData />
        </Router>
      </Provider>
    );
  });

  afterEach(() => {
    component.unmount();
  });

  it("should render account data form", () => {
    expect(
      screen.getByRole("heading", { name: "Minha Conta" })
    ).toBeInTheDocument();
    expect(screen.getByText("Nome:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Sobrenome:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sobrenome")).toBeInTheDocument();
    expect(screen.getByText("E-mail:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
    expect(screen.getByText("Senha:")).toBeInTheDocument();
    expect(screen.getByText("Rua:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome da rua")).toBeInTheDocument();
    expect(screen.getByText("Número:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nº do imóvel")).toBeInTheDocument();
    expect(screen.getByText("Cidade:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nome da cidade")).toBeInTheDocument();
    expect(screen.getByText("Estado:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Sigla do Estado")).toBeInTheDocument();
    expect(screen.getByText("CEP:")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("CEP")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Modificar dados da conta" })
    ).toBeInTheDocument();
  });

  it("should allow editing account data and save then", async () => {
    const nameInput = screen.getByPlaceholderText("Nome");
    expect(nameInput.value).toEqual("John");
    expect(nameInput.disabled).toBe(true);

    const lastnameInput = screen.getByPlaceholderText("Sobrenome");
    expect(lastnameInput.value).toEqual("Doe");
    expect(lastnameInput.disabled).toBe(true);

    const emailInput = screen.getByPlaceholderText("E-mail");
    expect(emailInput.value).toEqual("johndoe@example.com");
    expect(emailInput.disabled).toBe(true);

    const streetNameInput = screen.getByPlaceholderText("Nome da rua");
    expect(streetNameInput.value).toEqual("Rua A");
    expect(streetNameInput.disabled).toBe(true);

    const streetNumberInput = screen.getByPlaceholderText("Nº do imóvel");
    expect(streetNumberInput.value).toEqual("123");
    expect(streetNumberInput.disabled).toBe(true);

    const cityNameInput = screen.getByPlaceholderText("Nome da cidade");
    expect(cityNameInput.value).toEqual("Test City");
    expect(cityNameInput.disabled).toBe(true);

    const stateInput = screen.getByPlaceholderText("Sigla do Estado");
    expect(stateInput.value).toEqual("JS");
    expect(stateInput.disabled).toBe(true);

    const zipCodeInput = screen.getByPlaceholderText("CEP");
    expect(zipCodeInput.value).toEqual("12345-678");
    expect(zipCodeInput.disabled).toBe(true);

    fireEvent.click(
      screen.getByRole("button", { name: "Modificar dados da conta" })
    );
    const submitButton = await screen.findByRole("button", {
      name: /Confirmar/,
    });
    expect(submitButton).toBeInTheDocument();

    expect(nameInput.disabled).toBe(false);
    fireEvent.change(nameInput, { target: { value: "Jane" } });
    expect(lastnameInput.disabled).toBe(false);
    fireEvent.change(lastnameInput, { target: { value: "Doa" } });
    expect(emailInput.disabled).toBe(false);
    fireEvent.change(emailInput, { target: { value: "janedoa@example.com" } });
    expect(streetNameInput.disabled).toBe(false);
    fireEvent.change(streetNameInput, { target: { value: "Rua B" } });
    expect(streetNumberInput.disabled).toBe(false);
    fireEvent.change(streetNumberInput, { target: { value: "456" } });
    expect(cityNameInput.disabled).toBe(false);
    fireEvent.change(cityNameInput, { target: { value: "Other City" } });
    expect(stateInput.disabled).toBe(false);
    fireEvent.change(stateInput, { target: { value: "TS" } });
    expect(zipCodeInput.disabled).toBe(false);
    fireEvent.change(zipCodeInput, { target: { value: "12345-679" } });

    await act(async () => {
      fireEvent.click(submitButton);
      expect(
        await screen.findByRole("button", { name: "Modificar dados da conta" })
      ).toBeInTheDocument();
    });

    expect(nameInput.value).toEqual("Jane");
    expect(nameInput.disabled).toBe(true);

    expect(lastnameInput.value).toEqual("Doa");
    expect(lastnameInput.disabled).toBe(true);

    expect(emailInput.value).toEqual("janedoa@example.com");
    expect(emailInput.disabled).toBe(true);

    expect(streetNameInput.value).toEqual("Rua B");
    expect(streetNameInput.disabled).toBe(true);

    expect(streetNumberInput.value).toEqual("456");
    expect(streetNumberInput.disabled).toBe(true);

    expect(cityNameInput.value).toEqual("Other City");
    expect(cityNameInput.disabled).toBe(true);

    expect(stateInput.value).toEqual("TS");
    expect(stateInput.disabled).toBe(true);

    expect(zipCodeInput.value).toEqual("12345-679");
    expect(zipCodeInput.disabled).toBe(true);
  });

  it("should allow cancel the account data changes", async () => {
    const nameInput = screen.getByPlaceholderText("Nome");
    expect(nameInput.value).toEqual("John");
    expect(nameInput.disabled).toBe(true);

    fireEvent.click(
      screen.getByRole("button", { name: "Modificar dados da conta" })
    );
    const cancelButton = await screen.findByRole("button", {
      name: /Cancelar/,
    });
    expect(cancelButton).toBeInTheDocument();
    expect(nameInput.disabled).toBe(false);

    fireEvent.change(nameInput, {
      target: { value: "Jane" },
    });

    await act(async () => {
      fireEvent.click(cancelButton);
      expect(
        await screen.findByRole("button", { name: "Modificar dados da conta" })
      ).toBeInTheDocument();
    });
    expect(nameInput.value).toEqual("John");
    expect(nameInput.disabled).toBe(true);
  });

  it("should shows an error message when no data is changed", async () => {
    const toastMock = jest.spyOn(toast, "error");

    fireEvent.click(
      screen.getByRole("button", { name: "Modificar dados da conta" })
    );
    const submitButton = await screen.findByRole("button", {
      name: /Confirmar/,
    });
    expect(submitButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(submitButton);

      expect(toastMock).toHaveBeenCalledWith(
        "É preciso haver alguma atualização nos dados."
      );
      expect(submitButton).toBeInTheDocument();
    });
  });

  it("should shows an error message when submit empty field", async () => {
    const toastMock = jest.spyOn(toast, "error");

    fireEvent.click(
      screen.getByRole("button", { name: "Modificar dados da conta" })
    );
    const submitButton = await screen.findByRole("button", {
      name: /Confirmar/,
    });
    expect(submitButton).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("Nome");
    fireEvent.change(nameInput, {
      target: { value: "" },
    });

    await act(async () => {
      fireEvent.click(submitButton);
      expect(toastMock).toHaveBeenCalledWith(
        "Os campos destacados devem ser preenchidos."
      );
      expect(nameInput).toHaveClass("invalid");
      expect(submitButton).toBeInTheDocument();
    });
  });

  it("should allow avatar image change", async () => {
    window.URL.createObjectURL = jest.fn();
    URL.createObjectURL.mockImplementation((file) => {
      return file.name;
    });

    const image = screen.getByTestId("image");
    expect(image.src).toMatch(/user\.jpg/);

    fireEvent.click(
      screen.getByRole("button", { name: "Modificar dados da conta" })
    );
    const confirmButton = await screen.findByRole("button", {
      name: /Confirmar/,
    });
    expect(confirmButton).toBeInTheDocument();

    await act(async () => {
      const removeImgButton = screen.getByText(/Remover imagem/);
      fireEvent.click(removeImgButton);
      await waitFor(() => expect(image.src).toMatch(/noimage\.svg/));

      const uploadImgButton = screen.getByText(/Carregar imagem/);
      const file = new File(["image"], "newimage.png", { type: "image/png" });
      fireEvent.change(document.getElementById("file"), {
        target: { files: [file] },
      });
      await waitFor(() => expect(image.src).toMatch(/newimage\.png/));

      fireEvent.click(confirmButton);
      await waitFor(() => expect(image.src).toMatch(/newimage\.png/));

      expect(
        await screen.findByRole("button", { name: "Modificar dados da conta" })
      ).toBeInTheDocument();
    });
  });
});
