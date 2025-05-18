import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "@/lib/api";
import { registerUserSchema } from "@/lib/validators/authValidators";
import Link from "next/link";
import Head from "next/head";
import InputField from "@/components/ui/InputComponent";
import Button from "@/components/ui/Button";

type RegisterFormValues = z.infer<typeof registerUserSchema>;


const Register = () => {
    const [serverError, setServerError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerUserSchema),
    })

    const onSubmit = async (data: RegisterFormValues) => {
        setServerError(null);

        try {
            const response = await API.post("/auth/register", data);
            console.log("Registration successful", response.data);

        } catch (error: any) {
            setServerError(error.response?.data?.message || "Something went wrong.");
        }
    }


    return (
        <>
            <Head>
                <title>Register | TalentDeck</title>
                <meta
                    name="description"
                    content="Create your TalentDeck profile to showcase your developer journey."
                />
            </Head>

            <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Create an Account
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <InputField
                            id="fullName"
                            label="Full Name"
                            type="text"
                            autoComplete="name"
                            placeholder="Full Name"
                            registration={register("fullName")}
                            error={errors.fullName?.message}
                        />

                        <InputField
                            id="email"
                            label="Email ID"
                            type="email"
                            autoComplete="email"
                            placeholder="Email ID"
                            registration={register("email")}
                            error={errors.email?.message}
                        />

                        <InputField
                            id="password"
                            label="Password"
                            type="password"
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

                        <Button type="submit" loading={isSubmitting}>
                            Create Account
                        </Button>

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