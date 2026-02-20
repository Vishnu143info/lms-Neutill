import { useEffect, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import worker from "pdfjs-dist/build/pdf.worker.min?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = worker;

const FlipbookReader = ({ pdfUrl }) => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (!pdfUrl) return;

    const loadPDF = async () => {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
      const images = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        images.push(canvas.toDataURL());
      }

      setPages(images);
    };

    loadPDF();
  }, [pdfUrl]);

  if (!pages.length) return <p className="text-center p-6">Loading magazine...</p>;

  return (
    <div className="flex justify-center p-4 bg-gray-900">
      <HTMLFlipBook width={400} height={600}>
        {pages.map((src, i) => (
          <div key={i} className="bg-white">
            <img src={src} alt={`page-${i}`} />
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default FlipbookReader;
