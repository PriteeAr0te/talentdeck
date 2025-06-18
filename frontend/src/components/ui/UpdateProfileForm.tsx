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
import TagsSelector from "./TagsSelector";
import { useAuth } from "@/hooks/useAuth";

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
  existingProjectImageUrls = [],
}) => {
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [projectImagesFiles, setProjectImagesFiles] = useState<File[]>([]);
  const [projectImagesToKeep, setProjectImagesToKeep] = useState<string[]>(existingProjectImageUrls ?? []);
  const [uploadError, setUploadError] = useState<string>("");
  const router = useRouter();
  const { setUser } = useAuth();

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
      formData.append("skills", JSON.stringify(data.skills ?? []));
      formData.append("tags", JSON.stringify(data.tags ?? []));
      formData.append("availableforwork", String(data.availableforwork));
      formData.append("isVisible", String(data.isVisible));
      formData.append("portfolioLinks", JSON.stringify(data.portfolioLinks ?? []));
      formData.append("socialLinks", JSON.stringify(data.socialLinks ?? []));
      formData.append("projectImagesToKeep", JSON.stringify(projectImagesToKeep));

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
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const updatedUser = { ...JSON.parse(storedUser), username: response?.data?.username?.trim(), profileCreated: true };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
        router.push("/profile/view");
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
      <ToastContainer position="top-right" autoClose={5000} transition={Slide} />
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-6 space-y-10 bg-white dark:bg-[#0A0011] rounded-xl">

        <Section title="Basic Information" desc="Let us know who you are and what you do.">
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

        </Section>

        <Section title="Skills & Location" desc="Highlight your strongest areas and where you’re based.">
          <SkillsSelector<Partial<CreateProfileSchema>>
            control={control}
            name="skills"
            error={errors.skills?.message}
            setValue={setValue}
            watch={watch}
          />

          <TagsSelector<Partial<CreateProfileSchema>>
            control={control}
            name="tags"
            error={errors.tags?.message}
            setValue={setValue}
            watch={watch}
          />

          <AddressSelector
            register={register}
            errors={errors}
          />
        </Section>

        <Section title="Profile Preferences" desc="Control visibility and availability.">
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
        </Section>

        <Section title="Profile Image" desc="Upload a clear and professional profile picture.">
          <ProfilePhotoUpload
            value={profilePicFile}
            onChange={(file) => setProfilePicFile(file)}
            existingImageUrl={existingProfilePictureUrl}
            error={errors.profilePicture?.message}
          />
        </Section>

        <Section title="Project Images" desc="Showcase your best work.">
          <ImageUploadComponent
            value={projectImagesFiles}
            onChange={setProjectImagesFiles}
            existingImageUrls={existingProjectImageUrls}
            onRetainUrlsChange={setProjectImagesToKeep}
            error={uploadError}
          />

        </Section>

        <Section title="Social Links" desc="Help people connect with you across platforms.">
          <DynamicLinksComponent<UpdateProfileSchema, "socialLinks">
            name="socialLinks"
            label="Social Links"
            register={register}
            errors={errors}
            fields={socialFields}
            append={appendSocial}
            remove={removeSocial}
          />
        </Section>

        <Section title="Portfolio Links" desc="Share your portfolio or relevant links.">
          <DynamicLinksComponent<UpdateProfileSchema, "portfolioLinks">
            name="portfolioLinks"
            label="Portfolio Links"
            register={register}
            errors={errors}
            fields={portfolioFields}
            append={appendPortfolio}
            remove={removePortfolio}
          />
        </Section>

        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-primary dark:hover:text-[#51008c] text-white rounded-lg hover:bg-secondary">
            Update Profile
          </button>
        </div>
      </form>
    </>
  );
};

export default UpdateProfileForm;


const Section = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
  <fieldset>
    <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
      <div>
        <h2 className="text-lg font-semibold dark:text-white text-gray-900">{title}</h2>
        <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">{desc}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  </fieldset>
);
