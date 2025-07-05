import React, { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import API from "@/lib/api";

interface ProfileSummary {
    profilePicture?: string;
    username?: string;
}

interface User {
    _id: string;
    fullName?: string;
    email: string;
    role?: string;
    username?: string;
    profileCreated?: boolean;
    bookmarks?: string[];
    profile?: ProfileSummary;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
    isProfileCreated: boolean;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const logout = React.useCallback(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        router.push("/");
    }, [router]);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);

            API.post("/auth/me")
                .then((res) => {
                    setUser(res.data.user);
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                })
                .catch((err) => {
                    console.error("Failed to fetch user in AuthContext:", err);
                    logout();
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [logout]);


    const login = (newToken: string, userData: User) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const isProfileCreated = !!user?.profileCreated;

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, isProfileCreated, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}



