import React, { useState, useMemo, useEffect} from "react";
import { MapPin, ArrowRight, Map, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import StoreCard from "@/components/features/StoreCard";
import { useStoreData } from "@/hooks/useStoreData";
import { MOCK_FAVORITES } from "@/mocks/data/users";

/**
 * Hot Pickロジック：レーティング、レビュー数、重み付きランダムで最大5件
 */
const getHotPickStores = (stores) => {
    // 重み付きスコアを計算
    const storesWithScore = stores.map(store => {
        // レーティング × レビュー数 + ランダム要素
        const ratingScore = store.avg_rating * 20; // 最大100点
        const reviewScore = Math.min(store.review_count / 10, 50); // 最大50点
        const randomBoost = Math.random() * 30; // 最大30点のランダム
        const totalScore = ratingScore + reviewScore + randomBoost;
        
        return {
            ...store,
            hotPickScore: totalScore
        };
    });

    // スコアでソートして上位5件を取得
    return storesWithScore
        .sort((a, b) => b.hotPickScore - a.hotPickScore)
        .slice(0, 5);
};

/**
 * Near By Youロジック：距離、お気に入り、レーティングで最大5件
 * 
 * Prioritization logic:
 * 1. If logged in: Favorites get highest priority (bonus +150)
 * 2. Distance-based score (closer = higher score)
 * 3. Rating and review count
 * 
 * If not logged in: Only public scoring (distance + rating + reviews)
 */
const getNearByStores = (stores, isLoggedIn, currentUserId = null) => {
    // Get user's favorites if logged in
    const userFavoriteIds = isLoggedIn && currentUserId 
        ? MOCK_FAVORITES
            .filter(fav => fav.user_id === currentUserId)
            .map(fav => fav.store_id)
        : [];

    const storesWithScore = stores.map(store => {
        let score = 0;
        
        // 1. Distance score (closer = higher score)
        // Max 100 points for 0km, decreases by 10 per km
        const distanceScore = Math.max(0, 100 - (store.distance * 10));
        score += distanceScore;
        
        // 2. Favorite bonus (only when logged in)
        // Favorites get massive priority: +150 points
        if (isLoggedIn && userFavoriteIds.includes(store.id)) {
            score += 150;
        }
        
        // 3. Rating score (max 50 points for 5.0 rating)
        score += store.avg_rating * 10;
        
        // 4. Review count score (max 20 points)
        score += Math.min(store.review_count / 5, 20);
        
        return {
            ...store,
            nearByScore: score,
            isFavorite: isLoggedIn && userFavoriteIds.includes(store.id)
        };
    });

    // Sort by score and return top 5
    return storesWithScore
        .sort((a, b) => b.nearByScore - a.nearByScore)
        .slice(0, 5);
};

/**
 * Home Page - ホーム画面
 * Hot Pick + Near by you + All list を表示
 */
const HomePage = () => {
    const { stores } = useStoreData();
    const [currentHotPick, setCurrentHotPick] = useState(0);
    
    // ログイン状態を仮定（実際のアプリではuseAuthなどから取得）
    // 本番では useAuth() hook などから取得
    const isLoggedIn = true; // Mock: ログイン中と仮定
    const currentUserId = 1; // Mock: User ID 1

    // Hot Pick計算（メモ化）
    const hotPickStores = useMemo(() => getHotPickStores(stores), [stores]);

    //  Auto slide every 3s
    useEffect(() => {
        if (!hotPickStores || hotPickStores.length === 0) return;

        const interval = setInterval(() => {
            setCurrentHotPick((prev) => (prev + 1) % hotPickStores.length);
        }, 3000); // 3s

        return () => clearInterval(interval); // cleanup khi unmount
    }, [hotPickStores]);

    // Near By You計算（メモ化）
    // Pass currentUserId so we can filter favorites properly
    const nearbyStores = useMemo(() => 
        getNearByStores(stores, isLoggedIn, currentUserId), 
        [stores, isLoggedIn, currentUserId]
    );

    // Get user favorites for "All List" section
    const userFavoriteIds = isLoggedIn && currentUserId 
        ? MOCK_FAVORITES
            .filter(fav => fav.user_id === currentUserId)
            .map(fav => fav.store_id)
        : [];

    // Hot Pickナビゲーション
    const nextHotPick = () => {
        setCurrentHotPick((prev) => (prev + 1) % hotPickStores.length);
    };

    const prevHotPick = () => {
        setCurrentHotPick((prev) =>
            prev === 0 ? hotPickStores.length - 1 : prev - 1
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 md:px-8 lg:px-12 max-w-7xl">
                {/* Hot Pick Section */}
                <section className="mb-12">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-coffee-dark">
                            おすすめ
                        </h2>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={prevHotPick}
                                className="h-8 w-8"
                                aria-label="前へ"
                            >
                                ←
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={nextHotPick}
                                className="h-8 w-8"
                                aria-label="次へ"
                            >
                                →
                            </Button>
                        </div>
                    </div>

                    {hotPickStores[currentHotPick] && (
                        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Images Grid */}
                                <div className="grid grid-cols-2 gap-2 p-4">
                                    {hotPickStores[currentHotPick].images.slice(0, 3).map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={`overflow-hidden rounded-lg ${
                                                idx === 0 ? "col-span-2 aspect-video" : "aspect-square"
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${hotPickStores[currentHotPick].name_jp} ${idx + 1}`}
                                                className="h-full w-full object-cover transition-transform hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Info */}
                                <CardContent className="flex flex-col justify-center p-6">
                                    <div className="mb-2">
                                        <span className="inline-block px-3 py-1 text-xs font-semibold text-amber-700 bg-amber-100 rounded-full">
                                            カフェ
                                        </span>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold">
                                        {hotPickStores[currentHotPick].name_jp}
                                    </h3>
                                    <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                                        {hotPickStores[currentHotPick].description_jp}
                                    </p>
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="flex items-center">
                                            <span className="text-lg font-bold text-amber-600">
                                                ★ {hotPickStores[currentHotPick].avg_rating}
                                            </span>
                                            <span className="ml-2 text-sm text-muted-foreground">
                                                ({hotPickStores[currentHotPick].review_count}件)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        <span className="line-clamp-1">
                                            {hotPickStores[currentHotPick].address_jp}
                                        </span>
                                        <span className="ml-auto text-xs font-medium">
                                            {hotPickStores[currentHotPick].distance}km
                                        </span>
                                    </div>
                                    <Link to={`/store/${hotPickStores[currentHotPick].id}`}>
                                        <Button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700">
                                            詳細を見る
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </div>
                        </Card>
                    )}

                    {/* Hot Pick indicators */}
                    <div className="mt-4 flex justify-center gap-2">
                        {hotPickStores.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentHotPick(idx)}
                                className={`h-2 rounded-full transition-all ${
                                    idx === currentHotPick 
                                        ? "w-8 bg-amber-600" 
                                        : "w-2 bg-gray-300 hover:bg-gray-400"
                                }`}
                                aria-label={`スライド ${idx + 1} へ移動`}
                            />
                        ))}
                    </div>
                </section>

                {/* Near by you Section */}
                <section className="mb-12">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-coffee-dark">
                                近くのカフェ
                            </h2>
                            {isLoggedIn && nearbyStores.some(s => s.isFavorite) && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    お気に入りを優先表示しています
                                </p>
                            )}
                        </div>
                        <Link to="/map">
                            <Button variant="outline" className="gap-2">
                                <Map className="h-4 w-4" />
                                地図で見る
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {nearbyStores.map((store) => (
                            <Link 
                                key={store.id} 
                                to={`/store/${store.id}`}
                                className="block"
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="flex gap-4 p-4">
                                        {/* Image */}
                                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={store.images[0]}
                                                alt={store.name_jp}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-lg mb-2 truncate">
                                                    {store.name_jp}
                                                </h3>
                                                {store.isFavorite ? (
                                                    <Heart className="h-5 w-5 flex-shrink-0 fill-red-500 text-red-500" />
                                                ) : (
                                                    <Heart className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                <span className="text-amber-600 font-bold">
                                                    ★ {store.avg_rating}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">{store.distance}km</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* All List Section */}
                <section>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-coffee-dark">
                            すべてのカフェ
                        </h2>
                        <Link to="/search">
                            <Button variant="outline" className="gap-2">
                                もっと見る
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {stores.slice(0, 8).map((store) => (
                            <Link 
                                key={store.id} 
                                to={`/store/${store.id}`}
                                className="block"
                            >
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="flex gap-4 p-4">
                                        {/* Image */}
                                        <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={store.images[0]}
                                                alt={store.name_jp}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <h3 className="font-bold text-xl mb-3">
                                                    {store.name_jp}
                                                </h3>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                        <span className="text-muted-foreground truncate">
                                                            {store.address_jp}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-muted-foreground">⏰</span>
                                                            <span className="text-muted-foreground">
                                                                {store.opening_hours_jp}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-muted-foreground">☕</span>
                                                            <span className="text-muted-foreground">
                                                                カフェ
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-amber-600 font-bold text-lg">
                                                        ★ {store.avg_rating}
                                                    </span>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-coffee-dark flex items-center justify-center">
                                                    <ArrowRight className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {stores.length > 8 && (
                        <div className="mt-8 text-center">
                            <Link to="/search">
                                <Button size="lg" variant="outline" className="gap-2">
                                    さらに表示する ({stores.length - 8}件)
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default HomePage;