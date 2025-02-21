"use client"

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
    onChangeAction: (url?: string, name?: string) => void;
    endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({
                               onChangeAction,
                               endpoint
                           }: FileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                const url = res?.[0]?.url;
                const name = res?.[0]?.name;

                onChangeAction(url, name);
            }}
            onUploadError={(err: Error) => {
                toast.error("На жаль, щось пішло не так. Спробуйте, будь ласка, ще раз.");
                console.error(err);
            }}
        />
    )
}