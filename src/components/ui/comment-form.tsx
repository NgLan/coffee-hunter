// CommentForm.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Camera, Video, Plus } from "lucide-react";

import React from "react";

interface CommentFormProps {
  reviewRating: number;
  setReviewRating: (value: number) => void;
  reviewComment: string;
  setReviewComment: (value: string) => void;
  onSubmit: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  onSubmit,
}) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h3 className="mb-4 text-xl font-semibold">レビューを投稿する</h3>

        {/* 星評価 + 画像/動画アイコン */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                onClick={() => setReviewRating(i + 1)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    i < reviewRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Camera + Video */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Camera className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Video className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* コメント入力 */}
        <Textarea
          placeholder="コメント"
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          className="mb-4 min-h-[100px]"
        />

        {/* 写真アップロードボックス */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">写真を追加</p>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <button
                key={i}
                className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
              >
                <Plus className="h-8 w-8 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        <Button className="w-full" onClick={onSubmit}>
          レビューを投稿
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommentForm;
