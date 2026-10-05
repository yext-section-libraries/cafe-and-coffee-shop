import { TypographyScope } from "../shared/typography";
import { LocatorComponent as SectionComponent } from "../shared/components/locator/Locator";
import type { SectionConfig } from "@yext/visual-editor";

export const Locator: typeof SectionComponent = {
  ...SectionComponent,
  render: (props) => <TypographyScope>{SectionComponent.render(props)}</TypographyScope>,
};

export const config: SectionConfig = {
  id: "Locator",
  displayName: "Locator",
  description: "Displays the locator page experience.",
  pageSetTypes: ["LOCATOR"],
  category: "Standard Sections",
};
