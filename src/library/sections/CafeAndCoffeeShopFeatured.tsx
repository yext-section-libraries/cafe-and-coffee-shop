import { CafeCTA } from "../shared/CafeCTA";
import { CafeRichText, TypographyScope, resolveTextStyles } from "../shared/typography";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import type { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  Background,
  EntityField,
  Image,
  createItemSource,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  msg,
  resolveComponentData,
  resolveLocalizedAssetImage,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  type ComprehensiveCTAValue,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { PuckComponent } from "@puckeditor/core";
import {
  createRtfField,
  createTextField,
  createTranslatableString,
  defaultButtonStyles,
  defaultTextStyles,
  hasImageSource,
  resolveTextFieldValue,
  resolveTranslatableStringValue,
} from "../shared/sectionHelpers";
import { useTranslation } from "react-i18next";

type FeaturedCardImageAppearance = {
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
};

type FeaturedCardTextAppearance = {
  styles: StyledTextValue;
  fontColor: ThemeColor | undefined;
};

type FeaturedCardItem = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  title: YextEntityField<TranslatableString>;
  description: YextEntityField<TranslatableRichText>;
  cta: ComprehensiveCTAValue;
};

type FeaturedCardStyles = {
  backgroundColor: ThemeColor;
  image: FeaturedCardImageAppearance;
  title: FeaturedCardTextAppearance;
  description: FeaturedCardTextAppearance;
};

type FeaturedContentProps = {
  items: typeof featuredSource.value;
  styles: FeaturedCardStyles;
};

export type CafeAndCoffeeShopFeaturedProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor: ThemeColor | undefined;
  };
  content: FeaturedContentProps;
};

const featured1Image =
  "https://a.mktgcdn.com/p/Qdlacb36DqN5Lt3q6V9jw-qSMmbPyl_AeMEI_CyDkHc/1267x1900.jpg";
const featured2Image =
  "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg";
const featured3Image =
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg";

const defaultCTAButtonStyles: NonNullable<
  ComprehensiveCTAValue["styles"]["button"]
> = defaultButtonStyles;

const createImageField = (
  url: string,
  width: number,
  height: number,
  altText: string,
): YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage> => ({
  field: "",
  constantValue: {
    url,
    width,
    height,
    alternateText: createTranslatableString(altText),
  },
  constantValueEnabled: true,
});

const createCTA = (label: string, link: string): ComprehensiveCTAValue => ({
  data: {
    actionType: "link",
    cta: {
      field: "",
      constantValue: {
        label: createTranslatableString(label),
        link: createTranslatableString(link),
        linkType: "URL",
        normalizeLink: true,
        openInNewTab: false,
        ctaType: "textAndLink",
      },
      constantValueEnabled: true,
      selectedType: "textAndLink",
    },
    openInNewTab: false,
  },
  styles: {
    variant: "primary",
    color: undefined,
    button: defaultCTAButtonStyles,
  },
});

const createFeaturedCard = (
  imageUrl: string,
  altText: string,
  title: string,
  description: string,
  buttonLabel: string,
): FeaturedCardItem => ({
  image: createImageField(imageUrl, 1267, 1900, altText),
  title: {
    field: "",
    constantValue: createTranslatableString(title),
    constantValueEnabled: true,
  },
  description: createRtfField(description),
  cta: createCTA(buttonLabel, "#"),
});

const CafeAndCoffeeShopStyles = String.raw`

#featured-items,
#featured-items * {
  box-sizing: border-box;
}

#featured-items .button {
  --cr-cta-bg: transparent;
  --cr-cta-color: currentColor;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid transparent;
  text-decoration: none;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.cafe-scope.no-touchevents #featured-items .button.button--has-fill:hover,
.cafe-scope.no-touchevents #featured-items .button.button--has-fill:focus-visible {
  background-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  border-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  color: var(--cr-cta-color) !important;
  outline: none;
}

#featured-items {
  margin: 0;
  padding: clamp(2.5rem, 4vw, 3.75rem) 0;
  background: var(--cr-featured-bg, #be865c);
}

#featured-items .featured__inner {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 40px;
}

#featured-items .featured__title {
  margin: 0 0 2rem;
  color: var(--cr-featured-heading, #000);
  text-align: center;
}

#featured-items .featured__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

#featured-items .featured-card {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  height: auto;
  min-height: 0;
}

#featured-items .featured-card__image {
  margin: 0;
  width: 100%;
}

#featured-items .featured-card__image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#featured-items .featured-card__content {
  display: grid;
  gap: 1rem;
  padding: clamp(1.45rem, 2.1vw, 1.95rem) clamp(1.3rem, 2vw, 1.75rem);
}

#featured-items .featured-card--no-image .featured-card__content {
  margin-top: auto;
}

#featured-items .featured-card__content h3 {
  margin: 0;
}

#featured-items .featured-card__content p {
  margin: 0;
  opacity: 0.85;
}

#featured-items .featured-card__cta {
  width: 100%;
  justify-self: stretch;
  align-self: stretch;
  border-width: 1px;
}

@media (max-width: 1023px) {
  #featured-items .featured__inner {
    padding-inline: 30px;
  }

  #featured-items .featured__title {
    text-align: left;
  }

  #featured-items .featured__grid {
    grid-template-columns: 1fr;
  }

}

@media (max-width: 700px) {
  #featured-items .featured__inner {
    padding-inline: 14px;
  }
}`;

const resolveCardImageSource = (
  image: ImageType | ComplexImageType | TranslatableAssetImage | undefined,
  locale: string,
): ImageType | ComplexImageType | TranslatableAssetImage | undefined => {
  if (hasImageSource(image)) {
    return image;
  }

  const localizedImage = resolveLocalizedAssetImage(
    image as ImageType | TranslatableAssetImage | undefined,
    locale,
  );

  return hasImageSource(localizedImage) ? localizedImage : undefined;
};

const imageAppearanceFields = (): YextFields<FeaturedCardImageAppearance> => ({
  aspectRatio: {
    type: "basicSelector",
    label: msg("fields.options.aspectRatio", "Aspect Ratio"),
    options: [
      { label: "1:1", value: 1 },
      { label: "5:4", value: 1.25 },
      { label: "4:3", value: 1.33 },
      { label: "3:2", value: 1.5 },
      { label: "5:3", value: 1.67 },
      { label: "16:9", value: 1.78 },
      { label: "2:1", value: 2 },
      { label: "3:1", value: 3 },
      { label: "4:1", value: 4 },
      { label: "4:5", value: 0.8 },
      { label: "3:4", value: 0.75 },
      { label: "2:3", value: 0.67 },
      { label: "3:5", value: 0.6 },
      { label: "9:16", value: 0.56 },
      { label: "1:2", value: 0.5 },
      { label: "1:3", value: 0.33 },
      { label: "1:4", value: 0.25 },
    ],
  },
  imageConstrain: {
    label: msg("fields.imageConstrain", "Image Constrain"),
    type: "select",
    options: [
      { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
      { label: msg("fields.options.filled", "Filled"), value: "filled" },
    ],
  },
});

const textAppearanceFields = (
  stylesLabel: string,
): YextFields<FeaturedCardTextAppearance> => ({
  styles: {
    label: stylesLabel,
    type: "styledText",
  },
  fontColor: {
    label: msg("fields.fontColor", "Font Color"),
    type: "basicSelector",
    options: "SITE_COLOR",
  },
});

const defaultContent = [
  createFeaturedCard(
    featured1Image,
    "Featured item 1",
    "Seasonal Espresso Flight",
    "A rotating trio of espresso pours selected to highlight bright, rich, and unexpected notes.",
    "Order Now",
  ),
  createFeaturedCard(
    featured2Image,
    "Featured item 2",
    "House Pastry Pairing",
    "Flaky, buttery pastries baked daily and matched with the coffees they love most.",
    "See Menu",
  ),
  createFeaturedCard(
    featured3Image,
    "Featured item 3",
    "Weekend Brunch Picks",
    "Coffee-forward brunch plates and signature drinks built for slower mornings and bigger groups.",
    "Book a Table",
  ),
] satisfies FeaturedCardItem[];

const defaultFeaturedImage: FeaturedCardImageAppearance = {
  aspectRatio: 1.25,
  imageConstrain: "filled",
};

const featuredSource = createItemSource<FeaturedCardItem>({
  label: msg("fields.featuredCards", "Featured Cards"),
  mappingFields: {
    image: {
      label: msg("fields.cardImage", "Card Image"),
      type: "entityField",
      filter: {
        types: ["type.image"],
      },
      disableConstantValueToggle: false,
    },
    title: {
      label: msg("fields.title", "Title"),
      type: "entityField",
      filter: {
        includeListsOnly: false,
        types: ["type.string" as const],
      },
      disableConstantValueToggle: false,
    },
    description: {
      label: msg("fields.description", "Description"),
      type: "entityField",
      filter: {
        types: ["type.rich_text_v2"],
      },
      disableConstantValueToggle: false,
    },
    cta: {
      label: msg("fields.callToAction", "Call to Action"),
      type: "comprehensiveCTA",
      disableConstantValueToggle: false,
    },
  },
  defaultValues: defaultContent,
});

export const CafeAndCoffeeShopFeaturedFields: YextFields<CafeAndCoffeeShopFeaturedProps> =
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
        items: {
          label: msg("fields.cards", "Cards"),
          ...featuredSource.field,
        },
        styles: {
          label: msg("fields.styles", "Styles"),
          type: "object",
          objectFields: {
            backgroundColor: {
              label: msg("fields.cardBackgroundColor", "Card Background Color"),
              type: "basicSelector",
              options: "BACKGROUND_COLOR",
            },
            image: {
              label: msg("fields.image", "Image"),
              type: "object",
              objectFields: imageAppearanceFields(),
            },
            title: {
              label: msg("fields.title", "Title"),
              type: "object",
              objectFields: textAppearanceFields(
                msg("fields.titleStyles", "Title Styles"),
              ),
            },
            description: {
              label: msg("fields.description", "Description"),
              type: "object",
              objectFields: textAppearanceFields(
                msg("fields.descriptionStyles", "Description Styles"),
              ),
            },
          },
        },
      },
    },
  };

const CafeAndCoffeeShopFeaturedDefaultProps: CafeAndCoffeeShopFeaturedProps = {
  section: {
    visibleOnLivePage: true,
    backgroundColor: {
      selectedColor: "palette-primary",
      contrastingColor: "palette-primary-contrast",
    },
  },
  heading: {
    text: createTextField("Featured Items"),
    styles: defaultTextStyles,
    fontColor: undefined,
  },
  content: {
    items: featuredSource.defaultValue,
    styles: {
      backgroundColor: {
        selectedColor: "palette-tertiary",
        contrastingColor: "palette-tertiary-contrast",
      },
      image: defaultFeaturedImage,
      title: {
        styles: defaultTextStyles,
        fontColor: undefined,
      },
      description: {
        styles: defaultTextStyles,
        fontColor: undefined,
      },
    },
  },
};

const CafeAndCoffeeShopFeaturedComponent: PuckComponent<
  CafeAndCoffeeShopFeaturedProps
> = (props) => {
  const streamDocument = useDocument<StreamDocument>();
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const sectionStyle =
    getSurfaceColorStyle(props.section.backgroundColor, streamDocument) ?? {};
  const isEditing = Boolean(props.puck?.isEditing);
  const headingText = resolveTextFieldValue(
    props.heading.text,
    locale,
    streamDocument,
  );
  const sectionForeground = sectionStyle.color;
  const featuredImage = {
    ...defaultFeaturedImage,
    ...props.content.styles.image,
  };
  const items = featuredSource.resolveItems(
    props.content.items as unknown as Parameters<
      typeof featuredSource.resolveItems
    >[0],
    streamDocument,
  );
  const cardImageWrapperStyle: React.CSSProperties = {
    width: "100%",
    aspectRatio:
      featuredImage.aspectRatio > 0 ? featuredImage.aspectRatio : undefined,
    overflow: featuredImage.imageConstrain === "filled" ? "hidden" : undefined,
  };
  const cardImageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: featuredImage.aspectRatio > 0 ? "100%" : "auto",
    objectFit: featuredImage.imageConstrain === "filled" ? "cover" : "contain",
  };

  return (
    <AnalyticsScopeProvider
      name={`CafeAndCoffeeShopFeatured${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <div
          className="cafe-scope no-touchevents page-caffeine"
          dir="ltr"
          style={
            {
              "--cr-featured-bg": sectionStyle.backgroundColor,
              "--cr-featured-heading":
                getThemeColorCssValue(props.heading.fontColor) ??
                sectionForeground,
              "--cr-featured-card-title":
                getThemeColorCssValue(props.content.styles.title.fontColor) ??
                sectionForeground,
            } as React.CSSProperties
          }
        >
          <style>{CafeAndCoffeeShopStyles}</style>
          <Background
            as="section"
            id="featured-items"
            className="local-section section-featured"
            background={props.section.backgroundColor}
            style={sectionStyle}
          >
            <div className="featured__inner">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="featured__title"
                  style={{
                    color:
                      getThemeColorCssValue(props.heading.fontColor) ??
                      sectionForeground,
                    ...resolveTextStyles(props.heading.styles),
                  }}
                >
                  {headingText}
                </h2>
              </EntityField>
              <EntityField
                displayName="Featured Cards"
                fieldId={props.content.items.field}
                constantValueEnabled={props.content.items.constantValueEnabled}
              >
                <div className="featured__grid">
                  {items.map((item, index) => {
                    const title = resolveTranslatableStringValue(
                      item.title,
                      locale,
                      streamDocument,
                      "",
                    );
                    const cardForeground =
                      getThemeColorCssValue(
                        props.content.styles.backgroundColor.contrastingColor,
                      ) ?? sectionForeground;
                    const descriptionColor =
                      getThemeColorCssValue(
                        props.content.styles.description.fontColor,
                      ) ?? cardForeground;
                    const descriptionRichTextStyleOverrides = {
                      ...resolveTextStyles(props.content.styles.description.styles),
                      color: descriptionColor,
                    };
                    const resolvedDescription = item.description
                      ? resolveComponentData(
                          item.description,
                          locale,
                          streamDocument,
                        )
                      : undefined;
                    const resolvedCardImage = resolveCardImageSource(
                      item.image,
                      locale,
                    );
                    const hasCardImage = hasImageSource(resolvedCardImage);
                    const itemImageWrapperStyle: React.CSSProperties = {
                      ...cardImageWrapperStyle,
                    };
                    const itemImageStyle: React.CSSProperties = {
                      ...cardImageStyle,
                    };
                    const resolvedCTA = item.cta;
                    const ctaValue: ComprehensiveCTAValue | undefined =
                      resolvedCTA?.data?.cta
                        ? {
                            data: {
                              ...resolvedCTA.data,
                              cta: {
                                field: "",
                                constantValue: resolvedCTA.data.cta,
                                constantValueEnabled: true,
                                selectedType: resolvedCTA.data.cta.ctaType,
                              },
                            },
                            styles: resolvedCTA.styles,
                          }
                        : undefined;
                    const cardImageContent = (
                      <div style={itemImageWrapperStyle}>
                        <Image
                          image={resolvedCardImage!}
                          className="h-full"
                          style={itemImageStyle}
                        />
                      </div>
                    );

                    return (
                      <article
                        key={`${title || "card"}-${index}`}
                        className={`featured-card${hasCardImage ? "" : " featured-card--no-image"}`}
                        style={{
                          backgroundColor: getThemeColorCssValue(
                            props.content.styles.backgroundColor,
                          ),
                          color: getThemeColorCssValue(
                            props.content.styles.backgroundColor
                              .contrastingColor,
                          ),
                        }}
                      >
                        {hasCardImage ? (
                          <figure className="featured-card__image">
                            {cardImageContent}
                          </figure>
                        ) : null}
                        <div className="featured-card__content">
                          <h3
                            style={{
                              color: getThemeColorCssValue(
                                props.content.styles.title.fontColor,
                              ),
                              ...resolveTextStyles(props.content.styles.title.styles),
                            }}
                          >
                            {title}
                          </h3>
                          <div style={{ color: descriptionColor }}>
                            {React.isValidElement(resolvedDescription) ? (
                              <CafeRichText data={resolvedDescription} richTextStyleOverrides={descriptionRichTextStyleOverrides} />
                            ) : typeof resolvedDescription === "string" ? (
                              <CafeRichText
                                data={resolvedDescription}
                                richTextStyleOverrides={
                                  descriptionRichTextStyleOverrides
                                }
                              />
                            ) : null}
                          </div>
                          {ctaValue ? (
                            <CafeCTA
                              value={ctaValue}
                              className="button featured-card__cta"
                            />
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </EntityField>
            </div>
          </Background>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CafeAndCoffeeShopFeatured: YextComponentConfig<CafeAndCoffeeShopFeaturedProps> =
  {
    label: msg("components.featuredSection", "Featured Items Section"),
    fields: CafeAndCoffeeShopFeaturedFields,
    defaultProps: CafeAndCoffeeShopFeaturedDefaultProps,
    render: (props) => (
      <TypographyScope>
        <CafeAndCoffeeShopFeaturedComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "CafeAndCoffeeShopFeatured",
  displayName: "Featured Items Section",
  description: "Featured",
  pageSetTypes: ["ENTITY"],
};
