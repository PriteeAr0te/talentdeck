import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    
    const {user, token, login, logout, loading, isProfileCreated, setIsProfileCreated} = context;
    const isLoggedIn = !!token;
    const isCreator = user?.role === "creator";

    return {user, token, login, logout, isLoggedIn, isCreator, isProfileCreated, loading, setIsProfileCreated};

  };