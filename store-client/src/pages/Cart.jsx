import { useSelector } from "react-redux";
import { Add, Remove } from "@material-ui/icons";
import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { themeColors } from "../data";
import {
  decraseOne,
  incraseOne,
  removeCartItem,
  saveCartThunk,
} from "../redux/cartSlice";
import { useDispatch } from "react-redux";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link, useNavigate } from "react-router-dom";

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
`;

const CartItemsContainer = styled.div`
  flex: 2;
  min-width: 400px;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const SummaryContainer = styled.div`
  flex: 1;
  min-width: 400px;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const SummaryBox = styled.div`
  box-sizing: border-box;
  width: 300px;
  margin-top: 50px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(59, 24, 0, 0.8));
  align-self: center;
  padding: 20px;
  gap: 20px;
  display: flex;
  flex-direction: column;
  color: white;

  .title {
    font-weight: 200;
    text-align: center;
    margin-bottom: 20px;
  }

  .infoRow {
    display: flex;
    justify-content: space-between;
    gap: 5px;
  }

  .infoItem {
    font-size: 18px;
  }
`;

const Title = styled.h1``;

const CartItem = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  box-shadow: 4px 4px 7px 1px rgba(41, 41, 41, 0.25);
  position: relative;

  .content {
    flex: 1;
    box-sizing: border-box;
    min-width: 350px;
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .title {
    margin-bottom: 10px;
  }

  .info {
    margin-bottom: 10px;
  }

  .sideBySide {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-top: auto;
  }

  .price {
    font-size: 22px;
  }

  .icon {
    font-size: 36px;
    color: #bbb;
    position: absolute;
    top: 5px;
    right: 2px;
    cursor: pointer;
  }
`;

const Image = styled.img`
  box-sizing: border-box;
  height: 200px;
  width: 200px;
  align-self: center;
  padding: 20px;
  object-fit: cover;
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-size: 20px;
  margin: 80px 0px 50px 0px;
  text-align: center;
`;

const Button = styled.button`
  padding: 15px;
  border: 0.5px solid black;
  background-color: ${themeColors.buyButton};
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;

  &:hover {
    background-color: ${themeColors.buyButtonHighlight};
    transition: all 0.5s ease;
  }
`;

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <CartItemsContainer>
          <Title>Carrinho de Compras</Title>

          {cart.items.map((entry, i) => {
            return (
              <CartItem key={entry.variantId}>
                <Image src={entry.productImage || "/img/noimage.svg"} />
                <div className="content">
                  <h2 className="title">
                    <Link to={"/produto/" + entry.productId}>
                      {entry.productName}
                    </Link>
                  </h2>
                  <span className="info">Variante: {entry.variantName}</span>
                  <span className="info">
                    Valor unitário: R${" "}
                    {entry.variantPrice
                      .toFixed(2)
                      .replace(".", ",")
                      .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
                  </span>
                  <div className="sideBySide">
                    <AmountContainer>
                      <Remove
                        onClick={() => {
                          dispatch(decraseOne({ index: i }));
                          dispatch(saveCartThunk());
                        }}
                        style={{ cursor: "pointer" }}
                        data-testid="decrease"
                      />
                      <Amount data-testid="quantity">{entry.quantity}</Amount>
                      <Add
                        onClick={() => {
                          dispatch(incraseOne({ index: i }));
                          dispatch(saveCartThunk());
                        }}
                        style={{ cursor: "pointer" }}
                        data-testid="increase"
                      />
                    </AmountContainer>
                    <span className="price">
                      R${" "}
                      {(entry.quantity * entry.variantPrice)
                        .toFixed(2)
                        .replace(".", ",")
                        .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
                    </span>
                  </div>
                  <DeleteOutlineIcon
                    className="icon"
                    onClick={() => {
                      dispatch(removeCartItem({ index: i }));
                      dispatch(saveCartThunk());
                    }}
                    data-testid="remove"
                  />
                </div>
              </CartItem>
            );
          })}

          {cart.items.length === 0 && (
            <EmptyCart>
              <p>Carrinho de compras vazio!</p>
              <p>
                Navegue pelos produtos da loja para adicioná-los ao carrinho.
              </p>
            </EmptyCart>
          )}
        </CartItemsContainer>

        <SummaryContainer>
          <SummaryBox>
            <h2 className="title">Resumo da Compra</h2>
            <div className="infoRow">
              <span className="infoItem">Subtotal:</span>
              <span className="infoItem">
                R${" "}
                {cart.totalValue
                  .toFixed(2)
                  .replace(".", ",")
                  .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
              </span>
            </div>
            <div className="infoRow">
              <span className="infoItem">Descontos:</span>
              <span className="infoItem">R$ 0,00</span>
            </div>
            <div className="infoRow">
              <span className="infoItem">Frete:</span>
              <span className="infoItem">
                R$ {cart.items.length > 0 ? "20,00" : "0,00"}
              </span>
            </div>
            <div className="infoRow">
              <span className="infoItem">Total:</span>
              <span className="infoItem">
                R${" "}
                {(cart.totalValue + (cart.items.length > 0 ? 20 : 0))
                  .toFixed(2)
                  .replace(".", ",")
                  .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
              </span>
            </div>
            <Button disabled={cart.items.length == 0}>COMPRAR</Button>
          </SummaryBox>
        </SummaryContainer>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Cart;
