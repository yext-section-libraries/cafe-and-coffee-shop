import { CafeRichText, TypographyScope } from "../shared/typography";
import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import type { ComplexImageType, ImageType } from "@yext/pages-components";
import {
  Background,
  EntityField,
  Image,
  getAnalyticsScopeHash,
  getThemeColorCssValue,
  getSurfaceColorStyle,
  msg,
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
} from "@yext/visual-editor";
import { PuckComponent } from "@puckeditor/core";
import {
  createRtfField,
  createTextField,
  createTranslatableString,
  defaultTextStyles,
  getStyledTextStyle,
  hasImageSource,
  resolveTextFieldValue,
} from "../shared/sectionHelpers";

type AboutImageProps = {
  image: YextEntityField<ImageType | ComplexImageType | TranslatableAssetImage>;
  aspectRatio: number;
  imageConstrain: "fixed" | "filled";
  styles?: StyledImageValue;
};

export type CafeAndCoffeeShopAboutProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor: ThemeColor | undefined;
  };
  sectionImage: AboutImageProps;
  content: {
    text: YextEntityField<TranslatableRichText>;
    fontColor?: ThemeColor;
  };
};

const aboutImageUrl =
  "https://a.mktgcdn.com/p/UHR6VTEvcR-yDMqPSOS7LyK87Qt56EOrmfNbhLQxI08/1267x1900.jpg";

const defaultImageStyles: StyledImageValue = {
  borderRadius: "default",
};

const createImageField = (
  url: string,
  width: number,
  height: number,
  altText: string,
): AboutImageProps => ({
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

.cafe-scope .section-offerings .split--text-right,
.cafe-scope .section-offerings .split--text-right * {
  box-sizing: border-box;
}

.cafe-scope .section-offerings {
  padding-inline: 0;
}

.cafe-scope .section-offerings .split--text-right {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  width: min(100%, 1440px);
  margin: 0 auto;
}

.cafe-scope .section-offerings .split--text-right.split--no-image {
  grid-template-columns: 1fr;
}

.cafe-scope .section-offerings .split--text-right .split__panel {
  min-height: 100%;
}

.cafe-scope .section-offerings .split--text-right .split__panel--image img {
  width: 100%;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
  display: block;
}

.cafe-scope .section-offerings .split--text-right .split__panel--text {
  display: flex;
  align-items: center;
  padding: clamp(2.5rem, 4vw, 3.75rem);
}

.cafe-scope .section-offerings .split--text-right .split__body {
  width: 100%;
  max-width: 34rem;
  margin: 0 auto;
}

.cafe-scope .section-offerings .split--text-right .split__title {
  margin: 0 0 2rem;
}

.cafe-scope .section-offerings .split--text-right .split__body p {
  margin: 0 0 1rem;
}

.cafe-scope .section-offerings .split--text-right .split__body p:last-child {
  margin-bottom: 0;
}

@media (max-width: 1023px) {
  .cafe-scope .section-offerings {
    padding-inline: 30px;
  }

  .cafe-scope .section-offerings .split--text-right {
    grid-template-columns: 1fr;
  }

  .cafe-scope .section-offerings .split--text-right .split__panel--image {
    order: 2;
  }

  .cafe-scope .section-offerings .split--text-right .split__panel--text {
    order: 1;
  }

  .cafe-scope .section-offerings .split--text-right .split__panel--text {
    padding: 2.5rem 0;
  }

  .cafe-scope .section-offerings .split--text-right .split__body {
    max-width: 100%;
    margin: 0;
  }

  .cafe-scope .section-offerings .split--text-right .split__panel--image {
    width: calc(100% + 60px);
    margin-inline: -30px;
  }
}

@media (max-width: 700px) {
  .cafe-scope .section-offerings {
    padding-inline: 14px;
  }

  .cafe-scope .section-offerings .split--text-right .split__panel--image {
    width: calc(100% + 28px);
    margin-inline: -14px;
  }
}
`;

const imageFields = (stylesLabel: string): YextFields<AboutImageProps> => ({
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

const defaultHeading: CafeAndCoffeeShopAboutProps["heading"] = {
  text: createTextField("About Lorem Ipsum"),
  styles: defaultTextStyles,
  fontColor: undefined,
};

const defaultContent: CafeAndCoffeeShopAboutProps["content"] = {
  text: createRtfField(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec luctus, urna eu feugiat efficitur, metus lectus fermentum magna, in suscipit lectus risus sed massa. Integer at eros non sapien gravida aliquet. Praesent vitae sem et ipsum sagittis scelerisque. Sed volutpat, nibh vitae fermentum ultricies, odio nunc condimentum tellus, vitae fringilla velit mi sed justo. Curabitur sodales libero vel augue sollicitudin, vitae mollis tortor pretium. Mauris pulvinar, felis nec interdum lacinia, nisl lorem gravida tellus, vitae eleifend massa lorem nec risus. Nunc aliquet ligula at dui ultrices, eget pharetra nunc pellentesque.",
  ),
  fontColor: undefined,
};

export const CafeAndCoffeeShopAboutFields: YextFields<CafeAndCoffeeShopAboutProps> =
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
      label: msg("fields.image", "Image"),
      type: "object",
      objectFields: imageFields(msg("fields.imageStyles", "Image Styles")),
    },
    content: {
      label: msg("fields.content", "Content"),
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
  };

export const CafeAndCoffeeShopAboutDefaultProps: CafeAndCoffeeShopAboutProps = {
  section: {
    backgroundColor: {
      selectedColor: "palette-secondary",
      contrastingColor: "palette-secondary-contrast",
    },
    visibleOnLivePage: true,
  },
  heading: defaultHeading,
  sectionImage: createImageField(aboutImageUrl, 1267, 1900, "About image"),
  content: defaultContent,
};

const CafeAndCoffeeShopAboutComponent: PuckComponent<
  CafeAndCoffeeShopAboutProps
> = (props) => {
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
  const richTextStyleOverrides = {
    color: getThemeColorCssValue(props.content.fontColor) ?? sectionStyle.color,
  };
  const resolvedContent = resolveComponentData(
    props.content.text,
    locale,
    streamDocument,
  );
  const maybeRichText =
    typeof resolvedContent === "string" ||
    React.isValidElement(resolvedContent) ? (
      React.isValidElement(resolvedContent) ? (
        <CafeRichText data={resolvedContent} richTextStyleOverrides={richTextStyleOverrides} />
      ) : (
        <CafeRichText
          data={resolvedContent}
          richTextStyleOverrides={richTextStyleOverrides}
        />
      )
    ) : null;

  return (
    <AnalyticsScopeProvider
      name={`CafeAndCoffeeShopAbout${getAnalyticsScopeHash(props.id ?? "default")}`}
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
            aria-label={t("components.about", "About")}
            background={props.section.backgroundColor}
            style={sectionStyle}
          >
            <article
              className={`split split--text-right${hasSectionImage ? "" : " split--no-image"}`}
            >
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
              <div
                className="split__panel split__panel--text split__panel--navy"
                style={{
                  backgroundColor: sectionStyle.backgroundColor,
                  color: sectionStyle.color,
                }}
              >
                <div className="split__body">
                  <EntityField
                    displayName="Heading"
                    fieldId={props.heading.text.field}
                    constantValueEnabled={
                      props.heading.text.constantValueEnabled
                    }
                  >
                    <h2
                      className="split__title"
                      style={getStyledTextStyle(
                        props.heading.styles,
                        props.heading.fontColor,
                      )}
                    >
                      {headingText}
                    </h2>
                  </EntityField>
                  <div
                    style={{
                      color: sectionStyle.color,
                    }}
                  >
                    <EntityField
                      displayName="Content"
                      fieldId={props.content.text.field}
                      constantValueEnabled={
                        props.content.text.constantValueEnabled
                      }
                    >
                      {maybeRichText}
                    </EntityField>
                  </div>
                </div>
              </div>
            </article>
          </Background>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CafeAndCoffeeShopAbout: YextComponentConfig<CafeAndCoffeeShopAboutProps> =
  {
    label: msg("components.aboutLabel", "About"),
    fields: CafeAndCoffeeShopAboutFields,
    defaultProps: CafeAndCoffeeShopAboutDefaultProps,
    render: (props) => (
      <TypographyScope>
        <CafeAndCoffeeShopAboutComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "CafeAndCoffeeShopAbout",
  displayName: "About",
  description: "About",
  pageSetTypes: ["ENTITY"],
};
