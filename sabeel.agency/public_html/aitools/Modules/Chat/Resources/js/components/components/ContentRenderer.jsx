import { useState, useEffect } from "react";
import CopyButton from "./CopyButton";
import { CheckIcon, CopyIcon } from "./icons";
import CopyToClipboard from "react-copy-to-clipboard";
// syntax highlighting
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import Markdown from "react-markdown";
import rehypeMathjax from "rehype-mathjax";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const ContentRenderer = ({ children: data }) => {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setCopied(false);
		}, 1000);
		return () => clearTimeout(timer);
	}, [copied]);

	return (
		<Markdown
			// eslint-disable-next-line react/no-children-prop
			children={data}
			remarkPlugins={[remarkGfm, remarkMath]}
			rehypePlugins={[rehypeMathjax]}
			components={{
				code(props) {
					const { children, className, node, ...rest } = props;
					const match = /language-(\w+)/.exec(className || "");
					return match ? (
						<div className="my-4 rounded-lg overflow-hidden">
							<div className="px-2 py-1.5 bg-[#343541] flex justify-between">
								<p className="text-white">{match[1]}</p>
								<CopyToClipboard text={children} onCopy={() => setCopied(true)}>
									<CopyButton
										size="small"
										icon={copied ? <CheckIcon /> : <CopyIcon />}
									/>
								</CopyToClipboard>
							</div>
							<SyntaxHighlighter
								{...rest}
								// eslint-disable-next-line react/no-children-prop
								children={String(children).replace(/\n$/, "")}
								style={oneDark}
								customStyle={{
									margin: 0,
									borderTopRightRadius: "0",
									borderTopLeftRadius: "0",
								}}
								language={match[1]}
								PreTag="div"
							/>
						</div>
					) : (
						<code {...rest} className={className}>
							{children}
						</code>
					);
				},
				table({ children }) {
					return (
						<table className="my-2 border-collapse py-1 block overflow-x-auto">
							{children}
						</table>
					);
				},
				th({ children }) {
					return (
						<th className="text-left break-words border border-gray-2 bg-gray-3 dark:bg-gray-1 px-3 py-1 text-dark-1 dark:border-clr47">
							{children}
						</th>
					);
				},
				td({ children }) {
					return (
						<td className="text-left break-words border border-gray-2 px-3 py-1 dark:border-clr47">
							{children}
						</td>
					);
				},
				ol({ children }) {
					return <ol className="py-2 list-decimal list-inside">{children}</ol>;
				},
				ul({ children }) {
					return <ul className="py-2 list-disc list-inside">{children}</ul>;
				},
			}}
		/>
	);
};

export default ContentRenderer;
