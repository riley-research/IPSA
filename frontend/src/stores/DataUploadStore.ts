import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
import { makeAutoObservable, runInAction } from "mobx";
import { readFileAsText } from "src/helpers";
import { firestore, storage } from "../firebase";
import { UploadedFile, UploadedFileType } from "../types/DataUploadTypes";
import UserStore from "./UserStore";

class DataUploadStore {
  files: Map<string, UploadedFile> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  get selectedPeakList() {
    const selectedPeakList = UserStore.selectedFiles.PeakList;

    if (selectedPeakList) {
      return Array.from(this.files.values()).find(
        (file) => file.name === selectedPeakList
      );
    }
  }

  async uploadFile(
    file: File,
    userId: string,
    type: UploadedFileType
  ): Promise<string> {
    const timestamp = Date.now();
    const storagePath = `${type}/${userId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file);

    let csvText = null;
    if (file.type === "text/csv") {
      csvText = await readFileAsText(file);
    }

    let newName = file.name;
    let duplicateCount = 1;
    // Convert iterator to array and check for duplicate names
    const allFiles = Array.from(this.files.values());
    while (allFiles.some((f) => f.name === newName)) {
      newName = `${file.name} (${duplicateCount++})`;
    }

    const docData = {
      name: newName,
      userId: userId,
      path: storageRef.fullPath,
      createdAt: new Date(),
      type,
      csvText,
    };

    const docRef = await addDoc(collection(firestore, type), docData);
    const newFile = {
      docId: docRef.id,
      name: newName,
      userId: userId,
      path: storageRef.fullPath,
      createdAt: new Date(),
      type,
      csvText,
    };

    runInAction(() => {
      this.files.set(docRef.id, newFile);
    });

    return newName; // Return the unique name instead of the path
  }

  async updateFileName(fileId: string, newName: string) {
    try {
      const fileToUpdate = this.files.get(fileId);
      if (fileToUpdate) {
        // Update the document in Firestore
        const docRef = doc(firestore, fileToUpdate.type, fileId);
        await updateDoc(docRef, {
          name: newName,
        });
        console.log(
          "[DataUploadStore][updateFileName] Firestore document updated"
        );

        // Update local map
        runInAction(() => {
          const updatedFile = {
            ...fileToUpdate,
            name: newName,
          };
          this.files.set(fileId, updatedFile);
        });

        console.log("[DataUploadStore][updateFileName] Local file map updated");
      }
    } catch (error) {
      console.error(
        "[DataUploadStore][updateFileName] Error updating file name:",
        error
      );
    }
  }

  async deleteFile(fileId: string) {
    try {
      const fileToDelete = this.files.get(fileId);
      if (fileToDelete) {
        // Delete the file from Firebase Storage
        const fileRef = ref(storage, fileToDelete.path);
        await deleteObject(fileRef);
        console.log("[DataUploadStore][deleteFile] File deleted from storage");

        // Delete the document from Firestore
        const docRef = doc(firestore, fileToDelete.type, fileId);
        await deleteDoc(docRef);
        console.log("[DataUploadStore][deleteFile] Firestore document deleted");

        runInAction(() => {
          this.files.delete(fileId);
        });
      }
    } catch (error) {
      console.error(
        "[DataUploadStore][deleteFile] Error deleting file:",
        error
      );
    }
  }

  getFileType(filename: string) {
    return filename.slice(filename.lastIndexOf("."));
  }

  listenToFiles(type: UploadedFileType, userId: string) {
    const q = query(collection(firestore, type), where("userId", "==", userId));

    return onSnapshot(
      q,
      (snapshot) => {
        runInAction(() => {
          snapshot.docs.forEach((doc) => {
            const fileData = { ...doc.data(), docId: doc.id } as UploadedFile;
            this.files.set(doc.id, fileData);
          });
        });
      },
      (error) => {
        console.error(`Error listening to ${type} files:`, error);
      }
    );
  }

  stopListening(unsubscribe: () => void) {
    unsubscribe();
  }
}

export default new DataUploadStore();
