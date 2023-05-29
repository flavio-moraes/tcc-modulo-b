import React from "react";

const MyElement = ({ isProduction }) => (
  <div>Environment: {isProduction ? "Production" : "Development"}</div>
);
const MyElementEl = React.createElement(MyElement);
export const isProduction = MyElementEl.type.name !== "MyElement";
