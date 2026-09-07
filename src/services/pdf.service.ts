import { PdfReader } from "pdfreader";

export async function extractPdfText(
  file: File
) {
  const buffer = Buffer.from(
    await file.arrayBuffer()
  );

  const text = await new Promise<string>(
    (resolve, reject) => {
      let pdfText = "";

      new PdfReader().parseBuffer(
        buffer,
        (err, item) => {
          if (err) {
            reject(err);
            return;
          }

          if (!item) {
            resolve(pdfText);
            return;
          }

          if (item.text) {
            pdfText +=
              item.text + " ";
          }
        }
      );
    }
  );

  return {
    text,
  };
}