import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  height: 400px;
  position: relative;
  box-sizing: border-box;
  min-width: 300px;
`;
Container.displayName = "Container";

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
Image.displayName = "Image";

const Info = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
Info.displayName = "Info";

const Title = styled.h1`
  height: 80px;
  color: white;
  margin-bottom: 20px;
  text-shadow: 1px 1px 12px black, 1px 1px 12px black;
  text-align: center;
`;
Title.displayName = "Title";

const Button = styled.button`
  padding: 6px 10px 6px 10px;
  background-color: white;
  border-radius: 15px;
  font-size: 22px;
  box-shadow: 5px 5px 6px 0px rgba(0, 0, 0, 0.33);
  border: none;
  cursor: pointer;
`;
Button.displayName = "Button";

const CategoryItem = ({ item }) => {
  return (
    <Container data-testid="category-item">
      <Link to={`/produtos?categoria=${item.cat}`}>
        <Image src={item.img} />
        <Info>
          <Title>{item.title}</Title>
          <Button>Ver Produtos</Button>
        </Info>
      </Link>
    </Container>
  );
};

export default CategoryItem;
