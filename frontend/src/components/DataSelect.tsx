import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  OutlinedInput,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";
import DataUploadStore from "../stores/DataUploadStore";
import UserStore from "../stores/UserStore";
import { UploadedFileType } from "../types/DataUploadTypes";

interface Props {
  labelText?: string;
  fileType: UploadedFileType;
}

const DataSelect: React.FC<Props> = ({ labelText, fileType }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    const unsubscribe = DataUploadStore.listenToFiles(
      fileType,
      UserStore.userId
    );
    return () => unsubscribe();
  }, [fileType]);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setEditMode(null);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const filePath = await DataUploadStore.uploadFile(
          file,
          UserStore.userId,
          fileType
        );
        UserStore.setSelectedFile(fileType, filePath);
        handlePopoverClose();
        console.log("[DataSelect][handleFileUpload] File upload successful");
      } catch (error) {
        console.error(
          "[DataSelect][handleFileUpload] File upload failed",
          error
        );
      }
    }
  };

  const startEdit = (fileId: string, currentName: string) => {
    setEditMode(fileId);
    setEditedName(currentName);
  };

  const saveEdit = (fileId: string) => {
    DataUploadStore.updateFileName(fileId, editedName);
    setEditMode(null);
  };

  const deleteFile = (fileId: string) => {
    const fileToDelete = DataUploadStore.files.get(fileId);
    if (
      fileToDelete &&
      UserStore.selectedFiles[fileType] === fileToDelete.name
    ) {
      UserStore.setSelectedFile(fileType, ""); // Clear the selection if the deleted file was selected
    }
    DataUploadStore.deleteFile(fileId);
    handlePopoverClose();
  };

  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor={`data-select-input-${fileType}`}>
        {labelText}
      </InputLabel>
      <OutlinedInput
        id={`data-select-input-${fileType}`}
        readOnly
        value={UserStore.selectedFiles[fileType] || "Select a file"}
        onClick={handlePopoverOpen}
        endAdornment={
          <InputAdornment position="end">
            <IconButton aria-label="toggle file list" edge="end">
              <ArrowDropDownIcon />
            </IconButton>
          </InputAdornment>
        }
        label={labelText}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List>
          {Array.from(DataUploadStore.files.values())
            .filter((file) => file.type === fileType)
            .map((file) => (
              <ListItem
                key={file.docId}
                button
                onClick={() => {
                  if (!editMode) {
                    UserStore.setSelectedFile(fileType, file.name);
                    handlePopoverClose();
                  }
                }}
              >
                {editMode === file.docId ? (
                  <TextField
                    fullWidth
                    variant="standard"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => saveEdit(file.docId)}
                            edge="end"
                          >
                            <SaveIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <ListItemText primary={file.name} />
                )}
                <ListItemSecondaryAction>
                  {/* <IconButton
                    edge="end"
                    onClick={() => startEdit(file.docId, file.name)}
                  >
                    <EditIcon />
                  </IconButton> */}
                  <IconButton edge="end" onClick={() => deleteFile(file.docId)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          <ListItem>
            <Button
              fullWidth
              variant="text"
              sx={{
                justifyContent: "flex-start",
                color: "white",
                backgroundColor: "#22a2a4",
                "&:hover": {
                  backgroundColor: "#146162",
                },
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <ListItemIcon>
                <UploadFileIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <Typography variant="body2" fontWeight="bold">
                Upload New File
              </Typography>
            </Button>
            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept={fileType === "PeakList" ? ".mgf,.mzML" : ".csv"}
              onChange={handleFileUpload}
            />
          </ListItem>
        </List>
      </Popover>
    </FormControl>
  );
};

export default observer(DataSelect);
