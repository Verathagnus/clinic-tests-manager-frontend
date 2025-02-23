import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface PdfViewerProps {
  pdfUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

const PdfViewer = ({ pdfUrl, isOpen, onClose }: PdfViewerProps) => {
  const [modalWidth, setModalWidth] = useState<number>(0);

  useEffect(() => {
    const updateModalWidth = () => {
      const width = window.innerWidth - 40; // 20px on each side
      setModalWidth(width);
    };

    if (isOpen) {
      updateModalWidth(); // Set initial width
      window.addEventListener('resize', updateModalWidth); // Update on resize
    }

    return () => {
      window.removeEventListener('resize', updateModalWidth); // Cleanup
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div
        className="bg-white rounded-lg shadow-lg p-4 max-h-[90vh] overflow-auto"
        style={{ width: `${modalWidth}px` }}
      >
        <div className="flex justify-end mb-4">
          <Button onClick={onClose} className="bg-red-500 text-white">
            Close
          </Button>
        </div>
        <iframe
          src={pdfUrl}
          width="100%"
          height="600px"
          style={{ border: 'none' }}
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};

export default PdfViewer;