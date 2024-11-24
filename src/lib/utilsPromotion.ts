// utils/utilsPayment.ts

export interface Promotion {
  Pro_ID: string;
  Promo_Description: string;
  start_date?: string;
  expiry_date?: string;
}

export interface MemberInfo {
  MID: string;
  Mname: string;
  Tel: string;
  Points: number;
  Alumni: boolean;
}

import { CartItemType } from "@/context/CartContext";

// Function to check if a promotion is valid
export function isPromotionValid(
  promotion: Promotion,
  membershipPoints: number | null,
  memberInfo: MemberInfo | null,
  currentDate: Date = new Date()
): boolean {
  let isValid = true;

  if (promotion.Pro_ID === "001") {
    isValid = membershipPoints !== null && membershipPoints >= 10;
  } else if (promotion.Pro_ID === "003") {
    isValid = memberInfo?.Alumni === true;
  } else if (promotion.Pro_ID === "002") {
    const day = currentDate.getUTCDay(); // 0 is Sunday, 5 is Friday
    const hour = currentDate.getUTCHours();
    isValid = day === 5 && hour >= 13 && hour < 16;
  } else {
    // Unknown promotion ID
    isValid = false;
  }

  if (promotion.start_date && promotion.expiry_date) {
    const now = currentDate.getTime();
    const start = new Date(promotion.start_date).getTime();
    const expiry = new Date(promotion.expiry_date).getTime();

    isValid = isValid && now >= start && now <= expiry;
  }

  return isValid;
}

// Function to calculate discount based on the selected promotion
export function calculateDiscount(
  selectedPromotion: Promotion | null,
  cartItems: CartItemType[] | null,
  membershipPoints: number | null,
  pointsRedeemed: boolean,
  memberInfo: MemberInfo | null
): number {
  if (!selectedPromotion || !cartItems || cartItems.length === 0) return 0;

  switch (selectedPromotion.Pro_ID) {
    case "001": {
      if (membershipPoints !== null && pointsRedeemed) {
        const lowestDrinkPrice = Math.min(
          ...cartItems.map((item) => item.price)
        );
        return lowestDrinkPrice;
      }
      return 0;
    }
    case "002": {
      // 50% discount for every second drink
      let discount = 0;
      const sortedItems = [...cartItems].sort((a, b) => a.price - b.price);
      for (let i = 1; i < sortedItems.length; i += 2) {
        discount += sortedItems[i].price * 0.5;
      }
      return discount;
    }
    case "003": {
      if (memberInfo?.Alumni) {
        return 5;
      }
      return 0;
    }
    default:
      return 0;
  }
}
