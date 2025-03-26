import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError } from "axios";
import { useMutation } from "react-query";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();
  const [simulate403, setSimulate403] = React.useState<boolean>(false); // Dodajemy stan do symulacji 403

  const authToken = localStorage.getItem("authorization_token");
  const headers: any = {};
  if (authToken) headers.Authorization = `Basic ${authToken}`;

  const { mutateAsync: preSignFileImportUrl } = useMutation<
    string,
    AxiosError,
    { url: string; fileName: string }
  >(async ({ url, fileName }: { url: string; fileName: string }) => {
    if (simulate403) {
      // Symulacja błędu 403
      return Promise.reject({
        response: {
          status: 403,
          data: { message: "Simulated 403 Forbidden" },
        },
      });
    }
    return axios
      .get(url, {
        params: { name: fileName },
        headers,
      })
      .then((res) => res.data)
      .catch((error) => {
        if (error.response?.status === 401) {
          window.dispatchEvent(
            new CustomEvent("global-toast", {
              detail: { message: "401 Unauthorized", severity: "error" },
            })
          );
        }
        if (error.response?.status === 403) {
          window.dispatchEvent(
            new CustomEvent("global-toast", {
              detail: { message: "403 Forbidden", severity: "error" },
            })
          );
        }
        throw error; // Re-throw the error to be handled by useMutation's onError
      });
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    try {
      // Get the presigned URL
      const preSignedUrl = await preSignFileImportUrl({
        url,
        fileName: encodeURIComponent(file?.name || ""),
      });
      console.log("File to upload: ", file?.name);
      console.log("Uploading to: ", preSignedUrl);
      const result = await fetch(preSignedUrl, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      if (result.ok) {
        window.dispatchEvent(
          new CustomEvent("global-toast", {
            detail: { message: "Plik został wysłany.", severity: "success" },
          })
        );
      } else {
        window.dispatchEvent(
          new CustomEvent("global-toast", {
            detail: { message: `Błąd wysyłania pliku: ${result.status}`, severity: "error" },
          })
        );
      }
      setFile(undefined);
    } catch (error) {
      console.error("There was an error uploading the file", error);
      window.dispatchEvent(
        new CustomEvent("global-toast", {
          detail: { message: "Wystąpił błąd podczas wysyłania pliku.", severity: "error" },
        })
      );
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <label>
        <input
          type="checkbox"
          checked={simulate403}
          onChange={(e) => setSimulate403(e.target.checked)}
        />
        Symuluj błąd 403
      </label>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
