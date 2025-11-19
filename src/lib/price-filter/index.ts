// Export all types
export type { PriceFilterValue } from "./price-filter-logic";

// Export all business logic functions
export {
  getCurrentFilterValue,
  setFilterValue,
  createNormalizedFilterValue,
  updateLowerBound,
  updateUpperBound,
  getLowerBoundSliderValue,
  getLowerBoundLinearValue,
  hasActiveFilter,
  resetFilter,
  hasMinFilter,
  hasMaxFilter,
} from "./price-filter-logic";
