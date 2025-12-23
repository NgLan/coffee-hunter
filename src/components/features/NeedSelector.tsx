import React from "react";
import { USER_NEEDS } from "@/utils/recommendation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface NeedSelectorProps {
    selectedNeedIds: string[];
    onSelectNeed: (needId: string) => void;
    onClearAll: () => void;
}

/**
 * Need Selector Component
 * Hiển thị danh sách nhu cầu để user chọn
 */
export const NeedSelector: React.FC<NeedSelectorProps> = ({
    selectedNeedIds,
    onSelectNeed,
    onClearAll
}) => {
    const isSelected = (needId: string) => selectedNeedIds.includes(needId);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    どんな場所をお探しですか？
                </h3>
                {selectedNeedIds.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearAll}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-4 w-4 mr-1" />
                        クリア
                    </Button>
                )}
            </div>

            {/* Need Chips */}
            <div className="flex flex-wrap gap-2">
                {USER_NEEDS.map((need) => {
                    const selected = isSelected(need.id);

                    return (
                        <Button
                            key={need.id}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            onClick={() => onSelectNeed(need.id)}
                            className={`
                                rounded-full transition-all
                                ${selected
                                    ? 'bg-amber-700 hover:bg-amber-600 text-white shadow-md scale-105'
                                    : 'hover:border-amber-700 hover:text-amber-700'
                                }
                            `}
                        >
                            <span className="mr-1.5 text-base">{need.icon}</span>
                            {need.label_jp}
                        </Button>
                    );
                })}
            </div>

            {/* Selected Count Badge */}
            {selectedNeedIds.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {selectedNeedIds.length}件選択中
                    </Badge>
                    <span>あなたに合ったカフェを絞り込んでいます</span>
                </div>
            )}
        </div>
    );
};
