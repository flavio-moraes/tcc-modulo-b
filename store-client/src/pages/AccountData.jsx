import styled from "styled-components";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSession, updateUser } from "../apiCalls";
import { toast } from "react-toastify";
import MyButton from "../components/Button";

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
  max-width: 600px;
  padding: 0px 20px 0px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;

  label {
    margin-top: 15px;
    margin-bottom: 3px;
  }

  input,
  select {
    padding: 10px;
    font-size: 14px;

    :focus {
      outline: none;
    }
  }

  .sideBySide {
    display: flex;
    flex-wrap: wrap;
    column-gap: 20px;
  }

  .sbsItem,
  .sbsItemBig,
  .sbsItemSml {
    flex: 1;
    min-width: 240px;
    display: flex;
    flex-direction: column;
  }

  .sbsItemBig {
    flex: 3;
    min-width: 300px;
  }

  .sbsItemSml {
    flex: 1;
    min-width: 100px;
  }

  button {
    margin-top: 30px;
  }

  .lnk {
    color: rgb(63, 81, 181);
    cursor: pointer;
    align-self: center;
  }

  .invalid {
    border-color: red;
  }
`;

const ImgSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    padding: 6px 10px 6px 10px;
    background-color: white;
    border-radius: 15px;
    font-size: 16px;
    box-shadow: 5px 5px 6px 0px rgba(0, 0, 0, 0.33);
    margin-top: 8px;
    cursor: pointer;
    transition: height, width 0.5s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  #file {
    display: none;
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const Title = styled.h1``;

const AccountData = () => {
  const [disableInput, setDisableInput] = useState(true);
  const [disableButton, setDisableButton] = useState(false);
  const user = useSelector((state) => state.user.info);
  const [newData, setNewData] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    password: "000000",
    address: {
      streetName: user.address?.streetName || "",
      streetNumber: user.address?.streetNumber || "",
      cityName: user.address?.cityName || "",
      stateName: user.address?.stateName || "",
      zipCode: user.address?.zipCode || "",
    },
  });

  const noimage = "/img/avatar_noimage.svg";
  const [imageSrc, setImageSrc] = useState(user.image || noimage);
  const [file, setFile] = useState("");

  function newDataRefresh() {
    setNewData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: "000000",
      address: {
        streetName: user.address?.streetName || "",
        streetNumber: user.address?.streetNumber || "",
        cityName: user.address?.cityName || "",
        stateName: user.address?.stateName || "",
        zipCode: user.address?.zipCode || "",
      },
    });
  }

  function removeInvalidClass() {
    document.querySelectorAll("[name]").forEach((el) => {
      el.classList.remove("invalid");
    });
  }

  const rootInputChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const addressInputChange = (e) => {
    setNewData({
      ...newData,
      address: {
        ...newData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  const fileInputChange = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    setImageSrc(URL.createObjectURL(e.target.files[0]));
    document.getElementById("file").value = "";
  };

  const removeImgBtnClick = (e) => {
    e.preventDefault();
    if (user.image && !newData.removeimg) {
      let img = user.image.split("/");
      img = img[img.length - 1];
      setNewData({ ...newData, removeimg: img });
    } else {
      URL.revokeObjectURL(imageSrc);
    }
    setFile("");
    setImageSrc(noimage);
  };

  const toggleEdition = (e) => {
    e.preventDefault();
    newDataRefresh();
    setFile("");
    setImageSrc(user.image || noimage);
    removeInvalidClass();
    setDisableInput(!disableInput);
  };

  const confirmEdition = (e) => {
    e.preventDefault();

    removeInvalidClass();
    const formData = new FormData();
    let hasChange = false;
    let invalidFlag = false;
    let { address, ...others } = newData;

    Object.keys(others).forEach((key) => {
      let value = others[key];
      if (value != null && value !== "") {
        if (value !== user[key]) {
          formData.append(key, value);
          hasChange = true;
        }
      } else {
        invalidFlag = true;
        document.querySelector(`[name=${key}]`).classList.add("invalid");
      }
    });

    Object.keys(address).forEach((key) => {
      let value = address[key];
      if (value != null && value !== "") {
        if (value !== user.address?.[key]) {
          hasChange = true;
        }
      } else {
        invalidFlag = true;
        document.querySelector(`[name=${key}]`).classList.add("invalid");
      }
    });

    if (invalidFlag) {
      toast.error("Os campos destacados devem ser preenchidos.");
      return;
    }

    if (file) {
      formData.append("img", file);
      hasChange = true;
    }

    if (!hasChange) {
      toast.error("É preciso haver alguma atualização nos dados.");
      return;
    }

    if (others.password === "000000") {
      formData.delete("password");
    }

    formData.append("address", JSON.stringify(address));

    setDisableButton(true);
    updateUser(user.id, formData)
      .then((res) => {
        toast("Dados da conta modificados com sucesso.");
        getSession();
        setDisableButton(false);
        setDisableInput(true);
      })
      .catch((err) => {
        toast.error("Erro ao modificar dados da conta.");
        setDisableButton(false);
      });
  };

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <SubContainer>
          <Title>Minha Conta</Title>

          <ImgSection>
            <Image src={imageSrc} data-testid="image" />
            {!disableInput &&
              (imageSrc === noimage ? (
                <label htmlFor="file"> Carregar imagem </label>
              ) : (
                <label onClick={removeImgBtnClick}> Remover imagem </label>
              ))}
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={fileInputChange}
              disabled={disableInput}
            />
          </ImgSection>

          <div className="sbsItem">
            <label>Nome:</label>
            <input
              type="text"
              disabled={disableInput}
              name="firstname"
              value={newData.firstname}
              onChange={rootInputChange}
              placeholder="Nome"
            />
          </div>

          <div className="sbsItem">
            <label>Sobrenome:</label>
            <input
              type="text"
              disabled={disableInput}
              name="lastname"
              value={newData.lastname}
              onChange={rootInputChange}
              placeholder="Sobrenome"
            />
          </div>

          <div className="sbsItem">
            <label>E-mail:</label>
            <input
              type="mail"
              disabled={disableInput}
              name="email"
              value={newData.email}
              onChange={rootInputChange}
              placeholder="E-mail"
            />
          </div>

          <div className="sideBySide">
            <div className="sbsItem">
              <label>Senha:</label>
              <input
                type="password"
                disabled={disableInput}
                name="password"
                value={newData.password}
                onChange={rootInputChange}
                placeholder="Senha"
              />
            </div>
            <div className="sbsItem">
              <label></label>
            </div>
          </div>

          <div className="sideBySide">
            <div className="sbsItemBig">
              <label>Rua:</label>
              <input
                type="text"
                disabled={disableInput}
                name="streetName"
                value={newData.address.streetName}
                onChange={addressInputChange}
                placeholder="Nome da rua"
              />
            </div>
            <div className="sbsItemSml">
              <label>Número:</label>
              <input
                type="text"
                disabled={disableInput}
                name="streetNumber"
                value={newData.address.streetNumber}
                onChange={addressInputChange}
                placeholder="Nº do imóvel"
              />
            </div>
          </div>
          <div className="sideBySide">
            <div className="sbsItemBig">
              <label>Cidade:</label>
              <input
                type="text"
                disabled={disableInput}
                name="cityName"
                value={newData.address.cityName}
                onChange={addressInputChange}
                placeholder="Nome da cidade"
              />
            </div>
            <div className="sbsItemSml">
              <label>Estado:</label>
              <input
                type="text"
                disabled={disableInput}
                name="stateName"
                value={newData.address.stateName}
                onChange={addressInputChange}
                placeholder="Sigla do Estado"
              />
            </div>
          </div>
          <div className="sbsItem">
            <label>CEP:</label>
            <input
              type="text"
              disabled={disableInput}
              name="zipCode"
              value={newData.address.zipCode}
              onChange={addressInputChange}
              placeholder="CEP"
            />
          </div>

          {disableInput ? (
            <MyButton onClick={toggleEdition}>
              Modificar dados da conta
            </MyButton>
          ) : (
            <div className="sideBySide">
              <div className="sbsItem">
                <MyButton onClick={confirmEdition} disabled={disableButton}>
                  Confirmar modificação
                </MyButton>
              </div>
              <div className="sbsItem">
                <MyButton onClick={toggleEdition} disabled={disableButton}>
                  Cancelar
                </MyButton>
              </div>
            </div>
          )}
        </SubContainer>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default AccountData;
