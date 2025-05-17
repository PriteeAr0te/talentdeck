interface ButtonProps {
    type?: "submit" | "button" | "reset";
    children: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
  }
  
  const Button = ({ type = "button", children, loading, disabled }: ButtonProps) => {
    return (
      <button
        type={type}
        disabled={loading || disabled}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 text-sm font-medium transition disabled:opacity-50"
      >
        {loading ? "Please wait..." : children}
      </button>
    );
  };
  
  export default Button;
  