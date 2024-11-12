"use client";

import React, { useEffect, useState } from "react";
import { MdLocalOffer } from "react-icons/md";
import styles from "./paymentpage.module.css";
import PaymentItem from "../components/PaymentItem/PaymentItem";
import ReturnButton from "../components/ReturnButton/ReturnButton";
import NavBar from "../components/Nav/Nav";
import QRCodeModal from "../components/QRCodeModal/QRCodeModal";
import { CartItemType, useCart } from "@/context/CartContext";

const baseURL = "http://localhost:3030";
const PROMPTPAY_NUMBER = ""; // Replace with your actual PromptPay number

interface MemberInfo {
  MID: string;
  Mname: string;
  Tel: string;
  Points: number;
  Alumni: boolean;
}

interface Promotion {
  Pro_ID: string;
  Promo_Description: string;
  start_date?: string;
  expiry_date?: string;
}

const PaymentPage: React.FC = () => {
  const { cartItems } = useCart();
  const [tel, setTel] = useState("");
  const [unformattedTel, setUnformattedTel] = useState("");
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const [telChecked, setTelChecked] = useState(false);
  const [membershipPoints, setMembershipPoints] = useState<number | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "cash">("promptpay");

  // Fetch promotions on component mount
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`${baseURL}/promotions`);
        if (!response.ok) {
          throw new Error("Failed to fetch promotions");
        }
        const data = await response.json();
        setPromotions(data);
      } catch (error) {
        setError("Failed to load promotions");
        console.error("Error fetching promotions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Save cart items to localStorage
  useEffect(() => {
    if (cartItems) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const handleMembershipCheck = async () => {
    try {
      const response = await fetch(`${baseURL}/member/${unformattedTel}`);
      if (response.ok) {
        const data = await response.json();
        setMemberInfo(data);

        // If promotion 001 is selected, subtract 10 points from the displayed points
        if (selectedPromotion?.Pro_ID === "001") {
          setMembershipPoints(data.Points - 10);
        } else {
          setMembershipPoints(data.Points);
        }

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
  };

  const handlePromotionSelect = async (promotion: Promotion) => {
    // If selecting the same promotion, deselect it
    if (selectedPromotion?.Pro_ID === promotion.Pro_ID) {
      if (promotion.Pro_ID === "001" && membershipPoints !== null) {
        const success = await updateMemberPoints(10);
        if (success) {
          setSelectedPromotion(null);
        }
      } else {
        setSelectedPromotion(null);
      }
      return;
    }

    // If switching from promotion 001, restore points first
    if (selectedPromotion?.Pro_ID === "001" && membershipPoints !== null) {
      await updateMemberPoints(10);
    }

    // Handle new promotion selection
    if (promotion.Pro_ID === "001") {
      if (membershipPoints && membershipPoints >= 10) {
        const success = await updateMemberPoints(-10);
        if (success) {
          setSelectedPromotion(promotion);
        }
      }
    } else {
      setSelectedPromotion(promotion);
    }
  };

  const updateMemberPoints = async (points: number): Promise<boolean> => {
    if (!memberInfo?.MID) {
      console.log('No member info available');
      return false;
    }

    try {
      const response = await fetch(`${baseURL}/member/add-points`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MID: memberInfo.MID,
          points: Math.abs(points),
        }),
      });

      if (response.ok) {
        const newPoints = membershipPoints !== null ? membershipPoints + points : points;
        setMembershipPoints(newPoints);
        return true;
      } else {
        throw new Error("Failed to update membership points");
      }
    } catch (error) {
      console.error("Error updating points:", error);
      return false;
    }
  };

  const handleMakePayment = async () => {
    if (!cartItems || cartItems.length === 0) {
      console.error("No items in cart");
      return;
    }

    if (memberInfo?.MID) {
      try {
        // Calculate points to add from purchase
        const pointsToAdd = cartItems.reduce((total, item) => total + item.quantity, 0);

        // Only add points if not using promotion 001
        if (!selectedPromotion || selectedPromotion.Pro_ID !== "001") {
          await updateMemberPoints(pointsToAdd);
        }

        console.log("Payment processed successfully!");

        // Reset promotion state
        setSelectedPromotion(null);
        localStorage.removeItem('selectedPromotion');

      } catch (error) {
        console.error("Error processing payment:", error);
      }
    } else {
      console.log("Non-member payment processed successfully!");
    }
  };

  const isPromotionValid = (promotion: Promotion): boolean => {
    if (promotion.Pro_ID === "001") {
      return membershipPoints !== null && membershipPoints >= 10;
    }

    if (!promotion.start_date || !promotion.expiry_date) return true;

    const now = new Date();
    const start = new Date(promotion.start_date);
    const expiry = new Date(promotion.expiry_date);

    return now >= start && now <= expiry;
  };

  const isValidTimeForPromotion002 = (): boolean => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (day !== 5) return false;

    const currentTimeInMinutes = hour * 60 + minute;
    const startTimeInMinutes = 13 * 60;
    const endTimeInMinutes = 16 * 60;

    return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
  };

  const calculateDiscount = (): number => {
    if (!selectedPromotion || !cartItems || cartItems.length === 0) return 0;

    switch (selectedPromotion.Pro_ID) {
      case "001": {
        if (membershipPoints !== null && membershipPoints >= 10) {
          const lowestDrinkPrice = Math.min(
            ...cartItems.map(item => item.price)
          );
          return lowestDrinkPrice;
        }
        return 0;
      }
      case "002": {
        if (isValidTimeForPromotion002() && cartItems.length >= 2) {
          const secondItemPrice = cartItems[1].price;
          return secondItemPrice * 0.5;
        }
        return 0;
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
  };

  const subtotal = cartItems?.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ) ?? 0;

  const discount = calculateDiscount();
  const total = subtotal - discount;
  const itemCount = cartItems?.length ?? 0;

  if (!cartItems) {
    return (
      <main className={styles.main}>
        <NavBar />
        <div className={styles.backButtonContainer}>
          <ReturnButton />
        </div>
        <div className={styles.emptyCart}>
          <p>Your cart is empty</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <NavBar />
      <div className={styles.backButtonContainer}>
        <ReturnButton />
      </div>

      <div className={styles.miscContainer}>
        <p className={styles.myCart}>Order Summary</p>
      </div>

      <div className={styles.itemContainer}>
        {cartItems.map((item) => (
          <PaymentItem
            key={item.id}
            id={item.id}
            itemName={item.itemName}
            type={item.type || ""}
            addOns={item.addOns || []}
            sweetness={item.sweetness || ""}
            quantity={item.quantity}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>

      <div className={styles.miscContainer}>
        <p className={styles.useOffers}>
          <MdLocalOffer className={styles.offerIcon} />
          Use offers
        </p>
      </div>

      <div className={styles.promotionsContainer}>
        <div className={styles.membershipInputContainer}>
          <span className={styles.membershipLabel}>Membership: </span>
          <input
            className={styles.membershipInput}
            type="text"
            placeholder="08X-XXX-XXXX"
            value={tel}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");
              setUnformattedTel(value);

              if (value.length > 3 && value.length <= 6) {
                value = value.replace(/(\d{3})(\d+)/, "$1-$2");
              } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3");
              }
              setTelChecked(false);
              setTel(value);
              setMembershipPoints(null);
              if (value === "") {
                setMemberInfo(null);
              }
            }}
          />
          {tel && !membershipPoints ? (
            <button
              className={styles.checkMembershipButton}
              onClick={handleMembershipCheck}
            >
              Check
            </button>
          ) : null}
          {membershipPoints !== null && telChecked ? (
            <span className={styles.membershipScore}>
              Points: {membershipPoints}
            </span>
          ) : (
            memberInfo === null &&
            telChecked && (
              <span className={styles.membershipInvalid}>
                Membership invalid
              </span>
            )
          )}
        </div>

        <div className={styles.promotions}>
          {isLoading ? (
            <p>Loading promotions...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            promotions.map((promotion) => {
              const isValid = isPromotionValid(promotion);
              const isSelected = selectedPromotion?.Pro_ID === promotion.Pro_ID;

              return (
                <button
                  key={promotion.Pro_ID}
                  className={`${styles.promotionButton} 
                    ${isSelected ? styles.selected : ""}
                    ${!isValid ? styles.disabled : ""}`}
                  onClick={() => handlePromotionSelect(promotion)}
                  disabled={!isValid}
                >
                  <div className={styles.promotionContent}>
                    <MdLocalOffer className={styles.promotionIcon} />
                    <span>
                      {promotion.Promo_Description}
                      {promotion.Pro_ID === "001" && (
                        <span className={styles.pointsIndicator}>
                          {membershipPoints !== null ? ` (${membershipPoints} points)` : ""}
                        </span>
                      )}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className={styles.totalSummary}>
        <div className={styles.totalRow}>
          <p className={styles.totalLabel}>
            Subtotal ({itemCount} items)
          </p>
          <p className={styles.totalAmount}>{subtotal}</p>
        </div>
        <div className={styles.totalRow}>
          <p className={styles.totalDiscount}>Discount</p>
          <p className={styles.totalAmountDiscount}>{discount}</p>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.totalContainer}>
          <p>Total</p>
          <p>{total} Baht</p>
        </div>
        <QRCodeModal
          amount={total}
          phoneNumber={PROMPTPAY_NUMBER}
        />
      </div>
    </main>
  );
};

export default PaymentPage;