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
  Camera,
  Video,
  Plus,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoreData } from "@/hooks/useStoreData";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Store Detail Page - Màn hình chi tiết quán (画面No.7)
 * Hiển thị: Images, Info, Services, Menu, Reviews
 */
const StoreDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { getStoreById, getReviewsByStoreId, isFavorite, toggleFavorite } =
    useStoreData();

  const store = getStoreById(id);
  const reviews = getReviewsByStoreId(parseInt(id));
  const isLiked = isFavorite(parseInt(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(store.menu.length / itemsPerPage);

  const currentItems = store.menu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">店舗が見つかりません</h2>
          <Link to="/" className="mt-4 inline-block">
            <Button>ホームに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

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

        {/* Top Section - Image Gallery + Store Info Card */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Left - Image Gallery */}
          {/* Left - Image Gallery */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <img
                src={store.images[selectedImage]}
                alt={store.name_jp}
                className="aspect-video w-full object-cover"
              />

              <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-3 py-1 text-sm text-white">
                {selectedImage + 1} / {store.images.length}
              </div>
            </div>

            {/* Pagination - Centered */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {/* Prev */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedImage(0)}
              >
                &lt;&lt;
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev > 0 ? prev - 1 : store.images.length - 1
                  )
                }
              >
                &lt;
              </Button>

              {/* Current Index */}
              <div className="text-md font-medium text-gray-700 px-4">
                {selectedImage + 1}
              </div>

              {/* Next */}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev < store.images.length - 1 ? prev + 1 : 0
                  )
                }
              >
                &gt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedImage(store.images.length - 1)}
              >
                &gt;&gt;
              </Button>
            </div>
          </div>

          {/* Right - Store Info Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {/* Store Name & Favorite */}
                <div className="mb-4 flex items-start justify-between">
                  <h1 className="text-2xl font-bold">{store.name_jp}</h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleFavorite(store.id)}
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        isLiked ? "fill-destructive text-destructive" : ""
                      }`}
                    />
                  </Button>
                </div>

                {/* Rating */}
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(store.avg_rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Address */}
                <div className="mb-4 flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <div>
                    <p className="mb-1 text-sm font-medium">地所</p>
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
                    <p className="mb-1 text-sm font-medium">時間</p>
                    <p className="text-sm text-muted-foreground">
                      {store.opening_hours_jp}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Services */}
                <div className="flex gap-3">
                  <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="mb-3 text-lg font-semibold">説明</h3>
            <p className="text-muted-foreground leading-relaxed">
              {store.description_jp}
            </p>
          </CardContent>
        </Card>

        {/* Menu Section */}
        {/* Menu Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">メニュー</h3>

            {/* Grid menu */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentItems.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-lg border p-4">
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

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                &lt;
              </Button>

              <span className="text-sm font-medium">
                Trang {currentPage} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                &gt;
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Post review section */}
        {isAuthenticated && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="mb-4 text-xl font-semibold">レビューを投稿する</h3>

              {/* 星評価 + 画像/動画アイコン */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setReviewRating(i + 1)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          i < reviewRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Camera className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* コメント入力 */}
              <Textarea
                placeholder="コメント"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="mb-4 text-xl font-semibold"
              />

              {/* 写真アップロードボックス */}
              <div className="mb-4">
                <p className="mb-2 text-sm font-medium">写真を追加</p>
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(3)].map((_, i) => (
                    <button
                      key={i}
                      className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
                    >
                      <Plus className="h-8 w-8 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full">レビューを投稿</Button>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">コメント</h3>
            </div>

            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  {/* Review Header */}
                  <div className="mb-3 flex items-center gap-3">
                    <img
                      src={review.user_avatar}
                      alt={review.user_name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{review.user_name}</p>
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
                        <span>
                          {new Date(review.created_at).toLocaleDateString(
                            "ja-JP"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="mb-3 text-muted-foreground">{review.comment}</p>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="flex gap-2">
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
        </Card>
      </main>
    </div>
  );
};

export default StoreDetailPage;
