import "./App.css";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as Lnk,
  Redirect,
  BrowserRouter,
  Routes,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession, setDispatch } from "./apiCalls";
import Favorites from "./pages/Favorites";
import AccountData from "./pages/AccountData";
import OrderList from "./pages/OrderList";
import About from "./pages/About";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-weight: bold;
    font-size: 32px;
    margin-top: 30px;
    margin-bottom: 70px;
  }

  p:first-of-type {
    margin-top: 30px;
  }
`;

const Spinner = styled.div`
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #aaa;
  width: 40px;
  height: 40px;
  -webkit-animation: spin 1s linear infinite;
  animation: spin 1s linear infinite;

  align-self: center;

  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function App() {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  setDispatch(dispatch);
  const user = useSelector((state) => state.user.info);

  useEffect(() => {
    getSession().then(() => setLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Container>
        <h1>Loja Virtual</h1>
        <Spinner />
        <p>Conectando-se ao servidor.</p>
        <p>Pode demorar algum tempo...</p>
      </Container>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/">
          <Route index element={<Home />} />
          <Route path="/produtos" element={<ProductList />} />
          <Route path="/produto/:id" element={<ProductDetails />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/registrar"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />
          <Route
            path="/conta/favoritos"
            element={user ? <Favorites /> : <Navigate to="/login" />}
          />
          <Route
            path="/conta/dados"
            element={user ? <AccountData /> : <Navigate to="/login" />}
          />
          <Route
            path="/conta/pedidos"
            element={user ? <OrderList /> : <Navigate to="/login" />}
          />
          <Route path="/sobre" element={<About />} />
        </Route>

        <Route path="*" element={<p>Página não encontrada: Erro 404!</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
