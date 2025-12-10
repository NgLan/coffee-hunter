// components/features/ReviewTrigger.tsx
import React, { useContext, useState } from "react";
import { ReviewForm } from "./ReviewForm";
import { LoginPrompt } from "./LoginPrompt";

// import { AuthContext } from "../../contexts/AuthContext";
import { useStoreData } from "@/hooks/useStoreData";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  storeId: number; // luôn bắt buộc
  onNewReview?: (review: any) => void;
};

export const ReviewTrigger: React.FC<Props> = ({ storeId, onNewReview }) => {
  const auth = useAuth();

  const isLoggedIn = auth?.isAuthenticated || !!auth?.currentUser;

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    if (!isLoggedIn) setShowLoginPrompt(true);
    else setShowForm(true);
  };

  // ==========================
  // Login / Register redirect
  // ==========================

  const handleLogin = () => {
    setShowLoginPrompt(false);
    auth?.openLoginModal?.();
  };

  const handleRegister = () => {
    setShowLoginPrompt(false);
    auth?.openRegisterModal?.();
  };

  // ==========================
  // Submit Review
  // ==========================

  const { addReview } = useStoreData();

  const handleSubmit = (payload: { rating: number; comment: string; images: string[] }) => {
    if (!auth?.user) return;

    const newReviewData = {
      user_id: auth.user.id,
      user_name: auth.user.name || auth.user.username || "ユーザー",
      user_avatar: auth.user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=random",
      store_id: storeId,
      rating: payload.rating,
      comment: payload.comment,
      images: payload.images,
    };

    const created = addReview(storeId, newReviewData);

    // If addReview returns nothing (our hook returns void in earlier version), try to read persisted review from localStorage
    // but here our useStoreData addReview returns undefined, so for immediate UI update we rely on onNewReview
    onNewReview?.(created);

    setShowForm(false);
  };

  return (
    <>
      <div
        style={{
          border: "1px dashed #ddd",
          padding: 12,
          borderRadius: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontWeight: 600 }}>レビュー</div>
          <div style={{ fontSize: 13, color: "#666" }}>あなたの評価をお聞かせください</div>
        </div>

        <button
          onClick={handleClick}
          style={{
            background: "#0b76ef",
            color: "#fff",
            padding: "8px 14px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          レビューを書く
        </button>
      </div>

      {/* ==== Login Popup ==== */}
      {showLoginPrompt && (
        <LoginPrompt
          onClose={() => setShowLoginPrompt(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {/* ==== Review Form ==== */}
      {showForm && (
        <ReviewForm
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
          authorName={auth?.user?.name || auth?.user?.username}
        />
      )}
    </>
  );
};
