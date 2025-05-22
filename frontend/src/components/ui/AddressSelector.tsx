import React from "react";
import InputComponent from "./InputComponent";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface AddressSelectorProps {
    register: UseFormRegister<any>;
    errors: FieldErrors;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ register, errors }) => {
    return (
        <div className="mb-6">
            <h3 className="text-base text-black font-medium mb-2">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputComponent
                    label="City"
                    id="location.city"
                    registration={register("location.city")}
                    error={Array.isArray(errors.location) ? errors.location[0]?.city?.message : undefined}
                    placeholder="e.g. Pune"
                />
                <InputComponent
                    label="State"
                    id="location.state"
                    registration={register("location.state")}
                    error={Array.isArray(errors.location) ? errors.location[0]?.state?.message : undefined}
                    placeholder="e.g. Maharashtra"
                />
                <InputComponent
                    label="Country"
                    id="location.country"
                    registration={register("location.country")}
                    error={Array.isArray(errors.location) ? errors.location[0]?.country?.message : undefined}
                    placeholder="e.g. India"
                />
            </div>
        </div>
    );
};

export default AddressSelector;
