import React, { useState } from "react";
import { ArrowLeft, List, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import StoreCard from "@/components/features/StoreCard";
import FilterPanel from "@/components/features/FilterPanel";
import MapView from "@/components/features/MapView";
import StoreDetailPanel from "@/components/features/StoreDetailPanel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    const [expandedStore, setExpandedStore] = useState(null);

    // Filter states
    const [selectedSpaceTypes, setSelectedSpaceTypes] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [minRating, setMinRating] = useState(0);
    const [sortBy, setSortBy] = useState("rating");

    const filteredStores = sortStores(
        filterStores(minRating, selectedServices, selectedSpaceTypes),
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
        setExpandedStore(null); // Reset expanded marker
    };

    return (
        <div className="flex h-screen flex-col">
            <Header />

            <div className="relative flex flex-1 overflow-hidden">
                {/* --- SIDEBAR (BÊN TRÁI) --- */}
                <div
                    className={`absolute left-0 top-0 h-full w-full bg-background transition-transform lg:relative lg:w-96 lg:translate-x-0 z-[500] lg:z-auto ${showList ? "translate-x-0" : "-translate-x-full"
                        }`}
                >
                    <div className="flex h-full flex-col border-r shadow-xl lg:shadow-none bg-white overflow-hidden">

                        {/* LOGIC CHUYỂN ĐỔI: LIST vs DETAIL */}
                        {selectedStore ? (
                            // TRƯỜNG HỢP 1: ĐANG CHỌN QUÁN -> HIỆN CHI TIẾT
                            <StoreDetailPanel
                                store={selectedStore}
                                onBack={handleBackToList}
                            />
                        ) : (
                            // TRƯỜNG HỢP 2: CHƯA CHỌN QUÁN -> HIỆN DANH SÁCH (ko filter)
                            <div className="flex flex-col h-full">
                                {/* LIST SECTION - FULL HEIGHT */}
                                <div className="h-full bg-white overflow-hidden flex flex-col">
                                    {/* Header */}
                                    <div className="p-3 shrink-0 border-b bg-white">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-sm font-semibold">カフェ一覧</h2>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="lg:hidden h-6 w-6"
                                                onClick={() => setShowList(false)}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Store List */}
                                    <ScrollArea className="flex-1">
                                        <div className="p-2 space-y-2">
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
                                    </ScrollArea>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- KHU VỰC BẢN ĐỒ (BÊN PHẢI) --- */}
                <div className="relative flex-1 h-full w-full">
                    {/* Nút Back về Home và Toggle List */}
                    <div className="absolute right-4 top-4 z-[400] flex gap-2">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="lg:hidden shadow-md"
                            onClick={() => setShowList(!showList)}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                        <Link to="/">
                            <Button variant="secondary" size="icon" className="shadow-md">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    {/* Component Bản đồ thật */}
                    <MapView
                        stores={filteredStores}
                        selectedStore={selectedStore}
                        onSelectStore={handleSelectStore}
                        expandedStore={expandedStore}
                        onSetExpandedStore={setExpandedStore}
                    />
                </div>
            </div>
        </div>
    );
};

export default MapPage;
