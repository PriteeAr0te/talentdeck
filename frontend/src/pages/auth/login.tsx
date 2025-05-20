import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "@/components/ui/InputComponent";
import { loginUserSchema } from "@/lib/validators/authValidators";
import API from "@/lib/api";
import { z } from "zod";
import Link from "next/link";

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
            setError(""); // Clear old errors

            const response = await API.post("/auth/login", {
                email: data.email,
                password: data.password,
            });

            const { token, user } = response.data;

            if (!token || !user) {
                throw new Error("Invalid response: Token or user missing.");
            }

            login(token, user);
            router.push("/");

        } catch (err: any) {
            const status = err.response?.status;
            const message = err.response?.data?.message || "Login failed. Please try again.";

            if (status === 400) {
                setError(message); // Zod errors
            } else if (status === 404) {
                setError("No account found with this email.");
            } else if (status === 401) {
                setError("Incorrect password. Please try again.");
            } else if (status === 500) {
                setError("Something went wrong on our end. Please try again later.");
            } else {
                setError(message);
            }

            // Only log unexpected errors in dev
            if (process.env.NODE_ENV !== "production") {
                console.warn("Handled login error:", status, message);
            }
        }
    };

    return (
        <>
            <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="w-full max-w-md bg-white shadow-md rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-primary mb-6 text-center">
                        Login to TalentDeck
                    </h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >

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
                            className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-secondary transition-all duration-150"
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </button>
                        <p className="mt-4 text-center text-sm text-gray-600">
                            Don’t have an account?{' '}
                            <Link href="/register" className="text-indigo-600 hover:underline">
                                Create one
                            </Link>
                        </p>

                    </form>
                </div>
            </main>
        </>
    );
}

export default Login;
