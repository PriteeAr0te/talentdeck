"use client";

import { useEffect, useState } from "react";
import FilterDropdownComponent from "@/components/ui/FilterDropdownComponent";

interface Location {
  country: string;
  state: string;
  city: string;
}

interface LocationSelectorFilterProps {
  location: Location;
  onChange: (location: Location) => void;
}

const countries = ["India", "USA", "Germany"];
const statesMap: Record<string, string[]> = {
  India: ["Maharashtra", "Gujarat", "Karnataka"],
  USA: ["California", "New York", "Texas"],
  Germany: ["Bavaria", "Berlin", "Hesse"],
};

const citiesMap: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Gujarat: ["Ahmedabad", "Surat"],
  Karnataka: ["Bangalore", "Mysore"],
  California: ["Los Angeles", "San Francisco"],
  NewYork: ["New York City", "Buffalo"],
  Texas: ["Austin", "Houston"],
  Bavaria: ["Munich", "Nuremberg"],
  Berlin: ["Berlin"],
  Hesse: ["Frankfurt", "Wiesbaden"],
};

export default function LocationSelectorFilter({ location, onChange }: LocationSelectorFilterProps) {
  const [selectedCountry, setSelectedCountry] = useState(location.country || "");
  const [selectedState, setSelectedState] = useState(location.state || "");
  const [selectedCity, setSelectedCity] = useState(location.city || "");

  useEffect(() => {
    onChange({ country: selectedCountry, state: selectedState, city: selectedCity });
  }, [selectedCountry, selectedState, selectedCity, onChange]);

  return (
    <div className="space-y-4">
      <FilterDropdownComponent
        label="Country"
        value={selectedCountry}
        options={[...countries]}
        placeholder="Select Country"
        onChange={(country) => {
          setSelectedCountry(country);
          setSelectedState("");
          setSelectedCity("");
        }}
      />

      {selectedCountry && (
        <FilterDropdownComponent
          label="State"
          value={selectedState}
          options={[...(statesMap[selectedCountry] || [])]}
          placeholder="Select State"
          onChange={(state) => {
            setSelectedState(state);
            setSelectedCity("");
          }}
        />
      )}

      {selectedState && (
        <FilterDropdownComponent
          label="City"
          value={selectedCity}
          options={[...(citiesMap[selectedState] || [])]}
          placeholder="Select City"
          onChange={setSelectedCity}
        />
      )}
    </div>
  );
}