export type UploadedFileType = "Identifications" | "PeakList" | "Modifications";

export type UploadedFile = {
  type: UploadedFileType;
  docId: string;
  name?: string;
  userId: string;
  path: string;
  createdAt: Date;
  updatedAt?: Date;
};
