import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputSelector from "@/app/components/selector"; // adjust the import as needed
import "@testing-library/jest-dom"; // This gives us helpful assertions like toBeInTheDocument

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        { name: { common: "United States" } },
        { name: { common: "Canada" } },
        { name: { common: "Mexico" } },
      ]),
  })
) as jest.Mock;

describe("InputSelector Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render input and dropdown options", async () => {
    render(<InputSelector />);

    const inputElement = screen.getByPlaceholderText("Search countries...");
    expect(inputElement).toBeInTheDocument();

    fireEvent.change(inputElement, { target: { value: "C" } });

    await waitFor(() => screen.getByText("Canada"));
    expect(screen.getByText("Canada")).toBeInTheDocument();
    expect(screen.getByText("Mexico")).toBeInTheDocument();
  });

  it('should add country to the list when "Add" button is clicked', async () => {
    render(<InputSelector />);

    // Simulate the input change and click event
    const inputElement = screen.getByPlaceholderText("Search countries...");
    fireEvent.change(inputElement, { target: { value: "Canada" } });

    // Wait for the dropdown to show matching countries
    await waitFor(() => screen.getByText("Canada"));

    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);

    // Verify that the country has been added to the list
    expect(screen.getByText("Canada")).toBeInTheDocument();
  });
});
