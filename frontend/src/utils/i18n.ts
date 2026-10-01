type Language = string;

const translations: Record<Language, Record<string, string>> = {
  English: {}, // Default
  Spanish: {
    "Business Analysis": "Análisis de Negocio",
    "Business Score": "Puntuación de Negocio",
    "Estimated Investment": "Inversión Estimada",
    "Risk": "Riesgo",
    "Low": "Bajo",
    "Market Demand": "Demanda del Mercado",
    "High": "Alto",
    "View Details": "Ver Detalles",
    "Financial Forecast": "Pronóstico Financiero",
    "Revenue": "Ingresos",
    "Expenses": "Gastos",
    "Profit": "Beneficio",
    "ROI": "Retorno de Inversión",
    "months": "meses",
    "Here is the comprehensive startup plan for your idea": "Aquí está el plan de inicio completo para su idea",
    "I've run this through our multi-agent pipeline.": "He pasado esto a través de nuestra canalización de múltiples agentes."
  },
  French: {
    "Business Analysis": "Analyse d'Affaires",
    "Business Score": "Score d'Affaires",
    "Estimated Investment": "Investissement Estimé",
    "Risk": "Risque",
    "Low": "Faible",
    "Market Demand": "Demande du Marché",
    "High": "Élevé",
    "View Details": "Voir les Détails",
    "Financial Forecast": "Prévisions Financières",
    "Revenue": "Revenus",
    "Expenses": "Dépenses",
    "Profit": "Profit",
    "ROI": "Retour sur Investissement",
    "months": "mois",
    "Here is the comprehensive startup plan for your idea": "Voici le plan de démarrage complet pour votre idée",
    "I've run this through our multi-agent pipeline.": "J'ai fait passer cela par notre pipeline multi-agents."
  },
  German: {
    "Business Analysis": "Geschäftsanalyse",
    "Business Score": "Geschäftsbewertung",
    "Estimated Investment": "Geschätzte Investition",
    "Risk": "Risiko",
    "Low": "Niedrig",
    "Market Demand": "Marktnachfrage",
    "High": "Hoch",
    "View Details": "Details ansehen",
    "Financial Forecast": "Finanzprognose",
    "Revenue": "Einnahmen",
    "Expenses": "Ausgaben",
    "Profit": "Gewinn",
    "ROI": "Kapitalrendite",
    "months": "Monate",
    "Here is the comprehensive startup plan for your idea": "Hier ist der umfassende Startup-Plan für Ihre Idee",
    "I've run this through our multi-agent pipeline.": "Ich habe dies durch unsere Multi-Agenten-Pipeline laufen lassen."
  },
  Hindi: {
    "Business Analysis": "व्यापार विश्लेषण",
    "Business Score": "व्यापार स्कोर",
    "Estimated Investment": "अनुमानित निवेश",
    "Risk": "जोखिम",
    "Low": "कम",
    "Market Demand": "बाजार की मांग",
    "High": "उच्च",
    "View Details": "विवरण देखें",
    "Financial Forecast": "वित्तीय पूर्वानुमान",
    "Revenue": "राजस्व",
    "Expenses": "खर्च",
    "Profit": "लाभ",
    "ROI": "निवेश पर वापसी",
    "months": "महीने",
    "Here is the comprehensive startup plan for your idea": "आपके विचार के लिए यहाँ एक व्यापक स्टार्टअप योजना है",
    "I've run this through our multi-agent pipeline.": "मैंने इसे हमारी बहु-एजेंट पाइपलाइन के माध्यम से चलाया है।"
  },
  Tamil: {
    "Business Analysis": "வணிக பகுப்பாய்வு",
    "Business Score": "வணிக மதிப்பெண்",
    "Estimated Investment": "மதிப்பிடப்பட்ட முதலீடு",
    "Risk": "ஆபத்து",
    "Low": "குறைந்த",
    "Market Demand": "சந்தை தேவை",
    "High": "உயர்",
    "View Details": "விவரங்களை பார்க்க",
    "Financial Forecast": "நிதி முன்னறிவிப்பு",
    "Revenue": "வருவாய்",
    "Expenses": "செலவுகள்",
    "Profit": "லாபம்",
    "ROI": "முதலீட்டின் மீதான வருவாய்",
    "months": "மாதங்கள்",
    "Here is the comprehensive startup plan for your idea": "உங்கள் யோசனைக்கான விரிவான தொடக்க திட்டம் இங்கே",
    "I've run this through our multi-agent pipeline.": "இதை எங்கள் பல முகவர் பைப்லைன் வழியாக இயக்கியுள்ளேன்."
  },
  Telugu: {
    "Business Analysis": "వ్యాపార విశ్లేషణ",
    "Business Score": "వ్యాపార స్కోర్",
    "Estimated Investment": "అంచనా పెట్టుబడి",
    "Risk": "ప్రమాదం",
    "Low": "తక్కువ",
    "Market Demand": "మార్కెట్ డిమాండ్",
    "High": "అధిక",
    "View Details": "వివరాలను వీక్షించండి",
    "Financial Forecast": "ఆర్థిక అంచనా",
    "Revenue": "ఆదాయం",
    "Expenses": "ఖర్చులు",
    "Profit": "లాభం",
    "ROI": "పెట్టుబడిపై రాబడి",
    "months": "నెలలు",
    "Here is the comprehensive startup plan for your idea": "మీ ఆలోచన కోసం సమగ్ర ప్రారంభ ప్రణాళిక ఇక్కడ ఉంది",
    "I've run this through our multi-agent pipeline.": "నేను దీన్ని మా బహుళ-ఏజెంట్ పైప్‌లైన్ ద్వారా నడిపాను."
  }
};

export function t(key: string, language: string = 'English'): string {
  if (language === 'English' || !translations[language]) return key;
  return translations[language][key] || key;
}

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    // Fallback if currencyCode is somehow invalid
    return `$${amount.toLocaleString()}`;
  }
}
