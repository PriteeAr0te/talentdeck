import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AuthContextType {
    user: any;
    token: string | null;
    login: (user: any, token: string) => void;
    logout: () => void;
    loading: boolean;
    isProfileCreated: boolean;
    setIsProfileCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isProfileCreated, setIsProfileCreated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (newToken: string, userData: any) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        router.push("/login");
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, isProfileCreated, setIsProfileCreated }}>
            {children}
        </AuthContext.Provider>
    )
}



