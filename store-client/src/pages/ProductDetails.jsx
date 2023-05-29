import { Add, Remove } from "@material-ui/icons";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { themeColors } from "../data";
import { addCartItem, saveCartThunk } from "../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { addUserFavorite, getProduct, removeUserFavorite } from "../apiCalls";

const Container = styled.div``;

const Wrapper = styled.div`
  box-sizing: border-box;
  min-height: calc(100vh - 330px);
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 60px 0px 60px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
`;

const ImgContainer = styled.div`
  flex: 1;
  min-width: 400px;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
`;

const Image = styled.img`
  width: 100%;
  object-fit: contain;
`;

const InfoContainer = styled.div`
  flex: 1;
  min-width: 400px;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-weight: 200;
`;

const Description = styled.p`
  margin: 10px 0px 0px 0px;
  white-space: pre-wrap;
`;

const Price = styled.div`
  font-weight: 100;
  font-size: 26px;
  margin-top: 20px;
`;

const VariantContainer = styled.div`
  margin: 50px 0px;
  display: flex;
  align-items: center;
`;

const Label = styled.span`
  font-size: 20px;
  font-weight: 200;
  margin-right: 10px;
`;

const Favorites = styled.span`
  font-weight: 200;
  font-size: 18px;
  color: #273fc4;
  margin-left: 20px;
  cursor: pointer;
`;
const VariantSelect = styled.select`
  padding: 5px;
`;

const VariantOption = styled.option``;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 30px;
  margin: 0px 0px 50px 0px;
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

const Button = styled.button`
  padding: 15px;
  border: 0.5px solid black;
  background-color: ${themeColors.buyButton};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: ${themeColors.buyButtonHighlight};
    transition: all 0.5s ease;
  }
`;

const Message = styled.span`
  font-size: 20px;
  margin-left: 10px;
`;

const ProductDetail = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    variants: [],
    categories: [],
    image: "",
  });
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState({
    id: "0",
    name: "",
    price: 0,
    stock: 1,
  });
  const [inputDisabled, setInputDisabled] = useState(false);
  const [message, setMessage] = useState("");
  const [favorite, setFavorite] = useState("");

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.info);

  const location = useLocation();
  const id = location.pathname.split("/")[2];

  useEffect(() => {
    getProduct(id)
      .then((res) => {
        setProduct(res);
        res.variants[0]
          ? setVariant(res.variants[0])
          : setVariant({ id: "0", name: "", price: 0, stock: 1 });
        document.getElementById("select").value = 0;
        if (user && user.favorites?.includes(res.id)) setFavorite(res.id);
      })
      .catch((err) => {});
  }, [id]);

  useEffect(() => {
    if (variant.stock < 1) {
      setQuantity(0);
      setMessage("Sem estoque.");
      setInputDisabled(true);
    } else {
      setQuantity(1);
      setMessage("");
      setInputDisabled(false);
    }
  }, [variant]);

  const handleQuantity = (type) => {
    if (inputDisabled) return;
    if (type === "dec") {
      if (quantity > 1) setQuantity(quantity - 1);
    } else {
      if (quantity < variant.stock) setQuantity(quantity + 1);
    }
  };

  const handleClick = () => {
    dispatch(
      addCartItem({
        productId: product.id,
        productName: product.name,
        productImage: product.image || "",
        variantId: variant.id,
        variantName: variant.name,
        variantPrice: variant.price,
        variantStock: variant.stock,
        quantity: quantity,
      })
    );
    dispatch(saveCartThunk());
  };

  const favoriteClick = () => {
    if (!user || inputDisabled) return;
    setInputDisabled(true);
    if (favorite === "") {
      addUserFavorite(user.id, product.id)
        .then((res) => {
          setFavorite(product.id);
        })
        .catch((err) => {})
        .finally(() => {
          setInputDisabled(false);
        });
    } else {
      removeUserFavorite(user.id, product.id)
        .then((res) => {
          setFavorite("");
        })
        .catch((err) => {})
        .finally(() => {
          setInputDisabled(false);
        });
    }
  };

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <ImgContainer>
          <Image src={product.image || "/img/noimage.svg"} />
        </ImgContainer>
        <InfoContainer>
          <Title>{product.name}</Title>
          <Price>
            R${" "}
            {variant.price
              .toFixed(2)
              .replace(".", ",")
              .replace(/\d(?=(\d{3})+\,)/g, "$&.")}
            {user && (
              <Favorites onClick={favoriteClick}>
                {favorite === ""
                  ? "Adicionar os Favoritos"
                  : "Remover dos Favoritos"}
              </Favorites>
            )}
          </Price>

          <VariantContainer>
            <Label>Variante:</Label>
            <VariantSelect
              onChange={(e) => setVariant(product.variants[e.target.value])}
              id="select"
            >
              {product.variants?.map((el, i) => (
                <VariantOption key={el.id} value={i} disabled={el.stock < 1}>
                  {el.name}
                </VariantOption>
              ))}
            </VariantSelect>
          </VariantContainer>

          <ButtonContainer>
            <AmountContainer>
              <Remove
                onClick={() => handleQuantity("dec")}
                style={{ cursor: "pointer" }}
              />
              <Amount>{quantity}</Amount>
              <Add
                onClick={() => handleQuantity("inc")}
                style={{ cursor: "pointer" }}
              />
            </AmountContainer>
            <Button onClick={handleClick} disabled={inputDisabled}>
              Adicionar ao Carrinho
            </Button>
            <Message>{message}</Message>
          </ButtonContainer>
          <Label>Descrição:</Label>
          <Description>{product.description}</Description>
        </InfoContainer>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default ProductDetail;
