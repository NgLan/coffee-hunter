import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Phone, ArrowLeft, Heart, Star } from "lucide-react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useStoreData } from "@/hooks/useStoreData";
import { useAuth } from "@/contexts/AuthContext";
import ReviewSection from "@/components/features/ReviewSection";
import { ReviewTrigger } from "@/components/features/ReviewTrigger";

const StoreDetailPage = () => {
  const { id } = useParams();
  const auth = useAuth();
  const { isAuthenticated, currentUser } = auth;

  const {
    getStoreById,
    getReviewsByStoreId,
    isFavorite,
    toggleFavorite,
  } = useStoreData();

  const store = getStoreById(id);

  // Reviews
  const [reviews, setReviews] = useState(() => {
    if (!id) return [];
    return getReviewsByStoreId(parseInt(id)) || [];
  });

  const handleNewReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const [selectedImage, setSelectedImage] = useState(0);

  const isLiked = id ? isFavorite(parseInt(id)) : false;

  // ===== SAFE IMAGES =====
  const images =
    store?.images && store.images.length > 0
      ? store.images
      : ["/placeholder-image.jpg"];

  // Fix render loop
  useEffect(() => {
    if (selectedImage >= images.length) {
      setSelectedImage(0);
    }
  }, [images.length, selectedImage]);

  // Menu
  const itemsPerPage = 6;
  const menuItems = store?.menu || [];
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(menuItems.length / itemsPerPage));

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return menuItems.slice(start, start + itemsPerPage);
  }, [menuItems, currentPage]);

  // ===== Store not found =====
  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る
              </Button>
            </Link>
            <div>
              <h3 className="text-lg font-semibold">店舗が見つかりません</h3>
              <p className="text-muted-foreground">
                該当する店舗は存在しません。
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-8xl">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> 戻る
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              {/* Main Image */}
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <img
                  src={images[selectedImage]}
                  alt={store.name_jp}
                  className="aspect-video w-full object-cover"
                />

                {/* Favorite Button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className={`absolute right-4 top-4 h-10 w-10 rounded-full shadow-lg transition-all ${
                    isLiked ? "bg-red-500 hover:bg-red-600" : ""
                  }`}
                  onClick={() => toggleFavorite(store.id)}
                >
                  <Heart
                    className={`h-5 w-5 transition-all ${
                      isLiked ? "fill-white text-white" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, idx) => (
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

            {/* Description */}
            <Card className="mb-8 mt-6">
              <CardContent className="p-6">
                <h3 className="mb-3 text-lg font-semibold">説明</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {store.description_jp || "説明はありません"}
                </p>
              </CardContent>
            </Card>

            {/* Menu */}
            {menuItems.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">メニュー</h3>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {currentItems.map((item) => (
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                      >
                        &lt;
                      </Button>

                      <span className="text-sm font-medium">
                        {currentPage} / {totalPages}
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
                  )}
                </CardContent>
              </Card>
            )}

            {/* Review Form */}
            <ReviewTrigger storeId={store.id} onNewReview={handleNewReview} />

            {/* Reviews */}
            <ReviewSection reviews={reviews} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h1 className="text-2xl font-bold">{store.name_jp}</h1>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`transition-all ${
                      isLiked ? "bg-red-100 hover:bg-red-200" : ""
                    }`}
                    onClick={() => toggleFavorite(store.id)}
                  >
                    <Heart
                      className={`h-6 w-6 transition-all ${
                        isLiked ? "fill-red-500 text-red-500" : ""
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
                  <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
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
                  <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
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
                  <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="mb-3 text-sm font-medium">サービス</p>
                    <div className="flex flex-wrap gap-2">
                      {(store.services || []).map((service, idx) => (
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
      </main>
    </div>
  );
};

export default StoreDetailPage;