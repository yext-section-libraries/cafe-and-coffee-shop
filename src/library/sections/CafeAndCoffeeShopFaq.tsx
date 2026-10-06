import { CafeRichText, TypographyScope, resolveTextStyles } from "../shared/typography";
import type { SectionConfig } from "@yext/visual-editor";

import type { PuckComponent } from "@puckeditor/core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { AnalyticsScopeProvider } from "@yext/pages-components";
import {
  msg,
  Background,
  createItemSource,
  getAnalyticsScopeHash,
  getSurfaceColorStyle,
  getThemeColorCssValue,
  resolveComponentData,
  type StreamDocument,
  type StyledTextValue,
  type ThemeColor,
  type TranslatableRichText,
  type TranslatableString,
  useDocument,
  VisibilityWrapper,
  type YextComponentConfig,
  EntityField,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import {
  createRtfField,
  createTextField,
  defaultTextStyles,
  getStyledTextStyle,
  resolveTextFieldValue,
  resolveTranslatableStringValue,
} from "../shared/sectionHelpers";

const CafeAndCoffeeShopStyles = String.raw`
#faqs-section,
#faqs-section * {
  box-sizing: border-box;
}

#faqs-section {
  padding: clamp(2.5rem, 4vw, 3.75rem) 0;
  min-height: 0 !important;
  height: auto !important;
  margin-bottom: 0 !important;
  background: var(--cr-faq-bg, #be865c);
}

#faqs-section .faqs__wrap {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 40px;
}

#faqs-section .faqs__heading {
  margin: 0 0 2rem;
  text-align: center;
  color: var(--cr-faq-heading);
}

#faqs-section .faqs__list {
  border: 2px solid rgba(88, 61, 40, 0.42);
  border-radius: 32px;
  overflow: hidden;
  background: transparent;
}

#faqs-section .faqs__item {
  border-top: 1px solid rgba(88, 61, 40, 0.42);
  transition:
    background-color 0.28s ease,
    border-color 0.28s ease;
  overflow: hidden;
}

#faqs-section .faqs__item:first-child {
  border-top: 0;
}

#faqs-section .faqs__trigger {
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
  padding: clamp(1.15rem, 1.8vw, 1.5rem) clamp(1.15rem, 2.2vw, 2rem) clamp(1.15rem, 1.8vw, 1.5rem) clamp(2.65rem, 3.4vw, 3rem);
  position: relative;
  text-decoration: none;
  transition: color 0.28s ease;
}

#faqs-section .faqs__label {
  display: block;
}

#faqs-section .faqs__icon {
  position: absolute;
  left: clamp(1rem, 1.3vw, 1.15rem);
  top: 50%;
  width: 16px;
  height: 16px;
  transform: translateY(-50%);
}

#faqs-section .faqs__icon::before,
#faqs-section .faqs__icon::after {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  width: 16px;
  height: 1.5px;
  background: currentColor;
  opacity: 0.7;
  transform: translateY(-50%);
}

#faqs-section .faqs__icon::after {
  transform: translateY(-50%) rotate(90deg);
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

#faqs-section .faqs__item.is-open .faqs__icon::after {
  transform: translateY(-50%) rotate(0);
}

#faqs-section .faqs__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

#faqs-section .faqs__item.is-open .faqs__panel {
  grid-template-rows: 1fr;
}

#faqs-section .faqs__panel-inner {
  min-height: 0;
  overflow: hidden;
}

#faqs-section .faqs__answer {
  padding: 0 clamp(1.15rem, 2.2vw, 2rem) 0 clamp(2.65rem, 3.4vw, 3rem);
  opacity: 0;
  transform: translateY(-6px);
  transition:
    padding 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.24s ease,
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
}

#faqs-section .faqs__item.is-open .faqs__answer {
  padding: 0 clamp(1.15rem, 2.2vw, 2rem) clamp(1.15rem, 1.8vw, 1.5rem) clamp(2.65rem, 3.4vw, 3rem);
  opacity: 1;
  transform: translateY(0);
}

#faqs-section .faqs__answer > :first-child {
  margin-top: 0;
}

#faqs-section .faqs__answer > :last-child {
  margin-bottom: 0;
}

#faqs-section + .local-section-group-footer-group {
  margin-top: 0 !important;
}

@media (max-width: 1023px) {
  #faqs-section .faqs__wrap {
    padding-inline: 30px;
  }

  #faqs-section .faqs__heading {
    text-align: left;
  }
}

@media (max-width: 700px) {
  #faqs-section .faqs__wrap {
    padding-inline: 14px;
  }
}`;

type StyledTextProps = {
  text: YextEntityField<TranslatableString>;
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

type FaqItemProps = {
  question: YextEntityField<TranslatableString>;
  answer: YextEntityField<TranslatableRichText>;
};

type TextAppearance = {
  styles: StyledTextValue;
  fontColor?: ThemeColor;
};

const faqSource = createItemSource<FaqItemProps>({
  label: msg("fields.faqs", "FAQs"),
  mappingFields: {
    question: {
      label: msg("fields.question", "Question"),
      type: "entityField",
      filter: {
        types: ["type.string"],
      },
    },
    answer: {
      label: msg("fields.answer", "Answer"),
      type: "entityField",
      filter: {
        types: ["type.rich_text_v2"],
      },
    },
  },
  defaultValues: [
    {
      question: createTextField(
        "Are your dining hours the same as takeout hours?",
      ),
      answer: createRtfField(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer feugiat interdum ante, eu convallis nibh feugiat a. Suspendisse potenti.",
      ),
    },
    {
      question: createTextField("Can I order online?"),
      answer: createRtfField(
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Nulla facilisi.",
      ),
    },
    {
      question: createTextField("Do you take reservations?"),
      answer: createRtfField(
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
      ),
    },
    {
      question: createTextField("Do you offer vegetarian options?"),
      answer: createRtfField(
        "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. Mauris porta lorem ut felis fermentum.",
      ),
    },
  ],
});

type FaqStyles = {
  backgroundColor: ThemeColor;
  question: TextAppearance;
  answer: TextAppearance;
};

export type CafeAndCoffeeShopFaqProps = {
  section: {
    visibleOnLivePage: boolean;
    backgroundColor: ThemeColor;
  };
  heading: StyledTextProps;
  content: {
    faqs: typeof faqSource.value;
    styles: FaqStyles;
  };
};

const createStyledText = (
  text: string,
  fontColor: ThemeColor | undefined = undefined,
): StyledTextProps => ({
  text: createTextField(text),
  styles: defaultTextStyles,
  fontColor,
});

const createTextAppearance = (): TextAppearance => ({
  styles: defaultTextStyles,
  fontColor: undefined,
});

const createStyledTextFields = (): YextFields<StyledTextProps> => ({
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

const createTextAppearanceFields = (): YextFields<TextAppearance> => ({
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

const headingFields = createStyledTextFields();
const faqTextFields = createTextAppearanceFields();

export const CafeAndCoffeeShopFaqFields: YextFields<CafeAndCoffeeShopFaqProps> =
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
      objectFields: headingFields,
    },
    content: {
      label: msg("fields.content", "Content"),
      type: "object",
      objectFields: {
        faqs: {
          label: msg("fields.faqs", "FAQs"),
          ...faqSource.field,
        },
        styles: {
          label: msg("fields.styles", "Styles"),
          type: "object",
          objectFields: {
            backgroundColor: {
              label: msg("fields.backgroundColor", "Background Color"),
              type: "basicSelector",
              options: "BACKGROUND_COLOR",
            },
            question: {
              label: msg("fields.question", "Question"),
              type: "object",
              objectFields: faqTextFields,
            },
            answer: {
              label: msg("fields.answer", "Answer"),
              type: "object",
              objectFields: faqTextFields,
            },
          },
        },
      },
    },
  };

export const CafeAndCoffeeShopFaqDefaultProps: CafeAndCoffeeShopFaqProps = {
  section: {
    visibleOnLivePage: true,
    backgroundColor: {
      selectedColor: "palette-primary",
      contrastingColor: "palette-primary-contrast",
    },
  },
  heading: createStyledText("FAQs", undefined),
  content: {
    faqs: faqSource.defaultValue,
    styles: {
      backgroundColor: {
        selectedColor: "palette-primary",
        contrastingColor: "palette-primary-contrast",
      },
      question: createTextAppearance(),
      answer: createTextAppearance(),
    },
  },
};

const CafeAndCoffeeShopFaqComponent: PuckComponent<
  CafeAndCoffeeShopFaqProps
> = (props) => {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = React.useState(0);
  const streamDocument = useDocument<StreamDocument>();
  const locale = i18n.language;
  const sectionStyle =
    getSurfaceColorStyle(props.section.backgroundColor, streamDocument) ?? {};
  const resolvedFaqs = faqSource.resolveItems(
    props.content.faqs,
    streamDocument,
  );
  const sectionForeground = sectionStyle.color;

  const wrapperStyle: React.CSSProperties &
    Record<"--cr-faq-bg" | "--cr-faq-heading", string | undefined> = {
    "--cr-faq-bg": sectionStyle.backgroundColor,
    "--cr-faq-heading":
      getThemeColorCssValue(props.heading.fontColor) ?? sectionForeground,
  };

  const accordionBackgroundColor = getThemeColorCssValue(
    props.content.styles.backgroundColor,
  );
  const accordionForeground =
    getThemeColorCssValue(
      props.content.styles.backgroundColor.contrastingColor,
    ) ?? sectionForeground;

  const questionStyle = getStyledTextStyle(
    props.content.styles.question.styles,
    props.content.styles.question.fontColor,
    accordionForeground,
  );
  const answerStyle = getStyledTextStyle(
    props.content.styles.answer.styles,
    props.content.styles.answer.fontColor,
    accordionForeground,
  );

  return (
    <AnalyticsScopeProvider
      name={`CafeAndCoffeeShopFaq${getAnalyticsScopeHash(props.id ?? "default")}`}
    >
      <VisibilityWrapper
        liveVisibility={props.section.visibleOnLivePage}
        isEditing={Boolean(props.puck?.isEditing)}
      >
        <div
          className="cafe-scope no-touchevents page-caffeine"
          dir="ltr"
          style={wrapperStyle}
        >
          <style>{CafeAndCoffeeShopStyles}</style>
          <Background
            id="faqs-section"
            className="local-section section-faqs"
            aria-label={t("fields.faqs", "FAQs")}
            background={props.section.backgroundColor}
            style={sectionStyle}
          >
            <div className="faqs__wrap">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="faqs__heading"
                  style={getStyledTextStyle(
                    props.heading.styles,
                    props.heading.fontColor,
                    sectionForeground,
                  )}
                >
                  {resolveTextFieldValue(
                    props.heading.text,
                    locale,
                    streamDocument,
                  )}
                </h2>
              </EntityField>
              <EntityField
                displayName="FAQs"
                fieldId={props.content.faqs.field}
                constantValueEnabled={props.content.faqs.constantValueEnabled}
              >
                <div
                  className="faqs__list"
                  style={{
                    borderColor: accordionForeground,
                  }}
                >
                  {resolvedFaqs.map((item, index) => {
                    const isOpen = openIndex === index;
                    const questionText = resolveTranslatableStringValue(
                      item.question,
                      locale,
                      streamDocument,
                    );
                    const answerRichTextStyleOverrides = {
                      ...resolveTextStyles(props.content.styles.answer.styles),
                      color: answerStyle.color,
                    };
                    const resolvedAnswer = item.answer
                      ? resolveComponentData(
                          item.answer,
                          locale,
                          streamDocument,
                        )
                      : undefined;

                    return (
                      <article
                        key={`${questionText || "faq"}-${index}`}
                        className={`faqs__item${isOpen ? " is-open" : ""}`}
                        style={{
                          backgroundColor: accordionBackgroundColor,
                          borderColor: accordionForeground,
                          color: accordionForeground,
                        }}
                      >
                        <button
                          className="faqs__trigger"
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenIndex(isOpen ? -1 : index)}
                          style={questionStyle}
                        >
                          <span className="faqs__label">{questionText}</span>
                          <span
                            className="faqs__icon"
                            aria-hidden="true"
                            style={{ color: accordionForeground }}
                          />
                        </button>
                        <div className="faqs__panel">
                          <div className="faqs__panel-inner">
                            <div className="faqs__answer" style={answerStyle}>
                              {React.isValidElement(resolvedAnswer) ? (
                                <CafeRichText data={resolvedAnswer} richTextStyleOverrides={answerRichTextStyleOverrides} />
                              ) : typeof resolvedAnswer === "string" ? (
                                <CafeRichText
                                  data={resolvedAnswer}
                                  richTextStyleOverrides={
                                    answerRichTextStyleOverrides
                                  }
                                />
                              ) : null}
                            </div>
                          </div>
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

export const CafeAndCoffeeShopFaq: YextComponentConfig<CafeAndCoffeeShopFaqProps> =
  {
    label: msg("components.faqLabel", "FAQ"),
    fields: CafeAndCoffeeShopFaqFields,
    defaultProps: CafeAndCoffeeShopFaqDefaultProps,
    render: (props) => (
      <TypographyScope>
        <CafeAndCoffeeShopFaqComponent {...props} />
      </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "CafeAndCoffeeShopFaq",
  displayName: "FAQ",
  description: "FAQ",
  pageSetTypes: ["ENTITY"],
};
