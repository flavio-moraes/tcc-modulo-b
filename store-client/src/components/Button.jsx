import styled from "styled-components";
import { themeColors } from "../data";

const ButtonEl = styled.button`
  padding: 15px;
  border: 0.5px solid black;
  background-color: ${themeColors.buyButton};
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: ${themeColors.buyButtonHighlight};
    transition: all 0.5s ease;
  }
  transition: all 0.5s ease;

  &:disabled {
    background-color: gray;
    cursor: wait;
  }
`;

const Button = (props) => {
  const { children, ...others } = props;
  return <ButtonEl {...others}>{children}</ButtonEl>;
};

export default Button;
