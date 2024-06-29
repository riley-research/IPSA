export const formatLabel = (
  label: string,
  neutralLoss: string,
  inputCharge: number,
  ionizationMode: string
): string => {
  let returnString = "";
  const charge = inputCharge.toString();

  let glycanAttachmentString = "";

  if (label) {
    if (label.includes("+")) {
      let plusIndex = label.indexOf("+");
      glycanAttachmentString = label.slice(plusIndex);
      label = label.slice(0, plusIndex);
    }

    if (label[0] === "[") {
      label = label.slice(1, -1);
      returnString += "[" + label + formatNeutralLoss(neutralLoss) + "]";

      if (charge > "1") {
        returnString += ionizationMode === "+" ? "\u207a" : "\u207b";
        for (let i = 0; i < charge.length; i++) {
          returnString += powerUnicode(charge[i], false);
        }
      }
    } else {
      let fragmentNumber = label.slice(1);
      if (ionizationMode === "+") {
        if (charge === "1") {
          if (label[0] === "C") {
            returnString += "[c";
            for (let i = 0; i < fragmentNumber.length; i++) {
              returnString += powerUnicode(fragmentNumber[i], true);
            }
            returnString += "-H" + formatNeutralLoss(neutralLoss) + "]";
          } else if (label[0] === "Z") {
            returnString += "[z";
            for (let i = 0; i < fragmentNumber.length; i++) {
              returnString += powerUnicode(fragmentNumber[i], true);
            }
            returnString += "+H" + formatNeutralLoss(neutralLoss) + "]";
          } else if (neutralLoss) {
            returnString += "[" + label[0];
            if (label[0] === "z") {
              returnString += "\u2022";
            }
            for (let i = 0; i < fragmentNumber.length; i++) {
              returnString += powerUnicode(fragmentNumber[i], true);
            }
            returnString += formatNeutralLoss(neutralLoss) + "]";
          } else {
            returnString += label[0];
            if (label[0] === "z") {
              returnString += "\u2022";
            }
            for (let i = 0; i < fragmentNumber.length; i++) {
              returnString += powerUnicode(fragmentNumber[i], true);
            }
          }
        } else {
          if (label[0] === "C") {
            returnString += "[c";
            for (let i = 0; i < fragmentNumber.length; i++) {
              returnString += powerUnicode(fragmentNumber[i], true);
            }
            returnString +=
              "-H" + formatNeutralLoss(neutralLoss) + "]" + "\u207a";
            for (let i = 0; i < charge.length; i++) {
              returnString += powerUnicode(charge[i], false);
            }
          } else if (label[0] === "Z") {
            returnString += "[z";
            for (let i = 0; i < fragmentNumber.length; i++) {
              returnString += powerUnicode(fragmentNumber[i], true);
            }
            returnString +=
              "+H" + formatNeutralLoss(neutralLoss) + "]" + "\u207a";
            for (let i = 0; i < charge.length; i++) {
              returnString += powerUnicode(charge[i], false);
            }
          } else {
            if (neutralLoss) {
              returnString += "[" + label[0];
              if (label[0] === "z") {
                returnString += "\u2022";
              }
              for (let i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              returnString += formatNeutralLoss(neutralLoss) + "]" + "\u207a";
              for (let i = 0; i < charge.length; i++) {
                returnString += powerUnicode(charge[i], false);
              }
            } else {
              returnString += label[0];
              if (label[0] === "z") {
                returnString += "\u2022";
              }
              for (let i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              returnString += "\u207a";
              for (let i = 0; i < charge.length; i++) {
                returnString += powerUnicode(charge[i], false);
              }
            }
          }
        }
      } else {
        if (charge === "1") {
          if (label[0] === "a") {
            if (neutralLoss) {
              returnString += "[a\u2022";
              for (let i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
              returnString += formatNeutralLoss(neutralLoss) + "]";
            } else {
              returnString += "a\u2022";
              for (let i = 0; i < fragmentNumber.length; i++) {
                returnString += powerUnicode(fragmentNumber[i], true);
              }
            }
          } else if (neutralLoss) {
            returnString += "[" + label[0];
            for (let i = 0; i < fragmentNumber.length; i++) {
              returnString += powerUnicode(fragmentNumber[i], true);
            }
            returnString += formatNeutralLoss(neutralLoss) + "]";
          } else {
            returnString += label[0];
            for (let i = 0; i < fragmentNumber.length; i++) {
              returnString += powerUnicode(fragmentNumber[i], true);
            }
          }
        } else {
          if (neutralLoss) {
            returnString += "[" + label[0];
            if (label[0] === "a") {
              returnString += "\u2022";
            }
            for (let i = 0; i < fragmentNumber.length; i++) {
              returnString += powerUnicode(fragmentNumber[i], true);
            }
            returnString += formatNeutralLoss(neutralLoss) + "]" + "\u207b";
            for (let i = 0; i < charge.length; i++) {
              returnString += powerUnicode(charge[i], false);
            }
          } else {
            returnString += label[0];
            if (label[0] === "a") {
              returnString += "\u2022";
            }
            for (let i = 0; i < fragmentNumber.length; i++) {
              returnString += powerUnicode(fragmentNumber[i], true);
            }
            returnString += "\u207b";
            for (let i = 0; i < charge.length; i++) {
              returnString += powerUnicode(charge[i], false);
            }
          }
        }
      }
    }
  }

  return returnString + glycanAttachmentString;
};

const powerUnicode = (number: string, isSubscript: boolean): string => {
  const superscript = [
    "\u2070",
    "\u00B9",
    "\u00B2",
    "\u00B3",
    "\u2074",
    "\u2075",
    "\u2076",
    "\u2077",
    "\u2078",
    "\u2079",
  ];
  const subscript = [
    "\u2080",
    "\u2081",
    "\u2082",
    "\u2083",
    "\u2084",
    "\u2085",
    "\u2086",
    "\u2087",
    "\u2088",
    "\u2089",
  ];

  return isSubscript
    ? subscript[parseInt(number)]
    : superscript[parseInt(number)];
};

const formatNeutralLoss = (neutralLoss: string): string => {
  const subscript = [
    "\u2080",
    "\u2081",
    "\u2082",
    "\u2083",
    "\u2084",
    "\u2085",
    "\u2086",
    "\u2087",
    "\u2088",
    "\u2089",
  ];

  let returnString = "";

  if (neutralLoss) {
    let char = "";
    const length = neutralLoss.length;
    for (let i = 0; i < length; i++) {
      char = neutralLoss.charAt(i);
      if (/[0-9]/.test(char)) {
        returnString += subscript[parseInt(char)];
      } else {
        returnString += char;
      }
    }
  }

  return returnString;
};

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
