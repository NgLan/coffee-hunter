import React, { useState, useMemo } from "react";
import { Star, ChevronLeft, ChevronRight, MessageSquare, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Đảm bảo bồ đã có component Select của shadcn/ui

const ITEMS_PER_PAGE = 3;

const ReviewSection = ({ reviews = [], isAuthenticated }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest"); // Mặc định là mới nhất

  // Nếu không có review và chưa đăng nhập thì ẩn
  if ((!reviews || reviews.length === 0) && !isAuthenticated) return null;

  // 1. Xử lý logic SẮP XẾP (dùng useMemo để tối ưu hiệu năng)
  const sortedReviews = useMemo(() => {
    // Tạo bản sao để không ảnh hưởng mảng gốc
    let sorted = [...reviews];

    switch (sortBy) {
      case "rating_high":
        // Điểm cao xếp trước
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "rating_low":
        // Điểm thấp xếp trước
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "has_image":
        // Có ảnh xếp trước, sau đó đến mới nhất
        sorted.sort((a, b) => {
          const aHasImg = a.images && a.images.length > 0 ? 1 : 0;
          const bHasImg = b.images && b.images.length > 0 ? 1 : 0;
          return bHasImg - aHasImg || new Date(b.created_at) - new Date(a.created_at);
        });
        break;
      case "newest":
      default:
        // Mới nhất xếp trước (dựa vào created_at)
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }
    return sorted;
  }, [reviews, sortBy]);

  // 2. Xử lý logic PHÂN TRANG (trên danh sách đã sắp xếp)
  const totalPages = Math.ceil(sortedReviews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentReviews = sortedReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6">
        {/* HEADER: Tiêu đề + Sort + Nút viết review */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">レビュー({reviews.length})</h3>
            
            {/* Dropdown Sắp xếp */}
            <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                setCurrentPage(1); // Reset về trang 1 khi đổi kiểu sort
            }}>
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <ArrowUpDown className="mr-2 h-3 w-3" />
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">最新</SelectItem>
                <SelectItem value="has_image">写真付き</SelectItem>
                <SelectItem value="rating_high">評価が高い順</SelectItem>
                <SelectItem value="rating_low">評価が低い順</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* {isAuthenticated && (
            <Button size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              レビューを書く
            </Button>
          )} */}
        </div>

        {/* REVIEW LIST */}
        <div className="space-y-6">
          {currentReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">{review.user_name}</p>
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
          ))}
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