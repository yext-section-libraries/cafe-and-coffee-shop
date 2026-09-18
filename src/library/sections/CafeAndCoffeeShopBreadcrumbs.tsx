import type { SectionConfig } from "@yext/visual-editor";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { AnalyticsScopeProvider, Link } from "@yext/pages-components";
import {
  msg,
  EntityField,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  isDarkColor,
  pt,
  resolveBreadcrumbs,
  resolveComponentData,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableString,
  useDocument,
  useTemplateProps,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  createTextField,
  defaultTextStyles,
  getStyledTextStyle,
} from "../shared/sectionHelpers";

const CafeAndCoffeeShopStyles = String.raw`
p {
  font-family: var(--fontFamily-body-fontFamily);
  font-size: var(--fontSize-body-fontSize);
  line-height: 1.5;
  font-weight: var(--fontWeight-body-fontWeight);
  font-style: var(--fontStyle-body-fontStyle);
  text-transform: var(--textTransform-body-textTransform);
}
li {
  font-family: var(--fontFamily-body-fontFamily);
  font-size: var(--fontSize-body-fontSize);
  line-height: 1.5;
  font-weight: var(--fontWeight-body-fontWeight);
  font-style: var(--fontStyle-body-fontStyle);
  text-transform: var(--textTransform-body-textTransform);
}
h1 {
  font-family: var(--fontFamily-h1-fontFamily);
  font-size: var(--fontSize-h1-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h1-fontWeight);
  font-style: var(--fontStyle-h1-fontStyle);
  text-transform: var(--textTransform-h1-textTransform);
}
h2 {
  font-family: var(--fontFamily-h2-fontFamily);
  font-size: var(--fontSize-h2-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h2-fontWeight);
  font-style: var(--fontStyle-h2-fontStyle);
  text-transform: var(--textTransform-h3-textTransform);
}
h3 {
  font-family: var(--fontFamily-h3-fontFamily);
  font-size: var(--fontSize-h3-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h3-fontWeight);
  font-style: var(--fontStyle-h3-fontStyle);
  text-transform: var(--textTransform-h3-textTransform);
}
h4 {
  font-family: var(--fontFamily-h4-fontFamily);
  font-size: var(--fontSize-h4-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h4-fontWeight);
  font-style: var(--fontStyle-h4-fontStyle);
  text-transform: var(--textTransform-h4-textTransform);
}
h5 {
  font-family: var(--fontFamily-h5-fontFamily);
  font-size: var(--fontSize-h5-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h5-fontWeight);
  font-style: var(--fontStyle-h5-fontStyle);
  text-transform: var(--textTransform-h5-textTransform);
}
h6 {
  font-family: var(--fontFamily-h6-fontFamily);
  font-size: var(--fontSize-h6-fontSize);
  line-height: 1.2;
  font-weight: var(--fontWeight-h6-fontWeight);
  font-style: var(--fontStyle-h6-fontStyle);
  text-transform: var(--textTransform-h6-textTransform);
}
a, button {
  font-family: var(--fontFamily-link-fontFamily);
  font-size: var(--fontSize-link-fontSize);
  font-weight: var(--fontWeight-link-fontWeight);
  font-style: var(--fontStyle-link-fontStyle);
  line-height: 1.5;
  text-decoration: underline;
  text-transform: var(--textTransform-link-textTransform);
  letter-spacing: var(--letterSpacing-link-letterSpacing);
}
#breadcrumbs-section,
#breadcrumbs-section * {
  box-sizing: border-box;
}

#breadcrumbs-section {
  padding: 1rem 0;
  background: var(--cr-breadcrumbs-bg, #3b2416);
}

#breadcrumbs-section .breadcrumbs__wrap {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 40px;
}

#breadcrumbs-section .breadcrumbs__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.55rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

#breadcrumbs-section .breadcrumbs__item {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
}

#breadcrumbs-section .breadcrumbs__link,
#breadcrumbs-section .breadcrumbs__current {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 500;
  letter-spacing: 0.08em;
}

#breadcrumbs-section .breadcrumbs__link {
  color: inherit;
  text-decoration: none;
}

.cafe-scope.no-touchevents #breadcrumbs-section .breadcrumbs__link:hover,
.cafe-scope.no-touchevents #breadcrumbs-section .breadcrumbs__link:focus-visible {
  text-decoration: underline;
  text-underline-offset: 3px;
  outline: none;
}

#breadcrumbs-section .breadcrumbs__separator {
  display: inline-flex;
  align-items: center;
  opacity: 0.72;
  font-size: 12px;
  line-height: 1;
}

#breadcrumbs-section .breadcrumbs__empty {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
  opacity: 0.88;
}

@media (max-width: 1023px) {
  #breadcrumbs-section .breadcrumbs__wrap {
    padding-inline: 30px;
  }
}

@media (max-width: 700px) {
  #breadcrumbs-section {
    padding: 0.85rem 0;
  }

  #breadcrumbs-section .breadcrumbs__wrap {
    padding-inline: 14px;
  }

  #breadcrumbs-section .breadcrumbs__item {
    gap: 0.45rem;
  }

  #breadcrumbs-section .breadcrumbs__link,
  #breadcrumbs-section .breadcrumbs__current {
    font-size: 12px;
    letter-spacing: 0.06em;
  }
}`;

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type BreadcrumbStreamDocument = StreamDocument & {
  name?: string;
  address?: {
    line1?: string;
  };
};

type BreadcrumbItem = {
  name: string;
  slug: string;
};

export type CafeAndCoffeeShopBreadcrumbsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  rootLabel: StyledTextProps;
  currentLocation: {
    includeCurrentLocation: boolean;
    label: StyledTextProps;
  };
};

const resolveTextValue = (
  value: YextEntityField<TranslatableString>,
  locale: string,
  streamDocument: BreadcrumbStreamDocument,
  fallback = "",
) => resolveComponentData(value, locale, streamDocument)?.trim() || fallback;

export const CafeAndCoffeeShopBreadcrumbsFields: YextFields<CafeAndCoffeeShopBreadcrumbsProps> =
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
    rootLabel: {
      label: msg("fields.rootLabel", "Root Label"),
      type: "object",
      objectFields: {
        text: {
          type: "entityField",
          label: msg("fields.text", "Text"),
          filter: {
            types: ["type.string"],
          },
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
    currentLocation: {
      label: msg("fields.currentLocation", "Current Location"),
      type: "object",
      objectFields: {
        includeCurrentLocation: {
          label: msg("fields.includeCurrentLocation", "Include Current Location"),
          type: "radio",
          options: [
            { label: msg("fields.options.yes", "Yes"), value: true },
            { label: msg("fields.options.no", "No"), value: false },
          ],
        },
        label: {
          label: msg("fields.label", "Label"),
          type: "object",
          objectFields: {
            text: {
              type: "entityField",
              label: msg("fields.text", "Text"),
              filter: {
                types: ["type.string"],
              },
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

export const CafeAndCoffeeShopBreadcrumbsDefaultProps: CafeAndCoffeeShopBreadcrumbsProps =
  {
    section: {
      backgroundColor: {
        selectedColor: "palette-primary",
        contrastingColor: "palette-primary-contrast",
      },
      visibleOnLivePage: true,
    },
    rootLabel: {
      text: createTextField("All Locations"),
      styles: defaultTextStyles,
      fontColor: undefined,
    },
    currentLocation: {
      includeCurrentLocation: true,
      label: {
        text: createTextField("", "name", false),
        styles: defaultTextStyles,
        fontColor: {
          selectedColor: "palette-secondary",
          contrastingColor: "palette-secondary-contrast",
        },
      },
    },
  };

const CafeAndCoffeeShopBreadcrumbsComponent = (
  props: CafeAndCoffeeShopBreadcrumbsProps & {
    id?: string;
    puck?: {
      isEditing?: boolean;
    };
  },
) => {
  const { t } = useTranslation();
  const streamDocument = useDocument<BreadcrumbStreamDocument>();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const locale = streamDocument?.locale ?? "en";
  const breadcrumbs = resolveBreadcrumbs(streamDocument) as BreadcrumbItem[];
  const sectionStyle = getSurfaceColorStyle(
    props.section.backgroundColor,
    streamDocument,
    { fallbackBackgroundColor: "#3B2416" },
  );
  const sectionTextColor = sectionStyle?.color ??
    (isDarkColor(props.section.backgroundColor, streamDocument)
      ? "#FFFFFF"
      : "#000000");
  const rootLabel = resolveTextValue(
    props.rootLabel.text,
    locale,
    streamDocument,
    breadcrumbs[0]?.name ?? "All Locations",
  );
  const currentPageLabel =
    resolveTextValue(
      props.currentLocation.label.text,
      locale,
      streamDocument,
      "",
    ) ||
    streamDocument.address?.line1 ||
    streamDocument.name ||
    breadcrumbs[breadcrumbs.length - 1]?.name ||
    "";
  const visibleBreadcrumbs =
    props.currentLocation.includeCurrentLocation || breadcrumbs.length <= 1
      ? breadcrumbs
      : breadcrumbs.slice(0, -1);
  const currentBreadcrumbSlug = breadcrumbs[breadcrumbs.length - 1]?.slug;
  const separatorColor =
    getThemeColorCssValue(props.currentLocation.label.fontColor) ??
    sectionTextColor;

  if (!breadcrumbs.length) {
    return props.puck?.isEditing ? (
      <p
        style={{
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "18px 24px",
        }}
      >
        {pt(
          "noBreadcrumbs",
          "No breadcrumbs available (section will be hidden on live page). Create a directory to enable breadcrumbs.",
        )}
      </p>
    ) : (
      <></>
    );
  }

  return (
    <AnalyticsScopeProvider
      name={`CafeAndCoffeeShopBreadcrumbs${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={Boolean(props.puck?.isEditing)}
      >
        <div className="cafe-scope no-touchevents page-caffeine" dir="ltr">
          <style>{CafeAndCoffeeShopStyles}</style>
          <section
            id="breadcrumbs-section"
            aria-label={t("components.breadcrumbs", "Breadcrumbs")}
            style={sectionStyle}
          >
            <div className="breadcrumbs__wrap">
              {visibleBreadcrumbs.length ? (
                <ol className="breadcrumbs__list">
                  {visibleBreadcrumbs.map((breadcrumb, index) => {
                    const isRoot = index === 0;
                    const isCurrentPage =
                      props.currentLocation.includeCurrentLocation &&
                      breadcrumb.slug === currentBreadcrumbSlug &&
                      index === visibleBreadcrumbs.length - 1;
                    const href = relativePrefixToRoot
                      ? relativePrefixToRoot + breadcrumb.slug
                      : breadcrumb.slug;
                    const label = isRoot
                      ? rootLabel
                      : isCurrentPage
                        ? currentPageLabel
                        : breadcrumb.name;
                    const textStyles = isCurrentPage
                      ? getStyledTextStyle(
                          props.currentLocation.label.styles,
                          props.currentLocation.label.fontColor,
                          sectionTextColor,
                        )
                      : isRoot
                        ? getStyledTextStyle(
                            props.rootLabel.styles,
                            props.rootLabel.fontColor,
                            sectionTextColor,
                          )
                        : { color: sectionTextColor };

                    return (
                      <li
                        className="breadcrumbs__item"
                        key={`${breadcrumb.slug}-${index}`}
                      >
                        {index > 0 ? (
                          <span
                            aria-hidden
                            className="breadcrumbs__separator"
                            style={{ color: separatorColor }}
                          >
                            /
                          </span>
                        ) : null}
                        {isCurrentPage ? (
                          <EntityField
                            displayName="Current Location"
                            fieldId={props.currentLocation.label.text.field}
                            constantValueEnabled={
                              props.currentLocation.label.text
                                .constantValueEnabled
                            }
                          >
                            <span
                              aria-current="page"
                              className="breadcrumbs__current"
                              style={textStyles}
                            >
                              {label}
                            </span>
                          </EntityField>
                        ) : isRoot ? (
                          <EntityField
                            displayName="Root Label"
                            fieldId={props.rootLabel.text.field}
                            constantValueEnabled={
                              props.rootLabel.text.constantValueEnabled
                            }
                          >
                            <Link
                              className="breadcrumbs__link"
                              eventName={`breadcrumb${index}`}
                              href={href}
                              style={textStyles}
                            >
                              {label}
                            </Link>
                          </EntityField>
                        ) : (
                          <Link
                            className="breadcrumbs__link"
                            eventName={`breadcrumb${index}`}
                            href={href}
                            style={textStyles}
                          >
                            {label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              ) : props.puck?.isEditing ? (
                <p
                  className="breadcrumbs__empty"
                  style={{
                    color: sectionTextColor,
                    fontFamily: "Arial, Helvetica, sans-serif",
                    padding: "18px 24px",
                  }}
                >
                  {pt(
                    "noBreadcrumbs",
                    "No breadcrumbs available (section will be hidden on live page). Create a directory to enable breadcrumbs.",
                  )}
                </p>
              ) : (
                <></>
              )}
            </div>
          </section>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CafeAndCoffeeShopBreadcrumbs: YextComponentConfig<CafeAndCoffeeShopBreadcrumbsProps> =
  {
    label: msg("components.breadcrumbs", "Breadcrumbs"),
    fields: CafeAndCoffeeShopBreadcrumbsFields,
    defaultProps: CafeAndCoffeeShopBreadcrumbsDefaultProps,
    render: (props) => <CafeAndCoffeeShopBreadcrumbsComponent {...props} />,
  };

export const config: SectionConfig = {
  id: "CafeAndCoffeeShopBreadcrumbs",
  displayName: "Breadcrumbs",
  description: "Breadcrumbs",
  pageSetTypes: ["ENTITY"],
};
