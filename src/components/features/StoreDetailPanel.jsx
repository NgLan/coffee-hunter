import React from 'react';
import { ArrowLeft, Star, MapPin, Clock, Phone, Image as ImageIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const StoreDetailPanel = ({ store, onBack }) => {
    if (!store) return null;

    return (
        <div className="flex flex-col h-full bg-white">
            {/* 1. Header: Nút Back & Ảnh bìa to */}
            <div className="relative h-56 w-full shrink-0">
                <img
                    src={store.main_image_url}
                    alt={store.name_jp}
                    className="h-full w-full object-cover"
                />
                <div className="absolute top-4 left-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="shadow-md bg-white/90 hover:bg-white"
                        onClick={onBack}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> 戻る
                    </Button>
                </div>
            </div>

            {/* 2. Nội dung chi tiết (Scrollable) */}
            <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                    {/* Tên & Rating */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{store.name_jp}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center text-yellow-500">
                                <Star className="fill-current w-5 h-5" />
                                <span className="ml-1 font-bold">{store.avg_rating}</span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500 text-sm">{store.review_count} レビュー </span>
                        </div>
                    </div>

                    <hr />

                    {/* 基本情報 */}
                    <div className="space-y-4">
                        <div className="flex gap-3 text-gray-700">
                            <MapPin className="w-5 h-5 shrink-0 text-primary" />
                            <span className="text-sm">{store.address_jp}</span>
                        </div>
                        <div className="flex gap-3 text-gray-700">
                            <Clock className="w-5 h-5 shrink-0 text-primary" />
                            <span className="text-sm">{store.opening_hours_jp}</span>
                        </div>
                        {store.phone_number && (
                            <div className="flex gap-3 text-gray-700">
                                <Phone className="w-5 h-5 shrink-0 text-primary" />
                                <span className="text-sm">{store.phone_number}</span>
                            </div>
                        )}
                    </div>

                    <hr />

                    {/* 設備・サービス */}
                    <div>
                        <h3 className="font-semibold mb-3">設備・サービス </h3>
                        <div className="flex flex-wrap gap-2">
                            {store.services?.map((service, index) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1">
                                    {service}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* ギャラリー */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4" /> ギャラリー
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            {store.images?.map((img, idx) => (
                                <div key={idx} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                                    <img src={img} alt="gallery" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="h-10"></div> {/* Spacer */}
                </div>
            </ScrollArea>
        </div>
    );
};

export default StoreDetailPanel;
