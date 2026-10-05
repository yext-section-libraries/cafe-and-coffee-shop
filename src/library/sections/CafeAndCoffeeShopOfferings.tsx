import type { StyledTextValue } from "@yext/visual-editor";
import { TypographyScope, resolveTextStyles, getBodyTextStyle } from "../shared/typography";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import type { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  msg,
  Background,
  EntityField,
  Image,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  type StreamDocument,
  type StyledImageValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  createTextField,
  createTranslatableString,
  defaultTextStyles,
  hasImageSource,
  resolveTextFieldValue,
} from "../shared/sectionHelpers";

type OfferingsImageProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type OfferingsTextListProps = {
  text: YextEntityField<TranslatableString[]>;
  styles: StyledTextValue;
  fontColor: ThemeColor | undefined;
};

export type CafeAndCoffeeShopOfferingsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor: ThemeColor | undefined;
  };
  content: OfferingsTextListProps;
  sectionImage: OfferingsImageProps;
};

const offeringsImageUrl =
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg";

const defaultImageStyles: StyledImageValue = {
  borderRadius: "default",
};

const createImageField = (
  url: string,
  width: number,
  height: number,
  altText: string,
): OfferingsImageProps => ({
  image: {
    field: "",
    constantValue: {
      url,
      width,
      height,
      alternateText: createTranslatableString(altText),
    },
    constantValueEnabled: true,
  },
  aspectRatio: 1.5,
  imageConstrain: "filled",
  styles: defaultImageStyles,
});

const CafeAndCoffeeShopStyles = String.raw`
.cafe-scope .section-offerings .split--text-left,
.cafe-scope .section-offerings .split--text-left * {
  box-sizing: border-box;
}

.cafe-scope .section-offerings {
  padding-inline: 0;
}

.cafe-scope .section-offerings .split--text-left {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  width: min(100%, 1440px);
  margin: 0 auto;
}

.cafe-scope .section-offerings .split--text-left.split--no-image {
  grid-template-columns: 1fr;
}

.cafe-scope .section-offerings .split--text-left .split__panel--text {
  display: flex;
  align-items: center;
  padding: clamp(2.5rem, 4vw, 3.75rem);
}

.cafe-scope .section-offerings .split--text-left .split__offerings {
  width: 100%;
  max-width: 34rem;
  margin: 0 auto;
}

.cafe-scope .section-offerings .split--text-left .split__title {
  margin: 0 0 2rem;
}

.cafe-scope .section-offerings .split--text-left .split__offerings-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.cafe-scope .section-offerings .split--text-left .split__offerings-list li {
  position: relative;
  padding-inline-start: 1.75rem;
  margin: 0 0 1rem;
}

.cafe-scope .section-offerings .split--text-left .split__offerings-list li::before {
  content: "";
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 50%;
  transform: translateY(-50%);
  width: 1.05rem;
  height: 1.05rem;
  background: currentColor;
  -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox=\"0 0 640 640\"><path fill=\"black\" d=\"M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 96C196.3 96 96 196.3 96 320C96 443.7 196.3 544 320 544C443.7 544 544 443.7 544 320C544 196.3 443.7 96 320 96zM403.1 230.6C408.3 223.5 418.3 221.9 425.4 227.1C432.5 232.3 434.1 242.3 428.9 249.4L300.9 425.4C298.1 429.2 293.9 431.6 289.2 431.9C284.5 432.2 279.9 430.6 276.6 427.3L212.6 363.3C206.4 357.1 206.4 346.9 212.6 340.7C218.8 334.5 229 334.5 235.2 340.7L285.9 391.4L402.9 230.6z\"/></svg>') center / contain no-repeat;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox=\"0 0 640 640\"><path fill=\"black\" d=\"M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 96C196.3 96 96 196.3 96 320C96 443.7 196.3 544 320 544C443.7 544 544 443.7 544 320C544 196.3 443.7 96 320 96zM403.1 230.6C408.3 223.5 418.3 221.9 425.4 227.1C432.5 232.3 434.1 242.3 428.9 249.4L300.9 425.4C298.1 429.2 293.9 431.6 289.2 431.9C284.5 432.2 279.9 430.6 276.6 427.3L212.6 363.3C206.4 357.1 206.4 346.9 212.6 340.7C218.8 334.5 229 334.5 235.2 340.7L285.9 391.4L402.9 230.6z\"/></svg>') center / contain no-repeat;
}

.cafe-scope .section-offerings .split--text-left .split__offerings-list li.wifi-unavailable::before {
  -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox=\"0 0 640 640\"><path fill=\"black\" d=\"M320 96C443.7 96 544 196.3 544 320C544 443.7 443.7 544 320 544C196.3 544 96 443.7 96 320C96 196.3 196.3 96 320 96zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM228.7 228.7C222.5 234.9 222.5 245.1 228.7 251.3L297.4 320L228.7 388.7C222.5 394.9 222.5 405.1 228.7 411.3C234.9 417.5 245.1 417.5 251.3 411.3L320 342.6L388.7 411.3C394.9 417.5 405.1 417.5 411.3 411.3C417.5 405.1 417.5 394.9 411.3 388.7L342.6 320L411.3 251.3C417.5 245.1 417.5 234.9 411.3 228.7C405.1 222.5 394.9 222.5 388.7 228.7L320 297.4L251.3 228.7C245.1 222.5 234.9 222.5 228.7 228.7z\"/></svg>') center / contain no-repeat;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox=\"0 0 640 640\"><path fill=\"black\" d=\"M320 96C443.7 96 544 196.3 544 320C544 443.7 443.7 544 320 544C196.3 544 96 443.7 96 320C96 196.3 196.3 96 320 96zM320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 461.4 178.6 576 320 576zM228.7 228.7C222.5 234.9 222.5 245.1 228.7 251.3L297.4 320L228.7 388.7C222.5 394.9 222.5 405.1 228.7 411.3C234.9 417.5 245.1 417.5 251.3 411.3L320 342.6L388.7 411.3C394.9 417.5 405.1 417.5 411.3 411.3C417.5 405.1 417.5 394.9 411.3 388.7L342.6 320L411.3 251.3C417.5 245.1 417.5 234.9 411.3 228.7C405.1 222.5 394.9 222.5 388.7 228.7L320 297.4L251.3 228.7C245.1 222.5 234.9 222.5 228.7 228.7z\"/></svg>') center / contain no-repeat;
}

.cafe-scope .section-offerings .split--text-left .split__panel--image img {
  width: 100%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
  display: block;
}

@media (max-width: 1023px) {
  .cafe-scope .section-offerings {
    padding-inline: 30px;
  }

  .cafe-scope .section-offerings .split--text-left {
    grid-template-columns: 1fr;
  }

  .cafe-scope .section-offerings .split--text-left .split__panel--text {
    padding: 2.5rem 0;
  }

  .cafe-scope .section-offerings .split--text-left .split__offerings {
    max-width: 100%;
    margin: 0;
  }

  .cafe-scope .section-offerings .split--text-left .split__panel--image {
    width: calc(100% + 60px);
    margin-inline: -30px;
  }
}

@media (max-width: 700px) {
  .cafe-scope .section-offerings {
    padding-inline: 14px;
  }

  .cafe-scope .section-offerings .split--text-left .split__panel--image {
    width: calc(100% + 28px);
    margin-inline: -14px;
  }
}
`;
const imageFields = (stylesLabel: string): YextFields<OfferingsImageProps> => ({
  image: {
    label: msg("fields.image", "Image"),
    type: "entityField",
    filter: {
      types: ["type.image"],
    },
    disableConstantValueToggle: false,
  },
  aspectRatio: {
    label: msg("fields.options.aspectRatio", "Aspect Ratio"),
    type: "number",
  },
  imageConstrain: {
    label: msg("fields.imageConstrain", "Image Constrain"),
    type: "select",
    options: [
      { label: msg("fields.options.fixed", "Fixed"), value: "fixed" },
      { label: msg("fields.options.filled", "Filled"), value: "filled" },
    ],
  },
  styles: {
    label: stylesLabel,
    type: "styledImage",
  },
});

const defaultHeading: CafeAndCoffeeShopOfferingsProps["heading"] = {
  text: createTextField("Offerings"),
  styles: defaultTextStyles,
  fontColor: undefined,
};

const defaultContent: CafeAndCoffeeShopOfferingsProps["content"] = {
  text: {
    field: "",
    constantValue: [
      "Lorem menu collection with ipsum plates and seasonal pours",
      "Dine-in",
      "Takeout",
    ],
    constantValueEnabled: true,
  },
  styles: defaultTextStyles,
  fontColor: undefined,
};

export const CafeAndCoffeeShopOfferingsFields: YextFields<CafeAndCoffeeShopOfferingsProps> =
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
        text: {
          label: msg("fields.text", "Text"),
          type: "entityField",
          filter: {
            includeListsOnly: true,
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
    sectionImage: {
      label: msg("fields.image", "Image"),
      type: "object",
      objectFields: imageFields(msg("fields.imageStyles", "Image Styles")),
    },
  };

export const CafeAndCoffeeShopOfferingsDefaultProps: CafeAndCoffeeShopOfferingsProps =
  {
    section: {
      backgroundColor: {
        selectedColor: "palette-secondary",
        contrastingColor: "palette-secondary-contrast",
      },
      visibleOnLivePage: true,
    },
    heading: defaultHeading,
    content: defaultContent,
    sectionImage: createImageField(
      offeringsImageUrl,
      1267,
      1900,
      "Offering image",
    ),
  };

const CafeAndCoffeeShopOfferingsComponent = (
  props: CafeAndCoffeeShopOfferingsProps & {
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
  const sectionImage = resolveComponentData(
    props.sectionImage.image,
    locale,
    streamDocument,
  ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
  const hasSectionImage = hasImageSource(sectionImage);
  const items =
    resolveComponentData(props.content.text, locale, streamDocument) ?? [];
  const headingText = resolveTextFieldValue(
    props.heading.text,
    locale,
    streamDocument,
  );
  const sectionImageWrapperStyle: React.CSSProperties = {
    width: "100%",
    aspectRatio:
      props.sectionImage.aspectRatio > 0
        ? props.sectionImage.aspectRatio
        : undefined,
    borderRadius:
      props.sectionImage.styles?.borderRadius === "default"
        ? undefined
        : props.sectionImage.styles?.borderRadius,
    overflow:
      props.sectionImage.imageConstrain === "filled" ||
      Boolean(
        props.sectionImage.styles?.borderRadius &&
        props.sectionImage.styles.borderRadius !== "default",
      )
        ? "hidden"
        : undefined,
  };
  const sectionImageStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: props.sectionImage.aspectRatio > 0 ? "100%" : "auto",
    objectFit:
      props.sectionImage.imageConstrain === "filled" ? "cover" : "contain",
  };

  return (
    <AnalyticsScopeProvider
      name={`CafeAndCoffeeShopOfferings${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={Boolean(props.puck?.isEditing)}
      >
        <div className="cafe-scope no-touchevents page-caffeine" dir="ltr">
          <style>{CafeAndCoffeeShopStyles}</style>
          <Background
            as="section"
            className="local-section split-sections section-offerings"
            aria-label={t("fields.offerings", "Offerings")}
            background={props.section.backgroundColor}
            style={sectionStyle}
          >
            <article
              className={`split split--text-left${hasSectionImage ? "" : " split--no-image"}`}
            >
              <div
                className="split__panel split__panel--text split__panel--brown"
                style={{
                  backgroundColor: sectionStyle.backgroundColor,
                  color: sectionStyle.color,
                }}
              >
                <div className="split__offerings">
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={
                      props.heading.text.constantValueEnabled
                    }
                  >
                    <h2
                      className="split__title"
                      style={{
                        color: getThemeColorCssValue(props.heading.fontColor),
                        ...resolveTextStyles(props.heading.styles),
                      }}
                    >
                      {headingText}
                    </h2>
                  </EntityField>
                  <EntityField
                    displayName="Offerings"
                    fieldId={props.content.text.field}
                    constantValueEnabled={
                      props.content.text.constantValueEnabled
                    }
                  >
                    <ul className="split__offerings-list">
                      {items.map((item, index) => (
                        <li
                          key={`${index}-${resolveComponentData(item, locale, streamDocument) ?? "offering"}`}
                          style={{
                            color: getThemeColorCssValue(
                              props.content.fontColor,
                            ),
                            ...getBodyTextStyle(props.content.styles),
                          }}
                        >
                          {resolveComponentData(item, locale, streamDocument) ??
                            ""}
                        </li>
                      ))}
                    </ul>
                  </EntityField>
                </div>
              </div>
              {hasSectionImage ? (
                <div className="split__panel split__panel--image">
                  <EntityField
                    displayName="Section Image"
                    fieldId={props.sectionImage.image.field}
                    constantValueEnabled={
                      props.sectionImage.image.constantValueEnabled
                    }
                  >
                    <div style={sectionImageWrapperStyle}>
                      <Image
                        image={sectionImage}
                        className="h-full"
                        style={sectionImageStyle}
                      />
                    </div>
                  </EntityField>
                </div>
              ) : null}
            </article>
          </Background>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CafeAndCoffeeShopOfferings: YextComponentConfig<CafeAndCoffeeShopOfferingsProps> =
  {
    label: msg("fields.offerings", "Offerings Section"),
    fields: CafeAndCoffeeShopOfferingsFields,
    defaultProps: CafeAndCoffeeShopOfferingsDefaultProps,
    render: (props) => (
      <TypographyScope>
        <CafeAndCoffeeShopOfferingsComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "CafeAndCoffeeShopOfferings",
  displayName: "Offerings Section",
  description: "Offerings",
  pageSetTypes: ["ENTITY"],
};
