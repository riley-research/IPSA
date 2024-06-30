import { makeAutoObservable } from "mobx";
import Papa from "papaparse";

interface Peptide {
  Scan: string;
  Sequence: string;
  Charge: string;
  Modification: string;
}

class PeptideStore {
  peptides: Peptide[] = [];
  selectedPeptide: string = "";
  precursorCharge: number = 1;
  maxFragmentCharge: number = 1;
  fragmentTolerance: number = 10.0; // Default in ppm
  matchingThreshold: number = 0.0; // Default in % of Base Peak

  constructor() {
    makeAutoObservable(this);
  }

  setPeptides(peptides: Peptide[]) {
    this.peptides = peptides;
  }

  setSelectedPeptide(peptide: string) {
    this.selectedPeptide = peptide;
  }

  setPrecursorCharge(charge: number) {
    this.precursorCharge = charge;
  }

  setMaxFragmentCharge(charge: number) {
    this.maxFragmentCharge = charge;
  }

  setFragmentTolerance(tolerance: number) {
    this.fragmentTolerance = tolerance;
  }

  setMatchingThreshold(threshold: number) {
    this.matchingThreshold = threshold;
  }

  loadPeptidesFromCSV(csvText: string) {
    Papa.parse(csvText, {
      header: true,
      complete: (results) => {
        this.setPeptides(results.data as Peptide[]);
      },
    });
  }
}

export default new PeptideStore();
