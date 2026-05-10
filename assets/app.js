const TIGER_LAYER =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer/88/query";
const CR_API = "https://api.censusreporter.org/1.0";
const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiY2Vuc3VzcmVwb3J0ZXIiLCJhIjoiQV9hS01rQSJ9.wtsn0FwmAdRV7cckopFKkA";
const LOCAL_SERVER_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const HAS_LOCAL_SERVER_PROXY = LOCAL_SERVER_HOSTS.has(window.location.hostname);
const BASE_TILE = HAS_LOCAL_SERVER_PROXY
  ? `/proxy/mapbox/styles/v1/censusreporter/ckfyfj0v707ob19qdo047ndoq/tiles/256/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`
  : "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
const BASE_TILE_ATTRIBUTION = HAS_LOCAL_SERVER_PROXY
  ? '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  : '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const LABEL_TILE_URLS = [
  "https://a.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  "https://b.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  "https://c.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
  "https://d.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
];
const DOT_TILE = "https://tiles.censusdots.com/file/race-tiles/{z}/{x}/{y}.png";
const GOOGLE_MAPS_CONFIG_API = HAS_LOCAL_SERVER_PROXY ? "/api/google-maps-config" : "";
const GOOGLE_SATELLITE_TILE = HAS_LOCAL_SERVER_PROXY ? "/proxy/google-satellite/{z}/{x}/{y}" : "";
const GOOGLE_3D_ROOT = "https://tile.googleapis.com/v1/3dtiles/root.json?key={key}";
const CESIUM_SCRIPT_URL = "https://ajax.googleapis.com/ajax/libs/cesiumjs/1.105/Build/Cesium/Cesium.js";
const CESIUM_CSS_URL = "https://ajax.googleapis.com/ajax/libs/cesiumjs/1.105/Build/Cesium/Widgets/widgets.css";
const BOUNDARY_URL = "data/urban-area-boundaries.json?v=20260509-louisville-name";
const SCHOOL_RATINGS_URL = "data/school-ratings.json?v=20260509-school-rich";
const SCHOOL_RATINGS_API = "/api/school-ratings";
const STATE_OFFICIALS_API = HAS_LOCAL_SERVER_PROXY ? "/api/state-officials" : "";
const MAYOR_PARTY_API = "/api/mayor-party";
const DOT_TILE_SIZE = 256;
const DOT_TILE_PIXEL_RATIO = 2;
const DOT_MIN_ZOOM = 3;
const DOT_MAX_ZOOM = 14;
const AREA_MIN_ZOOM = 6;
const FIT_DURATION = 220;
const PANEL_MIN_WIDTH = 340;
const PANEL_DEFAULT_WIDTH = 430;
const PANEL_MAX_WIDTH = 980;
const PANEL_MAX_VIEWPORT_RATIO = 0.72;
const SQUARE_METERS_PER_SQUARE_MILE = 2589988.110336;
const BOUNDARY_TILE =
  "https://embed.censusreporter.org/1.0/geo/tiger2024/tiles/{sumlevel}/{z}/{x}/{y}.mvt";
const OPPORTUNITY_ATLAS_DATA = HAS_LOCAL_SERVER_PROXY
  ? "/proxy/opportunity-atlas/src/data/"
  : "https://data-v1.opportunityatlas.org/src/data/";
const CENSUS_OPPORTUNITY_DATA = HAS_LOCAL_SERVER_PROXY
  ? "/proxy/census-opportunity/"
  : "https://www2.census.gov/ces/opportunity/";
const POLICY_OVERLAY_URL = "data/policy-overlays.json?v=20260509-policy-overlays";
const OPPORTUNITY_SUBGROUP = "rP_gP_p25_e";
const OPPORTUNITY_FEMALE_SUBGROUP = "rP_gF_p25_e";
const OPPORTUNITY_TRACT_SWITCH_ZOOM = 7.2;
const CONGRESS_LEGISLATORS_URL =
  "https://unitedstates.github.io/congress-legislators/legislators-current.json";
const CONGRESS_PHOTO_URL = "https://unitedstates.github.io/images/congress/225x275/{bioguide}.jpg";
const BIOGUIDE_PHOTO_URL = "https://bioguide.congress.gov/bioguide/photo/{initial}/{bioguide}.jpg";
const CONGRESS_DOT_GOV_PHOTO_URL = "https://www.congress.gov/img/member/{bioguideLower}_200.jpg";
const OPENSTATES_LEGISLATURE_URL =
  "https://api.github.com/repos/openstates/people/contents/data/{state}/legislature?ref=main";
const OPENSTATES_EXECUTIVE_URL =
  "https://api.github.com/repos/openstates/people/contents/data/{state}/executive?ref=main";
const OPENSTATES_MUNICIPALITIES_URL =
  "https://api.github.com/repos/openstates/people/contents/data/{state}/municipalities?ref=main";
const WIKIDATA_SEARCH_URL = "https://www.wikidata.org/w/api.php?action=wbsearchentities&language=en&format=json&origin=*";
const WIKIDATA_ENTITY_URL = "https://www.wikidata.org/wiki/Special:EntityData/{id}.json";
const COMMONS_FILE_URL = "https://commons.wikimedia.org/wiki/Special:FilePath/{file}?width=225";
const WIKIDATA_ENTITY_PAGE = "https://www.wikidata.org/wiki/{id}";
const CONTIGUOUS_US_EXTENT = [-125, 24, -66, 50];
const NATION_GEOMETRY_PADDING = 0.75;
const NATIONAL_OFFICIALS = [
  {
    label: "President",
    name: "Donald J. Trump",
    party: "Republican",
    url: "https://www.whitehouse.gov/administration/donald-j-trump/",
    imageSearchName: "Donald Trump"
  },
  {
    label: "Vice President",
    name: "JD Vance",
    party: "Republican",
    url: "https://www.whitehouse.gov/administration/jd-vance/",
    imageSearchName: "JD Vance"
  }
];
const PLACE_OFFICIAL_OVERRIDES = {
  "16000US4159000": {
    label: "Mayor",
    name: "Keith Wilson",
    party: "Democrat (nonpartisan office)",
    image:
      "https://www.portland.gov/sites/default/files/styles/1_1_160w/public/2024/Wilson-Blue-Background_0.png?h=99257d56&itok=9l8iSuWl",
    sourceUrl: "https://www.portland.gov/mayor/keith-wilson"
  },
  "16000US5101000": {
    label: "Mayor",
    name: "Alyia Gaskins",
    party: "Democrat",
    image: "https://www.alexandriava.gov/sites/default/files/2024-12/mayor_alyia_gaskins_2024.png",
    sourceUrl: "https://www.alexandriava.gov/city-council/person/mayor-alyia-gaskins"
  },
  "16000US5103000": {
    label: "County Board Chair",
    name: "Matt de Ferranti",
    party: "Democrat",
    image: "https://www.arlingtonva.us/files/sharedassets/public/v/2/county-board/documents/board-member-photos/2025/square-mdf.jpg",
    sourceUrl: "https://www.arlingtonva.us/Government/Departments/County-Board/County-Board-Members/Matt-de-Ferranti"
  }
};
const LANGUAGES = [
  { code: "en", label: "English", locale: "en-US" },
  { code: "es", label: "Español", locale: "es-US" },
  { code: "zh-Hans", label: "简体中文", locale: "zh-Hans" },
  { code: "zh-Hant", label: "繁體中文", locale: "zh-Hant" },
  { code: "fr", label: "Français", locale: "fr-FR" },
  { code: "de", label: "Deutsch", locale: "de-DE" },
  { code: "it", label: "Italiano", locale: "it-IT" },
  { code: "pt", label: "Português", locale: "pt-BR" },
  { code: "ar", label: "العربية", locale: "ar" },
  { code: "hi", label: "हिन्दी", locale: "hi-IN" },
  { code: "bn", label: "বাংলা", locale: "bn-BD" },
  { code: "ja", label: "日本語", locale: "ja-JP" },
  { code: "vi", label: "Tiếng Việt", locale: "vi-VN" },
  { code: "ko", label: "한국어", locale: "ko-KR" },
  { code: "ru", label: "Русский", locale: "ru-RU" }
];
const RTL_LANGUAGES = new Set(["ar"]);
const DOT_LEGEND = [
  { label: "White", color: "#73b2ff" },
  { label: "Black", color: "#9fd400" },
  { label: "Asian", color: "#ff0000" },
  { label: "Hispanic", color: "#ffaa00" },
  { label: "Native American/Other", color: "#996633" },
  { label: "Multiracial", color: "#8c51b5" }
];
const DOT_COLOR_BY_LABEL = Object.fromEntries(DOT_LEGEND.map((item) => [item.label, item.color]));
const RACE_BAR_COLORS = {
  "White, non-Hispanic": DOT_COLOR_BY_LABEL.White,
  "Black, non-Hispanic": DOT_COLOR_BY_LABEL.Black,
  "Asian, non-Hispanic": DOT_COLOR_BY_LABEL.Asian,
  Hispanic: DOT_COLOR_BY_LABEL.Hispanic,
  "Native American/Other, non-Hispanic": DOT_COLOR_BY_LABEL["Native American/Other"],
  "Two or more, non-Hispanic": DOT_COLOR_BY_LABEL.Multiracial
};
const FINDER_RACE_OPTIONS = [
  { id: "white", label: "White", color: DOT_COLOR_BY_LABEL.White, keys: ["white"] },
  { id: "black", label: "Black", color: DOT_COLOR_BY_LABEL.Black, keys: ["black"] },
  { id: "asian", label: "Asian", color: DOT_COLOR_BY_LABEL.Asian, keys: ["asian"] },
  { id: "hispanic", label: "Hispanic", color: DOT_COLOR_BY_LABEL.Hispanic, keys: ["hispanic"] },
  { id: "nativeOther", label: "Native American/Other", color: DOT_COLOR_BY_LABEL["Native American/Other"], keys: ["native", "pacific", "other"] },
  { id: "multiracial", label: "Multiracial", color: DOT_COLOR_BY_LABEL.Multiracial, keys: ["multiracial"] }
];
const FINDER_SORT_OPTIONS = [
  { id: "directory", label: "Standard directory" },
  { id: "percent", label: "Largest percentage" },
  { id: "count", label: "Largest raw number" }
];
const FINDER_MIN_POP_OPTIONS = [
  { value: 0, label: "Any size" },
  { value: 50000, label: "50,000+" },
  { value: 100000, label: "100,000+" },
  { value: 250000, label: "250,000+" },
  { value: 500000, label: "500,000+" },
  { value: 1000000, label: "1,000,000+" },
  { value: 2500000, label: "2,500,000+" }
];
const FINDER_LIMIT_OPTIONS = [25, 50, 100, 250];
const OPPORTUNITY_OVERLAYS = [
  { id: "coll", title: "College Graduation Rate", type: "outcome", description: "Fraction who hold a 4-year college degree", textFormat: "boundPercent5-95", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "hours_yr", title: "Hours Worked Per Week at Age 35", type: "outcome", description: "Average hours worked per week", textFormat: "boundHours0-50", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "hs", title: "High School Graduation Rate", type: "outcome", description: "Fraction with a high school degree or GED", textFormat: "boundPercent50-99", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "jail", title: "Incarceration Rate", type: "outcome", description: "Fraction incarcerated on April 1, 2010", textFormat: "boundPercent1-50", colorScheme: "SpectralBlueYellowRed", tractDisabled: false },
  { id: "kfr_imm", title: "Household Income for Immigrants", type: "outcome", description: "Household income for children with immigrant mothers", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "kir_imm", title: "Individual Income for Immigrants", type: "outcome", description: "Individual income for children with immigrant mothers", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "kfr_native", title: "Household Income for U.S. Natives", type: "outcome", description: "Household income for children with U.S. born mothers", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "kir_native", title: "Individual Income for U.S. Natives", type: "outcome", description: "Individual income for children with U.S. born mothers", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "kfr", title: "Household Income at Age 35", type: "outcome", description: "Average annual household income in 2014-15", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "cred_score", title: "Average Credit Score", type: "outcome", description: "Average credit score in 2020 for children", textFormat: "number", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "deliq_rate", title: "Debt Delinquency", type: "outcome", description: "Debt delinquency rate of 90+ days on loan in 2020", textFormat: "percent", colorScheme: "SpectralBlueYellowRed", tractDisabled: true },
  { id: "deliq_rate_inc", title: "Debt Delinquency, Accounting for Income", type: "outcome", description: "Debt delinquency rate of 90+ days on loan in 2020, comparing people with similar income levels from 2016", textFormat: "percent", colorScheme: "SpectralBlueYellowRed", tractDisabled: true },
  { id: "auto_loan_balance", title: "Auto Loan Balance", type: "outcome", description: "Average auto loan balance in 2020", textFormat: "income", colorScheme: "SpectralBlueYellowRed", tractDisabled: true },
  { id: "mortgage_loan_balance", title: "Mortgage Balance", type: "outcome", description: "Average balance on mortgage in 2020", textFormat: "income", colorScheme: "SpectralBlueYellowRed", tractDisabled: true },
  { id: "credit_loan_balance", title: "Credit Card Balance", type: "outcome", description: "Average balance on credit cards in 2020", textFormat: "income", colorScheme: "SpectralBlueYellowRed", tractDisabled: true },
  { id: "student_loan_balance", title: "Student Loan Balance", type: "outcome", description: "Average balance on student loans in 2020", textFormat: "income", colorScheme: "SpectralBlueYellowRed", tractDisabled: true },
  { id: "delta_kfr_27", title: "Change in Household Income between 1978 and 1992 Cohorts", type: "outcome", description: "Percent change in household income at age 27 between people born in 1978 and 1992", textFormat: "percent", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "kfr_27", title: "Household Income for Children Born in 1978", type: "outcome", description: "Average annual household income earned at age 27 by children born in 1978", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "kfr_27_1992", title: "Household Income for Children Born in 1992", type: "outcome", description: "Average annual household income earned at age 27 by children born in 1992", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "delta_kir_27", title: "Change in Individual Income between 1978 and 1992 Cohorts", type: "outcome", description: "Percent change in individual income at age 27 between people born in 1978 and 1992", textFormat: "percent", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "kir_27", title: "Individual Income for Children Born in 1978", type: "outcome", description: "Average annual individual income earned at age 27 by children born in 1978", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "kir_27_1992", title: "Individual Income for Children Born in 1992", type: "outcome", description: "Average annual individual income earned at age 27 by children born in 1992", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "frac_par_work", title: "Fraction of Employed Parents for Children Born in 1978", type: "outcome", description: "Fraction of employed parents of children born in 1978", textFormat: "percent", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "frac_par_work_1992", title: "Fraction of Employed Parents for Children Born in 1992", type: "outcome", description: "Fraction of employed parents of children born in 1992", textFormat: "percent", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "delta_frac_par_work", title: "Change in the Fraction of Employed Parents", type: "outcome", description: "Percentage point change in the fraction of employed parents between 1978 and 1992 cohorts", textFormat: "percentagePoint", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "kfr_top20", title: "Fraction in Top 20% Based on Household Income", type: "outcome", description: "Fraction with household income in the top 20%", textFormat: "boundPercent1-50", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "kfr_top01", title: "Fraction in Top 1% Based on Household Income", type: "outcome", description: "Fraction with household income in the top 1%", textFormat: "boundPercent1-10", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "kir", title: "Individual Income (Excluding Spouse) at Age 35", type: "outcome", description: "Average annual individual income excluding spouse in 2014-15", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "kir_top20", title: "Fraction in Top 20% Based on Individual Income", type: "outcome", description: "Fraction with individual income in the top 20%", textFormat: "boundPercent1-50", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "kir_top01", title: "Fraction in Top 1% Based on Individual Income", type: "outcome", description: "Fraction with individual income in the top 1%", textFormat: "boundPercent1-10", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "married", title: "Fraction Married at Age 35", type: "outcome", description: "Fraction who were married in 2015", textFormat: "boundPercent5-95", colorScheme: "PinkPurple", tractDisabled: false },
  { id: "wageflex_rank", title: "Hourly Wage ($/hour) at Age 35", type: "outcome", description: "Average hourly wage rate", textFormat: "money2d", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "working", title: "Employment Rate at Age 35", type: "outcome", description: "Fraction who have positive earnings in 2015", textFormat: "boundPercent5-95", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "kfr_staycz", title: "Household Income (Stayed in Commuting Zone)", type: "outcome", description: "Average household income for children who stayed in the same commuting zone", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "kir_staycz", title: "Individual Income (Stayed in Commuting Zone)", type: "outcome", description: "Average individual income for children who stayed in the same commuting zone", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "staycz", title: "% Staying in Same Commuting Zone as Adults", type: "outcome", description: "Fraction who stayed in the same commuting zone as where they grew up", textFormat: "boundPercent5-95", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "staytract", title: "% Staying in Same Tract as Adults", type: "outcome", description: "Fraction who stayed in the same tract as where they grew up", textFormat: "boundPercent5-95", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "spouse_rank", title: "Spouse's Income at Age 35", type: "outcome", description: "Average individual income for spouses", textFormat: "income", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "teenbirth", title: "Teenage Birth Rate (women only)", type: "outcome", description: "Fraction of women who had a child between ages 13-19", textFormat: "boundPercent1-50", colorScheme: "SpectralBlueYellowRed", tractDisabled: false },
  { id: "count", title: "Number of Children", type: "outcome", description: "Number of children below age 18 in 2000", textFormat: "integer", colorScheme: "YellowBlue", tractDisabled: false },
  { id: "median_rent2016", title: "Median Rent 2012-16", type: "characteristic", description: "Median rent in this area between 2012-16", textFormat: "money", colorScheme: "YellowBlue", tractDisabled: false },
  { id: "med_hhinc2016_real", title: "Median Household Income of Residents in 2012-16", type: "characteristic", description: "Median household income in 2016", textFormat: "money", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "med_hhinc2010", title: "Median Household Income - 2010", type: "characteristic", description: "Median household income in 2010", textFormat: "money", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "med_hhinc1990_real", title: "Median Household Income of Residents in 1990", type: "characteristic", description: "Median household income in 1990", textFormat: "money", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "hhinc_mean2010", title: "Mean Household Income", type: "characteristic", description: "Mean household income in 2010", textFormat: "money", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "lfp2010", title: "Labor Force Participation", type: "characteristic", description: "Share of adults who are either employed or looking for work in 2010", textFormat: "percent", colorScheme: "YellowBlue", tractDisabled: false },
  { id: "nonwhite_share2010", title: "Fraction Non-White in 2010", type: "characteristic", description: "Fraction of residents who identify as a race or ethnicity other than white non-Hispanic", textFormat: "percent", colorScheme: "PinkPurple", tractDisabled: false },
  { id: "foreign_share2016", title: "Foreign-Born Share in 2012-16", type: "characteristic", description: "Fraction of residents born outside the U.S. in 2012-16", textFormat: "percent", colorScheme: "PinkPurple", tractDisabled: false },
  { id: "unemp2015", title: "Unemployment Rate", type: "characteristic", description: "Share of working-age population not employed and looking for work in 2015", textFormat: "percent", colorScheme: "SpectralBlueYellowRed", tractDisabled: false },
  { id: "traveltime15_2016", title: "Fraction with Short Work Commutes in 2012-16", type: "characteristic", description: "Fraction of residents who commute fewer than 15 minutes to work", textFormat: "percent", colorScheme: "YellowBlue", tractDisabled: false },
  { id: "singleparent_share2016", title: "Fraction Single Parents in 2012-16", type: "characteristic", description: "Fraction of children growing up in single-parent families", textFormat: "percent", colorScheme: "PinkPurple", tractDisabled: false },
  { id: "poor_share2016", title: "Poverty Rate in 2012-16", type: "characteristic", description: "Fraction of residents below the federal poverty line in 2012-16", textFormat: "percent", colorScheme: "SpectralBlueYellowRed", tractDisabled: false },
  { id: "popdensity2010", title: "Population Density in 2010", type: "characteristic", description: "Number of residents per square mile in 2010", textFormat: "number", colorScheme: "YellowBlue", tractDisabled: false },
  { id: "pop2010", title: "Population in 2010", type: "characteristic", description: "Population in 2010", textFormat: "number", colorScheme: "YellowBlue", tractDisabled: false },
  { id: "ann_avg_job_growth_2004_2013", title: "Job Growth Rate from 2004 to 2013", type: "characteristic", description: "Average annualized job growth rate from 2004 to 2013", textFormat: "percent", colorScheme: "SpectralRedYellowBlue", tractDisabled: false },
  { id: "job_density_2013", title: "Density of Jobs in 2013", type: "characteristic", description: "Number of jobs per square mile in 2013", textFormat: "number", colorScheme: "YellowBlue", tractDisabled: false },
  { id: "mail_return_rate2010", title: "Census Response Rate (Social Capital Proxy)", type: "characteristic", description: "Fraction of 2010 Decennial Census forms returned by mail", textFormat: "percent/100", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "frac_coll_plus2016", title: "Fraction College Graduates in 2012-16", type: "characteristic", description: "Fraction of residents over age 25 with a college degree", textFormat: "percent", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "aland_sqmi", title: "Land Area", type: "characteristic", description: "Land area in square miles", textFormat: "number", colorScheme: "YellowBlue", tractDisabled: true },
  { id: "d_med_hh_inc", title: "Change in Median Household Income", type: "characteristic", description: "Difference between median household income in 1990 and 2005-2009", textFormat: "money", colorScheme: "SpectralRedYellowBlue", tractDisabled: true },
  { id: "d_poverty_rate", title: "Change in Poverty Rate", type: "characteristic", description: "Percentage point change in poverty rate between 1990 and 2005-2009", textFormat: "percentagePoint", colorScheme: "SpectralBlueYellowRed", tractDisabled: true },
  { id: "d_frac_college_graduates", title: "Change in Fraction of College Graduates", type: "characteristic", description: "Percentage point change in the fraction of residents over 25 with a bachelor's degree or higher", textFormat: "percentagePoint", colorScheme: "divergingPurpleGreen", tractDisabled: true },
  { id: "d_share_non_white", title: "Change in Fraction of Non-White Population", type: "characteristic", description: "Percentage point change in residents who identify as other than white non-Hispanic", textFormat: "percentagePoint", colorScheme: "divergingPurpleGreen", tractDisabled: true },
  { id: "d_share_foreign_born", title: "Change in Foreign-Born Share", type: "characteristic", description: "Percentage point change in residents born outside the United States", textFormat: "percentagePoint", colorScheme: "divergingPurpleGreen", tractDisabled: true },
  { id: "d_frac_single_parents", title: "Change in Fraction of Single-Parent Households", type: "characteristic", description: "Percentage point change in households with children whose head of household was single", textFormat: "percentagePoint", colorScheme: "divergingPurpleGreen", tractDisabled: true }
];
const OPPORTUNITY_BY_ID = Object.fromEntries(OPPORTUNITY_OVERLAYS.map((overlay) => [overlay.id, overlay]));
const OPPORTUNITY_CREDIT_SOURCES = {
  cred_score: { file: "opportunity_atlas_avg_credit_score_2020_cty.csv", column: "shrunk_xkid_vscore2020" },
  deliq_rate: { file: "opportunity_atlas_avg_delinq_rate_2020_cty.csv", column: "shrunk_xkid_delinq90_02020" },
  deliq_rate_inc: { file: "opportunity_atlas_avg_delinq_rate_2020_cont_income_cty.csv", column: "shrunk_income_resid_2020" },
  auto_loan_balance: { file: "opportunity_atlas_avg_auto_loan_balance_2020_cty.csv", column: "shrunk_xkid_auabalance2020" },
  mortgage_loan_balance: { file: "opportunity_atlas_avg_mortgage_balance_2020_cty.csv", column: "shrunk_xkid_mtabalance2020" },
  credit_loan_balance: { file: "opportunity_atlas_avg_credit_card_balance_2020_cty.csv", column: "shrunk_xkid_brcbalance2020" },
  student_loan_balance: { file: "opportunity_atlas_avg_student_loan_balance_2020_cty.csv", column: "shrunk_xkid_stubalance2020" }
};
const OPPORTUNITY_TREND_COLUMNS = {
  delta_kfr_27: "change_kfr_pooled_pooled_p25",
  kfr_27: "kfr_pooled_pooled_p25_1978",
  kfr_27_1992: "kfr_pooled_pooled_p25_1992",
  delta_kir_27: "change_kir_pooled_pooled_p25",
  kir_27: "kir_pooled_pooled_p25_1978",
  kir_27_1992: "kir_pooled_pooled_p25_1992",
  frac_par_work: "fpw_pooled_pooled_p25_1978",
  frac_par_work_1992: "fpw_pooled_pooled_p25_1992",
  delta_frac_par_work: "change_fpw_pooled_pooled_p25"
};
const OPPORTUNITY_COVARIATE_CHANGE_COLUMNS = {
  d_frac_college_graduates: "change_frac_coll_pooled1990_2009",
  d_share_foreign_born: "change_foreign_share1990_2009",
  d_frac_single_parents: "change_singlepar_pooled1990_2010"
};
const OPPORTUNITY_COLOR_SCHEMES = {
  SpectralRedYellowBlue: ["#b2182b", "#ef8a62", "#fddbc7", "#f7f7f7", "#d1e5f0", "#67a9cf", "#2166ac"],
  SpectralBlueYellowRed: ["#2166ac", "#67a9cf", "#d1e5f0", "#f7f7f7", "#fddbc7", "#ef8a62", "#b2182b"],
  YellowBlue: ["#fff7bc", "#fee391", "#fec44f", "#41b6c4", "#225ea8"],
  PinkPurple: ["#fde0dd", "#fa9fb5", "#c51b8a", "#7a0177"],
  divergingPurpleGreen: ["#762a83", "#af8dc3", "#f7f7f7", "#7fbf7b", "#1b7837"]
};
const TRANSLATIONS = {
  es: {
    "Language": "Idioma",
    "Boundary type": "Tipo de límite",
    "Find a {type}": "Buscar {type}",
    "Search by city, state, or code": "Buscar por ciudad, estado o código",
    "Search {plural} by name or code": "Buscar {plural} por nombre o código",
    "Loading urban areas...": "Cargando áreas urbanas...",
    "Select a {type}": "Seleccione {type}",
    "Click a boundary on the map or choose one from the list.": "Haga clic en un límite del mapa o elija uno de la lista.",
    "Directory": "Directorio",
    "Map controls": "Controles del mapa",
    "Zoom to the United States": "Acercar a Estados Unidos",
    "Show or hide Census Dots background": "Mostrar u ocultar el fondo de Census Dots",
    "Show or hide boundaries": "Mostrar u ocultar límites",
    "Dots": "Puntos",
    "Areas": "Áreas",
    "Boundaries": "Límites",
    "Census Dots legend": "Leyenda de Census Dots",
    "Colors show the race or ethnicity category used by Census Dots.": "Los colores muestran la categoría de raza o etnicidad usada por Census Dots.",
    "One dot represents one person counted in the 2020 Census.": "Un punto representa a una persona contada en el Censo de 2020.",
    "White": "Blanca",
    "Black": "Negra",
    "Asian": "Asiática",
    "Hispanic": "Hispana",
    "Native American/Other": "Nativa americana/Otra",
    "Multiracial": "Multirracial",
    "Population": "Población",
    "Density": "Densidad",
    "Fit on map": "Ajustar en el mapa",
    "Full profile and charts": "Perfil completo y gráficos",
    "Open Census Reporter": "Abrir Census Reporter",
    "Demographics": "Demografía",
    "Median age": "Edad mediana",
    "Sex": "Sexo",
    "female": "mujeres",
    "male": "hombres",
    "Foreign-born population": "Población nacida en el extranjero",
    "Language other than English at home": "Idioma distinto del inglés en casa",
    "Race & ethnicity": "Raza y etnicidad",
    "Economics": "Economía",
    "Median household income": "Ingreso familiar mediano",
    "Poverty": "Pobreza",
    "people": "personas",
    "Families & Housing": "Familias y vivienda",
    "Households": "Hogares",
    "Housing units": "Unidades de vivienda",
    "Social": "Social",
    "Not available": "No disponible"
  },
  "zh-Hans": {
    "Language": "语言",
    "Boundary type": "边界类型",
    "Find a {type}": "查找{type}",
    "Search by city, state, or code": "按城市、州或代码搜索",
    "Search {plural} by name or code": "按名称或代码搜索{plural}",
    "Loading urban areas...": "正在加载城市区域...",
    "Select a {type}": "选择{type}",
    "Click a boundary on the map or choose one from the list.": "点击地图上的边界，或从列表中选择。",
    "Directory": "目录",
    "Map controls": "地图控件",
    "Zoom to the United States": "缩放到美国",
    "Show or hide Census Dots background": "显示或隐藏 Census Dots 背景",
    "Show or hide boundaries": "显示或隐藏边界",
    "Dots": "点",
    "Areas": "区域",
    "Boundaries": "边界",
    "Census Dots legend": "Census Dots 图例",
    "Colors show the race or ethnicity category used by Census Dots.": "颜色表示 Census Dots 使用的种族或族裔类别。",
    "One dot represents one person counted in the 2020 Census.": "一个点代表 2020 年人口普查中的一人。",
    "White": "白人",
    "Black": "黑人",
    "Asian": "亚裔",
    "Hispanic": "西班牙裔",
    "Native American/Other": "美洲原住民/其他",
    "Multiracial": "多种族",
    "Population": "人口",
    "Density": "密度",
    "Fit on map": "适配地图",
    "Full profile and charts": "完整资料和图表",
    "Open Census Reporter": "打开 Census Reporter",
    "Demographics": "人口统计",
    "Median age": "年龄中位数",
    "Sex": "性别",
    "female": "女性",
    "male": "男性",
    "Foreign-born population": "外国出生人口",
    "Language other than English at home": "家中使用非英语",
    "Race & ethnicity": "种族和族裔",
    "Economics": "经济",
    "Median household income": "家庭收入中位数",
    "Poverty": "贫困",
    "people": "人",
    "Families & Housing": "家庭和住房",
    "Households": "家庭户",
    "Housing units": "住房单元",
    "Social": "社会",
    "Not available": "不可用"
  },
  "zh-Hant": {
    "Language": "語言",
    "Boundary type": "邊界類型",
    "Find a {type}": "尋找{type}",
    "Search by city, state, or code": "按城市、州或代碼搜尋",
    "Search {plural} by name or code": "按名稱或代碼搜尋{plural}",
    "Loading urban areas...": "正在載入城市區域...",
    "Select a {type}": "選擇{type}",
    "Click a boundary on the map or choose one from the list.": "點選地圖上的邊界，或從清單中選擇。",
    "Directory": "目錄",
    "Map controls": "地圖控制",
    "Zoom to the United States": "縮放到美國",
    "Show or hide Census Dots background": "顯示或隱藏 Census Dots 背景",
    "Show or hide boundaries": "顯示或隱藏邊界",
    "Dots": "點",
    "Areas": "區域",
    "Boundaries": "邊界",
    "Census Dots legend": "Census Dots 圖例",
    "Colors show the race or ethnicity category used by Census Dots.": "顏色表示 Census Dots 使用的種族或族裔類別。",
    "One dot represents one person counted in the 2020 Census.": "一個點代表 2020 年人口普查中的一人。",
    "White": "白人",
    "Black": "黑人",
    "Asian": "亞裔",
    "Hispanic": "西班牙裔",
    "Native American/Other": "美洲原住民/其他",
    "Multiracial": "多種族",
    "Population": "人口",
    "Density": "密度",
    "Fit on map": "適配地圖",
    "Full profile and charts": "完整資料和圖表",
    "Open Census Reporter": "開啟 Census Reporter",
    "Demographics": "人口統計",
    "Median age": "年齡中位數",
    "Sex": "性別",
    "female": "女性",
    "male": "男性",
    "Race & ethnicity": "種族和族裔",
    "Economics": "經濟",
    "Median household income": "家庭收入中位數",
    "Poverty": "貧困",
    "people": "人",
    "Not available": "不可用"
  },
  fr: {
    "Language": "Langue",
    "Boundary type": "Type de limite",
    "Find a {type}": "Trouver {type}",
    "Search by city, state, or code": "Rechercher par ville, État ou code",
    "Search {plural} by name or code": "Rechercher {plural} par nom ou code",
    "Loading urban areas...": "Chargement des zones urbaines...",
    "Select a {type}": "Sélectionnez {type}",
    "Click a boundary on the map or choose one from the list.": "Cliquez sur une limite sur la carte ou choisissez-en une dans la liste.",
    "Directory": "Répertoire",
    "Map controls": "Contrôles de la carte",
    "Zoom to the United States": "Zoomer sur les États-Unis",
    "Show or hide Census Dots background": "Afficher ou masquer le fond Census Dots",
    "Show or hide boundaries": "Afficher ou masquer les limites",
    "Dots": "Points",
    "Areas": "Zones",
    "Boundaries": "Limites",
    "Census Dots legend": "Légende Census Dots",
    "Colors show the race or ethnicity category used by Census Dots.": "Les couleurs indiquent la catégorie de race ou d'ethnicité utilisée par Census Dots.",
    "One dot represents one person counted in the 2020 Census.": "Un point représente une personne recensée en 2020.",
    "White": "Blanc",
    "Black": "Noir",
    "Asian": "Asiatique",
    "Hispanic": "Hispanique",
    "Native American/Other": "Amérindien/Autre",
    "Multiracial": "Multiracial",
    "Population": "Population",
    "Density": "Densité",
    "Demographics": "Démographie",
    "Median age": "Âge médian",
    "Race & ethnicity": "Race et ethnicité",
    "Economics": "Économie",
    "Poverty": "Pauvreté",
    "people": "personnes",
    "Not available": "Non disponible"
  },
  de: {
    "Language": "Sprache",
    "Boundary type": "Grenztyp",
    "Find a {type}": "{type} suchen",
    "Search by city, state, or code": "Nach Stadt, Bundesstaat oder Code suchen",
    "Search {plural} by name or code": "{plural} nach Name oder Code suchen",
    "Loading urban areas...": "Städtische Gebiete werden geladen...",
    "Select a {type}": "{type} auswählen",
    "Click a boundary on the map or choose one from the list.": "Klicken Sie auf eine Grenze auf der Karte oder wählen Sie eine aus der Liste.",
    "Directory": "Verzeichnis",
    "Map controls": "Kartensteuerung",
    "Zoom to the United States": "Auf die Vereinigten Staaten zoomen",
    "Show or hide Census Dots background": "Census-Dots-Hintergrund ein- oder ausblenden",
    "Show or hide boundaries": "Grenzen ein- oder ausblenden",
    "Dots": "Punkte",
    "Areas": "Gebiete",
    "Boundaries": "Grenzen",
    "Census Dots legend": "Census-Dots-Legende",
    "Colors show the race or ethnicity category used by Census Dots.": "Farben zeigen die von Census Dots verwendete Kategorie für Ethnie oder Herkunft.",
    "One dot represents one person counted in the 2020 Census.": "Ein Punkt steht für eine im Census 2020 gezählte Person.",
    "White": "Weiß",
    "Black": "Schwarz",
    "Asian": "Asiatisch",
    "Hispanic": "Hispanisch",
    "Native American/Other": "Indigen/Andere",
    "Multiracial": "Mehrere Ethnien",
    "Population": "Bevölkerung",
    "Density": "Dichte",
    "Demographics": "Demografie",
    "Median age": "Medianalter",
    "Race & ethnicity": "Ethnie und Herkunft",
    "Economics": "Wirtschaft",
    "Poverty": "Armut",
    "people": "Personen",
    "Not available": "Nicht verfügbar"
  },
  it: {
    "Language": "Lingua",
    "Boundary type": "Tipo di confine",
    "Find a {type}": "Trova {type}",
    "Search by city, state, or code": "Cerca per città, stato o codice",
    "Search {plural} by name or code": "Cerca {plural} per nome o codice",
    "Loading urban areas...": "Caricamento aree urbane...",
    "Select a {type}": "Seleziona {type}",
    "Click a boundary on the map or choose one from the list.": "Fai clic su un confine nella mappa o scegline uno dall'elenco.",
    "Directory": "Elenco",
    "Map controls": "Controlli mappa",
    "Zoom to the United States": "Inquadra gli Stati Uniti",
    "Show or hide Census Dots background": "Mostra o nascondi lo sfondo Census Dots",
    "Show or hide boundaries": "Mostra o nascondi i confini",
    "Dots": "Punti",
    "Areas": "Aree",
    "Boundaries": "Confini",
    "Census Dots legend": "Legenda Census Dots",
    "Colors show the race or ethnicity category used by Census Dots.": "I colori indicano la categoria razziale o etnica usata da Census Dots.",
    "One dot represents one person counted in the 2020 Census.": "Un punto rappresenta una persona censita nel 2020.",
    "White": "Bianco",
    "Black": "Nero",
    "Asian": "Asiatico",
    "Hispanic": "Ispanico",
    "Native American/Other": "Nativo americano/Altro",
    "Multiracial": "Multirazziale",
    "Population": "Popolazione",
    "Density": "Densità",
    "Demographics": "Demografia",
    "Poverty": "Povertà",
    "people": "persone",
    "Not available": "Non disponibile"
  },
  pt: {
    "Language": "Idioma",
    "Boundary type": "Tipo de limite",
    "Find a {type}": "Encontrar {type}",
    "Search by city, state, or code": "Pesquisar por cidade, estado ou código",
    "Search {plural} by name or code": "Pesquisar {plural} por nome ou código",
    "Loading urban areas...": "Carregando áreas urbanas...",
    "Select a {type}": "Selecione {type}",
    "Click a boundary on the map or choose one from the list.": "Clique em um limite no mapa ou escolha um na lista.",
    "Directory": "Diretório",
    "Map controls": "Controles do mapa",
    "Zoom to the United States": "Aproximar nos Estados Unidos",
    "Show or hide Census Dots background": "Mostrar ou ocultar o fundo Census Dots",
    "Show or hide boundaries": "Mostrar ou ocultar limites",
    "Dots": "Pontos",
    "Areas": "Áreas",
    "Boundaries": "Limites",
    "Census Dots legend": "Legenda do Census Dots",
    "Colors show the race or ethnicity category used by Census Dots.": "As cores mostram a categoria de raça ou etnia usada pelo Census Dots.",
    "One dot represents one person counted in the 2020 Census.": "Um ponto representa uma pessoa contada no Censo de 2020.",
    "White": "Branca",
    "Black": "Negra",
    "Asian": "Asiática",
    "Hispanic": "Hispânica",
    "Native American/Other": "Nativa americana/Outra",
    "Multiracial": "Multirracial",
    "Population": "População",
    "Density": "Densidade",
    "Demographics": "Demografia",
    "Poverty": "Pobreza",
    "people": "pessoas",
    "Not available": "Não disponível"
  },
  ar: {
    "Language": "اللغة",
    "Boundary type": "نوع الحدود",
    "Find a {type}": "ابحث عن {type}",
    "Search by city, state, or code": "ابحث حسب المدينة أو الولاية أو الرمز",
    "Search {plural} by name or code": "ابحث في {plural} حسب الاسم أو الرمز",
    "Loading urban areas...": "جار تحميل المناطق الحضرية...",
    "Select a {type}": "اختر {type}",
    "Click a boundary on the map or choose one from the list.": "انقر على حد في الخريطة أو اختر واحدا من القائمة.",
    "Directory": "الدليل",
    "Map controls": "أدوات الخريطة",
    "Zoom to the United States": "تكبير إلى الولايات المتحدة",
    "Show or hide Census Dots background": "إظهار أو إخفاء خلفية Census Dots",
    "Show or hide boundaries": "إظهار أو إخفاء الحدود",
    "Dots": "النقاط",
    "Areas": "المناطق",
    "Boundaries": "الحدود",
    "Census Dots legend": "مفتاح Census Dots",
    "Colors show the race or ethnicity category used by Census Dots.": "توضح الألوان فئة العرق أو الإثنية المستخدمة في Census Dots.",
    "One dot represents one person counted in the 2020 Census.": "تمثل كل نقطة شخصا واحدا تم عده في تعداد 2020.",
    "White": "أبيض",
    "Black": "أسود",
    "Asian": "آسيوي",
    "Hispanic": "لاتيني",
    "Native American/Other": "أمريكي أصلي/أخرى",
    "Multiracial": "متعدد الأعراق",
    "Population": "السكان",
    "Density": "الكثافة",
    "Demographics": "الديموغرافيا",
    "Poverty": "الفقر",
    "people": "أشخاص",
    "Not available": "غير متاح"
  },
  hi: {
    "Language": "भाषा",
    "Boundary type": "सीमा प्रकार",
    "Find a {type}": "{type} खोजें",
    "Search by city, state, or code": "शहर, राज्य या कोड से खोजें",
    "Search {plural} by name or code": "{plural} को नाम या कोड से खोजें",
    "Loading urban areas...": "शहरी क्षेत्र लोड हो रहे हैं...",
    "Select a {type}": "{type} चुनें",
    "Click a boundary on the map or choose one from the list.": "मानचित्र पर किसी सीमा पर क्लिक करें या सूची से चुनें।",
    "Directory": "निर्देशिका",
    "Map controls": "मानचित्र नियंत्रण",
    "Zoom to the United States": "संयुक्त राज्य तक ज़ूम करें",
    "Show or hide Census Dots background": "Census Dots पृष्ठभूमि दिखाएं या छिपाएं",
    "Show or hide boundaries": "सीमाएं दिखाएं या छिपाएं",
    "Dots": "बिंदु",
    "Areas": "क्षेत्र",
    "Boundaries": "सीमाएं",
    "Census Dots legend": "Census Dots कुंजी",
    "Colors show the race or ethnicity category used by Census Dots.": "रंग Census Dots में उपयोग की गई नस्ल या जातीयता श्रेणी दिखाते हैं।",
    "One dot represents one person counted in the 2020 Census.": "एक बिंदु 2020 जनगणना में गिने गए एक व्यक्ति को दर्शाता है।",
    "White": "श्वेत",
    "Black": "काला",
    "Asian": "एशियाई",
    "Hispanic": "हिस्पैनिक",
    "Native American/Other": "मूल अमेरिकी/अन्य",
    "Multiracial": "बहु-नस्ली",
    "Population": "जनसंख्या",
    "Density": "घनत्व",
    "Demographics": "जनसांख्यिकी",
    "Poverty": "गरीबी",
    "people": "लोग",
    "Not available": "उपलब्ध नहीं"
  },
  bn: {
    "Language": "ভাষা",
    "Boundary type": "সীমানার ধরন",
    "Find a {type}": "{type} খুঁজুন",
    "Search by city, state, or code": "শহর, অঙ্গরাজ্য বা কোড দিয়ে খুঁজুন",
    "Search {plural} by name or code": "নাম বা কোড দিয়ে {plural} খুঁজুন",
    "Loading urban areas...": "শহুরে এলাকা লোড হচ্ছে...",
    "Select a {type}": "{type} নির্বাচন করুন",
    "Click a boundary on the map or choose one from the list.": "মানচিত্রে একটি সীমানায় ক্লিক করুন বা তালিকা থেকে বেছে নিন।",
    "Directory": "ডিরেক্টরি",
    "Map controls": "মানচিত্র নিয়ন্ত্রণ",
    "Zoom to the United States": "যুক্তরাষ্ট্রে জুম করুন",
    "Show or hide Census Dots background": "Census Dots পটভূমি দেখান বা লুকান",
    "Show or hide boundaries": "সীমানা দেখান বা লুকান",
    "Dots": "বিন্দু",
    "Areas": "এলাকা",
    "Boundaries": "সীমানা",
    "Census Dots legend": "Census Dots লেজেন্ড",
    "Colors show the race or ethnicity category used by Census Dots.": "রং Census Dots ব্যবহৃত জাতি বা জাতিগত শ্রেণি দেখায়।",
    "One dot represents one person counted in the 2020 Census.": "একটি বিন্দু ২০২০ সালের আদমশুমারিতে গণনা করা একজন মানুষকে বোঝায়।",
    "White": "শ্বেত",
    "Black": "কৃষ্ণাঙ্গ",
    "Asian": "এশীয়",
    "Hispanic": "হিস্পানিক",
    "Native American/Other": "নেটিভ আমেরিকান/অন্যান্য",
    "Multiracial": "বহুজাতি",
    "Population": "জনসংখ্যা",
    "Density": "ঘনত্ব",
    "Demographics": "জনতাত্ত্বিক তথ্য",
    "Poverty": "দারিদ্র্য",
    "people": "মানুষ",
    "Not available": "উপলভ্য নয়"
  },
  ja: {
    "Language": "言語",
    "Boundary type": "境界タイプ",
    "Find a {type}": "{type}を検索",
    "Search by city, state, or code": "市、州、コードで検索",
    "Search {plural} by name or code": "{plural}を名前またはコードで検索",
    "Loading urban areas...": "都市地域を読み込み中...",
    "Select a {type}": "{type}を選択",
    "Click a boundary on the map or choose one from the list.": "地図上の境界をクリックするか、一覧から選択してください。",
    "Directory": "ディレクトリ",
    "Map controls": "地図操作",
    "Zoom to the United States": "米国全体にズーム",
    "Show or hide Census Dots background": "Census Dots 背景を表示/非表示",
    "Show or hide boundaries": "境界を表示/非表示",
    "Dots": "ドット",
    "Areas": "エリア",
    "Boundaries": "境界",
    "Census Dots legend": "Census Dots 凡例",
    "Colors show the race or ethnicity category used by Census Dots.": "色は Census Dots で使われる人種または民族カテゴリを示します。",
    "One dot represents one person counted in the 2020 Census.": "1つの点は2020年国勢調査で数えられた1人を表します。",
    "White": "白人",
    "Black": "黒人",
    "Asian": "アジア系",
    "Hispanic": "ヒスパニック",
    "Native American/Other": "ネイティブアメリカン/その他",
    "Multiracial": "複数人種",
    "Population": "人口",
    "Density": "密度",
    "Demographics": "人口統計",
    "Poverty": "貧困",
    "people": "人",
    "Not available": "利用不可"
  },
  vi: {
    "Language": "Ngôn ngữ",
    "Boundary type": "Loại ranh giới",
    "Find a {type}": "Tìm {type}",
    "Search by city, state, or code": "Tìm theo thành phố, tiểu bang hoặc mã",
    "Search {plural} by name or code": "Tìm {plural} theo tên hoặc mã",
    "Loading urban areas...": "Đang tải khu vực đô thị...",
    "Select a {type}": "Chọn {type}",
    "Click a boundary on the map or choose one from the list.": "Bấm vào ranh giới trên bản đồ hoặc chọn trong danh sách.",
    "Directory": "Danh mục",
    "Map controls": "Điều khiển bản đồ",
    "Zoom to the United States": "Thu phóng đến Hoa Kỳ",
    "Show or hide Census Dots background": "Hiện hoặc ẩn nền Census Dots",
    "Show or hide boundaries": "Hiện hoặc ẩn ranh giới",
    "Dots": "Chấm",
    "Areas": "Khu vực",
    "Boundaries": "Ranh giới",
    "Census Dots legend": "Chú giải Census Dots",
    "Colors show the race or ethnicity category used by Census Dots.": "Màu thể hiện nhóm chủng tộc hoặc sắc tộc dùng trong Census Dots.",
    "One dot represents one person counted in the 2020 Census.": "Một chấm đại diện cho một người được tính trong Điều tra dân số 2020.",
    "White": "Da trắng",
    "Black": "Da đen",
    "Asian": "Châu Á",
    "Hispanic": "Hispanic",
    "Native American/Other": "Người bản địa/Khác",
    "Multiracial": "Đa chủng tộc",
    "Population": "Dân số",
    "Density": "Mật độ",
    "Demographics": "Nhân khẩu học",
    "Poverty": "Nghèo đói",
    "people": "người",
    "Not available": "Không có"
  },
  ko: {
    "Language": "언어",
    "Boundary type": "경계 유형",
    "Find a {type}": "{type} 찾기",
    "Search by city, state, or code": "도시, 주 또는 코드로 검색",
    "Search {plural} by name or code": "{plural}을 이름 또는 코드로 검색",
    "Loading urban areas...": "도시 지역 로드 중...",
    "Select a {type}": "{type} 선택",
    "Click a boundary on the map or choose one from the list.": "지도에서 경계를 클릭하거나 목록에서 선택하세요.",
    "Directory": "목록",
    "Map controls": "지도 제어",
    "Zoom to the United States": "미국으로 확대",
    "Show or hide Census Dots background": "Census Dots 배경 표시 또는 숨기기",
    "Show or hide boundaries": "경계 표시 또는 숨기기",
    "Dots": "점",
    "Areas": "지역",
    "Boundaries": "경계",
    "Census Dots legend": "Census Dots 범례",
    "Colors show the race or ethnicity category used by Census Dots.": "색상은 Census Dots에서 사용하는 인종 또는 민족 범주를 나타냅니다.",
    "One dot represents one person counted in the 2020 Census.": "점 하나는 2020년 인구조사에서 집계된 한 사람을 나타냅니다.",
    "White": "백인",
    "Black": "흑인",
    "Asian": "아시아인",
    "Hispanic": "히스패닉",
    "Native American/Other": "아메리카 원주민/기타",
    "Multiracial": "다인종",
    "Population": "인구",
    "Density": "밀도",
    "Demographics": "인구 통계",
    "Poverty": "빈곤",
    "people": "명",
    "Not available": "사용 불가"
  },
  ru: {
    "Language": "Язык",
    "Boundary type": "Тип границы",
    "Find a {type}": "Найти {type}",
    "Search by city, state, or code": "Поиск по городу, штату или коду",
    "Search {plural} by name or code": "Искать {plural} по названию или коду",
    "Loading urban areas...": "Загрузка городских территорий...",
    "Select a {type}": "Выберите {type}",
    "Click a boundary on the map or choose one from the list.": "Нажмите границу на карте или выберите ее из списка.",
    "Directory": "Каталог",
    "Map controls": "Управление картой",
    "Zoom to the United States": "Показать США",
    "Show or hide Census Dots background": "Показать или скрыть фон Census Dots",
    "Show or hide boundaries": "Показать или скрыть границы",
    "Dots": "Точки",
    "Areas": "Области",
    "Boundaries": "Границы",
    "Census Dots legend": "Легенда Census Dots",
    "Colors show the race or ethnicity category used by Census Dots.": "Цвета показывают категорию расы или этничности, используемую Census Dots.",
    "One dot represents one person counted in the 2020 Census.": "Одна точка представляет одного человека, учтенного в переписи 2020 года.",
    "White": "Белые",
    "Black": "Черные",
    "Asian": "Азиаты",
    "Hispanic": "Латиноамериканцы",
    "Native American/Other": "Коренные американцы/Другое",
    "Multiracial": "Многорасовые",
    "Population": "Население",
    "Density": "Плотность",
    "Demographics": "Демография",
    "Poverty": "Бедность",
    "people": "человек",
    "Not available": "Недоступно"
  }
};
const TEMPLATE_TRANSLATIONS = {
  "Showing {plural}": {
    es: "Mostrando {plural}",
    "zh-Hans": "正在显示{plural}",
    "zh-Hant": "正在顯示{plural}",
    fr: "Affichage des {plural}",
    de: "{plural} werden angezeigt",
    it: "Visualizzazione di {plural}",
    pt: "Mostrando {plural}",
    ar: "عرض {plural}",
    hi: "{plural} दिखाए जा रहे हैं",
    bn: "{plural} দেখানো হচ্ছে",
    ja: "{plural}を表示中",
    vi: "Đang hiển thị {plural}",
    ko: "{plural} 표시 중",
    ru: "Показ: {plural}"
  },
  "{count} urban areas": {
    es: "{count} áreas urbanas",
    "zh-Hans": "{count} 个城市区域",
    "zh-Hant": "{count} 個城市區域",
    fr: "{count} zones urbaines",
    de: "{count} städtische Gebiete",
    it: "{count} aree urbane",
    pt: "{count} áreas urbanas",
    ar: "{count} منطقة حضرية",
    hi: "{count} शहरी क्षेत्र",
    bn: "{count} শহুরে এলাকা",
    ja: "{count} 都市地域",
    vi: "{count} khu vực đô thị",
    ko: "{count} 도시 지역",
    ru: "{count} городских территорий"
  },
  "{type} profiles over Census Dots population tiles": {
    es: "Perfiles de {type} sobre teselas de población de Census Dots",
    "zh-Hans": "{type}资料叠加在 Census Dots 人口图块上",
    "zh-Hant": "{type}資料疊加在 Census Dots 人口圖塊上",
    fr: "Profils {type} sur les tuiles de population Census Dots",
    de: "{type}-Profile über Census-Dots-Bevölkerungskacheln",
    it: "Profili {type} sopra le tessere di popolazione Census Dots",
    pt: "Perfis de {type} sobre blocos populacionais Census Dots",
    ar: "ملفات {type} فوق مربعات سكان Census Dots",
    hi: "Census Dots जनसंख्या टाइलों पर {type} प्रोफाइल",
    bn: "Census Dots জনসংখ্যা টাইলের উপর {type} প্রোফাইল",
    ja: "Census Dots 人口タイル上の{type}プロフィール",
    vi: "Hồ sơ {type} trên các ô dân số Census Dots",
    ko: "Census Dots 인구 타일 위의 {type} 프로필",
    ru: "Профили {type} поверх тайлов населения Census Dots"
  },
  "{type} details": {
    es: "Detalles de {type}",
    "zh-Hans": "{type}详情",
    "zh-Hant": "{type}詳情",
    fr: "Détails {type}",
    de: "{type}-Details",
    it: "Dettagli {type}",
    pt: "Detalhes de {type}",
    ar: "تفاصيل {type}",
    hi: "{type} विवरण",
    bn: "{type} বিবরণ",
    ja: "{type}の詳細",
    vi: "Chi tiết {type}",
    ko: "{type} 세부 정보",
    ru: "Сведения: {type}"
  },
  "Example {type}": {
    es: "Ejemplo de {type}",
    "zh-Hans": "{type}示例",
    "zh-Hant": "{type}範例",
    fr: "Exemple de {type}",
    de: "Beispiel: {type}",
    it: "Esempio di {type}",
    pt: "Exemplo de {type}",
    ar: "مثال {type}",
    hi: "उदाहरण {type}",
    bn: "উদাহরণ {type}",
    ja: "{type}の例",
    vi: "Ví dụ {type}",
    ko: "{type} 예시",
    ru: "Пример: {type}"
  },
  "No {plural} found. Try another name or code.": {
    es: "No se encontraron {plural}. Pruebe otro nombre o código.",
    "zh-Hans": "未找到{plural}。请尝试其他名称或代码。",
    "zh-Hant": "找不到{plural}。請嘗試其他名稱或代碼。",
    fr: "Aucun {plural} trouvé. Essayez un autre nom ou code.",
    de: "Keine {plural} gefunden. Versuchen Sie einen anderen Namen oder Code.",
    it: "Nessun risultato per {plural}. Prova un altro nome o codice.",
    pt: "Nenhum {plural} encontrado. Tente outro nome ou código.",
    ar: "لم يتم العثور على {plural}. جرب اسما أو رمزا آخر.",
    hi: "कोई {plural} नहीं मिला। दूसरा नाम या कोड आज़माएं।",
    bn: "কোনো {plural} পাওয়া যায়নি। অন্য নাম বা কোড চেষ্টা করুন।",
    ja: "{plural}が見つかりません。別の名前またはコードを試してください。",
    vi: "Không tìm thấy {plural}. Hãy thử tên hoặc mã khác.",
    ko: "{plural}을 찾을 수 없습니다. 다른 이름 또는 코드를 시도하세요.",
    ru: "{plural} не найдены. Попробуйте другое название или код."
  },
  "Searching {plural}...": {
    es: "Buscando {plural}...",
    "zh-Hans": "正在搜索{plural}...",
    "zh-Hant": "正在搜尋{plural}...",
    fr: "Recherche de {plural}...",
    de: "{plural} werden gesucht...",
    it: "Ricerca di {plural}...",
    pt: "Pesquisando {plural}...",
    ar: "جار البحث في {plural}...",
    hi: "{plural} खोजे जा रहे हैं...",
    bn: "{plural} খোঁজা হচ্ছে...",
    ja: "{plural}を検索中...",
    vi: "Đang tìm {plural}...",
    ko: "{plural} 검색 중...",
    ru: "Поиск: {plural}..."
  },
  "{count} people - click for profile": {
    es: "{count} personas - haga clic para ver el perfil",
    "zh-Hans": "{count} 人 - 点击查看资料",
    "zh-Hant": "{count} 人 - 點選查看資料",
    fr: "{count} personnes - cliquez pour le profil",
    de: "{count} Personen - für Profil klicken",
    it: "{count} persone - fai clic per il profilo",
    pt: "{count} pessoas - clique para o perfil",
    ar: "{count} شخص - انقر لعرض الملف",
    hi: "{count} लोग - प्रोफाइल के लिए क्लिक करें",
    bn: "{count} মানুষ - প্রোফাইলের জন্য ক্লিক করুন",
    ja: "{count} 人 - プロフィールを表示",
    vi: "{count} người - bấm để xem hồ sơ",
    ko: "{count}명 - 프로필을 보려면 클릭",
    ru: "{count} человек - нажмите для профиля"
  }
};
const GEOGRAPHY_TRANSLATIONS = {
  es: {
    urban: ["Área urbana", "áreas urbanas"],
    metro: ["Área metropolitana", "áreas metropolitanas y micropolitanas"],
    state: ["Estado", "estados"],
    division: ["División", "divisiones del Censo"],
    region: ["Región", "regiones del Censo"],
    nation: ["Nación", "geografías nacionales"],
    county: ["Condado", "condados"],
    csa: ["Área estadística combinada", "áreas estadísticas combinadas"],
    place: ["Lugar", "lugares"],
    countySubdivision: ["Subdivisión de condado", "subdivisiones de condado"],
    schoolDistrict: ["Distrito escolar", "distritos escolares"],
    stateHouse: ["Distrito de la cámara estatal", "distritos de la cámara estatal"],
    stateSenate: ["Distrito del senado estatal", "distritos del senado estatal"],
    congressional: ["Distrito congresional", "distritos congresionales"],
    zip: ["Código ZIP", "áreas tabuladas de código ZIP"],
    tract: ["Tracto censal", "tractos censales"],
    blockGroup: ["Grupo de bloques", "grupos de bloques"],
    puma: ["PUMA", "áreas PUMA"],
    reservation: ["Reservación", "reservaciones"]
  },
  "zh-Hans": {
    urban: ["城市区域", "城市区域"],
    metro: ["都会区", "都会和小都会区"],
    state: ["州", "州"],
    division: ["分区", "人口普查分区"],
    region: ["地区", "人口普查地区"],
    nation: ["国家", "全国地理范围"],
    county: ["县", "县"],
    csa: ["联合统计区", "联合统计区"],
    place: ["地点", "地点"],
    countySubdivision: ["县分区", "县分区"],
    schoolDistrict: ["学区", "学区"],
    stateHouse: ["州众议院选区", "州众议院选区"],
    stateSenate: ["州参议院选区", "州参议院选区"],
    congressional: ["国会选区", "国会选区"],
    zip: ["邮政编码", "邮政编码统计区"],
    tract: ["人口普查区", "人口普查区"],
    blockGroup: ["街区组", "街区组"],
    puma: ["PUMA", "公共使用微观数据区"],
    reservation: ["保留地", "保留地"]
  },
  "zh-Hant": {
    urban: ["城市區域", "城市區域"],
    metro: ["都會區", "都會和小都會區"],
    state: ["州", "州"],
    division: ["分區", "人口普查分區"],
    region: ["地區", "人口普查地區"],
    nation: ["國家", "全國地理範圍"],
    county: ["縣", "縣"],
    csa: ["聯合統計區", "聯合統計區"],
    place: ["地點", "地點"],
    countySubdivision: ["縣分區", "縣分區"],
    schoolDistrict: ["學區", "學區"],
    stateHouse: ["州眾議院選區", "州眾議院選區"],
    stateSenate: ["州參議院選區", "州參議院選區"],
    congressional: ["國會選區", "國會選區"],
    zip: ["郵遞區號", "郵遞區號統計區"],
    tract: ["人口普查區", "人口普查區"],
    blockGroup: ["街區組", "街區組"],
    puma: ["PUMA", "公共使用微觀資料區"],
    reservation: ["保留地", "保留地"]
  },
  fr: {
    urban: ["Zone urbaine", "zones urbaines"],
    metro: ["Aire métropolitaine", "aires métropolitaines et micropolitaines"],
    state: ["État", "États"],
    division: ["Division", "divisions du recensement"],
    region: ["Région", "régions du recensement"],
    nation: ["Nation", "géographies nationales"],
    county: ["Comté", "comtés"],
    csa: ["Aire statistique combinée", "aires statistiques combinées"],
    place: ["Localité", "localités"],
    countySubdivision: ["Subdivision de comté", "subdivisions de comté"],
    schoolDistrict: ["District scolaire", "districts scolaires"],
    stateHouse: ["District de chambre d'État", "districts de chambre d'État"],
    stateSenate: ["District de sénat d'État", "districts de sénat d'État"],
    congressional: ["District congressionnel", "districts congressionnels"],
    zip: ["Code ZIP", "zones de code ZIP"],
    tract: ["Secteur de recensement", "secteurs de recensement"],
    blockGroup: ["Groupe de blocs", "groupes de blocs"],
    puma: ["PUMA", "zones PUMA"],
    reservation: ["Réserve", "réserves"]
  },
  de: {
    urban: ["Städtisches Gebiet", "städtische Gebiete"],
    metro: ["Metropolgebiet", "Metro- und Mikrogebiete"],
    state: ["Bundesstaat", "Bundesstaaten"],
    division: ["Division", "Census-Divisionen"],
    region: ["Region", "Census-Regionen"],
    nation: ["Nation", "nationale Gebiete"],
    county: ["County", "Countys"],
    csa: ["Kombiniertes statistisches Gebiet", "kombinierte statistische Gebiete"],
    place: ["Ort", "Orte"],
    countySubdivision: ["County-Unterteilung", "County-Unterteilungen"],
    schoolDistrict: ["Schulbezirk", "Schulbezirke"],
    stateHouse: ["Wahlbezirk des State House", "Wahlbezirke des State House"],
    stateSenate: ["Wahlbezirk des Staatssenats", "Wahlbezirke des Staatssenats"],
    congressional: ["Kongresswahlbezirk", "Kongresswahlbezirke"],
    zip: ["ZIP-Code", "ZIP-Code-Gebiete"],
    tract: ["Census Tract", "Census Tracts"],
    blockGroup: ["Blockgruppe", "Blockgruppen"],
    puma: ["PUMA", "PUMA-Gebiete"],
    reservation: ["Reservation", "Reservationen"]
  },
  it: {
    urban: ["Area urbana", "aree urbane"],
    metro: ["Area metropolitana", "aree metropolitane e micropolitane"],
    state: ["Stato", "stati"],
    division: ["Divisione", "divisioni del censimento"],
    region: ["Regione", "regioni del censimento"],
    nation: ["Nazione", "aree nazionali"],
    county: ["Contea", "contee"],
    csa: ["Area statistica combinata", "aree statistiche combinate"],
    place: ["Località", "località"],
    countySubdivision: ["Suddivisione di contea", "suddivisioni di contea"],
    schoolDistrict: ["Distretto scolastico", "distretti scolastici"],
    stateHouse: ["Distretto della camera statale", "distretti della camera statale"],
    stateSenate: ["Distretto del senato statale", "distretti del senato statale"],
    congressional: ["Distretto congressuale", "distretti congressuali"],
    zip: ["Codice ZIP", "aree ZIP"],
    tract: ["Tratto censuario", "tratti censuari"],
    blockGroup: ["Gruppo di blocchi", "gruppi di blocchi"],
    puma: ["PUMA", "aree PUMA"],
    reservation: ["Riserva", "riserve"]
  },
  pt: {
    urban: ["Área urbana", "áreas urbanas"],
    metro: ["Área metropolitana", "áreas metropolitanas e micropolitanas"],
    state: ["Estado", "estados"],
    division: ["Divisão", "divisões do Censo"],
    region: ["Região", "regiões do Censo"],
    nation: ["Nação", "geografias nacionais"],
    county: ["Condado", "condados"],
    csa: ["Área estatística combinada", "áreas estatísticas combinadas"],
    place: ["Localidade", "localidades"],
    countySubdivision: ["Subdivisão de condado", "subdivisões de condado"],
    schoolDistrict: ["Distrito escolar", "distritos escolares"],
    stateHouse: ["Distrito da câmara estadual", "distritos da câmara estadual"],
    stateSenate: ["Distrito do senado estadual", "distritos do senado estadual"],
    congressional: ["Distrito congressional", "distritos congressionais"],
    zip: ["Código ZIP", "áreas de código ZIP"],
    tract: ["Setor censitário", "setores censitários"],
    blockGroup: ["Grupo de blocos", "grupos de blocos"],
    puma: ["PUMA", "áreas PUMA"],
    reservation: ["Reserva", "reservas"]
  },
  ar: {
    urban: ["منطقة حضرية", "المناطق الحضرية"],
    metro: ["منطقة حضرية كبرى", "المناطق الحضرية الكبرى والصغرى"],
    state: ["ولاية", "الولايات"],
    division: ["قسم", "أقسام التعداد"],
    region: ["إقليم", "أقاليم التعداد"],
    nation: ["دولة", "المناطق الوطنية"],
    county: ["مقاطعة", "المقاطعات"],
    csa: ["منطقة إحصائية مركزية", "المناطق الإحصائية المركزية"],
    place: ["مكان", "الأماكن"],
    countySubdivision: ["تقسيم مقاطعة", "تقسيمات المقاطعات"],
    schoolDistrict: ["منطقة مدرسية", "المناطق المدرسية"],
    stateHouse: ["دائرة مجلس الولاية", "دوائر مجلس الولاية"],
    stateSenate: ["دائرة مجلس الشيوخ في الولاية", "دوائر مجلس الشيوخ في الولاية"],
    congressional: ["دائرة الكونغرس", "دوائر الكونغرس"],
    zip: ["رمز ZIP", "مناطق رمز ZIP"],
    tract: ["قطاع تعداد", "قطاعات التعداد"],
    blockGroup: ["مجموعة كتل", "مجموعات الكتل"],
    puma: ["PUMA", "مناطق PUMA"],
    reservation: ["محمية", "المحميات"]
  },
  hi: {
    urban: ["शहरी क्षेत्र", "शहरी क्षेत्र"],
    metro: ["मेट्रो क्षेत्र", "मेट्रो और माइक्रो क्षेत्र"],
    state: ["राज्य", "राज्य"],
    division: ["डिवीजन", "जनगणना डिवीजन"],
    region: ["क्षेत्र", "जनगणना क्षेत्र"],
    nation: ["राष्ट्र", "राष्ट्रीय भूगोल"],
    county: ["काउंटी", "काउंटी"],
    csa: ["केंद्रीय सांख्यिकीय क्षेत्र", "केंद्रीय सांख्यिकीय क्षेत्र"],
    place: ["स्थान", "स्थान"],
    countySubdivision: ["काउंटी उपविभाग", "काउंटी उपविभाग"],
    schoolDistrict: ["स्कूल जिला", "स्कूल जिले"],
    stateHouse: ["राज्य सदन जिला", "राज्य सदन जिले"],
    stateSenate: ["राज्य सीनेट जिला", "राज्य सीनेट जिले"],
    congressional: ["कांग्रेसी जिला", "कांग्रेसी जिले"],
    zip: ["ZIP कोड", "ZIP कोड क्षेत्र"],
    tract: ["जनगणना ट्रैक्ट", "जनगणना ट्रैक्ट"],
    blockGroup: ["ब्लॉक समूह", "ब्लॉक समूह"],
    puma: ["PUMA", "PUMA क्षेत्र"],
    reservation: ["आरक्षण", "आरक्षण"]
  },
  bn: {
    urban: ["শহুরে এলাকা", "শহুরে এলাকা"],
    metro: ["মেট্রো এলাকা", "মেট্রো ও মাইক্রো এলাকা"],
    state: ["অঙ্গরাজ্য", "অঙ্গরাজ্য"],
    division: ["বিভাগ", "আদমশুমারি বিভাগ"],
    region: ["অঞ্চল", "আদমশুমারি অঞ্চল"],
    nation: ["দেশ", "জাতীয় ভৌগোলিক এলাকা"],
    county: ["কাউন্টি", "কাউন্টি"],
    csa: ["কেন্দ্রীয় পরিসংখ্যান এলাকা", "কেন্দ্রীয় পরিসংখ্যান এলাকা"],
    place: ["স্থান", "স্থান"],
    countySubdivision: ["কাউন্টি উপবিভাগ", "কাউন্টি উপবিভাগ"],
    schoolDistrict: ["স্কুল জেলা", "স্কুল জেলা"],
    stateHouse: ["স্টেট হাউস জেলা", "স্টেট হাউস জেলা"],
    stateSenate: ["স্টেট সিনেট জেলা", "স্টেট সিনেট জেলা"],
    congressional: ["কংগ্রেসনাল জেলা", "কংগ্রেসনাল জেলা"],
    zip: ["ZIP কোড", "ZIP কোড এলাকা"],
    tract: ["আদমশুমারি ট্র্যাক্ট", "আদমশুমারি ট্র্যাক্ট"],
    blockGroup: ["ব্লক গ্রুপ", "ব্লক গ্রুপ"],
    puma: ["PUMA", "PUMA এলাকা"],
    reservation: ["রিজার্ভেশন", "রিজার্ভেশন"]
  },
  ja: {
    urban: ["都市地域", "都市地域"],
    metro: ["大都市圏", "大都市圏と小都市圏"],
    state: ["州", "州"],
    division: ["区分", "国勢調査区分"],
    region: ["地域", "国勢調査地域"],
    nation: ["国", "全国地域"],
    county: ["郡", "郡"],
    csa: ["統合統計地域", "統合統計地域"],
    place: ["場所", "場所"],
    countySubdivision: ["郡下位区分", "郡下位区分"],
    schoolDistrict: ["学区", "学区"],
    stateHouse: ["州下院選挙区", "州下院選挙区"],
    stateSenate: ["州上院選挙区", "州上院選挙区"],
    congressional: ["連邦議会選挙区", "連邦議会選挙区"],
    zip: ["ZIPコード", "ZIPコード地域"],
    tract: ["国勢調査区", "国勢調査区"],
    blockGroup: ["ブロックグループ", "ブロックグループ"],
    puma: ["PUMA", "PUMA地域"],
    reservation: ["保留地", "保留地"]
  },
  vi: {
    urban: ["Khu vực đô thị", "khu vực đô thị"],
    metro: ["Khu vực metro", "khu vực metro và micro"],
    state: ["Tiểu bang", "tiểu bang"],
    division: ["Phân vùng", "phân vùng điều tra dân số"],
    region: ["Vùng", "vùng điều tra dân số"],
    nation: ["Quốc gia", "khu vực quốc gia"],
    county: ["Quận", "quận"],
    csa: ["Khu vực thống kê trung tâm", "khu vực thống kê trung tâm"],
    place: ["Địa điểm", "địa điểm"],
    countySubdivision: ["Phân khu quận", "phân khu quận"],
    schoolDistrict: ["Học khu", "học khu"],
    stateHouse: ["Khu hạ viện tiểu bang", "khu hạ viện tiểu bang"],
    stateSenate: ["Khu thượng viện tiểu bang", "khu thượng viện tiểu bang"],
    congressional: ["Khu quốc hội", "khu quốc hội"],
    zip: ["Mã ZIP", "khu vực mã ZIP"],
    tract: ["Khu điều tra dân số", "khu điều tra dân số"],
    blockGroup: ["Nhóm khối", "nhóm khối"],
    puma: ["PUMA", "khu vực PUMA"],
    reservation: ["Khu bảo tồn", "khu bảo tồn"]
  },
  ko: {
    urban: ["도시 지역", "도시 지역"],
    metro: ["대도시권", "대도시 및 소도시권"],
    state: ["주", "주"],
    division: ["구분", "인구조사 구분"],
    region: ["지역", "인구조사 지역"],
    nation: ["국가", "전국 지리 영역"],
    county: ["카운티", "카운티"],
    csa: ["통합 통계 지역", "통합 통계 지역"],
    place: ["장소", "장소"],
    countySubdivision: ["카운티 하위 구역", "카운티 하위 구역"],
    schoolDistrict: ["학군", "학군"],
    stateHouse: ["주 하원 선거구", "주 하원 선거구"],
    stateSenate: ["주 상원 선거구", "주 상원 선거구"],
    congressional: ["연방 하원 선거구", "연방 하원 선거구"],
    zip: ["ZIP 코드", "ZIP 코드 지역"],
    tract: ["인구조사 구역", "인구조사 구역"],
    blockGroup: ["블록 그룹", "블록 그룹"],
    puma: ["PUMA", "PUMA 지역"],
    reservation: ["보호구역", "보호구역"]
  },
  ru: {
    urban: ["Городская территория", "городские территории"],
    metro: ["Метрополитенская зона", "метро- и микрозоны"],
    state: ["Штат", "штаты"],
    division: ["Дивизион", "дивизионы переписи"],
    region: ["Регион", "регионы переписи"],
    nation: ["Страна", "национальные территории"],
    county: ["Округ", "округа"],
    csa: ["Объединенная статистическая зона", "объединенные статистические зоны"],
    place: ["Населенный пункт", "населенные пункты"],
    countySubdivision: ["Подразделение округа", "подразделения округов"],
    schoolDistrict: ["Школьный округ", "школьные округа"],
    stateHouse: ["Округ палаты штата", "округа палаты штата"],
    stateSenate: ["Округ сената штата", "округа сената штата"],
    congressional: ["Избирательный округ Конгресса", "избирательные округа Конгресса"],
    zip: ["ZIP-код", "территории ZIP-кодов"],
    tract: ["Участок переписи", "участки переписи"],
    blockGroup: ["Группа блоков", "группы блоков"],
    puma: ["PUMA", "территории PUMA"],
    reservation: ["Резервация", "резервации"]
  }
};
const DETAIL_TABLES = [
  "B01001",
  "B01002",
  "B19013",
  "B19301",
  "B17001",
  "B11001",
  "B25001",
  "B25077",
  "B25103",
  "B15003",
  "B16001",
  "B05002",
  "B21001",
  "B03002",
  "B08303",
  "B08013",
  "B08006"
];

const GEOGRAPHY_TYPES = [
  {
    id: "urban",
    sumlevel: "400",
    label: "Urban area",
    plural: "urban areas",
    local: true,
    minZoom: AREA_MIN_ZOOM,
    example: { geoid: "40000US63217", name: "New York--Jersey City--Newark, NY--NJ Urban Area" }
  },
  {
    id: "metro",
    sumlevel: "310",
    label: "Metro area",
    plural: "metro and micro areas",
    minZoom: 5,
    example: { geoid: "31000US18140", name: "Columbus, OH Metro Area" }
  },
  {
    id: "state",
    sumlevel: "040",
    label: "State",
    plural: "states",
    minZoom: 3,
    example: { geoid: "04000US39", name: "Ohio" }
  },
  {
    id: "division",
    sumlevel: "030",
    label: "Division",
    plural: "Census divisions",
    minZoom: 3,
    example: { geoid: "03000US3", name: "East North Central Division" }
  },
  {
    id: "region",
    sumlevel: "020",
    label: "Region",
    plural: "Census regions",
    minZoom: 3,
    example: { geoid: "02000US2", name: "Midwest Region" }
  },
  {
    id: "nation",
    sumlevel: "010",
    label: "Nation",
    plural: "national geographies",
    minZoom: 3,
    example: { geoid: "01000US", name: "United States" }
  },
  {
    id: "county",
    sumlevel: "050",
    label: "County",
    plural: "counties",
    minZoom: 5,
    example: { geoid: "05000US39159", name: "Union County, OH" }
  },
  {
    id: "csa",
    sumlevel: "330",
    label: "Central statistical area",
    plural: "central statistical areas",
    minZoom: 4,
    example: { geoid: "33000US184", name: "Cleveland-Akron-Canton, OH CSA" }
  },
  {
    id: "place",
    sumlevel: "160",
    label: "Place",
    plural: "places",
    minZoom: 6,
    example: { geoid: "16000US3651000", name: "New York, NY" }
  },
  {
    id: "countySubdivision",
    sumlevel: "060",
    label: "County subdivision",
    plural: "county subdivisions",
    minZoom: 7,
    example: { geoid: "06000US3915939046", name: "Jerome township, Union County, OH" }
  },
  {
    id: "schoolDistrict",
    sumlevel: "970",
    label: "School district",
    plural: "school districts",
    minZoom: 7,
    example: { geoid: "97000US3904702", name: "Dublin City School District, OH" }
  },
  {
    id: "stateHouse",
    sumlevel: "620",
    label: "State house district",
    plural: "state house districts",
    minZoom: 7,
    political: true,
    example: { geoid: "62000US39044", name: "State House District 44, OH" }
  },
  {
    id: "stateSenate",
    sumlevel: "610",
    label: "State senate district",
    plural: "state senate districts",
    minZoom: 7,
    political: true,
    example: { geoid: "61000US39001", name: "State Senate District 1, OH" }
  },
  {
    id: "congressional",
    sumlevel: "500",
    label: "Congressional district",
    plural: "congressional districts",
    minZoom: 6,
    political: true,
    example: { geoid: "50000US3907", name: "Congressional District 7, OH" }
  },
  {
    id: "zip",
    sumlevel: "860",
    label: "ZIP code",
    plural: "ZIP code tabulation areas",
    minZoom: 8,
    example: { geoid: "86000US43064", name: "43064" }
  },
  {
    id: "tract",
    sumlevel: "140",
    label: "Census tract",
    plural: "Census tracts",
    minZoom: 9,
    example: { geoid: "14000US39159050601", name: "Census Tract 506.01, Union County, OH" }
  },
  {
    id: "blockGroup",
    sumlevel: "150",
    label: "Block group",
    plural: "block groups",
    minZoom: 10,
    example: { geoid: "15000US391590506012", name: "Block Group 2, Census Tract 506.01, Union County, OH" }
  },
  {
    id: "puma",
    sumlevel: "795",
    label: "PUMA",
    plural: "public use microdata areas",
    minZoom: 6,
    example: { geoid: "79500US3902500", name: "Union, Pickaway & Madison Counties PUMA, OH" }
  },
  {
    id: "reservation",
    sumlevel: "252",
    label: "Reservation",
    plural: "reservations",
    minZoom: 6,
    example: { geoid: "25200US2430R", name: "Navajo Nation Reservation" }
  }
];

const GEOGRAPHY_BY_ID = Object.fromEntries(GEOGRAPHY_TYPES.map((type) => [type.id, type]));
const GEOGRAPHY_BY_SUMLEVEL = Object.fromEntries(GEOGRAPHY_TYPES.map((type) => [type.sumlevel, type]));
const STATE_FIPS_TO_ABBR = {
  "01": "AL",
  "02": "AK",
  "04": "AZ",
  "05": "AR",
  "06": "CA",
  "08": "CO",
  "09": "CT",
  "10": "DE",
  "11": "DC",
  "12": "FL",
  "13": "GA",
  "15": "HI",
  "16": "ID",
  "17": "IL",
  "18": "IN",
  "19": "IA",
  "20": "KS",
  "21": "KY",
  "22": "LA",
  "23": "ME",
  "24": "MD",
  "25": "MA",
  "26": "MI",
  "27": "MN",
  "28": "MS",
  "29": "MO",
  "30": "MT",
  "31": "NE",
  "32": "NV",
  "33": "NH",
  "34": "NJ",
  "35": "NM",
  "36": "NY",
  "37": "NC",
  "38": "ND",
  "39": "OH",
  "40": "OK",
  "41": "OR",
  "42": "PA",
  "44": "RI",
  "45": "SC",
  "46": "SD",
  "47": "TN",
  "48": "TX",
  "49": "UT",
  "50": "VT",
  "51": "VA",
  "53": "WA",
  "54": "WV",
  "55": "WI",
  "56": "WY"
};
const STATE_ABBR_TO_NAME = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  DC: "District of Columbia",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming"
};

const STATIC_GOVERNORS = {
  AL: { name: "Kay Ivey", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Governor%20Kay%20Ivey%202017%20(cropped).jpg?width=225" },
  AK: { name: "Mike Dunleavy", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mike%20Dunleavy%20by%20Gage%20Skidmore.jpg?width=225" },
  AZ: { name: "Katie Hobbs", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Katie%20Hobbs%20by%20Gage%20Skidmore%206.jpg?width=225" },
  AR: { name: "Sarah Huckabee Sanders", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Governor%20Sarah%20Huckabee%20Sanders%20(cropped)%20(cropped).jpg?width=225" },
  CA: { name: "Gavin Newsom", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Gavin%20Newsom%202026%20(cropped%203x4%202).jpg?width=225" },
  CO: { name: "Jared Polis", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Governor%20Jared%20Polis%202023%20(cropped)%20(cropped).jpg?width=225" },
  CT: { name: "Ned Lamont", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Connecticut%20Governor%20Ned%20Lamont%20(cropped).jpg?width=225" },
  DE: { name: "Matt Meyer", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/(02-19-2025)%20Matt%20Meyer.jpg?width=225" },
  FL: {
    name: "Ron DeSantis",
    party: "Republican",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ron%20DeSantis%20official%20photo.jpg?width=225",
    imageFallbacks: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ron%20DeSantis%20113th%20Congress.jpg?width=225",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ron%20DeSantis%20(53455112690)%20(cropped).png?width=225"
    ]
  },
  GA: { name: "Brian Kemp", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/DAZ%201544PS%20(cropped).jpg?width=225" },
  HI: { name: "Josh Green", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Josh%20Green%20Official%20Photo%202022%20(cropped)%20(cropped).jpg?width=225" },
  ID: { name: "Brad Little", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Brad%20Little%20official%20photo%20(cropped).jpg?width=225" },
  IL: { name: "JB Pritzker", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/JB%20Pritzker%20by%20Gage%20Skidmore%20(3x4).jpg?width=225" },
  IN: { name: "Mike Braun", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Governor%20Mike%20Braun%20DHS.jpg?width=225" },
  IA: { name: "Kim Reynolds", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kim%20Reynolds%20(53462197855)%20(cropped)%20(cropped).jpg?width=225" },
  KS: { name: "Laura Kelly", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Laura%20Kelly%20official%20photo%20(cropped).jpg?width=225" },
  KY: { name: "Andy Beshear", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/AndyBeshear2025%20(cropped).jpg?width=225" },
  LA: { name: "Jeff Landry", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jeff%20Landry%20in%202025%20(cropped).jpg?width=225" },
  ME: { name: "Janet Mills", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Janet%20Mills%20in%202019.jpg?width=225" },
  MD: {
    name: "Wes Moore",
    party: "Democrat",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Wes%20Moore%20in%20February%202025.jpg?width=225",
    imageFallbacks: ["https://commons.wikimedia.org/wiki/Special:FilePath/Governor%20Wes%20Moore%20official%20portrait.jpg?width=225"]
  },
  MA: { name: "Maura Healey", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Maura%20Healey%2054502293075%20(1).jpg?width=225" },
  MI: { name: "Gretchen Whitmer", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/2025%20Gretchen%20Whitmer%20(cropped).jpg?width=225" },
  MN: { name: "Tim Walz", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/TimWalz2025.jpg?width=225" },
  MS: { name: "Tate Reeves", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tate%20Reeves%202019%20(cropped).jpg?width=225" },
  MO: { name: "Mike Kehoe", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mike%20Kehoe%202025%20(croppedfurther).jpg?width=225" },
  MT: { name: "Greg Gianforte", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Greg%20Gianforte%20in%20Taiwan%20(cropped).jpg?width=225" },
  NE: { name: "Jim Pillen", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jim%20Pillen%202023%20(cropped).jpg?width=225" },
  NV: { name: "Joe Lombardo", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Joe%20Lombardo%20by%20Gage%20Skidmore%20(3x4%20cropped).jpg?width=225" },
  NH: { name: "Kelly Ayotte", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Governor-elect%20Kelly%20Ayotte%202024%20(cropped).jpg?width=225" },
  NJ: { name: "Mikie Sherrill", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Gov.%20Mikie%20Sherril%20(cropped).jpg?width=225" },
  NM: { name: "Michelle Lujan Grisham", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Michelle%20Lujan%20Grisham%202021.jpg?width=225" },
  NY: { name: "Kathy Hochul", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kathy%20Hochul%2C%2017%20May%202024%20(cropped).jpg?width=225" },
  NC: { name: "Josh Stein", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Secretary%20Turner%20Meeting%20with%20Josh%20Stein%2C%20Governor%20of%20North%20Carolina%20-%2054519013726%20(cropped)%20(cropped).jpg?width=225" },
  ND: { name: "Kelly Armstrong", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kelly%20Armstrong%20(cropped).jpg?width=225" },
  OH: { name: "Mike DeWine", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Gov-Mike-DeWine%20(cropped).jpg?width=225" },
  OK: { name: "Kevin Stitt", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Kevin%20Stitt%20(52251950006)%20(cropped).jpg?width=225" },
  OR: { name: "Tina Kotek", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Governor%20Kotek%20(cropped).jpg?width=225" },
  PA: { name: "Josh Shapiro", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Josh%20Shapiro%202023%20(3x4).jpg?width=225" },
  RI: { name: "Dan McKee", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/RI%20Governor%20Daniel%20McKee.jpg?width=225" },
  SC: { name: "Henry McMaster", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Governor%20Henry%20McMaster%20(crop).jpg?width=225" },
  SD: { name: "Larry Rhoden", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Larry%20Rhoden%202025%20(cropped).jpg?width=225" },
  TN: { name: "Bill Lee", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hob%20Nob%20on%20the%20State%20Line%20with%20Tennessee%20Governor%20Bill%20Lee%2C%20Bristol%20(cropped).jpg?width=225" },
  TX: { name: "Greg Abbott", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Greg%20Abbott%20at%20NASA%202024%20(cropped).jpg?width=225" },
  UT: { name: "Spencer Cox", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Spencer%20Cox%20in%202024%20(cropped).jpg?width=225" },
  VT: { name: "Phil Scott", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Phil%20Scott%202019%20(3x4%20cropped).png?width=225" },
  VA: { name: "Abigail Spanberger", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rep.%20Abigail%20Spanberger%20-%20118th%20Congress%20(3x4%20cropped).jpg?width=225" },
  WA: { name: "Bob Ferguson", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bob%20Ferguson%20at%20his%202023%20Shrimp%20Feed%2002%20(cropped).jpg?width=225" },
  WV: { name: "Patrick Morrisey", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Governor%20Patrick%20Morrisey%20in%202025.jpg?width=225" },
  WI: { name: "Tony Evers", party: "Democrat", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tony%20Evers%20(cropped).jpg?width=225" },
  WY: { name: "Mark Gordon", party: "Republican", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mark%20Gordon%20of%20Wyoming.jpg?width=225" }
};

const state = {
  index: null,
  boundaryGeojson: null,
  activeGeography: "urban",
  boundaryTileLayers: new Map(),
  activeBoundaryLayer: null,
  selectedGeoid: null,
  selectedName: "",
  profileCache: new Map(),
  geometryCache: new Map(),
  schoolRatings: null,
  liveSchoolRatingsCache: new Map(),
  searchCache: new Map(),
  extrasCache: new Map(),
  congressData: null,
  congressLoading: null,
  stateOfficialsCache: new Map(),
  stateLegislatorCache: new Map(),
  stateExecutiveCache: new Map(),
  municipalityCache: new Map(),
  wikidataImageCache: new Map(),
  wikidataEntityCache: new Map(),
  wikidataSearchCache: new Map(),
  wikidataPlaceMayorCache: new Map(),
  wikidataPersonCache: new Map(),
  mayorPartyCache: new Map(),
  opportunityOverlay: "none",
  opportunityLoadToken: 0,
  opportunityData: null,
  opportunityDataCache: new Map(),
  opportunityStyleCache: new Map(),
  policyOverlayCatalog: null,
  policyOverlayById: new Map(),
  dotsVisible: true,
  areasVisible: true,
  baseMap: localStorage.getItem("censusMapBaseMap") || "reporter",
  googleMapsConfig: null,
  googleMapsConfigLoading: null,
  google3dViewer: null,
  google3dTileset: null,
  google3dLoading: null,
  finderSort: localStorage.getItem("censusMapFinderSort") || "directory",
  finderRace: localStorage.getItem("censusMapFinderRace") || "hispanic",
  finderMinPopulation: Number(localStorage.getItem("censusMapFinderMinPopulation") || 0),
  finderLimit: Number(localStorage.getItem("censusMapFinderLimit") || 50),
  panelWidth: Number(localStorage.getItem("censusMapPanelWidth") || PANEL_DEFAULT_WIDTH),
  language: localStorage.getItem("censusMapLanguage") || "en"
};

const elements = {
  appShell: document.querySelector(".app-shell"),
  mapTitle: document.querySelector("#map-heading"),
  mapSubtitle: document.querySelector("#map-subtitle"),
  geography: document.querySelector("#geography-type"),
  opportunity: document.querySelector("#opportunity-overlay"),
  language: document.querySelector("#language-select"),
  legend: document.querySelector("#dots-legend"),
  opportunityLegend: document.querySelector("#opportunity-legend"),
  count: document.querySelector("#area-count"),
  release: document.querySelector("#release-label"),
  search: document.querySelector("#search"),
  searchResults: document.querySelector("#search-results"),
  finder: document.querySelector("#race-finder"),
  finderSort: document.querySelector("#finder-sort"),
  finderRace: document.querySelector("#finder-race"),
  finderMinPopulation: document.querySelector("#finder-min-pop"),
  finderLimit: document.querySelector("#finder-limit"),
  finderSummary: document.querySelector("#finder-summary"),
  finderReset: document.querySelector("#finder-reset"),
  listTitle: document.querySelector("#list-title"),
  list: document.querySelector("#area-list"),
  profile: document.querySelector("#profile"),
  hover: document.querySelector("#hover-card"),
  mapPane: document.querySelector(".map-pane"),
  sidePanel: document.querySelector(".side-panel"),
  panelResizer: document.querySelector("#panel-resizer"),
  baseMap: document.querySelector("#base-map"),
  google3d: document.querySelector("#google-3d-view"),
  googleStatus: document.querySelector("#google-map-status"),
  zoomUs: document.querySelector("#zoom-us"),
  toggleDots: document.querySelector("#toggle-dots"),
  toggleAreas: document.querySelector("#toggle-areas")
};

const format = new ol.format.GeoJSON();
const mvtFormat = new ol.format.MVT();
const selectedStyle = [
  new ol.style.Style({
    stroke: new ol.style.Stroke({ color: "rgba(255, 255, 255, 0.95)", width: 4.4 })
  }),
  new ol.style.Style({
    fill: new ol.style.Fill({ color: "rgba(213, 138, 19, 0.04)" }),
    stroke: new ol.style.Stroke({ color: "#d58a13", width: 2.4 })
  })
];
const areaStyle = [
  new ol.style.Style({
    stroke: new ol.style.Stroke({ color: "rgba(255, 255, 255, 0.82)", width: 3.1 })
  }),
  new ol.style.Style({
    fill: new ol.style.Fill({ color: "rgba(18, 112, 120, 0)" }),
    stroke: new ol.style.Stroke({ color: "rgba(9, 103, 111, 0.98)", width: 1.25 })
  })
];
const lowZoomAreaStyle = [];
const tileBoundaryStyle = [
  new ol.style.Style({
    stroke: new ol.style.Stroke({ color: "rgba(255, 255, 255, 0.76)", width: 2.6 })
  }),
  new ol.style.Style({
    fill: new ol.style.Fill({ color: "rgba(18, 112, 120, 0.02)" }),
    stroke: new ol.style.Stroke({ color: "rgba(9, 103, 111, 0.96)", width: 1.15 })
  })
];
const partyBoundaryStyles = {
  Republican: [
    new ol.style.Style({
      fill: new ol.style.Fill({ color: "rgba(204, 72, 66, 0.2)" }),
      stroke: new ol.style.Stroke({ color: "rgba(159, 45, 43, 0.9)", width: 1.25 })
    })
  ],
  Democrat: [
    new ol.style.Style({
      fill: new ol.style.Fill({ color: "rgba(55, 111, 182, 0.2)" }),
      stroke: new ol.style.Stroke({ color: "rgba(38, 90, 156, 0.9)", width: 1.25 })
    })
  ],
  Other: [
    new ol.style.Style({
      fill: new ol.style.Fill({ color: "rgba(92, 103, 115, 0.16)" }),
      stroke: new ol.style.Stroke({ color: "rgba(92, 103, 115, 0.85)", width: 1.15 })
    })
  ]
};
const hiddenStyle = new ol.style.Style({
  fill: new ol.style.Fill({ color: "rgba(0, 0, 0, 0)" }),
  stroke: new ol.style.Stroke({ color: "rgba(0, 0, 0, 0)", width: 0 })
});
const TRANSPARENT_TILE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3C/svg%3E";
const defaultInteractions =
  typeof ol.interaction.defaults === "function"
    ? ol.interaction.defaults
    : ol.interaction.defaults.defaults;

const baseLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: BASE_TILE,
    tileSize: 256,
    cacheSize: 768,
    maxZoom: 20,
    transition: 0,
    attributions: BASE_TILE_ATTRIBUTION
  }),
  preload: 1,
  opacity: 1
});
baseLayer.setZIndex(0);

const googleSatelliteSource = new ol.source.XYZ({
  url: GOOGLE_SATELLITE_TILE,
  tileSize: 256,
  cacheSize: 768,
  minZoom: 0,
  maxZoom: 20,
  transition: 0,
  attributions: '&copy; <a href="https://www.google.com/maps">Google</a>',
  tileLoadFunction(tile, src) {
    const image = tile.getImage();
    image.decoding = "async";
    image.onerror = () => {
      image.onerror = null;
      image.src = TRANSPARENT_TILE;
    };
    image.src = src;
  }
});

const googleSatelliteLayer = new ol.layer.Tile({
  source: googleSatelliteSource,
  preload: 1,
  visible: false,
  opacity: 1
});
googleSatelliteLayer.setZIndex(0.05);

const dotsSource = new ol.source.XYZ({
  url: DOT_TILE,
  tileSize: DOT_TILE_SIZE,
  tilePixelRatio: DOT_TILE_PIXEL_RATIO,
  cacheSize: 384,
  interpolate: false,
  minZoom: DOT_MIN_ZOOM,
  maxZoom: DOT_MAX_ZOOM,
  zDirection: 1,
  transition: 0,
  useInterimTilesOnError: false,
  tileLoadFunction(tile, src) {
    const image = tile.getImage();
    image.decoding = "async";
    image.onerror = () => {
      image.onerror = null;
      image.src = TRANSPARENT_TILE;
    };
    image.src = src;
  }
});

if (typeof dotsSource.setUseInterimTilesOnError === "function") {
  dotsSource.setUseInterimTilesOnError(false);
}

const dotsLayer = new ol.layer.Tile({
  source: dotsSource,
  preload: 0,
  useInterimTilesOnError: false,
  opacity: 1
});
dotsLayer.setZIndex(1);
if (typeof dotsLayer.setUseInterimTilesOnError === "function") {
  dotsLayer.setUseInterimTilesOnError(false);
}

const labelLayer = new ol.layer.Tile({
  source: new ol.source.XYZ({
    urls: LABEL_TILE_URLS,
    tileSize: 256,
    cacheSize: 512,
    maxZoom: 20,
    transition: 0,
    attributions:
      '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }),
  preload: 1,
  opacity: 0.95
});
labelLayer.setZIndex(1.5);

const opportunityCountyLayer = new ol.layer.VectorTile({
  source: new ol.source.VectorTile({
    format: mvtFormat,
    url: BOUNDARY_TILE.replace("{sumlevel}", "050"),
    maxZoom: 14,
    transition: 0,
    cacheSize: 256
  }),
  minZoom: 3,
  renderBuffer: 48,
  updateWhileAnimating: false,
  updateWhileInteracting: false,
  style: (feature) => opportunityStyleForFeature(feature, "cty"),
  visible: false
});
opportunityCountyLayer.setZIndex(1.3);

const opportunityTractLayer = new ol.layer.VectorTile({
  source: new ol.source.VectorTile({
    format: mvtFormat,
    url: BOUNDARY_TILE.replace("{sumlevel}", "140"),
    maxZoom: 14,
    transition: 0,
    cacheSize: 192
  }),
  minZoom: OPPORTUNITY_TRACT_SWITCH_ZOOM,
  renderBuffer: 48,
  updateWhileAnimating: false,
  updateWhileInteracting: false,
  style: (feature) => opportunityStyleForFeature(feature, "tract"),
  visible: false
});
opportunityTractLayer.setZIndex(1.35);

const opportunityStateLayer = new ol.layer.VectorTile({
  source: new ol.source.VectorTile({
    format: mvtFormat,
    url: BOUNDARY_TILE.replace("{sumlevel}", "040"),
    maxZoom: 14,
    transition: 0,
    cacheSize: 128
  }),
  minZoom: 3,
  renderBuffer: 48,
  updateWhileAnimating: false,
  updateWhileInteracting: false,
  style: statePolicyStyleForFeature,
  visible: false
});
opportunityStateLayer.setZIndex(1.37);

const urbanSource = new ol.source.Vector();

urbanSource.on("addfeature", (event) => {
  const geoid = event.feature.get("GEOID");
  if (geoid) event.feature.setId(geoid);
});

const urbanLayer = new ol.layer.Vector({
  source: urbanSource,
  minZoom: AREA_MIN_ZOOM,
  renderBuffer: 64,
  updateWhileAnimating: false,
  updateWhileInteracting: false,
  style(feature, resolution) {
    if (fullGeoidFromFeature(feature, GEOGRAPHY_BY_ID.urban) === state.selectedGeoid) return hiddenStyle;
    return resolution > 2500 ? lowZoomAreaStyle : areaStyle;
  }
});
urbanLayer.setZIndex(2);

const selectedSource = new ol.source.Vector();
const selectedLayer = new ol.layer.Vector({
  source: selectedSource,
  renderBuffer: 96,
  updateWhileAnimating: false,
  updateWhileInteracting: false,
  style: selectedStyle
});
selectedLayer.setZIndex(3);

const map = new ol.Map({
  target: "map",
  layers: [baseLayer, googleSatelliteLayer, dotsLayer, opportunityCountyLayer, opportunityTractLayer, opportunityStateLayer, labelLayer, urbanLayer, selectedLayer],
  maxTilesLoading: 48,
  interactions: defaultInteractions({ mouseWheelZoom: false }).extend([
    new ol.interaction.MouseWheelZoom({ duration: 120, timeout: 40 })
  ]),
  view: new ol.View({
    center: ol.proj.fromLonLat([-98.58, 39.83]),
    zoom: 4,
    minZoom: 3,
    maxZoom: 14
  })
});

window.urbanAreaApp = {
  map,
  geographyTypes: GEOGRAPHY_TYPES,
  opportunityOverlays: OPPORTUNITY_OVERLAYS,
  policyOverlays: () => policyOverlays(),
  layers: { baseLayer, googleSatelliteLayer, dotsLayer, labelLayer, opportunityCountyLayer, opportunityTractLayer, opportunityStateLayer, selectedLayer, urbanLayer },
  sources: { selectedSource, urbanSource },
  state
};

let panelResizeFrame = 0;

function panelWidthBounds() {
  const viewport = window.innerWidth || PANEL_DEFAULT_WIDTH * 2;
  const mapMinimum = viewport >= 980 ? 420 : 0;
  const maxByViewport = Math.max(PANEL_MIN_WIDTH, Math.floor(viewport - mapMinimum));
  return {
    min: Math.min(PANEL_MIN_WIDTH, Math.max(260, viewport - 220)),
    max: Math.max(PANEL_MIN_WIDTH, Math.min(PANEL_MAX_WIDTH, Math.floor(viewport * PANEL_MAX_VIEWPORT_RATIO), maxByViewport))
  };
}

function clampPanelWidth(width) {
  const bounds = panelWidthBounds();
  const numeric = Number(width);
  if (!Number.isFinite(numeric)) return PANEL_DEFAULT_WIDTH;
  return Math.round(Math.min(bounds.max, Math.max(bounds.min, numeric)));
}

function panelSizeName(width) {
  if (width >= 720) return "wide";
  if (width >= 560) return "expanded";
  if (width <= 390) return "compact";
  return "standard";
}

function updateMapAfterPanelResize() {
  if (panelResizeFrame) return;
  panelResizeFrame = window.requestAnimationFrame(() => {
    panelResizeFrame = 0;
    map.updateSize();
    if (state.baseMap === "google3d") syncGoogle3dCamera(0.15);
  });
}

function setPanelWidth(width, options = {}) {
  const bounds = panelWidthBounds();
  const clamped = clampPanelWidth(width);
  state.panelWidth = clamped;
  document.documentElement.style.setProperty("--side-panel-width", `${clamped}px`);
  elements.sidePanel?.setAttribute("data-panel-size", panelSizeName(clamped));
  elements.panelResizer?.setAttribute("aria-valuemin", String(bounds.min));
  elements.panelResizer?.setAttribute("aria-valuemax", String(bounds.max));
  elements.panelResizer?.setAttribute("aria-valuenow", String(clamped));
  if (options.persist !== false) localStorage.setItem("censusMapPanelWidth", String(clamped));
  if (options.updateMap !== false) updateMapAfterPanelResize();
}

function initializePanelResize() {
  setPanelWidth(state.panelWidth, { persist: false, updateMap: false });

  if (!elements.panelResizer) return;
  elements.panelResizer.setAttribute("role", "separator");
  elements.panelResizer.setAttribute("aria-orientation", "vertical");
  elements.panelResizer.setAttribute("aria-valuemin", String(panelWidthBounds().min));
  elements.panelResizer.setAttribute("aria-valuemax", String(panelWidthBounds().max));

  let activePointerId = null;

  elements.panelResizer.addEventListener("pointerdown", (event) => {
    if (window.innerWidth <= 980) return;
    activePointerId = event.pointerId;
    elements.panelResizer.setPointerCapture(event.pointerId);
    document.body.classList.add("panel-resizing");
    event.preventDefault();
  });

  elements.panelResizer.addEventListener("pointermove", (event) => {
    if (activePointerId !== event.pointerId) return;
    setPanelWidth(window.innerWidth - event.clientX, { persist: false });
  });

  const finishResize = (event) => {
    if (activePointerId !== event.pointerId) return;
    activePointerId = null;
    document.body.classList.remove("panel-resizing");
    setPanelWidth(state.panelWidth);
  };

  elements.panelResizer.addEventListener("pointerup", finishResize);
  elements.panelResizer.addEventListener("pointercancel", finishResize);
  elements.panelResizer.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 48 : 24;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPanelWidth(state.panelWidth + step);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPanelWidth(state.panelWidth - step);
    } else if (event.key === "Home") {
      event.preventDefault();
      setPanelWidth(panelWidthBounds().min);
    } else if (event.key === "End") {
      event.preventDefault();
      setPanelWidth(panelWidthBounds().max);
    }
  });
}

function activeGeography() {
  return GEOGRAPHY_BY_ID[state.activeGeography] || GEOGRAPHY_BY_ID.urban;
}

function geographyForGeoid(geoid) {
  return GEOGRAPHY_BY_SUMLEVEL[String(geoid || "").slice(0, 3)] || GEOGRAPHY_BY_ID.urban;
}

function shortGeoid(geoid) {
  return String(geoid || "").replace(/^\d{5}US/, "");
}

function fullGeoidFromFeature(feature, type = activeGeography()) {
  const fullGeoid = feature?.get("full_geoid") || feature?.get("FULL_GEOID");
  if (fullGeoid) return fullGeoid;

  const geoid = feature?.get("GEOID") || feature?.get("geoid");
  if (!geoid) return "";
  if (/^\d{5}US/.test(String(geoid))) return String(geoid);
  return `${type.sumlevel}00US${geoid}`;
}

function displayNameFromFeature(feature) {
  return (
    feature?.get("display_name") ||
    feature?.get("full_name") ||
    feature?.get("NAME") ||
    feature?.get("name") ||
    fullGeoidFromFeature(feature)
  );
}

function styleBoundaryFeature(feature) {
  const geoid = fullGeoidFromFeature(feature);
  if (geoid && geoid === state.selectedGeoid) return hiddenStyle;

  const type = activeGeography();
  if (type.id === "congressional") {
    const representative = getCongressRepresentative(geoid);
    return partyBoundaryStyles[normalizeParty(representative?.currentTerm?.party)] || partyBoundaryStyles.Other;
  }

  if (type.id === "stateHouse" || type.id === "stateSenate") {
    const legislator = getCachedStateLegislator(geoid, type);
    return partyBoundaryStyles[normalizeParty(legislator?.party)] || partyBoundaryStyles.Other;
  }

  if (type.political) return partyBoundaryStyles.Other;
  return tileBoundaryStyle;
}

function boundaryTileLayerFor(type) {
  if (state.boundaryTileLayers.has(type.id)) return state.boundaryTileLayers.get(type.id);

  const source = new ol.source.VectorTile({
    format: mvtFormat,
    url: BOUNDARY_TILE.replace("{sumlevel}", type.sumlevel),
    maxZoom: 14,
    transition: 0,
    cacheSize: 384
  });

  const layer = new ol.layer.VectorTile({
    source,
    minZoom: type.minZoom,
    renderBuffer: 64,
    updateWhileAnimating: false,
    updateWhileInteracting: false,
    style: styleBoundaryFeature,
    visible: false
  });

  layer.setZIndex(2);
  state.boundaryTileLayers.set(type.id, layer);
  map.addLayer(layer);
  return layer;
}

function visibleBoundaryLayer() {
  return activeGeography().local ? urbanLayer : state.activeBoundaryLayer;
}

function normalizedBaseMap(id) {
  return ["reporter", "googleSatellite", "google3d"].includes(id) ? id : "reporter";
}

function setGoogleMapStatus(message = "") {
  if (!elements.googleStatus) return;
  elements.googleStatus.hidden = !message;
  elements.googleStatus.textContent = message;
}

async function loadGoogleMapsConfig() {
  if (state.googleMapsConfig) return state.googleMapsConfig;
  if (state.googleMapsConfigLoading) return state.googleMapsConfigLoading;
  if (!GOOGLE_MAPS_CONFIG_API) {
    state.googleMapsConfig = {
      available: false,
      satelliteAvailable: false,
      threeDAvailable: false,
      apiKey: "",
      source: "Local server required"
    };
    return state.googleMapsConfig;
  }

  state.googleMapsConfigLoading = (async () => {
    const config = await fetchJsonWithRetry(GOOGLE_MAPS_CONFIG_API, { cache: "no-store" }, 1);
    state.googleMapsConfig = config;
    return config;
  })().finally(() => {
    state.googleMapsConfigLoading = null;
  });

  return state.googleMapsConfigLoading;
}

function loadExternalStylesheet(href) {
  if ([...document.styleSheets].some((sheet) => sheet.href === href)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadExternalScript(src) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing?.dataset.loaded === "true") return Promise.resolve();
  if (existing?.dataset.loading === "true") {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
    });
  }

  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.defer = true;
  script.dataset.loading = "true";
  document.head.appendChild(script);
  return new Promise((resolve, reject) => {
    script.addEventListener(
      "load",
      () => {
        script.dataset.loading = "false";
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true }
    );
    script.addEventListener("error", reject, { once: true });
  });
}

function google3dHeightForZoom(zoom) {
  return Math.max(1200, Math.min(4500000, 24000000 / 2 ** Number(zoom || 4)));
}

function syncGoogle3dCamera(duration = 0.4) {
  const viewer = state.google3dViewer;
  if (!viewer || !window.Cesium) return;
  const center = ol.proj.toLonLat(map.getView().getCenter());
  const height = google3dHeightForZoom(map.getView().getZoom());
  viewer.camera.flyTo({
    destination: window.Cesium.Cartesian3.fromDegrees(center[0], center[1], height),
    orientation: {
      heading: 0,
      pitch: window.Cesium.Math.toRadians(-58),
      roll: 0
    },
    duration
  });
}

async function ensureGoogle3dView(config) {
  if (!config?.apiKey) throw new Error("Google Maps API key is not configured.");
  if (state.google3dViewer) {
    syncGoogle3dCamera(0);
    return state.google3dViewer;
  }
  if (state.google3dLoading) return state.google3dLoading;

  state.google3dLoading = (async () => {
    loadExternalStylesheet(CESIUM_CSS_URL);
    await loadExternalScript(CESIUM_SCRIPT_URL);

    const rootUrl = GOOGLE_3D_ROOT.replace("{key}", encodeURIComponent(config.apiKey));
    const viewer = new window.Cesium.Viewer(elements.google3d, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      navigationHelpButton: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      imageryProvider: false,
      requestRenderMode: true
    });
    viewer.scene.globe.show = false;

    const tileset =
      typeof window.Cesium.Cesium3DTileset.fromUrl === "function"
        ? await window.Cesium.Cesium3DTileset.fromUrl(rootUrl, { showCreditsOnScreen: true })
        : new window.Cesium.Cesium3DTileset({ url: rootUrl, showCreditsOnScreen: true });
    viewer.scene.primitives.add(tileset);

    state.google3dViewer = viewer;
    state.google3dTileset = tileset;
    syncGoogle3dCamera(0);
    return viewer;
  })().finally(() => {
    state.google3dLoading = null;
  });

  return state.google3dLoading;
}

async function setBaseMap(id, options = {}) {
  const next = normalizedBaseMap(id);
  state.baseMap = next;
  if (options.persist !== false) localStorage.setItem("censusMapBaseMap", next);
  if (elements.baseMap) elements.baseMap.value = next;

  const wantsGoogle = next === "googleSatellite" || next === "google3d";
  let config = null;
  if (wantsGoogle) {
    try {
      config = await loadGoogleMapsConfig();
    } catch (error) {
      config = { available: false, error: error.message };
    }
  }

  const googleAvailable = Boolean(config?.available);
  const showSatellite = next === "googleSatellite" && googleAvailable;
  const show3d = next === "google3d" && googleAvailable;

  baseLayer.setVisible(next === "reporter" || (wantsGoogle && !googleAvailable));
  googleSatelliteLayer.setVisible(showSatellite);
  elements.google3d.hidden = !show3d;
  elements.mapPane.classList.toggle("google-3d-active", show3d);

  if (!wantsGoogle) {
    setGoogleMapStatus("");
    map.updateSize();
    return;
  }

  if (!googleAvailable) {
    const detail = config?.error ? ` ${config.error}` : "";
    setGoogleMapStatus(`Google Maps views require GOOGLE_MAPS_API_KEY on the local server.${detail}`);
    map.updateSize();
    return;
  }

  if (showSatellite) {
    setGoogleMapStatus("");
    googleSatelliteSource.refresh();
    map.updateSize();
    return;
  }

  setGoogleMapStatus("Loading Google 3D view...");
  try {
    await ensureGoogle3dView(config);
    setGoogleMapStatus("");
  } catch (error) {
    elements.google3d.hidden = true;
    elements.mapPane.classList.remove("google-3d-active");
    baseLayer.setVisible(true);
    setGoogleMapStatus(`Google 3D view could not load. ${error.message}`);
  }
  map.updateSize();
}

function languageConfig() {
  return LANGUAGES.find((language) => language.code === state.language) || LANGUAGES[0];
}

function languageLocale() {
  return languageConfig().locale || "en-US";
}

function tr(text, variables = {}) {
  const dictionary = TRANSLATIONS[state.language] || {};
  const template = dictionary[text] || TEMPLATE_TRANSLATIONS[text]?.[state.language] || text;
  return template.replace(/\{(\w+)\}/g, (_, key) => variables[key] ?? "");
}

function translatedTypeLabel(type) {
  return GEOGRAPHY_TRANSLATIONS[state.language]?.[type.id]?.[0] || tr(type.label);
}

function translatedTypePlural(type) {
  return GEOGRAPHY_TRANSLATIONS[state.language]?.[type.id]?.[1] || tr(type.plural);
}

function lowerUiText(text) {
  return state.language === "en" ? text.toLowerCase() : text;
}

function titleUiText(text) {
  if (state.language !== "en") return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function number(value) {
  if (value == null || Number.isNaN(Number(value))) return tr("Not available");
  return new Intl.NumberFormat(languageLocale(), { maximumFractionDigits: 0 }).format(value);
}

function decimal(value, digits = 1) {
  if (value == null || Number.isNaN(Number(value))) return tr("Not available");
  return new Intl.NumberFormat(languageLocale(), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

function currency(value) {
  if (value == null || Number.isNaN(Number(value))) return tr("Not available");
  return new Intl.NumberFormat(languageLocale(), {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function pct(value) {
  if (value == null || Number.isNaN(Number(value))) return tr("Not available");
  return `${decimal(value, 1)}%`;
}

function percentBarWidth(value) {
  const numeric = Number(String(value ?? "").replace("%", ""));
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, numeric));
}

function numericValue(value) {
  if (value == null || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function landSquareMiles(metadata = {}, indexArea = null) {
  const direct = numericValue(
    metadata.square_miles ??
      metadata.land_square_miles ??
      metadata.land_area_sq_mi ??
      metadata.landAreaSquareMiles ??
      indexArea?.landSquareMiles
  );
  if (direct != null) return direct;

  const squareMeters = numericValue(metadata.aland ?? metadata.ALAND ?? metadata.land_area_square_meters);
  if (squareMeters != null && squareMeters > 0) return squareMeters / SQUARE_METERS_PER_SQUARE_MILE;

  return null;
}

function populationDensity(metadata = {}, metrics = {}, indexArea = null) {
  const direct = numericValue(metadata.population_density ?? indexArea?.density);
  if (direct != null) return direct;

  const population = numericValue(metrics.population ?? metadata.population ?? indexArea?.metrics?.population);
  const land = landSquareMiles(metadata, indexArea);
  if (population == null || land == null || land <= 0) return null;

  return population / land;
}

function activeOpportunityOverlay() {
  return OPPORTUNITY_BY_ID[state.opportunityOverlay] || state.policyOverlayById.get(state.opportunityOverlay) || null;
}

function policyOverlays() {
  return Array.isArray(state.policyOverlayCatalog?.overlays) ? state.policyOverlayCatalog.overlays : [];
}

async function loadPolicyOverlayCatalog() {
  const catalog = await fetchJsonWithRetry(POLICY_OVERLAY_URL, { cache: "force-cache" }, 2);
  const overlays = Array.isArray(catalog?.overlays) ? catalog.overlays : [];
  state.policyOverlayCatalog = { ...catalog, overlays };
  state.policyOverlayById = new Map(overlays.map((overlay) => [overlay.id, overlay]));
  window.urbanAreaApp.opportunityOverlays = [...OPPORTUNITY_OVERLAYS, ...overlays];
  return state.policyOverlayCatalog;
}

function opportunityOutcomeKey(overlay) {
  if (!overlay || overlay.type !== "outcome") return overlay?.id || "";
  const subgroup = overlay.id === "teenbirth" ? OPPORTUNITY_FEMALE_SUBGROUP : OPPORTUNITY_SUBGROUP;
  return `${overlay.id}_${subgroup}`;
}

function opportunityPropertyKey(overlay) {
  return overlay?.type === "outcome" ? opportunityOutcomeKey(overlay) : overlay?.id || "";
}

function opportunityFeatureId(feature, layerName) {
  const type = layerName === "tract" ? GEOGRAPHY_BY_ID.tract : layerName === "state" ? GEOGRAPHY_BY_ID.state : GEOGRAPHY_BY_ID.county;
  const geoid = shortGeoid(fullGeoidFromFeature(feature, type));
  if (!geoid) return "";
  if (layerName === "state") return geoid.padStart(2, "0");
  if (layerName === "cty") return `cty${geoid.padStart(5, "0")}`;
  const tractId = Number(geoid);
  return Number.isFinite(tractId) ? String(tractId) : geoid;
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function quantile(sortedValues, p) {
  if (!sortedValues.length) return null;
  const index = (sortedValues.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sortedValues[lower];
  return sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * (index - lower);
}

function opportunityPalette(overlay) {
  return OPPORTUNITY_COLOR_SCHEMES[overlay?.colorScheme] || OPPORTUNITY_COLOR_SCHEMES.SpectralRedYellowBlue;
}

function opportunityColor(value, data) {
  const palette = opportunityPalette(data.overlay);
  const min = data.min;
  const max = data.max;
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (max <= min) return palette[Math.floor(palette.length / 2)];
  let ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  if (data.overlay?.reverseScale) ratio = 1 - ratio;
  const index = Math.min(palette.length - 1, Math.floor(ratio * palette.length));
  return palette[index];
}

function opportunityStyleForFeature(feature, layerName) {
  const data = state.opportunityData;
  if (!data || data.overlay.id !== state.opportunityOverlay) return undefined;
  if (layerName === "cty" && data.lookup.tract.size && map?.getView().getZoom() >= OPPORTUNITY_TRACT_SWITCH_ZOOM) {
    return undefined;
  }

  const value = data.lookup[layerName]?.get(opportunityFeatureId(feature, layerName));
  if (!Number.isFinite(value)) return undefined;

  const color = opportunityColor(value, data);
  if (!color) return undefined;
  const cacheKey = `${color}:${layerName}`;
  if (!state.opportunityStyleCache.has(cacheKey)) {
    state.opportunityStyleCache.set(
      cacheKey,
      new ol.style.Style({
        fill: new ol.style.Fill({ color: hexToRgba(color, layerName === "tract" ? 0.46 : 0.42) })
      })
    );
  }
  return state.opportunityStyleCache.get(cacheKey);
}

function statePolicyStyleForFeature(feature) {
  const data = state.opportunityData;
  if (!data || data.overlay.id !== state.opportunityOverlay || !data.lookup.state?.size) return undefined;

  const entry = data.lookup.state.get(opportunityFeatureId(feature, "state"));
  if (entry == null) return undefined;

  let color = null;
  if (data.overlay.valueType === "category") {
    const category = data.categories.get(String(entry.value));
    color = entry.color || category?.color || null;
  } else {
    const value = typeof entry === "object" ? Number(entry.value) : Number(entry);
    color = opportunityColor(value, data);
  }

  if (!color) return undefined;
  const cacheKey = `${data.overlay.id}:state:${color}`;
  if (!state.opportunityStyleCache.has(cacheKey)) {
    state.opportunityStyleCache.set(
      cacheKey,
      new ol.style.Style({
        fill: new ol.style.Fill({ color: hexToRgba(color, 0.46) }),
        stroke: new ol.style.Stroke({ color: "rgba(255, 255, 255, 0.72)", width: 0.7 })
      })
    );
  }
  return state.opportunityStyleCache.get(cacheKey);
}

function formatOpportunityValue(value, overlay) {
  if (!Number.isFinite(value)) return tr("Not available");
  const formatType = overlay?.textFormat || "";
  if (formatType === "money2d") {
    return new Intl.NumberFormat(languageLocale(), {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
  if (formatType === "income" || formatType === "money") return currency(value);
  if (formatType === "integer") return number(value);
  if (formatType === "rank") return `#${number(value)}`;
  if (formatType === "year") return number(value);
  if (formatType === "score") return decimal(value, 3);
  if (formatType === "percent/100") return `${decimal(value, 1)}%`;
  if (formatType.includes("Percent") || formatType === "percent") return `${decimal(value * 100, 1)}%`;
  if (formatType === "percentagePoint") return `${decimal(value * 100, 1)} pp`;
  if (formatType.includes("Hours")) return `${decimal(value, 1)} hrs`;
  return decimal(value, 1);
}

function opportunityDataFromLookup(overlay, key, lookup) {
  lookup = {
    cty: lookup.cty || new Map(),
    tract: lookup.tract || new Map(),
    state: lookup.state || new Map()
  };
  const preferredValues = lookup.tract.size
    ? [...lookup.tract.values()]
    : lookup.cty.size
      ? [...lookup.cty.values()]
      : [...lookup.state.values()];
  const numericValue = (entry) => (typeof entry === "object" && entry != null ? Number(entry.value) : Number(entry));
  const values = preferredValues.map(numericValue).filter(Number.isFinite).sort((a, b) => a - b);
  const rawMin = values[0] ?? 0;
  const rawMax = values[values.length - 1] ?? 1;
  const lower = quantile(values, 0.05);
  const upper = quantile(values, 0.95);
  const min = lower == null || lower === upper ? rawMin : lower;
  const max = upper == null || lower === upper ? rawMax : upper;
  const categories = new Map((overlay.categories || []).map((category) => [String(category.value), category]));
  return { overlay, key, lookup, values, min, max, rawMin, rawMax, categories };
}

function normalizeOpportunityFeatures(overlay, key, featuresByLayer) {
  const lookup = { cty: new Map(), tract: new Map(), state: new Map() };
  for (const layerName of ["cty", "tract"]) {
    const features = featuresByLayer?.[layerName] || [];
    for (const feature of features) {
      const properties = feature.properties || {};
      const value = Number(properties[key]);
      if (!Number.isFinite(value)) continue;
      const id = properties.id2;
      if (id == null) continue;
      lookup[layerName].set(String(id), value);
    }
  }
  return opportunityDataFromLookup(overlay, key, lookup);
}

function splitCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }
  values.push(value);
  return values;
}

function countyIdFromCells(cells, headerMap, stateColumn = "state", countyColumn = "county") {
  const stateValue = cells[headerMap.get(stateColumn)];
  const countyValue = cells[headerMap.get(countyColumn)];
  if (stateValue == null || countyValue == null) return "";
  return `cty${String(Number(stateValue)).padStart(2, "0")}${String(Number(countyValue)).padStart(3, "0")}`;
}

async function loadOpportunityAtlasJson(overlay) {
  const key = opportunityPropertyKey(overlay);
  const json = await fetchJsonWithRetry(`${OPPORTUNITY_ATLAS_DATA}allFeatures/${key}.json`, { cache: "force-cache" }, 2);
  return normalizeOpportunityFeatures(overlay, key, json.featuresByLayer || {});
}

async function loadCreditOpportunityData(overlay) {
  const source = OPPORTUNITY_CREDIT_SOURCES[overlay.id];
  const text = await fetchTextWithRetry(`${CENSUS_OPPORTUNITY_DATA}${source.file}`, { cache: "force-cache" }, 2);
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCsvLine(lines.shift() || "");
  const headerMap = new Map(headers.map((header, index) => [header, index]));
  const lookup = { cty: new Map(), tract: new Map() };

  for (const line of lines) {
    if (!line) continue;
    const cells = splitCsvLine(line);
    if (cells[headerMap.get("kid_race")] !== "Pooled" || cells[headerMap.get("par_pctile")] !== "25") continue;
    const value = Number(cells[headerMap.get(source.column)]);
    if (!Number.isFinite(value)) continue;
    const id = countyIdFromCells(cells, headerMap, "par_state", "par_county");
    if (id) lookup.cty.set(id, value);
  }

  return opportunityDataFromLookup(overlay, overlay.id, lookup);
}

async function loadPercentileDollarScales() {
  if (state.opportunityDollarScales) return state.opportunityDollarScales;
  const text = await fetchTextWithRetry(`${OPPORTUNITY_ATLAS_DATA}pctile_to_dollar_cw.csv`, { cache: "force-cache" }, 2);
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCsvLine(lines.shift() || "");
  const headerMap = new Map(headers.map((header, index) => [header, index]));
  const rows = lines.map((line) => {
    const cells = splitCsvLine(line);
    return {
      percentile: Number(cells[headerMap.get("percentile")]),
      kid_hh_income_age26_e: Number(cells[headerMap.get("kid_hh_income_age26_e")]),
      kid_hh_income_age26_l: Number(cells[headerMap.get("kid_hh_income_age26_l")]),
      kid_indiv_income_age26_e: Number(cells[headerMap.get("kid_indiv_income_age26_e")]),
      kid_indiv_income_age26_l: Number(cells[headerMap.get("kid_indiv_income_age26_l")])
    };
  });
  state.opportunityDollarScales = rows;
  return rows;
}

function percentileRankToDollars(rank, column, rows) {
  const percentile = Math.max(0, Math.min(100, Number(rank) * 100));
  const lower = Math.floor(percentile);
  const upper = Math.ceil(percentile);
  const lowerRow = rows[lower] || rows[0];
  const upperRow = rows[upper] || rows[rows.length - 1];
  if (!lowerRow || !upperRow) return null;
  if (lower === upper) return lowerRow[column];
  return lowerRow[column] + (upperRow[column] - lowerRow[column]) * (percentile - lower);
}

async function loadTrendOpportunityData(overlay) {
  const textPromise = fetchTextWithRetry(`${CENSUS_OPPORTUNITY_DATA}county_trends_estimates.csv`, { cache: "force-cache" }, 2);
  const dollarRowsPromise = ["delta_kfr_27", "kfr_27", "kfr_27_1992", "delta_kir_27", "kir_27", "kir_27_1992"].includes(overlay.id)
    ? loadPercentileDollarScales()
    : Promise.resolve(null);
  const [text, dollarRows] = await Promise.all([textPromise, dollarRowsPromise]);
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCsvLine(lines.shift() || "");
  const headerMap = new Map(headers.map((header, index) => [header, index]));
  const lookup = { cty: new Map(), tract: new Map() };

  const valueForCells = (cells) => {
    const read = (column) => Number(cells[headerMap.get(column)]);
    if (overlay.id === "kfr_27") return percentileRankToDollars(read("kfr_pooled_pooled_p25_1978"), "kid_hh_income_age26_e", dollarRows);
    if (overlay.id === "kfr_27_1992") return percentileRankToDollars(read("kfr_pooled_pooled_p25_1992"), "kid_hh_income_age26_l", dollarRows);
    if (overlay.id === "kir_27") return percentileRankToDollars(read("kir_pooled_pooled_p25_1978"), "kid_indiv_income_age26_e", dollarRows);
    if (overlay.id === "kir_27_1992") return percentileRankToDollars(read("kir_pooled_pooled_p25_1992"), "kid_indiv_income_age26_l", dollarRows);
    if (overlay.id === "delta_kfr_27") {
      const early = percentileRankToDollars(read("kfr_pooled_pooled_p25_1978"), "kid_hh_income_age26_e", dollarRows);
      const late = percentileRankToDollars(read("kfr_pooled_pooled_p25_1992"), "kid_hh_income_age26_l", dollarRows);
      return early ? (late - early) / early : null;
    }
    if (overlay.id === "delta_kir_27") {
      const early = percentileRankToDollars(read("kir_pooled_pooled_p25_1978"), "kid_indiv_income_age26_e", dollarRows);
      const late = percentileRankToDollars(read("kir_pooled_pooled_p25_1992"), "kid_indiv_income_age26_l", dollarRows);
      return early ? (late - early) / early : null;
    }
    return read(OPPORTUNITY_TREND_COLUMNS[overlay.id]);
  };

  for (const line of lines) {
    if (!line) continue;
    const cells = splitCsvLine(line);
    const value = valueForCells(cells);
    if (!Number.isFinite(value)) continue;
    const id = countyIdFromCells(cells, headerMap);
    if (id) lookup.cty.set(id, value);
  }

  return opportunityDataFromLookup(overlay, overlay.id, lookup);
}

async function loadCovariateChangeOpportunityData(overlay) {
  const text = await fetchTextWithRetry(`${CENSUS_OPPORTUNITY_DATA}county_covariates.csv`, { cache: "force-cache" }, 2);
  const lines = text.trim().split(/\r?\n/);
  const headers = splitCsvLine(lines.shift() || "");
  const headerMap = new Map(headers.map((header, index) => [header, index]));
  const lookup = { cty: new Map(), tract: new Map() };

  const valueForCells = (cells) => {
    const read = (column) => Number(cells[headerMap.get(column)]);
    if (overlay.id === "d_med_hh_inc") return read("hhinc_median_pooled2009") - read("hhinc_median_pooled1990");
    if (overlay.id === "d_poverty_rate") return read("poor_share_pooled2009") - read("poor_share_pooled1990");
    if (overlay.id === "d_share_non_white") return -read("change_share_white1990_2010");
    return read(OPPORTUNITY_COVARIATE_CHANGE_COLUMNS[overlay.id]);
  };

  for (const line of lines) {
    if (!line) continue;
    const cells = splitCsvLine(line);
    const value = valueForCells(cells);
    if (!Number.isFinite(value)) continue;
    const id = countyIdFromCells(cells, headerMap);
    if (id) lookup.cty.set(id, value);
  }

  return opportunityDataFromLookup(overlay, overlay.id, lookup);
}

async function loadPolicyStateData(overlay) {
  const lookup = { cty: new Map(), tract: new Map(), state: new Map() };
  const categories = new Map((overlay.categories || []).map((category) => [String(category.value), category]));
  for (const [fips, rawEntry] of Object.entries(overlay.values || {})) {
    const key = String(fips).padStart(2, "0");
    if (overlay.valueType === "number") {
      const value = typeof rawEntry === "object" && rawEntry != null ? Number(rawEntry.value) : Number(rawEntry);
      if (Number.isFinite(value)) lookup.state.set(key, value);
      continue;
    }
    const value = typeof rawEntry === "object" && rawEntry != null ? rawEntry.value : rawEntry;
    if (value == null || value === "") continue;
    const category = categories.get(String(value));
    lookup.state.set(key, {
      value,
      label: rawEntry?.label || category?.label || String(value),
      color: rawEntry?.color || category?.color || null,
      state: rawEntry?.state || STATE_ABBR_TO_NAME[STATE_FIPS_TO_ABBR[key]] || ""
    });
  }
  return opportunityDataFromLookup(overlay, overlay.id, lookup);
}

async function getOpportunityData(overlay) {
  if (state.opportunityDataCache.has(overlay.id)) return state.opportunityDataCache.get(overlay.id);
  const promise = (async () => {
    if (overlay.sourceType === "policy-state") return loadPolicyStateData(overlay);
    if (OPPORTUNITY_CREDIT_SOURCES[overlay.id]) return loadCreditOpportunityData(overlay);
    if (OPPORTUNITY_TREND_COLUMNS[overlay.id]) return loadTrendOpportunityData(overlay);
    if (overlay.id.startsWith("d_")) return loadCovariateChangeOpportunityData(overlay);
    return loadOpportunityAtlasJson(overlay);
  })();
  state.opportunityDataCache.set(overlay.id, promise);
  try {
    const data = await promise;
    state.opportunityDataCache.set(overlay.id, data);
    return data;
  } catch (error) {
    state.opportunityDataCache.delete(overlay.id);
    throw error;
  }
}

function updateOpportunityLayerVisibility() {
  const data = state.opportunityData;
  const visible = Boolean(activeOpportunityOverlay() && data);
  opportunityCountyLayer.setVisible(visible && data.lookup.cty.size > 0);
  opportunityTractLayer.setVisible(visible && data.lookup.tract.size > 0);
  opportunityStateLayer.setVisible(visible && data.lookup.state.size > 0);
  opportunityCountyLayer.changed();
  opportunityTractLayer.changed();
  opportunityStateLayer.changed();
}

function renderOpportunityLegend(status = "idle", message = "") {
  const overlay = activeOpportunityOverlay();
  if (!overlay) {
    elements.opportunityLegend.hidden = true;
    elements.opportunityLegend.innerHTML = "";
    return;
  }

  elements.opportunityLegend.hidden = false;
  if (status === "loading") {
    elements.opportunityLegend.innerHTML = `
      <h2>${escapeHtml(overlay.title)}</h2>
      <p class="legend-status">${escapeHtml(message || "Loading Opportunity Atlas overlay...")}</p>
    `;
    return;
  }
  if (status === "error") {
    elements.opportunityLegend.innerHTML = `
      <h2>${escapeHtml(overlay.title)}</h2>
      <p class="legend-status">${escapeHtml(message || "Could not load this Opportunity Atlas overlay.")}</p>
    `;
    return;
  }

  const data = state.opportunityData;
  const sourceHtml = overlay.sourceName
    ? overlay.sourceUrl
      ? ` Source: <a href="${escapeHtml(overlay.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(overlay.sourceName)}</a>.`
      : ` Source: ${escapeHtml(overlay.sourceName)}.`
    : "";

  if (overlay.valueType === "category") {
    const categoryList = overlay.categories?.length
      ? overlay.categories
      : [...new Map([...data.lookup.state.values()].map((entry) => [String(entry.value), { value: entry.value, label: entry.label, color: entry.color }])).values()];
    elements.opportunityLegend.innerHTML = `
      <h2>${escapeHtml(overlay.title)}</h2>
      <p class="legend-subtitle">${escapeHtml(overlay.description)}</p>
      <div class="legend-list">
        ${categoryList
          .map(
            (item) => `
              <div class="legend-item">
                <span class="legend-dot" style="background:${escapeHtml(item.color || "#9aa0a6")}"></span>
                <span>${escapeHtml(item.label || item.value)}</span>
              </div>
            `
          )
          .join("")}
      </div>
      <p class="legend-note">State-level overlay.${sourceHtml}</p>
    `;
    return;
  }

  const palette = overlay.reverseScale ? [...opportunityPalette(overlay)].reverse() : opportunityPalette(overlay);
  const geographyLabel = data?.lookup.state.size
    ? "State-level overlay"
    : data?.lookup.tract.size
      ? "County color at low zoom, tract detail when zoomed in"
      : "County-level overlay";
  const methodology = data?.lookup.state.size ? "" : " Pooled race and gender, parents at the 25th income percentile where applicable.";
  elements.opportunityLegend.innerHTML = `
    <h2>${escapeHtml(overlay.title)}</h2>
    <p class="legend-subtitle">${escapeHtml(overlay.description)}</p>
    <div class="legend-ramp" style="background: linear-gradient(90deg, ${palette.join(", ")})"></div>
    <div class="legend-scale">
      <span>${escapeHtml(formatOpportunityValue(data?.min ?? 0, overlay))}</span>
      <span>${escapeHtml(formatOpportunityValue(data?.max ?? 0, overlay))}</span>
    </div>
    <p class="legend-note">${escapeHtml(`${geographyLabel}.${methodology}`)}${sourceHtml}</p>
  `;
}

async function setOpportunityOverlay(id) {
  const overlay = OPPORTUNITY_BY_ID[id] || state.policyOverlayById.get(id) || null;
  state.opportunityOverlay = overlay?.id || "none";
  state.opportunityData = null;
  state.opportunityStyleCache.clear();
  updateOpportunityLayerVisibility();
  elements.opportunity.value = state.opportunityOverlay;

  if (!overlay) {
    renderOpportunityLegend();
    if (!state.selectedGeoid) renderHomeProfile();
    return;
  }

  const token = state.opportunityLoadToken + 1;
  state.opportunityLoadToken = token;
  renderOpportunityLegend("loading");

  try {
    const data = await getOpportunityData(overlay);
    if (token !== state.opportunityLoadToken) return;
      state.opportunityData = data;
      renderOpportunityLegend();
      updateOpportunityLayerVisibility();
      if (!state.selectedGeoid) renderHomeProfile();
    } catch (error) {
      if (token !== state.opportunityLoadToken) return;
      console.warn("Opportunity Atlas overlay failed to load", error);
      renderOpportunityLegend("error", error.message);
      if (!state.selectedGeoid) renderHomeProfile();
    }
  }

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function metric(data, table, column) {
  return data?.[table]?.estimate?.[column] ?? null;
}

function sumMetrics(data, table, columns) {
  const values = columns.map((column) => metric(data, table, column));
  if (values.some((value) => value == null)) return null;
  return values.reduce((sum, value) => sum + value, 0);
}

function percentage(numerator, denominator) {
  if (numerator == null || denominator == null || denominator === 0) return null;
  return Math.round((numerator / denominator) * 1000) / 10;
}

function buildMetrics(data) {
  const population = metric(data, "B01001", "B01001001");
  const households = metric(data, "B11001", "B11001001");
  const povertyTotal = metric(data, "B17001", "B17001001");
  const povertyBelow = metric(data, "B17001", "B17001002");
  const educationTotal = metric(data, "B15003", "B15003001");
  const highSchoolPlus = sumMetrics(
    data,
    "B15003",
    Array.from({ length: 9 }, (_, index) => `B15003${String(index + 17).padStart(3, "0")}`)
  );
  const bachelorsPlus = sumMetrics(
    data,
    "B15003",
    Array.from({ length: 4 }, (_, index) => `B15003${String(index + 22).padStart(3, "0")}`)
  );
  const languageTotal = metric(data, "B16001", "B16001001");
  const englishOnly = metric(data, "B16001", "B16001002");
  const foreignBorn = metric(data, "B05002", "B05002013");
  const foreignBornTotal = metric(data, "B05002", "B05002001");
  const raceTotal = metric(data, "B03002", "B03002001");
  const aggregateMinutes = metric(data, "B08013", "B08013001");
  const workers = metric(data, "B08006", "B08006001");

  return {
    population,
    medianAge: metric(data, "B01002", "B01002001"),
    male: metric(data, "B01001", "B01001002"),
    female: metric(data, "B01001", "B01001026"),
    perCapitaIncome: metric(data, "B19301", "B19301001"),
    medianHouseholdIncome: metric(data, "B19013", "B19013001"),
    povertyRate: percentage(povertyBelow, povertyTotal),
    povertyCount: povertyBelow,
    households,
    personsPerHousehold:
      population && households ? Math.round((population / households) * 100) / 100 : null,
    housingUnits: metric(data, "B25001", "B25001001"),
    medianHomeValue: metric(data, "B25077", "B25077001"),
    medianRealEstateTaxes: metric(data, "B25103", "B25103001"),
    medianRealEstateTaxesWithMortgage: metric(data, "B25103", "B25103002"),
    medianRealEstateTaxesWithoutMortgage: metric(data, "B25103", "B25103003"),
    highSchoolRate: percentage(highSchoolPlus, educationTotal),
    bachelorsRate: percentage(bachelorsPlus, educationTotal),
    nonEnglishRate: percentage(languageTotal - englishOnly, languageTotal),
    foreignBornRate: percentage(foreignBorn, foreignBornTotal),
    foreignBorn,
    meanCommute: aggregateMinutes && workers ? Math.round((aggregateMinutes / workers) * 10) / 10 : null,
    race: {
      "White, non-Hispanic": percentage(metric(data, "B03002", "B03002003"), raceTotal),
      "Black, non-Hispanic": percentage(metric(data, "B03002", "B03002004"), raceTotal),
      "Asian, non-Hispanic": percentage(metric(data, "B03002", "B03002006"), raceTotal),
      Hispanic: percentage(metric(data, "B03002", "B03002012"), raceTotal),
      "Native American/Other, non-Hispanic": percentage(
        sumMetrics(data, "B03002", ["B03002005", "B03002007", "B03002008"]),
        raceTotal
      ),
      "Two or more, non-Hispanic": percentage(metric(data, "B03002", "B03002009"), raceTotal)
    }
  };
}

function stat(label, value, note = "") {
  return `
    <article class="stat-card">
      <span class="stat-label">${escapeHtml(tr(label))}</span>
      <span class="stat-value">${value}</span>
      ${note ? `<span class="stat-note">${escapeHtml(tr(note))}</span>` : ""}
    </article>
  `;
}

function raceChart(race) {
  const rows = Object.entries(race || {})
    .filter(([, value]) => value != null)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([label, value]) => {
        const color = RACE_BAR_COLORS[label] || "var(--teal)";
        return `
      <div class="bar-row">
        <span>${escapeHtml(label)}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${Math.min(value, 100)}%; background:${escapeHtml(color)}"></span></span>
        <span class="bar-value">${pct(value)}</span>
      </div>
    `;
      }
    )
    .join("");

  return `
    <article class="mini-chart">
      <span class="chart-label">${escapeHtml(tr("Race & ethnicity"))}</span>
      ${rows || `<p class="stat-note">${escapeHtml(tr("Not available"))}</p>`}
    </article>
  `;
}

function normalizeParty(party) {
  const value = String(party || "").trim().toLowerCase();
  if (!value) return "";
  if (value.includes("republican")) return "Republican";
  if (value.includes("democrat") || value.includes("democratic")) return "Democrat";
  return "Other";
}

function partyClass(party) {
  const normalized = normalizeParty(party);
  if (normalized === "Republican") return "party-republican";
  if (normalized === "Democrat") return "party-democrat";
  return "party-other";
}

function representativeName(member) {
  return [member?.name?.official_full, member?.name?.first && member?.name?.last ? `${member.name.first} ${member.name.last}` : ""].find(Boolean);
}

function uniqueTruthy(values) {
  return [...new Set(values.filter(Boolean))];
}

function governorNgaUrl(stateAbbr) {
  const name = STATE_ABBR_TO_NAME[stateAbbr];
  if (!name) return "https://www.nga.org/governors/";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `https://www.nga.org/governors/${slug}/`;
}

function staticGovernorForState(stateAbbr) {
  const key = String(stateAbbr || "").trim().toUpperCase();
  const governor = STATIC_GOVERNORS[key];
  if (!governor) return null;
  return {
    ...governor,
    imageFallbacks: governor.imageFallbacks || [],
    links: [{ label: "National Governors Association", url: governorNgaUrl(key) }],
    source: "Bundled current governor fallback"
  };
}

function mergeGovernorWithFallback(governor, fallback, preferFallback = false) {
  if (!fallback) return governor || null;
  if (!governor) return fallback;
  const base = preferFallback ? fallback : governor;
  const secondary = preferFallback ? governor : fallback;
  return {
    ...secondary,
    ...base,
    party: base.party || secondary.party,
    image: base.image || secondary.image,
    imageFallbacks: uniqueTruthy([
      ...(base.imageFallbacks || []),
      secondary.image,
      ...(secondary.imageFallbacks || []),
      base.wikidataImage,
      secondary.wikidataImage
    ]),
    links: base.links?.length ? base.links : secondary.links,
    wikidataImage: base.wikidataImage || secondary.wikidataImage,
    source: base.source || secondary.source
  };
}

function bioguidePhotoUrl(bioguide) {
  const id = String(bioguide || "").trim();
  if (!id) return "";
  return BIOGUIDE_PHOTO_URL.replace("{initial}", id.charAt(0).toUpperCase()).replace("{bioguide}", id);
}

function congressDotGovPhotoUrl(bioguide) {
  const id = String(bioguide || "").trim();
  return id ? CONGRESS_DOT_GOV_PHOTO_URL.replace("{bioguideLower}", id.toLowerCase()) : "";
}

function legacyCongressPhotoUrl(bioguide) {
  const id = String(bioguide || "").trim();
  return id ? CONGRESS_PHOTO_URL.replace("{bioguide}", id) : "";
}

function congressionalPhotoUrls(member) {
  const bioguide = member?.id?.bioguide;
  return uniqueTruthy([
    bioguidePhotoUrl(bioguide),
    congressDotGovPhotoUrl(bioguide),
    legacyCongressPhotoUrl(bioguide),
    member?.wikidataImage
  ]);
}

function legislatorCard({ label, name, party, district, image, imageFallbacks = [], fallbackImage, url, email }) {
  const images = uniqueTruthy([image, ...imageFallbacks, fallbackImage]);
  const displayImage = images[0] || "";
  const hasImage = Boolean(displayImage);
  const fallbackAttribute = images.length > 1 ? ` data-fallbacks="${escapeHtml(images.slice(1).join("|"))}"` : "";
  return `
    <article class="representative-card ${hasImage ? "" : "no-image"} ${partyClass(party)}">
      ${hasImage ? `<img src="${escapeHtml(displayImage)}"${fallbackAttribute} alt="${escapeHtml(name || `${label} portrait`)}" loading="lazy" referrerpolicy="no-referrer" onerror="const fallbacks = (this.dataset.fallbacks || '').split('|').filter(Boolean); if (fallbacks.length) { this.src = fallbacks.shift(); this.dataset.fallbacks = fallbacks.join('|'); } else { this.remove(); this.closest('.representative-card')?.classList.add('no-image'); }">` : ""}
      <div>
        <span class="stat-label">${escapeHtml(tr(label))}</span>
        <span class="stat-value">${escapeHtml(name || tr("Not available"))}</span>
        <span class="stat-note">${escapeHtml(party || "Party not available")}${district ? ` - District ${escapeHtml(district)}` : ""}</span>
        ${url ? `<a href="${url}" target="_blank" rel="noreferrer">${escapeHtml(tr("Official website"))}</a>` : ""}
        ${email ? `<a href="mailto:${email}">${escapeHtml(email)}</a>` : ""}
      </div>
    </article>
  `;
}

function schoolTextList(title, items) {
  const rows = (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  if (!rows) return "";
  return `<div class="school-list"><span class="stat-label">${escapeHtml(tr(title))}</span><ul>${rows}</ul></div>`;
}

function schoolKeyValueList(title, items) {
  const rows = (items || [])
    .map((item) => {
      const label = item.label ? `<strong>${escapeHtml(tr(item.label))}</strong>` : "";
      const value = item.value ? ` ${escapeHtml(item.value)}` : "";
      const note = item.note ? ` <span>${escapeHtml(item.note)}</span>` : "";
      return `<li>${label}${value}${note}</li>`;
    })
    .join("");
  if (!rows) return "";
  return `<div class="school-list"><span class="stat-label">${escapeHtml(tr(title))}</span><ul>${rows}</ul></div>`;
}

function schoolGradeList(title, items) {
  const rows = (items || [])
    .map((item) => {
      const grade = item.value ? `<strong>${escapeHtml(item.value)}</strong>` : "";
      const label = item.label ? ` ${escapeHtml(tr(item.label))}` : "";
      const note = item.note ? ` <span>${escapeHtml(item.note)}</span>` : "";
      return `<li>${grade}${label}${note}</li>`;
    })
    .join("");
  if (!rows) return "";
  return `<div class="school-list"><span class="stat-label">${escapeHtml(tr(title))}</span><ul>${rows}</ul></div>`;
}

function schoolBarList(title, items, valueFormatter = (value) => `${value}%`, maxValue = 100) {
  const rows = (items || [])
    .map((item) => {
      const value = Number(item.value);
      const width = Number.isFinite(value) && maxValue ? percentBarWidth((value / maxValue) * 100) : percentBarWidth(item.value);
      return `
        <div class="bar-row">
          <span>${escapeHtml(tr(item.label))}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${width}%"></span></span>
          <span class="bar-value">${escapeHtml(valueFormatter(item.value))}</span>
        </div>
      `;
    })
    .join("");
  if (!rows) return "";
  return `<div class="school-list"><span class="stat-label">${escapeHtml(tr(title))}</span><div class="mini-chart school-mini-chart">${rows}</div></div>`;
}

function schoolSourceResultList(title, items) {
  const rows = (items || [])
    .map(
      (item) => `
        <li>
          <a href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer"><strong>${escapeHtml(item.title)}</strong></a>
          ${item.description ? `<span>${escapeHtml(item.description)}</span>` : ""}
        </li>
      `
    )
    .join("");
  if (!rows) return "";
  return `<div class="school-list school-source-list"><span class="stat-label">${escapeHtml(tr(title))}</span><ul>${rows}</ul></div>`;
}

function externalLinksHtml(links, excludedUrls = new Set()) {
  return (links || [])
    .filter((link) => link?.url && !excludedUrls.has(link.url))
    .map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
    .join("");
}

function schoolRatingsSection(ratings, links) {
  if (!ratings) {
    return `
      <article class="stat-card external-links">
        <span class="stat-label">${escapeHtml(tr("School ratings"))}</span>
        <span class="stat-value">${escapeHtml(tr("Live lookup"))}</span>
        <span class="stat-note">Open the Niche and US News source links for current ratings and rankings.</span>
        ${externalLinksHtml(links)}
      </article>
    `;
  }

  const gradeCards = (ratings.grades || [])
    .map(
      (item) => `
        <div class="rating-pill">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(item.value)}</strong>
        </div>
      `
    )
    .join("");
  const stats = (ratings.stats || [])
    .map((item) => stat(item.label, escapeHtml(item.value), item.note))
    .join("");
  const contactRows = [
    ratings.districtType ? { label: "Type", value: ratings.districtType } : null,
    ratings.location ? { label: "Location", value: ratings.location } : null,
    ratings.contact?.address ? { label: "Address", value: ratings.contact.address } : null,
    ratings.contact?.phone ? { label: "Phone", value: ratings.contact.phone } : null
  ].filter(Boolean);
  const offeringRows = (ratings.offerings || []).map((offering) => ({ label: offering, value: "Yes" }));
  const livingAreaRows = [
    ratings.livingArea?.overallGrade ? { label: `${ratings.livingArea.name || "Area"} overall`, value: ratings.livingArea.overallGrade } : null,
    ...(ratings.livingArea?.grades || []),
    ...(ratings.livingArea?.stats || [])
  ].filter(Boolean);
  const reviewTotal = (ratings.reviewBreakdown || []).reduce((sum, item) => sum + Number(item.value || 0), 0);
  const reviewTitle = [ratings.rating, ratings.reviewCount].filter(Boolean).join(" - ");
  const usNewsResults = schoolSourceResultList("US News results", ratings.usNewsResults);
  const shownLinks = new Set([ratings.contact?.website, ratings.sourceUrl, ratings.rankingsUrl].filter(Boolean));
  const extraLinks = externalLinksHtml(links, shownLinks);

  return `
    <article class="school-ratings-card">
      <div class="school-ratings-head">
        <div>
          <span class="stat-label">${escapeHtml(ratings.source || tr("School ratings"))}</span>
          <span class="stat-value">${escapeHtml(ratings.overallGrade || tr("Not available"))}</span>
          <span class="stat-note">${escapeHtml([ratings.rating, ratings.reviewCount, ratings.headlineRank].filter(Boolean).join(" - "))}</span>
        </div>
        <div class="external-links">
          ${ratings.contact?.website ? `<a href="${escapeHtml(ratings.contact.website)}" target="_blank" rel="noreferrer">${escapeHtml(tr("District website"))}</a>` : ""}
          ${ratings.sourceUrl ? `<a href="${escapeHtml(ratings.sourceUrl)}" target="_blank" rel="noreferrer">Niche profile</a>` : ""}
          ${ratings.rankingsUrl ? `<a href="${escapeHtml(ratings.rankingsUrl)}" target="_blank" rel="noreferrer">Niche rankings</a>` : ""}
        </div>
      </div>
      ${ratings.summary ? `<p class="school-summary">${escapeHtml(ratings.summary)}</p>` : ""}
      ${gradeCards ? `<div class="rating-pill-grid">${gradeCards}</div>` : ""}
      ${stats ? `<div class="stat-grid compact-stat-grid">${stats}</div>` : ""}
      ${schoolKeyValueList("District contact", contactRows)}
      ${schoolKeyValueList("Programs", offeringRows)}
      ${schoolBarList("Education expenses", ratings.financeBreakdown)}
      ${schoolBarList(reviewTitle || "Review mix", ratings.reviewBreakdown, (value) => `${value}`, reviewTotal || 100)}
      ${schoolGradeList("Highlighted schools", ratings.topSchools)}
      ${schoolGradeList("Popular colleges", ratings.popularColleges)}
      ${schoolKeyValueList("Living in the area", livingAreaRows)}
      ${schoolTextList("Rankings", ratings.rankings)}
      ${usNewsResults}
      ${schoolTextList("Notes", ratings.notes)}
      ${extraLinks ? `<div class="external-links fallback-links">${extraLinks}</div>` : ""}
    </article>
  `;
}

function geographyExtraSection(geoid, profile, extras) {
  const type = extras?.type || geographyForGeoid(geoid);
  const metrics = profile.metrics;
  const cards = [
    stat("Boundary type", escapeHtml(translatedTypeLabel(type)), geoid),
    stat("Median real estate taxes", currency(metrics.medianRealEstateTaxes), "Owner-occupied housing units"),
    stat("With mortgage taxes", currency(metrics.medianRealEstateTaxesWithMortgage)),
    stat("Without mortgage taxes", currency(metrics.medianRealEstateTaxesWithoutMortgage))
  ];

  if (type.id === "congressional") {
    const member = extras?.representative;
    if (member) {
      const term = member.currentTerm || member.terms?.at(-1) || {};
      const photos = congressionalPhotoUrls(member);
      cards.unshift(
        legislatorCard({
          label: "Representative",
          name: representativeName(member),
          party: term.party,
          district: term.state && term.district != null ? `${term.state}-${String(term.district).padStart(2, "0")}` : "",
          image: photos[0],
          imageFallbacks: photos.slice(1),
          url: term.url
        })
      );
    } else {
      cards.unshift(stat("Representative", "Not available", extras?.representativeError || "Current congressional data did not include this district."));
    }
  }

  if (type.id === "state") {
    const governor = extras?.governor;
    if (governor) {
      cards.unshift(
        legislatorCard({
          label: "Governor",
          name: governor.name,
          party: governor.party,
          image: governor.image,
          imageFallbacks: governor.imageFallbacks || [],
          fallbackImage: governor.wikidataImage,
          url: governor.links?.[0]?.url,
          email: governor.email
        })
      );
    }

    for (const senator of extras?.senators || []) {
      const term = senator.currentTerm || {};
      const photos = congressionalPhotoUrls(senator);
      cards.unshift(
        legislatorCard({
          label: "U.S. Senator",
          name: representativeName(senator),
          party: term.party,
          image: photos[0],
          imageFallbacks: photos.slice(1),
          url: term.url
        })
      );
    }

    if (!governor && !(extras?.senators || []).length) {
      cards.unshift(stat("State officials", "Not available", extras?.stateOfficialsError || "Current state officials could not be loaded."));
    }
  }

  if (type.id === "nation") {
    const officials = extras?.nationalOfficials || NATIONAL_OFFICIALS;
    cards.unshift(
      ...officials.map((official) =>
        legislatorCard({
          label: official.label,
          name: official.name,
          party: official.party,
          image: official.image,
          fallbackImage: official.wikidataImage,
          url: official.url
        })
      )
    );
  }

  if (type.id === "stateHouse" || type.id === "stateSenate") {
    const legislator = extras?.stateLegislator;
    cards.unshift(
      legislator
        ? legislatorCard({
            label: type.id === "stateHouse" ? "State representative" : "State senator",
            name: legislator.name,
            party: legislator.party,
            district: legislator.currentRole?.district,
            image: legislator.image,
            fallbackImage: legislator.wikidataImage,
            url: legislator.links?.[0]?.url,
            email: legislator.email
          })
        : stat("State legislator", "Not available", extras?.stateLegislatorError || "OpenStates did not include a matching current legislator for this district.")
    );
  }

  if (type.id === "place") {
    const mayor = extras?.mayor;
    cards.unshift(
      mayor
        ? legislatorCard({
            label: mayor.label || "Mayor",
            name: mayor.name,
            party: mayor.party,
            image: mayor.image,
            fallbackImage: mayor.wikidataImage,
            url: mayor.links?.[0]?.url || mayor.sourceUrl,
            email: mayor.email
          })
        : stat("Mayor", "Not available", extras?.mayorError || "OpenStates does not list a current mayor for this place.")
    );
  }

  if (type.id === "schoolDistrict") {
    const links = extras?.externalLinks || [];
    cards.unshift(stat("Education profile", `${pct(metrics.highSchoolRate)} high school+`, `${pct(metrics.bachelorsRate)} bachelor's+`));
    cards.push(schoolRatingsSection(extras?.schoolRatings, links));
  }

  if (type.id === "county" || type.id === "place" || type.id === "zip" || type.id === "tract" || type.id === "blockGroup") {
    cards.unshift(stat("Local economy", currency(metrics.medianHouseholdIncome), `${pct(metrics.povertyRate)} poverty`));
  }

  return `
    <section class="section">
      <h3>${escapeHtml(tr("{type} details", { type: translatedTypeLabel(type) }))}</h3>
      <div class="stat-grid">
        ${cards.join("")}
      </div>
    </section>
  `;
}

function areaByGeoid(geoid) {
  return state.index?.areas.find((area) => area.geoid === geoid);
}

function profileRaceFromIndexRace(race = {}) {
  return {
    "White, non-Hispanic": race.white,
    "Black, non-Hispanic": race.black,
    "Asian, non-Hispanic": race.asian,
    Hispanic: race.hispanic,
    "Native American/Other, non-Hispanic": Math.round(
      [race.native, race.pacific, race.other].map((value) => Number(value || 0)).reduce((sum, value) => sum + value, 0) * 10
    ) / 10,
    "Two or more, non-Hispanic": race.multiracial
  };
}

function localUrbanProfile(geoid, area) {
  const metrics = {
    ...(area.metrics || {}),
    race: profileRaceFromIndexRace(area.metrics?.race || {})
  };
  const releaseName = area.isMergedUrbanArea
    ? `${state.index?.release?.name || "Census Reporter latest ACS"} - local merged calculation`
    : state.index?.release?.name || "Census Reporter latest ACS";
  return {
    metadata: {
      display_name: area.name,
      simple_name: area.name.replace(/ Urban Area$/i, ""),
      name: area.name,
      population: metrics.population,
      square_miles: area.landSquareMiles,
      population_density: area.density
    },
    detail: {
      release: {
        ...(state.index?.release || {}),
        name: releaseName
      },
      data: {}
    },
    metrics
  };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithRetry(url, options = {}, attempts = 3) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response.json();
    } catch (error) {
      lastError = error;
      await wait(250 * (attempt + 1));
    }
  }
  throw lastError;
}

async function fetchTextWithRetry(url, options = {}, attempts = 3) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return response.text();
    } catch (error) {
      lastError = error;
      await wait(250 * (attempt + 1));
    }
  }
  throw lastError;
}

async function loadBoundaryOverlay() {
  if (state.boundariesLoaded || state.boundariesLoading) return;
  state.boundariesLoading = true;

  try {
    const geojson = await fetchJsonWithRetry(BOUNDARY_URL, { cache: "force-cache" });
    state.boundaryGeojson = geojson;
    const features = format.readFeatures(geojson, {
      featureProjection: map.getView().getProjection()
    });

    for (const feature of features) {
      const geoid = feature.get("GEOID");
      if (geoid) feature.setId(geoid);
    }

    urbanSource.addFeatures(features);
    state.boundariesLoaded = true;
  } catch (error) {
    console.warn("Urban area overlay failed to load", error);
  } finally {
    state.boundariesLoading = false;
  }
}

async function fetchDetailTables(geoid) {
  const url = new URL(`${CR_API}/data/show/latest`);
  url.search = new URLSearchParams({
    table_ids: DETAIL_TABLES.join(","),
    geo_ids: geoid
  }).toString();

  const response = await fetch(url);
  if (response.ok) return response.json();

  const merged = { release: null, data: { [geoid]: {} }, geography: {} };
  for (const table of DETAIL_TABLES) {
    const tableUrl = new URL(`${CR_API}/data/show/latest`);
    tableUrl.search = new URLSearchParams({ table_ids: table, geo_ids: geoid }).toString();
    const tableResponse = await fetch(tableUrl);
    if (!tableResponse.ok) continue;
    const result = await tableResponse.json();
    merged.release ??= result.release;
    Object.assign(merged.geography, result.geography || {});
    Object.assign(merged.data[geoid], result.data?.[geoid] || {});
  }
  return merged;
}

async function loadProfile(geoid) {
  if (state.profileCache.has(geoid)) return state.profileCache.get(geoid);

  const indexArea = areaByGeoid(geoid);
  if (indexArea?.isMergedUrbanArea) {
    const profile = localUrbanProfile(geoid, indexArea);
    state.profileCache.set(geoid, profile);
    return profile;
  }

  const [metadata, detail] = await Promise.all([
    fetch(`${CR_API}/geo/tiger2024/${geoid}`).then((response) => {
      if (!response.ok) throw new Error("Census Reporter metadata request failed");
      return response.json();
    }),
    fetchDetailTables(geoid)
  ]);

  const profile = {
    metadata: {
      ...(state.geometryCache.get(geoid)?.features?.[0]?.properties || {}),
      ...(metadata.properties || {})
    },
    detail,
    metrics: buildMetrics(detail.data?.[geoid] || {})
  };
  state.profileCache.set(geoid, profile);
  return profile;
}

async function loadSchoolRatings() {
  if (state.schoolRatings) return state.schoolRatings;
  state.schoolRatings = await fetchJsonWithRetry(SCHOOL_RATINGS_URL, { cache: "no-cache" });
  return state.schoolRatings;
}

function schoolDistrictState(geoid, profile) {
  const displayMatch = String(profile?.metadata?.display_name || "").match(/,\s*([A-Z]{2})$/);
  if (displayMatch) return displayMatch[1];
  return STATE_FIPS_TO_ABBR[shortGeoid(geoid).slice(0, 2)] || "";
}

function schoolRatingLookupName(profile, geoid) {
  const simple = profile?.metadata?.simple_name || profile?.metadata?.name || profile?.metadata?.display_name;
  return String(simple || geoid).replace(/\s+/g, " ").trim();
}

function schoolSourceLinks(profile, geoid) {
  const name = schoolRatingLookupName(profile, geoid);
  return [
    {
      label: "Niche school profile search",
      url: `https://www.niche.com/k12/search/best-school-districts/?q=${encodeURIComponent(name)}`
    },
    {
      label: "US News school search",
      url: `https://www.usnews.com/education/k12/search?search=${encodeURIComponent(name)}`
    }
  ];
}

function mergeLinks(...groups) {
  const seen = new Set();
  return groups
    .flat()
    .filter(Boolean)
    .filter((link) => {
      const key = link.url || link.label;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function fallbackSchoolRatings(profile, geoid, error = null) {
  return {
    source: "School ratings lookup",
    overallGrade: "Live lookup",
    rating: error ? "Source lookup failed" : "Open source links for current ratings",
    summary: "Current Niche and US News source links are available for this district.",
    stats: [],
    externalLinks: schoolSourceLinks(profile, geoid),
    notes: [
      "The district was not in the local cache.",
      "Open the linked Niche and US News pages for current ratings and rankings."
    ]
  };
}

async function loadLiveSchoolRatings(geoid, profile) {
  if (state.liveSchoolRatingsCache.has(geoid)) return state.liveSchoolRatingsCache.get(geoid);
  const params = new URLSearchParams({
    geoid,
    name: schoolRatingLookupName(profile, geoid),
    state: schoolDistrictState(geoid, profile)
  });

  const request = fetchJsonWithRetry(`${SCHOOL_RATINGS_API}?${params.toString()}`, { cache: "no-cache" }, 1)
    .then((ratings) => ({
      ...ratings,
      externalLinks: mergeLinks(ratings.externalLinks || [], schoolSourceLinks(profile, geoid))
    }))
    .catch((error) => fallbackSchoolRatings(profile, geoid, error));

  state.liveSchoolRatingsCache.set(geoid, request);
  return request;
}

async function loadCongressData() {
  if (state.congressData) return state.congressData;
  if (state.congressLoading) return state.congressLoading;

  state.congressLoading = fetch(CONGRESS_LEGISLATORS_URL)
    .then((response) => {
      if (!response.ok) throw new Error("Congressional representative data request failed");
      return response.json();
    })
    .then((members) => {
      state.congressData = members;
      return members;
    })
    .finally(() => {
      state.congressLoading = null;
    });

  return state.congressLoading;
}

async function loadLiveStateOfficials(stateAbbr) {
  const key = String(stateAbbr || "").trim().toUpperCase();
  if (!key) return null;
  if (!STATE_OFFICIALS_API) return null;
  if (state.stateOfficialsCache.has(key)) return state.stateOfficialsCache.get(key);

  const params = new URLSearchParams({ state: key });
  const request = fetchJsonWithRetry(`${STATE_OFFICIALS_API}?${params.toString()}`, { cache: "no-cache" }, 1)
    .then((payload) => payload?.governor || null)
    .catch(() => null);

  state.stateOfficialsCache.set(key, request);
  return request;
}

async function loadWikidataImage(name) {
  const key = String(name || "").trim().toLowerCase();
  if (!key) return "";
  if (state.wikidataImageCache.has(key)) return state.wikidataImageCache.get(key);

  const request = (async () => {
    const searchUrl = new URL(WIKIDATA_SEARCH_URL);
    searchUrl.searchParams.set("search", name);
    const search = await fetchJsonWithRetry(searchUrl, {}, 1);
    const id = search.search?.[0]?.id;
    if (!id) return "";

    const entity = await fetchJsonWithRetry(WIKIDATA_ENTITY_URL.replace("{id}", id), {}, 1);
    const file = entity.entities?.[id]?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;
    return file ? COMMONS_FILE_URL.replace("{file}", encodeURIComponent(file)) : "";
  })().catch(() => "");

  state.wikidataImageCache.set(key, request);
  const image = await request;
  state.wikidataImageCache.set(key, image);
  return image;
}

async function attachWikidataImage(person, name = person?.name) {
  if (!person || person.image || person.wikidataImage) return person;
  person.wikidataImage = await loadWikidataImage(name);
  return person;
}

async function searchWikidataEntities(query, limit = 6) {
  const key = `${String(query || "").trim().toLowerCase()}:${limit}`;
  if (!key || key === `:${limit}`) return [];
  if (state.wikidataSearchCache.has(key)) return state.wikidataSearchCache.get(key);

  const request = (async () => {
    const searchUrl = new URL(WIKIDATA_SEARCH_URL);
    searchUrl.searchParams.set("search", query);
    searchUrl.searchParams.set("limit", String(limit));
    const result = await fetchJsonWithRetry(searchUrl, {}, 1);
    return result.search || [];
  })().catch(() => []);

  state.wikidataSearchCache.set(key, request);
  const results = await request;
  state.wikidataSearchCache.set(key, results);
  return results;
}

async function loadWikidataEntity(id) {
  if (!id) return null;
  if (state.wikidataEntityCache.has(id)) return state.wikidataEntityCache.get(id);

  const request = fetchJsonWithRetry(WIKIDATA_ENTITY_URL.replace("{id}", id), {}, 1)
    .then((result) => result.entities?.[id] || null)
    .catch(() => null);

  state.wikidataEntityCache.set(id, request);
  const entity = await request;
  state.wikidataEntityCache.set(id, entity);
  return entity;
}

function wikidataLabel(entity) {
  return entity?.labels?.en?.value || "";
}

function wikidataEntityIdFromStatement(statement) {
  return statement?.mainsnak?.datavalue?.value?.id || "";
}

function wikidataDate(value) {
  const time = value?.time || value;
  if (!time) return null;
  const parsed = Date.parse(String(time).replace(/^\+/, ""));
  return Number.isNaN(parsed) ? null : parsed;
}

function wikidataQualifierDate(statement, property) {
  return wikidataDate(statement?.qualifiers?.[property]?.[0]?.datavalue?.value);
}

function currentWikidataStatements(entity, property) {
  const claims = (entity?.claims?.[property] || []).filter((statement) => statement.rank !== "deprecated");
  if (!claims.length) return [];
  const now = Date.now();
  const current = claims.filter((statement) => {
    const start = wikidataQualifierDate(statement, "P580");
    const end = wikidataQualifierDate(statement, "P582");
    if (start && start > now) return false;
    if (end && end < now) return false;
    return true;
  });
  const pool = current.length ? current : claims;
  return [...pool].sort((a, b) => {
    const rankScore = (statement) => (statement.rank === "preferred" ? 2 : statement.rank === "normal" ? 1 : 0);
    return rankScore(b) - rankScore(a) || (wikidataQualifierDate(b, "P580") || 0) - (wikidataQualifierDate(a, "P580") || 0);
  });
}

function wikidataClaimEntityIds(entity, property) {
  return currentWikidataStatements(entity, property)
    .map(wikidataEntityIdFromStatement)
    .filter(Boolean);
}

function wikidataFileFromEntity(entity, property = "P18") {
  return entity?.claims?.[property]?.[0]?.mainsnak?.datavalue?.value || "";
}

function wikidataImageFromEntity(entity) {
  const file = wikidataFileFromEntity(entity);
  return file ? COMMONS_FILE_URL.replace("{file}", encodeURIComponent(file)) : "";
}

async function wikidataPartyLabels(entity) {
  const ids = [...new Set(wikidataClaimEntityIds(entity, "P102"))];
  const labels = await Promise.all(
    ids.slice(0, 3).map(async (id) => wikidataLabel(await loadWikidataEntity(id)))
  );
  return labels.filter(Boolean);
}

function wikipediaTitleFromEntity(entity) {
  return entity?.sitelinks?.enwiki?.title || "";
}

async function loadMayorPartyFallback(mayor, geoid, profile) {
  if (!mayor?.name) return null;
  const stateAbbr = parsePlaceGeoid(geoid)?.state || "";
  const placeName = String(profile?.metadata?.display_name || profile?.metadata?.simple_name || profile?.metadata?.name || "")
    .split(",")[0]
    .replace(/\s+(city|town|village|borough|municipality|cdp)$/i, "")
    .trim();
  const cacheKey = `${mayor.name}:${placeName}:${stateAbbr}:${mayor.wikidataId || ""}:${mayor.wikipediaTitle || ""}`.toLowerCase();
  if (state.mayorPartyCache.has(cacheKey)) return state.mayorPartyCache.get(cacheKey);

  const params = new URLSearchParams({
    name: mayor.name,
    place: placeName,
    state: stateAbbr
  });
  if (mayor.wikidataId) params.set("wikidataId", mayor.wikidataId);
  if (mayor.wikipediaTitle) params.set("wikipediaTitle", mayor.wikipediaTitle);

  const request = fetchJsonWithRetry(`${MAYOR_PARTY_API}?${params.toString()}`, { cache: "no-cache" }, 1).catch(() => null);
  state.mayorPartyCache.set(cacheKey, request);
  const result = await request;
  state.mayorPartyCache.set(cacheKey, result);
  return result;
}

function normalizeNameForMatch(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function personNamesMatch(left, right) {
  const a = normalizeNameForMatch(left);
  const b = normalizeNameForMatch(right);
  if (!a || !b) return false;
  if (a === b || a.includes(b) || b.includes(a)) return true;
  const aParts = a.split(" ");
  const bParts = b.split(" ");
  return aParts[0]?.[0] === bParts[0]?.[0] && aParts.at(-1) === bParts.at(-1);
}

function placeQueryCandidates(geoid, profile) {
  const parsed = parsePlaceGeoid(geoid);
  const stateAbbr = parsed?.state || "";
  const stateName = STATE_ABBR_TO_NAME[stateAbbr] || "";
  const display = profile?.metadata?.display_name || "";
  const simple = profile?.metadata?.simple_name || profile?.metadata?.name || "";
  const firstPart = String(display || simple).split(",")[0].trim();
  return [
    display,
    firstPart,
    stateName && firstPart ? `${firstPart} ${stateName}` : "",
    stateName && simple ? `${simple} ${stateName}` : "",
    firstPart ? `${firstPart} city` : "",
    simple ? `${simple} city` : ""
  ].filter(Boolean);
}

function placeSearchScore(result, profile) {
  const label = String(result.label || "").toLowerCase();
  const description = String(result.description || "").toLowerCase();
  const simple = String(profile?.metadata?.simple_name || "").toLowerCase();
  let score = 0;
  if (simple && label === simple) score += 4;
  if (simple && label.includes(simple)) score += 2;
  if (/\b(city|town|village|municipality|borough|census-designated place|county seat)\b/.test(description)) score += 3;
  if (/\bUnited States\b/i.test(result.description || "")) score += 1;
  return score;
}

async function findWikidataPlaceEntity(geoid, profile) {
  const cacheKey = String(geoid || "");
  if (state.wikidataPlaceMayorCache.has(`${cacheKey}:place`)) return state.wikidataPlaceMayorCache.get(`${cacheKey}:place`);

  const request = (async () => {
    const seen = new Set();
    for (const query of placeQueryCandidates(geoid, profile)) {
      const results = await searchWikidataEntities(query, 8);
      const ranked = results
        .filter((result) => !seen.has(result.id))
        .map((result) => ({ result, score: placeSearchScore(result, profile) }))
        .sort((a, b) => b.score - a.score);

      for (const { result } of ranked.slice(0, 5)) {
        seen.add(result.id);
        const entity = await loadWikidataEntity(result.id);
        if (wikidataClaimEntityIds(entity, "P6").length) return { id: result.id, entity };
      }
    }
    return null;
  })();

  state.wikidataPlaceMayorCache.set(`${cacheKey}:place`, request);
  const entity = await request;
  state.wikidataPlaceMayorCache.set(`${cacheKey}:place`, entity);
  return entity;
}

async function findWikidataPersonEntity(name, profile) {
  const cacheKey = `${String(name || "").trim().toLowerCase()}:${String(profile?.metadata?.display_name || "").toLowerCase()}`;
  if (!name) return null;
  if (state.wikidataPersonCache.has(cacheKey)) return state.wikidataPersonCache.get(cacheKey);

  const request = (async () => {
    const placeName = profile?.metadata?.simple_name || String(profile?.metadata?.display_name || "").split(",")[0];
    const queries = [`${name} mayor ${placeName}`, `${name} politician`, name].filter(Boolean);
    const seen = new Set();
    for (const query of queries) {
      const results = await searchWikidataEntities(query, 6);
      for (const result of results) {
        if (seen.has(result.id)) continue;
        seen.add(result.id);
        if (!personNamesMatch(result.label, name)) continue;
        const entity = await loadWikidataEntity(result.id);
        if (entity?.claims?.P102 || entity?.claims?.P18 || entity?.claims?.P39) return { id: result.id, entity };
      }
    }
    return null;
  })();

  state.wikidataPersonCache.set(cacheKey, request);
  const entity = await request;
  state.wikidataPersonCache.set(cacheKey, entity);
  return entity;
}

async function mayorFromWikidataPlace(geoid, profile) {
  const cacheKey = String(geoid || "");
  if (state.wikidataPlaceMayorCache.has(cacheKey)) return state.wikidataPlaceMayorCache.get(cacheKey);

  const request = (async () => {
    const place = await findWikidataPlaceEntity(geoid, profile);
    const mayorId = wikidataClaimEntityIds(place?.entity, "P6")[0];
    if (!mayorId) return null;
    const mayorEntity = await loadWikidataEntity(mayorId);
    const partyLabels = await wikidataPartyLabels(mayorEntity);
    return {
      name: wikidataLabel(mayorEntity),
      party: partyLabels.join(", "),
      wikidataId: mayorId,
      wikidataImage: wikidataImageFromEntity(mayorEntity),
      wikipediaTitle: wikipediaTitleFromEntity(mayorEntity),
      sourceUrl: WIKIDATA_ENTITY_PAGE.replace("{id}", mayorId)
    };
  })().catch(() => null);

  state.wikidataPlaceMayorCache.set(cacheKey, request);
  const mayor = await request;
  state.wikidataPlaceMayorCache.set(cacheKey, mayor);
  return mayor;
}

async function enrichMayorWithOnlineParty(mayor, geoid, profile) {
  const wikidataMayor = await mayorFromWikidataPlace(geoid, profile);
  if (!mayor) {
    if (wikidataMayor && !wikidataMayor.party) {
      const fallback = await loadMayorPartyFallback(wikidataMayor, geoid, profile);
      if (fallback?.party) wikidataMayor.party = fallback.party;
      if (fallback?.sourceUrl) wikidataMayor.sourceUrl ||= fallback.sourceUrl;
      if (fallback?.wikipediaTitle) wikidataMayor.wikipediaTitle ||= fallback.wikipediaTitle;
    }
    return wikidataMayor;
  }

  const personMatch = await findWikidataPersonEntity(mayor.name, profile);
  if (personMatch?.entity) {
    const partyLabels = await wikidataPartyLabels(personMatch.entity);
    if (!mayor.party && partyLabels.length) mayor.party = partyLabels.join(", ");
    if (!mayor.wikidataImage) mayor.wikidataImage = wikidataImageFromEntity(personMatch.entity);
    mayor.wikidataId = personMatch.id;
    mayor.wikipediaTitle = wikipediaTitleFromEntity(personMatch.entity) || mayor.wikipediaTitle;
  }

  if (wikidataMayor && (!mayor.party || !mayor.wikidataImage) && personNamesMatch(mayor.name, wikidataMayor.name)) {
    if (!mayor.party) mayor.party = wikidataMayor.party;
    if (!mayor.wikidataImage) mayor.wikidataImage = wikidataMayor.wikidataImage;
    mayor.wikidataId ||= wikidataMayor.wikidataId;
    mayor.wikipediaTitle ||= wikidataMayor.wikipediaTitle;
    mayor.sourceUrl ||= wikidataMayor.sourceUrl;
  }

  const fallback = await loadMayorPartyFallback(mayor, geoid, profile);
  if (fallback?.party) mayor.party = fallback.party;
  if (fallback?.wikidataId) mayor.wikidataId ||= fallback.wikidataId;
  if (fallback?.wikipediaTitle) mayor.wikipediaTitle ||= fallback.wikipediaTitle;
  if (fallback?.sourceUrl) mayor.sourceUrl ||= fallback.sourceUrl;

  return mayor;
}

function parseCongressionalGeoid(geoid) {
  const id = String(geoid || "").replace("50000US", "");
  if (id.length < 4) return null;
  return {
    state: STATE_FIPS_TO_ABBR[id.slice(0, 2)],
    district: Number(id.slice(2))
  };
}

function getCongressRepresentative(geoid) {
  const parsed = parseCongressionalGeoid(geoid);
  if (!parsed?.state || !state.congressData) return null;

  for (const member of state.congressData) {
    const currentTerm = (member.terms || [])
      .filter((term) =>
        isCurrentCongressTerm(term) &&
        term?.type === "rep" &&
        term.state === parsed.state &&
        Number(term.district || 0) === parsed.district
      )
      .at(-1);
    if (currentTerm) return { ...member, currentTerm };
  }

  return null;
}

function isCurrentCongressTerm(term) {
  if (!term) return false;
  const now = Date.now();
  const start = roleDate(term.start);
  const end = roleDate(term.end);
  if (start && start > now) return false;
  if (end && end < now) return false;
  return true;
}

function getStateSenators(stateAbbr) {
  if (!stateAbbr || !state.congressData) return [];
  return state.congressData
    .map((member) => {
      const currentTerm = (member.terms || [])
        .filter((term) => isCurrentCongressTerm(term) && term?.type === "sen" && term.state === stateAbbr)
        .at(-1);
      return currentTerm ? { ...member, currentTerm } : null;
    })
    .filter(Boolean);
}

function cleanYamlValue(value = "") {
  return String(value)
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

function parseYamlPair(text) {
  const index = text.indexOf(":");
  if (index < 0) return null;
  return {
    key: text.slice(0, index).trim(),
    value: cleanYamlValue(text.slice(index + 1))
  };
}

function parseOpenStatesPerson(yaml) {
  const person = { roles: [], links: [] };
  let section = "";
  let currentRole = null;
  let currentLink = null;

  for (const rawLine of yaml.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (trimmed.startsWith("- ")) {
      if (section === "party" && trimmed.startsWith("- name:")) {
        person.party = cleanYamlValue(trimmed.slice("- name:".length));
        continue;
      }

      if (section === "roles") {
        currentRole = {};
        person.roles.push(currentRole);
        const pair = parseYamlPair(trimmed.slice(2));
        if (pair) currentRole[pair.key] = pair.value;
        continue;
      }

      if (section === "links") {
        currentLink = {};
        person.links.push(currentLink);
        const pair = parseYamlPair(trimmed.slice(2));
        if (pair) currentLink[pair.key] = pair.value;
        continue;
      }
    }

    const topLevel = !/^\s/.test(line);
    if (topLevel) {
      const pair = parseYamlPair(trimmed);
      if (!pair) continue;
      section = pair.key;
      currentRole = null;
      currentLink = null;
      if (pair.value) person[pair.key] = pair.value;
      continue;
    }

    if (section === "roles") {
      const pair = parseYamlPair(trimmed);
      if (pair && currentRole) currentRole[pair.key] = pair.value;
      continue;
    }

    if (section === "links") {
      const pair = parseYamlPair(trimmed);
      if (pair && currentLink) currentLink[pair.key] = pair.value;
    }
  }

  return person;
}

function roleDate(value) {
  const parsed = Date.parse(value || "");
  return Number.isNaN(parsed) ? null : parsed;
}

function isCurrentRole(role) {
  if (!role) return false;
  const now = Date.now();
  const start = roleDate(role.start_date);
  const end = roleDate(role.end_date);
  if (start && start > now) return false;
  if (end && end < now) return false;
  return true;
}

async function mapLimit(items, limit, worker) {
  const results = [];
  let index = 0;

  async function run() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await worker(items[current], current);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

async function loadOpenStatesDirectory(stateAbbr, urlTemplate, cache, errorMessage) {
  const key = String(stateAbbr || "").toLowerCase();
  if (!key) return [];
  if (cache.has(key)) return cache.get(key);

  const request = fetch(urlTemplate.replace("{state}", key))
    .then((response) => {
      if (!response.ok) throw new Error(errorMessage);
      return response.json();
    })
    .then(async (payload) => {
      const entries = Array.isArray(payload) ? payload : payload.entries || [];
      const files = entries.filter((entry) => entry.name?.endsWith(".yml") && entry.download_url);
      const people = await mapLimit(files, 8, async (file) => {
        const response = await fetch(file.download_url);
        if (!response.ok) return null;
        return parseOpenStatesPerson(await response.text());
      });
      const parsedPeople = people.filter(Boolean);
      cache.set(key, parsedPeople);
      return parsedPeople;
    })
    .catch((error) => {
      cache.delete(key);
      throw error;
    });

  cache.set(key, request);
  return request;
}

async function loadStateLegislatorData(stateAbbr) {
  return loadOpenStatesDirectory(
    stateAbbr,
    OPENSTATES_LEGISLATURE_URL,
    state.stateLegislatorCache,
    "OpenStates legislator data request failed"
  );
}

async function loadStateExecutiveData(stateAbbr) {
  return loadOpenStatesDirectory(
    stateAbbr,
    OPENSTATES_EXECUTIVE_URL,
    state.stateExecutiveCache,
    "OpenStates executive data request failed"
  );
}

async function loadMunicipalityData(stateAbbr) {
  return loadOpenStatesDirectory(
    stateAbbr,
    OPENSTATES_MUNICIPALITIES_URL,
    state.municipalityCache,
    "OpenStates municipality data request failed"
  );
}

function normalizeDistrict(value) {
  return String(value || "")
    .replace(/^0+(?=\d)/, "")
    .toUpperCase();
}

function parseStateGeoid(geoid) {
  const id = String(geoid || "").replace("04000US", "");
  return STATE_FIPS_TO_ABBR[id] || "";
}

function parseStateLegislativeGeoid(geoid, type = geographyForGeoid(geoid)) {
  const prefix = type.id === "stateHouse" ? "62000US" : "61000US";
  const id = String(geoid || "").replace(prefix, "");
  if (id.length < 3) return null;
  return {
    state: STATE_FIPS_TO_ABBR[id.slice(0, 2)],
    chamber: type.id === "stateHouse" ? "lower" : "upper",
    district: normalizeDistrict(id.slice(2))
  };
}

function findGovernor(people) {
  return (people || []).find((person) =>
    (person.roles || []).some((role) => role.type === "governor" && isCurrentRole(role))
  );
}

function findStateLegislator(geoid, type, people) {
  const parsed = parseStateLegislativeGeoid(geoid, type);
  if (!parsed?.state || !people) return null;

  for (const person of people) {
    const currentRole = (person.roles || []).find(
      (role) =>
        isCurrentRole(role) &&
        role.type === parsed.chamber &&
        normalizeDistrict(role.district) === parsed.district
    );
    if (currentRole) return { ...person, currentRole };
  }

  return null;
}

function getCachedStateLegislator(geoid, type = geographyForGeoid(geoid)) {
  const parsed = parseStateLegislativeGeoid(geoid, type);
  const people = parsed?.state ? state.stateLegislatorCache.get(parsed.state.toLowerCase()) : null;
  if (!Array.isArray(people)) return null;
  return findStateLegislator(geoid, type, people);
}

function parsePlaceGeoid(geoid) {
  const id = String(geoid || "").replace("16000US", "");
  if (id.length < 7) return null;
  return {
    state: STATE_FIPS_TO_ABBR[id.slice(0, 2)],
    placeCode: id.slice(2)
  };
}

function slugifyPlaceName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function placeNameCandidates(profile) {
  const names = [
    profile.metadata.display_name,
    profile.metadata.simple_name,
    profile.metadata.name
  ].filter(Boolean);
  const candidates = new Set();

  for (const name of names) {
    const firstPart = String(name).split(",")[0].trim();
    const variants = [
      firstPart,
      firstPart.replace(/\s+(city|town|village|borough|municipality|cdp)$/i, ""),
      firstPart.replace(/\s+\((balance|part)\)$/i, "")
    ];
    for (const variant of variants) {
      const slug = slugifyPlaceName(variant);
      if (slug) candidates.add(slug);
    }
  }

  return candidates;
}

function placeSlugFromJurisdiction(jurisdiction = "") {
  return jurisdiction.match(/\/place:([^/]+)\/government$/)?.[1] || "";
}

function findMayor(geoid, profile, people) {
  const parsed = parsePlaceGeoid(geoid);
  if (!parsed?.state || !people) return null;

  const candidates = placeNameCandidates(profile);
  for (const person of people) {
    const currentRole = (person.roles || []).find((role) => {
      if (role.type !== "mayor" || !isCurrentRole(role)) return false;
      const jurisdiction = String(role.jurisdiction || "");
      return (
        jurisdiction.includes(`/state:${parsed.state.toLowerCase()}/`) &&
        candidates.has(placeSlugFromJurisdiction(jurisdiction))
      );
    });
    if (currentRole) return { ...person, currentRole };
  }

  return null;
}

function placeOfficialOverride(geoid) {
  const override = PLACE_OFFICIAL_OVERRIDES[geoid];
  return override ? { ...override, links: override.sourceUrl ? [{ label: "Official website", url: override.sourceUrl }] : [] } : null;
}

function mergePlaceOfficial(liveOfficial, override) {
  if (!override) return liveOfficial;
  if (!liveOfficial) return override;
  return {
    ...liveOfficial,
    ...override,
    links: override.links?.length ? override.links : liveOfficial.links,
    sourceUrl: override.sourceUrl || liveOfficial.sourceUrl
  };
}

async function loadGeographyExtras(geoid, profile) {
  if (state.extrasCache.has(geoid)) return state.extrasCache.get(geoid);

  const type = geographyForGeoid(geoid);
  const extras = { type };

  if (type.id === "congressional") {
    try {
      await loadCongressData();
      extras.representative = getCongressRepresentative(geoid);
      if (extras.representative) {
        await attachWikidataImage(extras.representative, representativeName(extras.representative));
      }
      state.boundaryTileLayers.get(type.id)?.changed();
    } catch (error) {
      extras.representativeError = error.message;
    }
  }

  if (type.id === "state") {
    const stateAbbr = parseStateGeoid(geoid);
    if (stateAbbr) {
      const governorFallback = staticGovernorForState(stateAbbr);
      try {
        await loadCongressData();
        extras.senators = getStateSenators(stateAbbr).slice(0, 2);
        await Promise.all(extras.senators.map((senator) => attachWikidataImage(senator, representativeName(senator))));
      } catch (error) {
        extras.stateOfficialsError = error.message;
      }

      try {
        extras.governor = await loadLiveStateOfficials(stateAbbr);
      } catch (error) {
        extras.stateOfficialsError = [extras.stateOfficialsError, error.message].filter(Boolean).join("; ");
      }

      try {
        if (!extras.governor && !HAS_LOCAL_SERVER_PROXY) {
          extras.governor = governorFallback;
        }
        if (!extras.governor) {
          const people = await loadStateExecutiveData(stateAbbr);
          extras.governor = findGovernor(people);
        }
        extras.governor = mergeGovernorWithFallback(extras.governor, governorFallback, !HAS_LOCAL_SERVER_PROXY);
        await attachWikidataImage(extras.governor);
      } catch (error) {
        extras.governor = mergeGovernorWithFallback(extras.governor, governorFallback, !HAS_LOCAL_SERVER_PROXY);
        extras.stateOfficialsError = [extras.stateOfficialsError, error.message].filter(Boolean).join("; ");
      }
    }
  }

  if (type.id === "stateHouse" || type.id === "stateSenate") {
    const parsed = parseStateLegislativeGeoid(geoid, type);
    if (parsed?.state) {
      try {
        const people = await loadStateLegislatorData(parsed.state);
        extras.stateLegislator = findStateLegislator(geoid, type, people);
        await attachWikidataImage(extras.stateLegislator);
        state.boundaryTileLayers.get(type.id)?.changed();
      } catch (error) {
        extras.stateLegislatorError = error.message;
      }
    }
  }

  if (type.id === "place") {
    const parsed = parsePlaceGeoid(geoid);
    if (parsed?.state) {
      const override = placeOfficialOverride(geoid);
      try {
        const people = await loadMunicipalityData(parsed.state);
        extras.mayor = findMayor(geoid, profile, people);
      } catch (error) {
        extras.mayorError = error.message;
      }

      try {
        extras.mayor = await enrichMayorWithOnlineParty(extras.mayor, geoid, profile);
        await attachWikidataImage(extras.mayor);
      } catch (error) {
        extras.mayorError = [extras.mayorError, error.message].filter(Boolean).join("; ");
      }
      extras.mayor = mergePlaceOfficial(extras.mayor, override);
    }
  }

  if (type.id === "schoolDistrict") {
    try {
      const ratings = await loadSchoolRatings();
      extras.schoolRatings = ratings[geoid] || (await loadLiveSchoolRatings(geoid, profile));
    } catch {
      extras.schoolRatings = await loadLiveSchoolRatings(geoid, profile);
    }

    extras.externalLinks = mergeLinks(extras.schoolRatings?.externalLinks || [], schoolSourceLinks(profile, geoid));
  }

  if (type.id === "nation") {
    extras.nationalOfficials = NATIONAL_OFFICIALS.map((official) => ({ ...official }));
    await Promise.all(
      extras.nationalOfficials.map((official) =>
        attachWikidataImage(official, official.imageSearchName || official.name)
      )
    );
  }

  state.extrasCache.set(geoid, extras);
  return extras;
}

function paddedExtent(extent, padding = 0) {
  return [extent[0] - padding, extent[1] - padding, extent[2] + padding, extent[3] + padding];
}

function coordinateBounds(coordinates = []) {
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];
  for (const coordinate of coordinates) {
    if (!Array.isArray(coordinate)) continue;
    if (typeof coordinate[0] === "number" && typeof coordinate[1] === "number") {
      bounds[0] = Math.min(bounds[0], coordinate[0]);
      bounds[1] = Math.min(bounds[1], coordinate[1]);
      bounds[2] = Math.max(bounds[2], coordinate[0]);
      bounds[3] = Math.max(bounds[3], coordinate[1]);
      continue;
    }

    const child = coordinateBounds(coordinate);
    bounds[0] = Math.min(bounds[0], child[0]);
    bounds[1] = Math.min(bounds[1], child[1]);
    bounds[2] = Math.max(bounds[2], child[2]);
    bounds[3] = Math.max(bounds[3], child[3]);
  }
  return bounds;
}

function extentsIntersect(a, b) {
  return Number.isFinite(a[0]) && a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];
}

function extentGeometry(extent) {
  const [minX, minY, maxX, maxY] = extent;
  return {
    type: "Polygon",
    coordinates: [
      [
        [minX, minY],
        [maxX, minY],
        [maxX, maxY],
        [minX, maxY],
        [minX, minY]
      ]
    ]
  };
}

function clippedNationGeometry(geometry) {
  if (!geometry?.coordinates) return geometry;

  const target = paddedExtent(CONTIGUOUS_US_EXTENT, NATION_GEOMETRY_PADDING);
  if (geometry.type === "MultiPolygon") {
    const coordinates = geometry.coordinates.filter((polygon) =>
      extentsIntersect(coordinateBounds(polygon?.[0] || []), target)
    );
    return coordinates.length ? { ...geometry, coordinates } : extentGeometry(CONTIGUOUS_US_EXTENT);
  }

  if (geometry.type === "Polygon") {
    return extentsIntersect(coordinateBounds(geometry.coordinates?.[0] || []), target)
      ? geometry
      : extentGeometry(CONTIGUOUS_US_EXTENT);
  }

  return geometry;
}

function displayGeometryForGeoid(geoid, geometry) {
  return geoid === "01000US" ? clippedNationGeometry(geometry) : geometry;
}

async function loadLocalUrbanGeometry(geoid) {
  if (state.geometryCache.has(geoid)) return state.geometryCache.get(geoid);
  if (!state.boundaryGeojson) {
    state.boundaryGeojson = await fetchJsonWithRetry(BOUNDARY_URL, { cache: "force-cache" });
  }

  const area = areaByGeoid(geoid);
  const short = shortGeoid(geoid);
  const feature = state.boundaryGeojson.features.find(
    (item) => item.properties?.full_geoid === geoid || item.properties?.GEOID === short
  );
  if (!feature) throw new Error("Local merged boundary not found");

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        ...feature,
        properties: {
          ...(feature.properties || {}),
          full_geoid: geoid,
          GEOID: short,
          NAME: area?.name || feature.properties?.NAME || geoid
        }
      }
    ]
  };
  state.geometryCache.set(geoid, geojson);
  return geojson;
}

async function loadDetailedGeometry(geoid) {
  if (state.geometryCache.has(geoid)) return state.geometryCache.get(geoid);

  const indexArea = areaByGeoid(geoid);
  if (indexArea?.isMergedUrbanArea) return loadLocalUrbanGeometry(geoid);

  const url = new URL(`${CR_API}/geo/tiger2024/${geoid}`);
  url.search = new URLSearchParams({ geom: "true" }).toString();

  const response = await fetch(url);
  if (!response.ok) throw new Error("Detailed boundary request failed");
  const result = await response.json();
  const properties = result.properties || {};
  const profile = state.profileCache.get(geoid);
  if (profile?.metadata) {
    profile.metadata = {
      ...properties,
      ...profile.metadata
    };
    if (state.selectedGeoid === geoid) refreshSelectedProfile();
  }

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: displayGeometryForGeoid(geoid, result.geometry),
        properties: {
          ...properties,
          full_geoid: geoid,
          GEOID: shortGeoid(geoid),
          NAME: properties.display_name || properties.name || geoid
        }
      }
    ]
  };
  state.geometryCache.set(geoid, geojson);
  return geojson;
}

function fitGeoidFeature(geoid, feature) {
  const extent =
    geoid === "01000US"
      ? ol.proj.transformExtent(CONTIGUOUS_US_EXTENT, "EPSG:4326", map.getView().getProjection())
      : feature.getGeometry().getExtent();

  map.getView().fit(extent, {
    padding: [70, 70, 70, 70],
    maxZoom: geoid === "01000US" ? 4 : 10,
    duration: FIT_DURATION
  });
}

async function showSelectedGeometry(geoid, options = {}) {
  try {
    const geojson = await loadDetailedGeometry(geoid);
    if (state.selectedGeoid !== geoid) return null;

    const features = format.readFeatures(geojson, {
      featureProjection: map.getView().getProjection()
    });
    const feature = features[0];
    if (!feature) return null;

    feature.setId(shortGeoid(geoid));
    selectedSource.clear(true);
    selectedSource.addFeature(feature);
    urbanLayer.changed();
    state.activeBoundaryLayer?.changed();

    if (options.fit) {
      fitGeoidFeature(geoid, feature);
    }

    return feature;
  } catch {
    return null;
  }
}

function renderProfile(geoid, profile, extras = {}) {
  const indexArea = areaByGeoid(geoid);
  const metadata = profile.metadata;
  const metrics = profile.metrics;
  const type = extras.type || geographyForGeoid(geoid);
  const isMergedUrbanArea = Boolean(indexArea?.isMergedUrbanArea);
  const name = type.id === "urban" && indexArea?.name ? indexArea.name : metadata.display_name || indexArea?.name || geoid;
  const land = landSquareMiles(metadata, indexArea);
  const density = populationDensity(metadata, metrics, indexArea);
  const population = numericValue(metrics.population ?? metadata.population);
  const release = profile.detail.release?.name || state.index.release?.name || "Census Reporter latest ACS";
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const crUrl = `https://censusreporter.org/profiles/${geoid}-${slug}/`;
  const profileActions = isMergedUrbanArea
    ? `
        <button id="fit-selected" type="button">${escapeHtml(tr("Fit on map"))}</button>
      `
    : `
        <button id="fit-selected" type="button">${escapeHtml(tr("Fit on map"))}</button>
        <button id="show-full-profile" type="button">${escapeHtml(tr("Full profile and charts"))}</button>
        <a href="${crUrl}" target="_blank" rel="noreferrer">${escapeHtml(tr("Open Census Reporter"))}</a>
      `;
  const mergedComponents = isMergedUrbanArea
    ? `
      <section class="section">
        <h3>${escapeHtml(tr("Merged urban areas"))}</h3>
        <ul class="component-list">
          ${(indexArea.componentNames || []).map((component) => `<li>${escapeHtml(component)}</li>`).join("")}
        </ul>
      </section>
    `
    : "";
  const sourceNote = isMergedUrbanArea
    ? tr("This merged urban area is calculated locally by combining the listed Census/TIGER urban areas. Metrics are population-weighted where exact combined medians are not available.")
    : tr("Data comes from Census Reporter and the U.S. Census Bureau. The dot-density base map is served by Census Dots.");
  const fullProfileSection = isMergedUrbanArea
    ? ""
    : `
      <section class="section full-profile-section">
        <h3>${escapeHtml(tr("Full Census Reporter profile"))}</h3>
        <iframe
          class="full-profile-frame"
          src="${crUrl}"
          title="Full Census Reporter profile for ${escapeHtml(name)}"
          loading="lazy"
        ></iframe>
      </section>
    `;

  elements.profile.innerHTML = `
    <div class="profile-header">
      <h2>${escapeHtml(name)}</h2>
      <p class="profile-subtitle">${escapeHtml(translatedTypeLabel(type))} - ${escapeHtml(geoid)} - ${escapeHtml(release)}</p>
      <div class="headline-grid">
        ${stat("Population", number(population))}
        ${stat("Density", density == null ? tr("Not available") : `${decimal(density, 1)} / sq mi`, land == null ? "Land area not available" : tr("{count} square miles", { count: number(land) }))}
      </div>
      <div class="profile-actions">
        ${profileActions}
      </div>
    </div>

    ${mergedComponents}

    <section class="section">
      <h3>${escapeHtml(tr("Demographics"))}</h3>
      <div class="stat-grid">
        ${stat("Median age", decimal(metrics.medianAge, 1))}
        ${stat("Sex", `${pct(percentage(metrics.female, metrics.population))} ${tr("female")}`, `${pct(percentage(metrics.male, metrics.population))} ${tr("male")}`)}
        ${stat("Foreign-born population", pct(metrics.foreignBornRate), number(metrics.foreignBorn))}
        ${stat("Language other than English at home", pct(metrics.nonEnglishRate))}
      </div>
    </section>

    <section class="section">
      ${raceChart(metrics.race)}
    </section>

    ${geographyExtraSection(geoid, profile, extras)}

    <section class="section">
      <h3>${escapeHtml(tr("Economics"))}</h3>
      <div class="stat-grid">
        ${stat("Per capita income", currency(metrics.perCapitaIncome))}
        ${stat("Median household income", currency(metrics.medianHouseholdIncome))}
        ${stat("Poverty", pct(metrics.povertyRate), `${number(metrics.povertyCount)} ${tr("people")}`)}
        ${stat("Mean travel time to work", metrics.meanCommute == null ? tr("Not available") : `${decimal(metrics.meanCommute, 1)} ${tr("minutes")}`)}
      </div>
    </section>

    <section class="section">
      <h3>${escapeHtml(tr("Families & Housing"))}</h3>
      <div class="stat-grid">
        ${stat("Households", number(metrics.households))}
        ${stat("Persons per household", decimal(metrics.personsPerHousehold, 2))}
        ${stat("Housing units", number(metrics.housingUnits))}
        ${stat("Median owner-occupied value", currency(metrics.medianHomeValue))}
      </div>
    </section>

    <section class="section">
      <h3>${escapeHtml(tr("Social"))}</h3>
      <div class="stat-grid">
        ${stat("High school graduate or higher", pct(metrics.highSchoolRate))}
        ${stat("Bachelor's degree or higher", pct(metrics.bachelorsRate))}
      </div>
    </section>

    <p class="source-note">
      ${escapeHtml(sourceNote)}
    </p>

    ${fullProfileSection}
  `;

  document.querySelector("#fit-selected")?.addEventListener("click", () => fitSelectedArea(geoid));
  document.querySelector("#show-full-profile")?.addEventListener("click", () => {
    document.querySelector(".full-profile-section")?.scrollIntoView({ behavior: "smooth" });
  });
}

function renderHomeProfile() {
  const type = activeGeography();
  const overlay = OPPORTUNITY_BY_ID[state.opportunityOverlay] || state.policyOverlayById.get(state.opportunityOverlay) || null;
  const overlayLabel = overlay?.title || tr("Off");
  const release = state.index?.release?.name || "Census Reporter latest ACS";
  const boundaryStatus = state.areasVisible ? tr("Visible") : tr("Hidden");
  const dotsStatus = state.dotsVisible ? tr("Visible") : tr("Hidden");

  elements.profile.innerHTML = `
    <div class="profile-header home-profile">
      <h2>${escapeHtml(tr("Map home"))}</h2>
      <p class="profile-subtitle">${escapeHtml(translatedTypeLabel(type))} - ${escapeHtml(release)}</p>
      <div class="headline-grid">
        ${stat("Boundary type", escapeHtml(translatedTypeLabel(type)), tr("None selected"))}
        ${stat("Opportunity overlay", escapeHtml(overlayLabel), state.opportunityOverlay === "none" ? tr("Off") : tr("Active"))}
      </div>
    </div>
    <section class="section">
      <h3>${escapeHtml(tr("Map layers"))}</h3>
      <div class="stat-grid">
        ${stat("Census Dots", escapeHtml(dotsStatus))}
        ${stat(type.local ? "Urban area boundaries" : "Boundaries", escapeHtml(boundaryStatus))}
      </div>
    </section>
    <p class="source-note">${escapeHtml(tr("Use the search, directory, map boundaries, or Move Finder to open a geography profile."))}</p>
  `;
}

function renderLoading(area) {
  elements.profile.innerHTML = `
    <div class="loading-state">
      <h2>${escapeHtml(area?.name || tr("Loading urban areas..."))}</h2>
      <p>${escapeHtml(tr("Fetching Census Reporter profile data..."))}</p>
    </div>
  `;
}

function renderError(geoid, error) {
  elements.profile.innerHTML = `
    <div class="error-state">
      <h2>${escapeHtml(tr("Profile unavailable"))}</h2>
      <p>${escapeHtml(tr("Census Reporter did not return profile data for {geoid}.", { geoid }))}</p>
      <p class="stat-note">${escapeHtml(error.message)}</p>
    </div>
  `;
}

function pageUrlWithoutHash() {
  return `${window.location.pathname}${window.location.search}`;
}

function deselectArea(options = {}) {
  if (!state.selectedGeoid && !selectedSource.getFeatures().length) {
    if (options.renderHome !== false) renderHomeProfile();
    return;
  }

  state.selectedGeoid = null;
  state.selectedName = "";
  selectedSource.clear(true);
  elements.hover.hidden = true;
  urbanLayer.changed();
  state.activeBoundaryLayer?.changed();
  renderList();
  renderHomeProfile();

  if (!options.skipHash) {
    window.history.replaceState(null, "", pageUrlWithoutHash());
  }
}

async function selectArea(geoid, options = {}) {
  const type = geographyForGeoid(geoid);
  if (type.id !== state.activeGeography) {
    setActiveGeography(type.id, { keepSelection: true });
  }

  const previousSelectedName = state.selectedGeoid === geoid ? state.selectedName : "";
  state.selectedGeoid = geoid;
  const exampleName = type.example?.geoid === geoid ? type.example.name : "";
  state.selectedName = options.name || exampleName || previousSelectedName || "";
  selectedSource.clear(true);
  urbanLayer.changed();
  state.activeBoundaryLayer?.changed();
  renderList();

  if (!options.skipHash) {
    window.location.hash = `profile/${geoid}`;
  }

  const area = areaByGeoid(geoid) || { name: state.selectedName || geoid };
  renderLoading(area);

  showSelectedGeometry(geoid, { fit: options.fit !== false });

  try {
    const profile = await loadProfile(geoid);
    const extras = await loadGeographyExtras(geoid, profile);
    if (state.selectedGeoid === geoid) renderProfile(geoid, profile, extras);
  } catch (error) {
    if (state.selectedGeoid === geoid) renderError(geoid, error);
  }
}

async function fitSelectedArea(geoid) {
  let feature = selectedSource.getFeatures()[0];
  if (!feature || state.selectedGeoid !== geoid) {
    feature = await showSelectedGeometry(geoid, { fit: false });
  }

  if (feature) {
    fitGeoidFeature(geoid, feature);
    return;
  }

  const area = areaByGeoid(geoid);
  if (area?.center?.every((coordinate) => coordinate != null)) {
    map.getView().animate({
      center: ol.proj.fromLonLat(area.center),
      zoom: 9,
      duration: FIT_DURATION
    });
  }
}

function finderRaceOption() {
  return FINDER_RACE_OPTIONS.find((option) => option.id === state.finderRace) || FINDER_RACE_OPTIONS[3];
}

function isFinderActive() {
  return activeGeography().id === "urban" && ["percent", "count"].includes(state.finderSort);
}

function areaRaceShare(area, option = finderRaceOption()) {
  const race = area?.metrics?.race || {};
  return option.keys.reduce((sum, key) => sum + Number(race[key] || 0), 0);
}

function areaRaceCount(area, option = finderRaceOption()) {
  const population = Number(area?.metrics?.population || 0);
  return Math.round((population * areaRaceShare(area, option)) / 100);
}

function validFinderLimit(value) {
  const numeric = Number(value);
  return FINDER_LIMIT_OPTIONS.includes(numeric) ? numeric : 50;
}

function validFinderMinPopulation(value) {
  const numeric = Number(value);
  return FINDER_MIN_POP_OPTIONS.some((option) => option.value === numeric) ? numeric : 0;
}

function validFinderSort(value) {
  return FINDER_SORT_OPTIONS.some((option) => option.id === value) ? value : "directory";
}

function validFinderRace(value) {
  return FINDER_RACE_OPTIONS.some((option) => option.id === value) ? value : "hispanic";
}

function matchingAreas(options = {}) {
  const query = elements.search.value.trim().toLowerCase();
  const matches = query
    ? state.index.areas.filter((area) =>
        `${area.name} ${area.geoid} ${area.tigerGeoid} ${(area.aliases || []).join(" ")}`.toLowerCase().includes(query)
      )
    : state.index.areas.slice();
  if (options.limit === null) return matches;
  const limit = options.limit || (query ? 120 : 80);
  return matches.slice(0, limit);
}

function searchResultKey(type, query) {
  return `${type.sumlevel}:${query.trim().toLowerCase()}`;
}

function geographySearchQueries(query) {
  const trimmed = query.trim();
  const queries = [trimmed];
  const cityState = trimmed.match(/^(.+?)\s+([A-Za-z]{2})$/);
  if (cityState && !trimmed.includes(",")) {
    queries.push(`${cityState[1]}, ${cityState[2].toUpperCase()}`);
  }
  return [...new Set(queries)];
}

async function searchGeographies(query) {
  const type = activeGeography();
  const key = searchResultKey(type, query);
  if (state.searchCache.has(key)) return state.searchCache.get(key);

  let rows = [];
  for (const searchQuery of geographySearchQueries(query)) {
    const url = new URL(`${CR_API}/geo/search`);
    url.search = new URLSearchParams({ q: searchQuery, sumlevs: type.sumlevel }).toString();
    const result = await fetchJsonWithRetry(url);
    rows = result.results || [];
    if (rows.length) break;
  }

  state.searchCache.set(key, rows);
  return rows;
}

function renderSearchPrompt() {
  const type = activeGeography();
  const example = type.example;
  const typeLabel = lowerUiText(translatedTypeLabel(type));
  elements.list.innerHTML = `
    <button type="button" data-geoid="${example.geoid}" data-name="${escapeHtml(example.name)}" class="${example.geoid === state.selectedGeoid ? "active" : ""}">
      <span class="area-name">${escapeHtml(example.name)}</span>
      <span class="area-meta">${escapeHtml(tr("Example {type}", { type: typeLabel }))}</span>
    </button>
    <p class="list-hint">${escapeHtml(tr("Search by name or click a visible {type} boundary on the map.", { type: typeLabel }))}</p>
  `;
}

function renderSearchResults(results) {
  const type = activeGeography();
  if (!results.length) {
    elements.list.innerHTML = `<p class="list-hint">${escapeHtml(tr("No {plural} found. Try another name or code.", { plural: translatedTypePlural(type) }))}</p>`;
    return;
  }

  elements.list.innerHTML = results
    .map(
      (area) => `
      <button type="button" data-geoid="${area.full_geoid}" data-name="${escapeHtml(area.full_name)}" class="${area.full_geoid === state.selectedGeoid ? "active" : ""}">
        <span class="area-name">${escapeHtml(area.full_name)}</span>
        <span class="area-meta">${escapeHtml(area.full_geoid)}</span>
      </button>
    `
    )
    .join("");
}

function remoteSearchResultHtml(results) {
  const type = activeGeography();
  if (!results.length) {
    return `<p class="list-hint">${escapeHtml(tr("No {plural} found. Try another name or code.", { plural: translatedTypePlural(type) }))}</p>`;
  }

  return results
    .slice(0, 12)
    .map(
      (area) => `
      <button type="button" data-geoid="${area.full_geoid}" data-name="${escapeHtml(area.full_name)}" class="${area.full_geoid === state.selectedGeoid ? "active" : ""}">
        <span class="area-name">${escapeHtml(area.full_name)}</span>
        <span class="area-meta">${escapeHtml(area.full_geoid)}</span>
      </button>
    `
    )
    .join("");
}

function localSearchResultHtml(areas) {
  if (!areas.length) {
    return `<p class="list-hint">${escapeHtml(tr("No urban areas match those filters."))}</p>`;
  }

  return areas
    .slice(0, 12)
    .map(
      (area) => `
      <button type="button" data-geoid="${area.geoid}" class="${area.geoid === state.selectedGeoid ? "active" : ""}">
        <span class="area-name">${escapeHtml(area.name)}</span>
        <span class="area-meta">${number(area.metrics.population)} ${tr("people")} - ${area.density == null ? tr("density unavailable") : `${decimal(area.density, 1)} / sq mi`}</span>
      </button>
    `
    )
    .join("");
}

function finderSearchResultHtml(rows) {
  const option = finderRaceOption();
  if (!rows.length) {
    return `<p class="list-hint">${escapeHtml(tr("No urban areas match those filters."))}</p>`;
  }

  const maxCount = Math.max(...rows.map((row) => row.count), 1);
  return rows
    .slice(0, 12)
    .map((row, index) => {
      const fill = state.finderSort === "count" ? Math.max(2, (row.count / maxCount) * 100) : Math.max(2, row.share);
      const primary = state.finderSort === "count" ? number(row.count) : pct(row.share);
      const secondary = state.finderSort === "count" ? pct(row.share) : `${number(row.count)} ${tr("people")}`;
      return `
        <button type="button" data-geoid="${row.area.geoid}" class="finder-result ${row.area.geoid === state.selectedGeoid ? "active" : ""}">
          <span class="area-name"><span class="finder-rank">#${index + 1}</span>${escapeHtml(row.area.name)}</span>
          <span class="finder-metric">
            <strong>${escapeHtml(primary)}</strong>
            <span>${escapeHtml(tr(option.label))} - ${escapeHtml(secondary)}</span>
          </span>
          <span class="finder-bar" aria-hidden="true"><span style="width:${Math.min(100, fill)}%; background:${escapeHtml(option.color)}"></span></span>
          <span class="area-meta">${escapeHtml(number(row.area.metrics.population))} ${escapeHtml(tr("people"))} - ${row.area.density == null ? escapeHtml(tr("density unavailable")) : `${escapeHtml(decimal(row.area.density, 1))} / sq mi`}</span>
        </button>
      `;
    })
    .join("");
}

function setInlineSearchResults(html = "", hidden = false) {
  if (!elements.searchResults) return;
  elements.searchResults.hidden = hidden;
  elements.searchResults.innerHTML = hidden ? "" : html;
}

function hideInlineSearchResults() {
  setInlineSearchResults("", true);
}

function renderInlineLocalSearchResults() {
  const query = elements.search.value.trim();
  if (!query) {
    hideInlineSearchResults();
    return;
  }

  const html = isFinderActive()
    ? finderSearchResultHtml(rankedFinderAreas())
    : localSearchResultHtml(matchingAreas({ limit: 12 }));
  setInlineSearchResults(html);
}

let searchDebounce = 0;

function scheduleSearch() {
  clearTimeout(searchDebounce);
  const query = elements.search.value.trim();
  if (!query) {
    hideInlineSearchResults();
    renderSearchPrompt();
    return;
  }

  elements.list.innerHTML = `<p class="list-hint">${escapeHtml(tr("Searching {plural}...", { plural: translatedTypePlural(activeGeography()) }))}</p>`;
  setInlineSearchResults(`<p class="list-hint">${escapeHtml(tr("Searching {plural}...", { plural: translatedTypePlural(activeGeography()) }))}</p>`);
  const typeId = activeGeography().id;
  searchDebounce = setTimeout(async () => {
    try {
      const results = await searchGeographies(query);
      if (elements.search.value.trim() === query && activeGeography().id === typeId) {
        renderSearchResults(results);
        setInlineSearchResults(remoteSearchResultHtml(results));
      }
    } catch (error) {
      elements.list.innerHTML = `<p class="list-hint">${escapeHtml(tr("Search failed: {message}", { message: error.message }))}</p>`;
      setInlineSearchResults(`<p class="list-hint">${escapeHtml(tr("Search failed: {message}", { message: error.message }))}</p>`);
    }
  }, 180);
}

function populateFinderControls() {
  elements.finderSort.innerHTML = FINDER_SORT_OPTIONS.map(
    (option) => `<option value="${option.id}">${escapeHtml(tr(option.label))}</option>`
  ).join("");
  elements.finderRace.innerHTML = FINDER_RACE_OPTIONS.map(
    (option) => `<option value="${option.id}">${escapeHtml(tr(option.label))}</option>`
  ).join("");
  elements.finderMinPopulation.innerHTML = FINDER_MIN_POP_OPTIONS.map(
    (option) => `<option value="${option.value}">${escapeHtml(tr(option.label))}</option>`
  ).join("");
  elements.finderLimit.innerHTML = FINDER_LIMIT_OPTIONS.map(
    (limit) => `<option value="${limit}">${escapeHtml(number(limit))}</option>`
  ).join("");
  elements.finderSort.value = state.finderSort;
  elements.finderRace.value = state.finderRace;
  elements.finderMinPopulation.value = String(state.finderMinPopulation);
  elements.finderLimit.value = String(state.finderLimit);
  updateFinderControls();
}

function updateFinderControls() {
  const type = activeGeography();
  const translatedLabel = translatedTypeLabel(type);
  const translatedPlural = translatedTypePlural(type);
  elements.finder.hidden = false;
  elements.finderSort.value = state.finderSort;
  elements.finderRace.value = state.finderRace;
  elements.finderMinPopulation.value = String(state.finderMinPopulation);
  elements.finderLimit.value = String(state.finderLimit);

  if (isFinderActive()) {
    elements.search.placeholder = tr("Filter ranked urban areas by name or code");
    elements.search.previousElementSibling.textContent = tr("Filter ranked urban areas");
  } else {
    elements.search.placeholder = type.local
      ? tr("Search by city, state, or code")
      : tr("Search {plural} by name or code", { plural: translatedPlural });
    elements.search.previousElementSibling.textContent = tr("Find a {type}", { type: lowerUiText(translatedLabel) });
  }

  const option = finderRaceOption();
  if (!isFinderActive()) {
    elements.finderSummary.textContent =
      type.id === "urban" || state.finderSort === "directory"
        ? tr("Use this to rank urban areas by the largest raw number or percentage of a selected race or ethnicity.")
        : tr("Move Finder ranks urban areas. Switch Boundary type to Urban area to use the selected ranking.");
    return;
  }

  const method = state.finderSort === "count" ? tr("raw number") : tr("percentage");
  const minimum =
    state.finderMinPopulation > 0
      ? tr(" Minimum population: {count}.", { count: number(state.finderMinPopulation) })
      : "";
  const scope = activeGeography().id === "urban" ? "" : ` ${tr("Clicking a result switches to urban areas.")}`;
  elements.finderSummary.textContent = `${tr("Ranking by {label} {method}.", { label: tr(option.label), method })}${minimum}${scope}`;
}

function setFinderSetting(key, value) {
  if (key === "sort") {
    state.finderSort = validFinderSort(value);
    localStorage.setItem("censusMapFinderSort", state.finderSort);
  } else if (key === "race") {
    state.finderRace = validFinderRace(value);
    localStorage.setItem("censusMapFinderRace", state.finderRace);
  } else if (key === "minPopulation") {
    state.finderMinPopulation = validFinderMinPopulation(value);
    localStorage.setItem("censusMapFinderMinPopulation", String(state.finderMinPopulation));
  } else if (key === "limit") {
    state.finderLimit = validFinderLimit(value);
    localStorage.setItem("censusMapFinderLimit", String(state.finderLimit));
  }
  updateFinderControls();
  renderList();
}

function resetFinder() {
  state.finderSort = "directory";
  state.finderRace = "hispanic";
  state.finderMinPopulation = 0;
  state.finderLimit = 50;
  localStorage.setItem("censusMapFinderSort", state.finderSort);
  localStorage.setItem("censusMapFinderRace", state.finderRace);
  localStorage.setItem("censusMapFinderMinPopulation", String(state.finderMinPopulation));
  localStorage.setItem("censusMapFinderLimit", String(state.finderLimit));
  updateFinderControls();
  renderList();
}

function rankedFinderAreas() {
  const option = finderRaceOption();
  const candidates = matchingAreas({ limit: null })
    .filter((area) => Number(area?.metrics?.population || 0) >= state.finderMinPopulation)
    .map((area) => {
      const share = areaRaceShare(area, option);
      const count = areaRaceCount(area, option);
      return { area, share, count };
    })
    .filter((row) => Number.isFinite(row.share) && Number.isFinite(row.count));

  const sortKey = state.finderSort === "count" ? "count" : "share";
  candidates.sort((a, b) => b[sortKey] - a[sortKey] || b.area.metrics.population - a.area.metrics.population || a.area.name.localeCompare(b.area.name));
  return candidates.slice(0, state.finderLimit);
}

function renderFinderList() {
  const option = finderRaceOption();
  const rows = rankedFinderAreas();
  elements.listTitle.textContent = tr("Ranked urban areas");

  if (!rows.length) {
    elements.list.innerHTML = `<p class="list-hint">${escapeHtml(tr("No urban areas match those filters."))}</p>`;
    return;
  }

  const maxCount = Math.max(...rows.map((row) => row.count), 1);
  elements.list.innerHTML = rows
    .map((row, index) => {
      const fill = state.finderSort === "count" ? Math.max(2, (row.count / maxCount) * 100) : Math.max(2, row.share);
      const primary = state.finderSort === "count" ? number(row.count) : pct(row.share);
      const secondary = state.finderSort === "count" ? pct(row.share) : `${number(row.count)} ${tr("people")}`;
      return `
        <button type="button" data-geoid="${row.area.geoid}" class="finder-result ${row.area.geoid === state.selectedGeoid ? "active" : ""}">
          <span class="area-name"><span class="finder-rank">#${index + 1}</span>${escapeHtml(row.area.name)}</span>
          <span class="finder-metric">
            <strong>${escapeHtml(primary)}</strong>
            <span>${escapeHtml(tr(option.label))} - ${escapeHtml(secondary)}</span>
          </span>
          <span class="finder-bar" aria-hidden="true"><span style="width:${Math.min(100, fill)}%; background:${escapeHtml(option.color)}"></span></span>
          <span class="area-meta">${escapeHtml(number(row.area.metrics.population))} ${escapeHtml(tr("people"))} - ${row.area.density == null ? escapeHtml(tr("density unavailable")) : `${escapeHtml(decimal(row.area.density, 1))} / sq mi`}</span>
        </button>
      `;
    })
    .join("");
}

function renderList() {
  if (!state.index) return;

  updateFinderControls();
  if (isFinderActive()) {
    renderInlineLocalSearchResults();
    renderFinderList();
    return;
  }

  if (!activeGeography().local) {
    elements.listTitle.textContent = tr("Directory");
    scheduleSearch();
    return;
  }

  elements.listTitle.textContent = tr("Urban Area Directory");
  renderInlineLocalSearchResults();
  const areas = matchingAreas();
  elements.list.innerHTML = areas
    .map(
      (area) => `
      <button type="button" data-geoid="${area.geoid}" class="${area.geoid === state.selectedGeoid ? "active" : ""}">
        <span class="area-name">${escapeHtml(area.name)}</span>
        <span class="area-meta">${number(area.metrics.population)} ${tr("people")} - ${area.density == null ? tr("density unavailable") : `${decimal(area.density, 1)} / sq mi`}</span>
      </button>
    `
    )
    .join("");
}

function populateGeographySelect() {
  elements.geography.innerHTML = GEOGRAPHY_TYPES.map(
    (type) => `<option value="${type.id}">${escapeHtml(translatedTypeLabel(type))}</option>`
  ).join("");
}

function populateOpportunitySelect() {
  const options = ['<option value="none">Off</option>'];
  for (const type of ["outcome", "characteristic"]) {
    const label = type === "outcome" ? "Outcomes" : "Neighborhood characteristics";
    const rows = OPPORTUNITY_OVERLAYS.filter((overlay) => overlay.type === type)
      .map((overlay) => `<option value="${overlay.id}">${escapeHtml(overlay.title)}</option>`)
      .join("");
    options.push(`<optgroup label="${escapeHtml(label)}">${rows}</optgroup>`);
  }
  const policyGroups = new Map();
  for (const overlay of policyOverlays()) {
    const group = overlay.group || "Policy overlays";
    if (!policyGroups.has(group)) policyGroups.set(group, []);
    policyGroups.get(group).push(overlay);
  }
  for (const [group, overlays] of policyGroups) {
    const rows = overlays
      .map((overlay) => `<option value="${escapeHtml(overlay.id)}">${escapeHtml(overlay.title)}</option>`)
      .join("");
    options.push(`<optgroup label="${escapeHtml(group)}">${rows}</optgroup>`);
  }
  elements.opportunity.innerHTML = options.join("");
  elements.opportunity.value = state.opportunityOverlay;
}

function populateLanguageSelect() {
  elements.language.innerHTML = LANGUAGES.map(
    (language) => `<option value="${language.code}">${escapeHtml(language.label)}</option>`
  ).join("");
  elements.language.value = state.language;
}

function renderLegend() {
  elements.legend.innerHTML = `
    <h2>${escapeHtml(tr("Census Dots legend"))}</h2>
    <p class="legend-subtitle">${escapeHtml(tr("Colors show the race or ethnicity category used by Census Dots."))}</p>
    <div class="legend-list">
      ${DOT_LEGEND.map(
        (item) => `
          <div class="legend-item">
            <span class="legend-dot" style="background:${item.color}"></span>
            <span>${escapeHtml(tr(item.label))}</span>
          </div>
        `
      ).join("")}
    </div>
    <p class="legend-note">${escapeHtml(tr("One dot represents one person counted in the 2020 Census."))}</p>
  `;
}

function applyLanguageChrome() {
  document.documentElement.lang = languageConfig().code;
  document.documentElement.dir = RTL_LANGUAGES.has(state.language) ? "rtl" : "ltr";
  document.title = tr("Urban Area Census Dots Map");
  elements.language.value = state.language;
  document.querySelector('label[for="geography-type"]').textContent = tr("Boundary type");
  document.querySelector('label[for="opportunity-overlay"]').textContent = tr("Opportunity Atlas overlay");
  document.querySelector('label[for="language-select"]').textContent = tr("Language");
  document.querySelector('label[for="base-map"] span').textContent = tr("Base");
  document.querySelector('label[for="finder-sort"]').textContent = tr("Sort urban areas by");
  document.querySelector('label[for="finder-race"]').textContent = tr("Race or ethnicity");
  document.querySelector('label[for="finder-min-pop"] span').textContent = tr("Minimum population");
  document.querySelector('label[for="finder-limit"] span').textContent = tr("Results");
  document.querySelector(".finder-heading h2").textContent = tr("Move Finder");
  elements.finderReset.textContent = tr("Reset");
  elements.listTitle.textContent = tr("Directory");
  document.querySelector(".map-toolbar").setAttribute("aria-label", tr("Map controls"));
  elements.zoomUs.title = tr("Zoom to the United States");
  elements.toggleDots.title = tr("Show or hide Census Dots background");
  elements.toggleAreas.title = tr("Show or hide boundaries");
  elements.baseMap.querySelector('option[value="reporter"]').textContent = tr("Census Reporter");
  elements.baseMap.querySelector('option[value="googleSatellite"]').textContent = tr("Google Satellite");
  elements.baseMap.querySelector('option[value="google3d"]').textContent = tr("Google 3D");
  elements.zoomUs.textContent = tr("US");
  elements.toggleDots.textContent = tr("Dots");
  renderLegend();
}

function updateGeographyChrome() {
  const type = activeGeography();
  const translatedLabel = translatedTypeLabel(type);
  const translatedPlural = translatedTypePlural(type);
  const pluralTitle = titleUiText(translatedPlural);
  elements.geography.value = type.id;
  elements.search.placeholder = type.local
    ? tr("Search by city, state, or code")
    : tr("Search {plural} by name or code", { plural: translatedPlural });
  elements.search.previousElementSibling.textContent = tr("Find a {type}", { type: lowerUiText(translatedLabel) });
  elements.mapTitle.textContent = pluralTitle;
  elements.mapSubtitle.textContent = tr("{type} profiles over Census Dots population tiles", { type: translatedLabel });
  elements.count.textContent = type.local
    ? tr("{count} urban areas", { count: number(state.index?.count) })
    : tr("Showing {plural}", { plural: translatedPlural });
  elements.release.textContent = state.index?.release?.name || "";
  elements.toggleAreas.textContent = type.local ? tr("Areas") : tr("Boundaries");
  updateFinderControls();
}

function refreshSelectedProfile() {
  if (!state.selectedGeoid) return;
  const profile = state.profileCache.get(state.selectedGeoid);
  if (profile) {
    renderProfile(state.selectedGeoid, profile, state.extrasCache.get(state.selectedGeoid) || {});
  }
}

function setLanguage(code) {
  state.language = LANGUAGES.some((language) => language.code === code) ? code : "en";
  localStorage.setItem("censusMapLanguage", state.language);
  populateGeographySelect();
  populateFinderControls();
  applyLanguageChrome();
  updateGeographyChrome();
  renderOpportunityLegend();
  renderList();
  if (state.selectedGeoid) refreshSelectedProfile();
  else renderHomeProfile();
}

function setActiveGeography(id, options = {}) {
  const next = GEOGRAPHY_BY_ID[id] || GEOGRAPHY_BY_ID.urban;
  const previousLayer = visibleBoundaryLayer();

  state.activeGeography = next.id;
  previousLayer?.setVisible(false);

  if (next.local) {
    state.activeBoundaryLayer = null;
    urbanLayer.setVisible(state.areasVisible);
    setTimeout(loadBoundaryOverlay, 0);
  } else {
    urbanLayer.setVisible(false);
    state.activeBoundaryLayer = boundaryTileLayerFor(next);
    state.activeBoundaryLayer.setVisible(state.areasVisible);
    if (next.id === "congressional") {
      loadCongressData()
        .then(() => state.activeBoundaryLayer?.changed())
        .catch(() => {});
    }
  }

  if (!options.keepSelection) {
    state.selectedGeoid = null;
    state.selectedName = "";
    selectedSource.clear(true);
    renderHomeProfile();
    window.history.replaceState(null, "", pageUrlWithoutHash());
  }

  updateGeographyChrome();
  renderList();
}

function resetView() {
  map.getView().animate({
    center: ol.proj.fromLonLat([-98.58, 39.83]),
    zoom: 4,
    duration: FIT_DURATION
  });
}

map.on("singleclick", (event) => {
  const boundaryLayer = visibleBoundaryLayer();
  const feature = map.forEachFeatureAtPixel(
    event.pixel,
    (item) => item,
    { layerFilter: (layer) => layer === selectedLayer || layer === boundaryLayer, hitTolerance: 5 }
  );

  if (feature) {
    selectArea(fullGeoidFromFeature(feature), { fit: false, name: displayNameFromFeature(feature) });
  } else {
    deselectArea();
  }
});

map.on("pointermove", (event) => {
  if (event.dragging) return;

  const boundaryLayer = visibleBoundaryLayer();
  const feature = map.forEachFeatureAtPixel(
    event.pixel,
    (item) => item,
    { layerFilter: (layer) => layer === selectedLayer || layer === boundaryLayer, hitTolerance: 5 }
  );

  map.getTargetElement().style.cursor = feature ? "pointer" : "";

  if (!feature) {
    elements.hover.hidden = true;
    return;
  }

  const geoid = fullGeoidFromFeature(feature);
  const area = areaByGeoid(geoid);
  const hoverMeta =
    area?.metrics?.population != null
      ? tr("{count} people - click for profile", { count: number(area.metrics.population) })
      : tr("{geoid} - click for profile", { geoid });
  elements.hover.innerHTML = `
    <strong>${escapeHtml(area?.name || displayNameFromFeature(feature))}</strong>
    <span>${escapeHtml(hoverMeta)}</span>
  `;
  elements.hover.style.left = `${event.pixel[0] + 14}px`;
  elements.hover.style.top = `${event.pixel[1] + 14}px`;
  elements.hover.hidden = false;
});

map.on("moveend", () => {
  if (state.baseMap === "google3d") syncGoogle3dCamera(0.25);
});

function selectButtonGeography(button) {
  if (button) selectArea(button.dataset.geoid, { name: button.dataset.name || "" });
}

function handleGeographyListClick(event) {
  const button = event.target.closest("button[data-geoid]");
  selectButtonGeography(button);
}

elements.search.addEventListener("input", renderList);
elements.search.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  if (!elements.search.value.trim()) return;
  const button = elements.searchResults?.querySelector("button[data-geoid]") || elements.list.querySelector("button[data-geoid]");
  if (!button) return;
  event.preventDefault();
  selectButtonGeography(button);
});
elements.searchResults?.addEventListener("click", handleGeographyListClick);
elements.list.addEventListener("click", handleGeographyListClick);
elements.geography.addEventListener("change", () => setActiveGeography(elements.geography.value));
elements.opportunity.addEventListener("change", () => setOpportunityOverlay(elements.opportunity.value));
elements.language.addEventListener("change", () => setLanguage(elements.language.value));
elements.finderSort.addEventListener("change", () => setFinderSetting("sort", elements.finderSort.value));
elements.finderRace.addEventListener("change", () => setFinderSetting("race", elements.finderRace.value));
elements.finderMinPopulation.addEventListener("change", () => setFinderSetting("minPopulation", elements.finderMinPopulation.value));
elements.finderLimit.addEventListener("change", () => setFinderSetting("limit", elements.finderLimit.value));
elements.finderReset.addEventListener("click", resetFinder);
elements.baseMap.addEventListener("change", () => {
  setBaseMap(elements.baseMap.value).catch((error) => {
    setGoogleMapStatus(`Google map view failed. ${error.message}`);
  });
});
elements.zoomUs.addEventListener("click", resetView);
elements.toggleDots.addEventListener("click", () => {
  state.dotsVisible = !state.dotsVisible;
  dotsLayer.setVisible(state.dotsVisible);
  elements.toggleDots.setAttribute("aria-pressed", String(state.dotsVisible));
  if (!state.selectedGeoid) renderHomeProfile();
});
elements.toggleAreas.addEventListener("click", () => {
  state.areasVisible = !state.areasVisible;
  visibleBoundaryLayer()?.setVisible(state.areasVisible);
  elements.toggleAreas.setAttribute("aria-pressed", String(state.areasVisible));
  if (!state.selectedGeoid) renderHomeProfile();
});

window.addEventListener("hashchange", () => {
  const match = window.location.hash.match(/^#profile\/(\d{5}US[A-Za-z0-9]*)$/);
  if (match && match[1] !== state.selectedGeoid) {
    selectArea(match[1], { skipHash: true, fit: true });
  } else if (!match && state.selectedGeoid) {
    deselectArea({ skipHash: true });
  }
});
window.addEventListener("resize", () => {
  const preferred = Number(localStorage.getItem("censusMapPanelWidth") || state.panelWidth || PANEL_DEFAULT_WIDTH);
  setPanelWidth(preferred, { persist: false });
});

async function init() {
  if (!LANGUAGES.some((language) => language.code === state.language)) state.language = "en";
  state.baseMap = normalizedBaseMap(state.baseMap);
  state.finderSort = validFinderSort(state.finderSort);
  state.finderRace = validFinderRace(state.finderRace);
  state.finderMinPopulation = validFinderMinPopulation(state.finderMinPopulation);
  state.finderLimit = validFinderLimit(state.finderLimit);
  initializePanelResize();
  elements.baseMap.value = state.baseMap;
  populateGeographySelect();
  populateLanguageSelect();
  populateFinderControls();
  try {
    await loadPolicyOverlayCatalog();
  } catch (error) {
    console.warn("Policy overlay catalog failed to load", error);
  }
  populateOpportunitySelect();
  applyLanguageChrome();
  renderOpportunityLegend();
  elements.toggleDots.setAttribute("aria-pressed", "true");
  elements.toggleAreas.setAttribute("aria-pressed", "true");
  setBaseMap(state.baseMap, { persist: false }).catch((error) => {
    setGoogleMapStatus(`Google map view failed. ${error.message}`);
  });

  state.index = await fetchJsonWithRetry("data/urban-areas.json?v=20260509-louisville-name", { cache: "force-cache" });

  updateGeographyChrome();
  setTimeout(loadBoundaryOverlay, 0);

  const match = window.location.hash.match(/^#profile\/(\d{5}US[A-Za-z0-9]*)$/);
  if (match) selectArea(match[1], { skipHash: true, fit: true });
  else {
    renderHomeProfile();
    renderList();
  }
}

init().catch((error) => {
  elements.profile.innerHTML = `
    <div class="error-state">
      <h2>${escapeHtml(tr("Could not start the map"))}</h2>
      <p>${escapeHtml(error.message)}</p>
    </div>
  `;
});
