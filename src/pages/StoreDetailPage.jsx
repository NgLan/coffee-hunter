import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Phone,
  Star,
  Heart,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoreData } from "@/hooks/useStoreData";
import { LoginPrompt } from "@/components/features/LoginPrompt";
import { useAuth } from "@/contexts/AuthContext";
import ReviewSection from "@/components/features/ReviewSection";
import { ReviewForm } from "@/components/features/ReviewForm";

/**
import { ReviewForm } from "@/components/features/ReviewForm";
 * Store Detail Page - Màn hình chi tiết quán (画面No.7)
 * Hiển thị: Images, Info, Services, Menu, Reviews
 */
const StoreDetailPage = () => {
  const { id } = useParams();
  const auth = useAuth();
  const { isAuthenticated, currentUser } = auth;
  const {
    getStoreById,
    getReviewsByStoreId,
    isFavorite,
    toggleFavorite,
    addReview,
  } = useStoreData();
  const store = getStoreById(id);
  const reviews = getReviewsByStoreId(parseInt(id));
  const isLiked = isFavorite(parseInt(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 10;

  const openReview = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    setShowReviewModal(true);
  };
  const closeReview = () => setShowReviewModal(false);

  const handleSubmitReview = (payload) => {
    if (typeof addReview === "function") {
      const created_at = payload.createdAt || new Date().toISOString();
      const user_id = currentUser?.id || null;
      const user_name =
        currentUser?.name || currentUser?.username || payload.author || "匿名";
      const user_avatar =
        currentUser?.avatar ||
        "https://api.dicebear.com/7.x/avataaars/svg?seed=random";

      const payloadForHook = {
        ...payload,
        created_at,
        user_id,
        user_name,
        user_avatar,
      };

      addReview(store.id, payloadForHook);
    }
    closeReview();
    // make sure the newest review (and user's review) shows on top
    setCurrentPage(1);
  };

  if (!store) {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 md:px-8 lg:px-12 max-w-8xl">
                {/* Back Button */}
                <Link to="/">
                    <Button variant="ghost" className="mb-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        戻る
                    </Button>
                </Link>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column - Images & Basic Info */}
                    <div className="lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="mb-6">
                            {/* Main Image */}
                            <div className="relative mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={store.images[selectedImage]}
                                    alt={store.name_jp}
                                    className="aspect-video w-full object-cover"
                                />
                                {/* Favorite Button */}
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="absolute right-4 top-4 h-10 w-10 rounded-full shadow-lg"
                                    onClick={() => toggleFavorite(store.id)}
                                >
                                    <Heart
                                        className={`h-5 w-5 ${isLiked ? "fill-destructive text-destructive" : ""
                                            }`}
                                    />
                                </Button>
                            </div>

                            {/* Thumbnail Grid */}
                            <div className="grid grid-cols-3 gap-2">
                                {store.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`overflow-hidden rounded-lg border-2 transition-all ${selectedImage === idx
                                                ? "border-primary"
                                                : "border-transparent"
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${store.name_jp} ${idx + 1}`}
                                            className="aspect-video w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Store Name & Rating */}
                        <div className="mb-6">
                            <h1 className="mb-3 text-3xl font-bold">{store.name_jp}</h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xl font-semibold">
                                        {store.avg_rating}
                                    </span>
                                    <span className="text-muted-foreground">
                                        ({store.review_count}件のレビュー)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <h3 className="mb-3 text-lg font-semibold">店舗について</h3>
                                <p className="text-muted-foreground">{store.description_jp}</p>
                            </CardContent>
                        </Card>

                        {/* Menu Section */}
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-lg font-semibold">メニュー</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {store.menu.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 rounded-lg border p-4"
                                        >
                                            <img
                                                src={item.image_url}
                                                alt={item.name_jp}
                                                className="h-20 w-20 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{item.name_jp}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.description_jp}
                                                </p>
                                                <p className="mt-2 font-semibold text-primary">
                                                    {item.price.toLocaleString()}đ
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Reviews Section */}

                        <ReviewSection 
                            reviews={reviews} 
                            isAuthenticated={isAuthenticated} 
                            currentUser={currentUser}
                        />
                    </div>

                    {/* Right Column - Info Card */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <CardContent className="p-6">
                                <h3 className="mb-4 text-lg font-semibold">店舗情報</h3>

                                {/* Address */}
                                <div className="mb-4 flex gap-3">
                                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                    <div>
                                        <p className="mb-1 text-sm font-medium">住所</p>
                                        <p className="text-sm text-muted-foreground">
                                            {store.address_jp}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                {/* Opening Hours */}
                                <div className="mb-4 flex gap-3">
                                    <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                    <div>
                                        <p className="mb-1 text-sm font-medium">営業時間</p>
                                        <p className="text-sm text-muted-foreground">
                                            {store.opening_hours_jp}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                {/* Phone */}
                                <div className="mb-4 flex gap-3">
                                    <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                                    <div>
                                        <p className="mb-1 text-sm font-medium">電話番号</p>
                                        <a
                                            href={`tel:${store.phone_number}`}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            {store.phone_number}
                                        </a>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                {/* Services */}
                                <div>
                                    <p className="mb-3 text-sm font-medium">サービス</p>
                                    <div className="flex flex-wrap gap-2">
                                        {store.services.map((service, idx) => (
                                            <Badge key={idx} variant="secondary">
                                                {service}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
  }
  // Prepare ordered and paginated reviews
  const orderedReviews = React.useMemo(() => {
    const sorted = [...reviews].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    if (currentUser) {
      const idx = sorted.findIndex((r) => r.user_id === currentUser.id);
      if (idx > -1) {
        const userReview = sorted.splice(idx, 1)[0];
        return [userReview, ...sorted];
      }
    }
    return sorted;
  }, [reviews, currentUser]);

  const totalPages = Math.max(
    1,
    Math.ceil(orderedReviews.length / REVIEWS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const paginatedReviews = orderedReviews.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE
  );

  // Reset to first page if reviews change or user changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [reviews.length, currentUser]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:px-8 lg:px-12 max-w-8xl">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Images & Basic Info */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              {/* Main Image */}
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <img
                  src={store.images[selectedImage]}
                  alt={store.name_jp}
                  className="aspect-video w-full object-cover"
                />
                {/* Favorite Button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-4 top-4 h-10 w-10 rounded-full shadow-lg"
                  onClick={() => toggleFavorite(store.id)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked ? "fill-destructive text-destructive" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Thumbnail Grid */}
              <div className="grid grid-cols-3 gap-2">
                {store.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${store.name_jp} ${idx + 1}`}
                      className="aspect-video w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Store Name & Rating */}
            <div className="mb-6">
              <h1 className="mb-3 text-3xl font-bold">{store.name_jp}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-semibold">
                    {store.avg_rating}
                  </span>
                  <span className="text-muted-foreground">
                    ({store.review_count}件のレビュー)
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="mb-3 text-lg font-semibold">店舗について</h3>
                <p className="text-muted-foreground">{store.description_jp}</p>
              </CardContent>
            </Card>

            {/* Menu Section */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">メニュー</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {store.menu.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 rounded-lg border p-4"
                    >
                      <img
                        src={item.image_url}
                        alt={item.name_jp}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name_jp}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description_jp}
                        </p>
                        <p className="mt-2 font-semibold text-primary">
                          {item.price.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card>
              <CardContent className="p-6 pb-0">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">レビュー</h3>
                  <Button onClick={openReview}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    レビューを書く
                  </Button>
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
                </div>

                <div className="space-y-4">
                  {paginatedReviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0">
                      {/* Review Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={review.user_avatar}
                          alt={review.user_name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {review.user_name}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="whitespace-nowrap">
                              {new Date(review.created_at).toLocaleDateString(
                                "ja-JP"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <p className="text-muted-foreground break-words whitespace-pre-wrap">
                        {review.comment}
                      </p>

                      {/* Review Images */}
                      {review.images.length > 0 && (
                        <div className="flex gap-2 mt-2 mb-2 flex-wrap">
                          {review.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt={`Review ${idx + 1}`}
                              className="h-20 w-20 rounded-lg object-cover"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              {showReviewModal && (
                <ReviewForm
                  onClose={closeReview}
                  onSubmit={handleSubmitReview}
                  authorName={currentUser?.name || currentUser?.username}
                />
              )}
              <hr className="border-t border-gray-200" />

              {/* Pagination Controls - centered inside Reviews section */}
              <div className="pb-6 flex flex-col items-center">
                {/* Info */}
                <div className="mb-3 text-sm text-muted-foreground">
                  表示: {paginatedReviews.length} / {orderedReviews.length} 件
                </div>

                <div className="flex items-center gap-2">
                  {/* Jump to First Page */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    最初へ
                  </Button>

                  {/* Prev */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    前へ
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {(() => {
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
                    })()}
                  </div>
                  {/* Next */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    次へ
                  </Button>

                  {/* Jump to Last Page */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    最後へ
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Info Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">店舗情報</h3>

                {/* Address */}
                <div className="mb-4 flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="mb-1 text-sm font-medium">住所</p>
                    <p className="text-sm text-muted-foreground">
                      {store.address_jp}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Opening Hours */}
                <div className="mb-4 flex gap-3">
                  <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="mb-1 text-sm font-medium">営業時間</p>
                    <p className="text-sm text-muted-foreground">
                      {store.opening_hours_jp}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Phone */}
                <div className="mb-4 flex gap-3">
                  <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="mb-1 text-sm font-medium">電話番号</p>
                    <a
                      href={`tel:${store.phone_number}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {store.phone_number}
                    </a>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Services */}
                <div>
                  <p className="mb-3 text-sm font-medium">サービス</p>
                  <div className="flex flex-wrap gap-2">
                    {store.services.map((service, idx) => (
                      <Badge key={idx} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoreDetailPage;
