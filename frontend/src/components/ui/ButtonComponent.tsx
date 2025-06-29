interface ButtonProps {
    type?: "submit" | "button" | "reset";
    width?: string;
    children: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
  }
  
  const ButtonComponent = ({ type = "button", width="full", children, loading, disabled }: ButtonProps) => {
    return (
      <button
        type={type}
        disabled={loading || disabled}
        className={`w-${width} px-4 mt-2 bg-btn-primary text-gray-200 hover:text-foreground dark:text-foreground py-2.5 rounded-lg hover:bg-secondary cursor-pointer transition-all duration-150 disabled:opacity-50`}
      >
        {loading ? "Please wait..." : children}
      </button>
    );
  };
  
  export default ButtonComponent;
  