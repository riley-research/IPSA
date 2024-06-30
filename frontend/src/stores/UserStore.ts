import { makeAutoObservable } from "mobx";

class UserStore {
  userId: string = "user108"; // This would be dynamically set
  selectedFiles: {
    [key: string]: string;
  } = {
    Identifications:
      "Identifications/user108/1719619080665_Identifications.csv",
    PeakList: "PeakList/user108/1719619097132_peaklist.mgf",
    Modifications: "Modifications/user108/1719619294139_Modifications.csv",
  };

  constructor() {
    makeAutoObservable(this);
  }
}

export default new UserStore();
