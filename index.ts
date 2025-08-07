export interface EventData {
  model_name: "gemma3:1b" | "gemma3:4b" | "gemma3:27b";
  event: {
    text: string;
    year: number;
    date: string;
    primary_category: "Military & Warfare" | "Politics & Government" | "Science & Technology" | "Arts & Culture" | "Disasters & Accidents" | "Sports & Recreation" | "Economics & Business" | "Religion & Philosophy";
    violence_level: "peaceful" | "violent" | "catastrophic";
    scale: "local" | "national" | "international" | "global";
    human_impact: "individual" | "small group" | "mass population";
    continental: "North America" | "South America" | "Europe" | "Asia" | "Africa" | "Oceania";
    cultural_region: "Western" | "Eastern" | "Middle Eastern" | "African" | "Latin American";
    development_status: "developed" | "developing";
    colonial_status: "colonial" | "independent";
    century: "Pre-1500" | "1500-1699" | "1700-1799" | "1800-1899" | "1900-1999" | "2000+";
    decade: "1500s" | "1510s" | "1520s" | "1530s" | "1540s" | "1550s" | "1560s" | "1570s" | "1580s" | "1590s" | "1600s" | "1610s" | "1620s" | "1630s" | "1640s" | "1650s" | "1660s" | "1670s" | "1680s" | "1690s" | "1700s" | "1710s" | "1720s" | "1730s" | "1740s" | "1750s" | "1760s" | "1770s" | "1780s" | "1790s" | "1800s" | "1810s" | "1820s" | "1830s" | "1840s" | "1850s" | "1860s" | "1870s" | "1880s" | "1890s" | "1900s" | "1910s" | "1920s" | "1930s" | "1940s" | "1950s" | "1960s" | "1970s" | "1980s" | "1990s" | "2000s" | "2010s" | "2020s";
    seasonal: "Winter" | "Spring" | "Summer" | "Fall";
    historical_period: "Ancient" | "Medieval" | "Renaissance" | "Industrial" | "Modern" | "Contemporary";
  };
  question: string;
  model_response: string;
  extracted_year: number;
  is_correct: boolean;
  confidence_score: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SmartFilterLogic {
  dependencies?: string[];
  suggestions?: string[];
}

export interface FilterGroupConfig {
  id: string;
  icon: string;
  title: string;
  description: string;
  filters: Record<string, string[]>;
  smartLogic?: SmartFilterLogic;
}

export interface CategoryStats {
  category: string;
  accuracy: number;
  count: number;
  avgConfidence: number;
}

export interface DistributionData {
  range: string;
  count: number;
  percentage: number;
}

export interface TimelineData {
  period: string;
  accuracy: number;
  count: number;
}

export interface AppStats {
  accuracy: number;
  totalEvents: number;
  avgConfidence: number;
}

export interface ChartData {
  categoryAccuracy: CategoryStats[];
  confidenceDistribution: DistributionData[];
  timelineData: TimelineData[];
}

