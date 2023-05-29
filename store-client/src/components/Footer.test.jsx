import React from "react";
import { shallow } from "enzyme";
import { shallowToJson } from "enzyme-to-json";
import Footer from "./Footer";

describe("Footer component", () => {
  it("renders correctly", () => {
    const wrapper = shallow(<Footer />);

    expect(shallowToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find("p").at(0).text()).toContain("Loja Virtual S.A.");
  });
});
