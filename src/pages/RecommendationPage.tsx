import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Bot, User, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import StoreListItem from "@/components/features/StoreListItem";
import { useStoreData } from "@/hooks/useStoreData";
import { extractTagsFromText, getRecommendations, USER_NEEDS } from "@/utils/recommendation";
import { analyzeRequestWithAI } from "@/services/aiService";
import type { StoreDetail } from "@/types/store";

// Message type
interface Message {
    id: string;
    role: "user" | "bot";
    text: string;
    stores?: StoreDetail[];
    tags?: string[];
    timestamp: Date;
}

const RecommendationPage: React.FC = () => {
    const { stores } = useStoreData();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "bot",
            text: "こんにちは！🎉 カフェハンターのAIアシスタントです。\n\nどんなカフェをお探しですか？例えば：\n• 「勉強できる静かなカフェ」\n• 「デートにぴったりな場所」\n• 「朝ごはんが食べられるカフェ」\n\nお気軽にどうぞ 😊",
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            text: inputText,
            timestamp: new Date(),
        };

        const userInput = inputText; // Save before clearing
        setMessages((prev) => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        try {
            // 🚀 AIを使用してタグを抽出（非同期）
            const extractedTags = await analyzeRequestWithAI(userInput);

            // AIが空を返した場合はキーワードマッチングにフォールバック
            const finalTags = extractedTags.length > 0
                ? extractedTags
                : extractTagsFromText(userInput);

            let botResponse: Message;

            if (finalTags.length === 0) {
                // タグが見つからない場合
                botResponse = {
                    id: `bot-${Date.now()}`,
                    role: "bot",
                    text: "申し訳ございません。ご要望を理解できませんでした。😅\n\nもう少し具体的に教えていただけますか？\n例：「静かな場所で勉強したい」「友達と集まれるカフェ」など",
                    timestamp: new Date(),
                };
            } else {
                // タグに基づいてレコメンデーションを取得
                const recommendedStores = getRecommendations(stores, finalTags);

                // ボットレスポンステキストを構築
                const needLabels = finalTags
                    .map((tagId) => {
                        const need = USER_NEEDS.find((n) => n.id === tagId);
                        return need ? need.label_jp : tagId;
                    })
                    .join('、');

                let responseText = "";
                if (recommendedStores.length > 0) {
                    responseText = `素敵ですね！ご希望に合うカフェが${recommendedStores.length}件見つかりました 🎉\n\nあなたのお探しの雰囲気（${needLabels}）にぴったりなお店です：`;
                } else {
                    responseText = `申し訳ございません。「${needLabels}」に合うカフェが見つかりませんでした。😢\n\n別の条件で試してみてください。`;
                }

                botResponse = {
                    id: `bot-${Date.now()}`,
                    role: "bot",
                    text: responseText,
                    stores: recommendedStores.slice(0, 10), // 最大10件
                    tags: finalTags,
                    timestamp: new Date(),
                };
            }

            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            console.error("メッセージ処理エラー:", error);

            // エラーフォールバック
            const errorResponse: Message = {
                id: `bot-${Date.now()}`,
                role: "bot",
                text: "申し訳ございません。エラーが発生しました。😓\n\nもう一度お試しください。",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-b from-amber-50 to-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-2">
                                <Bot className="h-6 w-6 text-amber-700" />
                                <h1 className="text-xl font-bold text-gray-900">
                                    AIレコメンド
                                </h1>
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Beta
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pb-4">
                <div className="container mx-auto px-4 py-6 max-w-4xl">
                    <div className="space-y-6">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {message.role === "bot" && (
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                            <Bot className="h-5 w-5 text-amber-700" />
                                        </div>
                                    </div>
                                )}

                                <div
                                    className={`flex flex-col gap-2 max-w-[80%] ${message.role === "user" ? "items-end" : "items-start"
                                        }`}
                                >
                                    {/* Message Bubble */}
                                    <div
                                        className={`rounded-2xl px-4 py-3 ${message.role === "user"
                                            ? "bg-amber-700 text-white"
                                            : "bg-white border shadow-sm"
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-line leading-relaxed">
                                            {message.text}
                                        </p>
                                    </div>

                                    {/* Tags (if any) */}
                                    {message.tags && message.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {message.tags.map((tagId) => {
                                                const need = USER_NEEDS.find((n) => n.id === tagId);
                                                return need ? (
                                                    <Badge
                                                        key={tagId}
                                                        variant="secondary"
                                                        className="text-xs bg-amber-50 text-amber-800 border-amber-200"
                                                    >
                                                        {need.icon} {need.label_jp}
                                                    </Badge>
                                                ) : null;
                                            })}
                                        </div>
                                    )}

                                    {/* Store Results */}
                                    {message.stores && message.stores.length > 0 && (
                                        <div className="w-full space-y-3 mt-2">
                                            {message.stores.map((store) => (
                                                <StoreListItem key={store.id} store={store} />
                                            ))}
                                        </div>
                                    )}

                                    {/* Timestamp */}
                                    <span className="text-xs text-gray-400 px-1">
                                        {message.timestamp.toLocaleTimeString("ja-JP", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>

                                {message.role === "user" && (
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="h-5 w-5 text-gray-600" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex gap-3 justify-start">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                        <Bot className="h-5 w-5 text-amber-700" />
                                    </div>
                                </div>
                                <div className="bg-white border rounded-2xl px-4 py-3 shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            {/* Input Bar */}
            <div className="sticky bottom-0 bg-white border-t shadow-lg">
                <div className="container mx-auto px-4 py-4 max-w-4xl">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            placeholder="どんなカフェをお探しですか？"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-1 rounded-full border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                            disabled={isTyping}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim() || isTyping}
                            className="rounded-full bg-amber-700 hover:bg-amber-600 px-6"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        例: 「お腹が空いた」「静かに勉強したい」「デートできる場所」
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecommendationPage;
