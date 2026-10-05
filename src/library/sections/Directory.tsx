import { TypographyScope } from "../shared/typography";
import { Directory as SectionComponent } from "../shared/components/directory/Directory";
import type { SectionConfig } from "@yext/visual-editor";

export const Directory: typeof SectionComponent = {
  ...SectionComponent,
  render: (props) => <TypographyScope>{SectionComponent.render(props)}</TypographyScope>,
};

export const config: SectionConfig = {
  id: "Directory",
  displayName: "Directory",
  description: "Displays the directory page experience.",
  pageSetTypes: ["DIRECTORY"],
  category: "Standard Sections",
};
