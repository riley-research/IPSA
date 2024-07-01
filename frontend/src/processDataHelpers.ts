import { C, H, N, O, Proton, aminoAcidsMasses } from "./constants";

class ChemistryConstants {
  static readonly Proton = Proton;
  static readonly H = H;
  static readonly O = O;
  static readonly N = N;
  static readonly C = C;
}

class GlycanMasses {
  static readonly HexNAc = 203.07937;
}

class Modification {
  site: number;
  deltaMass: number;
  deltaElement: string | undefined;

  constructor(mod: any, site: number) {
    this.site = site;
    this.deltaMass = 0;
    this.deltaElement = undefined;
    if (mod) {
      if (mod.elementChange) {
        this.deltaElement = mod.elementChange;
        if (this.deltaElement)
          this.deltaMass = this.calculateDeltaMass(this.deltaElement);
      } else {
        this.deltaMass = mod.deltaMass;
      }
    }
  }

  private calculateDeltaMass(elementChange: string): number {
    let deltaMass = 0;
    const elements = elementChange.split(" ");
    elements.forEach((element) => {
      const arr = element.match(/([a-zA-Z]+)([-+]?\d*\.?\d+)/);
      if (arr) {
        deltaMass += (ChemistryConstants as any)[arr[1]] * parseFloat(arr[2]);
      }
    });
    return deltaMass;
  }
}

class AminoAcid {
  mass: number;
  modification: Modification;
  name: string;

  constructor(name: string, modification: Modification) {
    this.name = name;
    this.modification = modification;
    this.mass = aminoAcidsMasses[name] + this.modification.deltaMass;
  }
}

class PeptideFragment {
  type: string;
  sequence: string;
  charge: number;
  mz: number;

  constructor(type: string, sequence: string, charge: number, mz: number) {
    this.type = type;
    this.sequence = sequence;
    this.charge = charge;
    this.mz = mz;
  }
}

class Tolerance {
  maxMz: number;
  centerMz: number;
  minMz: number;
  tolerance: number;
  isPPM: boolean;

  constructor(targetMz: number, tolerance: number, isPPM: boolean) {
    this.centerMz = targetMz;
    this.tolerance = tolerance;
    this.isPPM = isPPM;

    if (isPPM) {
      const halfRange = (tolerance * this.centerMz) / 1e6;
      this.maxMz = this.centerMz + halfRange;
      this.minMz = this.centerMz - halfRange;
    } else {
      this.maxMz = this.centerMz + tolerance;
      this.minMz = this.centerMz - tolerance;
    }
  }

  contains(peakMz: number): boolean {
    return this.minMz < peakMz && this.maxMz > peakMz;
  }
}

class Peak {
  mz: number;
  intensity: number;
  percentBasePeak: number;
  sn: number | null;
  matchedFeatures: MatchedFeature[];

  constructor(feature: any, basePeak: any) {
    this.mz = feature.mZ;
    this.intensity = feature.intensity;
    this.percentBasePeak = (100 * feature.intensity) / basePeak.intensity;
    this.sn = feature.sN ?? null;
    this.matchedFeatures = [];
  }
}

class MatchedFeature {
  feature: PeptideFragment | Precursor;
  massError: number;

  constructor(
    matchedFeature: PeptideFragment | Precursor,
    matchedPeakMz: number,
    isPPM: boolean
  ) {
    this.feature = matchedFeature;
    if (isPPM) {
      this.massError =
        ((matchedPeakMz - matchedFeature.mz) / matchedFeature.mz) * 1e6;
    } else {
      this.massError = matchedPeakMz - matchedFeature.mz;
    }
  }
}

class Precursor {
  charge: number;
  mz: number;
  number: string;
  type: string;
  isPrecursor: boolean = true;
  neutralLoss: string = "";

  constructor(
    mass: number,
    charge: number,
    originalCharge: number,
    neutralLoss = ""
  ) {
    this.charge = charge;
    this.mz = (mass + ChemistryConstants.Proton * originalCharge) / charge;
    this.number = originalCharge === 1 ? "+H" : `+${originalCharge}H`;
    this.type = "M";

    if (neutralLoss) {
      this.neutralLoss = `-${neutralLoss}`;
    }
  }
}

class Peptide {
  aminoAcids: AminoAcid[] = [];
  precursorMz: number = 0;
  precursorMass: number = 0;
  precursorCharge: number;
  charge: number;
  fragments: PeptideFragment[] = [];
  fragTypes: any;
  modifications: Modification[] = [];
  peaks: Peak[] = [];
  basePeak: any;
  sequence: string;
  tolerance: number;
  matchType: string;
  cutoff: number;
  isPPM: boolean;
  annotationTime: any;
  checkVar: any;

  constructor(
    sequence: string,
    precursorCharge: number,
    charge: number,
    fragTypes: any,
    tolerance: number,
    toleranceType: string,
    matchType: string,
    cutoff: number,
    basePeak: any
  ) {
    this.sequence = sequence.toUpperCase();
    this.precursorCharge = precursorCharge;
    this.charge = charge;
    this.fragTypes = fragTypes;
    this.tolerance = tolerance;
    this.isPPM = toleranceType === "ppm";
    this.matchType = matchType;
    this.cutoff = cutoff;
    this.basePeak = basePeak;
  }

  addPeaks(data: any[]) {
    data.forEach((feature) => {
      this.peaks.push(new Peak(feature, this.basePeak));
    });
  }

  addMods(mods: any[]) {
    this.modifications = [];
    for (let i = -1; i <= this.sequence.length; i++) {
      const mod = mods.find((m) => m.index === i) || null;
      this.modifications.push(new Modification(mod, i));
    }
    this.addAminoAcids();
  }

  addAminoAcids() {
    this.aminoAcids = [];
    for (let i = 0; i < this.sequence.length; i++) {
      this.aminoAcids.push(
        new AminoAcid(this.sequence[i], this.modifications[i + 1])
      );
    }
  }

  calculatePrecursorMass() {
    let mass = this.aminoAcids.reduce((sum, aa) => sum + aa.mass, 0);
    mass +=
      this.modifications[0].deltaMass +
      this.modifications[this.modifications.length - 1].deltaMass;
    mass += 2 * ChemistryConstants.H + ChemistryConstants.O;
    this.precursorMz =
      (mass + this.precursorCharge * ChemistryConstants.Proton) /
      this.precursorCharge;
    return mass;
  }

  calculateFragmentMZs() {
    const length = this.aminoAcids.length;
    if (this.fragTypes.a.selected) {
      for (let i = 1; i < length; i++) {
        const subPeptide = this.aminoAcids.slice(0, i);
        const deltaMass =
          this.modifications[0].deltaMass -
          ChemistryConstants.C -
          ChemistryConstants.O;
        const fragmentMZs = this.createFragment(subPeptide, "a", deltaMass);
        this.fragments.push(...fragmentMZs);
      }
    }
    if (this.fragTypes.b.selected) {
      for (let i = 1; i < length; i++) {
        const subPeptide = this.aminoAcids.slice(0, i);
        const deltaMass = this.modifications[0].deltaMass;
        const fragmentMZs = this.createFragment(subPeptide, "b", deltaMass);
        this.fragments.push(...fragmentMZs);
      }
    }
    if (this.fragTypes.y.selected) {
      for (let i = -1; i > -length; i--) {
        const subPeptide = this.aminoAcids.slice(i);
        const deltaMass =
          this.modifications[this.modifications.length - 1].deltaMass +
          2 * ChemistryConstants.H +
          ChemistryConstants.O;
        const fragmentMZs = this.createFragment(subPeptide, "y", deltaMass);
        this.fragments.push(...fragmentMZs);
      }
    }
  }

  private createFragment(
    subPeptide: AminoAcid[],
    type: string,
    deltaMass: number,
    neutralLoss = ""
  ): PeptideFragment[] {
    let mass = deltaMass;
    mass += subPeptide.reduce((sum, aa) => sum + aa.mass, 0);
    const fragmentMZs: PeptideFragment[] = [];
    for (let i = this.charge - 1; i > 0; i--) {
      fragmentMZs.push(
        new PeptideFragment(
          type,
          this.getSubPeptideSequence(subPeptide),
          i,
          (mass + ChemistryConstants.Proton * i) / i
        )
      );
    }
    return fragmentMZs;
  }

  private getSubPeptideSequence(subPeptide: AminoAcid[]): string {
    return subPeptide.map((aa) => aa.name).join("");
  }

  matchFragments() {
    this.fragments.forEach((fragment) => {
      const tolerance = new Tolerance(fragment.mz, this.tolerance, this.isPPM);
      this.peaks.forEach((peak) => {
        if (tolerance.contains(peak.mz)) {
          if (this.matchType === "Intensity" && peak.intensity >= this.cutoff) {
            peak.matchedFeatures.push(
              new MatchedFeature(fragment, peak.mz, this.isPPM)
            );
          } else if (
            this.matchType === "% Base Peak" &&
            peak.percentBasePeak >= this.cutoff
          ) {
            peak.matchedFeatures.push(
              new MatchedFeature(fragment, peak.mz, this.isPPM)
            );
          } else if (
            this.matchType === "S/N" &&
            peak.sn &&
            peak.sn >= this.cutoff
          ) {
            peak.matchedFeatures.push(
              new MatchedFeature(fragment, peak.mz, this.isPPM)
            );
          }
        }
      });
    });

    for (let i = this.precursorCharge; i > 0; i--) {
      const precursor = new Precursor(
        this.precursorMass,
        i,
        this.precursorCharge
      );
      const tolerance = new Tolerance(precursor.mz, this.tolerance, this.isPPM);
      this.peaks.forEach((peak) => {
        if (tolerance.contains(peak.mz)) {
          peak.matchedFeatures.push(
            new MatchedFeature(precursor, peak.mz, this.isPPM)
          );
        }
      });
    }
  }
}

function basePeak(data: any[]): any {
  return data.reduce(
    (max, peak) => (max.intensity > peak.intensity ? max : peak),
    data[0]
  );
}

function cloneMods(mods: any[]): any[] {
  return mods.map((mod) => ({ ...mod }));
}

function generatePeptideData(
  data: any,
  glycanOption: string,
  mods: any[]
): any {
  const basePeakData = basePeak(data.peakData);
  const peptide = new Peptide(
    data.sequence,
    data.precursorCharge,
    data.charge,
    data.fragmentTypes,
    data.tolerance,
    data.toleranceType,
    data.matchingType,
    data.cutoff,
    basePeakData
  );

  peptide.addMods(mods);
  peptide.addPeaks(data.peakData);
  peptide.precursorMass = peptide.calculatePrecursorMass();
  peptide.calculateFragmentMZs();
  peptide.matchFragments();

  return { glycanOption, peptide };
}

export const processData = async (data: any) => {
  if (!data.sequence) {
    return { error: "Sequence is empty" };
  }
  if (!data.charge) {
    return { error: "Charge is undefined" };
  }
  if (!data.fragmentTypes) {
    return { error: "No Fragments were selected" };
  }
  if (!data.peakData[0].mZ) {
    return { error: "No mass/charge data has been detected" };
  }
  if (!data.peakData[0].intensity) {
    return { error: "No intensity data has been detected" };
  }
  if (data.matchingType === "S/N" && !data.peakData[0].sN) {
    return { error: "No signal to noise data has been detected" };
  }
  if (!data.tolerance) {
    return {
      error: "No mass tolerance for fragment matching has been detected",
    };
  }
  if (data.tolerance < 0) {
    return { error: "Mass tolerance must be greater than zero" };
  }
  if (data.cutoff < 0) {
    return { error: "Matching threshold must be positive or zero" };
  }

  const glycanOptions = {
    fullGlycanAttached: cloneMods(data.mods),
    partialGlycanHexNAcAttached: cloneMods(data.mods).map((mod) => ({
      ...mod,
      deltaMass: GlycanMasses.HexNAc,
    })),
    fullGlycanLost: cloneMods(data.mods).map((mod) => ({
      ...mod,
      deltaMass: 0,
    })),
  };

  const results = Object.keys(glycanOptions).map((option) =>
    generatePeptideData(
      data,
      option,
      glycanOptions[option as keyof typeof glycanOptions]
    )
  );
  return results;
};
