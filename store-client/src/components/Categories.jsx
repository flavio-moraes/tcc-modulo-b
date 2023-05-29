import styled from "styled-components";
import { categories } from "../data";
import CategoryItem from "./CategoryItem";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 40px 20px 20px 20px;
  justify-content: space-between;
  gap: 20px;
`;
Container.displayName = "Categories";

const Categories = () => {
  return (
    <Container>
      {categories.map((item) => (
        <CategoryItem item={item} key={item.id} />
      ))}
    </Container>
  );
};

export default Categories;
