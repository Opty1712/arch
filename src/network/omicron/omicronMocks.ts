import { OmicronData } from "./types";

const mockOmicronItems: OmicronData[] = [
  {
    id: "OMI-001",
    value: "Alpha value",
  },
  {
    id: "OMI-002",
    value: "Beta value",
  },
  {
    id: "OMI-003",
    value: "Gamma value",
  },
];

export async function mockFetchOmicronData(): Promise<OmicronData[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return [...mockOmicronItems];
}
