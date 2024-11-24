import { calculateDiscount, Promotion, MemberInfo } from "@/lib/utilsPromotion";
import { CartItemType } from "@/context/CartContext";

describe("Discount Calculation Test Suite", () => {
  let cartItems: CartItemType[];

  beforeEach(() => {
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
      {
        id: 3,
        productId: 103,
        itemName: "Drink C",
        category: "Beverage",
        quantity: 1,
        price: 90,
        image: "",
      },
    ];
  });

  // T1: Rule 1, No Cart Items
  it("T1: No discount applied because cart is empty (promotion 1)", () => {
    const promotion: Promotion = {
      Pro_ID: "001",
      Promo_Description: "Use 10 point to get one free drink",
    };
    const discount = calculateDiscount(promotion, [], 10, true, null);
    expect(discount).toBe(0);
  });

  // T2: Rule 2, Single Cart Item
  it("T2: Discount applied with promotion 2 for single item", () => {
    const promotion: Promotion = {
      Pro_ID: "002",
      Promo_Description: "Discount every Friday from 1pm until 4pm",
    };
    const discount = calculateDiscount(
      promotion,
      [cartItems[0]],
      null,
      false,
      null
    );
    expect(discount).toBe(0); // No discount because only one item
  });

  // T3: promotion 3, Multiple Cart Items
  it("T4: Discount applied with promotion 3 for multiple items", () => {
    const promotion: Promotion = {
      Pro_ID: "003",
      Promo_Description: "Discount 5 Baht for Alumni",
    };
    const memberInfo: MemberInfo = {
      MID: "M001",
      Mname: "John Doe",
      Tel: "1234567890",
      Points: 0,
      Alumni: true,
    };
    const discount = calculateDiscount(
      promotion,
      cartItems,
      null,
      false,
      memberInfo
    );
    expect(discount).toBe(5); // Flat discount of 5
  });
});
