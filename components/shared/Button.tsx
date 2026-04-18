import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkButtonProps = SharedProps &
  Omit<ComponentProps<typeof Link>, "className" | "href" | "children"> & {
    href: string;
  };

function getButtonClassName(variant: ButtonVariant, className?: string): string {
  return ["button", `button--${variant}`, className].filter(Boolean).join(" ");
}

export function Button(props: ButtonProps | LinkButtonProps) {
  const variant = props.variant ?? "primary";

  if ("href" in props && typeof props.href === "string") {
    const { children, href, className, ...rest } = props;
    return (
      <Link className={getButtonClassName(variant, className)} href={href} {...rest}>
        {children}
      </Link>
    );
  }

  const { children, className, type = "button", ...rest } = props;
  return (
    <button className={getButtonClassName(variant, className)} type={type} {...rest}>
      {children}
    </button>
  );
}
