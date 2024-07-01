export const Proton = 1.007276466879;
export const H = 1.00782503223;
export const O = 15.99491461957;
export const N = 14.00307400443;
export const C = 12.0;

// Amino acid masses
export const aminoAcidsMasses: { [key: string]: number } = {
  A: 71.037114,
  C: 103.00919,
  D: 115.02694,
  E: 129.04259,
  F: 147.06841,
  G: 57.021464,
  H: 137.05891,
  I: 113.08406,
  K: 128.09496,
  L: 113.08406,
  M: 131.04048,
  N: 114.04293,
  P: 97.052764,
  Q: 128.05858,
  R: 156.10111,
  S: 87.032029,
  T: 101.04768,
  V: 99.068414,
  W: 186.07931,
  Y: 163.06333,
};

export class ChemistryConstants {
  static readonly Proton = Proton;
  static readonly H = H;
  static readonly O = O;
  static readonly N = N;
  static readonly C = C;
}

export class GlycanMasses {
  static readonly HexNAc = 203.07937;
}
