import React from "react";
import { SlidersHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { SERVICE_OPTIONS, SPACE_TYPE_OPTIONS, RATING_OPTIONS } from "@/mocks/data/constants";

/**
 * Filter Panel Component - Panel lọc và sắp xếp quán cà phê
 * @param {Array} selectedSpaceTypes - Danh sách space types đã chọn
 * @param {Function} onSpaceTypesChange - Callback khi thay đổi space types
 * @param {Array} selectedServices - Danh sách services đã chọn
 * @param {Function} onServicesChange - Callback khi thay đổi services
 * @param {number} minRating - Rating tối thiểu
 * @param {Function} onMinRatingChange - Callback khi thay đổi rating
 */
const FilterPanel = ({
    selectedSpaceTypes = [],
    onSpaceTypesChange,
    selectedServices = [],
    onServicesChange,
    minRating = 0,
    onMinRatingChange,
}) => {
    // Xử lý toggle space type
    const handleSpaceTypeToggle = (spaceType) => {
        const newSpaceTypes = selectedSpaceTypes.includes(spaceType)
            ? selectedSpaceTypes.filter((s) => s !== spaceType)
            : [...selectedSpaceTypes, spaceType];
        onSpaceTypesChange(newSpaceTypes);
    };

    // Xử lý toggle service
    const handleServiceToggle = (service) => {
        const newServices = selectedServices.includes(service)
            ? selectedServices.filter((s) => s !== service)
            : [...selectedServices, service];
        onServicesChange(newServices);
    };

    // Reset filters
    const handleReset = () => {
        onSpaceTypesChange([]);
        onServicesChange([]);
        onMinRatingChange(0);
    };

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Space Type Filter (Indoor/Outdoor) */}
            <div>
                <Label className="mb-3 block text-base font-semibold">空間タイプ</Label>
                <div className="space-y-3">
                    {SPACE_TYPE_OPTIONS.map((spaceType) => (
                        <div key={spaceType.value} className="flex items-center gap-2">
                            <Checkbox
                                id={spaceType.value}
                                checked={selectedSpaceTypes.includes(spaceType.value)}
                                onCheckedChange={() => handleSpaceTypeToggle(spaceType.value)}
                            />
                            <Label
                                htmlFor={spaceType.value}
                                className="cursor-pointer text-sm font-normal"
                            >
                                {spaceType.label_jp}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rating Filter */}
            <div>
                <Label className="mb-3 flex items-center gap-2 text-base font-semibold">
                    <Star className="h-4 w-4" />
                    評価
                </Label>
                <div className="space-y-3">
                    {RATING_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center gap-2">
                            <Checkbox
                                id={`rating-${option.value}`}
                                checked={minRating === option.value}
                                onCheckedChange={() => onMinRatingChange(option.value)}
                            />
                            <Label
                                htmlFor={`rating-${option.value}`}
                                className="cursor-pointer text-sm font-normal flex items-center gap-1"
                            >
                                {option.value > 0 && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                                {option.label_jp}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services Filter */}
            <div>
                <Label className="mb-3 block text-base font-semibold">サービス</Label>
                <div className="space-y-3">
                    {SERVICE_OPTIONS.map((service) => (
                        <div key={service} className="flex items-center gap-2">
                            <Checkbox
                                id={service}
                                checked={selectedServices.includes(service)}
                                onCheckedChange={() => handleServiceToggle(service)}
                            />
                            <Label
                                htmlFor={service}
                                className="cursor-pointer text-sm font-normal"
                            >
                                {service}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <Button variant="outline" className="w-full" onClick={handleReset}>
                リセット
            </Button>
        </div>
    );

    return (
        <>
            {/* Desktop Version */}
            <div className="hidden lg:block">
                <div className="sticky top-20 rounded-lg border bg-card p-6">
                    <div className="mb-4 flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">フィルター</h2>
                    </div>
                    <FilterContent />
                </div>
            </div>

            {/* Mobile Version */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        フィルター
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                    <SheetHeader>
                        <SheetTitle>フィルター</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <FilterContent />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default FilterPanel;
