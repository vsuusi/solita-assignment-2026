describe("electricity app suite", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads dashboard and displays data", () => {
    cy.get("table").should("be.visible");
    cy.get("tbody tr").should("have.length.at.least", 10);
  });
  it("change page and change page result limit", () => {
    // first row should be x
    const firstRow = cy.get("tbody tr").first();
    // click change page
    cy.get('[data-testid="page-btn-next"]').click();
    const firstRowOnPage2 = cy.get("tbody tr").first();

    expect(firstRow).not.to.eq(firstRowOnPage2);

    cy.get('[data-testid="pagination-limit"]').select("25");
    cy.get("tbody tr").should("have.length.at.least", 25);
  });
  it("open drilldown details and ensure they are visible", () => {
    // clikc open details
    cy.contains("View Details").last().click();

    cy.url().should("include", "/day/");

    // ensure stuff is visible
    cy.contains("TOTAL PRODUCTION").should("be.visible");
    cy.contains("TOTAL CONSUMPTION").should("be.visible");
    cy.contains("AVERAGE PRICE").should("be.visible");
    cy.contains("PEAK CONSUMPTION HOUR").should("be.visible");
    cy.contains("PEAK PRODUCTION HOUR").should("be.visible");
    cy.contains("CHEAPEST HOURS").should("be.visible");
    cy.contains("MOST EXPENSIVE HOURS").should("be.visible");
    cy.contains("PRICE MOVEMENT").should("be.visible");
    cy.contains("ELECTRICITY PATTERN").should("be.visible");
    cy.contains("Hourly breakdown").should("be.visible");

    // ensure back buttons are visible and click it
    cy.get('[data-testid="back-btn"]').should("have.length", 2).first().click();
    // expect to be at dashboard page
    cy.get("table").should("be.visible");
    cy.url().should("not.include", "/day/");
  });
});
