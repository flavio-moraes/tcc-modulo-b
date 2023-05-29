import React from "react";
import { render } from "@testing-library/react";
import Categories from "./Categories";
import { categories } from "../data";
import { BrowserRouter as Router } from "react-router-dom";

describe("Categories Component", () => {
  it("renders a CategoryItem for each category", () => {
    const { getAllByTestId } = render(
      <Router>
        <Categories />
      </Router>
    );
    const categoryItems = getAllByTestId("category-item");
    expect(categoryItems).toHaveLength(categories.length);

    categoryItems.forEach((item, index) => {
      expect(item).toContainHTML(categories[index].title);
    });
  });

  it("passes the correct props to each CategoryItem", () => {
    const { getAllByTestId } = render(
      <Router>
        <Categories />
      </Router>
    );
    const categoryItems = getAllByTestId("category-item");

    categoryItems.forEach((item, index) => {
      expect(item).toHaveTextContent(categories[index].title);
      expect(item.querySelector("img")).toHaveAttribute(
        "src",
        categories[index].imageUrl
      );
    });
  });

  it("renders the correct number of children", () => {
    const { getAllByTestId } = render(
      <Router>
        <Categories />
      </Router>
    );
    const categoryList = getAllByTestId("category-item");

    expect(categoryList.length).toEqual(categories.length);
  });
});
