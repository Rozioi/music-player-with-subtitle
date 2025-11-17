/**
 * Генерирует slug из строки (имени врача)
 * @param text - Текст для преобразования в slug
 * @returns Slug строка
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Удаляем спецсимволы
    .replace(/\s+/g, "-") // Заменяем пробелы на дефисы
    .replace(/-+/g, "-") // Убираем множественные дефисы
    .replace(/^-+|-+$/g, ""); // Убираем дефисы в начале и конце
};

/**
 * Создает slug для врача из имени и ID
 * @param name - Имя врача
 * @param id - ID врача
 * @returns Slug строка вида "имя-врача-123"
 */
export const createDoctorSlug = (name: string, id: string | number): string => {
  const nameSlug = generateSlug(name);
  return `${nameSlug}-${id}`;
};

/**
 * Извлекает ID из slug
 * @param slug - Slug строка
 * @returns ID врача или null
 */
export const extractIdFromSlug = (slug: string): string | null => {
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  // Проверяем, что последняя часть - это число
  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }
  return null;
};

