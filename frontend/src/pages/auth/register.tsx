import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "@/lib/api";
import { registerUserSchema } from "@/lib/validators/authValidators";
import Link from "next/link";
import InputComponent from "@/components/ui/InputComponent";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ButtonComponent from "@/components/ui/ButtonComponent";
import Seo from "@/components/layout/Seo";

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
            await API.post("/auth/register", data);
            toast.success("Registration Successful✅");
            router.push("/login");

        } catch (err: unknown) {
            const error = err as ErrorWithResponse
            setServerError(error.response?.data?.message || "Something went wrong.");
        }
    }

    return (
        <>
            <Seo
                title="Join TalentDeck – Create Your Account to Showcase or Discover Talent"
                description="Register on TalentDeck to create your own profile or explore skilled creators across domains. Quick signup. No spam. Just pure talent."
                url="https://talentdeck-next.netlify.app/register"
            />

            <main className="flex items-center justify-center bg-background p-4 py-14">
                <div className="w-full max-w-md bg-background-secondary shadow-custom rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
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

                        <p className="mt-4 text-center text-sm text-foreground/80">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary font-medium hover:underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </main>
        </>
    );
};

export default Register;