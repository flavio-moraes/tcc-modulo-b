import { shallow } from "enzyme";
import CategoryItem from "./CategoryItem";

describe("CategoryItem component", () => {
  const item = {
    cat: "test",
    img: "test.png",
    title: "Test Item",
  };

  it("should render an image with correct src", () => {
    const wrapper = shallow(<CategoryItem item={item} />);
    const image = wrapper.find("Image");
    expect(image.prop("src")).toEqual(item.img);
  });

  it("should render a link with correct href", () => {
    const wrapper = shallow(<CategoryItem item={item} />);
    const link = wrapper.find("Link");
    expect(link.prop("to")).toEqual(`/produtos?categoria=${item.cat}`);
  });

  it("should render a title with correct text", () => {
    const wrapper = shallow(<CategoryItem item={item} />);
    const title = wrapper.find("Title");
    expect(title.text()).toEqual(item.title);
  });

  it("should render a button with correct text", () => {
    const wrapper = shallow(<CategoryItem item={item} />);
    const button = wrapper.find("Button");
    expect(button.text()).toEqual("Ver Produtos");
  });
});
