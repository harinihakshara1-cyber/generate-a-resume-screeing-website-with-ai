// Client-side text extraction for uploaded resumes.
// Supports .txt and .pdf (via pdfjs-dist). Everything runs in the browser.
import * as pdfjs from 'pdfjs-dist';
// Inline the pdf.js worker as a bundled blob so there are no external asset
// requests — this keeps the single-file preview fully self-contained.
import PdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?worker&inline';

pdfjs.GlobalWorkerOptions.workerPort = new PdfWorker();

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf') || file.type === 'application/pdf') {
    return extractPdf(file);
  }
  // txt, md, and other plain text files.
  return file.text();
}

async function extractPdf(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let out = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let lastY: number | null = null;
    for (const item of content.items as Array<{ str: string; transform: number[] }>) {
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 3) out += '\n';
      out += item.str + ' ';
      lastY = y;
    }
    out += '\n\n';
  }
  await doc.cleanup();
  return out.replace(/[ \t]+/g, ' ').trim();
}
