import { UseFormRegister, FieldErrors } from "react-hook-form";
import InputComponent from "./InputComponent";

interface LocationInputGroupProps {
    register: UseFormRegister<any>;
    errors: FieldErrors<any>;
}

const LocationInputGroup: React.FC<LocationInputGroupProps> = ({ register, errors }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputComponent
                label="City"
                registration={register("location.city")}
                error={Array.isArray(errors.location) ? errors.location[0]?.city?.message : undefined}
                id="location.city"
                name="location.city"
                placeholder="Enter city"
            />
            <InputComponent
                label="State"
                registration={register("location.state")}
                error={Array.isArray(errors.location) ? errors.location[0]?.state?.message : undefined}
                id="location.state"
                name="location.state"
                placeholder="Enter state"
            />
            <InputComponent
                label="Country"
                registration={register("location.country")}
                error={Array.isArray(errors.location) ? errors.location[0]?.country?.message : undefined}
                id="location.country"
                name="location.country"
                placeholder="Enter country"
            />
        </div>
    );
};

export default LocationInputGroup;
