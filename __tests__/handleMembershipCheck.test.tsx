// tests/utilsMembership.test.ts

import {
  handleMembershipCheck,
  MemberInfo,
  MembershipCheckResult,
} from "@/lib/utilsMembership";

describe("handleMembershipCheck Function Test Suite", () => {
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

  // T1: Valid Membership
  it("T1: Valid membership with alumni true", async () => {
    unformattedTel = "0625916127";

    const mockMemberInfo: MemberInfo = {
      MID: "0",
      Mname: "Thanat Phi",
      Tel: "0625916127",
      Points: 999,
      Alumni: true,
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockMemberInfo,
    });

    const result = await handleMembershipCheck(
      unformattedTel,
      setMemberInfo,
      setMembershipPoints,
      setTelChecked,
      setTel,
      baseURL
    );

    expect(result).toBe(MembershipCheckResult.Valid);
    expect(setMemberInfo).toHaveBeenCalledWith(mockMemberInfo);
    expect(setMembershipPoints).toHaveBeenCalledWith(999);
    expect(setTelChecked).toHaveBeenCalledWith(true);
    expect(setTel).not.toHaveBeenCalledWith("");
  });

  // T2: Invalid Membership
  it("T2: Invalid membership", async () => {
    unformattedTel = "0000000000";

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await handleMembershipCheck(
      unformattedTel,
      setMemberInfo,
      setMembershipPoints,
      setTelChecked,
      setTel,
      baseURL
    );

    expect(result).toBe(MembershipCheckResult.Invalid);
    expect(setMemberInfo).toHaveBeenCalledWith(null);
    expect(setMembershipPoints).toHaveBeenCalledWith(null);
    expect(setTel).toHaveBeenCalledWith("");
    expect(setTelChecked).toHaveBeenCalledWith(true);
  });

  // T3: No Telephone Number Provided (Empty)
  it("T3: No telephone number provided", async () => {
    unformattedTel = "";

    const result = await handleMembershipCheck(
      unformattedTel,
      setMemberInfo,
      setMembershipPoints,
      setTelChecked,
      setTel,
      baseURL
    );

    expect(result).toBe(MembershipCheckResult.Empty);
    expect(fetch).not.toHaveBeenCalled();
    expect(setMemberInfo).toHaveBeenCalledWith(null);
    expect(setMembershipPoints).toHaveBeenCalledWith(null);
    expect(setTel).toHaveBeenCalledWith("");
    expect(setTelChecked).toHaveBeenCalledWith(true);
  });
});
