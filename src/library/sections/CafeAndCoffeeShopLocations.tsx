import type { StyledTextValue } from "@yext/visual-editor";
import { TypographyScope, resolveTextStyles } from "../shared/typography";
import type { SectionConfig } from "@yext/visual-editor";

import type { PuckContext } from "@puckeditor/core";
import { parsePhoneNumber } from "awesome-phonenumber";
import type {
  AddressType,
  Coordinate,
  HoursType,
  StatusParams,
} from "@yext/pages-components";
import * as React from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import {
  Address,
  AnalyticsScopeProvider,
  HoursStatus,
  HoursTable,
  Link,
  getDirections,
} from "@yext/pages-components";
import {
  msg,
  EntityField,
  getAnalyticsScopeHash,
  getPreferredDistanceUnit,
  getSurfaceColorStyle,
  getThemeColorCssValue as toThemeCss,
  MapboxStaticMapComponent,
  mapboxStaticMapStyleOptions,
  mergeMeta,
  type MapboxStaticProps,
  resolveUrlTemplate,
  type StreamDocument,
  type ThemeColor,
  type TranslatableString,
  useDocument,
  useNearbyLocations,
  useTemplateProps,
  VisibilityWrapper,
  type YextComponentConfig,
  type YextEntityField,
  type YextFields,
} from "@yext/visual-editor";
import { resolveTextFieldValue } from "../shared/sectionHelpers";

const CafeAndCoffeeShopStyles = String.raw`
#locations-section,
#locations-section * {
  box-sizing: border-box;
}

#locations-section {
  padding: clamp(2.5rem, 4vw, 3.75rem) 0;
  background: var(--cr-locations-bg, #121212);
}

#locations-section .locations__wrap {
  width: min(100%, 1440px);
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: auto minmax(0, auto);
  column-gap: 18px;
  row-gap: 0;
  align-items: stretch;
}

#locations-section .locations__heading {
  grid-column: 1 / -1;
  margin: 0 0 2rem;
  text-align: center;
  color: var(--cr-locations-heading, #d2a180);
}

#locations-section .locations__map {
  grid-column: 1;
  grid-row: 2;
  width: 100%;
  height: 100%;
  min-height: clamp(360px, 42vw, 560px);
  align-self: stretch;
  border-radius: 16px;
  overflow: hidden;
}

#locations-section .locations__map > * {
  width: 100%;
  height: 100%;
}

#locations-section .locations__map .mapbox-static-map-shell,
#locations-section .locations__map .mapbox-static-map-picture,
#locations-section .locations__map .mapbox-static-map-image {
  width: 100%;
  height: 100%;
}

#locations-section .locations__map .mapbox-static-map-image {
  object-fit: cover;
  object-position: center;
}

#locations-section .locations__grid {
  grid-column: 2;
  grid-row: 2;
  margin-top: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

#locations-section .locations__status {
  margin: 0;
  padding: clamp(1.45rem, 2.1vw, 1.95rem) clamp(1.3rem, 2vw, 1.75rem);
  border-radius: 16px;
  background: var(--cr-locations-bg, #121212);
  color: currentColor;
}

#locations-section .location-card {
  border-radius: 16px;
  padding: clamp(1.45rem, 2.1vw, 1.95rem) clamp(1.3rem, 2vw, 1.75rem);
  display: grid;
  gap: 1rem;
  box-shadow: none;
  background: var(--cr-locations-bg, #121212);
}

#locations-section .location-card h3 {
  margin: 0;
}

#locations-section .location-card__name-link {
  color: inherit;
  text-decoration: none;
}

.cafe-scope.no-touchevents #locations-section .location-card__name-link:hover,
.cafe-scope.no-touchevents #locations-section .location-card__name-link:focus-visible {
  text-decoration: underline;
  text-underline-offset: 3px;
  outline: none;
}

#locations-section .location-card p {
  margin: 0;
  opacity: 1;
}

#locations-section .location-card p + p {
  margin-top: 0.14rem;
}

#locations-section .location-card__hours {
  display: grid;
  gap: 0.6rem;
}

#locations-section .location-card__hours .HoursTable-row {
  padding: 0.12rem 0;
}

#locations-section .location-card__distance {
  margin-top: 0.35rem;
  padding-top: 0.55rem;
  border-top: 1px solid color-mix(in srgb, currentColor 14%, transparent);
}

#locations-section .location-card__cta {
  margin-top: 0.62rem;
  width: auto;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  text-decoration: none;
  transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

  .cafe-scope.no-touchevents #locations-section .location-card__cta:hover,
.cafe-scope.no-touchevents #locations-section .location-card__cta:focus-visible {
  background-color: color-mix(in srgb, currentColor 22%, transparent);
  border-color: currentColor;
  outline: none;
}

@media (max-width: 1023px) {
  #locations-section .locations__wrap {
    padding-inline: 30px;
    grid-template-columns: 1fr;
  }

  #locations-section .locations__grid {
    grid-column: 1;
    grid-row: 2;
  }

  #locations-section .locations__map {
    grid-column: 1;
    grid-row: 3;
    min-height: 300px;
    margin-top: 18px;
  }

  #locations-section .locations__heading {
    text-align: left;
  }
}

@media (max-width: 767px) {
  #locations-section .locations__wrap {
    padding-inline: 14px;
  }

  #locations-section .locations__map {
    min-height: 240px;
  }
}`;

type CafeAndCoffeeShopLocationsProps = {
  section: {
    backgroundColor: ThemeColor;
    visibleOnLivePage: boolean;
  };
  heading: {
    text: YextEntityField<TranslatableString>;
    styles: StyledTextValue;
    fontColor?: ThemeColor;
  };
  map: {
    coordinate: YextEntityField<Coordinate>;
    mapStyle: string;
    height?: string;
    zoom: number;
  };
  nearby: {
    radiusMi: number;
    limit: number;
    cardBackgroundColor: ThemeColor | undefined;
    cardTitleColor: ThemeColor | undefined;
    cardDetailColor: ThemeColor | undefined;
    statusColor: ThemeColor | undefined;
    ctaColor: ThemeColor | undefined;
    showHours: boolean;
    showPhone: boolean;
    showAddress: boolean;
    hoursStyles: {
      showCurrentStatus: boolean;
      timeFormat: "12h" | "24h";
      dayOfWeekFormat: "short" | "long";
      showDayNames: boolean;
    };
    phone: {
      phoneFormat: "international" | "domestic";
      includeHyperlink?: boolean;
    };
    address: {
      showRegion: boolean;
      showCountry: boolean;
    };
  };
};

type RuntimeProps = CafeAndCoffeeShopLocationsProps & {
  id?: string;
  puck?: PuckContext;
};

const fields: YextFields<CafeAndCoffeeShopLocationsProps> = {
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
        filter: { includeListsOnly: false, types: ["type.string"] },
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
  map: {
    label: msg("fields.map", "Map"),
    type: "object",
    objectFields: {
      coordinate: {
        type: "entityField",
        label: msg("fields.coordinates", "Coordinates"),
        filter: { types: ["type.coordinate"] },
      },
      mapStyle: {
        label: msg("fields.mapboxMapStyle", "Mapbox Map Style"),
        type: "select",
        options: mapboxStaticMapStyleOptions,
      },
      zoom: {
        label: msg("fields.zoom", "Zoom"),
        type: "number",
        min: 0,
        max: 22,
      },
    },
  },
  nearby: {
    label: msg("fields.nearbyLocations", "Nearby Locations"),
    type: "object",
    objectFields: {
      radiusMi: {
        label: msg("fields.radiusMi", "Radius (mi)"),
        type: "number",
        min: 1,
        max: 100,
      },
      limit: {
        label: msg("fields.resultLimit", "Result Limit"),
        type: "number",
        min: 1,
        max: 12,
      },
      cardBackgroundColor: {
        label: msg("fields.backgroundColor", "Background Color"),
        type: "basicSelector",
        options: "BACKGROUND_COLOR",
      },
      cardTitleColor: {
        label: msg("fields.titleColor", "Title Color"),
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      cardDetailColor: {
        label: msg("fields.detailColor", "Detail Color"),
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      statusColor: {
        label: msg("fields.statusColor", "Status Color"),
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      ctaColor: {
        label: msg("fields.ctaColor", "CTA Color"),
        type: "basicSelector",
        options: "SITE_COLOR",
      },
      showHours: {
        label: msg("fields.showHours", "Show Hours"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
      },
      showPhone: {
        label: msg("fields.showPhone", "Show Phone"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
      },
      showAddress: {
        label: msg("fields.showAddress", "Show Address"),
        type: "radio",
        options: [
          { label: msg("fields.options.yes", "Yes"), value: true },
          { label: msg("fields.options.no", "No"), value: false },
        ],
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
        },
      },
      phone: {
        label: msg("fields.phone", "Phone"),
        type: "object",
        objectFields: {
          phoneFormat: {
            label: msg("fields.phoneNumberFormat", "Phone Number Format"),
            type: "radio",
            options: [
              {
                label: msg("fields.options.domestic", "Domestic"),
                value: "domestic",
              },
              {
                label: msg("fields.options.international", "International"),
                value: "international",
              },
            ],
          },
          includeHyperlink: {
            label: msg(
              "fields.includePhoneHyperlink",
              "Include Phone Hyperlink",
            ),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
        },
      },
      address: {
        label: msg("fields.address", "Address"),
        type: "object",
        objectFields: {
          showRegion: {
            label: msg("fields.showRegion", "Show Region"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
          showCountry: {
            label: msg("fields.showCountry", "Show Country"),
            type: "radio",
            options: [
              { label: msg("fields.options.yes", "Yes"), value: true },
              { label: msg("fields.options.no", "No"), value: false },
            ],
          },
        },
      },
    },
  },
};

const defaultProps: CafeAndCoffeeShopLocationsProps = {
  section: {
    backgroundColor: {
      selectedColor: "palette-secondary",
      contrastingColor: "palette-secondary-contrast",
    },
    visibleOnLivePage: true,
  },
  heading: {
    text: {
      field: "",
      constantValue: "Where To Find Us",
      constantValueEnabled: true,
    },
    styles: {
      fontFamily: "default",
      fontSize: "default",
      fontWeight: "default",
      fontStyle: "default",
      textTransform: "default",
    },
    fontColor: undefined,
  },
  map: {
    coordinate: {
      field: "yextDisplayCoordinate",
      constantValue: {
        latitude: 0,
        longitude: 0,
      },
      constantValueEnabled: false,
    },
    mapStyle: "streets-v12",
    zoom: 13,
  },
  nearby: {
    radiusMi: 10,
    limit: 3,
    cardBackgroundColor: {
      selectedColor: "palette-secondary",
      contrastingColor: "palette-secondary-contrast",
    },
    cardTitleColor: undefined,
    cardDetailColor: undefined,
    statusColor: undefined,
    ctaColor: undefined,
    showHours: true,
    showPhone: true,
    showAddress: true,
    hoursStyles: {
      showCurrentStatus: true,
      timeFormat: "12h",
      dayOfWeekFormat: "long",
      showDayNames: true,
    },
    phone: {
      phoneFormat: "domestic",
      includeHyperlink: true,
    },
    address: {
      showRegion: true,
      showCountry: false,
    },
  },
};

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

const getDistanceMiles = (
  from: Coordinate | undefined,
  to: Coordinate | undefined,
) => {
  if (
    from?.latitude === undefined ||
    from?.longitude === undefined ||
    to?.latitude === undefined ||
    to?.longitude === undefined
  ) {
    return null;
  }

  const earthRadiusMiles = 3958.7613;
  const latitudeDelta = degreesToRadians(to.latitude - from.latitude);
  const longitudeDelta = degreesToRadians(to.longitude - from.longitude);
  const fromLatitude = degreesToRadians(from.latitude);
  const toLatitude = degreesToRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;
  const angularDistance =
    2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return earthRadiusMiles * angularDistance;
};

const formatDistanceText = (
  currentCoordinate: Coordinate | undefined,
  nearbyCoordinate: Coordinate | undefined,
  t: TFunction,
  countryCode?: string,
) => {
  const distanceMiles = getDistanceMiles(currentCoordinate, nearbyCoordinate);
  if (distanceMiles === null) return "";

  const preferredUnit = getPreferredDistanceUnit(countryCode ?? "US");
  if (preferredUnit === "kilometer") {
    const distanceKilometers = distanceMiles * 1.60934;
    return t(
      "locatedKilometersFromLocation",
      "Located {{distance}} kilometers from this location",
      { distance: distanceKilometers.toFixed(1) },
    );
  }

  return t(
    "locatedMilesFromLocation",
    "Located {{distance}} miles from this location",
    { distance: distanceMiles.toFixed(1) },
  );
};

const getLocationName = (locationData: any, fallbackName: string) => {
  if (typeof locationData?.name === "string" && locationData.name.trim()) {
    return locationData.name.trim();
  }
  if (
    typeof locationData?.dm_directoryName === "string" &&
    locationData.dm_directoryName.trim()
  ) {
    return locationData.dm_directoryName.trim();
  }
  return fallbackName;
};

const getLocationPhone = (locationData: any) => {
  if (
    typeof locationData?.mainPhone === "string" &&
    locationData.mainPhone.trim()
  ) {
    return locationData.mainPhone.trim();
  }
  if (
    typeof locationData?.dm_directoryPhone === "string" &&
    locationData.dm_directoryPhone.trim()
  ) {
    return locationData.dm_directoryPhone.trim();
  }
  return "";
};

const getPhoneRegionCode = (address: AddressType | undefined) => {
  const countryCode = address?.countryCode?.trim().toUpperCase();
  return countryCode?.length === 2 ? countryCode : "US";
};

const formatLocationPhone = (
  phoneNumber: string,
  phoneFormat: "international" | "domestic",
  address: AddressType | undefined,
) => {
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber, {
    regionCode: getPhoneRegionCode(address),
  });
  const formattedPhoneNumber =
    parsedPhoneNumber.valid && parsedPhoneNumber.number
      ? phoneFormat === "international"
        ? parsedPhoneNumber.number.international
        : parsedPhoneNumber.number.national
      : phoneNumber;

  return {
    formattedPhoneNumber,
    telDigits: phoneNumber.replace(/\D/g, ""),
  };
};

const hasNearbyStatusDetail = (status: StatusParams) =>
  !status.comingSoon &&
  !status.currentInterval?.is24h?.() &&
  Boolean(status.futureInterval);

const getNearbyStatusTime = (status: StatusParams, locale: string) => {
  if (!hasNearbyStatusDetail(status)) {
    return "";
  }

  return status.isOpen
    ? (status.currentInterval?.getEndTime(locale, status.timeOptions) ?? "")
    : (status.futureInterval?.getStartTime(locale, status.timeOptions) ?? "");
};

const getNearbyStatusDay = (
  status: StatusParams,
  showDayNames: boolean,
  locale: string,
) => {
  if (!showDayNames || !hasNearbyStatusDetail(status)) {
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

const renderNearbyHoursStatus = (
  status: StatusParams,
  showDayNames: boolean,
  t: TFunction,
  locale: string,
) => {
  const currentLabel = status.comingSoon
    ? t("comingSoon", "Coming Soon")
    : status.currentInterval?.is24h?.()
      ? t("open24Hours", "Open 24 Hours")
      : !status.futureInterval
        ? t("temporarilyClosed", "Temporarily Closed")
        : status.isOpen
          ? t("openNow", "Open Now")
          : t("closed", "Closed");
  const detailTime = getNearbyStatusTime(status, locale);
  const detailDay = getNearbyStatusDay(status, showDayNames, locale);
  const detailText = status.isOpen
    ? detailDay
      ? t("closesAtTimeWeek", "Closes at {{time}} {{dayOfWeek}}", {
          time: detailTime,
          dayOfWeek: detailDay,
        })
      : t("closesAtTime", "Closes at {{time}}", { time: detailTime })
    : detailDay
      ? t("opensAtTimeWeek", "Opens at {{time}} {{dayOfWeek}}", {
          time: detailTime,
          dayOfWeek: detailDay,
        })
      : t("opensAtTime", "Opens at {{time}}", { time: detailTime });

  return (
    <div className="HoursStatus">
      <span className="HoursStatus-current">{currentLabel}</span>
      {hasNearbyStatusDetail(status) ? (
        <>
          <span className="HoursStatus-separator"> - </span>
          <span className="HoursStatus-future">{detailText}</span>
        </>
      ) : null}
    </div>
  );
};

const NearbyLocationsContent = ({
  docs,
  streamDocument,
  relativePrefixToRoot,
  currentCoordinate,
  nearby,
  cardBackgroundFallback,
  sectionForeground,
  locale,
}: {
  docs: any[];
  streamDocument: any;
  relativePrefixToRoot?: string;
  currentCoordinate: Coordinate | undefined;
  nearby: CafeAndCoffeeShopLocationsProps["nearby"];
  cardBackgroundFallback?: ThemeColor;
  sectionForeground: string | undefined;
  locale: string;
}) => {
  const { t } = useTranslation();
  const fallbackLocationName = t("nearbyLocation", "Nearby Location");
  const directionsLabel = t("getDirections", "Get Directions");
  return (
    <>
      {docs.map((locationData, index) => {
        const mergedDocument = mergeMeta(locationData, streamDocument);
        const resolvedUrl = resolveUrlTemplate(
          mergedDocument,
          relativePrefixToRoot ?? "",
        );
        const name = getLocationName(locationData, fallbackLocationName);
        const address = locationData?.address as AddressType | undefined;
        const phone = getLocationPhone(locationData);
        const hours = locationData?.hours as HoursType | undefined;
        const distanceText = formatDistanceText(
          currentCoordinate,
          locationData?.yextDisplayCoordinate,
          t,
          streamDocument?.address?.countryCode,
        );
        const directionsUrl = getDirections(
          address,
          locationData?.listings,
          locationData?.googlePlaceId,
          undefined,
          locationData?.yextDisplayCoordinate,
        );
        const nearbyCardBackground =
          nearby.cardBackgroundColor ?? cardBackgroundFallback;
        const nearbyCardBackgroundColor = toThemeCss(
          nearbyCardBackground?.selectedColor,
        );
        const nearbyCardForeground =
          toThemeCss(nearbyCardBackground?.contrastingColor) ??
          sectionForeground;
        const nearbyTitleColor =
          toThemeCss(nearby.cardTitleColor?.selectedColor) ??
          nearbyCardForeground;
        const nearbyDetailColor =
          toThemeCss(nearby.cardDetailColor?.selectedColor) ??
          nearbyCardForeground;
        const nearbyCtaColor =
          toThemeCss(nearby.ctaColor?.selectedColor) ?? nearbyDetailColor;
        const formattedPhone = phone
          ? formatLocationPhone(phone, nearby.phone.phoneFormat, address)
          : null;

        return (
          <article
            key={
              locationData?.id ??
              locationData?.uid ??
              locationData?.meta?.id ??
              `${name}-${index}`
            }
            className="location-card"
            style={{
              backgroundColor: nearbyCardBackgroundColor,
              color: nearbyDetailColor,
            }}
          >
            <h3
              style={{
                color: nearbyTitleColor,
              }}
            >
              <a
                className="location-card__name-link"
                href={resolvedUrl}
                target="_top"
              >
                {name}
              </a>
            </h3>
            {nearby.showAddress && address ? (
              <Address
                address={address}
                showRegion={nearby.address.showRegion}
                showCountry={nearby.address.showCountry}
                style={{
                  color: nearbyDetailColor,
                  margin: 0,
                }}
              />
            ) : null}
            {nearby.showPhone && formattedPhone ? (
              nearby.phone.includeHyperlink && formattedPhone.telDigits ? (
                <Link
                  cta={{
                    link: formattedPhone.telDigits,
                    linkType: "PHONE",
                  }}
                  style={{
                    color: nearbyDetailColor,
                  }}
                >
                  {formattedPhone.formattedPhoneNumber}
                </Link>
              ) : (
                <p
                  style={{
                    color: nearbyDetailColor,
                  }}
                >
                  {formattedPhone.formattedPhoneNumber}
                </p>
              )
            ) : null}
            {nearby.showHours && hours ? (
              <div className="location-card__hours">
                {nearby.hoursStyles.showCurrentStatus ? (
                  <HoursStatus
                    hours={hours}
                    comingSoon={streamDocument?.comingSoon}
                    timezone={
                      locationData?.timezone ??
                      streamDocument?.timezone ??
                      "UTC"
                    }
                    dayOptions={
                      nearby.hoursStyles.showDayNames
                        ? {
                            weekday: nearby.hoursStyles.dayOfWeekFormat,
                          }
                        : undefined
                    }
                    timeOptions={{
                      hour12: nearby.hoursStyles.timeFormat === "12h",
                    }}
                    statusTemplate={(status) =>
                      renderNearbyHoursStatus(
                        status,
                        nearby.hoursStyles.showDayNames,
                        t,
                        locale,
                      )
                    }
                  />
                ) : (
                  <HoursTable
                    hours={hours}
                    comingSoon={streamDocument?.comingSoon}
                    intervalTranslations={{
                      isClosed: t("closed", "Closed"),
                      open24Hours: t("open24Hours", "Open 24 Hours"),
                      reopenDate: t("reopenDate", "Reopen Date"),
                      timeFormatLocale: locale,
                    }}
                  />
                )}
              </div>
            ) : null}
            {distanceText ? (
              <p
                className="location-card__distance"
                style={{
                  color: nearbyDetailColor,
                }}
              >
                {distanceText}
              </p>
            ) : null}
            {directionsUrl ? (
              <Link
                href={directionsUrl}
                className="location-card__cta cafe-cta cafe-cta--secondary"
                style={{
                  color: nearbyCtaColor,
                }}
              >
                {directionsLabel}
              </Link>
            ) : null}
          </article>
        );
      })}
    </>
  );
};

const CafeAndCoffeeShopLocationsComponent = (props: RuntimeProps) => {
  const { t, i18n } = useTranslation();
  const streamDocument = useDocument<StreamDocument>();
  const { relativePrefixToRoot } = useTemplateProps<{
    relativePrefixToRoot?: string;
  }>();
  const isEditing = Boolean(props.puck?.isEditing);
  const locale = i18n.language;
  const sectionStyle =
    getSurfaceColorStyle(props.section.backgroundColor, streamDocument) ?? {};
  const nearby = {
    ...defaultProps.nearby,
    ...props.nearby,
    hoursStyles: {
      ...defaultProps.nearby.hoursStyles,
      ...props.nearby?.hoursStyles,
    },
    phone: {
      ...defaultProps.nearby.phone,
      ...props.nearby?.phone,
    },
    address: {
      ...defaultProps.nearby.address,
      ...props.nearby?.address,
    },
  };
  const currentCoordinate = streamDocument?.yextDisplayCoordinate;
  const enableNearbyLocations =
    currentCoordinate?.latitude !== undefined &&
    currentCoordinate?.longitude !== undefined &&
    nearby.radiusMi > 0 &&
    nearby.limit > 0;

  const { data: nearbyLocationsData, status: nearbyLocationsStatus } =
    useNearbyLocations({
      streamDocument,
      latitude: currentCoordinate?.latitude,
      longitude: currentCoordinate?.longitude,
      radiusMi: nearby.radiusMi,
      limit: nearby.limit,
      enabled: enableNearbyLocations,
    });

  const nearbyLocationDocs = nearbyLocationsData?.response?.docs ?? [];
  let mapboxApiKey = streamDocument?._env?.YEXT_MAPBOX_API_KEY ?? "";
  const iframe =
    typeof document === "undefined"
      ? null
      : (document.getElementById("preview-frame") as HTMLIFrameElement | null);
  if (
    iframe?.contentDocument &&
    streamDocument?._env?.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY
  ) {
    mapboxApiKey = streamDocument._env.YEXT_EDIT_LAYOUT_MODE_MAPBOX_API_KEY;
  }
  const hasMapboxApiKey = mapboxApiKey.trim().length > 0;
  const shouldHideSection =
    !isEditing && !hasMapboxApiKey && nearbyLocationDocs.length === 0;
  const shouldShowNearbyPlaceholder =
    isEditing &&
    (!enableNearbyLocations ||
      nearbyLocationsStatus === "error" ||
      nearbyLocationsStatus === "success") &&
    nearbyLocationDocs.length === 0;
  const shouldShowNearbyLoading =
    enableNearbyLocations && nearbyLocationsStatus === "pending";
  const shouldShowNearbyCards =
    nearbyLocationsStatus === "success" && nearbyLocationDocs.length > 0;
  const sectionForeground = sectionStyle.color;
  const statusTextColor =
    toThemeCss(nearby.statusColor?.selectedColor) ?? sectionForeground;
  const loadingText = t("loadingNearbyLocations", "Loading nearby locations");
  const emptyText = t(
    "noNearbyLocationsFoundForThisLocation",
    "No nearby locations found for this location",
  );
  const headingText = resolveTextFieldValue(
    props.heading.text,
    locale,
    streamDocument,
  );
  const mapProps: MapboxStaticProps = {
    ...props.map,
  };
  const mapPuck: PuckContext = props.puck ?? {
    renderDropZone: () => null,
    metadata: {},
    isEditing: isEditing,
    dragRef: null,
  };

  if (shouldHideSection) {
    return null;
  }

  return (
    <AnalyticsScopeProvider
      name={`CafeAndCoffeeShopLocations${getAnalyticsScopeHash(props.id ?? "default")}`}
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
              "--cr-locations-bg": sectionStyle.backgroundColor,
              "--cr-locations-heading":
                toThemeCss(props.heading.fontColor?.selectedColor) ??
                sectionForeground,
            } as React.CSSProperties
          }
        >
          <style>{CafeAndCoffeeShopStyles}</style>
          <section
            id="locations-section"
            className="local-section section-locations"
            aria-label={t("whereToFindUs", "Where to find us")}
            style={sectionStyle}
          >
            <div className="locations__wrap">
              <EntityField
                displayName="Heading"
                fieldId={props.heading.text.field}
                constantValueEnabled={props.heading.text.constantValueEnabled}
              >
                <h2
                  className="locations__heading"
                  style={{
                    color:
                      toThemeCss(props.heading.fontColor?.selectedColor) ??
                      sectionForeground,
                    ...resolveTextStyles(props.heading.styles),
                  }}
                >
                  {headingText}
                </h2>
              </EntityField>
              <div className="locations__map">
                <EntityField
                  displayName="Map Coordinates"
                  fieldId={props.map.coordinate.field}
                  constantValueEnabled={
                    props.map.coordinate.constantValueEnabled
                  }
                >
                  <MapboxStaticMapComponent
                    {...mapProps}
                    height="100%"
                    id={`${props.id ?? "locations"}-map`}
                    puck={mapPuck}
                  />
                </EntityField>
              </div>
              {shouldShowNearbyLoading ? (
                <div className="locations__grid">
                  <p
                    className="locations__status"
                    style={{
                      color: statusTextColor,
                    }}
                  >
                    {loadingText}
                  </p>
                </div>
              ) : null}
              {shouldShowNearbyPlaceholder ? (
                <div className="locations__grid">
                  <p
                    className="locations__status"
                    style={{
                      color: statusTextColor,
                    }}
                  >
                    {emptyText}
                  </p>
                </div>
              ) : null}
              {shouldShowNearbyCards ? (
                <div className="locations__grid">
                  <NearbyLocationsContent
                    docs={nearbyLocationDocs}
                    streamDocument={streamDocument}
                    relativePrefixToRoot={relativePrefixToRoot}
                    currentCoordinate={currentCoordinate}
                    nearby={nearby}
                    cardBackgroundFallback={props.section.backgroundColor}
                    sectionForeground={sectionForeground}
                    locale={locale}
                  />
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </VisibilityWrapper>
    </AnalyticsScopeProvider>
  );
};

export const CafeAndCoffeeShopLocations: YextComponentConfig<CafeAndCoffeeShopLocationsProps> =
  {
    label: msg("components.nearbyLocationsLabel", "Nearby Locations"),
    fields,
    defaultProps,
    render: (props) => (
      <TypographyScope>
          <CafeAndCoffeeShopLocationsComponent {...(props as RuntimeProps)} />
        </TypographyScope>
    ),
  };

export const config: SectionConfig = {
  id: "CafeAndCoffeeShopLocations",
  displayName: "Nearby Locations",
  description: "Locations",
  pageSetTypes: ["ENTITY"],
};
