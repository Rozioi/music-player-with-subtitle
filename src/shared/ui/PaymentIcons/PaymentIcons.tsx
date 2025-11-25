import creditCardType from "credit-card-type";
import React, { useState, useEffect } from "react";

export const PaymentIcons: React.FC<{ cardNumber: string }> = ({
  cardNumber,
}) => {
  const [detectedType, setDetectedType] = useState<string | null>(null);

  useEffect(() => {
    if (cardNumber.trim()) {
      const types = creditCardType(cardNumber.replace(/\s/g, ""));
      setDetectedType(types[0]?.type || null);
    } else {
      setDetectedType(null);
    }
  }, [cardNumber]);

  const cardTypes = [
    {
      type: "visa",
      name: "Visa",
      color: "#1A1F71",
    },
    {
      type: "mastercard",
      name: "Mastercard",
    },
  ];

  const MastercardIcon = ({ opacity = 1 }) => (
    <svg
      width="32"
      height="20"
      viewBox="0 0 24 16"
      fill="none"
      style={{ opacity }}
    >
      <circle cx="9" cy="8" r="6" fill="#EB001B" />
      <circle cx="15" cy="8" r="6" fill="#F79E1B" />
    </svg>
  );

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        marginTop: "8px",
      }}
    >
      {cardTypes.map((card) => {
        const isActive = detectedType === card.type;
        const opacity = isActive ? 1 : 0.35;

        return (
          <div
            key={card.type}
            style={{
              opacity,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={card.name}
          >
            {card.type === "visa" ? (
              <div
                key={card.type}
                style={{
                  width: 32,
                  height: 20,
                  opacity,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#1A1F71",
                  borderRadius: "3px",
                  padding: "2px",
                }}
                title={card.name}
              >
                <img
                  src={
                    "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg "
                  }
                  alt={"visa"}
                  width={28}
                  height={16}
                  style={{
                    filter: "brightness(0) invert(1)",
                    objectFit: "contain",
                  }}
                />
              </div>
            ) : (
              <div
                key={card.type}
                style={{
                  width: 32,
                  height: 20,
                  opacity,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#000000",
                  borderRadius: "3px",
                  padding: "2px",
                }}
                title={card.name}
              >
                <MastercardIcon opacity={opacity} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
