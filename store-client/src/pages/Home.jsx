import React from "react";
import styled from "styled-components";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Products from "../components/Products";
import Slider from "../components/Slider";

const Body = styled.div`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;
Body.displayName = "Home";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Slider />
      <Body>
        <Categories />
        <Products />
      </Body>
      <Footer />
    </div>
  );
};

export default Home;
