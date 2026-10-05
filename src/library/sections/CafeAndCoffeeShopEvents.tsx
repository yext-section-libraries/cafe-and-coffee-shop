import { CafeCTA } from "../shared/CafeCTA";
import { CafeRichText, TypographyScope } from "../shared/typography";
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
  isDarkColor,
  resolveComponentData,
  type StreamDocument,
  type StyledImageValue,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableAssetImage,
  type TranslatableRichText,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
  ComprehensiveCTAValue,
} from "@yext/visual-editor";
import {
  createRtfField,
  createTextField,
  createTranslatableString,
  defaultTextStyles,
  getStyledTextStyle,
  hasExplicitCtaColor,
  hasImageSource,
  resolveTextFieldValue,
} from "../shared/sectionHelpers";

type EventsImageProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

type CtaColorState = {
  styles?: {
    variant?: string | null;
    color?: ThemeColor;
  };
};

export type CafeAndCoffeeShopEventsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  sectionImage: EventsImageProps;
  content: {
    paragraphs: {
      text: YextEntityField<TranslatableRichText>;
      fontColor?: ThemeColor;
    };
    button: any;
  };
};

const eventImageUrl =
  "https://a.mktgcdn.com/p/fbSbItkZpsHpkc8qHH7GxvQkWzxsfm6mGc0k4Lmfl-A/1267x1900.jpg";

const defaultImageStyles: StyledImageValue = {
  borderRadius: "default",
};

const createImageField = (
  url: string,
  width: number,
  height: number,
  altText: string,
): EventsImageProps => ({
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
#events-section,
#events-section * {
  box-sizing: border-box;
}

#events-section .button {
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

.cafe-scope.no-touchevents #events-section .button.button--has-fill:hover,
.cafe-scope.no-touchevents #events-section .button.button--has-fill:focus-visible {
  background-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  border-color: color-mix(in srgb, var(--cr-cta-bg) 84%, var(--cr-cta-color) 16%) !important;
  color: var(--cr-cta-color) !important;
  outline: none;
}

#events-section {
  margin: 0;
  padding-block: 0;
  padding-inline: 0;
}

#events-section .events__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  width: min(100%, 1440px);
  margin: 0 auto;
}

#events-section .events__grid.events__grid--no-image {
  grid-template-columns: 1fr;
}

#events-section .events__panel {
  min-height: 100%;
}

#events-section .events__panel--text {
  display: flex;
  align-items: center;
  padding: clamp(2.5rem, 4vw, 3.5rem);
}

#events-section .events__content {
  width: 100%;
  max-width: 34rem;
  margin: 0 auto;
}

#events-section .events__title {
  margin: 0 0 2rem;
  text-align: left;
}

#events-section .events__panel--text p {
  margin: 0 0 1rem;
}

#events-section .events__panel--text p:last-of-type {
  margin-bottom: 0;
}

#events-section .events__cta {
  margin-top: 2rem;
  width: auto;
}

#events-section .events__panel--image {
  width: 100%;
  height: 100%;
  display: flex;
}

#events-section .events__panel--image > div {
  width: 100%;
  height: 100%;
}

#events-section .events__panel--image img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
}

@media (max-width: 1023px) {
  #events-section {
    padding-inline: 30px;
  }

  #events-section .events__grid {
    grid-template-columns: 1fr;
  }

  #events-section .events__panel--text {
    padding: 2.5rem 0;
  }

  #events-section .events__content {
    max-width: 100%;
    margin: 0;
  }

  #events-section .events__panel--image {
    width: calc(100% + 60px);
    margin-inline: -30px;
  }

  #events-section .events__panel--image img {
    height: auto;
  }
}

@media (max-width: 700px) {
  #events-section {
    padding-inline: 14px;
  }

  #events-section .events__panel--image {
    width: calc(100% + 28px);
    margin-inline: -14px;
  }
}
`;

const imageFields = (stylesLabel: string): YextFields<EventsImageProps> => ({
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

const defaultContent = {
  paragraphs: {
    text: createRtfField(
      "Bring your crew together for birthdays, office parties, and laid-back celebrations in a warm neighborhood setting. Our team can help you plan food, drinks, and space that fit the vibe of your group.",
    ),
    fontColor: undefined,
  },
  button: {
    data: {
      actionType: "link",
      cta: {
        field: "",
        constantValue: {
          label: {
            defaultValue: "Plan Your Event",
          },
          link: {
            defaultValue: "#",
          },
          normalizeLink: true,
          openInNewTab: false,
        },
        constantValueEnabled: true,
      },
      openInNewTab: false,
    },
    styles: {
      variant: "secondary",
      color: undefined,
      button: {
        fontFamily: "default",
        fontSize: "default",
        fontWeight: "default",
        fontStyle: "default",
        textTransform: "default",
        letterSpacing: "default",
        borderRadius: "default",
      },
    },
  } satisfies ComprehensiveCTAValue,
};

const getEventsCtaClassName = (cta: unknown) => {
  const variant = (cta as { styles?: { variant?: string } }).styles?.variant;

  if (variant === "link") {
    return undefined;
  }

  return variant === "outline" || variant === "secondary"
    ? "button button--outline"
    : "button button--has-fill";
};

const getEventsCtaStyle = (
  cta: CtaColorState,
  backgroundColor: ThemeColor,
  streamDocument?: StreamDocument,
): React.CSSProperties | undefined => {
  const variant = cta.styles?.variant as string | undefined;

  if (
    (variant !== "outline" && variant !== "secondary") ||
    hasExplicitCtaColor(cta)
  ) {
    return undefined;
  }

  const fallbackOutlineColor = isDarkColor(backgroundColor, streamDocument)
    ? "white"
    : "black";

  return {
    color: fallbackOutlineColor,
    borderColor: fallbackOutlineColor,
  };
};

export const CafeAndCoffeeShopEventsFields: YextFields<CafeAndCoffeeShopEventsProps> =
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
    sectionImage: {
      label: msg("fields.sectionImage", "Section Image"),
      type: "object",
      objectFields: imageFields(
        msg("fields.sectionImageStyles", "Section Image Styles"),
      ),
    },
    content: {
      label: msg("fields.content", "Content"),
      type: "object",
      objectFields: {
        paragraphs: {
          label: msg("fields.paragraphs", "Paragraphs"),
          type: "object",
          objectFields: {
            text: {
              label: msg("fields.text", "Text"),
              type: "entityField",
              filter: {
                types: ["type.rich_text_v2"],
              },
              disableConstantValueToggle: false,
            },
            fontColor: {
              label: msg("fields.fontColor", "Font Color"),
              type: "basicSelector",
              options: "SITE_COLOR",
            },
          },
        },
        button: {
          label: msg("fields.options.button", "Button"),
          type: "comprehensiveCTA",
        },
      },
    },
  };

export const CafeAndCoffeeShopEventsDefaultProps: CafeAndCoffeeShopEventsProps =
  {
    section: {
      backgroundColor: {
        selectedColor: "palette-tertiary",
        contrastingColor: "palette-tertiary-contrast",
      },
      visibleOnLivePage: true,
    },
    heading: {
      text: createTextField("Host Your Next Group Event"),
      styles: defaultTextStyles,
      fontColor: undefined,
    },
    sectionImage: createImageField(eventImageUrl, 1267, 1900, "Event image"),
    content: defaultContent,
  };

const CafeAndCoffeeShopEventsComponent = (
  props: CafeAndCoffeeShopEventsProps & {
    id?: string;
    puck?: {
      isEditing?: boolean;
    };
  },
) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocument>();
  const locale = i18n.language;
  const isEditing = Boolean(props.puck?.isEditing);
  const sectionStyle =
    getSurfaceColorStyle(props.section.backgroundColor, streamDocument) ?? {};
  const sectionForeground = sectionStyle.color;
  const sectionImage = resolveComponentData(
    props.sectionImage.image,
    locale,
    streamDocument,
  ) as ImageType | ComplexImageType | TranslatableAssetImage | undefined;
  const hasSectionImage = hasImageSource(sectionImage);
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
  const richTextStyleOverrides = {
    color:
      getThemeColorCssValue(props.content.paragraphs.fontColor) ??
      sectionForeground,
  };
  const resolvedParagraphs = resolveComponentData(
    props.content.paragraphs.text,
    locale,
    streamDocument,
  );

  return (
    <AnalyticsScopeProvider
      name={`CafeAndCoffeeShopEvents${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={isEditing}
      >
        <div className="cafe-scope no-touchevents page-caffeine" dir="ltr">
          <style>{CafeAndCoffeeShopStyles}</style>
          <Background
            id="events-section"
            className="local-section section-events"
            aria-label={t("groupEvents", "Group Events")}
            background={props.section.backgroundColor}
            style={sectionStyle}
          >
            <div
              className={`events__grid${hasSectionImage ? "" : " events__grid--no-image"}`}
            >
              <article
                className="events__panel events__panel--text"
                style={{
                  backgroundColor: sectionStyle.backgroundColor,
                  color: sectionForeground,
                }}
              >
                <div className="events__content">
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={
                      props.heading.text.constantValueEnabled
                    }
                  >
                    <h2
                      className="events__title"
                      style={{
                        ...getStyledTextStyle(
                          props.heading.styles,
                          props.heading.fontColor,
                        ),
                        color:
                          getThemeColorCssValue(props.heading.fontColor) ??
                          sectionForeground,
                      }}
                    >
                      {resolveTextFieldValue(
                        props.heading.text,
                        locale,
                        streamDocument,
                        "Host Your Next Group Event",
                      )}
                    </h2>
                  </EntityField>
                  <div
                    style={{
                      color: sectionForeground,
                    }}
                  >
                    <EntityField
                      displayName="Paragraphs"
                      fieldId={props.content.paragraphs.text.field}
                      constantValueEnabled={
                        props.content.paragraphs.text.constantValueEnabled
                      }
                    >
                      {React.isValidElement(resolvedParagraphs) ? (
                        <CafeRichText data={resolvedParagraphs} richTextStyleOverrides={richTextStyleOverrides} />
                      ) : typeof resolvedParagraphs === "string" ? (
                        <CafeRichText
                          data={resolvedParagraphs}
                          richTextStyleOverrides={richTextStyleOverrides}
                        />
                      ) : null}
                    </EntityField>
                  </div>
                  <div className="events__cta">
                    <EntityField
                      displayName="Button"
                      fieldId={props.content.button.data.cta.field}
                      constantValueEnabled={
                        props.content.button.data.cta.constantValueEnabled
                      }
                    >
                      <CafeCTA
                        value={props.content.button}
                        className={getEventsCtaClassName(props.content.button)}
                        style={getEventsCtaStyle(
                          props.content.button,
                          props.section.backgroundColor,
                          streamDocument,
                        )}
                      />
                    </EntityField>
                  </div>
                </div>
              </article>
              {hasSectionImage ? (
                <article className="events__panel events__panel--image">
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
                </article>
              ) : null}
            </div>
          </Background>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CafeAndCoffeeShopEvents: YextComponentConfig<CafeAndCoffeeShopEventsProps> =
  {
    label: msg("components.eventsSection", "Events Section"),
    fields: CafeAndCoffeeShopEventsFields,
    defaultProps: CafeAndCoffeeShopEventsDefaultProps,
    render: (props) => (
      <TypographyScope>
        <CafeAndCoffeeShopEventsComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "CafeAndCoffeeShopEvents",
  displayName: "Events Section",
  description: "Events",
  pageSetTypes: ["ENTITY"],
};
