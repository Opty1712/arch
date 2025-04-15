import { OmicronData, RawOmicronData } from "./types";

export function adaptOmicronData(rawData: RawOmicronData): OmicronData {
  return {
    id: (rawData.id || "").toLowerCase(),
    value: (rawData.value || "").trim(),
  };
}
