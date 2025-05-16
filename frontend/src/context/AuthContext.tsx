import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface AuthContextType {
    user: any;
    token: string | null;
    login: (user: any, token: string) => void;
    logout: () => void;
}

//step-1 create the context
export const AuthContext = createContext<AuthContextType | null>(null);

//step-2 create the provider

export const AuthProvider = ({children}: {children: React.ReactNode}) => {

    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if(storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
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
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}



