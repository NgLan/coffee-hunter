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
import { useAuth } from "@/contexts/AuthContext";
import ReviewSection from "@/components/features/ReviewSection";

/**
 * Store Detail Page - Màn hình chi tiết quán (画面No.7)
 * Hiển thị: Images, Info, Services, Menu, Reviews
 */
const StoreDetailPage = () => {
    const { id } = useParams();
    const { isAuthenticated, currentUser } = useAuth();
    const { getStoreById, getReviewsByStoreId, isFavorite, toggleFavorite } =
        useStoreData();

    const store = getStoreById(id);
    const reviews = getReviewsByStoreId(parseInt(id));
    const isLiked = isFavorite(parseInt(id));

    const [selectedImage, setSelectedImage] = useState(0);

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
};

export default StoreDetailPage;
