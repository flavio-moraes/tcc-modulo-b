import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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

const Title = styled.h1``;

const OrderList = () => {
  return (
    <Container>
      <Navbar />
      <Wrapper>
        <SubContainer className="middle">
          <Title>Meus Pedidos:</Title>
          <p>Página em construção...</p>
        </SubContainer>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default OrderList;
