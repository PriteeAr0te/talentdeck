import React from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  Path,
} from "react-hook-form";
import InputComponent from "./InputComponent";

interface AddressSelectorProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

function AddressSelector<T extends FieldValues>({
  register,
  errors,
}: AddressSelectorProps<T>) {
 
  const getError = (field: "city" | "state" | "country"): string | undefined => {
    const locationErrors = errors?.location as
      | Partial<Record<"city" | "state" | "country", { message?: string }>>
      | undefined;

    return locationErrors?.[field]?.message;
  };

  return (
    <div className="mb-6 mt-2">
      <h3 className="text-base text-black dark:text-white font-medium mb-2">Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputComponent
          id="city"
          label="City"
          field="location"
          registration={register("location.city" as Path<T>)}
          error={getError("city")}
          placeholder="e.g. Pune"
        />
        <InputComponent
          id="state"
          label="State"
          field="location"
          registration={register("location.state" as Path<T>)}
          error={getError("state")}
          placeholder="e.g. Maharashtra"
        />
        <InputComponent
          id="country"
          label="Country"
          field="location"
          registration={register("location.country" as Path<T>)}
          error={getError("country")}
          placeholder="e.g. India"
        />
      </div>
    </div>
  );
}

export default AddressSelector;
