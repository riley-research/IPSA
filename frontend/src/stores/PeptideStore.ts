import { getDownloadURL, ref } from "firebase/storage";
import { computed, makeAutoObservable } from "mobx";
import Papa from "papaparse";
import { testScan } from "src/components/testdata";
import { storage } from "src/firebase";
import { processData } from "src/processDataHelpers";
import DataUploadStore from "./DataUploadStore";

interface Peptide {
  Scan: string;
  Sequence: string;
  Charge: string;
  Modification: string;
}

type ScanData = { mZ: number; intensity: number }[];

class PeptideStore {
  peptides: Peptide[] = [];
  selectedPeptideScanId: string = "";
  precursorCharge: number = 1;
  maxFragmentCharge: number = 1;
  fragmentTolerance: number = 10.0; // Default in ppm
  matchingThreshold: number = 0.0; // Default in % of Base Peak

  scanData: ScanData | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get selectedPeptide() {
    return computed(() => {
      return this.peptides.find((p) => p.Scan === this.selectedPeptideScanId);
    }).get();
  }

  setPeptides(peptides: Peptide[]) {
    this.peptides = peptides;
  }

  setSelectedPeptideScanId(peptide: string) {
    this.selectedPeptideScanId = peptide;

    // Load the scan data for the selected peptide
    const selectedPeptide = this.peptides.find((p) => p.Scan === peptide);
    if (selectedPeptide) {
      const selectedPeakListPath = DataUploadStore.selectedPeakList?.path;

      if (selectedPeakListPath)
        this.processMgfFile(
          selectedPeakListPath,
          parseInt(selectedPeptide.Scan)
        );

      this.setPrecursorCharge(parseInt(selectedPeptide.Charge));
    }
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

  processMgfFile = async (
    filePath: string,
    targetScanNumber: number
  ): Promise<ScanData> => {
    const fileRef = ref(storage, filePath);
    try {
      const url = await getDownloadURL(fileRef);
      const response = await fetch(url);
      const content = await response.text();
      const lines = content.split("\n");
      let isScan = false,
        foundScan = false,
        currentScanNumber = 0;
      let mZ: string[] = [],
        intensity: string[] = [];
      let scanData: ScanData = [];

      lines.forEach((line) => {
        if (line.trim().startsWith("BEGIN IONS")) {
          isScan = true;
          foundScan = false;
          mZ = [];
          intensity = [];
        } else if (line.trim().startsWith("END IONS") && isScan && foundScan) {
          if (mZ.length && intensity.length) {
            scanData = mZ.map((mZValue, index) => ({
              mZ: parseFloat(mZValue),
              intensity: parseFloat(intensity[index]),
            }));
          }
          isScan = false;
          foundScan = false;
        } else if (isScan) {
          if (
            !foundScan &&
            (line.includes("TITLE=") || line.startsWith("SCANS="))
          ) {
            const scanNumber = parseInt(line.split("=").pop() ?? "0");
            if (targetScanNumber === scanNumber) {
              foundScan = true;
              currentScanNumber = scanNumber;
            } else {
              isScan = false; // Skip this scan as it's not in the valid scans list
            }
          } else if (foundScan) {
            const parts = line.trim().split(/\s+/);
            if (
              parts.length === 2 &&
              !isNaN(parseFloat(parts[0])) &&
              !isNaN(parseFloat(parts[1]))
            ) {
              mZ.push(parts[0]);
              intensity.push(parts[1]);
            }
          }
        }
      });

      console.log("MGF data processed successfully for the target scan.");

      this.scanData = scanData;
      return scanData;
    } catch (error) {
      console.error("Error processing MGF file:", error);
      throw new Error("Failed to process MGF file.");
    }
  };

  processData = async () => {
    if (this.selectedPeptide) {
      const input = {
        sequence: this.selectedPeptide.Sequence,
        precursorCharge: this.precursorCharge,
        charge: this.maxFragmentCharge + 1, // TODO: figure this out
        fragmentTypes: testScan.fragmentTypes,
        peakData: this.scanData,
        mods: testScan.mods,
        toleranceType: "ppm",
        tolerance: this.fragmentTolerance,
        matchingType: "% Base Peak",
        cutoff: 0,
      };

      console.log("Processing data with input:", input);

      const result = await processData(input);

      console.log("result", result);
    }
  };
}

export default new PeptideStore();
