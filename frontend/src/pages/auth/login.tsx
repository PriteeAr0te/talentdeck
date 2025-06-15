import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputComponent from "@/components/ui/InputComponent";
import { loginUserSchema } from "@/lib/validators/authValidators";
import API from "@/lib/api";
import { z } from "zod";
import Link from "next/link";
import { Slide, ToastContainer, toast } from "react-toastify";

type LoginFormValues = z.infer<typeof loginUserSchema>;

type ErrorWithResponse = {
    response?: {
      status?: number;
      data?: {
        message?: string;
      };
    };
  };
  

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
            setError(""); 

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
            console.log("Login successful");
            setTimeout(() => {
                toast.success("Login Successful!");
            }, 5000);

        } catch (err: unknown) {
            const error = err as ErrorWithResponse;
            const status = error.response?.status;
            const message = error.response?.data?.message || "Login failed. Please try again.";

            if (status === 400) {
                setError(message);
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
            <ToastContainer position="top-right" transition={Slide} className="z-50" autoClose={6000} closeButton={true} pauseOnHover={true} />
            <main className="min-h-[calc(100vh-70px)] flex items-center justify-center bg-primary-bg dark:bg-[#0a0011] p-4">
                <div className="w-full max-w-md bg-white shadow-custom rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-primary mb-6 text-center">
                        Login to TalentDeck
                    </h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        <InputComponent
                            label="Email"
                            type="email"
                            page="auth"
                            id="email"
                            registration={register("email")}
                            error={errors.email?.message}
                        />

                        <InputComponent
                            label="Password"
                            type="password"
                            page="auth"
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
                            className="w-full bg-primary text-white py-2.5 rounded-lg hover:bg-secondary cursor-pointer dark:hover:bg-[#250040] transition-all duration-150"
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
