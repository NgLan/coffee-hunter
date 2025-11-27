import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation } from 'lucide-react'; // Icon mũi tên định vị
import { Button } from "@/components/ui/button";

// --- PHẦN ĐỊNH NGHĨA ICON ---
// 1. Icon Quán Cafe (Thường)
const CoffeeIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/924/924514.png',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35]
});

// 1.5. Icon Quán Cafe (Phóng to 1.5x)
const CoffeeIconExpanded = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/924/924514.png',
    iconSize: [70, 70],
    iconAnchor: [35, 70],
    popupAnchor: [0, -70]
});

// 2. Icon Quán Cafe (Đang chọn - Nổi bật)
const SelectedIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/787/787535.png',
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -45],
    className: 'animate-bounce'
});

// 3. Icon Người dùng (User)
const UserIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// --- COMPONENT PHỤ TRỢ ---
const MapUpdater = ({ selectedStore, userLocation, focusUserTrigger, expandedStore }) => {
    const map = useMap();

    // Effect 1: Phóng to marker khi click trên map
    useEffect(() => {
        if (expandedStore) {
            map.flyTo([expandedStore.latitude, expandedStore.longitude], 17, { duration: 1.5 });
        }
    }, [expandedStore, map]);

    // Effect 2: Bay tới quán khi chọn từ list (danh sách sidebar)
    useEffect(() => {
        if (selectedStore && !expandedStore) {
            map.flyTo([selectedStore.latitude, selectedStore.longitude], 16, { duration: 1.5 });
        }
    }, [selectedStore, expandedStore, map]);

    // Effect 3: Bay tới vị trí người dùng khi bấm nút
    useEffect(() => {
        if (userLocation && focusUserTrigger > 0) {
            map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.5 });
        }
    }, [focusUserTrigger, userLocation, map]);

    return null;
};

// --- COMPONENT CHÍNH ---
const MapView = ({ stores, selectedStore, onSelectStore, expandedStore, onSetExpandedStore }) => {
    // Tọa độ mặc định (Hồ Hoàn Kiếm)
    const defaultCenter = [21.0285, 105.8542];

    // State vị trí người dùng
    const [userLocation, setUserLocation] = useState(null);
    // State trigger để kích hoạt việc zoom vào user
    const [focusUserTrigger, setFocusUserTrigger] = useState(0);

    // Hàn lấy vị trí thật
    const handleGetLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Thành công: Lấy toạ độ thật
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setFocusUserTrigger(prev => prev + 1); // Kích hoạt zoom
                },
                (error) => {
                    console.error("Lỗi lấy vị trí:", error);
                    // Fallback: Nếu lỗi (hoặc user từ chối), giả vờ đang ở Nhà Hát Lớn Hà Nội để demo cho đẹp
                    alert("位置情報を取得できません。デモ位置を使用しています。");
                    setUserLocation({ lat: 21.0250, lng: 105.8560 });
                    setFocusUserTrigger(prev => prev + 1);
                }
            );
        } else {
            alert("ブラウザは位置情報をサポートしていません!");
        }
    };

    // Xử lý khi click vào marker trên map
    const handleMarkerClick = (store) => {
        // Click marker: phóng to + mở detail (gọi onSelectStore)
        onSetExpandedStore(store);
        onSelectStore(store);
    };

    // Tự động lấy vị trí khi vào app lần đầu (Optional)
    useEffect(() => {
        handleGetLocation();
    }, []); return (
        <div className="relative h-full w-full">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapUpdater
                    selectedStore={selectedStore}
                    userLocation={userLocation}
                    focusUserTrigger={focusUserTrigger}
                    expandedStore={expandedStore}
                />

                {/* Marker Người dùng */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={UserIcon}>
                        <Popup>あなたはここにいます</Popup>
                    </Marker>
                )}

                {/* Marker Các quán Cafe */}
                {stores.map((store) => (
                    <Marker
                        key={store.id}
                        position={[store.latitude, store.longitude]}
                        icon={expandedStore?.id === store.id ? CoffeeIconExpanded : CoffeeIcon}
                        eventHandlers={{
                            click: () => handleMarkerClick(store),
                        }}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-sm">{store.name_jp}</h3>
                                <p className="text-xs text-gray-600">⭐ {store.avg_rating}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* NÚT VỊ TRÍ CỦA TÔI (Góc dưới phải) */}
            <div className="absolute bottom-6 right-6 z-[400]">
                <Button
                    size="icon"
                    className="rounded-full shadow-xl bg-white text-primary hover:bg-gray-100 h-12 w-12"
                    onClick={handleGetLocation}
                    title="私の位置"
                >
                    <Navigation className="h-6 w-6 fill-current" />
                </Button>
            </div>
        </div>
    );
};

export default MapView;