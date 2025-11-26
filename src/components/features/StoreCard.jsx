import React from "react";
import { MapPin, Star, Heart, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStoreData } from "@/hooks/useStoreData";

/**
 * Store Card Component - Hiển thị thông tin quán cà phê dạng card
 * @param {Object} store - Thông tin quán
 * @param {boolean} compact - Hiển thị dạng compact (cho map sidebar)
 */
const StoreCard = ({ store, compact = false }) => {
    const { isFavorite, toggleFavorite } = useStoreData();
    const isLiked = isFavorite(store.id);

    if (compact) {
        return (
            <Card className="overflow-hidden transition-shadow hover:shadow-md border border-gray-200">
                <CardContent className="p-2">
                    <div className="flex gap-2">
                        {/* Thumbnail */}
                        <div className="h-16 w-16 flex-shrink-0">
                            <img
                                src={store.main_image_url}
                                alt={store.name_jp}
                                className="h-full w-full rounded object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-semibold text-xs line-clamp-1">{store.name_jp}</h3>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{store.avg_rating}</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5 text-xs text-gray-600">
                                <div className="flex items-start gap-1 line-clamp-1">
                                    <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                    <span className="line-clamp-1">{store.address_jp}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 flex-shrink-0" />
                                    <span className="line-clamp-1">{store.opening_hours_jp}</span>
                                </div>
                            </div>
                        </div>
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
                <Link to={`/store/${store.id}`}>
                    <Button variant="outline" className="w-full">
                        詳細を見る
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};

export default StoreCard;
