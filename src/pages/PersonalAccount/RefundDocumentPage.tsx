import React from "react";
import { useParams } from "react-router";
import PdfViewer from "../../shared/ui/InfoPage/InfoPage";

interface InfoItem {
  title: string;
  file: string;
}

type DocumentSlug =
  | "terms"
  | "privacy"
  | "offer"
  | "paymentProc"
  | "contacts"
  | "delivery";

const RefundDocumentPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const pages: Record<DocumentSlug, InfoItem> = {
    terms: {
      title: "Пользовательское соглашение",
      file: "terms.pdf",
    },
    privacy: {
      title: "Политика конфиденциальности",
      file: "privacy.pdf",
    },
    offer: {
      title: "Публичная оферта",
      file: "public-offer-agreement.pdf",
    },
    paymentProc: {
      title: "Процедура оплаты",
      file: "payment-procedure.pdf",
    },
    contacts: {
      title: "Контакты",
      file: "contacts.pdf",
    },
    delivery: {
      title: "Доставка услуги",
      file: "delivery-methods.pdf",
    },
  };

  const isValidSlug = (s: string): s is DocumentSlug => {
    return s in pages;
  };

  const currentSlug = slug && isValidSlug(slug) ? slug : "terms";
  const page = pages[currentSlug];

  const pdfBaseUrl =
    import.meta.env.VITE_PDF_BASE_URL ||
    "https://famously-sumptuous-diamondback.cloudpub.ru/uploads/pdfs/";
  const normalizeUrl = (base: string, file: string) => {
    const baseClean = base.endsWith("/") ? base : `${base}/`;
    const fileClean = file.startsWith("/") ? file.slice(1) : file;
    return `${baseClean}${encodeURIComponent(fileClean)}`;
  };

  const fileUrl = normalizeUrl(pdfBaseUrl, page.file);

  return <PdfViewer fileUrl={fileUrl} title={page.title} />;
};

export default RefundDocumentPage;
