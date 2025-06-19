interface ButtonProps {
    type?: "submit" | "button" | "reset";
    children: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
  }
  
  const ButtonComponent = ({ type = "button", children, loading, disabled }: ButtonProps) => {
    return (
      <button
        type={type}
        disabled={loading || disabled}
        className="w-full bg-[#4B0082] text-white py-2.5 px-4 rounded-lg hover:bg-[#4B0082] dark:hover:bg-[#250040] cursor-pointer focus:outline-none focus:ring-offset-1 text-sm font-medium transition disabled:opacity-50"
      >
        {loading ? "Please wait..." : children}
      </button>
    );
  };
  
  export default ButtonComponent;
  