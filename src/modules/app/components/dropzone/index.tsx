"use client";

import { CloudArrowUp, TrashSimple } from "@phosphor-icons/react/dist/ssr";
import { MouseEvent, useCallback, useState } from "react";
import { tv } from "tailwind-variants";
import { Toast } from "../toast";
import { ToastType } from "../toast/types";
import { DropFiles } from "./types";
import { fileToBase64 } from "@/utils";

const dropzone = tv({
  slots: {
    containerDropZone: [
      "w-full bg-gray-1000 border border-gray-800",
      "h-44 flex items-center justify-center",
      "relative cursor-pointer rounded-xl transition-all duration-150",
    ],
  },

  variants: {
    error: {
      true: {
        containerDropZone: "border-red-default bg-red-100",
      },
    },
    isDragging: {
      true: {
        containerDropZone: "border-blue-default bg-blue-100",
      },
    },
  },
});

interface DropzoneProps {
  accept?: string[];
  multiple?: boolean;
  files: DropFiles[];
  onDrop: (files: DropFiles[]) => void;
  onDelete?: (file: DropFiles[]) => void;
}

const ACCEPTED_FORMATS = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

export function Dropzone({
  files = [],
  accept = ACCEPTED_FORMATS,
  multiple,
  onDrop,
  onDelete,
}: DropzoneProps) {
  const [hasError, setHasError] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { containerDropZone } = dropzone({ isDragging });

  async function addFiles(files: File[]): Promise<void> {
    const newFiles = files.map(async (file) => {
      const imageBase64 = await fileToBase64(file);

      const newFile: DropFiles = {
        id: crypto.randomUUID(),
        name: file.name,
        base64: imageBase64,
        src: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
      };

      return newFile;
    });

    const filesResolved = await Promise.all(newFiles);
    onDrop(filesResolved);
  }

  function handleRemoveFile(
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    file: DropFiles
  ): void {
    event.preventDefault();
    const newFiles = files.filter((f) => f.id !== file.id);

    onDelete(newFiles);
  }

  function verifyFiles(files: File[]): boolean {
    if (accept) {
      const isAccepted = files.every((file) => {
        return accept.includes(file.type);
      });

      if (!isAccepted) {
        setHasError(true);
        setOpenToast(true);
        return true;
      }
    }

    setHasError(false);
    return false;
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;

    if (verifyFiles(Array.from(files))) return;

    addFiles(Array.from(files));
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files;

    if (verifyFiles(Array.from(files))) return;

    addFiles(Array.from(files));
  };

  const getAcceptedFormats = useCallback((): string => {
    return accept.map((format) => format.split("/")[1]).join(", ");
  }, [accept]);

  return (
    <>
      <div>
        <div
          className={containerDropZone({ error: hasError })}
          onDrop={handleDrop}
          onDragOver={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <input
            type="file"
            multiple={multiple}
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(event) => {
              handleInputChange(event);
            }}
          />

          <div className="flex flex-col items-center gap-2">
            <CloudArrowUp weight="bold" size={32} className="text-gray-500" />

            <p className="text-center">
              <span className="text-red-default">Clique para carregar</span> ou
              arraste e solte <br /> {getAcceptedFormats()}
            </p>
          </div>
        </div>

        <div className="mt-3">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-2">
              <p className="text-gray-300 font-medium">{file.name}</p>
              <button onClick={(event) => handleRemoveFile(event, file)}>
                <TrashSimple size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Toast
        open={openToast}
        type={ToastType.ERROR}
        message="Formato de arquivo não suportado"
        setOpen={(open) => {
          if (!open) {
            setHasError(false);
          }
          setOpenToast(open);
        }}
      />
    </>
  );
}