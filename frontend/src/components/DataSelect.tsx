import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import DataUploadStore from "../stores/DataUploadStore";
import UserStore from "../stores/UserStore";
import { UploadedFileType } from "../types/DataUploadTypes";

interface Props {
  labelText?: string;
  fileType: UploadedFileType;
}
const DataSelect = ({ labelText, fileType }: Props) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      DataUploadStore.uploadFile(file, UserStore.userId, fileType)
        .then(() => {
          console.log("[DataSelect][handleFileUpload] File upload successful");
          setSelectedFile(
            `${fileType}/${UserStore.userId}/${Date.now()}_${file.name}`
          );
        })
        .catch((error) => {
          console.error(
            "[DataSelect][handleFileUpload] File upload failed",
            error
          );
        });
    }
  };

  useEffect(() => {
    const unsubscribe = DataUploadStore.listenToFiles(
      fileType,
      UserStore.userId
    );
    return () => unsubscribe();
  }, [fileType]);

  const [selectedFile, setSelectedFile] = useState<string>(
    UserStore.selectedFiles[fileType] || ""
  );
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedFile(event.target.value);
  };

  return (
    <FormControl size="small" error={false}>
      <InputLabel id={`data-select-label-${fileType}`}>{labelText}</InputLabel>
      <Select
        label={labelText}
        value={selectedFile}
        onChange={handleChange}
        displayEmpty
      >
        {Array.from(DataUploadStore.files.values())
          .filter((file) => file.type === fileType)
          .map((file) => (
            <MenuItem key={file.docId} value={file.path}>
              {file.name}
            </MenuItem>
          ))}
        <MenuItem value="">
          <label htmlFor={`file-upload-input-${fileType}`}>
            <UploadFileIcon sx={{ mr: 1 }} />
            Upload More Files
            <input
              id={`file-upload-input-${fileType}`}
              type="file"
              hidden
              accept={fileType === "PeakList" ? ".mgf,.mzML" : ".csv"}
              onChange={handleFileUpload}
            />
          </label>
        </MenuItem>
      </Select>
    </FormControl>
  );
};

export default observer(DataSelect);
