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
