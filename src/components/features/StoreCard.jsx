import React, { useState } from "react";
import { MapPin, Star, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStoreData } from "@/hooks/useStoreData";
import { ReviewForm } from "@/components/features/ReviewForm";
import { LoginPrompt } from "@/components/features/LoginPrompt";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Store Card Component - Hiển thị thông tin quán cà phê dạng card
 * @param {Object} store - Thông tin quán
 * @param {boolean} compact - Hiển thị dạng compact (cho map sidebar)
 */
const StoreCard = ({ store, compact = false }) => {
    const { isFavorite, toggleFavorite, addReview } = useStoreData();
    const auth = useAuth();
    const { currentUser, isAuthenticated } = auth;
    const isLiked = isFavorite(store.id);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const openReview = (e) => {
        // prevent triggering parent link if inside
        e?.preventDefault?.();

        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }

        setShowReviewModal(true);
    };
    const openLoginFromPrompt = () => {
        setShowLoginPrompt(false);
        auth?.openLoginModal?.();
    };
    const openRegisterFromPrompt = () => {
        setShowLoginPrompt(false);
        auth?.openRegisterModal?.();
    };
    const closeReview = () => setShowReviewModal(false);

    const handleSubmitReview = (payload) => {
        if (typeof addReview === "function") {
            const created_at = payload.createdAt || new Date().toISOString();
            const user_id = currentUser?.id || null;
            const user_name = currentUser?.name || currentUser?.username || payload.author || "匿名";
            const user_avatar = currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=random";

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
    };

    if (compact) {
        return (
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="p-3">
                    <div className="flex gap-3">
                        {/* Thumbnail */}
                        <img
                            src={store.main_image_url}
                            alt={store.name_jp}
                            className="h-20 w-20 rounded-lg object-cover"
                        />

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-semibold text-sm line-clamp-1">{store.name_jp}</h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{store.avg_rating}</span>
                                <span>({store.review_count})</span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                {store.address_jp}
                            </p>
                        </div>

                        {/* Action */}
                        <Link to={`/store/${store.id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        {/* Add a small review button in compact mode */}
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={(e) => openReview(e)}
                            aria-label="レビューを書く"
                        >
                            ✎
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <div className="relative">
                {/* Image */}
                <Link to={`/store/${store.id}`}>
                    <div className="aspect-[4/3] overflow-hidden">
                        <img
                            src={store.main_image_url}
                            alt={store.name_jp}
                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                    </div>
                </Link>

                {/* Favorite Button */}
                <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-3 top-3 h-9 w-9 rounded-full shadow-md"
                    onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(store.id);
                    }}
                >
                    <Heart
                        className={`h-4 w-4 transition-colors ${isLiked ? "fill-destructive text-destructive" : ""
                            }`}
                    />
                </Button>

                {/* Rating Badge */}
                <Badge className="absolute bottom-3 left-3 bg-background/90 text-foreground">
                    <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {store.avg_rating} ({store.review_count})
                </Badge>
            </div>

                <CardContent className="p-4">
                {/* Store Name */}
                <Link to={`/store/${store.id}`}>
                    <h3 className="mb-2 text-lg font-semibold line-clamp-1 hover:text-primary">
                        {store.name_jp}
                    </h3>
                </Link>

                {/* Address */}
                <div className="mb-3 flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="line-clamp-2">{store.address_jp}</span>
                </div>

                {/* Services */}
                <div className="mb-3 flex flex-wrap gap-1.5">
                    {store.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                        </Badge>
                    ))}
                    {store.services.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                            +{store.services.length - 3}
                        </Badge>
                    )}
                </div>

                {/* Description */}
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                    {store.description_jp}
                </p>

                {/* View Details Button */}
                <div className="flex gap-2">
                    <Link to={`/store/${store.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                            詳細を見る
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>

                    <Button onClick={openReview} className="w-36">
                        レビューを書く
                    </Button>
                </div>
            </CardContent>

            {showReviewModal && (
                <ReviewForm
                    onClose={closeReview}
                    onSubmit={handleSubmitReview}
                    authorName={currentUser?.name || currentUser?.username}
                />
            )}
            {showLoginPrompt && (
                <LoginPrompt
                    onClose={() => setShowLoginPrompt(false)}
                    onLogin={openLoginFromPrompt}
                    onRegister={openRegisterFromPrompt}
                />
            )}
        </Card>
    );
};

export default StoreCard;
