import { Link } from "react-router-dom";
import styled from "styled-components";

const Overlay = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
`;

const Container = styled.div`
  flex: 1;
  width: 280px;
  height: 480px;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  background-color: #f5fbfd;
  position: relative;
  cursor: pointer;

  &:hover ${Overlay} {
    opacity: 1;
  }
`;

const Image = styled.img`
  box-sizing: border-box;
  height: 400px;
  width: inherit;
  align-self: center;
  padding: 30px;
  object-fit: cover;
`;

const Info = styled.div`
  box-sizing: border-box;
  height: 80px;
  display: flex;
  flex-direction: column;
  padding: 0px 15px 15px 15px;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

const Price = styled.div`
  margin-top: 5px;
  font-size: 16px;
  font-weight: 300;
`;

const Button = styled.div`
  padding: 6px 10px 6px 10px;
  background-color: white;
  border-radius: 15px;
  font-size: 22px;
  box-shadow: 5px 5px 6px 0px rgba(0, 0, 0, 0.33);
  cursor: pointer;
  transition: height, width 0.5s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Product = ({ item }) => {
  return (
    <Link to={`/produto/${item.id}`} data-testid="product">
      <Container>
        <Image src={item.image || "/img/noimage.svg"} />
        <Info>
          <Name>{item.name}</Name>
          <Price>
            {"R$ " +
              item.variants[0].price
                .toFixed(2)
                .replace(".", ",")
                .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
          </Price>
        </Info>
        <Overlay>
          <Button>Conferir</Button>
        </Overlay>
      </Container>
    </Link>
  );
};

export default Product;
