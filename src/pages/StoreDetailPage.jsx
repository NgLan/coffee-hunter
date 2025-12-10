import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Phone, ArrowLeft } from "lucide-react";
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
  } = useStoreData();

  const store = getStoreById(id);

  // Khai báo state trước
  const [reviews, setReviews] = useState(() => {
    if (!id) return [];
    return getReviewsByStoreId(parseInt(id)) || [];
  });

  // Khai báo hàm sau khi có state
  const handleNewReview = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const [selectedImage, setSelectedImage] = useState(0);
  
  const isLiked = id ? isFavorite(parseInt(id)) : false;

  // Menu Paging với kiểm tra an toàn
  const itemsPerPage = 6;
  const menuItems = store?.menu || [];
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(menuItems.length / itemsPerPage));

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return menuItems.slice(start, start + itemsPerPage);
  }, [menuItems, currentPage]);

  // ===== Xử lý khi store không tồn tại =====
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
              <p className="text-muted-foreground">該当する店舗は存在しません。</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ===== Xử lý images an toàn (không mutate) =====
  const images = store.images && store.images.length > 0 
    ? store.images 
    : ['/placeholder-image.jpg'];

  // Reset selectedImage nếu vượt quá số lượng images
  if (selectedImage >= images.length) {
    setSelectedImage(0);
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
          {/* ------------------------------------------------ Left Column ------------------------------------------------ */}
          <div className="lg:col-span-2">
            {/* ---- Image ---- */}
            <div className="relative mb-4 overflow-hidden rounded-lg">
              <img
                src={images[selectedImage]}
                alt={store.name_jp || "Store image"}
                className="aspect-video w-full object-cover"
              />

              <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-3 py-1 text-sm text-white">
                {selectedImage + 1} / {images.length}
              </div>
            </div>

            {/* ---- Image Pagination ---- */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedImage(0)}
                  disabled={selectedImage === 0}
                >
                  &lt;&lt;
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1)
                  }
                >
                  &lt;
                </Button>

                <div className="text-md font-medium text-gray-700 px-4">
                  {selectedImage + 1}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0)
                  }
                >
                  &gt;
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedImage(images.length - 1)}
                  disabled={selectedImage === images.length - 1}
                >
                  &gt;&gt;
                </Button>
              </div>
            )}

            {/* ------------------------------------------------ Description ------------------------------------------------ */}
            <Card className="mb-8 mt-6">
              <CardContent className="p-6">
                <h3 className="mb-3 text-lg font-semibold">説明</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {store.description_jp || "説明はありません"}
                </p>
              </CardContent>
            </Card>

            {/* ------------------------------------------------ Menu ------------------------------------------------ */}
            {menuItems.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">メニュー</h3>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {currentItems.map(item => (
                      <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                        <img
                          src={item.image_url}
                          alt={item.name_jp}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name_jp}</h4>
                          <p className="text-sm text-muted-foreground">{item.description_jp}</p>
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
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      >
                        &gt;
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* ------------------------------------------------ Review Form ------------------------------------------------ */}
            <ReviewTrigger storeId={store.id} onNewReview={handleNewReview} />

            {/* Reviews */}
            <ReviewSection reviews={reviews} />
          </div>

          {/* ------------------------------------------------ Right Column ------------------------------------------------ */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">店舗情報</h3>

                {/* Address */}
                <div className="mb-4 flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="mb-1 text-sm font-medium">住所</p>
                    <p className="text-sm text-muted-foreground">
                      {store.address_jp || "住所情報なし"}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Hours */}
                <div className="mb-4 flex gap-3">
                  <Clock className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="mb-1 text-sm font-medium">営業時間</p>
                    <p className="text-sm text-muted-foreground">
                      {store.opening_hours_jp || "営業時間情報なし"}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Phone */}
                {store.phone_number && (
                  <>
                    <div className="mb-4 flex gap-3">
                      <Phone className="mt-1 h-5 w-5 text-muted-foreground" />
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
                  </>
                )}

                {/* Services */}
                {store.services && store.services.length > 0 && (
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StoreDetailPage;