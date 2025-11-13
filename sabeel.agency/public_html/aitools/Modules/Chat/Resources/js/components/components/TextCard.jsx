import { useEffect, useState } from "react";
import cn from "../utils/cn";
import CopyButton from "./CopyButton";
import { CheckIcon, CopyIcon } from "./icons";
import ContentRenderer from "./ContentRenderer";
import { CopyToClipboard } from "react-copy-to-clipboard";

const TextCard = ({ children, variant, character, isLastMessage = false, className }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCopied(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [copied]);

    return (
        <div className={cn("group/item", className)}>
            <div
                className={`max-w-max rounded-[10px] p-3 ${
                    variant === "outlined"
                        ? "bg-transparent border border-gray-1"
                        : variant === "filled"
                        ? "bg-clrE0 dark:bg-clr47"
                        : "bg-white"
                } dark:bg-dark-shade-1 text-sm font-normal`}
            >
                <ContentRenderer>{children}</ContentRenderer>
            </div>

            {character === "bot" && (
                <div
                    className={`${
						isLastMessage ? "visible" : "invisible scale-0"
					} group-hover/item:visible group-hover/item:scale-100 mt-2 inline-block transition-all relative z-[1]`}
                >
                    <CopyToClipboard
                        text={children}
                        onCopy={() => setCopied(true)}
                    >
                        <CopyButton
                            icon={copied ? <CheckIcon /> : <CopyIcon />}
                        />
                    </CopyToClipboard>
                </div>
            )}
        </div>
    );
};

export default TextCard;
