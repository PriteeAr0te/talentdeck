import React, { useReducer, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

const CreateProfileForm: React.FC = () => {
    const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
    const [projectImagesFiles, setProjectImagesFiles] = useState<File[]>([]);
    const [error, setError] = useState("");

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
            socialLinks: [{ label: '', url: '' }],
            portfolioLinks: [{ label: '', url: '' }],
            availableforwork: false,
            isVisible: true,
            projectImages: [],
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

    // const onSubmit = async (data: CreateProfileSchema) => {
    //     console.log("Data");
    //     try {
    //         setError("");

    //         const formData = new FormData();

    //         Object.entries(data).forEach(([key, value]) => {
    //             if (key === "profilePicture" || key === "projectImages") return;
    //             formData.append(key, value as string);
    //         });

    //         if (profilePicFile) {
    //             formData.append("profilePicture", profilePicFile);
    //         }

    //         if (projectImagesFiles.length > 0) {
    //             projectImagesFiles.forEach((file) => {
    //                 formData.append("projectImages", file);
    //             });
    //         }

    //         const response = await API.post("/profile", formData, {
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //             },
    //         });

    //         console.log("Response", response);

    //         if (!response.data || !response.data.success) {
    //             throw new Error("Unexpected response from server.");
    //         }

    //         toast.success("Profile created successfully!");

    //         router.push("/");

    //     } catch (err: any) {
    //         const status = err.response?.status;
    //         const message = err.response?.data?.message || "Something went wrong. Please try again.";

    //         if (status === 400) {
    //             setError(message);
    //         } else if (status === 409) {
    //             setError("A profile with this data already exists.");
    //         } else if (status === 500) {
    //             setError("Server error. Please try again later.");
    //         } else {
    //             setError(message);
    //         }

    //         if (process.env.NODE_ENV !== "production") {
    //             console.warn("Handled profile submit error:", status, message);
    //         }
    //     }
    // };

    const onSubmit = async (data: CreateProfileSchema) => {
        console.log("Form submitted successfully", data);
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
                            <TextareaComponent label="Bio" id="bio" registration={register("bio")} error={errors.bio?.message} placeholder="Tell us about yourself" rows={5} />
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
                                <input type="checkbox" checked={watch("availableforwork") || false} onChange={() => setValue("availableforwork", !watch("availableforwork"))} className="form-checkbox h-5 w-5 bg-primary text-primary" />
                                <span className="text-sm text-gray-700">Available for Work</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" checked={watch("isVisible") || false} onChange={() => setValue("isVisible", !watch("isVisible"))} className="form-checkbox h-5 w-5 bg-primary text-primary" />
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
                            <ProfilePhotoUpload name="profilePicture" control={control} preview={profilePicFile} setPreview={setProfilePicFile} setFile={setProfilePicFile} />
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
                            <ImageUploadComponent name="projectImages" control={control} label="Project Images" multiple preview={projectImagesFiles} setPreview={setProjectImagesFiles} setFiles={setProjectImagesFiles} error={errors.projectImages?.message as string} />
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
