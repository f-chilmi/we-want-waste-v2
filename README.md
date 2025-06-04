# Skip Size Selector

This React project allows users to browse, filter, and sort skip sizes available for hire based on a specified location (postcode and area).

## Features

- **Dynamic Skip Loading**: Fetches skip data from an API.

- **Filtering**:

  - **Price Range**: Filter skips within a specified price range.
  - **Size Range**: Filter skips by skip size (in yards).
  - **Road Placement**: Filter for skips that are "Road Legal", "Private Only", or "All Types".
  - **Heavy Waste**: Filter for skips that allow heavy waste ("Heavy OK", "No Heavy", or "All Types").

- **Sorting**: Sort skips by price or size in ascending or descending order.

- **Loading State**: Displays a loading skeleton while fetching data.

- **Responsive Design**: Adapts the layout for different screen sizes.

- **Filter Management**:
  - Toggle filter visibility.
  - Indicates when active filters are applied.
  - Option to reset all filters.

## Components Used

This component integrates with various UI components from Shadcn UI library

## Data Structure

The component expects skip data in the following format:

```typescript
interface Skip {
  id: number;
  size: number; // Skip size in yards
  hire_period_days: number;
  price_before_vat: number;
  vat: number; // VAT rate as a percentage
  allowed_on_road: boolean; // true if road legal, false if private only
  allows_heavy_waste: boolean; // true if allows heavy waste
}
```

## How to Run

To run this project locally, follow these steps:

1.  Clone the repository:

    ```bash
    git clone https://github.com/f-chilmi/we-want-waste-v2.git
    ```

2.  Navigate to the project directory:

    ```
    cd we-want-waste-v2
    ```

3.  Install dependencies:

    ```
    npm install
    ```

4.  Start the development server:
    ```
    npm run dev
    ```
