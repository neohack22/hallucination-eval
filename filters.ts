import { FilterGroupConfig } from '../types';

export const FILTER_GROUPS: FilterGroupConfig[] = [
  {
    id: "geographic",
    icon: "📍",
    title: "Geographic Analysis",
    description: "Filter by continental regions and cultural contexts",
    filters: {
      continental: ["North America", "South America", "Europe", "Asia", "Africa", "Oceania"],
      cultural_region: ["Western", "Eastern", "Middle Eastern", "African", "Latin American"],
      development_status: ["developed", "developing"],
      colonial_status: ["colonial", "independent"]
    },
    smartLogic: {
      dependencies: ["continental -> cultural_region"]
    }
  },
  {
    id: "temporal",
    icon: "⏰", 
    title: "Time Period Analysis",
    description: "Analyze patterns across historical periods",
    filters: {
      century: ["Pre-1500", "1500-1699", "1700-1799", "1800-1899", "1900-1999", "2000+"],
      decade: ["1500s", "1510s", "1520s", "1530s", "1540s", "1550s", "1560s", "1570s", "1580s", "1590s", "1600s", "1610s", "1620s", "1630s", "1640s", "1650s", "1660s", "1670s", "1680s", "1690s", "1700s", "1710s", "1720s", "1730s", "1740s", "1750s", "1760s", "1770s", "1780s", "1790s", "1800s", "1810s", "1820s", "1830s", "1840s", "1850s", "1860s", "1870s", "1880s", "1890s", "1900s", "1910s", "1920s", "1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"],
      historical_period: ["Ancient", "Medieval", "Renaissance", "Industrial", "Modern", "Contemporary"],
      seasonal: ["Winter", "Spring", "Summer", "Fall"]
    },
    smartLogic: {
      dependencies: ["century -> decade", "historical_period -> century"]
    }
  },
  {
    id: "event_characteristics", 
    icon: "🏛️",
    title: "Event Properties",
    description: "Filter by event type and characteristics",
    filters: {
      primary_category: ["Military & Warfare", "Politics & Government", "Science & Technology", "Arts & Culture", "Disasters & Accidents", "Sports & Recreation", "Economics & Business", "Religion & Philosophy"],
      violence_level: ["peaceful", "violent", "catastrophic"],
      scale: ["local", "national", "international", "global"],
      human_impact: ["individual", "small group", "mass population"]
    },
    smartLogic: {
      suggestions: ["primary_category -> violence_level"]
    }
  },
  {
    id: "societal_context",
    icon: "🌍", 
    title: "Societal Factors",
    description: "Contextual societal and temporal factors",
    filters: {
      development_status: ["developed", "developing"],
      colonial_status: ["colonial", "independent"],
      seasonal: ["Winter", "Spring", "Summer", "Fall"]
    }
  }
];

