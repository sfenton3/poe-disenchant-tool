import type { Item } from "@/lib/itemData";
import type { Column } from "@tanstack/react-table";

import {
  createLowerBoundLinearValue,
  createLowerBoundSliderValue,
} from "./price-transforms";

// undefined means filter is disabled
export type PriceFilterValue = {
  min?: number;
  max?: number;
};

/**
 * Gets the current filter value from the table column
 */
export const getCurrentFilterValue = <TData extends Item>(
  column: Column<TData, unknown> | undefined,
): PriceFilterValue => {
  const value = column?.getFilterValue() as PriceFilterValue | undefined;
  if (value === undefined)
    return {
      min: undefined,
      max: undefined,
    };
  else return value;
};

/**
 * Sets the filter value on the table column
 *
 * NOTE: We always pass a fresh object when setting the filter, to avoid any
 * stale/mutated reference issues from downstream code or table internals.
 */
export const setFilterValue = <TData extends Item>(
  column: Column<TData, unknown> | undefined,
  value: PriceFilterValue | undefined,
): void => {
  if (!column) return;

  if (value === undefined) {
    column.setFilterValue(undefined);
  } else {
    const next: PriceFilterValue = {
      min: value.min,
      max: value.max,
    };
    column.setFilterValue(next);
  }
};

/**
 * Creates a normalized filter value against defaults.
 */
export const createNormalizedFilterValue = (
  range: PriceFilterValue,
  defaults: { min: number; max: number },
): PriceFilterValue | undefined => {
  const rawMin = range.min;
  const rawMax = range.max;

  const min =
    rawMin === undefined || rawMin === defaults.min ? undefined : rawMin;

  const max =
    rawMax === undefined || rawMax === defaults.max ? undefined : rawMax;

  if (min === undefined && max === undefined) {
    return undefined;
  }

  return { min, max };
};

/**
 * Updates the lower bound of the price range.
 * Ensures min does not exceed the effective max.
 */
export const updateLowerBound = (
  newMin: number,
  currentRange: PriceFilterValue,
  defaults: { max: number },
): PriceFilterValue => {
  const effectiveMax = currentRange.max ?? defaults.max;
  const min = Math.min(newMin, effectiveMax);

  return { ...currentRange, min };
};

/**
 * Updates the upper bound of the price range.
 *
 * - newMax >= defaults.max -> no upper bound (max: undefined)
 * - otherwise              -> max = newMax
 */
export const updateUpperBound = (
  newMax: number,
  currentRange: PriceFilterValue,
  defaults: { max: number },
): PriceFilterValue => {
  if (newMax >= defaults.max) {
    return { ...currentRange, max: undefined };
  }

  return { ...currentRange, max: newMax };
};

/**
 * Gets the effective maximum for lower bound calculations
 */
const getEffectiveMaxForLowerBound = <TData extends Item>(
  column: Column<TData, unknown> | undefined,
  defaults: { min: number; max: number },
): number => {
  const currentRange = getCurrentFilterValue(column);
  return currentRange.max ?? defaults.max;
};

/**
 * Converts lower bound linear value to slider value
 */
export const getLowerBoundSliderValue = <TData extends Item>(
  column: Column<TData, unknown> | undefined,
  linearValue: number | undefined,
  defaults: { min: number; max: number },
): number => {
  const value = linearValue ?? defaults.min;
  const effectiveMax = getEffectiveMaxForLowerBound(column, defaults);
  return createLowerBoundSliderValue(value, defaults.min, effectiveMax);
};

/**
 * Converts slider value to lower bound linear value
 */
export const getLowerBoundLinearValue = <TData extends Item>(
  column: Column<TData, unknown> | undefined,
  sliderValue: number,
  defaults: { min: number; max: number },
): number => {
  const effectiveMax = getEffectiveMaxForLowerBound(column, defaults);
  return createLowerBoundLinearValue(sliderValue, defaults.min, effectiveMax);
};

/**
 * Resets the filter to default state
 */
export const resetFilter = <TData extends Item>(
  column: Column<TData, unknown> | undefined,
): void => {
  setFilterValue(column, undefined);
};

/**
 * Checks if the lower bound filter is active.
 *
 * Interprets min strictly vs defaults.min.
 */
export const hasMinFilter = (
  range: PriceFilterValue,
  defaults: { min: number },
): boolean => {
  return range.min !== undefined && range.min !== defaults.min;
};

/**
 * Checks if the upper bound filter is active.
 *
 * IMPORTANT:
 * - max: undefined => no upper bound.
 * - max equal to defaults.max => treated as "no upper bound".
 */
export const hasMaxFilter = (
  range: PriceFilterValue,
  defaults: { max: number },
): boolean => {
  if (range.max === undefined) return false;
  return range.max !== defaults.max;
};
