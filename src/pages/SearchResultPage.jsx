import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import StoreListItem from "@/components/features/StoreListItem";
import FilterPanel from "@/components/features/FilterPanel";
import { useStoreData } from "@/hooks/useStoreData";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * Search Result Page - Màn hình kết quả tìm kiếm (画面No.5)
 * Hiển thị: Filter sidebar + List kết quả (5 items/page) + Pagination
 */
const SearchResultPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const timestamp = searchParams.get("t"); // Để detect khi search rỗng được submit

    const { stores } = useStoreData();

    // Filter states
    const [selectedSpaceTypes, setSelectedSpaceTypes] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [minRating, setMinRating] = useState(0);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Filtered and sorted results
    const [displayStores, setDisplayStores] = useState([]);
    const [paginatedStores, setPaginatedStores] = useState([]);

    // Reset filters khi search rỗng và có timestamp (submit search rỗng)
    useEffect(() => {
        if (!query && timestamp) {
            setSelectedSpaceTypes([]);
            setSelectedServices([]);
            setMinRating(0);
        }
    }, [query, timestamp]);

    // Update results when filters change
    useEffect(() => {
        let results = [...stores];

        // Apply search query
        if (query) {
            results = results.filter((store) =>
                store.name_jp.toLowerCase().includes(query.toLowerCase()) ||
                store.address_jp.toLowerCase().includes(query.toLowerCase()) ||
                store.description_jp?.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Apply space type filter
        if (selectedSpaceTypes.length > 0) {
            results = results.filter((store) => {
                if (store.space_type === "both") return true;
                return selectedSpaceTypes.includes(store.space_type);
            });
        }

        // Apply rating filter
        if (minRating > 0) {
            results = results.filter((store) => store.avg_rating >= minRating);
        }

        // Apply services filter
        if (selectedServices.length > 0) {
            results = results.filter((store) =>
                selectedServices.every((service) =>
                    store.services.includes(service)
                )
            );
        }

        setDisplayStores(results);
        setCurrentPage(1); // Reset to first page when filters change
    }, [query, selectedSpaceTypes, selectedServices, minRating, stores]);

    // Update paginated results when displayStores or currentPage changes
    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPaginatedStores(displayStores.slice(startIndex, endIndex));
    }, [displayStores, currentPage]);

    // Calculate total pages
    const totalPages = Math.ceil(displayStores.length / ITEMS_PER_PAGE);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 md:px-8 lg:px-12 max-w-8xl">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-coffee-dark">
                        {query ? `"${query}" の検索結果` : "カフェ一覧"}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {displayStores.length}件のカフェが見つかりました
                    </p>
                </div>

                <div className="flex gap-8">
                    {/* Filter Panel */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <FilterPanel
                            selectedSpaceTypes={selectedSpaceTypes}
                            onSpaceTypesChange={setSelectedSpaceTypes}
                            selectedServices={selectedServices}
                            onServicesChange={setSelectedServices}
                            minRating={minRating}
                            onMinRatingChange={setMinRating}
                        />
                    </aside>

                    {/* Results List */}
                    <div className="flex-1">
                        {/* Mobile Filter Button */}
                        <div className="mb-6 lg:hidden">
                            <FilterPanel
                                selectedSpaceTypes={selectedSpaceTypes}
                                onSpaceTypesChange={setSelectedSpaceTypes}
                                selectedServices={selectedServices}
                                onServicesChange={setSelectedServices}
                                minRating={minRating}
                                onMinRatingChange={setMinRating}
                            />
                        </div>

                        {paginatedStores.length > 0 ? (
                            <>
                                {/* Store List */}
                                <div className="space-y-8">
                                    {paginatedStores.map((store) => (
                                        <StoreListItem key={store.id} store={store} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>

                                                {[...Array(totalPages)].map((_, index) => {
                                                    const pageNumber = index + 1;
                                                    // Hiển thị: trang đầu, trang cuối, trang hiện tại và 2 trang xung quanh
                                                    if (
                                                        pageNumber === 1 ||
                                                        pageNumber === totalPages ||
                                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <PaginationItem key={pageNumber}>
                                                                <PaginationLink
                                                                    onClick={() => handlePageChange(pageNumber)}
                                                                    isActive={currentPage === pageNumber}
                                                                    className="cursor-pointer"
                                                                >
                                                                    {pageNumber}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        );
                                                    } else if (
                                                        pageNumber === currentPage - 2 ||
                                                        pageNumber === currentPage + 2
                                                    ) {
                                                        return (
                                                            <PaginationItem key={pageNumber}>
                                                                <PaginationEllipsis />
                                                            </PaginationItem>
                                                        );
                                                    }
                                                    return null;
                                                })}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
                                <div className="text-center">
                                    <p className="text-lg font-medium text-muted-foreground">
                                        条件に合うカフェが見つかりませんでした
                                    </p>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        フィルターを変更してもう一度お試しください
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SearchResultPage;
