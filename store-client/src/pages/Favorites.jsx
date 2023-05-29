import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Products from "../components/Products";
import { getProduct } from "../apiCalls";

const Container = styled.div``;

const Wrapper = styled.div`
  box-sizing: border-box;
  min-height: calc(100vh - 330px);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 30px 0px 60px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;

  .middle {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

const SubContainer = styled.div`
  flex: 1;
  min-width: 400px;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

const Title = styled.h1``;

const Favorites = () => {
  const [productList, setProductList] = useState([]);
  const user = useSelector((state) => state.user.info);
  const [phase, setPhase] = useState("fetching");

  useEffect(() => {
    setProductList([]);

    if (user.favorites?.length > 0) {
      user.favorites.forEach((el, i) => {
        getProduct(el)
          .then((res) => {
            setProductList((state) => {
              let newState = [...state];
              newState.push(res);
              return newState;
            });

            if (user.favorites?.length - 1 === i) setPhase("done");
          })
          .catch((err) => {});
      });
    } else {
      setPhase("empty");
    }
  }, []);

  return (
    <Container>
      <Navbar />
      <Wrapper>
        {phase === "fetching" ? (
          <SubContainer className="middle">
            <Spinner data-testid="spinner" />
          </SubContainer>
        ) : phase === "empty" ? (
          <SubContainer className="middle">
            <Title>Sua lista de favoritos está vazia!</Title>
            <p>
              Navegue pelos produtos do site para adicioná-los a sua lista de
              favoritos.
            </p>
          </SubContainer>
        ) : (
          <SubContainer>
            <Title>Meus Produtos Favoritos</Title>
            <Products data={productList} />
          </SubContainer>
        )}
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Favorites;
