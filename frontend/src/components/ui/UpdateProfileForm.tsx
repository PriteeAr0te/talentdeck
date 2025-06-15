import React, { useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateProfileSchema,
  UpdateProfileSchema,
  updateProfileSchema,
} from "@/lib/validators/profileValidators";
import InputComponent from "@/components/ui/InputComponent";
import TextareaComponent from "@/components/ui/TextareaComponent";
import AddressSelector from "@/components/ui/AddressSelector";
import ImageUploadComponent from "@/components/ui/ImageUploadComponent";
import { DynamicLinksComponent } from "@/components/ui/DynamicLinksComponent";
import SkillsSelector from "@/components/ui/SkillsSelector";
import DropdownComponent from "@/components/ui/DropdownComponent";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import API from "@/lib/api";
import { AxiosError } from "axios";
import ProfilePhotoUpload from "./ProfilePhotoUpload";
import CheckboxField from "./CheckboxField";

interface UpdateProfileFormProps {
  defaultValues: UpdateProfileSchema;
  existingProfilePictureUrl?: string;
  existingProjectImageUrls?: string[];
}

export const CATEGORY_OPTIONS: CreateProfileSchema["category"][] = [
  "Graphic Designer",
  "UI/UX Designer",
  "Software Developer",
  "Content Creator",
  "Video Editor",
  "Other",
];

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
  defaultValues,
  existingProfilePictureUrl,
  existingProjectImageUrls,
}) => {
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [projectImagesFiles, setProjectImagesFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues,
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control,
    name: "socialLinks",
  });

  const { fields: portfolioFields, append: appendPortfolio, remove: removePortfolio } = useFieldArray({
    control,
    name: "portfolioLinks",
  });

  const isAxiosError = (error: unknown): error is AxiosError<{
    error?: {
      fieldErrors?: Partial<Record<keyof UpdateProfileSchema, string[]>>;
    };
  }> => {
    return typeof error === "object" && error !== null && "isAxiosError" in error;
  };

  const onSubmit: SubmitHandler<UpdateProfileSchema> = async (data) => {
    try {
      setUploadError("");
      const formData = new FormData();

      formData.append("username", data.username ?? "");
      formData.append("headline", data.headline || "");
      formData.append("bio", data.bio || "");
      formData.append("category", data.category ?? "");
      formData.append("location", JSON.stringify(data.location));
      formData.append("skills", JSON.stringify(data.skills));
      formData.append("availableforwork", String(data.availableforwork));
      formData.append("isVisible", String(data.isVisible));
      formData.append("portfolioLinks", JSON.stringify(data.portfolioLinks));
      formData.append("socialLinks", JSON.stringify(data.socialLinks));

      if (profilePicFile) {
        formData.append("profilePicture", profilePicFile);
      }

      if (projectImagesFiles.length > 0) {
        projectImagesFiles.forEach((file) => {
          formData.append("projectImages", file);
        });
      }

      const response = await API.put(`/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.success) {
        toast.success("Profile updated successfully!");
        router.push("/");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const status = err.response?.status;
        const fieldErrors = err.response?.data?.error?.fieldErrors;

        if (status === 400 && fieldErrors) {
          if (fieldErrors.profilePicture) setUploadError(fieldErrors.profilePicture[0]);
          else if (fieldErrors.projectImages) setUploadError(fieldErrors.projectImages[0]);
          else setUploadError("Invalid form data.");
        } else {
          setUploadError("Something went wrong. Please try again.");
        }
      } else {
        setUploadError("Something went wrong. Please try again.");
      }
      console.error("Update error:", err);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" transition={Slide} className="z-50" autoClose={6000} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto p-6 bg-white dark:bg-[#0A0011] rounded-xl space-y-10"
      >
        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Basic Information</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Let us know who you are and what you do.</p>
            </div>
            <div className="space-y-4">
              <InputComponent
                label="Username"
                id="username"
                registration={register("username")}
                error={errors.username?.message}
              />
              <InputComponent
                label="Headline"
                id="headline"
                registration={register("headline")}
                error={errors.headline?.message}
              />
              <TextareaComponent
                label="Bio"
                id="bio"
                registration={register("bio")}
                error={errors.bio?.message}
                rows={5}
                placeholder="Tell us about yourself"
              />
              <DropdownComponent<Partial<CreateProfileSchema>>
                name="category"
                label="Category"
                setValue={setValue}
                watch={watch}
                options={CATEGORY_OPTIONS}
                error={errors.category?.message}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Skills & Location</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Highlight your strongest areas and where you&apos;re based.</p>
            </div>
            <div className="space-y-4">
              <SkillsSelector<Partial<CreateProfileSchema>>
                control={control}
                name="skills"
                error={errors.skills?.message}
                setValue={setValue}
                watch={watch}
              />
              <AddressSelector register={register} errors={errors} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Profile Preferences</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Control visibility and availability.</p>
            </div>
            <div className="flex gap-6 items-center">
              <CheckboxField
                label="Available for Work"
                checked={watch("availableforwork") ?? false}
                onChange={(val) => setValue("availableforwork", val)}
              />
              <CheckboxField
                label="Public Profile"
                checked={watch("isVisible") ?? true}
                onChange={(val) => setValue("isVisible", val)}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Profile Image</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Upload a clear and professional profile picture.</p>
            </div>
            <div>
              <ProfilePhotoUpload
                value={profilePicFile}
                onChange={(file) => setProfilePicFile(file)}
                existingImageUrl={existingProfilePictureUrl}
                error={errors.profilePicture?.message}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Project Images</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Showcase your best work.</p>
            </div>
            <div>
              <ImageUploadComponent
                value={projectImagesFiles}
                onChange={setProjectImagesFiles}
                existingImageUrls={existingProjectImageUrls}
                error={uploadError}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Social Links</h2>
              <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Help people connect with you across platforms.</p>
            </div>
            <div>
              <DynamicLinksComponent<UpdateProfileSchema, "socialLinks">
                name="socialLinks"
                label="Social Links"
                register={register}
                errors={errors}
                fields={socialFields}
                append={appendSocial}
                remove={removeSocial}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6">
            <div>
              <h2 className="text-lg font-semibold dark:text-gray-200 text-gray-900">Portfolio Links</h2>
              <p className="text-sm darl:text-gray-400 text-gray-500 mt-1">Share your portfolio or relevant links.</p>
            </div>
            <div>
              <DynamicLinksComponent<UpdateProfileSchema, "portfolioLinks">
                name="portfolioLinks"
                label="Portfolio Links"
                register={register}
                errors={errors}
                fields={portfolioFields}
                append={appendPortfolio}
                remove={removePortfolio}
              />
            </div>
          </div>
        </fieldset>

        <div className="flex justify-end border-t dark:border-t-gray-200 border-t-gray-800">
          <button
            type="submit"
            className="mt-6 px-6 bg-primary text-white py-2 w-fit rounded-lg hover:bg-primary-dark cursor-pointer hover:bg-secondary focus:outline-none focus:border-0"
          >
            Update Profile
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateProfileForm;
