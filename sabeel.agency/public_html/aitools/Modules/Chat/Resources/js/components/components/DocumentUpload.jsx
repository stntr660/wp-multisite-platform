import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { DocumentIcon } from "./icons";
import useLangTranslation from "../hooks/useLangTranslation";

const DocumentUpload = ({ setFiles }) => {
    const onDrop = useCallback((acceptedFiles) => {
        // Do something with the files
        setFiles(acceptedFiles);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div
            className="cursor-pointer w-fit flex items-center justify-center"
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            {isDragActive ? <UserInterface drag /> : <UserInterface />}
        </div>
    );
};

export default DocumentUpload;

const UserInterface = ({ drag }) => {
    const { trans } = useLangTranslation();
    return (
        <div
            className={`${
                drag ? "opacity-60" : "opacity-100"
            } w-full max-w-[352px] sm:min-w-[352px] flex flex-col items-center justify-center p-11 bg-white dark:bg-dark-shade-2 border border-dashed border-gray-1 rounded-xl`}
        >
            <DocumentIcon />
            <p className="mt-6 text-dark-1 dark:text-white text-center text-base">
                {trans("Drag & drop your documents here")}
            </p>
            <p className="mt-2 text-center text-gray-1 text-xs font-medium">
                ({trans("pdf, doc or docx")})
            </p>
            <button className="text-center text-purple dark:text-gold text-15 font-medium mt-7">
                {trans("Click here to upload")}
            </button>
        </div>
    );
};
