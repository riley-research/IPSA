import { doc, getDoc, setDoc } from "firebase/firestore";
import { makeAutoObservable, runInAction } from "mobx";
import { firestore } from "src/firebase";
import DataUploadStore from "./DataUploadStore";
import PeptideStore from "./PeptideStore";

class UserStore {
  userId: string = "user108"; // This would be dynamically set based on user session or authentication
  selectedFiles: {
    [key: string]: string;
  } = {
    Identifications: "",
    PeakList: "",
    Modifications: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  async saveSelectedFiles() {
    const userRef = doc(firestore, "Users", this.userId);
    try {
      await setDoc(userRef, { selectedFiles: this.selectedFiles });
      console.log("Selected files saved to Firestore.");
    } catch (error) {
      console.error("Error saving selected files: ", error);
    }
  }

  async loadSelectedFiles() {
    const userRef = doc(firestore, "Users", this.userId);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        runInAction(() => {
          Object.keys(data.selectedFiles).forEach((key) => {
            const fileName = data.selectedFiles[key];
            // Use setSelectedFile to ensure all logic associated with setting a file is executed
            this.setSelectedFile(key, fileName);
          });
        });
        console.log("Selected files loaded from Firestore.");
      } else {
        console.log("No selected files found in Firestore.");
      }
    } catch (error) {
      console.error("Error loading selected files: ", error);
    }
  }

  setSelectedFile(fileType: string, fileName: string) {
    console.log(
      `[setSelectedFile] Setting selected file for type: ${fileType} with name: ${fileName}`
    );
    this.selectedFiles[fileType] = fileName;

    this.saveSelectedFiles();

    if (fileType === "Identifications") {
      const file = Array.from(DataUploadStore.files.values()).find(
        (f) => f.name === fileName
      );
      console.log(`[setSelectedFile] Retrieved file:`, file);

      if (file?.csvText) {
        console.log(`[setSelectedFile] Loading peptides from CSV text`);
        PeptideStore.loadPeptidesFromCSV(file.csvText);
      } else {
        console.log(
          `[setSelectedFile] No CSV text found for file: ${fileName}`
        );
      }
    }
  }
}

export default new UserStore();
