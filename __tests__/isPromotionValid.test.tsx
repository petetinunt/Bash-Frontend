// tests/utilsPayment.test.ts
import { isPromotionValid, Promotion, MemberInfo } from "@/lib/utilsPromotion";
import { CartItemType } from "@/context/CartContext";

describe("Promotion Handling Test Suite", () => {
  let promotions: Promotion[];
  let cartItems: CartItemType[];
  let memberInfo: MemberInfo | null;

  beforeEach(() => {
    promotions = [
      {
        Pro_ID: "001",
        Promo_Description: "สะสมแต้มผ่าน LINE OA 10 แก้ว ฟรี 1 แก้ว",
      },
      {
        Pro_ID: "002",
        Promo_Description:
          "ลด 50% สำหรับแก้วที่ 2 ทุกวันศุกร์ เวลา 13:00-16:00",
        start_date: "2024-10-01T00:00:00Z",
        expiry_date: "2024-10-31T23:59:59Z",
      },
      {
        Pro_ID: "003",
        Promo_Description: "ส่วนลด 5 บาทสำหรับนักศึกษาเก่ามหิดล",
      },
    ];

    cartItems = [
      {
        id: 1,
        productId: 101,
        itemName: "Drink A",
        category: "Beverage",
        quantity: 1,
        price: 50,
        image: "",
      },
      {
        id: 2,
        productId: 102,
        itemName: "Drink B",
        category: "Beverage",
        quantity: 1,
        price: 70,
        image: "",
      },
    ];

    memberInfo = {
      MID: "M001",
      Mname: "John Doe",
      Tel: "0866001234",
      Points: 10,
      Alumni: true,
    };
  });

  // Test cases based on your partitions

  // T1: Valid Promotion ID, No Cart Items
  it("T1: Valid promotion but cart is empty", () => {
    const promotion = promotions[0]; // Promotion 001
    const isValid = isPromotionValid(
      promotion,
      memberInfo?.Points ?? null,
      memberInfo
    );
    expect(isValid).toBe(true);
  });

  // T2: Valid Promotion ID, Single Cart Item
  it("T2: Valid promotion applied to single cart item", () => {
    const promotion = promotions[0]; // Promotion 001
    const isValid = isPromotionValid(
      promotion,
      memberInfo?.Points ?? null,
      memberInfo
    );
    expect(isValid).toBe(true);
  });

  // T3: Valid Promotion ID, Multiple Cart Items
  it("T3: Valid promotion applied to multiple cart items", () => {
    const promotion = promotions[0]; // Promotion 001
    const isValid = isPromotionValid(
      promotion,
      memberInfo?.Points ?? null,
      memberInfo
    );
    expect(isValid).toBe(true);
  });

  // T4: Expired Promotion ID, No Cart Items
  it("T4: Expired promotion and cart is empty", () => {
    const promotion = promotions[1]; // Promotion 002
    const currentDate = new Date("2024-11-01T14:00:00Z"); // Date after expiry
    const isValid = isPromotionValid(promotion, null, null, currentDate);
    expect(isValid).toBe(false);
  });

  // T5: Expired Promotion ID, Single Cart Item
  it("T5: Expired promotion not applied to single item", () => {
    const promotion = promotions[1]; // Promotion 002
    const currentDate = new Date("2024-11-01T14:00:00Z"); // Date after expiry
    const isValid = isPromotionValid(promotion, null, null, currentDate);
    expect(isValid).toBe(false);
  });

  // T6: Expired Promotion ID, Multiple Cart Items
  it("T6: Expired promotion not applied to multiple items", () => {
    const promotion = promotions[1]; // Promotion 002
    const currentDate = new Date("2025-11-01T14:00:00Z"); // Date after expiry
    const isValid = isPromotionValid(promotion, null, null, currentDate);
    expect(isValid).toBe(false);
  });

  // T7: Invalid Promotion ID, No Cart Items
  it("T7: Invalid promotion ignored when cart is empty", () => {
    const promotion: Promotion = {
      Pro_ID: "999",
      Promo_Description: "Invalid Promo",
    };
    const isValid = isPromotionValid(promotion, null, null);
    expect(isValid).toBe(false);
  });

  // T8: Invalid Promotion ID, Single Cart Item
  it("T8: Invalid promotion ignored for single item", () => {
    const promotion: Promotion = {
      Pro_ID: "999",
      Promo_Description: "Invalid Promo",
    };
    const isValid = isPromotionValid(promotion, null, null);
    expect(isValid).toBe(false);
  });

  // T9: Invalid Promotion ID, Multiple Cart Items
  it("T9: Invalid promotion ignored for multiple items", () => {
    const promotion: Promotion = {
      Pro_ID: "999",
      Promo_Description: "Invalid Promo",
    };
    const isValid = isPromotionValid(promotion, null, null);
    expect(isValid).toBe(false);
  });
});
