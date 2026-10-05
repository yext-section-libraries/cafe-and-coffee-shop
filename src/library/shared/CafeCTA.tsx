import type { ComponentProps } from "react";
import { ComprehensiveCTA } from "@yext/visual-editor";
import "./presentation.css";

/** Keep button presentation consistent while preserving link and image variants. */
export const CafeCTA = (props: ComponentProps<typeof ComprehensiveCTA>) => {
  const variant: string = props.value?.styles?.variant ?? "primary";
  const isButton = variant === "primary" || variant === "secondary" || variant === "outline";
  const className = [
    props.className,
    isButton ? `cafe-cta cafe-cta--${variant === "outline" ? "secondary" : variant}` : undefined,
  ].filter(Boolean).join(" ");
  const value = variant === "outline" ? {
    ...props.value,
    styles: { ...props.value?.styles, variant: "secondary" as const },
  } : props.value;
  return <ComprehensiveCTA {...props} value={value} className={className} />;
};
