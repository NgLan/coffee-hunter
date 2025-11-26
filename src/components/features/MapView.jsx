import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Fix lỗi icon mặc định của Leaflet trong React ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;
// ----------------------------------------------------

// Component phụ để xử lý hiệu ứng di chuyển camera khi chọn quán
const MapUpdater = ({ selectedStore }) => {
    const map = useMap();

    useEffect(() => {
        if (selectedStore) {
            // Bay tới vị trí quán được chọn với zoom level 16
            map.flyTo(
                [selectedStore.latitude, selectedStore.longitude],
                16,
                { duration: 1.5 }
            );
        }
    }, [selectedStore, map]);

    return null;
};

const MapView = ({ stores, selectedStore, onSelectStore }) => {
    // Tọa độ trung tâm mặc định (Hồ Hoàn Kiếm)
    const defaultCenter = [21.0285, 105.8542];

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="z-0" // Đảm bảo map nằm dưới các thành phần UI khác
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Component xử lý logic zoom/pan */}
            <MapUpdater selectedStore={selectedStore} />

            {/* Render các Marker từ danh sách stores */}
            {stores.map((store) => (
                <Marker
                    key={store.id}
                    position={[store.latitude, store.longitude]}
                    eventHandlers={{
                        click: () => onSelectStore(store), // Bắt sự kiện click vào marker
                    }}
                >
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-sm">{store.name_jp}</h3>
                            <p className="text-xs text-gray-600">{store.address_jp}</p>
                            <p className="text-xs text-yellow-600 font-semibold mt-1">
                                ★ {store.avg_rating}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;