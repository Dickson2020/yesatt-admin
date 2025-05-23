
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaginationData } from '@/types';

interface PaginationControlsProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages } = pagination;
  
  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5; // Show at most 5 page numbers
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-4">
      <div className="-mt-px flex w-0 flex-1">
        <Button
          variant="ghost"
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
      </div>
      
      <div className="hidden md:-mt-px md:flex">
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "ghost"}
            onClick={() => onPageChange(page)}
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium
              ${page === currentPage ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
          >
            {page}
          </Button>
        ))}
      </div>
      
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <Button
          variant="ghost"
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium"
        >
          Next
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
};

export default PaginationControls;
