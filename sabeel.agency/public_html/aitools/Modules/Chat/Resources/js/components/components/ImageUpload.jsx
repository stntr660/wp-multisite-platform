import { useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";
import cn from "../utils/cn";
import { useDispatch } from "react-redux";
import { UploadImgIcon } from "./icons";
import { useDropzone } from "react-dropzone";
import { ImageContext } from "../context/ImageContext";
import useLangTranslation from "../hooks/useLangTranslation";

const ImageUpload = () => {
    const { trans } = useLangTranslation();
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const save = useContext(ImageContext);

    const onDrop = useCallback(
        (acceptedFiles) => {
            // 'acceptedFiles' is an array of dropped files
            const file = acceptedFiles[0];
            setFile({
                preview: URL.createObjectURL(file),
            });
            save.setImageFile(file);
            // Create a data URL
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result;
            };
            reader.onerror = (error) => {
                toast.error(
                    trans("Error reading file. Please try again or contact support.")
                );
            };
            reader.readAsDataURL(file);
        },
        [save]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".png", ".jpeg", ".jpg"],
        },

        // validator: nameLengthValidator, // it will be implemented later
        // maxSize: 1000000, // 1MB
        multiple: false,
    });

    const handleFileRemove = () => {
        setFile(null);
        save.setImageFile(null);
    };

    return (
        <div className="relative">
            <div
                className="flex items-center justify-center"
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <button className="outline-none">
                    <div
                        className={cn(
                            "border border-gray-2 h-[52px] w-[52px] shadow-aiavatar rounded-full flex-shrink-0",
                            {
                                "p-1": !file,
                                "overflow-hidden": file,
                            }
                        )}
                    >
                        {!file && (
                            <UploadImgIcon
                                className={
                                    isDragActive ? "opacity-50" : "opacity-100"
                                }
                            />
                        )}
                        {file && (
                            <img
                                src={file?.preview}
                                alt="upload"
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                </button>
            </div>
            {file && (
                <button
                    onClick={handleFileRemove}
                    className="absolute z-20 -top-3.5 -right-1.5"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};
export default ImageUpload;
