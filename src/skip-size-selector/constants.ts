export const RoadPlacementOptions = [
  {
    value: "all",
    label: "All Types",
  },
  {
    value: "road-legal",
    label: "Road Legal Only",
  },
  {
    value: "private-only",
    label: "Private Only",
  },
];
export const HeavyWasteOptions = [
  {
    value: "all",
    label: "All Types",
  },
  {
    value: "heavy-ok",
    label: "Heavy OK",
  },
  {
    value: "no-heavy",
    label: "No Heavy",
  },
];
export const SizeOptions = [
  {
    value: "size-asc",
    label: "Size: Small to Large",
  },
  {
    value: "size-desc",
    label: "Size: Large to Small",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
  },
];
export const INITIAL_FILTERS = {
  priceRange: [0, 1200],
  sizeRange: [4, 40],
  roadLegalFilter: "all",
  heavyWasteFilter: "all",
  sortBy: "size",
  sortOrder: "asc",
};
