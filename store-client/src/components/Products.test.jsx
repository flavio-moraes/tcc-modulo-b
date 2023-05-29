import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Products from "./Products";
import { getProductsRandom } from "../apiCalls";

jest.mock("../apiCalls");

describe("Products", () => {
  test("renders products when component is mounted", async () => {
    const mockProducts = [
      { id: 1, name: "Product 1", variants: [{ price: 10.99 }] },
      { id: 2, name: "Product 2", variants: [{ price: 15.99 }] },
    ];

    const { container } = render(
      <Router>
        <Products data={mockProducts} />
      </Router>
    );
    const productElements = await screen.findAllByTestId("product");
    expect(productElements).toHaveLength(mockProducts.length);
    expect(container).toContainElement(productElements[0]);
    expect(container).toContainElement(productElements[1]);
  });

  test("renders products when component is mounted with no initial data", async () => {
    const mockProducts = [
      { id: 1, name: "Product 1", variants: [{ price: 10.99 }] },
      { id: 2, name: "Product 2", variants: [{ price: 15.99 }] },
    ];
    getProductsRandom.mockResolvedValueOnce(mockProducts);
    render(
      <Router>
        <Products />
      </Router>
    );
    const productElements = await screen.findAllByTestId("product");
    expect(productElements).toHaveLength(mockProducts.length);
    expect(getProductsRandom).toHaveBeenCalled();
  });

  test("renders updated products when new data is passed as a prop", async () => {
    const mockProducts1 = [
      { id: 1, name: "Product 1", variants: [{ price: 10.99 }] },
      { id: 2, name: "Product 2", variants: [{ price: 15.99 }] },
    ];
    const mockProducts2 = [
      { id: 3, name: "Product 3", variants: [{ price: 20.99 }] },
      { id: 4, name: "Product 4", variants: [{ price: 25.99 }] },
      { id: 5, name: "Product 5", variants: [{ price: 30.99 }] },
    ];
    const { rerender } = render(
      <Router>
        <Products data={mockProducts1} />
      </Router>
    );
    let productElements = await screen.findAllByTestId("product");
    expect(productElements).toHaveLength(mockProducts1.length);
    rerender(
      <Router>
        <Products data={mockProducts2} />
      </Router>
    );
    productElements = await screen.findAllByTestId("product");
    expect(productElements).toHaveLength(mockProducts2.length);
    expect(screen.getByText("Product 3")).toBeInTheDocument();
    expect(screen.getByText("Product 4")).toBeInTheDocument();
    expect(screen.getByText("Product 5")).toBeInTheDocument();
  });
});
