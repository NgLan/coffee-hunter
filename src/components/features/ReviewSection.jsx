import React, { useState, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight, MessageSquare, ArrowUpDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Import thêm Badge để đánh dấu
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE =10;

// Thêm prop currentUser để biết ai đang đăng nhập
const ReviewSection = ({ reviews = [], isAuthenticated, currentUser }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  if ((!reviews || reviews.length === 0) && !isAuthenticated) return null;

  // LOGIC SẮP XẾP & GHIM REVIEW
  const sortedReviews = useMemo(() => {
    // 1. Tách review của user hiện tại (nếu có)
    const myReview = currentUser 
      ? reviews.find((r) => r.user_id === currentUser.id) 
      : null;

    // 2. Lấy danh sách các review còn lại
    let otherReviews = currentUser 
      ? reviews.filter((r) => r.user_id !== currentUser.id)
      : [...reviews];

    // 3. Sắp xếp danh sách còn lại
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
          return bHasImg - aHasImg || new Date(b.created_at) - new Date(a.created_at);
        });
        break;
      case "newest":
      default:
        otherReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    // 4. Gộp lại: Review của mình luôn đứng đầu
    return myReview ? [myReview, ...otherReviews] : otherReviews;
  }, [reviews, sortBy, currentUser]);

  // PHÂN TRANG
  const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentReviews = sortedReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">レビュー({reviews.length})</h3>
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
          {isAuthenticated && (
            <Button size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              レビューを書く
            </Button>
          )}
        </div>

        {/* LIST */}
        <div className="space-y-6">
          {currentReviews.map((review) => {
            // Kiểm tra xem đây có phải review của mình không
            const isMyReview = currentUser && review.user_id === currentUser.id;

            return (
              <div
                key={review.id}
                className={`border-b pb-6 last:border-0 last:pb-0 transition-colors ${
                  isMyReview 
                    ? "rounded-lg border bg-orange-50/50 p-4 border-orange-200" // Style nổi bật
                    : ""
                }`}
              >
                {/* Header: Tên - Badge - Sao */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{review.user_name}</p>
                    {isMyReview && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        あなたのレビュー
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                </div>

                <p className="mb-3 text-muted-foreground">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2">
                    {review.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Review img ${idx}`}
                        className="h-20 w-20 rounded-lg object-cover border"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;