import { shallow } from "enzyme";
import Home from "./Home";

describe("Home page", () => {
  test("renders Navbar, Slider, Categories, Products and Footer components", () => {
    const wrapper = shallow(<Home />);
    expect(wrapper.find('Navbar')).toHaveLength(1);
    expect(wrapper.find('Slider')).toHaveLength(1);
    expect(wrapper.find('Categories')).toHaveLength(1);
    expect(wrapper.find('Products')).toHaveLength(1);
    expect(wrapper.find('Footer')).toHaveLength(1);
  });
});
