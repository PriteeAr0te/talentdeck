import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileSchema, CreateProfileSchema } from "@/lib/validators/profileValidators";
import InputComponent from "@/components/ui/InputComponent";
import AddressSelector from "@/components/ui/AddressSelector";
import ImageUploadComponent from "@/components/ui/ImageUploadComponent";
import { DynamicLinksComponent } from "@/components/ui/DynamicLinksComponent";
import SkillsSelector from "@/components/ui/SkillsSelector";
import DropdownComponent from "@/components/ui/DropdownComponent";
import TagsSelector from "@/components/ui/TagsSelector";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import API from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import CheckboxField from "../ui/CheckboxField";
import ProfilePhotoUpload from "../ui/ProfilePhotoUpload";
import { cleanLinks } from "@/lib/utils";
import RichTextEditorComponent from "../rich-text-editor/RichTextareaComponent";
import axios from "axios";

const CATEGORY_OPTIONS = [
    "Graphic Designer",
    "UI/UX Designer",
    "Software Developer",
    "Content Creator",
    "Video Editor",
    "Other",
];

const CreateProfileForm: React.FC = () => {
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
    const [projectImagesFiles, setProjectImagesFiles] = useState<File[]>([]);
    const [uploadError, setUploadError] = useState("");
    const { setUser } = useAuth();
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
            category: undefined,
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

    watch('category');

    const onSubmit = async (data: CreateProfileSchema) => {
        try {
            setUploadError("");
            const formData = new FormData();

            formData.append("username", data.username.trim());
            formData.append("headline", data.headline || "");
            formData.append("bio", data.bio?.trim() || "");
            formData.append("category", data.category);
            formData.append("location", JSON.stringify(data.location));
            formData.append("skills", JSON.stringify(data.skills));
            formData.append("tags", JSON.stringify(data.tags));
            formData.append("availableforwork", String(data.availableforwork));
            formData.append("isVisible", String(data.isVisible));
            formData.append("socialLinks", JSON.stringify(cleanLinks(data.socialLinks ?? [])));
            formData.append("portfolioLinks", JSON.stringify(cleanLinks(data.portfolioLinks ?? [])));

            if (profilePicFile) formData.append("profilePicture", profilePicFile);
            projectImagesFiles.forEach((file) =>
                formData.append("projectImages", file)
            );

            const res = await API.post("/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 201 || res.data?.profileCreated) {
                toast.success("Profile created successfully!");

                const updatedUser = res.data.user;
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUser(updatedUser);

                reset();
                setProfilePicFile(null);
                setProjectImagesFiles([]);
                router.push("/profile/view");
            }
        } catch (error) {
            console.log("Error creating profile:", error);

            if (axios.isAxiosError(error)) {
                const fieldErrors = error.response?.data?.error?.fieldErrors;
                const generalError = error.response?.data?.error;

                console.log("Errors:", fieldErrors, generalError);

                const toastMessage =
                    fieldErrors?.username?.[0] ??
                    (typeof generalError === "string" ? generalError : "Something went wrong.");
                toast.error(toastMessage);

            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }

    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-6 space-y-10 bg-white dark:bg-[#0A0011] rounded-xl">

                <Section title="Profile Image" desc="Upload a clear and professional profile picture.">
                    <ProfilePhotoUpload
                        value={profilePicFile}
                        onChange={setProfilePicFile}
                        error={errors.profilePicture?.message}
                    />
                </Section>

                <Section title="Basic Information" desc="Let us know who you are and what you do.">
                    <InputComponent
                        id="username"
                        label="Username"
                        registration={register("username")}
                        error={errors.username?.message}
                    />

                    <InputComponent
                        label="Headline"
                        id="headline"
                        registration={register("headline")}
                        error={errors.headline?.message}
                    />

                    <RichTextEditorComponent
                        id="bio"
                        label="Bio"
                        value={watch("bio") ?? ""}
                        onChange={(val) => setValue("bio", val, { shouldValidate: true })}
                        error={errors.bio?.message}
                    />

                    <DropdownComponent
                        name="category"
                        label="Category"
                        options={CATEGORY_OPTIONS}
                        setValue={setValue}
                        watch={watch}
                        error={errors.category?.message}
                    />

                </Section>

                <Section title="Skills & Location" desc="Highlight your strongest areas and where you’re based.">
                    <SkillsSelector
                        name="skills"
                        control={control}
                        setValue={setValue}
                        watch={watch}
                        error={errors.skills?.message}
                    />
                    <TagsSelector
                        control={control}
                        name="tags"
                        setValue={setValue}
                        watch={watch}
                        error={errors.tags?.message}
                    />
                    <AddressSelector register={register} errors={errors} />
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

                <Section title="Project Images" desc="Showcase your best work.">
                    <ImageUploadComponent value={projectImagesFiles} onChange={setProjectImagesFiles} error={uploadError} />
                </Section>

                <Section title="Social Links" desc="Help people connect with you across platforms.">
                    <DynamicLinksComponent
                        name="socialLinks"
                        label="Social Links"
                        register={register}
                        errors={errors}
                        fields={socialFields}
                        append={addSocial}
                        remove={removeSocial}
                    />
                </Section>

                <Section title="Portfolio Links" desc="Share your portfolio or relevant links.">
                    <DynamicLinksComponent
                        name="portfolioLinks"
                        label="Portfolio Links"
                        register={register}
                        errors={errors}
                        fields={portfolioFields}
                        append={addPortfolio}
                        remove={removePortfolio}
                    />
                </Section>

                <div className="flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-primary text-white dark:text-gray-900 font-medium cursor-pointer hover:dark:text-gray-100 rounded-lg hover:bg-secondary">
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
            <div className="mb-3 sm:mb-2">
                <h2 className="text-lg font-semibold dark:text-white text-gray-900">{title}</h2>
                <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">{desc}</p>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    </fieldset>
);