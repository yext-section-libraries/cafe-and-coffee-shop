import { resolveTextStyles } from "./typography";
import type { CSSProperties } from "react";
import type { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  getDefaultRTF,
  getThemeColorCssValue,
  resolveComponentData,
  type StreamDocument,
  type StyledButtonValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type YextEntityField,
} from "@yext/visual-editor";

export const defaultTextStyles: StyledTextValue = {
  fontFamily: "default",
  fontSize: "default",
  fontWeight: "default",
  fontStyle: "default",
  textTransform: "default",
};

export const defaultButtonStyles: StyledButtonValue = {
  ...defaultTextStyles,
  borderRadius: "default",
  letterSpacing: "default",
};

export const createTranslatableString = (
  value: string,
): TranslatableString => ({
  defaultValue: value,
  hasLocalizedValue: "true",
});

export const createTextField = (
  value: string,
  field = "",
  constantValueEnabled = field.length === 0,
): YextEntityField<TranslatableString> => ({
  field,
  constantValue: createTranslatableString(value),
  constantValueEnabled,
});

export const createRtfField = (
  value: string,
  field = "",
  constantValueEnabled = field.length === 0,
): YextEntityField<TranslatableRichText> => ({
  field,
  constantValue: {
    defaultValue: getDefaultRTF(value),
    hasLocalizedValue: "true",
  },
  constantValueEnabled,
});

export const resolveTranslatableStringValue = (
  value: TranslatableString | undefined,
  locale: string,
  streamDocument: StreamDocument | Record<string, unknown> | undefined,
  fallback = "",
): string =>
  value
    ? resolveComponentData(value, locale, streamDocument)?.trim() || fallback
    : fallback;

export const resolveTextFieldValue = (
  field: YextEntityField<TranslatableString>,
  locale: string,
  streamDocument: StreamDocument | Record<string, unknown> | undefined,
  fallback = "",
): string =>
  resolveComponentData(field, locale, streamDocument)?.trim() ||
  resolveTranslatableStringValue(
    field.constantValue,
    locale,
    streamDocument,
    fallback,
  ).trim();

export const getStyleValue = (value?: string): string | undefined =>
  !value || value === "default" ? undefined : value;

export const getStyledTextStyle = (
  styles?: Partial<StyledTextValue>,
  color?: ThemeColor | string,
  fallbackColor?: string,
): CSSProperties => ({
  color: getThemeColorCssValue(color) ?? fallbackColor,
  ...resolveTextStyles(styles),
});

export const hasImageSource = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
): image is ImageType | ComplexImageType | TranslatableAssetImage => {
  if (!image || typeof image !== "object") {
    return false;
  }

  if ("url" in image && typeof image.url === "string") {
    return image.url.trim().length > 0;
  }

  return Boolean(
    "image" in image &&
      image.image &&
      typeof image.image === "object" &&
      "url" in image.image &&
      typeof image.image.url === "string" &&
      image.image.url.trim(),
  );
};

export const hasExplicitCtaColor = (cta: {
  styles?: { color?: ThemeColor };
}): boolean => {
  const selectedColor = cta.styles?.color?.selectedColor;
  return Boolean(selectedColor && selectedColor !== "default");
};

export type ReviewAggregateRating = {
  averageRating: number;
  reviewCount: number;
};

export const getValueAtPath = (value: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((current, part) => {
    if (current == null) {
      return undefined;
    }
    if (Array.isArray(current)) {
      const index = Number(part);
      return Number.isInteger(index) ? current[index] : undefined;
    }
    return typeof current === "object"
      ? current[part as keyof typeof current]
      : undefined;
  }, value);

export const getFirstPartyReviewsAggregate = (
  streamDocument: StreamDocument | undefined,
): Record<string, unknown> | null => {
  const aggregates = getValueAtPath(streamDocument, "ref_reviewsAgg");
  if (!Array.isArray(aggregates)) {
    return null;
  }

  const match = aggregates.find(
    (item) =>
      item &&
      typeof item === "object" &&
      getValueAtPath(item, "publisher") === "FIRSTPARTY",
  );
  return match && typeof match === "object"
    ? (match as Record<string, unknown>)
    : null;
};

export const getFirstPartyAggregateRating = (
  streamDocument: StreamDocument | undefined,
): ReviewAggregateRating | null => {
  const aggregate = getFirstPartyReviewsAggregate(streamDocument);
  const toFiniteNumber = (value: unknown) => {
    const number =
      typeof value === "number"
        ? value
        : typeof value === "string"
          ? Number.parseFloat(value)
          : Number.NaN;
    return Number.isFinite(number) ? number : null;
  };
  const averageRating = toFiniteNumber(aggregate?.averageRating);
  const reviewCount = toFiniteNumber(aggregate?.reviewCount);

  return averageRating == null || reviewCount == null
    ? null
    : { averageRating, reviewCount };
};
