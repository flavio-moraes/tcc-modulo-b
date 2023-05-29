import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import MyButton from "../components/Button";
import Navbar from "../components/Navbar";
import { login, oauthLoginPopup } from "../apiCalls";
import { Link } from "react-router-dom";
import { loginBgImage } from "../data.js";

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7)),
    center url(${(props) => props.bg});
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 20px;
  width: clamp(400px, 23%, 500px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 0px 0px 0px 0px;
  font-size: 32px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.25);
  text-align: center;
`;

const SubTitle = styled.h2`
  margin: 30px 0px 20px 0px;
  font-size: 20px;
  font-weight: 300;
  color: white;
`;

const Input = styled.input`
  margin: 0px 0px 10px 0px;
  padding: 10px;
`;

const Lnk = styled.span`
  margin: 10px 0px 0px 0px;
  text-decoration: underline;
  font-size: 15px;
  cursor: pointer;
  color: white;
`;

const ErrorMsg = styled.span`
  margin: 0px 0px 20px 0px;
  color: red;
`;

const SocialButton = styled.button`
  margin-bottom: 10px;
  display: flex;
  padding: 8px;
  border: 0.5px solid gray;
  border-radius: 10px;
  background-color: #fff;
  color: #6d6d6d;
  font-size: 16px;
  font-weight: 500;
  align-items: center;
  cursor: pointer;

  transition: all 0.5s ease;

  &:disabled {
    background-color: gray;
    cursor: wait;
  }
`;

const ButtonIcon = styled.div`
  background-image: url(${(props) => props.iconUrl});
  background-size: contain;
  background-repeat: no-repeat;
  width: 32px;
  height: 32px;
`;

const ButtonText = styled.div`
  width: calc(100% - 64px);
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const { isFetching, error } = useSelector((state) => state.user);
  const thisCompIsMounted = useRef(false);

  useEffect(() => {
    thisCompIsMounted.current = true;
    return () => {
      thisCompIsMounted.current = false;
    };
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    login({ username, password });
  };

  const openPopup = (e) => {
    e.preventDefault();
    const provider = e.currentTarget.dataset.provider;
    setButtonDisabled(true);
    const popupCloseAction = () => {
      if (thisCompIsMounted.current) setButtonDisabled(false);
    };
    oauthLoginPopup(provider, popupCloseAction);
  };

  return (
    <>
      <Navbar />
      <Container bg={loginBgImage}>
        <Wrapper>
          <Title>ENTRAR</Title>
          <Form>
            <SubTitle>Já sou cliente:</SubTitle>
            <Input
              placeholder="E-mail"
              type="email"
              onChange={(e) => setUsername(e.target.value)}
              disabled={buttonDisabled || isFetching}
            />
            <Input
              placeholder="Senha"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={buttonDisabled || isFetching}
            />
            {error && <ErrorMsg>Usuário ou senha inválidos.</ErrorMsg>}
            <MyButton
              onClick={handleClick}
              disabled={buttonDisabled || isFetching}
              style={{ marginTop: "5px" }}
            >
              ENTRAR
            </MyButton>
            <Lnk style={{ marginBottom: "10px" }}>
              <Link to="/registrar">Criar uma nova Conta</Link>
            </Lnk>
            <SubTitle>Ou entre com sua rede social:</SubTitle>
            <SocialButton
              onClick={openPopup}
              data-provider="google"
              disabled={buttonDisabled || isFetching}
            >
              <ButtonIcon iconUrl="img/google_icon.svg" />
              <ButtonText>Entrar com Google</ButtonText>
            </SocialButton>
            <SocialButton
              onClick={openPopup}
              data-provider="github"
              disabled={buttonDisabled || isFetching}
            >
              <ButtonIcon iconUrl="img/github_icon.png" />
              <ButtonText>Entrar com GitHub</ButtonText>
            </SocialButton>
          </Form>
        </Wrapper>
      </Container>
    </>
  );
};

export default Login;
