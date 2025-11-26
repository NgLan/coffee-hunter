import React, { useState } from "react";
import { ArrowLeft, List, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import StoreCard from "@/components/features/StoreCard";
import FilterPanel from "@/components/features/FilterPanel";
import MapView from "@/components/features/MapView";
import StoreDetailPanel from "@/components/features/StoreDetailPanel"; // <--- IMPORT MỚI
import { Button } from "@/components/ui/button";
import { useStoreData } from "@/hooks/useStoreData";

/**
 * Map Page - Màn hình bản đồ (画面No.6)
 * Đã tích hợp OpenStreetMap qua Leaflet
 */
const MapPage = () => {
    const { filterStores, sortStores } = useStoreData();

    // State quản lý việc chọn quán
    const [selectedStore, setSelectedStore] = useState(null);
    const [showList, setShowList] = useState(true);

    // Filter states
    const [selectedServices, setSelectedServices] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("rating");

    const filteredStores = sortStores(
        filterStores(minRating, selectedServices),
        sortBy
    );

    const handleSelectStore = (store) => {
        setSelectedStore(store);
        // Trên mobile, khi chọn quán thì hiển thị sidebar (vì sidebar đè lên map)
        // Trên PC, sidebar luôn hiện nên không cần set showList
        if (window.innerWidth < 1024) {
            setShowList(true);
        }
    };

    const handleBackToList = () => {
        setSelectedStore(null); // Reset về null để hiện lại danh sách
    };

    return (
        <div className="flex h-screen flex-col">
            <Header />

            <div className="relative flex flex-1 overflow-hidden">
                {/* --- KHU VỰC BẢN ĐỒ (Đã thay thế Mock UI) --- */}
                <div className="relative flex-1 h-full w-full">
                    {/* Nút Back về Home */}
                    <div className="absolute left-4 top-4 z-[400] flex gap-2">
                        <Link to="/">
                            <Button variant="secondary" size="icon" className="shadow-md">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        {/* Nút Toggle List trên Mobile */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="lg:hidden shadow-md"
                            onClick={() => setShowList(!showList)}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Component Bản đồ thật */}
                    <MapView
                        stores={filteredStores}
                        selectedStore={selectedStore}
                        onSelectStore={handleSelectStore}
                    />
                </div>

                {/* --- SIDEBAR LIST (Giữ nguyên logic cũ) --- */}
                <div
                    className={`absolute right-0 top-0 h-full w-full bg-background transition-transform lg:relative lg:w-96 lg:translate-x-0 z-[500] lg:z-auto ${showList ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="flex h-full flex-col border-l shadow-xl lg:shadow-none bg-white">

                        {/* LOGIC CHUYỂN ĐỔI: LIST vs DETAIL */}
                        {selectedStore ? (
                            // TRƯỜNG HỢP 1: ĐANG CHỌN QUÁN -> HIỆN CHI TIẾT
                            <StoreDetailPanel
                                store={selectedStore}
                                onBack={handleBackToList}
                            />
                        ) : (
                            // TRƯỜNG HỢP 2: CHƯA CHỌN QUÁN -> HIỆN DANH SÁCH + FILTER
                            <>
                                <div className="border-b p-4 bg-white z-10">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-lg font-semibold">
                                            カフェ一覧 ({filteredStores.length})
                                        </h2>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="lg:hidden"
                                            onClick={() => setShowList(false)}
                                        >
                                            ✕
                                        </Button>
                                    </div>

                                    <FilterPanel
                                        selectedServices={selectedServices}
                                        onServicesChange={setSelectedServices}
                                        sortBy={sortBy}
                                        onSortChange={setSortBy}
                                        minRating={minRating}
                                        onMinRatingChange={setMinRating}
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                                    <div className="space-y-3">
                                        {filteredStores.map((store) => (
                                            <div
                                                key={store.id}
                                                onClick={() => handleSelectStore(store)}
                                                className="cursor-pointer transition-transform hover:scale-[1.01]"
                                            >
                                                <StoreCard store={store} compact />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPage;
