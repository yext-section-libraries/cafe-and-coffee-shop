import * as React from "react";
import { MaybeRTF, type RichTextStyleOverrides, type StyledTextValue } from "@yext/visual-editor";
import "./typography.css";
import "./presentation.css";

type TextStyles = Partial<Pick<StyledTextValue,
  "fontFamily" | "fontSize" | "fontWeight" | "fontStyle" | "textTransform"
>>;

export const resolveTextStyles = (styles?: TextStyles) => ({
  fontFamily: styles?.fontFamily === "default" ? undefined : styles?.fontFamily,
  fontSize: styles?.fontSize === "default" ? undefined : styles?.fontSize,
  fontWeight: styles?.fontWeight === "default" ? undefined : styles?.fontWeight,
  fontStyle: styles?.fontStyle === "default" ? undefined : styles?.fontStyle,
  textTransform: styles?.textTransform === "default" ? undefined : styles?.textTransform,
});

export const getBodyTextStyle = (styles?: TextStyles): React.CSSProperties => {
  const resolved = resolveTextStyles(styles);
  const variables: Record<string, string> = {};
  for (const [property, value] of Object.entries(resolved)) {
    if (value !== undefined) {
      variables[`--cafe-body-${property}`] = value;
      variables[`--${property}-body-${property}`] = value;
    }
  }
  return { ...resolved, ...variables };
};

export const TypographyScope = ({ children }: { children: React.ReactNode }) => (
  <div className="cafe-typography components">{children}</div>
);

// resolveComponentData can return a wrapper containing a MaybeRTF. Forward
// normalized overrides to that renderer and its inner body token scope.
export const CafeRichText = ({ data, richTextStyleOverrides }: {
  data: unknown;
  richTextStyleOverrides?: RichTextStyleOverrides;
}): React.ReactElement | null => {
  const overrides = { ...richTextStyleOverrides, ...resolveTextStyles(richTextStyleOverrides) };
  const style = getBodyTextStyle(overrides);
  const applyOverrides = (node: React.ReactNode): React.ReactNode => {
    if (!React.isValidElement<Record<string, any>>(node)) return node;
    if (node.type === MaybeRTF) {
      return React.cloneElement(node, {
        richTextStyleOverrides: { ...node.props.richTextStyleOverrides, ...overrides },
        style: { ...node.props.style, ...style },
      });
    }
    return React.cloneElement(node, {
      style: { ...node.props.style, ...style },
      children: React.Children.map(node.props.children, applyOverrides),
    });
  };
  if (React.isValidElement(data)) return <>{applyOverrides(data)}</>;
  if (typeof data === "string" || (data && typeof data === "object" && "html" in data)) {
    return <MaybeRTF data={data as React.ComponentProps<typeof MaybeRTF>["data"]}
      richTextStyleOverrides={overrides} style={style} />;
  }
  return null;
};
