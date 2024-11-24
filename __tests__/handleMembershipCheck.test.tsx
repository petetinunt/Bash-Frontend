// tests/utilsMembership.test.ts

import { handleMembershipCheck } from "@/lib/utilsMembership";

interface MemberInfo {
  MID: number;
  Mname: string;
  Tel: string;
  Points: number;
  Alumni: boolean;
}

describe("Membership Check Test Suite", () => {
  let setMemberInfo: jest.Mock;
  let setMembershipPoints: jest.Mock;
  let setTel: jest.Mock;
  let setTelChecked: jest.Mock;
  let unformattedTel: string;
  const baseURL = "http://localhost:3030";

  beforeEach(() => {
    setMemberInfo = jest.fn();
    setMembershipPoints = jest.fn();
    setTel = jest.fn();
    setTelChecked = jest.fn();
    unformattedTel = "";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // T1: Telephone Number Provided, Membership Valid
  it("T1: Membership info is fetched successfully when telephone number is provided and membership is valid", async () => {
    unformattedTel = "0625916127"; // Valid telephone number from your backend data

    // Mock the fetch response
    const mockMemberInfo: MemberInfo = {
      MID: 0,
      Mname: "Thanat Phi",
      Tel: "0625916127",
      Points: 999,
      Alumni: true,
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockMemberInfo,
    });

    await handleMembershipCheck(
      unformattedTel,
      setMemberInfo,
      setMembershipPoints,
      setTelChecked,
      setTel,
      baseURL
    );

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/member/${unformattedTel}`
    );
    expect(setMemberInfo).toHaveBeenCalledWith(mockMemberInfo);
    expect(setMembershipPoints).toHaveBeenCalledWith(mockMemberInfo.Points);
    expect(setTelChecked).toHaveBeenCalledWith(true);
  });

  // T2: Telephone Number Provided, Membership Invalid
  it("T2: Fetch fails when telephone number is provided but membership is invalid", async () => {
    unformattedTel = "0000000000"; // Invalid telephone number

    // Mock the fetch response to simulate a failed fetch
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await handleMembershipCheck(
      unformattedTel,
      setMemberInfo,
      setMembershipPoints,
      setTelChecked,
      setTel,
      baseURL
    );

    expect(fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/member/${unformattedTel}`
    );
    expect(setMemberInfo).toHaveBeenCalledWith(null);
    expect(setMembershipPoints).toHaveBeenCalledWith(null);
    expect(setTel).toHaveBeenCalledWith("");
    expect(setTelChecked).toHaveBeenCalledWith(true);
  });

  // T6: Telephone Number Not Provided
  it("T6: Fetch is not attempted when telephone number is not provided", async () => {
    unformattedTel = ""; // No telephone number provided

    await handleMembershipCheck(
      unformattedTel,
      setMemberInfo,
      setMembershipPoints,
      setTelChecked,
      setTel,
      baseURL
    );

    expect(fetch).not.toHaveBeenCalled();
    expect(setMemberInfo).toHaveBeenCalledWith(null);
    expect(setMembershipPoints).toHaveBeenCalledWith(null);
    expect(setTel).toHaveBeenCalledWith("");
    expect(setTelChecked).toHaveBeenCalledWith(true);
  });
});
