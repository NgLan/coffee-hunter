import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MapPin,
  Clock,
  ChevronRight,
  LogOut,
  Star,
  Bell,
  User as UserIcon,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { MOCK_STORES } from "@/mocks/data/stores";
import { MOCK_USERS, MOCK_FAVORITES } from "@/mocks/data/users";
import { useAuth } from "@/contexts/AuthContext";

export default function UserFavoritePage() {
  const { logout } = useAuth();
  const [currentUser] = useState(MOCK_USERS[0]);
  const [activeMenu, setActiveMenu] = useState("favorites");
  const navigate = useNavigate();

  const favoriteStoreIds = MOCK_FAVORITES.filter(
    (fav) => fav.user_id === currentUser.id
  ).map((fav) => fav.store_id);

  // Get favorite stores
  const favoriteStores = MOCK_STORES.filter((store) =>
    favoriteStoreIds.includes(store.id)
  );

  const handleCafeClick = (cafeId) => {
    navigate(`/store/${cafeId}`);
  };

  const handleLogout = () => {
    if (window.confirm("ログアウトしますか？")) {
      logout(); // Gọi hàm logout từ AuthContext
      navigate("/login"); // Chuyển về trang login sau khi logout
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < fullStars
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-2 -ml-24">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              {/* User Profile Image */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200 py-4">
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.name}
                  className="w-24 h-24 mx-auto rounded-full border-4 border-orange-400 mb-3"
                />
                <h3 className="font-semibold text-gray-800">
                  {currentUser.name}
                </h3>
                <p className="text-sm text-gray-500">{currentUser.email}</p>
                <p className="text-sm text-gray-500">{currentUser.birthday}</p>
              </div>

              {/* Menu Items */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setActiveMenu("favorites")}
                  className={`w-full px-4 py-2 text-sm text-left border border-gray-300 rounded ${
                    activeMenu === "favorites"
                      ? "bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  お気に入りリスト
                </button>
              </div>

              {/* Logout Button */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  ログアウト
                  <LogOut className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-10">
            {/* Title */}
            <h2 className="text-xl font-bold mb-4">お気に入りリスト</h2>

            {/* Store Cards */}
            <div className="space-y-4">
              {favoriteStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => handleCafeClick(store.id)}
                  className="bg-white rounded-lg border-2 border-gray-300 p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {/* Store Name and Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold">{store.name_jp}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(store.avg_rating)}
                          <span className="text-sm font-semibold text-gray-700">
                            {store.avg_rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({store.review_count}件)
                          </span>
                        </div>
                      </div>

                      {/* Location and Time */}
                      <div className="grid grid-cols-2 gap-8 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{store.address_jp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">
                            {store.opening_hours_jp}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Ngăn event bubble lên card
                          handleCafeClick(store.id);
                        }}
                        className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {favoriteStores.length === 0 && (
              <div className="bg-white rounded-lg border-2 border-gray-300 p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  お気に入りの店舗がありません
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
