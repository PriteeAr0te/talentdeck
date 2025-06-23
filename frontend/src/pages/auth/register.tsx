import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "@/lib/api";
import { registerUserSchema } from "@/lib/validators/authValidators";
import Link from "next/link";
import Head from "next/head";
import InputComponent from "@/components/ui/InputComponent";
import { Slide, ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import ButtonComponent from "@/components/ui/ButtonComponent";

type RegisterFormValues = z.infer<typeof registerUserSchema>;

type ErrorWithResponse = {
    response?: {
        data?: {
            message?: string;
        };
    };
};

const Register = () => {
    const router = useRouter();
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerUserSchema),
    })

    const onSubmit = async (data: RegisterFormValues) => {
        setServerError(null);

        try {
            const response = await API.post("/auth/register", data);
            console.log("Registration successful", response.data);
            toast.success("Registration successful");
            router.push("/login");

        } catch (err: unknown) {
            const error = err as ErrorWithResponse
            setServerError(error.response?.data?.message || "Something went wrong.");
        }
    }

    return (
        <>
            <ToastContainer position="top-right" transition={Slide} autoClose={6000} closeButton={true} pauseOnHover={true} />
            <Head>
                <title>Register | TalentDeck</title>
                <meta
                    name="description"
                    content="Create your TalentDeck profile to showcase your developer journey."
                />
            </Head>

            <main className="flex items-center justify-center bg-primary-bg dark:bg-[#0a0011] p-4 py-14">
                <div className="w-full max-w-md bg-white shadow-custom rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-[#2D004E] mb-6 text-center">
                        Create an Account
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <InputComponent
                            id="fullName"
                            label="Full Name"
                            type="text"
                            page="auth"
                            autoComplete="name"
                            placeholder="Full Name"
                            registration={register("fullName")}
                            error={errors.fullName?.message}
                        />

                        <InputComponent
                            id="email"
                            label="Email ID"
                            type="email"
                            page="auth"
                            autoComplete="email"
                            placeholder="Email ID"
                            registration={register("email")}
                            error={errors.email?.message}
                        />

                        <InputComponent
                            id="password"
                            label="Password"
                            type="password"
                            page="auth"
                            autoComplete="new-password"
                            placeholder="Password"
                            registration={register("password")}
                            error={errors.password?.message}
                        />

                        {serverError && (
                            <p className="mb-4 text-sm text-red-600 text-center" role="alert">
                                {serverError}
                            </p>
                        )}

                        <ButtonComponent type="submit" loading={isSubmitting}>
                            Create Account
                        </ButtonComponent>

                        <p className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/login" className="text-indigo-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Register;