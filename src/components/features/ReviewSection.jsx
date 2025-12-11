// components/features/ReviewSection.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Star,
  MessageSquare,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoginPrompt } from "@/components/features/LoginPrompt";
import { ReviewForm } from "@/components/features/ReviewForm";
import { useAuth } from "@/contexts/AuthContext";

const DEFAULT_ITEMS_PER_PAGE = 10;

const ReviewSection = ({
  reviews = [],
  isAuthenticated = false, // Fallback default
  currentUser = null,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  onAddReview = null,
  storeId = null,
}) => {
  const auth = useAuth();
  // Nếu prop không truyền vào thì lấy từ auth context (đề phòng trường hợp gọi từ nơi khác)
  const effectiveIsAuthenticated = isAuthenticated || auth?.isAuthenticated;
  const effectiveCurrentUser = currentUser || auth?.user;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [highlightedReviewId, setHighlightedReviewId] = useState(null);
  const prevCountRef = useRef(reviews.length);

  // Ẩn section nếu không có review và chưa đăng nhập
  if ((!reviews || reviews.length === 0) && !effectiveIsAuthenticated)
    return null;

  // --- LOGIC SẮP XẾP (Giữ nguyên từ bản mới) ---
  const sortedReviews = useMemo(() => {
    const uid = effectiveCurrentUser ? String(effectiveCurrentUser.id) : null;

    // Tìm review của user hiện tại
    const userReviews = uid
      ? reviews.filter((r) => String(r.user_id) === uid)
      : [];
    const myReview = userReviews.length
      ? userReviews.reduce((latest, r) => {
          return !latest || new Date(r.created_at) > new Date(latest.created_at)
            ? r
            : latest;
        }, null)
      : null;

    // Các review còn lại
    let otherReviews = uid
      ? reviews.filter((r) => String(r.id) !== String(myReview?.id))
      : [...reviews];

    switch (sortBy) {
      case "rating_high":
        otherReviews.sort((a, b) => b.rating - a.rating);
        break;
      case "rating_low":
        otherReviews.sort((a, b) => a.rating - b.rating);
        break;
      case "has_image":
        otherReviews.sort((a, b) => {
          const aHasImg = a.images && a.images.length > 0 ? 1 : 0;
          const bHasImg = b.images && b.images.length > 0 ? 1 : 0;
          return (
            bHasImg - aHasImg || new Date(b.created_at) - new Date(a.created_at)
          );
        });
        break;
      case "newest":
      default:
        otherReviews.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
    }

    return myReview ? [myReview, ...otherReviews] : otherReviews;
  }, [reviews, sortBy, effectiveCurrentUser]);

  // --- PHÂN TRANG (Giữ nguyên từ bản mới) ---
  const totalPages = Math.max(
    1,
    Math.ceil(sortedReviews.length / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReviews = sortedReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [reviews.length, effectiveCurrentUser]);

  // Hiệu ứng highlight khi thêm review mới
  useEffect(() => {
    if (reviews.length > prevCountRef.current) {
      const newest = reviews.reduce((latest, r) => {
        return !latest || new Date(r.created_at) > new Date(latest.created_at)
          ? r
          : latest;
      }, null);
      if (newest) {
        setHighlightedReviewId(newest.id);
        setCurrentPage(1);
        setTimeout(() => setHighlightedReviewId(null), 3000);
      }
    }
    prevCountRef.current = reviews.length;
  }, [reviews.length]);

  // --- HANDLERS ---
  const openReview = () => {
    if (!effectiveIsAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowReviewModal(true);
  };
  const closeReview = () => setShowReviewModal(false);

  const handleSubmitReview = (payload) => {
    if (typeof onAddReview === "function") {
      const created_at = payload.createdAt || new Date().toISOString();
      const user_id = effectiveCurrentUser?.id || null;
      const user_name =
        effectiveCurrentUser?.name ||
        effectiveCurrentUser?.username ||
        payload.author ||
        "匿名";
      const user_avatar =
        effectiveCurrentUser?.avatar_url ||
        "https://api.dicebear.com/7.x/avataaars/svg?seed=random";

      const payloadForHook = {
        ...payload,
        created_at,
        user_id,
        user_name,
        user_avatar,
      };

      onAddReview(storeId, payloadForHook);
    }
    closeReview();
    setCurrentPage(1);
  };

  const renderPageButtons = () => {
    const pages = [];
    const maxButtons = 7;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      pages.push(1);
      if (start > 2) pages.push(-1);
      for (let p = start; p <= end; p++) pages.push(p);
      if (end < totalPages - 1) pages.push(-1);
      pages.push(totalPages);
    }

    return pages.map((p, idx) => {
      if (p === -1)
        return (
          <span key={`ell-${idx}`} className="px-2 text-sm">
            …
          </span>
        );

      return (
        <Button
          key={p}
          size="sm"
          variant={p === currentPage ? "default" : "outline"}
          onClick={() => setCurrentPage(p)}
          className={p === currentPage ? "font-semibold" : ""}
        >
          {p}
        </Button>
      );
    });
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        {/* HEADER SECTION */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">
              レビュー({reviews.length})
            </h3>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <ArrowUpDown className="mr-2 h-3 w-3" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">新しい順</SelectItem>
                <SelectItem value="has_image">写真付き</SelectItem>
                <SelectItem value="rating_high">評価が高い順</SelectItem>
                <SelectItem value="rating_low">評価が低い順</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={openReview} size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            レビューを書く
          </Button>
        </div>

        {/* REVIEW LIST */}
        <div className="space-y-6">
          {paginatedReviews.map((review) => {
            const isMyReview =
              effectiveCurrentUser &&
              String(review.user_id) === String(effectiveCurrentUser.id);

            return (
              <div
                key={review.id}
                className={`border-b pb-6 last:border-0 last:pb-0 transition-colors ${
                  isMyReview
                    ? "rounded-lg border bg-orange-50/50 p-4 border-orange-200"
                    : ""
                } ${
                  highlightedReviewId === review.id
                    ? "ring-2 ring-primary/60"
                    : ""
                }`}
              >
                {/* THAY ĐỔI Ở ĐÂY: 
                   Kết hợp Layout Avatar của bản mới + Layout Text của bản cũ 
                */}
                <div className="flex gap-3">
                  {/* Avatar (Giữ lại từ bản mới vì đẹp hơn) */}
                  <img
                    src={review.user_avatar}
                    alt={review.user_name}
                    className="h-10 w-10 rounded-full flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Header Row: Tên bên trái - Sao & Ngày bên phải (Giống file cũ) */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">
                          {review.user_name}
                        </p>
                        {isMyReview && (
                          <Badge
                            variant="secondary"
                            className="bg-orange-100 text-orange-700 hover:bg-orange-100 whitespace-nowrap"
                          >
                            あなたのレビュー
                          </Badge>
                        )}
                      </div>

                      {/* Phần Sao & Ngày tháng (Style file cũ) */}
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                // Dùng size h-4 w-4 như file cũ
                                i < Number(review.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {new Date(review.created_at).toLocaleDateString(
                            "ja-JP"
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-muted-foreground break-words whitespace-pre-wrap">
                      {review.comment}
                    </p>

                    {/* Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Review ${idx + 1}`}
                            className="h-20 w-20 rounded-lg object-cover border"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {/* Nút Trang Trước */}
            <Button
              variant="outline"
              size="icon"
              // 🚀 Sửa: Đảm bảo trang không nhỏ hơn 1
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm font-medium">
              {currentPage} / {totalPages}
            </span>

            {/* Nút Trang Sau */}
            <Button
              variant="outline"
              size="icon"
              // 🚀 Sửa: Đảm bảo trang không lớn hơn totalPages
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* MODALS */}
        {showLoginPrompt && (
          <LoginPrompt
            onClose={() => setShowLoginPrompt(false)}
            onLogin={() => {
              setShowLoginPrompt(false);
              auth?.openLoginModal?.();
            }}
            onRegister={() => {
              setShowLoginPrompt(false);
              auth?.openRegisterModal?.();
            }}
          />
        )}

        {showReviewModal && (
          <ReviewForm
            onClose={closeReview}
            onSubmit={handleSubmitReview}
            authorName={
              effectiveCurrentUser?.name || effectiveCurrentUser?.username
            }
          />
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
