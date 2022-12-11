import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { DetailedHTMLProps, InputHTMLAttributes, LegacyRef } from "react";
import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";
import { RiErrorWarningFill } from "react-icons/ri";
import errorMap from "zod/lib/locales/en";

interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error?: boolean | FieldError;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...restProps }, ref) => {
    const [mainRef] = useAutoAnimate();

    return (
      <div className="relative" ref={mainRef as LegacyRef<HTMLDivElement>}>
        <input
          type="text"
          className={`rounded-md border border-slate-400 bg-white p-2 outline-none focus:border-slate-700 ${className} ${
            error ? "!border-red-500 focus:!border-red-500" : ""
          }`}
          {...restProps}
          ref={ref}
        />
        {error && (
          <div className="group absolute right-4 top-2.5 z-20">
            <RiErrorWarningFill color="red" size={24} className="relative" />
            {(error as FieldError).message && (
              <div className="invisible absolute -right-12 -top-20 z-[999]  max-w-sm rounded-sm bg-white p-1 opacity-0 transition-all group-hover:visible group-hover:opacity-100">
                <p className="text-xs text-red-500">
                  {(error as FieldError).message}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
