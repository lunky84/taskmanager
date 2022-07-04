import { render } from "@testing-library/react";
import Header from "./Header";

jest.mock("next/router", () => ({
  useRouter() {
      return {
          pathname: ""
      };
  },
}));

describe("Header", () => {
  it("renders a home link", () => {
    const output = render(<Header />);
    // console.log(output.debug());
    const homeMenuItem = output.getByText("Home");

    expect(homeMenuItem).toBeInTheDocument();
  });
});
