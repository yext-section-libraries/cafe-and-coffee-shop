import type { StyledTextValue } from "@yext/visual-editor";
import { TypographyScope, resolveTextStyles } from "../shared/typography";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  msg,
  Background,
  EntityField,
  getAnalyticsScopeHash,
  getAggregateRating,
  getSurfaceColorStyle,
  getThemeColorCssValue as toThemeCss,
  type StreamDocument,
  type ThemeColor,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  createTextField,
  defaultTextStyles,
  getFirstPartyAggregateRating,
  getFirstPartyReviewsAggregate,
  getValueAtPath,
  resolveTextFieldValue,
} from "../shared/sectionHelpers";

type ReviewCardData = {
  authorName: string;
  rating: string;
  reviewDate: string;
  content: string;
};

export type CafeAndCoffeeShopReviewsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor: ThemeColor | undefined;
  };
  content: {
    rating: {
      showStarsLabel: boolean;
    };
    subheading: {
      text: YextEntityField<TranslatableString>;
      styles: StyledTextValue;
      fontColor: ThemeColor | undefined;
    };
  };
};

const REVIEW_TOP_REVIEWS_FIELD_PATH = "ref_reviewsAgg.topReviews";

const CafeAndCoffeeShopStyles = String.raw`
#reviews-section,
#reviews-section * {
  box-sizing: border-box;
}

#reviews-section {
  padding: clamp(2.5rem, 4vw, 3.75rem) 0;
  background: var(--cr-reviews-bg, #4d3726);
}

#reviews-section .reviews__wrap {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 40px;
}

#reviews-section .reviews__heading {
  margin: 0 0 2rem;
  color: var(--cr-reviews-heading, #ffffff);
  text-align: center;
}

#reviews-section .reviews__summary {
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

#reviews-section .reviews__summary-main,
#reviews-section .reviews__summary-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

#reviews-section .reviews__summary > *,
#reviews-section .reviews__summary-main > *,
#reviews-section .reviews__summary-meta > * {
  margin: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

#reviews-section .reviews__score {
  display: inline-flex;
  align-items: center;
}

#reviews-section .reviews__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 !important;
  margin-top: 0 !important;
  padding: 0 !important;
}

#reviews-section .reviews__stars {
  display: inline-flex;
  align-items: center;
  margin: 0 !important;
  padding: 0 !important;
  gap: 2px;
}

#reviews-section .reviews__stars > span {
  display: inline-flex;
  align-items: center;
}

#reviews-section .reviews__count,
#reviews-section .reviews__divider {
  display: inline-flex;
  align-items: center;
  margin: 0 !important;
  padding: 0 !important;
  opacity: 1;
}

#reviews-section .reviews__recent {
  margin: 0 0 1.5rem;
  text-align: center;
}

#reviews-section .reviews__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
}

#reviews-section .review-card {
  border: 0;
  border-radius: 20px;
  padding: clamp(1.5rem, 2.1vw, 1.9rem);
  display: grid;
  align-content: start;
  gap: 0;
  min-height: 100%;
}

#reviews-section .review-card__head {
  margin: 0 0 12px;
}

#reviews-section .review-card__head h3 {
  margin: 0;
}

#reviews-section .review-card__meta {
  display: grid;
  gap: 8px;
  margin-bottom: 14px;
}

#reviews-section .review-card__rating {
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.28rem;
  opacity: 1;
}

#reviews-section .review-card__score {
  display: inline-flex;
  align-items: center;
}

#reviews-section .review-card__stars {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

#reviews-section .review-card__stars > span {
  display: inline-flex;
  align-items: center;
}

#reviews-section .review-card__date {
  display: block;
  margin: 0;
  opacity: 0.9;
}

#reviews-section .review-card__text {
  margin: 0;
  opacity: 1;
}

@media (max-width: 1023px) {
  #reviews-section .reviews__wrap {
    padding-inline: 30px;
  }

  #reviews-section .reviews__grid {
    grid-template-columns: 1fr 1fr;
  }

  #reviews-section .review-card {
    padding: 1.45rem;
  }

  #reviews-section .review-card__head {
    margin-bottom: 12px;
  }

  #reviews-section .review-card__meta {
    gap: 8px;
    margin-bottom: 14px;
  }

  #reviews-section .reviews__heading,
  #reviews-section .reviews__recent,
  #reviews-section .reviews__summary {
    text-align: left;
    justify-content: flex-start;
  }
}

@media (max-width: 700px) {
  #reviews-section .reviews__wrap {
    padding-inline: 14px;
  }

  #reviews-section .reviews__grid {
    grid-template-columns: 1fr;
  }

  #reviews-section .reviews__summary {
    flex-wrap: wrap;
    gap: 10px;
  }

  #reviews-section .review-card {
    padding: 1.35rem;
    gap: 0.9rem;
  }

  #reviews-section .review-card__head {
    margin-bottom: 10px;
  }

  #reviews-section .review-card__meta {
    gap: 7px;
    margin-bottom: 12px;
  }
}`;

const formatReviewCountLabel = (value: string) => {
  const numericValue = Number.parseInt(value, 10);
  if (!Number.isFinite(numericValue)) {
    return value.trim();
  }
  return `${numericValue} ${numericValue === 1 ? "Review" : "Reviews"}`;
};

const getFilledStars = (rating: string) => {
  const numericRating = Number.parseFloat(rating);
  if (!Number.isFinite(numericRating)) {
    return 0;
  }
  return Math.max(0, Math.min(5, Math.floor(numericRating)));
};

const formatReviewDate = (value: unknown) => {
  if (value == null) {
    return "";
  }

  const date =
    typeof value === "number"
      ? new Date(value)
      : typeof value === "string" && value.trim().length > 0
        ? new Date(value)
        : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${month}/${day}/${year}`;
};

const toRenderableText = (value: unknown, fallback = "") => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    if ("text" in (value as Record<string, unknown>)) {
      const text = (value as Record<string, unknown>).text;
      if (typeof text === "string" || typeof text === "number") {
        return String(text);
      }
    }

    if ("defaultValue" in (value as Record<string, unknown>)) {
      const defaultValue = (value as Record<string, unknown>).defaultValue;
      if (
        typeof defaultValue === "string" ||
        typeof defaultValue === "number"
      ) {
        return String(defaultValue);
      }
    }
  }

  return fallback;
};

const normalizeFirstPartyReview = (value: unknown): ReviewCardData | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const content = toRenderableText(record.content).trim();

  if (!content) {
    return null;
  }

  return {
    authorName: toRenderableText(record.authorName).trim(),
    rating: toRenderableText(record.rating).trim(),
    reviewDate: formatReviewDate(record.reviewDate),
    content,
  };
};

const getFirstPartyTopReviews = (
  streamDocument: StreamDocument | undefined,
) => {
  const firstPartyAggregate = getFirstPartyReviewsAggregate(streamDocument);
  const aggregateTopReviews = getValueAtPath(firstPartyAggregate, "topReviews");
  const directTopReviews = getValueAtPath(
    streamDocument,
    REVIEW_TOP_REVIEWS_FIELD_PATH,
  );

  const topReviews = Array.isArray(aggregateTopReviews)
    ? aggregateTopReviews
    : Array.isArray(directTopReviews)
      ? directTopReviews.filter((item) => {
          return (
            item &&
            typeof item === "object" &&
            getValueAtPath(item, "publisher") === "FIRSTPARTY"
          );
        })
      : [];

  return topReviews
    .map((item) => normalizeFirstPartyReview(item))
    .filter((item): item is ReviewCardData => Boolean(item?.content.trim()))
    .slice(0, 4);
};

export const CafeAndCoffeeShopReviewsFields: YextFields<CafeAndCoffeeShopReviewsProps> =
  {
    section: {
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
      },
    },
    heading: {
      label: msg("fields.heading", "Heading"),
      type: "object",
      objectFields: {
        text: {
          label: msg("fields.heading", "Heading"),
          type: "entityField",
          filter: {
            includeListsOnly: false,
            types: ["type.string" as const],
          },
          disableConstantValueToggle: false,
        },
        styles: {
          label: msg("fields.textStyles", "Text Styles"),
          type: "styledText",
        },
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    content: {
      label: msg("fields.content", "Content"),
      type: "object",
      objectFields: {
        rating: {
          label: msg("fields.reviewRating", "Review Rating"),
          type: "object",
          objectFields: {
            showStarsLabel: {
              label: msg("fields.showStarsLabel", "Show Stars Label"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
          },
        },
        subheading: {
          label: msg("fields.subheading", "Subheading"),
          type: "object",
          objectFields: {
            text: {
              label: msg("fields.text", "Text"),
              type: "entityField",
              filter: {
                includeListsOnly: false,
                types: ["type.string" as const],
              },
              disableConstantValueToggle: false,
            },
            styles: {
              label: msg("fields.textStyles", "Text Styles"),
              type: "styledText",
            },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
  };

const CafeAndCoffeeShopReviewsDefaultProps: CafeAndCoffeeShopReviewsProps = {
  section: {
    backgroundColor: {
      selectedColor: "palette-secondary",
      contrastingColor: "palette-secondary-contrast",
    },
    visibleOnLivePage: true,
  },
  heading: {
    text: createTextField("Reviews"),
    styles: defaultTextStyles,
    fontColor: undefined,
  },
  content: {
    rating: {
      showStarsLabel: true,
    },
    subheading: {
      text: createTextField(""),
      styles: defaultTextStyles,
      fontColor: undefined,
    },
  },
};

const CafeAndCoffeeShopReviewsComponent = (
  props: CafeAndCoffeeShopReviewsProps & {
    id?: string;
    puck?: {
      isEditing?: boolean;
    };
  },
) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocument>();
  const locale = i18n.language;
  const sectionStyle =
    getSurfaceColorStyle(props.section.backgroundColor, streamDocument) ?? {};
  const entityReviews = getFirstPartyTopReviews(streamDocument);
  const hasEntityReviews = entityReviews.length > 0;
  const aggregateRating =
    getFirstPartyAggregateRating(streamDocument) ??
    getAggregateRating(streamDocument);
  const hasAggregateReviews = aggregateRating.reviewCount > 0;
  const isPreviewMode = Boolean(props.puck?.isEditing);
  const sectionBackgroundColor = sectionStyle.backgroundColor;
  const sectionForeground = sectionStyle.color;
  const reviewCardBorder = sectionBackgroundColor
    ? `1px solid color-mix(in srgb, ${sectionBackgroundColor} 14%, transparent)`
    : undefined;

  if (!isPreviewMode && !hasEntityReviews && !hasAggregateReviews) {
    return null;
  }

  const rating = String(aggregateRating.averageRating);
  const reviewCountValue = String(aggregateRating.reviewCount);
  const hasRating = aggregateRating.averageRating > 0;
  const hasReviewCount = aggregateRating.reviewCount > 0;
  const reviewCountLabel = hasReviewCount
    ? formatReviewCountLabel(reviewCountValue)
    : "";
  const showStarsLabel = Boolean(props.content.rating.showStarsLabel);
  const filledStars = getFilledStars(rating);
  const reviews = hasEntityReviews
    ? entityReviews
    : isPreviewMode
      ? [
          {
            authorName: "Jane Doe",
            rating: "5",
            reviewDate: "01/01/2026",
            content:
              "A warm placeholder review that appears while editing when real review data is unavailable.",
          },
          {
            authorName: "Alex Smith",
            rating: "4",
            reviewDate: "01/12/2026",
            content:
              "Another placeholder review card to show the final layout in the editor.",
          },
          {
            authorName: "Morgan Lee",
            rating: "5",
            reviewDate: "02/03/2026",
            content:
              "This card is only shown in editing mode until the live entity has review content.",
          },
          {
            authorName: "Taylor Chen",
            rating: "5",
            reviewDate: "02/20/2026",
            content:
              "Placeholder content helps confirm spacing, typography, and card rhythm.",
          },
        ]
      : [];

  return (
    <AnalyticsScopeProvider
      name={`CafeAndCoffeeShopReviews${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isPreviewMode}
      >
        <div
          className="cafe-scope no-touchevents page-caffeine"
          dir="ltr"
          style={
            {
              "--cr-reviews-bg": sectionBackgroundColor,
              "--cr-reviews-heading":
                toThemeCss(props.heading.fontColor?.selectedColor) ??
                sectionForeground,
            } as React.CSSProperties
          }
        >
          <style>{CafeAndCoffeeShopStyles}</style>
          <Background
            as="section"
            id="reviews-section"
            className="local-section section-reviews"
            aria-label={t("components.reviews", "Reviews")}
            background={props.section.backgroundColor}
            style={sectionStyle}
          >
            <div className="reviews__wrap">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="reviews__heading"
                  style={{
                    color:
                      toThemeCss(props.heading.fontColor?.selectedColor) ??
                      sectionForeground,
                    ...resolveTextStyles(props.heading.styles),
                  }}
                >
                  {resolveTextFieldValue(
                    props.heading.text,
                    locale,
                    streamDocument,
                  )}
                </h2>
              </EntityField>
              {reviews.length > 0 ? (
                <>
                  {hasRating || hasReviewCount ? (
                    <p className="reviews__summary">
                      {hasRating ? (
                        <span className="reviews__summary-main">
                          <span
                            className="reviews__score"
                            style={{ color: sectionForeground }}
                          >
                            {rating}
                          </span>
                          {showStarsLabel ? (
                            <span
                              className="reviews__label"
                              style={{ color: sectionForeground }}
                            >
                              {t("stars", "Stars")}
                            </span>
                          ) : null}
                          <span className="reviews__stars" aria-hidden="true">
                            {Array.from({ length: 5 }, (_, index) => (
                              <span
                                key={`summary-star-${index}`}
                                style={{
                                  color: sectionForeground,
                                  opacity: index < filledStars ? 1 : 0.28,
                                }}
                              >
                                ★
                              </span>
                            ))}
                          </span>
                        </span>
                      ) : null}
                      {reviewCountLabel ? (
                        <span className="reviews__summary-meta">
                          {hasRating ? (
                            <span
                              className="reviews__divider"
                              style={{ color: sectionForeground }}
                            >
                              |
                            </span>
                          ) : null}
                          <span
                            className="reviews__count"
                            style={{ color: sectionForeground }}
                          >
                            {reviewCountLabel}
                          </span>
                        </span>
                      ) : null}
                    </p>
                  ) : null}
                  <EntityField
                    displayName="Subheading"
                    fieldId={props.content.subheading.text.field}
                    constantValueEnabled={
                      props.content.subheading.text.constantValueEnabled
                    }
                  >
                    <p
                      className="reviews__recent"
                      style={{
                        color:
                          toThemeCss(
                            props.content.subheading.fontColor?.selectedColor,
                          ) ?? sectionForeground,
                        ...resolveTextStyles(props.content.subheading.styles),
                      }}
                    >
                      {resolveTextFieldValue(
                        props.content.subheading.text,
                        locale,
                        streamDocument,
                        t("recentReviews", "Recent Reviews:"),
                      )}
                    </p>
                  </EntityField>
                  <div className="reviews__grid">
                    {reviews.map((review, index) => {
                      const reviewFilledStars = getFilledStars(review.rating);
                      const hasReviewRating = review.rating.trim().length > 0;
                      const hasReviewDate = review.reviewDate.trim().length > 0;

                      return (
                        <article
                          key={`${review.authorName || "review"}-${index}`}
                          className="review-card"
                          style={{
                            backgroundColor: sectionForeground,
                            color: sectionBackgroundColor,
                            border: reviewCardBorder,
                            boxShadow: "0 18px 40px rgba(17, 17, 17, 0.08)",
                          }}
                        >
                          <div className="review-card__head">
                            <h3 style={{ color: sectionBackgroundColor }}>
                              {review.authorName}
                            </h3>
                          </div>
                          {hasReviewRating || hasReviewDate ? (
                            <div className="review-card__meta">
                              {hasReviewRating ? (
                                <p className="review-card__rating">
                                  <span
                                    className="review-card__score"
                                    style={{ color: sectionBackgroundColor }}
                                  >
                                    {review.rating}
                                  </span>
                                  {showStarsLabel ? (
                                    <span
                                      className="reviews__label"
                                      style={{ color: sectionBackgroundColor }}
                                    >
                                      {t("stars", "Stars")}
                                    </span>
                                  ) : null}
                                  <span
                                    className="review-card__stars"
                                    aria-hidden="true"
                                  >
                                    {Array.from(
                                      { length: 5 },
                                      (_, starIndex) => (
                                        <span
                                          key={`review-${index}-star-${starIndex}`}
                                          style={{
                                            color: sectionBackgroundColor,
                                            opacity:
                                              starIndex < reviewFilledStars
                                                ? 1
                                                : 0.28,
                                          }}
                                        >
                                          ★
                                        </span>
                                      ),
                                    )}
                                  </span>
                                </p>
                              ) : null}
                              {hasReviewDate ? (
                                <p
                                  className="review-card__date"
                                  style={{ color: sectionBackgroundColor }}
                                >
                                  {review.reviewDate}
                                </p>
                              ) : null}
                            </div>
                          ) : null}
                          <p
                            className="review-card__text"
                            style={{ color: sectionBackgroundColor }}
                          >
                            {review.content}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </div>
          </Background>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CafeAndCoffeeShopReviews: YextComponentConfig<CafeAndCoffeeShopReviewsProps> =
  {
    label: msg("components.reviewsLabel", "Reviews"),
    fields: CafeAndCoffeeShopReviewsFields,
    defaultProps: CafeAndCoffeeShopReviewsDefaultProps,
    render: (props) => (
      <TypographyScope>
        <CafeAndCoffeeShopReviewsComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "CafeAndCoffeeShopReviews",
  displayName: "Reviews",
  description: "Reviews",
  pageSetTypes: ["ENTITY"],
};
