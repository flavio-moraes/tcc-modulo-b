import { ArrowLeftOutlined, ArrowRightOutlined } from "@material-ui/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { sliderItems } from "../data";

const Container = styled.div`
  width: auto;
  min-height: 600px;
  display: flex;
  position: relative;
  overflow: hidden;
`;
Container.displayName = "Slider";

const Arrow = styled.div`
  width: 50px;
  height: 50px;
  background-color: lightgray;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: ${(props) => props.side === "left" && "10px"};
  right: ${(props) => (props.side === "right" ? "10px" : "")};
  top: 0;
  bottom: 0;
  margin: auto;
  cursor: pointer;
  opacity: 0.5;
  z-index: 1;
`;

const Wrapper = styled.div`
  display: flex;
  transition: all 1.5s ease;
  transform: translateX(${(props) => props.slideIndex * -100}vw);
`;

const Slide = styled.div`
  width: 100vw;
  display: flex;
  flex-wrap: wrap;
  background-color: #${(props) => props.bg};
`;

const ImgContainer = styled.div`
  box-sizing: border-box;
  flex: 4;
  min-width: 400px;
  display: flex;
  max-height: 600px;
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  box-sizing: border-box;
  flex: 2;
  display: flex;
  align-items: center;
`;

const InfoWrapper = styled.div`
  box-sizing: border-box;
  padding: 40px;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 767px) {
    align-items: center;
    text-align: center;

    h1 {
      font-size: 24px;
    }

    p {
      font-size: 16px;
    }

    button {
      font-size: 14px;
    }
  }
`;

const Title = styled.h1`
  font-size: 32px;
`;

const Desc = styled.p`
  margin: 30px 0px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 3px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 18px;
  background-color: transparent;
  cursor: pointer;
`;

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  const handleClick = (direction) => {
    if (direction === "left") {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : 2);
    } else {
      setSlideIndex(slideIndex < 2 ? slideIndex + 1 : 0);
    }
  };

  return (
    <Container>
      <Arrow
        side="left"
        onClick={() => handleClick("left")}
        data-testid="left-arrow"
      >
        <ArrowLeftOutlined />
      </Arrow>
      <Wrapper slideIndex={slideIndex} data-testid="wrapper">
        {sliderItems.map((item) => (
          <Slide bg={item.bg} key={item.id}>
            <ImgContainer>
              <Image src={item.img} />
            </ImgContainer>
            <InfoContainer>
              <InfoWrapper>
                <Title>{item.title}</Title>
                <Desc>{item.desc}</Desc>
                <Link to={item.link}>
                  <Button>VER PRODUTOS</Button>
                </Link>
              </InfoWrapper>
            </InfoContainer>
          </Slide>
        ))}
      </Wrapper>
      <Arrow
        side="right"
        onClick={() => handleClick("right")}
        data-testid="right-arrow"
      >
        <ArrowRightOutlined />
      </Arrow>
    </Container>
  );
};

export default Slider;
