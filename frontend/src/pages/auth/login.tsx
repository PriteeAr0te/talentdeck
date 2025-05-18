"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "@/components/ui/InputComponent";
import { loginUserSchema } from "@/lib/validators/authValidators";
import API from "@/lib/api";
import { z } from "zod";

type LoginFormValues = z.infer<typeof loginUserSchema>;

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginUserSchema),
    });

    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState("");

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setError(""); // clear old errors

            // 1. Call backend
            const response = await API.post("/auth/login", {
                email: data.email,
                password: data.password,
            });

            // 2. Check response
            const { token, user } = response.data;

            if (!token || !user) {
                throw new Error("Login failed. Missing token or user.");
            }

            // 3. Set context
            login(token, user);

            // 4. Redirect
            router.push("/");

        } catch (err: any) {
            console.error("Login error:", err);
            setError(
                err.response?.data?.message || "Invalid email or password"
            );
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-md mx-auto p-6 border rounded-xl shadow-md bg-white space-y-4"
            >
                <h2 className="text-2xl font-semibold text-center text-black">
                    Login to TalentDeck
                </h2>

                <InputField
                    label="Email"
                    type="email"
                    id="email"
                    registration={register("email")}
                    error={errors.email?.message}
                />

                <InputField
                    label="Password"
                    type="password"
                    id="password"
                    registration={register("password")}
                    error={errors.password?.message}
                />

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all duration-150"
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;
