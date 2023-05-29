import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Button from "./Button";

describe("Button component", () => {
  it("should render a button with the correct text", () => {
    const buttonText = "Click me!";
    const { getByRole } = render(<Button>{buttonText}</Button>);
    const button = getByRole("button");

    expect(button).toHaveTextContent(buttonText);
  });

  it("should be disabled when the disabled prop is passed", () => {
    const { getByRole } = render(<Button disabled />);
    const button = getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveStyle("background-color: gray");
    expect(button).toHaveStyle("cursor: wait");
  });
});
