import "@/style/global.css";
import { getHourAndMinutes } from "./hour-header";
import HourHeader from "./hour-header";

describe("<HourHeader />", () => {
  it("should render HourHeader", () => {
    cy.mount(<HourHeader />);

    cy.get("[data-cy=hour-header]").should("exist");
  });

  it("should render with correct hour", () => {
    cy.mount(<HourHeader />);

    const label = getHourAndMinutes();

    cy.get("[data-cy=hour-header]").should("exist").should("have.text", label);
  });
});
