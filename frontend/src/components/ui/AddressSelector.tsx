import React from "react";
import InputComponent from "./InputComponent";
import {
  UseFormRegister,
  FieldErrors,
  FieldPath,
  FieldValues,
} from "react-hook-form";

type AddressSelectorProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

function AddressSelector<T extends FieldValues>({
  register,
  errors,
}: AddressSelectorProps<T>) {
  const getErrorMessage = (fieldPath: FieldPath<T>) => {
    const error = (errors?.location as Record<string, { message?: string }>)?.[fieldPath];
    if (error && typeof error === "object" && "message" in error) {
      return (error as { message?: string }).message;
    }
    return undefined;
  };

  return (
    <div className="mb-6">
      <h3 className="text-base text-black font-medium mb-2">Location</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputComponent
          label="City"
          id="location.city"
          registration={register("location.city" as FieldPath<T>)}
          error={getErrorMessage("city" as FieldPath<T>)}
          placeholder="e.g. Pune"
        />
        <InputComponent
          label="State"
          id="location.state"
          registration={register("location.state" as FieldPath<T>)}
          error={getErrorMessage("state" as FieldPath<T>)}
          placeholder="e.g. Maharashtra"
        />
        <InputComponent
          label="Country"
          id="location.country"
          registration={register("location.country" as FieldPath<T>)}
          error={getErrorMessage("country" as FieldPath<T>)}
          placeholder="e.g. India"
        />
      </div>
    </div>
  );
}

export default AddressSelector;
