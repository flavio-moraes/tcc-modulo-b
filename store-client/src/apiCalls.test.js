import {
  publicRequest,
  privateRequest,
  privateRequestUpload,
  setDispatch,
  login,
  register,
  getSession,
  logout,
  API_URL,
  oauthLoginPopup,
  SERVER_URL,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  addUserFavorite,
  removeUserFavorite,
  createProduct,
  updateProduct,
  getProduct,
  getAllProducts,
  deleteProduct,
  getProductsBySearch,
  getProductsByCategory,
  getProductsRandom,
  createCategory,
  deleteCategory,
  getAllCategories,
} from "./apiCalls.js";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  update,
  clearUser,
  setFavorites,
} from "./redux/userSlice.js";
import { updateCart } from "./redux/cartSlice";
import { io } from "socket.io-client";

jest.mock("socket.io-client");

describe("apiCalls functions", () => {
  test("login dispatches loginSuccess action when API call is successful", async () => {
    const dispatch = jest.fn();
    setDispatch(dispatch);
    const user = { email: "johndoe@example.com", password: "password" };

    privateRequest.post = jest.fn().mockResolvedValueOnce({
      data: { user: "user mock data", cart: "cart mock data" },
    });

    await login(user);
    expect(dispatch).toHaveBeenCalledWith(loginStart());
    expect(dispatch).toHaveBeenCalledWith(loginSuccess("user mock data"));
    expect(dispatch).toHaveBeenCalledWith(
      updateCart({ user: "user mock data", cart: "cart mock data" })
    );
  });

  test("login dispatches loginFailure action when API call fails", async () => {
    const dispatch = jest.fn();
    setDispatch(dispatch);
    const user = { email: "johndoe@example.com", password: "password" };

    privateRequest.post = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { code: 500 } } });

    await login(user);
    expect(dispatch).toHaveBeenCalledWith(loginStart());
    expect(dispatch).toHaveBeenCalledWith(loginFailure(500));
  });

  test("register dispatches loginSuccess action when API call is successful", async () => {
    const dispatch = jest.fn();
    setDispatch(dispatch);
    const user = {
      firstname: "John",
      lastname: "Doe",
      email: "johndoe@example.com",
      password: "password",
    };

    privateRequest.post = jest
      .fn()
      .mockResolvedValueOnce({ data: "mock data" });

    await register(user);
    expect(dispatch).toHaveBeenCalledWith(loginStart());
    expect(dispatch).toHaveBeenCalledWith(loginSuccess("mock data"));
  });

  test("register dispatches loginFailure action when API call fails", async () => {
    const dispatch = jest.fn();
    setDispatch(dispatch);
    const user = {
      firstname: "John",
      lastname: "Doe",
      email: "johndoe@example.com",
      password: "password",
    };

    privateRequest.post = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { code: 500 } } });

    await register(user);
    expect(dispatch).toHaveBeenCalledWith(loginStart());
    expect(dispatch).toHaveBeenCalledWith(loginFailure(500));
  });

  test("getSession dispatches update action when API call is successful", async () => {
    const dispatch = jest.fn();
    setDispatch(dispatch);

    privateRequest.get = jest.fn().mockResolvedValueOnce({ data: "mock data" });

    await getSession();
    expect(dispatch).toHaveBeenCalledWith(update("mock data"));
  });

  test("getSession dispatches clearUser action when API call fails", async () => {
    const dispatch = jest.fn();
    setDispatch(dispatch);

    privateRequest.get = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: 500 } } });

    await getSession();
    expect(dispatch).toHaveBeenCalledWith(clearUser());
  });

  test("logout calls the logout API in another window", () => {
    window.open = jest.fn();
    const windowMock = jest.spyOn(window, "open");
    logout();
    expect(windowMock).toHaveBeenCalledWith(API_URL + "/auth/logout", "_self");
  });

  test("oauthLoginPopup opens a popup window and receives data from the server", async () => {
    const dispatch = jest.fn();
    setDispatch(dispatch);
    const socketMock = {
      id: "mock-socket-id",
      on: jest.fn(),
      disconnect: jest.fn(),
    };
    io.mockImplementation(() => socketMock);
    const popupMock = { closed: false, close: jest.fn() };
    window.open = jest.fn(() => popupMock);

    const provider = "google";
    const popupCloseAction = jest.fn();
    oauthLoginPopup(provider, popupCloseAction);
    expect(io).toHaveBeenCalledWith(SERVER_URL, { withCredentials: true });
    expect(socketMock.on).toHaveBeenCalledTimes(2);
    expect(socketMock.on).toHaveBeenNthCalledWith(
      1,
      "connect",
      expect.any(Function)
    );
    expect(socketMock.on).toHaveBeenNthCalledWith(
      2,
      "disconnect",
      expect.any(Function)
    );

    const setIntervalSpy = jest.spyOn(window, "setInterval");
    socketMock.on.mock.calls[0][1]();
    const url = `${API_URL}/auth/${provider}?socketId=mock-socket-id`;
    expect(window.open).toHaveBeenCalledWith(url, "", expect.any(String));
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    expect(socketMock.on).toHaveBeenNthCalledWith(
      3,
      provider,
      expect.any(Function)
    );

    popupMock.closed = true;
    await new Promise((resolve) => setTimeout(resolve, 1100));
    expect(popupCloseAction).toHaveBeenCalled();
    expect(socketMock.disconnect).toHaveBeenCalled();

    const res = { user: { id: 1, name: "John Doe" } };
    socketMock.on.mock.calls[2][1](res);
    expect(popupMock.close).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(update(res));
    expect(socketMock.disconnect).toHaveBeenCalled();

    const logSpy = jest.spyOn(console, "log");
    socketMock.on.mock.calls[1][1]("reason");
    expect(logSpy).toHaveBeenCalledWith("Socket desconectado: ", "reason");
  });

  test("createUser should return created user data when API call is successful", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "johndoe@example.com");
    const resMock = { data: "mock data" };
    privateRequestUpload.post = jest.fn().mockResolvedValueOnce(resMock);

    const result = await createUser(formData);

    expect(privateRequestUpload.post).toHaveBeenCalledWith("/users", formData);
    expect(result).toEqual(resMock.data);
  });

  test("createUser should throw an error if API call fails", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");

    privateRequestUpload.post = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(createUser(formData)).rejects.toThrow("Failed");
    expect(privateRequestUpload.post).toHaveBeenCalledWith("/users", formData);
  });

  test("updateUser should return updated user data when API call is successful", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "johndoe@example.com");
    const id = 1;
    const resMock = { data: "mock data" };
    privateRequestUpload.put = jest.fn().mockResolvedValueOnce(resMock);

    const result = await updateUser(id, formData);

    expect(privateRequestUpload.put).toHaveBeenCalledWith(
      "/users/" + id,
      formData
    );
    expect(result).toEqual(resMock.data);
  });

  test("updateUser should throw an error if API call fails", async () => {
    const formData = new FormData();
    formData.append("name", "John Doe");
    formData.append("email", "john@example.com");
    const id = 1;

    privateRequestUpload.put = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(updateUser(id, formData)).rejects.toThrow("Failed");
    expect(privateRequestUpload.put).toHaveBeenCalledWith(
      "/users/" + id,
      formData
    );
  });

  test("deleteUser should return deleted user data when API call is successful", async () => {
    const id = 1;
    const resMock = { data: "mock data" };
    privateRequest.delete = jest.fn().mockResolvedValueOnce(resMock);

    const result = await deleteUser(id);

    expect(privateRequest.delete).toHaveBeenCalledWith("/users/" + id);
    expect(result).toEqual(resMock.data);
  });

  test("deleteUser should throw an error if API call fails", async () => {
    const id = 1;

    privateRequest.delete = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(deleteUser(id)).rejects.toThrow("Failed");
    expect(privateRequest.delete).toHaveBeenCalledWith("/users/" + id);
  });

  test("getUser should return requested user data when API call is successful", async () => {
    const id = 1;
    const resMock = { data: "mock data" };
    privateRequest.get = jest.fn().mockResolvedValueOnce(resMock);

    const result = await getUser(id);

    expect(privateRequest.get).toHaveBeenCalledWith("/users/" + id);
    expect(result).toEqual(resMock.data);
  });

  test("getUser should throw an error if API call fails", async () => {
    const id = 1;

    privateRequest.get = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(getUser(id)).rejects.toThrow("Failed");
    expect(privateRequest.get).toHaveBeenCalledWith("/users/" + id);
  });

  test("getAllUsers should return all users data when API call is successful", async () => {
    const resMock = { data: ["mock data 1", "mock data 2"] };
    privateRequest.get = jest.fn().mockResolvedValueOnce(resMock);

    const result = await getAllUsers();

    expect(privateRequest.get).toHaveBeenCalledWith("/users/");
    expect(result).toEqual(resMock.data);
  });

  test("getAllUsers should throw an error if API call fails", async () => {
    privateRequest.get = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(getAllUsers()).rejects.toThrow("Failed");
    expect(privateRequest.get).toHaveBeenCalledWith("/users/");
  });

  test("addUserFavorite should send and return favorite products data to be added when API call is successful", async () => {
    const dispatch = jest.fn();
    setDispatch(dispatch);

    const userId = 1;
    const favId = 2;
    const resMock = { data: { favorites: ["mock data"] } };
    privateRequest.post = jest.fn().mockResolvedValueOnce(resMock);

    const result = await addUserFavorite(userId, favId);

    expect(privateRequest.post).toHaveBeenCalledWith(
      "/users/" + userId + "/favorites/" + favId
    );
    expect(result).toEqual(resMock.data);
    expect(dispatch).toHaveBeenCalledWith(setFavorites(resMock.data.favorites));
  });

  test("addUserFavorite should throw an error if API call fails", async () => {
    const userId = 1;
    const favId = 2;

    privateRequest.post = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(addUserFavorite(userId, favId)).rejects.toThrow("Failed");
    expect(privateRequest.post).toHaveBeenCalledWith(
      "/users/" + userId + "/favorites/" + favId
    );
  });

  test("removeUserFavorite should send and return favorite products data to be removed when API call is successful", async () => {
    const dispatch = jest.fn();
    setDispatch(dispatch);

    const userId = 1;
    const favId = 2;
    const resMock = { data: { favorites: ["mock data"] } };
    privateRequest.delete = jest.fn().mockResolvedValueOnce(resMock);

    const result = await removeUserFavorite(userId, favId);

    expect(privateRequest.delete).toHaveBeenCalledWith(
      "/users/" + userId + "/favorites/" + favId
    );
    expect(result).toEqual(resMock.data);
    expect(dispatch).toHaveBeenCalledWith(setFavorites(resMock.data.favorites));
  });

  test("removeUserFavorite should throw an error if API call fails", async () => {
    const userId = 1;
    const favId = 2;

    privateRequest.delete = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(removeUserFavorite(userId, favId)).rejects.toThrow("Failed");
    expect(privateRequest.delete).toHaveBeenCalledWith(
      "/users/" + userId + "/favorites/" + favId
    );
  });

  test("createProduct should return created product data when API call is successful", async () => {
    const formData = new FormData();
    formData.append("name", "Product 1");
    formData.append("description", "Product information");
    const resMock = { data: "mock data" };
    privateRequestUpload.post = jest.fn().mockResolvedValueOnce(resMock);

    const result = await createProduct(formData);

    expect(privateRequestUpload.post).toHaveBeenCalledWith(
      "/products",
      formData
    );
    expect(result).toEqual(resMock.data);
  });

  test("createProduct should throw an error if API call fails", async () => {
    const formData = new FormData();
    formData.append("name", "Product 1");
    formData.append("description", "Product information");

    privateRequestUpload.post = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(createProduct(formData)).rejects.toThrow("Failed");
    expect(privateRequestUpload.post).toHaveBeenCalledWith(
      "/products",
      formData
    );
  });

  test("updateProduct should return updated product data when API call is successful", async () => {
    const formData = new FormData();
    formData.append("name", "Product 1");
    formData.append("description", "Product information");
    const id = 1;
    const resMock = { data: "mock data" };
    privateRequestUpload.put = jest.fn().mockResolvedValueOnce(resMock);

    const result = await updateProduct(id, formData);

    expect(privateRequestUpload.put).toHaveBeenCalledWith(
      "/products/" + id,
      formData
    );
    expect(result).toEqual(resMock.data);
  });

  test("updateProduct should throw an error if API call fails", async () => {
    const formData = new FormData();
    formData.append("name", "Product 1");
    formData.append("description", "Product information");
    const id = 1;

    privateRequestUpload.put = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(updateProduct(id, formData)).rejects.toThrow("Failed");
    expect(privateRequestUpload.put).toHaveBeenCalledWith(
      "/products/" + id,
      formData
    );
  });

  test("getProduct should return requested product data when API call is successful", async () => {
    const id = 1;
    const resMock = { data: "mock data" };
    publicRequest.get = jest.fn().mockResolvedValueOnce(resMock);

    const result = await getProduct(id);

    expect(publicRequest.get).toHaveBeenCalledWith("/products/" + id);
    expect(result).toEqual(resMock.data);
  });

  test("getProduct should throw an error if API call fails", async () => {
    const id = 1;

    publicRequest.get = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(getProduct(id)).rejects.toThrow("Failed");
    expect(publicRequest.get).toHaveBeenCalledWith("/products/" + id);
  });

  test("getAllProducts should return all products data when API call is successful", async () => {
    const resMock = { data: ["mock data 1", "mock data 2"] };
    publicRequest.get = jest.fn().mockResolvedValueOnce(resMock);

    const result = await getAllProducts();

    expect(publicRequest.get).toHaveBeenCalledWith("/products/");
    expect(result).toEqual(resMock.data);
  });

  test("getAllProducts should throw an error if API call fails", async () => {
    publicRequest.get = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(getAllProducts()).rejects.toThrow("Failed");
    expect(publicRequest.get).toHaveBeenCalledWith("/products/");
  });

  test("deleteProduct should return deleted product data when API call is successful", async () => {
    const id = 1;
    const resMock = { data: "mock data" };
    privateRequest.delete = jest.fn().mockResolvedValueOnce(resMock);

    const result = await deleteProduct(id);

    expect(privateRequest.delete).toHaveBeenCalledWith("/products/" + id);
    expect(result).toEqual(resMock.data);
  });

  test("deleteProduct should throw an error if API call fails", async () => {
    const id = 1;

    privateRequest.delete = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(deleteProduct(id)).rejects.toThrow("Failed");
    expect(privateRequest.delete).toHaveBeenCalledWith("/products/" + id);
  });

  test("getProductsBySearch should return requested product data when API call is successful", async () => {
    const keywords = "search words";
    const resMock = { data: "mock data" };
    publicRequest.get = jest.fn().mockResolvedValueOnce(resMock);

    const result = await getProductsBySearch(keywords);

    expect(publicRequest.get).toHaveBeenCalledWith(
      "/products?search=" + keywords
    );
    expect(result).toEqual(resMock.data);
  });

  test("getProductsBySearch should throw an error if API call fails", async () => {
    const keywords = "search words";

    publicRequest.get = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(getProductsBySearch(keywords)).rejects.toThrow("Failed");
    expect(publicRequest.get).toHaveBeenCalledWith(
      "/products?search=" + keywords
    );
  });

  test("getProductsByCategory should return requested product data when API call is successful", async () => {
    const categories = "cat1,cat2,cat3";
    const resMock = { data: "mock data" };
    publicRequest.get = jest.fn().mockResolvedValueOnce(resMock);

    const result = await getProductsByCategory(categories);

    expect(publicRequest.get).toHaveBeenCalledWith(
      "/products?category=" + categories
    );
    expect(result).toEqual(resMock.data);
  });

  test("getProductsByCategory should throw an error if API call fails", async () => {
    const categories = "cat1,cat2,cat3";

    publicRequest.get = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(getProductsByCategory(categories)).rejects.toThrow("Failed");
    expect(publicRequest.get).toHaveBeenCalledWith(
      "/products?category=" + categories
    );
  });

  test("getProductsRandom should return requested product data when API call is successful", async () => {
    const n = 8;
    const resMock = { data: "mock data" };
    publicRequest.get = jest.fn().mockResolvedValueOnce(resMock);

    const result = await getProductsRandom(n);

    expect(publicRequest.get).toHaveBeenCalledWith("/products?random=" + n);
    expect(result).toEqual(resMock.data);
  });

  test("getProductsRandom should throw an error if API call fails", async () => {
    const n = 8;

    publicRequest.get = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(getProductsRandom(n)).rejects.toThrow("Failed");
    expect(publicRequest.get).toHaveBeenCalledWith("/products?random=" + n);
  });

  test("createCategory should return created category data when API call is successful", async () => {
    const data = { name: "mock data" };
    const resMock = { data: "mock data" };
    privateRequest.post = jest.fn().mockResolvedValueOnce(resMock);

    const result = await createCategory(data);

    expect(privateRequest.post).toHaveBeenCalledWith("/categories/", data);
    expect(result).toEqual(resMock.data);
  });

  test("createCategory should throw an error if API call fails", async () => {
    const data = { name: "mock data" };

    privateRequest.post = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(createCategory(data)).rejects.toThrow("Failed");
    expect(privateRequest.post).toHaveBeenCalledWith("/categories/", data);
  });

  test("deleteCategory should return deleted category data when API call is successful", async () => {
    const id = 1;
    const resMock = { data: "mock data" };
    privateRequest.delete = jest.fn().mockResolvedValueOnce(resMock);

    const result = await deleteCategory(id);

    expect(privateRequest.delete).toHaveBeenCalledWith("/categories/" + id);
    expect(result).toEqual(resMock.data);
  });

  test("deleteCategory should throw an error if API call fails", async () => {
    const id = 1;

    privateRequest.delete = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(deleteCategory(id)).rejects.toThrow("Failed");
    expect(privateRequest.delete).toHaveBeenCalledWith("/categories/" + id);
  });

  test("getAllCategories should return all products data when API call is successful", async () => {
    const resMock = { data: ["mock data 1", "mock data 2"] };
    publicRequest.get = jest.fn().mockResolvedValueOnce(resMock);

    const result = await getAllCategories();

    expect(publicRequest.get).toHaveBeenCalledWith("/categories/");
    expect(result).toEqual(resMock.data);
  });

  test("getAllCategories should throw an error if API call fails", async () => {
    publicRequest.get = jest
      .fn()
      .mockRejectedValueOnce({ response: { data: { msg: "Failed" } } });

    await expect(getAllCategories()).rejects.toThrow("Failed");
    expect(publicRequest.get).toHaveBeenCalledWith("/categories/");
  });
});
