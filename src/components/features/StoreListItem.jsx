import React from "react";
import { MapPin, Clock, Car, Star, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Store List Item Component - Hiển thị quán cà phê theo wireframe No.5
 * Layout chính xác theo wireframe:
 * - Row 1: Tên quán (trái) + Rating stars (phải sát)
 * - Row 2: 3 icons ngang (MapPin, Clock, Car) + Arrow button (phải sát)
 * @param {Object} store - Thông tin quán cà phê
 */
const StoreListItem = ({ store }) => {
    return (
        <Link to={`/store/${store.id}`} className="block">
            <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-0">
                    <div className="flex gap-0">
                        {/* Image - Left Side (Square) */}
                        <div className="relative w-36 flex-shrink-0 sm:w-40 lg:w-48">
                            <div className="aspect-square h-full w-full overflow-hidden bg-muted">
                                <img
                                    src={store.main_image_url}
                                    alt={store.name_jp}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Info - Right Side */}
                        <div className="relative flex flex-1 flex-col justify-center gap-5 py-6 pr-5 pl-6 sm:pl-7 lg:py-7">
                            {/* Row 1: Store Name + Rating Stars (Same line) */}
                            <div className="flex items-center justify-between gap-3">
                                {/* Store Name */}
                                <h3 className="text-lg font-bold leading-tight group-hover:text-primary sm:text-xl line-clamp-1">
                                    {store.name_jp}
                                </h3>

                                {/* Rating Stars - Màu vàng với nửa sao */}
                                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isFull = star <= Math.floor(store.avg_rating);
                                        const isHalf = !isFull && star === Math.ceil(store.avg_rating) && store.avg_rating % 1 !== 0;

                                        return (
                                            <div key={star} className="relative h-5 w-5">
                                                {/* Background star (gray) */}
                                                <Star className="absolute inset-0 h-5 w-5 fill-gray-300 text-gray-300" />
                                                {/* Foreground star (yellow) */}
                                                {(isFull || isHalf) && (
                                                    <Star
                                                        className="absolute inset-0 h-5 w-5 fill-yellow-400 text-yellow-400"
                                                        style={isHalf ? {
                                                            clipPath: 'inset(0 50% 0 0)'
                                                        } : undefined}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Row 2: Icons Row + Arrow Button (Same line) */}
                            <div className="flex items-center justify-between gap-3">
                                {/* Info Icons Row - 3 icons với thông tin thực tế */}
                                <div className="flex items-center gap-4 sm:gap-5 text-muted-foreground">
                                    {/* Address Icon - Hiển thị địa chỉ thật */}
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-medium line-clamp-1 max-w-[140px] sm:max-w-[180px]">
                                            {store.address_jp.includes('区')
                                                ? store.address_jp.split('区')[1]?.split('通り')[0]?.trim() || store.address_jp.split('区')[0]?.split('市')[1]?.trim() || '場所'
                                                : store.address_jp.split('市')[1]?.split('通り')[0]?.trim() || '場所'
                                            }
                                        </span>
                                    </div>

                                    {/* Opening Hours - Giờ đóng cửa thực tế */}
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 flex-shrink-0" />
                                        <span className="text-sm sm:text-base font-medium">
                                            {store.opening_hours_jp?.match(/(\d{2}):00/g)?.pop()?.replace(':00', 'h') || '22h'}
                                        </span>
                                    </div>

                                    {/* Distance - Khoảng cách thực tế */}
                                    {store.distance && (
                                        <div className="flex items-center gap-2">
                                            <Car className="h-5 w-5 flex-shrink-0" />
                                            <span className="text-sm sm:text-base font-medium">
                                                {store.distance}km
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Arrow Button - Màu nâu */}
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-700 text-white transition-all group-hover:scale-110 group-hover:bg-amber-600">
                                    <ChevronRight className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};

export default StoreListItem;
