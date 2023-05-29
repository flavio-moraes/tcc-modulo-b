import { useEffect, useMemo } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  getAllProducts,
  getProductsByCategory,
  getProductsBySearch,
} from "../apiCalls";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Products from "../components/Products";

const Container = styled.div``;

const Body = styled.div`
  min-height: calc(100vh - 290px);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h1`
  margin: 30px 20px 20px 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
`;

const Filter = styled.div`
  margin: 20px 20px;
`;

const FilterText = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin-right: 20px;
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 20px;
`;

const Option = styled.option``;

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

const NFContainer = styled.div`
  position: relative;
  margin-top: 50px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.nobg ? "center" : "unset")};

  background-image: ${(props) =>
    props.nobg ? "none" : 'url("/img/notfound.png")'};
  background-position: center;
  background-size: 400px;
  background-repeat: no-repeat;

  .wrapper {
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  h1 {
    margin: 10px 0px;
  }

  p {
    font-size: 18px;
    margin-top: 10px;
  }

  ul {
    font-size: 18px;
    margin: 10px 0px 0px 30px;
  }

  li {
    margin-top: 5px;
  }
`;

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [mode, setMode] = useState("loading");
  const [displayText, setDisplayText] = useState("");
  const [sort, setSort] = useState("");

  const query = useQuery();

  const { search } = useLocation();
  useEffect(() => {
    let value = query.get("busca");
    if (value) {
      setDisplayText(value);
      getProductsBySearch(value)
        .then((res) => {
          setMode("search");
          setProductList(res);
        })
        .catch((err) => {});
      return;
    }

    value = query.get("categoria");
    if (value) {
      let text = value;
      text = text.replace(/,/g, " ");
      setDisplayText(text);
      getProductsByCategory(value)
        .then((res) => {
          setMode("category");
          setProductList(res);
        })
        .catch((err) => {});
      return;
    }

    setDisplayText("");
    getAllProducts()
      .then((res) => {
        setMode("all");
        setProductList(res);
        value = query.get("q");
        if (value === "recentes") {
          document.getElementById("sort").value = "newest";
          setSort("newest");
        }
      })
      .catch((err) => {});
  }, [search]);

  useEffect(() => {
    if (sort === "newest") {
      setProductList((prev) =>
        [...prev].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } else if (sort === "asc") {
      setProductList((prev) =>
        [...prev].sort((a, b) => a.variants[0].price - b.variants[0].price)
      );
    } else {
      setProductList((prev) =>
        [...prev].sort((a, b) => b.variants[0].price - a.variants[0].price)
      );
    }
  }, [sort]);

  return (
    <Container>
      <Navbar />
      <Body>
        {productList.length > 0 ? (
          <>
            {mode === "search" ? (
              <Title>Resultado da busca por: {displayText}</Title>
            ) : (
              <Title>Produtos: {displayText}</Title>
            )}
            <FilterContainer>
              <Filter>
                <FilterText>Ordenação:</FilterText>
                <Select
                  onChange={(e) => setSort(e.target.value)}
                  defaultValue="newest"
                  id="sort"
                >
                  <Option value="newest">Mais recentes</Option>
                  <Option value="asc">Preço (menor para maior)</Option>
                  <Option value="desc">Preço (maior para menor)</Option>
                </Select>
              </Filter>
            </FilterContainer>
            <Products data={productList} />
          </>
        ) : (
          <NFContainer nobg={mode === "loading"}>
            {mode === "loading" ? (
              <Spinner data-testid="spinner" />
            ) : mode === "search" ? (
              <div className="wrapper">
                <h1>
                  Nenhum resultado encontrado para a sua busca "{displayText}".
                </h1>
                <p>
                  Verifique se você digitou as palavras corretamente ou tente
                  novamente a busca.
                </p>
                <p>Dicas para melhorar sua busca:</p>
                <ul>
                  <li>Verifique se não houve erro de digitação.</li>
                  <li>Tente utilizar uma única palavra.</li>
                  <li>Procure por um termo similar ou sinônimo.</li>
                  <li>
                    Tente procurar termos mais gerais e filtrar o resultado da
                    busca.
                  </li>
                </ul>
              </div>
            ) : (
              <div className="wrapper">
                <h1 style={{ textAlign: "center" }}>
                  Nenhum produto encontrado.
                </h1>
              </div>
            )}
          </NFContainer>
        )}
      </Body>
      <Footer />
    </Container>
  );
};

export default ProductList;
