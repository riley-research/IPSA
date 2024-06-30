import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { makeAutoObservable, runInAction } from "mobx";
import { firestore, storage } from "../firebase";
import { UploadedFile, UploadedFileType } from "../types/DataUploadTypes";

class DataUploadStore {
  files: Map<string, UploadedFile> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  async uploadFile(file: File, userId: string, type: UploadedFileType) {
    try {
      const timestamp = Date.now();
      const storagePath = `${type}/${userId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      console.log("[DataUploadStore][uploadFile] File uploaded to storage");

      const docRef = await addDoc(collection(firestore, type), {
        name: file.name,
        userId: userId,
        path: storageRef.fullPath,
        createdAt: new Date(),
        type,
      });

      console.log("[DataUploadStore][uploadFile] Firestore document created");

      // Update the files map immediately after the document is created
      const newFile = {
        docId: docRef.id,
        name: file.name,
        userId: userId,
        path: storageRef.fullPath,
        createdAt: new Date(),
        type,
      };

      runInAction(() => {
        this.files.set(docRef.id, newFile);
      });

      console.log("[DataUploadStore][uploadFile] Local file map updated");
    } catch (error) {
      console.error(
        "[DataUploadStore][uploadFile] Error uploading file:",
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
