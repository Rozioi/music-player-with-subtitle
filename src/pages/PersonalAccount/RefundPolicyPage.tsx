import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import InfoPage from "../../shared/ui/InfoPage/InfoPage";

/**
 * Resolve markdown asset URLs at runtime instead of using static imports.
 * Static `import x from './file.md'` can cause TS2307 when there are no
 * module declarations for `.md` files. Using `new URL(..., import.meta.url)`
 * yields a string URL that works with `fetch` and avoids the module resolution error.
 */

interface InfoItem {
  title: string;
  file: string;
}

const RefundPolicyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<string>("Загрузка...");
  const [title, setTitle] = useState<string>("");

  // Use new URL(...) to get the resolved path to the asset at build time.
  const pages: Record<string, InfoItem> = {
    refund: {
      title: "Условия Возврата",
      file: new URL("../../shared/assets/files/refund.md", import.meta.url)
        .href,
    },
    payment: {
      title: "Процедура Оплаты",
      file: new URL("../../shared/assets/files/payment.md", import.meta.url)
        .href,
    },
    connection: {
      title: "Обратная связь",
      file: new URL("../../shared/assets/files/connection.md", import.meta.url)
        .href,
    },
  };

  useEffect(() => {
    const page = pages[slug || "refund"];
    if (!page) return;

    setTitle(page.title);

    fetch(page.file)
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch(() => setContent("Ошибка загрузки файла 😔"));
  }, [slug]);

  return <InfoPage title={title} content={content} />;
};

export default RefundPolicyPage;
