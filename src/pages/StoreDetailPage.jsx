import { useState } from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    MapPin,
    Clock,
    Phone,
    Star,
    Heart,
    ArrowLeft,
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
import { useStoreData } from "@/hooks/useStoreData";
import { useAuth } from "@/contexts/AuthContext";
import ReviewSection from "@/components/features/ReviewSection";

/**
import { ReviewForm } from "@/components/features/ReviewForm";
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
                onClick={() =>
                  setSelectedImage(0)
                }
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
                onClick={() =>
                  setSelectedImage(store.images.length - 1)
                }
              >
                &gt;&gt;
              </Button>
            </div>
          </div>


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
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-semibold">メニュー</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {store.menu.map((item) => (
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
        <ReviewSection reviews={reviews} />
      </main>
    </div>
  );
};

export default StoreDetailPage;
