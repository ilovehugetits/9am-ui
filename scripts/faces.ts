/** The 9AM type stack. Shared by scripts/build-fonts.ts (base64) and the
 *  CLI's `fonts` command (linked). The weight mapping is a design decision,
 *  not something to infer from filenames — so it lives in one table. */
export interface Face {
  family: string;
  file: string;
  weight: number;
}

export const FACES: Face[] = [
  { family: "Poppins", file: "Poppins-Regular.woff2", weight: 400 },
  { family: "Poppins", file: "Poppins-Medium.woff2", weight: 500 },
  { family: "Poppins", file: "Poppins-SemiBold.woff2", weight: 600 },
  { family: "Poppins", file: "Poppins-Bold.woff2", weight: 700 },
  { family: "Phudu", file: "Phudu-SemiBold.woff2", weight: 600 },
  { family: "Phudu", file: "Phudu-Bold.woff2", weight: 700 },
];
