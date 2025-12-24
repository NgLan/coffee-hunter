import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

const NotificationPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { notifications, toggleStar, markAsRead } = useNotifications();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleNotificationClick = (id: number) => {
        markAsRead(id);
        // Toggle expand/collapse
        setExpandedId(expandedId === id ? null : id);
    };

    const handleStarClick = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        toggleStar(id);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return formatDistanceToNow(date, { addSuffix: true, locale: ja });
        } else if (diffInHours < 48) {
            return '1日前';
        } else {
            const days = Math.floor(diffInHours / 24);
            return `${days}日前`;
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Card className="p-8 text-center">
                        <h2 className="text-2xl font-bold text-coffee-dark mb-4">
                            ログインが必要です
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            通知を表示するにはログインしてください
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
                        >
                            ログインページへ
                        </button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-coffee-dark">通知</h1>
                    <p className="text-muted-foreground mt-2">
                        全ての通知を確認できます
                    </p>
                </div>

                <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="space-y-3">
                        {notifications.length === 0 ? (
                            <Card className="p-8 text-center">
                                <p className="text-muted-foreground">通知はありません</p>
                            </Card>
                        ) : (
                            notifications.map((notification) => {
                                const isExpanded = expandedId === notification.id;
                                return (
                                    <div key={notification.id}>
                                        <Card
                                            className={`cursor-pointer transition-all hover:shadow-md ${
                                                !notification.is_read
                                                    ? 'bg-amber-50 border-amber-200'
                                                    : 'bg-white'
                                            }`}
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            <div className="p-4">
                                                <div className="flex items-start gap-3">
                                                    {/* Star Icon */}
                                                    <button
                                                        onClick={(e) => handleStarClick(e, notification.id)}
                                                        className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
                                                    >
                                                        <Star
                                                            className={`h-5 w-5 ${
                                                                notification.is_starred
                                                                    ? 'fill-amber-500 text-amber-500'
                                                                    : 'text-gray-400'
                                                            }`}
                                                        />
                                                    </button>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h3
                                                                className={`font-medium text-base ${
                                                                    !notification.is_read
                                                                        ? 'text-coffee-dark'
                                                                        : 'text-gray-700'
                                                                }`}
                                                            >
                                                                {notification.title_jp}
                                                            </h3>
                                                            <span className="text-xs text-muted-foreground whitespace-nowrap px-2 py-1 bg-gray-100 rounded">
                                                                {formatTime(notification.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        {/* Expanded Content Below */}
                                        {isExpanded && (
                                            <div className="relative mt-1">
                                                {/* Arrow pointing up - on the far left edge of box */}
                                                <div className="absolute left-4 -top-3 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-gray-300"></div>
                                                <div className="absolute left-4 -top-[10px] w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-white"></div>
                                                
                                                <div className="bg-white border border-gray-300 rounded-lg p-3">
                                                    <p className="text-sm text-gray-700">
                                                        {notification.content_jp}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default NotificationPage;
