"use client";

import {
  useEffect,
  useState,
} from "react";

interface FileItem {
  id: string;
  file_name: string;
  file_url: string;
}

interface ProjectFilesProps {
  projectId: string;
}

export function ProjectFiles({
  projectId,
}: ProjectFilesProps) {
  const [files, setFiles] =
    useState<FileItem[]>([]);

  const [uploading, setUploading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const loadFiles =
    async () => {
      try {
        const response =
          await fetch(
            `/api/projects/files/${projectId}`
          );

        const data =
          await response.json();

        setFiles(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(error);
        setFiles([]);
      }
    };

  useEffect(() => {
    loadFiles();
  }, [projectId]);

  const handleUpload =
    async (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      try {
        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        formData.append(
          "projectId",
          projectId
        );

        const response =
          await fetch(
            "/api/projects/files/upload-storage",
            {
              method: "POST",
              body: formData,
            }
          );

        const data =
          await response.json();

        if (!response.ok) {

          if (
            response.status === 403 &&
            data.upgrade
          ) {

            window.dispatchEvent(
              new CustomEvent(
                "open-upgrade-modal",
                {
                  detail: {
                    type:
                      data.type ??
                      "pdf",
                  },
                }
              )
            );

            return;
          }

          throw new Error(
            data.error ??
            "Upload failed"
          );
        }

        await loadFiles();

      } catch (error) {

        console.error(error);

        e.target.value = "";

      } finally {

        setUploading(false);

      }
    };

  const handleDelete =
    async (
      fileId: string
    ) => {

      const confirmed =
        window.confirm(
          "Delete this file?"
        );

      if (!confirmed) {
        return;
      }

      try {

        setDeletingId(
          fileId
        );

        const response =
          await fetch(
            "/api/projects/files/delete",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                fileId,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error
          );
        }

        await loadFiles();

      } catch (error) {

        console.error(error);

      } finally {

        setDeletingId(
          null
        );

      }
    };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h3 className="text-sm font-medium text-white">
            Files
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            {files.length} assets stored
          </p>

        </div>

        <label
          className="
            cursor-pointer
            rounded-lg
            bg-purple-600
            px-3
            py-2
            text-xs
            font-medium
            text-white
            transition
            hover:bg-purple-500
          "
        >
          {uploading
            ? "Uploading..."
            : "Upload"}

          <input
            type="file"
            hidden
            onChange={
              handleUpload
            }
          />
        </label>

      </div>

      <div className="space-y-2">

        {files.length === 0 && (
          <div className="rounded-xl border border-white/5 p-3">

            <p className="text-xs text-zinc-500">
              No files uploaded yet.
            </p>

          </div>
        )}

        {files.map((file) => (
          <div
            key={file.id}
            className="
              rounded-xl
              border
              border-white/5
              bg-black/10
              p-3
            "
          >

            <div className="flex items-center justify-between gap-3">

              <a
                href={file.file_url}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1"
              >
                <p className="truncate text-sm text-white">
                  {file.file_name}
                </p>
              </a>

              <button
                onClick={() =>
                  handleDelete(
                    file.id
                  )
                }
                disabled={
                  deletingId ===
                  file.id
                }
                className="
                  text-xs
                  text-red-400
                  hover:text-red-300
                "
              >
                {deletingId ===
                  file.id
                  ? "Deleting..."
                  : "Delete"}
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}