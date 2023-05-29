import styled from "styled-components";
import { useEffect, useState } from "react";
import { getProductsRandom } from "../apiCalls";
import Product from "./Product";

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 5px;
`;
Container.displayName = "Products";

const Products = ({ data }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data == undefined) {
      getProductsRandom(8)
        .then((res) => {
          setProducts(res);
        })
        .catch((err) => {});
    } else setProducts(data);
  }, [data]);

  return (
    <Container>
      {products.map((item) => (
        <Product item={item} key={item.id} />
      ))}
    </Container>
  );
};

export default Products;
