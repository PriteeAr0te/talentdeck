import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileSchema, CreateProfileSchema } from "@/lib/validators/profileValidators";
import InputComponent from "@/components/ui/InputComponent";
import TextareaComponent from "@/components/ui/TextareaComponent";
import AddressSelector from "@/components/ui/AddressSelector";
import ImageUploadComponent from "@/components/ui/ImageUploadComponent";
import { DynamicLinksComponent } from "@/components/ui/DynamicLinksComponent";
import SkillsSelector from "@/components/ui/SkillsSelector";
import DropdownComponent from "@/components/ui/DropdownComponent";
import { ProfilePhotoUpload } from "@/components/ui/ProfilePhotoUpload";
import TagsSelector from "@/components/ui/TagsSelector";

import { useRouter } from "next/router";
import { Slide, toast, ToastContainer } from "react-toastify";
import API from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const CATEGORY_OPTIONS = [
    "Graphic Designer",
    "UI/UX Designer",
    "Software Developer",
    "Content Creator",
    "Video Editor",
    "Other",
];

// type LinkFieldError = {
//     label?: FieldError;
//     url?: FieldError;
// };

// function mapLinkErrors(
//     errors: FieldErrors<CreateProfileSchema>,
//     key: "socialLinks" | "portfolioLinks"
// ): LinkFieldError[] {
//     const linkErrors = errors[key];
//     if (!Array.isArray(linkErrors)) return [];
//     return linkErrors.map((fieldError) => ({
//         label: fieldError?.label,
//         url: fieldError?.url,
//     }));
// }

const CreateProfileForm: React.FC = () => {
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
    const [projectImagesFiles, setProjectImagesFiles] = useState<File[]>([]);
    const [uploadError, setUploadError] = useState("");

    const { setIsProfileCreated } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<CreateProfileSchema>({
        resolver: zodResolver(createProfileSchema),
        defaultValues: {
            skills: [],
            socialLinks: [{ label: "", url: "" }],
            portfolioLinks: [{ label: "", url: "" }],
            availableforwork: false,
            isVisible: true,
        },
    });

    const { fields: socialFields, append: addSocial, remove: removeSocial } = useFieldArray({
        control,
        name: "socialLinks",
    });

    const { fields: portfolioFields, append: addPortfolio, remove: removePortfolio } = useFieldArray({
        control,
        name: "portfolioLinks",
    });

    const onSubmit = async (data: CreateProfileSchema) => {
        try {
            setUploadError("");
            const formData = new FormData();

            formData.append("username", data.username);
            formData.append("headline", data.headline || "");
            formData.append("bio", data.bio || "");
            formData.append("category", data.category);
            formData.append("location", JSON.stringify(data.location));
            formData.append("skills", JSON.stringify(data.skills));
            formData.append("availableforwork", String(data.availableforwork));
            formData.append("isVisible", String(data.isVisible));
            formData.append("socialLinks", JSON.stringify(data.socialLinks));
            formData.append("portfolioLinks", JSON.stringify(data.portfolioLinks));

            if (profilePicFile) formData.append("profilePicture", profilePicFile);
            projectImagesFiles.forEach(file => formData.append("projectImages", file));

            const res = await API.post("/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 201 || res.data?.isProfileCreated) {
                toast.success("Profile created successfully!");
                setIsProfileCreated(true);
                reset();
                setProfilePicFile(null);
                setProjectImagesFiles([]);
                router.push("/");
            }
        } catch (err) {
            console.log("Error creating profile:", err);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} transition={Slide} />
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-6 space-y-10 bg-white dark:bg-[#0A0011] rounded-xl">

                {/* Basic Info */}
                <Section title="Basic Information" desc="Let us know who you are and what you do.">
                    <InputComponent label="Username" id="username" registration={register("username")} error={errors.username?.message} />
                    <InputComponent label="Headline" id="headline" registration={register("headline")} error={errors.headline?.message} />
                    <TextareaComponent label="Bio" id="bio" registration={register("bio")} error={errors.bio?.message} placeholder="Tell us about yourself" />
                    <DropdownComponent
                        name="category"
                        label="Category"
                        options={CATEGORY_OPTIONS}
                        setValue={setValue}
                        watch={watch}
                        error={errors.category?.message}
                    />
                </Section>

                {/* Skills & Location */}
                <Section title="Skills & Location" desc="Highlight your strongest areas and where you’re based.">
                    <SkillsSelector name="skills" control={control} setValue={setValue} watch={watch} error={errors.skills?.message} />
                    <TagsSelector name="tags" setValue={setValue} watch={watch} error={errors.tags?.message} />
                    <AddressSelector register={register} errors={errors} />
                </Section>

                <Section title="Profile Preferences" desc="Control visibility and availability.">
                    <CheckboxField label="Available for Work" checked={watch("availableforwork") ?? false} onChange={(val) => setValue("availableforwork", val)} />
                    <CheckboxField label="Public Profile" checked={watch("isVisible") ?? true} onChange={(val) => setValue("isVisible", val)} />
                </Section>

                <Section title="Profile Image" desc="Upload a clear and professional profile picture.">
                    <ProfilePhotoUpload value={profilePicFile} onChange={setProfilePicFile} error={errors.profilePicture?.message} />
                </Section>

                <Section title="Project Images" desc="Showcase your best work.">
                    <ImageUploadComponent value={projectImagesFiles} onChange={setProjectImagesFiles} error={uploadError} />
                </Section>

                <Section title="Social Links" desc="Help people connect with you across platforms.">
                    <DynamicLinksComponent
                        name="socialLinks"
                        fields={socialFields}
                        register={register}
                        errors={errors}
                        append={addSocial}
                        remove={removeSocial}
                        label="Social Links"
                    />
                </Section>

                <Section title="Portfolio Links" desc="Share your portfolio or relevant links.">
                    <DynamicLinksComponent
                        name="portfolioLinks"
                        fields={portfolioFields}
                        register={register}
                        errors={errors}
                        append={addPortfolio}
                        remove={removePortfolio}
                        label="Portfolio Links"
                    />
                </Section>

                {/* Submit */}
                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary">
                        Create Profile
                    </button>
                </div>
            </form>
        </>
    );
};

export default CreateProfileForm;

const Section = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
    <fieldset>
        <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500 mt-1">{desc}</p>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    </fieldset>
);

const CheckboxField = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (val: boolean) => void }) => (
    <label className="flex items-center space-x-2">
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="form-checkbox h-5 w-5 text-primary"
        />
        <span className="text-sm text-gray-700">{label}</span>
    </label>
);
