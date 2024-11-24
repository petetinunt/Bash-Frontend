// utils/utilsMembership.ts

import React from "react";

export interface MemberInfo {
  MID: string;
  Mname: string;
  Tel: string;
  Points: number;
  Alumni: boolean;
}

export async function handleMembershipCheck(
  unformattedTel: string,
  setMemberInfo: React.Dispatch<React.SetStateAction<MemberInfo | null>>,
  setMembershipPoints: React.Dispatch<React.SetStateAction<number | null>>,
  setTelChecked: React.Dispatch<React.SetStateAction<boolean>>,
  setTel: React.Dispatch<React.SetStateAction<string>>,
  baseURL: string
): Promise<void> {
  if (!unformattedTel) {
    setMemberInfo(null);
    setMembershipPoints(null);
    setTel("");
    setTelChecked(true);
    return;
  }

  try {
    const response = await fetch(`${baseURL}/member/${unformattedTel}`);
    if (response.ok) {
      const data = await response.json();
      setMemberInfo(data);
      setMembershipPoints(data.Points);
      setTelChecked(true);
    } else {
      throw new Error("Failed to fetch membership info");
    }
  } catch (error) {
    console.error("Error fetching membership info:", error);
    setMemberInfo(null);
    setMembershipPoints(null);
    setTel("");
    setTelChecked(true);
  }
}
