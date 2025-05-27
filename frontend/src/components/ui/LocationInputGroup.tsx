import { UseFormRegister, FieldErrors } from "react-hook-form";
import InputComponent from "./InputComponent";

type LocationType = {
    city: string;
    state: string;
    country: string;
  };

  
interface LocationInputGroupProps {
    register: UseFormRegister<{ location: LocationType }>;
    errors: FieldErrors<{ location: LocationType }>;
  }

const LocationInputGroup: React.FC<LocationInputGroupProps> = ({ register, errors }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputComponent
                label="City"
                registration={register("location.city")}
                error={errors?.location?.city?.message}
                id="location.city"
                name="location.city"
                placeholder="Enter city"
            />
            <InputComponent
                label="State"
                registration={register("location.state")}
                error={errors?.location?.state?.message}
                id="location.state"
                name="location.state"
                placeholder="Enter state"
            />
            <InputComponent
                label="Country"
                registration={register("location.country")}
                error={errors?.location?.country?.message}
                id="location.country"
                name="location.country"
                placeholder="Enter country"
            />

        </div>
    );
};

export default LocationInputGroup;
