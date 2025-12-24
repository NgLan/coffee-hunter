import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Clock, ChevronRight, Star } from "lucide-react";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { useStoreData } from "@/hooks/useStoreData";
import ProfileSidebar from "@/components/features/profile/ProfileSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UserFavoritePage() {
    const { isAuthenticated, currentUser } = useAuth();
    const navigate = useNavigate();
    const { getFavoriteStores } = useStoreData();
    const favoriteStores = getFavoriteStores();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated || !currentUser) return null;

    const handleCafeClick = (cafeId) => {
        navigate(`/store/${cafeId}`);
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, index) => (
                    <Star
                        key={index}
                        className={`w-4 h-4 ${index < fullStars
                            ? "fill-yellow-400 text-yellow-400"
                            : index === fullStars && hasHalfStar
                                ? "fill-yellow-200 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <Header />

            <main className="flex-1 container mx-auto py-6 px-4 flex flex-col min-h-0">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 border rounded-lg bg-white shadow-sm overflow-hidden items-stretch">

                    <ProfileSidebar userData={currentUser} />

                    <div className="md:col-span-3 flex flex-col bg-white h-full min-h-0">
                        <div className="p-8 pb-4">
                            <h2 className="text-xl font-bold border-b-2 border-black/10 pb-2">お気に入りリスト</h2>
                        </div>

                        <ScrollArea className="flex-1 w-full h-full">
                            <div className="p-8 pt-0 space-y-4 pr-6">
                                {favoriteStores.map((store) => (
                                    <div
                                        key={store.id}
                                        onClick={() => handleCafeClick(store.id)}
                                        className="bg-white rounded-lg border-2 border-gray-100 p-4 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-lg font-bold">{store.name_jp}</h3>
                                                    <div className="flex items-center gap-2">
                                                        {renderStars(store.avg_rating)}
                                                        <span className="text-sm font-semibold">{store.avg_rating}</span>
                                                        <span className="text-sm text-gray-500">({store.review_count}件)</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-8 text-sm text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="truncate">{store.address_jp}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="truncate">{store.opening_hours_jp}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                                                    <ChevronRight className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {favoriteStores.length === 0 && (
                                    <div className="py-20 text-center border-2 border-dashed rounded-xl">
                                        <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 text-lg">お気に入りの店舗がありません</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </main>
        </div>
    );
}
