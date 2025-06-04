import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Filter, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LoadingCard from "../components/loading";
import {
  RoadPlacementOptions,
  HeavyWasteOptions,
  SizeOptions,
  INITIAL_FILTERS,
} from "./constants";
import Empty from "./components/Empty";
import SkipCard from "./components/SkipCard";

const SkipSizeSelector = () => {
  const [skips, setSkips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(INITIAL_FILTERS.priceRange[1]);

  const calculateTotalPrice = useCallback(
    (priceBeforeVat, vatRate) =>
      Math.round(priceBeforeVat * (1 + vatRate / 100)),
    []
  );

  useEffect(() => {
    const fetchSkips = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft"
        );
        if (!response.ok) throw new Error("Failed to fetch skips");
        const data = await response.json();
        setSkips(data);

        // Set price bounds
        const prices = data.map((skip) =>
          calculateTotalPrice(skip.price_before_vat, skip.vat)
        );
        const [minP, maxP] = [Math.min(...prices), Math.max(...prices)];

        setMinPrice(minP);
        setMaxPrice(maxP);
        setFilters((prev) => ({ ...prev, priceRange: [minP, maxP] }));
      } catch (err) {
        // show error toast
      } finally {
        setLoading(false);
      }
    };
    fetchSkips();
  }, [calculateTotalPrice]);

  const filteredAndSortedSkips = useMemo(() => {
    const filtered = skips.filter((skip) => {
      const totalPrice = calculateTotalPrice(skip.price_before_vat, skip.vat);
      const { priceRange, sizeRange, roadLegalFilter, heavyWasteFilter } =
        filters;

      return (
        totalPrice >= priceRange[0] &&
        totalPrice <= priceRange[1] &&
        skip.size >= sizeRange[0] &&
        skip.size <= sizeRange[1] &&
        (roadLegalFilter === "all" ||
          (roadLegalFilter === "road-legal" && skip.allowed_on_road) ||
          (roadLegalFilter === "private-only" && !skip.allowed_on_road)) &&
        (heavyWasteFilter === "all" ||
          (heavyWasteFilter === "heavy-ok" && skip.allows_heavy_waste) ||
          (heavyWasteFilter === "no-heavy" && !skip.allows_heavy_waste))
      );
    });

    return filtered.sort((a, b) => {
      const getValue = (skip) =>
        filters.sortBy === "price"
          ? calculateTotalPrice(skip.price_before_vat, skip.vat)
          : skip.size;

      const [aValue, bValue] = [getValue(a), getValue(b)];
      return filters.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  }, [skips, filters, calculateTotalPrice]);

  const updateFilter = useCallback(
    (key, value) => setFilters((prev) => ({ ...prev, [key]: value })),
    []
  );

  const resetFilters = useCallback(() => {
    const resetState = { ...INITIAL_FILTERS, priceRange: [minPrice, maxPrice] };
    setFilters(resetState);
  }, [minPrice, maxPrice]);

  const totalActiveFilters = useMemo(() => {
    const {
      priceRange: fPriceRange,
      sizeRange,
      roadLegalFilter,
      heavyWasteFilter,
    } = filters;
    return [
      fPriceRange[0] !== minPrice || fPriceRange[1] !== maxPrice,
      sizeRange[0] !== 4 || sizeRange[1] !== 40,
      roadLegalFilter !== "all",
      heavyWasteFilter !== "all",
    ].filter(Boolean).length;
  }, [filters, minPrice, maxPrice]);

  const handleSortChange = useCallback((value) => {
    const [sortBy, sortOrder] = value.split("-");
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const TitleComponent = () => (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">
        Choose Your Skip Size
      </h1>
      <p className="text-gray-600 text-lg">
        Select the perfect skip for your needs
      </p>
    </div>
  );

  const FilterSection = ({ label, children }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="mx-auto lg:max-w-[1280px] min-h-screen py-12 px-4 md:px-32 flex flex-col">
      <div className="min-w-full mx-auto h-full">
        <TitleComponent />

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                    {totalActiveFilters > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 px-1.5 py-0.5 text-xs"
                      >
                        {totalActiveFilters}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-6" align="start">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">
                      Filter Options
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FilterSection
                      label={`Price Range: £${filters.priceRange[0]} - £${filters.priceRange[1]}`}
                    >
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) =>
                          updateFilter("priceRange", value)
                        }
                        max={maxPrice}
                        min={minPrice}
                        step={1}
                        className="w-full"
                      />
                    </FilterSection>

                    <FilterSection
                      label={`Skip Size: ${filters.sizeRange[0]} - ${filters.sizeRange[1]} yards`}
                    >
                      <Slider
                        value={filters.sizeRange}
                        onValueChange={(value) =>
                          updateFilter("sizeRange", value)
                        }
                        max={12}
                        min={4}
                        step={1}
                        className="w-full"
                      />
                    </FilterSection>

                    <FilterSection label="Road Placement">
                      <Select
                        value={filters.roadLegalFilter}
                        onValueChange={(value) =>
                          updateFilter("roadLegalFilter", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RoadPlacementOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FilterSection>

                    <FilterSection label="Heavy Waste">
                      <Select
                        value={filters.heavyWasteFilter}
                        onValueChange={(value) =>
                          updateFilter("heavyWasteFilter", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HeavyWasteOptions.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FilterSection>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {filteredAndSortedSkips.length} of {skips.length} skips
                      match your filters
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset All
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {totalActiveFilters > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SizeOptions.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Showing {loading ? 0 : filteredAndSortedSkips.length} of{" "}
            {loading ? 0 : skips.length} skips
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {loading
            ? Array.from({ length: 8 }, (_, i) => <LoadingCard key={i} />)
            : filteredAndSortedSkips.map((skip) => (
                <SkipCard
                  skip={skip}
                  calculateTotalPrice={calculateTotalPrice}
                  key={skip.id}
                />
              ))}
        </div>

        {filteredAndSortedSkips.length === 0 && (
          <Empty resetFilters={resetFilters} />
        )}
      </div>

      <div className="text-center text-gray-500 text-sm mt-auto">
        <p>
          All prices include delivery to NR32 Lowestoft • Free collection
          included
        </p>
      </div>
    </div>
  );
};

export default SkipSizeSelector;
