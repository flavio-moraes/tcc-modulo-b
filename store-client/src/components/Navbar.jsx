import { Badge } from "@material-ui/core";
import { Search, ShoppingCartOutlined } from "@material-ui/icons";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout as doLogout } from "../apiCalls";
import { useState } from "react";

const Container = styled.div`
  box-sizing: border-box;
  height: 100px;
  -webkit-box-shadow: 0px 0px 9px 3px rgba(41, 41, 41, 0.25);
  -moz-box-shadow: 0px 0px 9px 3px rgba(41, 41, 41, 0.25);
  box-shadow: 0px 0px 9px 3px rgba(41, 41, 41, 0.25);
  position: relative;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 767px) {
    height: 60px;
  }
`;
Container.displayName = "Navbar";

const Wrapper = styled.div`
  box-sizing: border-box;
  height: 60px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;

const Left = styled.div`
  flex: 2;
  text-align: left;
  display: flex;
  box-sizing: border-box;
  min-width: 220px;

  @media screen and (max-width: 767px) {
    min-width: 100px;
  }
`;

const SideMenuButton = styled.div`
  box-sizing: border-box;
  width: 40px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media screen and (max-width: 767px) {
    display: flex;
  }
`;

const Logo = styled.h1`
  font-weight: bold;
  margin: 0;
  font-size: 32px;
  align-self: center;
  margin-left: 10px;

  a {
    vertical-align: middle;
  }

  @media screen and (max-width: 767px) {
    font-size: 16px;
  }
`;

const Center = styled.div`
  flex: 3;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  max-width: 500px;
`;

const SearchContainer = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 30px;
  margin-right: 30px;
  padding: 5px;
`;

const Input = styled.input`
  flex: 1;
  height: 26px;
  border: none;
  &:focus {
    outline: none;
  }
`;

const Right = styled.div`
  box-sizing: border-box;
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 25px;

  .userMenu {
    display: flex;
    align-items: center;
    position: relative;
    padding: 4px 0px;

    :hover div {
      display: block;
      top: 22px;
      right: 0;
    }

    a {
      font-size: 16px;
      font-weight: 500;
      padding: 12px 16px;
      display: block;
    }
  }

  @media screen and (max-width: 767px) {
    flex: none;

    > div,
    .userMenu {
      display: none;
    }
  }
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
`;

const SubMenu = styled.div`
  flex: 1;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 40px;

  a {
    padding: 4px 0px;
    display: block;
  }

  .header {
    display: none;
    position: relative;
    background-color: #fff;
    box-sizing: border-box;
    width: 200px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }

  .logo {
    display: block;
    font-weight: bold;
    font-size: 20px;
    padding: 0px;
    margin: 12px 16px;
  }

  .authItem,
  .labelItem {
    font-size: 14px;
    padding: 8px 16px;
  }

  .authItem {
    color: #273fc4;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 15px;
    cursor: pointer;
  }

  .profileItems {
    display: none;
    background-color: #f9f9f9;
    a {
      padding-left: 16px;
    }
  }

  @media screen and (max-width: 767px) {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 200px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    background-color: #f1f1f1;
    gap: 0px;
    z-index: 6;
    overflow-y: auto;
    transition: all 0.35s ease-out;

    .authItem {
      display: block;
    }

    a {
      box-sizing: border-box;
      width: 200px;
      padding: 12px 16px;
      border-bottom: 1px solid #ddd;
    }

    .header {
      display: block;
    }

    .header a {
      width: fit-content;
      border-bottom: none;
    }

    .profileItems {
      display: block;
    }
  }
`;

const CategoryItem = styled.div`
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  position: relative;

  &:hover div {
    display: block;
    top: 22px;
    left: 0;

    a {
      padding: 12px 16px;
    }
  }

  @media screen and (max-width: 767px) {
    :hover div a {
      padding-left: 32px;
    }
  }
`;
const Dropdown = styled.div`
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 6;
  margin-top: 5px;

  a:hover {
    background-color: #ddd;
  }

  @media screen and (max-width: 767px) {
    display: unset;
    position: unset;
    background-color: unset;
    min-width: unset;
    box-shadow: unset;
    z-index: unset;
    margin-top: unset;

    a {
      padding-left: 32px;
      :hover {
        background-color: unset;
      }
    }
  }
`;

const Orverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vh;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;

  @media screen and (max-width: 767px) {
    display: ${(props) => (props.vis ? "block" : "none")};
  }
`;

const Navbar = () => {
  const quantity = useSelector((state) => state.cart.quantity);
  const user = useSelector((state) => state.user.info);
  const navigate = useNavigate();

  const subMenuEl = useRef();
  const [sideMenuIsVisible, setSideMenuIsVisible] = useState(false);

  const closeSideMenu = (e) => {
    if (e.target.tagName === "A" || !subMenuEl.current.contains(e.target))
      setSideMenuIsVisible(false);
    document.body.classList.remove("lockScroll");
  };

  const logout = () => {
    doLogout();
  };

  const doSearch = (e) => {
    const searchText = document.getElementById("search").value;
    if (searchText) {
      navigate("/produtos?busca=" + searchText);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <SideMenuButton>
            <MenuRoundedIcon
              style={{ fontSize: "30px" }}
              onClick={() => {
                setSideMenuIsVisible((stt) => !stt);
                document.body.classList.toggle("lockScroll");
              }}
              data-testid="sidemenu-button"
            />
          </SideMenuButton>
          <Logo>
            <Link to="/">Loja Virtual</Link>
          </Logo>
        </Left>
        <Center>
          <SearchContainer>
            <Input
              id="search"
              placeholder="Qual produto você procura?"
              onKeyUp={(e) => {
                e.key === "Enter" && doSearch();
              }}
            />
            <Search
              style={{ color: "gray", fontSize: 16, cursor: "pointer" }}
              onClick={doSearch}
              data-testid="search-icon"
            />
          </SearchContainer>
        </Center>
        <Right>
          {user ? (
            <>
              <MenuItem className="userMenu">
                Olá, {user.firstname}!
                <ExpandMoreIcon />
                <Dropdown>
                  <Link to="/conta/pedidos">Meus Pedidos</Link>
                  <Link to="/conta/favoritos">Meus Favoritos</Link>
                  <Link to="/conta/dados">Meus Dados</Link>
                </Dropdown>
              </MenuItem>
              <MenuItem onClick={logout}>LOGOUT</MenuItem>
            </>
          ) : (
            <>
              <MenuItem>
                <Link to="/registrar">CADASTRAR</Link>
              </MenuItem>
              <MenuItem>
                <Link to="/login">ENTRAR</Link>
              </MenuItem>
            </>
          )}
          <Link to="/carrinho">
            <MenuItem style={{ paddingRight: "5px" }}>
              <Badge badgeContent={quantity} color="primary">
                <ShoppingCartOutlined />
              </Badge>
            </MenuItem>
          </Link>
        </Right>
      </Wrapper>
      <SubMenu
        ref={subMenuEl}
        style={{ left: sideMenuIsVisible ? "0" : "-200px" }}
        onClick={closeSideMenu}
        data-testid="sidemenu"
      >
        <div className="header">
          <Link className="logo" to="/">
            Loja Virtual
          </Link>
          {user ? (
            <>
              <div className="labelItem">Olá, {user.firstname}!</div>
              <Link className="authItem" onClick={logout} to="">
                LOGOUT
              </Link>
            </>
          ) : (
            <>
              <Link className="authItem" to="/login">
                ENTRAR
              </Link>
              <Link className="authItem" to="/registrar">
                CADASTRAR
              </Link>
            </>
          )}
          <div
            className="close"
            onClick={() => {
              setSideMenuIsVisible(false);
              document.body.classList.remove("lockScroll");
            }}
          >
            <CloseRoundedIcon />
          </div>
        </div>
        {user && (
          <div className="profileItems">
            <Dropdown>
              <Link to="/conta/pedidos">Meus Pedidos</Link>
              <Link to="/conta/favoritos">Meus Favoritos</Link>
              <Link to="/conta/dados">Meus Dados</Link>
            </Dropdown>
          </div>
        )}
        <CategoryItem>
          <Link to="/produtos?categoria=masculino">Masculino</Link>
          <Dropdown>
            <Link to="/produtos?categoria=masculino,camiseta">Camisetas</Link>
            <Link to="/produtos?categoria=masculino,calça">Calças</Link>
            <Link to="/produtos?categoria=masculino,calçado">Calçados</Link>
          </Dropdown>
        </CategoryItem>
        <CategoryItem>
          <Link to="/produtos?categoria=feminino">Feminino</Link>
          <Dropdown>
            <Link to="/produtos?categoria=feminino,camiseta">Camisetas</Link>
            <Link to="/produtos?categoria=feminino,calça">Calças</Link>
            <Link to="/produtos?categoria=feminino,calçado">Calçados</Link>
          </Dropdown>
        </CategoryItem>
        <CategoryItem>
          <Link to="/produtos?categoria=camiseta">Camisetas</Link>
        </CategoryItem>
        <CategoryItem>
          <Link to="/produtos?categoria=calça">Calças</Link>
        </CategoryItem>
        <CategoryItem>
          <Link to="/produtos?categoria=calçado">Calçados</Link>
        </CategoryItem>
      </SubMenu>
      <Orverlay vis={sideMenuIsVisible} onClick={closeSideMenu} />
    </Container>
  );
};

export default Navbar;
