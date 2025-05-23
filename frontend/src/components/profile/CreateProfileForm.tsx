import React, { useReducer, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileSchema, CreateProfileSchema } from "@/lib/validators/profileValidators";
import InputComponent from "@/components/ui/InputComponent";
import TextareaComponent from "@/components/ui/TextareaComponent";
import AddressSelector from "@/components/ui/AddressSelector";
import ImageUploadComponent from "@/components/ui/ImageUploadComponent";
import DynamicLinksComponent from "@/components/ui/DynamicLinksComponent";
import SkillsSelector from "@/components/ui/SkillsSelector";
import DropdownComponent from "../ui/DropdownComponent";
import { ProfilePhotoUpload } from "../ui/ProfilePhotoUpload";
import { useRouter } from "next/router";
import { Slide, toast, ToastContainer } from "react-toastify";
import API from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const CreateProfileForm: React.FC = () => {
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
    const [projectImagesFiles, setProjectImagesFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>("");
    const {setIsProfileCreated} = useAuth();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<CreateProfileSchema>({
        resolver: zodResolver(createProfileSchema) as any,
        defaultValues: {
            skills: [],
            socialLinks: [{ label: '', url: '' }],
            portfolioLinks: [{ label: '', url: '' }],
            availableforwork: false,
            isVisible: true,
        },
    });


    const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
        control,
        name: "socialLinks",
    });

    const { fields: portfolioFields, append: appendPortfolio, remove: removePortfolio } = useFieldArray({
        control,
        name: "portfolioLinks",
    });

    const router = useRouter();

    const onSubmit: SubmitHandler<CreateProfileSchema> = async (data: CreateProfileSchema) => {
        try {
            setError("");
            const formData = new FormData();

            // Structured data
            formData.append("username", data.username);
            formData.append("headline", data.headline || "");
            formData.append("bio", data.bio || "");
            formData.append("category", data.category);
            formData.append("location", JSON.stringify(data.location));
            formData.append("skills", JSON.stringify(data.skills));
            formData.append("availableforwork", String(data.availableforwork));
            formData.append("isVisible", String(data.isVisible));
            formData.append("portfolioLinks", JSON.stringify(data.portfolioLinks));
            formData.append("socialLinks", JSON.stringify(data.socialLinks));

            // ✅ Profile Picture (must match multer field name)
            if (profilePicFile) {
                formData.append("profilePicture", profilePicFile);
            }

            // ✅ Project Images (must match multer field name)
            if (projectImagesFiles && projectImagesFiles.length > 0) {
                projectImagesFiles.forEach((file) => {
                    formData.append("projectImages", file);
                });
            }

            const response = await API.post("/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.isProfileCreated || response.status === 201) {
                setIsProfileCreated(true);
            }

            toast.success("Profile created successfully!");
            reset();
            setProfilePicFile(null);
            setProjectImagesFiles([]);
            router.push("/");

        } catch (err: any) {
            const status = err.response?.status;
            const fieldErrors = err.response?.data?.error?.fieldErrors;
            if (status === 400 && fieldErrors) {
                if (fieldErrors.profilePicture) setError(fieldErrors.profilePicture[0]);
                else if (fieldErrors.projectImages) setError(fieldErrors.projectImages[0]);
                else setError("Invalid form data.");
            } else {
                setError("Something went wrong. Please try again.");
            }

            console.warn("Submit error:", err);
        }
    };


    const onError = (errors: any) => {
        console.log("Form Validation Errors", errors);
    };

    return (
        <>
            <ToastContainer position="top-right" transition={Slide} className="z-50" autoClose={6000} />
            <form onSubmit={handleSubmit(onSubmit, onError)} className="max-w-6xl mx-auto p-6 bg-white dark:bg-[#0A0011] rounded-xl space-y-10">

                {/* Basic Information */}
                <fieldset>
                    <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                            <p className="text-sm text-gray-500 mt-1">Let us know who you are and what you do.</p>
                        </div>
                        <div className="space-y-4">
                            <InputComponent label="Username" id="username" registration={register("username")} error={errors.username?.message} />
                            <InputComponent label="Headline" id="headline" registration={register("headline")} error={errors.headline?.message} />
                            <TextareaComponent
                                label="Bio"
                                id="bio"
                                registration={register("bio")}
                                error={errors.bio?.message}
                                placeholder="Tell us about yourself"
                                rows={5}
                            />

                            <DropdownComponent name="category" label="Select Category" register={register} options={["Graphic Designer", "UI/UX Designer", "Software Developer", "Content Creator", "Video Editor", "Other"]} setValue={setValue} error={errors.category?.message} />
                        </div>
                    </div>
                </fieldset>

                {/* Skills & Location */}
                <fieldset>
                    <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Skills & Location</h2>
                            <p className="text-sm text-gray-500 mt-1">Highlight your strongest areas and where you're based.</p>
                        </div>
                        <div className="space-y-4">
                            <SkillsSelector control={control} name="skills" error={errors.skills?.message} setValue={setValue} watch={watch} />
                            <AddressSelector register={register} errors={errors} />
                        </div>
                    </div>
                </fieldset>

                {/* Profile Preferences */}
                <fieldset>
                    <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Profile Preferences</h2>
                            <p className="text-sm text-gray-500 mt-1">Control visibility and availability.</p>
                        </div>
                        <div className="flex gap-6 items-center">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" checked={watch("availableforwork") || false} onChange={(e) => setValue("availableforwork", e.target.checked)} className="form-checkbox h-5 w-5 bg-primary text-primary" />
                                <span className="text-sm text-gray-700">Available for Work</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" checked={watch("isVisible") || false} onChange={(e) => setValue("isVisible", e.target.checked)} className="form-checkbox h-5 w-5 bg-primary text-primary" />
                                <span className="text-sm text-gray-700">Public Profile</span>
                            </label>
                        </div>
                    </div>
                </fieldset>

                {/* Profile Image */}
                <fieldset>
                    <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Profile Image</h2>
                            <p className="text-sm text-gray-500 mt-1">Upload a clear and professional profile picture.</p>
                        </div>
                        <div>
                            {/* <ProfilePhotoUpload name="profilePicture" control={control} preview={profilePicFile} setPreview={setProfilePicFile} setFile={setProfilePicFile} /> */}

                            <ProfilePhotoUpload
                                value={profilePicFile}
                                onChange={(file) => setProfilePicFile(file)}
                                error={error}
                            />

                        </div>
                    </div>
                </fieldset>

                {/* Project Images */}
                <fieldset>
                    <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Project Images</h2>
                            <p className="text-sm text-gray-500 mt-1">Showcase your best work.</p>
                        </div>
                        <div>
                            {/* <ImageUploadComponent name="projectImages" control={control} label="Project Images" multiple preview={projectImagesFiles} setPreview={setProjectImagesFiles} setFiles={setProjectImagesFiles} error={errors.projectImages?.message as string} /> */}

                            <ImageUploadComponent
                                value={projectImagesFiles}
                                onChange={(files) => setProjectImagesFiles(files)}
                                error={error}
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Social Links */}
                <fieldset>
                    <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6 border-b border-[#D0D5DD] pb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
                            <p className="text-sm text-gray-500 mt-1">Help people connect with you across platforms.</p>
                        </div>
                        <div>
                            <DynamicLinksComponent fields={socialFields} append={appendSocial} remove={removeSocial} name="socialLinks" control={control} errors={errors.socialLinks as any} label="Social Links" register={register} />
                        </div>
                    </div>
                </fieldset>

                {/* Portfolio Links */}
                <fieldset>
                    <div className="grid grid-cols-1 md:grid-cols-[30%_1fr] gap-x-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Portfolio Links</h2>
                            <p className="text-sm text-gray-500 mt-1">Share your portfolio or relevant links.</p>
                        </div>
                        <div>
                            <DynamicLinksComponent fields={portfolioFields} append={appendPortfolio} remove={removePortfolio} name="portfolioLinks" control={control} errors={errors.portfolioLinks as any} label="Portfolio Links" register={register} />
                        </div>
                    </div>
                </fieldset>

                <div className="flex justify-end">
                    <button type="submit" className="mt-6 px-6 bg-primary text-white py-2 w-fit rounded-lg hover:bg-primary-dark cursor-pointer hover:bg-secondary focus:outline-none focus:border-0">
                        Create Profile
                    </button>
                </div>
            </form>
        </>
    );
};

export default CreateProfileForm;
