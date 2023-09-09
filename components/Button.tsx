import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, className, disabled, type = "button", ...props }, ref) => {
		return (
			<button
				type={type}
				disabled={disabled}
				ref={ref}
				className={twMerge(`
						w-full
						rounded-full
						bg-green-500
						border
						border-transparent
						p-3
						text-black
						font-bold
						hover:opacity-75
						disabled:opacity-50
						disabled:cursor-not-allowed
						transition
					`,
					className
				)}
				{...props}
			>
				{children}
			</button>
		);
	}
);

Button.displayName = "Button";

export default Button;
