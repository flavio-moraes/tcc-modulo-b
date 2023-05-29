import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Product from "./Product";

describe("Product", () => {
  beforeEach(() => {
    const item = {
      id: "123",
      name: "Product A",
      variants: [{ price: 10.99 }],
      image: "image.jpg",
    };
    render(
      <Router>
        <Product item={item} />
      </Router>
    );
  });

  test("renders name and price of the product", () => {
    expect(screen.getByText("Product A")).toBeInTheDocument();
    expect(screen.getByText("R$ 10,99")).toBeInTheDocument();
  });

  test("renders product image", () => {
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "image.jpg");
  });

  test('renders "Conferir" button on hover', () => {
    const container = screen.getByRole("link");
    fireEvent.click(container);
    expect(window.location.href).toMatch("/produto/123");
  });
});
