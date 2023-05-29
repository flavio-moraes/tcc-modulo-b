import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import MyButton from "../components/Button";
import Navbar from "../components/Navbar";
import { register } from "../apiCalls";
import { registerBgImage } from "../data.js";

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 60px);
  background: linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.85)),
    center url(${(props) => props.bg});
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
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
  margin: 0px 0px 15px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  color: white;
  font-size: 14px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
`;

const ErrorMsg = styled.span`
  margin: 0px 0px 0px 0px;
  color: red;
`;

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPass, setRepeatedPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { isFetching, error, errorCode } = useSelector((state) => state.user);

  const handleClick = (e) => {
    e.preventDefault();
    if (!firstname || !lastname || !email || !password || !repeatedPass) {
      setErrorMsg("Todos os campos devem ser preenchidos.");
      return;
    }
    if (password !== repeatedPass) {
      setErrorMsg("As senhas informadas devem ser idênticas.");
      return;
    }
    setErrorMsg("");
    register({ firstname, lastname, email, password });
  };

  useEffect(() => {
    if (errorCode === 11000) {
      setErrorMsg(
        "Já existe um cadastro com este e-mail. Use um e-mail diferente."
      );
    } else if (error) {
      setErrorMsg("Ocorreu um erro no cadastro, tente novamente.");
    }
  }, [errorCode]);

  return (
    <>
      <Navbar />
      <Container bg={registerBgImage}>
        <Wrapper>
          <Title>CRIAR UMA NOVA CONTA</Title>
          <Form>
            <SubTitle>Preencha todos os dados abaixo:</SubTitle>
            <Input
              placeholder="Nome"
              onChange={(e) => setFirstname(e.target.value)}
              disabled={isFetching}
            />
            <Input
              placeholder="Sobrenome"
              onChange={(e) => setLastname(e.target.value)}
              disabled={isFetching}
            />
            <Input
              placeholder="E-mail"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              disabled={isFetching}
            />
            <Input
              placeholder="Senha"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={isFetching}
            />
            <Input
              placeholder="Repetir senha"
              type="password"
              onChange={(e) => setRepeatedPass(e.target.value)}
              disabled={isFetching}
            />

            {(error || errorMsg) && <ErrorMsg>{errorMsg}</ErrorMsg>}

            <Agreement>
              Ao criar uma conta, concordo com o processamento dos meus dados de
              acordo com a <b>política de privacidade</b>.
            </Agreement>
            <MyButton onClick={handleClick} disabled={isFetching}>
              CADASTRAR
            </MyButton>
          </Form>
        </Wrapper>
      </Container>
    </>
  );
};

export default Register;
