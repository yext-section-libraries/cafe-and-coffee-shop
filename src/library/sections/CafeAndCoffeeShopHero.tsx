import { CafeCTA } from "../shared/CafeCTA";
import { TypographyScope } from "../shared/typography";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { useTranslation } from "react-i18next";
import type { PuckComponent } from "@puckeditor/core";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import { HoursStatus, type HoursType } from "@yext/pages-components";
import {
  msg,
  EntityField,
  getAnalyticsScopeHash,
  getAggregateRating,
  getSurfaceColorStyle,
  getThemeColorCssValue as toThemeCss,
  isDarkColor,
  resolveComponentData,
  resolveLocalizedAssetImage,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableString,
  type ComprehensiveCTAValue,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  useDocument,
  VisibilityWrapper,
  Background,
} from "@yext/visual-editor";
import {
  createTextField,
  createTranslatableString,
  defaultButtonStyles,
  defaultTextStyles,
  getFirstPartyAggregateRating,
  getStyledTextStyle,
  hasExplicitCtaColor,
  hasImageSource,
  resolveTextFieldValue,
  resolveTranslatableStringValue,
} from "../shared/sectionHelpers";

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type HeroCta = {
  item: ComprehensiveCTAValue;
};

type HeroHoursStatusTemplateProps = Parameters<
  NonNullable<React.ComponentProps<typeof HoursStatus>["statusTemplate"]>
>[0];

export type CafeAndCoffeeShopHeroProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  heading: StyledTextProps;
  background: {
    image: YextEntityField<TranslatableAssetImage>;
  };
  hours: {
    hours: YextEntityField<HoursType>;
    hoursStyles: {
      showCurrentStatus: boolean;
      timeFormat: "12h" | "24h";
      dayOfWeekFormat: "short" | "long";
      showDayNames: boolean;
      openStatusBackgroundColor?: ThemeColor;
      openStatusTextColor?: ThemeColor;
      closedStatusBackgroundColor?: ThemeColor;
      closedStatusTextColor?: ThemeColor;
    };
  };
  subheading: StyledTextProps;
  reviewsRatingAndCount: {
    showStarsLabel: boolean;
    fontColor?: ThemeColor;
  };
  ctas: HeroCta[];
};

const heroImageUrl =
  "https://a.mktgcdn.com/p/vQqhmnexQfZueJGyh5M_j5W4EcTkTyZlW93eIoqjjvQ/1900x1267.jpg";

const createStyledText = (
  value: string,
  fontColor: ThemeColor | undefined = undefined,
  field = "",
  constantValueEnabled = field.length === 0,
): StyledTextProps => ({
  text: createTextField(value, field, constantValueEnabled),
  styles: defaultTextStyles,
  fontColor,
});

const createAssetImageField = (
  url: string,
  width: number,
  height: number,
  altText: string,
): YextEntityField<TranslatableAssetImage> => ({
  field: "",
  constantValue: {
    url,
    width,
    height,
    alternateText: createTranslatableString(altText),
  },
  constantValueEnabled: true,
});

const createCTA = (
  label: string,
  link: string,
  variant: string | undefined = "primary",
  color: ThemeColor | undefined,
): ComprehensiveCTAValue =>
  ({
    data: {
      actionType: "link",
      cta: {
        field: "",
        constantValueEnabled: true,
        constantValue: {
          ctaType: "textAndLink",
          label: { defaultValue: label },
          link: { defaultValue: link },
        },
      },
      openInNewTab: false,
    },
    styles: {
      variant: variant,
      color: color,
      button: defaultButtonStyles,
      link: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
        letterSpacing: "default",
        includeCaret: "default",
      },
    },
  }) as ComprehensiveCTAValue;

const styledTextFields = (): YextFields<StyledTextProps> => ({
  text: {
    label: msg("fields.text", "Text"),
    type: "entityField",
    filter: {
      types: ["type.string"],
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
});

const defaultHeading: CafeAndCoffeeShopHeroProps["heading"] = createStyledText(
  "",
  undefined,
  "name",
  false,
);

const defaultBackground: CafeAndCoffeeShopHeroProps["background"] = {
  image: createAssetImageField(heroImageUrl, 1900, 1267, "Hero image"),
};

const defaultHours: CafeAndCoffeeShopHeroProps["hours"] = {
  hours: {
    field: "hours",
    constantValue: {},
    constantValueEnabled: false,
  },
  hoursStyles: {
    showCurrentStatus: true,
    timeFormat: "12h",
    dayOfWeekFormat: "long",
    showDayNames: true,
    openStatusBackgroundColor: {
      selectedColor: "[#ffffff]",
      contrastingColor: "black",
    },
    openStatusTextColor: {
      selectedColor: "[#2f7a38]",
      contrastingColor: "white",
    },
    closedStatusBackgroundColor: {
      selectedColor: "[#1f2937]",
      contrastingColor: "white",
    },
    closedStatusTextColor: {
      selectedColor: "[#ffffff]",
      contrastingColor: "black",
    },
  },
};

const defaultReviews: CafeAndCoffeeShopHeroProps["reviewsRatingAndCount"] = {
  showStarsLabel: true,
  fontColor: undefined,
};

const defaultCtas: HeroCta[] = [
  {
    item: createCTA("Call Ahead", "#", "primary", undefined),
  },
  {
    item: createCTA("Order Takeout", "#", "primary", undefined),
  },
  {
    item: createCTA("View Menu", "#", "secondary", undefined),
  },
];

export const CafeAndCoffeeShopHeroFields: YextFields<CafeAndCoffeeShopHeroProps> =
  {
    section: {
      label: msg("fields.section", "Section"),
      type: "object",
      objectFields: {
        visibleOnLivePage: {
          label: msg("fields.visibleOnLivePage", "Visible on Live Page"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        backgroundColor: {
          label: msg("fields.backgroundColor", "Background Color"),
          type: "basicSelector",
          options: "BACKGROUND_COLOR",
        },
      },
    },
    heading: {
      label: msg("fields.heading", "Heading"),
      type: "object",
      objectFields: styledTextFields(),
    },
    background: {
      label: msg("fields.background", "Background"),
      type: "object",
      objectFields: {
        image: {
          label: msg("fields.image", "Image"),
          type: "entityField",
          filter: {
            types: ["type.image"],
          },
          disableConstantValueToggle: false,
        },
      },
    },
    hours: {
      label: msg("fields.hours", "Hours"),
      type: "object",
      objectFields: {
        hours: {
          label: msg("fields.hours", "Hours"),
          type: "entityField",
          filter: {
            types: ["type.hours"],
          },
          disableConstantValueToggle: true,
        },
        hoursStyles: {
          label: msg("fields.hoursStyles", "Hours Styles"),
          type: "object",
          objectFields: {
            showCurrentStatus: {
              label: msg("fields.showCurrentStatus", "Show Current Status"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
            timeFormat: {
              label: msg("fields.timeFormat", "Time Format"),
              type: "select",
              options: [
                {
                  label: msg("fields.options.hour12Label", "12 Hour"),
                  value: "12h",
                },
                {
                  label: msg("fields.options.hour24Label", "24 Hour"),
                  value: "24h",
                },
              ],
            },
            dayOfWeekFormat: {
              label: msg("fields.dayOfWeekFormatLabel", "Day Of Week Format"),
              type: "select",
              options: [
                { label: msg("fields.options.short", "Short"), value: "short" },
                { label: msg("fields.options.long", "Long"), value: "long" },
              ],
            },
            showDayNames: {
              label: msg("fields.showDayNames", "Show Day Names"),
              type: "radio",
              options: [
                { label: msg("fields.options.yes", "Yes"), value: true },
                { label: msg("fields.options.no", "No"), value: false },
              ],
            },
            openStatusBackgroundColor: {
              label: msg(
                "fields.openPillBackgroundColor",
                "Open Pill Background Color",
              ),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            openStatusTextColor: {
              label: msg("fields.openPillTextColor", "Open Pill Text Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            closedStatusBackgroundColor: {
              label: msg(
                "fields.closedPillBackgroundColor",
                "Closed Pill Background Color",
              ),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
            closedStatusTextColor: {
              label: msg(
                "fields.closedPillTextColor",
                "Closed Pill Text Color",
              ),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
      },
    },
    subheading: {
      label: msg("fields.subheading", "Subheading"),
      type: "object",
      objectFields: styledTextFields(),
    },
    reviewsRatingAndCount: {
      label: msg("fields.reviews", "Reviews"),
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
        fontColor: {
          label: msg("fields.fontColor", "Font Color"),
          type: "basicSelector",
          options: "SITE_COLOR",
        },
      },
    },
    ctas: {
      label: msg("fields.ctas", "CTAs"),
      type: "array",
      arrayFields: {
        item: {
          label: msg("fields.cta", "CTA"),
          type: "comprehensiveCTA",
        },
      },
      defaultItemProps: defaultCtas[0],
      getItemSummary: (_row, index) => `CTA ${(index ?? 0) + 1}`,
      max: 3,
    },
  };

export const CafeAndCoffeeShopHeroDefaultProps: CafeAndCoffeeShopHeroProps = {
  section: {
    visibleOnLivePage: true,
    backgroundColor: {
      selectedColor: "palette-primary",
      contrastingColor: "palette-primary-contrast",
    },
  },
  heading: defaultHeading,
  background: defaultBackground,
  hours: defaultHours,
  subheading: createStyledText("", undefined, "geomodifier", false),
  reviewsRatingAndCount: defaultReviews,
  ctas: defaultCtas,
};

const CafeAndCoffeeShopStyles = String.raw`
#local-section-template--23715283763541__flex_slideshow_ypPb7P,
#local-section-template--23715283763541__flex_slideshow_ypPb7P * {
  box-sizing: border-box;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .button {
  --cr-cta-bg: transparent;
  --cr-cta-color: currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid;
  text-decoration: none;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease, opacity 0.18s ease;
}

.cafe-scope.no-touchevents #local-section-template--23715283763541__flex_slideshow_ypPb7P .button.button--has-fill:hover,
.cafe-scope.no-touchevents #local-section-template--23715283763541__flex_slideshow_ypPb7P .button.button--has-fill:focus-visible {
  background-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  border-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  color: var(--cr-cta-color) !important;
  outline: none;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .button:focus-visible {
  outline: 2px solid rgba(255,255,255,0.7);
  outline-offset: 2px;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero {
  position: relative;
  min-height: clamp(520px, 78vh, 760px);
  overflow: hidden;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__media {
  position: absolute;
  inset: 0;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 66% center;
  display: block;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__content {
  position: relative;
  z-index: 1;
  min-height: inherit;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: clamp(2.5rem, 4vw, 3.75rem) 40px;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__text {
  max-width: 54rem;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .card__text > *:last-child {
  margin-bottom: 0;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-brandline {
  margin: 0 0 1rem;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-title-main {
  margin: 0;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-line {
  margin: 1rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-main,
#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-meta {
  display: inline-flex;
  align-items: center;
  gap: 0.28rem;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-score {
  display: inline-flex;
  align-items: center;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-stars,
#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-stars,
#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-divider,
#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-label {
  display: inline-flex;
  align-items: center;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-stars,
#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-stars {
  gap: 1px;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-count {
  display: inline-flex;
  align-items: center;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-status-line {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.95rem;
  flex-wrap: wrap;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-open-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0.46rem 0.88rem;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-close-time {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.18rem;
}

#local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-cta-group {
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

@media (max-width: 1100px) {
  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero {
    min-height: clamp(460px, 66vh, 600px);
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__content {
    align-items: center;
    padding-inline: 30px;
    padding-bottom: 1.5rem;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__text {
    max-width: 30rem;
  }
}

@media (max-width: 700px) {
  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero {
    min-height: clamp(420px, 58vh, 520px);
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__content {
    justify-content: center;
    padding-inline: 14px;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .static-hero__text {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 1.25rem 1rem;
    text-align: center;
    border-radius: 14px;
    backdrop-filter: blur(3px);
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-rating-line,
  #local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-status-line {
    justify-content: center;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-status-line {
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .hero-cta-group {
    flex-direction: column;
  }

  #local-section-template--23715283763541__flex_slideshow_ypPb7P .button {
    width: 100%;
  }
}`;

const getResolvedImage = (
  value: YextEntityField<TranslatableAssetImage>,
  locale: string,
  streamDocument: StreamDocument | undefined,
  fallbackAlt = "",
) => {
  const resolved = resolveComponentData(value, locale, streamDocument);
  const image = resolveLocalizedAssetImage(
    resolved ?? value.constantValue,
    locale,
  );

  return {
    url: hasImageSource(image) ? image.url : "",
    alt:
      resolveTranslatableStringValue(
        image?.alternateText,
        locale,
        streamDocument,
        fallbackAlt,
      ) || fallbackAlt,
  };
};

const hasHeroStatusDetail = (status: HeroHoursStatusTemplateProps) =>
  !status.comingSoon &&
  !status.currentInterval?.is24h?.() &&
  Boolean(status.futureInterval);

const getHeroStatusTime = (
  status: HeroHoursStatusTemplateProps,
  locale: string,
) => {
  if (!hasHeroStatusDetail(status)) {
    return "";
  }

  return status.isOpen
    ? (status.currentInterval?.getEndTime(locale, status.timeOptions) ?? "")
    : (status.futureInterval?.getStartTime(locale, status.timeOptions) ?? "");
};

const getHeroStatusDay = (
  status: HeroHoursStatusTemplateProps,
  showDayNames: boolean,
  locale: string,
) => {
  if (!showDayNames || !hasHeroStatusDetail(status)) {
    return "";
  }

  const dayOptions = { weekday: "long", ...status.dayOptions };

  return status.isOpen
    ? (status.currentInterval?.end
        ?.setLocale(locale)
        .toLocaleString(dayOptions) ?? "")
    : (status.futureInterval?.start
        ?.setLocale(locale)
        .toLocaleString(dayOptions) ?? "");
};

const CafeAndCoffeeShopHeroComponent: PuckComponent<
  CafeAndCoffeeShopHeroProps
> = (props) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocument>();
  const locale = i18n.language;
  const isEditing = Boolean(props.puck?.isEditing);
  const heading = resolveTextFieldValue(
    props.heading.text,
    locale,
    streamDocument,
  );
  const sectionStyle =
    getSurfaceColorStyle(props.section.backgroundColor, streamDocument) ?? {};
  const sectionBackgroundColor = sectionStyle.backgroundColor;
  const sectionForeground = sectionStyle.color;
  const heroOverlayBackgroundColor = sectionBackgroundColor
    ? `color-mix(in srgb, ${sectionBackgroundColor} 56%, transparent)`
    : undefined;
  const subheading = resolveTextFieldValue(
    props.subheading.text,
    locale,
    streamDocument,
  );
  const resolvedHours = resolveComponentData(
    props.hours.hours,
    locale,
    streamDocument,
  );
  const aggregateRating =
    getFirstPartyAggregateRating(streamDocument) ??
    getAggregateRating(streamDocument);
  const ratingValue = aggregateRating.averageRating.toFixed(1);
  const shouldShowHeroReviewSummary = aggregateRating.reviewCount > 0;
  const backgroundImage = getResolvedImage(
    props.background.image,
    locale,
    streamDocument,
  );
  const openPillBackgroundColor =
    toThemeCss(
      props.hours.hoursStyles.openStatusBackgroundColor?.selectedColor,
    ) ?? sectionForeground;
  const openPillTextColor =
    toThemeCss(props.hours.hoursStyles.openStatusTextColor?.selectedColor) ??
    sectionBackgroundColor;
  const closedPillBackgroundColor =
    toThemeCss(
      props.hours.hoursStyles.closedStatusBackgroundColor?.selectedColor,
    ) ?? sectionBackgroundColor;
  const closedPillTextColor =
    toThemeCss(props.hours.hoursStyles.closedStatusTextColor?.selectedColor) ??
    sectionForeground;

  return (
    <AnalyticsScopeProvider
      name={`CafeAndCoffeeShopHero${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <div className="cafe-scope no-touchevents page-caffeine" dir="ltr">
          <style>{CafeAndCoffeeShopStyles}</style>
          <div
            id="local-section-template--23715283763541__flex_slideshow_ypPb7P"
            className="local-section static-hero-section section-hero"
          >
            <section
              className="static-hero"
              aria-label={t("hero", "Hero")}
              style={
                backgroundImage.url
                  ? undefined
                  : { backgroundColor: sectionBackgroundColor }
              }
            >
              {backgroundImage.url ? (
                <EntityField
                  displayName="Background Image"
                  fieldId={props.background.image.field}
                  constantValueEnabled={
                    props.background.image.constantValueEnabled
                  }
                >
                  <div className="static-hero__media" aria-hidden="true">
                    <img src={backgroundImage.url} alt={backgroundImage.alt} />
                  </div>
                </EntityField>
              ) : null}
              <div className="static-hero__content container--large">
                <Background
                  background={props.section.backgroundColor}
                  className="static-hero__text card__text w-full sm:max-w-[54rem]"
                  style={
                    {
                      padding: "32px",
                      backgroundColor: heroOverlayBackgroundColor,
                      borderRadius: "16px",
                    } as React.CSSProperties
                  }
                >
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={
                      props.heading.text.constantValueEnabled
                    }
                  >
                    <h2
                      className="hero-brandline"
                      style={getStyledTextStyle(
                        props.heading.styles,
                        props.heading.fontColor,
                        sectionForeground,
                      )}
                    >
                      {heading}
                    </h2>
                  </EntityField>
                  <EntityField
                    displayName="Subheading"
                    fieldId={props.subheading.text.field}
                    constantValueEnabled={
                      props.subheading.text.constantValueEnabled
                    }
                  >
                    <h1
                      className="hero-title-main"
                      style={getStyledTextStyle(
                        props.subheading.styles,
                        props.subheading.fontColor,
                        sectionForeground,
                      )}
                    >
                      {subheading}
                    </h1>
                  </EntityField>
                  {shouldShowHeroReviewSummary ? (
                    <p className="hero-rating-line">
                      <span className="hero-rating-main">
                        <span
                          className="hero-rating-score"
                          style={{
                            color: toThemeCss(
                              props.reviewsRatingAndCount.fontColor
                                ?.selectedColor,
                            ),
                          }}
                        >
                          {ratingValue}
                        </span>
                        {props.reviewsRatingAndCount.showStarsLabel ? (
                          <span
                            className="hero-rating-label"
                            style={{
                              color: toThemeCss(
                                props.reviewsRatingAndCount.fontColor
                                  ?.selectedColor,
                              ),
                            }}
                          >
                            {t("stars", "Stars")}
                          </span>
                        ) : null}
                        <span
                          className="hero-stars"
                          style={{
                            color: toThemeCss(
                              props.reviewsRatingAndCount.fontColor
                                ?.selectedColor,
                            ),
                          }}
                        >
                          {String.fromCodePoint(0x2605).repeat(5)}
                        </span>
                      </span>
                      <span className="hero-rating-meta">
                        <span
                          className="hero-divider"
                          style={{
                            color: toThemeCss(
                              props.reviewsRatingAndCount.fontColor
                                ?.selectedColor,
                            ),
                          }}
                        >
                          |
                        </span>
                        <span
                          className="hero-rating-count"
                          style={{
                            color: toThemeCss(
                              props.reviewsRatingAndCount.fontColor
                                ?.selectedColor,
                            ),
                          }}
                        >
                          {t("reviewWithCount", {
                            defaultValue: "{{count}} Reviews",
                            count: aggregateRating.reviewCount,
                          })}
                        </span>
                      </span>
                    </p>
                  ) : null}
                  {props.hours.hoursStyles.showCurrentStatus ? (
                    <EntityField
                      displayName="Hours"
                      fieldId={props.hours.hours.field}
                      constantValueEnabled={
                        props.hours.hours.constantValueEnabled
                      }
                    >
                      <HoursStatus
                        hours={resolvedHours as HoursType}
                        comingSoon={streamDocument?.comingSoon}
                        timezone={streamDocument?.timezone ?? "UTC"}
                        dayOptions={
                          props.hours.hoursStyles.showDayNames
                            ? {
                                weekday:
                                  props.hours.hoursStyles.dayOfWeekFormat,
                              }
                            : undefined
                        }
                        statusTemplate={(status) => {
                          const pillLabel = status.comingSoon
                            ? t("comingSoon", "Coming Soon")
                            : status.currentInterval?.is24h?.()
                              ? t("open24Hours", "Open 24 Hours")
                              : !status.futureInterval
                                ? t("temporarilyClosed", "Temporarily Closed")
                                : status.isOpen
                                  ? t("openNow", "Open Now")
                                  : t("closed", "Closed");
                          const detailTime = getHeroStatusTime(
                            status,
                            i18n.language,
                          );
                          const detailDay = getHeroStatusDay(
                            status,
                            props.hours.hoursStyles.showDayNames,
                            i18n.language,
                          );
                          const detailText = detailTime
                            ? status.isOpen
                              ? detailDay
                                ? t(
                                    "closesAtTimeWeek",
                                    "Closes at {{time}} {{dayOfWeek}}",
                                    { time: detailTime, dayOfWeek: detailDay },
                                  )
                                : t("closesAtTime", "Closes at {{time}}", {
                                    time: detailTime,
                                  })
                              : detailDay
                                ? t(
                                    "opensAtTimeWeek",
                                    "Opens at {{time}} {{dayOfWeek}}",
                                    { time: detailTime, dayOfWeek: detailDay },
                                  )
                                : t("opensAtTime", "Opens at {{time}}", {
                                    time: detailTime,
                                  })
                            : "";

                          return (
                            <div className="hero-status-line">
                              <span
                                className="hero-open-pill"
                                style={{
                                  backgroundColor: status.isOpen
                                    ? openPillBackgroundColor
                                    : closedPillBackgroundColor,
                                  color: status.isOpen
                                    ? openPillTextColor
                                    : closedPillTextColor,
                                }}
                              >
                                {pillLabel}
                              </span>
                              {detailText ? (
                                <span className="hero-close-time">
                                  {detailText}
                                </span>
                              ) : null}
                            </div>
                          );
                        }}
                        timeOptions={{
                          hour12: props.hours.hoursStyles.timeFormat === "12h",
                        }}
                      />
                    </EntityField>
                  ) : null}
                  <div className="hero-cta-group">
                    {props.ctas.slice(0, 3).map(({ item }, index) => {
                      const variant = item.styles?.variant as
                        | string
                        | undefined;
                      const heroActionClass =
                        index === 0
                          ? " hero-action--call"
                          : index === 1
                            ? " hero-action--menu"
                            : index === 2
                              ? " hero-action--limited"
                              : "";
                      const buttonClassName =
                        variant === "link"
                          ? heroActionClass
                          : variant === "outline" || variant === "secondary"
                            ? `button button--small button--outline${heroActionClass}`
                            : `button button--small button--has-fill${heroActionClass}`;
                      const fallbackOutlineColor =
                        (variant === "outline" || variant === "secondary") &&
                        !hasExplicitCtaColor(item)
                          ? isDarkColor(
                              props.section.backgroundColor,
                              streamDocument,
                            )
                            ? "white"
                            : "black"
                          : undefined;
                      const explicitOutlineColor = hasExplicitCtaColor(item)
                        ? toThemeCss(item.styles?.color?.selectedColor)
                        : undefined;
                      const outlineColor =
                        variant === "outline" || variant === "secondary"
                          ? (explicitOutlineColor ?? fallbackOutlineColor)
                          : undefined;

                      return (
                        <EntityField
                          key={index}
                          displayName={`Hero Call to Action ${index + 1}`}
                          fieldId={item.data.cta.field}
                          constantValueEnabled={
                            item.data.cta.constantValueEnabled
                          }
                        >
                          <CafeCTA
                            value={item as Partial<ComprehensiveCTAValue>}
                            className={buttonClassName}
                            style={
                              outlineColor
                                ? {
                                    color: outlineColor,
                                    borderColor: outlineColor,
                                  }
                                : undefined
                            }
                          />
                        </EntityField>
                      );
                    })}
                  </div>
                </Background>
              </div>
            </section>
          </div>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CafeAndCoffeeShopHero: YextComponentConfig<CafeAndCoffeeShopHeroProps> =
  {
    label: msg("components.heroLabel", "Hero"),
    fields: CafeAndCoffeeShopHeroFields,
    defaultProps: CafeAndCoffeeShopHeroDefaultProps,
    render: (props) => (
      <TypographyScope>
        <CafeAndCoffeeShopHeroComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "CafeAndCoffeeShopHero",
  displayName: "Hero",
  description: "Hero",
  pageSetTypes: ["ENTITY"],
};
