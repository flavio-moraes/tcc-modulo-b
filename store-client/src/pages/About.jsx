import React from "react";
import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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

const SubContainer = styled.div`
  flex: 1;
  min-width: 400px;
  max-width: 600px;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  justify-content: flex-start;
  align-items: center;
  text-align: center;
  gap: 20px;
`;

const Logo = styled.h1`
  font-weight: bold;
  font-size: 48px;
  align-self: center;
  margin: 40px 0 40px 0;
`;

const About = () => {
  return (
    <div>
      <Navbar />
      <Wrapper>
        <SubContainer>
          <Logo>Loja Virtual</Logo>
          <p>
            Trata-se de uma Aplicação Web destinada ao e-commerce de produtos.
            Construída com os populares frameworks React para o Front-End e
            Node.js para o Back-End, destaca-se o compromisso do desenvolvedor
            em utilizar tecnologias mais recentes e inovadoras para criar uma
            experiência de compra on-line fácil e intuitiva.
          </p>
          <p>
            Tendo como princípio uma ótima experiência de usuário, a aplicação
            foi desenvolvida visando proporcionar uma interface responsiva,
            tempos de carregamento rápidos e processo de checkout seguro.
          </p>
        </SubContainer>
      </Wrapper>
      <Footer />
    </div>
  );
};

export default About;
