import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { SetStateAction } from 'react';
import { Button } from './ui/button';

const PaginationComponent = ({ page, setPage, totalPages }: { page: number, setPage: (value: SetStateAction<number>) => void, totalPages: number }) => {
    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    {page !== 1 ? <PaginationPrevious className="cursor-pointer" onClick={() => setPage((oldPage) => (oldPage - 1))}>
                        <Button
                            variant="outline"
                        >
                            Previous
                        </Button>
                    </PaginationPrevious> : <PaginationPrevious className="cursor-not-allowed">
                        <Button
                            variant="outline"
                        >
                            Previous
                        </Button>
                    </PaginationPrevious>}
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                        <PaginationLink className="cursor-pointer"
                            isActive={page === i + 1}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                <PaginationItem>
                    {page === totalPages ? <PaginationNext className="cursor-not-allowed">
                        <Button
                            variant="outline"
                        >
                            Next
                        </Button>
                    </PaginationNext> : <PaginationNext className="cursor-pointer" onClick={() => setPage((oldPage) => {
                                return (oldPage + 1)
                            })}>
                        <Button
                            variant="outline"
                        >
                            Next
                        </Button>
                    </PaginationNext>}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationComponent;