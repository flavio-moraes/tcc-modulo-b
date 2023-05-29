import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Slider from "./Slider";

const sliderItems = [
  {
    id: 1,
    img: "slide1.jpg",
    title: "Título 1",
    desc: "Descrição slide 1",
    bg: "f5fafd",
    link: "/produtos?q=slide1",
  },
  {
    id: 2,
    img: "slide2.jpg",
    title: "Título 2",
    desc: "Descrição slide 2",
    bg: "fbf0f4",
    link: "/produtos",
  },
  {
    id: 3,
    img: "slide3.jpg",
    title: "Título 3",
    desc: "Descrição slide 3",
    bg: "fcf1ed",
    link: "/produtos?categoria=slide3",
  },
];

jest.mock("../data", () => ({
  sliderItems,
}));

describe("Slider", () => {
  beforeEach(() => {
    render(
      <Router>
        <Slider />
      </Router>
    );
  });

  test("left and right arrow button should change slide position correctly", async () => {
    const leftArrow = screen.getByTestId("left-arrow");
    const rightArrow = screen.getByTestId("right-arrow");
    const wrapper = screen.getByTestId("wrapper");

    expect(wrapper).toHaveStyle("transform: translateX(0vw)");

    fireEvent.click(leftArrow);
    expect(wrapper).toHaveStyle("transform: translateX(-200vw)");

    fireEvent.click(rightArrow);
    expect(wrapper).toHaveStyle("transform: translateX(0vw)");

    fireEvent.click(rightArrow);
    expect(wrapper).toHaveStyle("transform: translateX(-100vw)");
  });

  test("slide button should link to the correct route", () => {
    const button = screen.getAllByText("VER PRODUTOS")[0];
    fireEvent.click(button);
    expect(window.location.href).toMatch(sliderItems[0].link);
  });
});
