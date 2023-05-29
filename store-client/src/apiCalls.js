import {
  loginFailure,
  loginStart,
  loginSuccess,
  clearUser,
  setFavorites,
  update,
} from "./redux/userSlice";
import axios from "axios";
import io from "socket.io-client";
import { updateCart } from "./redux/cartSlice";
import { isProduction } from "./utils";

const _url = isProduction
  ? "https://lojavirtual-sprint1.onrender.com"
  : "http://localhost:5000";
export const API_URL = _url + "/api/v1";
export const SERVER_URL = _url;

export const publicRequest = axios.create({
  baseURL: API_URL,
});

export const privateRequest = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const privateRequestUpload = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});

let dispatch;
export const setDispatch = (d) => {
  dispatch = d;
};

export const login = async (user) => {
  dispatch(loginStart());
  try {
    const res = await privateRequest.post("/auth/local", user);
    dispatch(loginSuccess(res.data.user));
    dispatch(updateCart(res.data));
  } catch (err) {
    const code = err.response?.data.code || 0;
    dispatch(loginFailure(code));
  }
};

export const register = async (user) => {
  dispatch(loginStart());
  try {
    const res = await privateRequest.post("/auth/register", user);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    const code = err.response?.data.code || 0;
    dispatch(loginFailure(code));
  }
};

export const getSession = async () => {
  try {
    const res = await privateRequest.get("/auth/session");
    dispatch(update(res.data));
    dispatch(updateCart(res.data));
  } catch (err) {
    dispatch(clearUser());
  }
};

export const logout = () => {
  window.open(API_URL + "/auth/logout", "_self");
};

export const oauthLoginPopup = (provider, popupCloseAction) => {
  const socket = io(SERVER_URL, { withCredentials: true });

  socket.on("connect", () => {
    const w = 600;
    const h = 600;
    const x = window.innerWidth / 2 - w / 2;
    const y = window.innerHeight / 2 - h / 2;
    const url = API_URL + "/auth/" + provider + "?socketId=" + socket.id;

    const popup = window.open(
      url,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
                scrollbars=no, resizable=no, copyhistory=no, width=${w}, 
                height=${h}, top=${y}, left=${x}`
    );

    const checkPopup = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(checkPopup);
        socket.disconnect();
        popupCloseAction();
      }
    }, 1000);

    socket.on(provider, (res) => {
      popup.close();
      if (res.user) {
        dispatch(update(res));
        dispatch(updateCart(res));
      }
      socket.disconnect();
    });
  });
  socket.on("disconnect", (reason) => {
    console.log("Socket desconectado: ", reason);
  });
};

export const createUser = async (formData) => {
  try {
    const res = await privateRequestUpload.post("/users", formData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const updateUser = async (id, formData) => {
  try {
    const res = await privateRequestUpload.put("/users/" + id, formData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await privateRequest.delete("/users/" + id);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const getUser = async (id) => {
  try {
    const res = await privateRequest.get("/users/" + id);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const getAllUsers = async () => {
  try {
    const res = await privateRequest.get("/users/");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const addUserFavorite = async (userId, favId) => {
  try {
    const res = await privateRequest.post(
      "/users/" + userId + "/favorites/" + favId
    );
    dispatch(setFavorites(res.data.favorites));
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const removeUserFavorite = async (userId, favId) => {
  try {
    const res = await privateRequest.delete(
      "/users/" + userId + "/favorites/" + favId
    );
    dispatch(setFavorites(res.data.favorites));
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const updateUserCart = async (id, cart) => {
  try {
    const res = await privateRequest.put("/users/cart/" + id, cart);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const createProduct = async (formData) => {
  try {
    const res = await privateRequestUpload.post("/products", formData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const res = await privateRequestUpload.put("/products/" + id, formData);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const getProduct = async (id) => {
  try {
    const res = await publicRequest.get("/products/" + id);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const getAllProducts = async () => {
  try {
    const res = await publicRequest.get("/products/");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const deleteProduct = async (id) => {
  try {
    const res = await privateRequest.delete("/products/" + id);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const getProductsBySearch = async (keywords) => {
  try {
    const res = await publicRequest.get("/products?search=" + keywords);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const getProductsByCategory = async (categories) => {
  try {
    const res = await publicRequest.get("/products?category=" + categories);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const getProductsRandom = async (n) => {
  try {
    const res = await publicRequest.get("/products?random=" + n);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const createCategory = async (data) => {
  try {
    const res = await privateRequest.post("/categories/", data);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const deleteCategory = async (id) => {
  try {
    const res = await privateRequest.delete("/categories/" + id);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};

export const getAllCategories = async () => {
  try {
    const res = await publicRequest.get("/categories/");
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data.msg);
  }
};
