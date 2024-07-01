import { makeAutoObservable } from "mobx";

class FragmentationStore {
  nTerminalSelected: string[] = ["b"];
  cTerminalSelected: string[] = ["y"];

  constructor() {
    makeAutoObservable(this);
  }

  toggleNTerminal(ion: string) {
    if (this.nTerminalSelected.includes(ion)) {
      this.nTerminalSelected = this.nTerminalSelected.filter((i) => i !== ion);
    } else {
      this.nTerminalSelected.push(ion);
    }
  }

  toggleCTerminal(ion: string) {
    if (this.cTerminalSelected.includes(ion)) {
      this.cTerminalSelected = this.cTerminalSelected.filter((i) => i !== ion);
    } else {
      this.cTerminalSelected.push(ion);
    }
  }
}

export default new FragmentationStore();
