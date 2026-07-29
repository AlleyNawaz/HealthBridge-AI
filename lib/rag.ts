import { RagGuideline } from '@/types/triage';

export const MEDICAL_KNOWLEDGE_BASE: RagGuideline[] = [
  {
    id: 'rag-cardiac-01',
    title: 'Acute Coronary Syndrome & Chest Distress Protocol',
    category: 'Cardiovascular',
    source: 'WHO',
    content: 'Chest pain accompanied by pain radiating to left arm/jaw, diaphoresis, shortness of breath, or feeling of crushing pressure indicates potential acute myocardial infarction. Immediate EMS transport (911/112) is mandatory. Aspirin (160-325 mg chewed) recommended if non-allergic and available.',
    keySymptoms: ['chest pain', 'arm pain', 'jaw pain', 'tightness', 'crushing', 'heart attack', 'sweating', 'seene me dard', 'chhati me dard']
  },
  {
    id: 'rag-respiratory-02',
    title: 'Dyspnea, Asthma & Severe Respiratory Distress Triage',
    category: 'Respiratory',
    source: 'CDC',
    content: 'Inability to complete full sentences without pausing for breath, cyanosis (bluish lips), or intercostal retractions signals critical respiratory compromise. Oxygen therapy or bronchodilators required urgently. Immediate emergency triage indicated.',
    keySymptoms: ['shortness of breath', 'breathlessness', 'breathing problem', 'cannot breathe', 'gasping', 'wheezing', 'saans me taklif', 'saans fulna']
  },
  {
    id: 'rag-neurological-03',
    title: 'FAST Acute Stroke Detection & Emergency Protocol',
    category: 'Neurology',
    source: 'NHS',
    content: 'FAST criteria: Facial drooping, Arm weakness on one side, Speech difficulty/slurring, Time to call emergency services. Sudden numbness, vision loss, or severe "thunderclap" headache warrant emergency neurological evaluation.',
    keySymptoms: ['stroke', 'paralysis', 'slurred speech', 'face drooping', 'arm weakness', 'sudden blindness', 'falaj', 'bolne me dikkat']
  },
  {
    id: 'rag-pediatric-04',
    title: 'Pediatric High Fever & Febrile Convulsion Guidelines',
    category: 'Pediatrics',
    source: 'CDC',
    content: 'Fever above 38°C (100.4°F) in infants under 3 months is a medical emergency. In older children, fever over 39°C with lethargy, stiff neck, non-blanching rash, or poor fluid intake warrants urgent pediatric care. Hydration and antipyretics (Paracetamol/Acetaminophen) advised under dosing rules.',
    keySymptoms: ['baby fever', 'infant fever', 'high fever', 'child fever', 'febrile', 'bachhe ko bukhar', 'bukhar']
  },
  {
    id: 'rag-gastrointestinal-05',
    title: 'Acute Abdominal Pain & Dehydration Triage',
    category: 'Gastroenteritis',
    source: 'WHO',
    content: 'Severe right lower quadrant abdominal pain (suspected appendicitis) or black/bloody stools warrant immediate surgical or ER evaluation. For acute gastroenteritis, Oral Rehydration Solution (ORS) is primary line. Monitor for dry mouth, dizziness, or oliguria.',
    keySymptoms: ['stomach pain', 'abdominal pain', 'vomiting', 'diarrhea', 'dehydration', 'pet dard', 'dast', 'ulti']
  },
  {
    id: 'rag-head-injury-06',
    title: 'Traumatic Brain Injury & Concussion Red Flags',
    category: 'Trauma',
    source: 'NHS',
    content: 'Head trauma followed by loss of consciousness, repeated vomiting, confusion, unequal pupils, or clear fluid draining from nose/ears requires urgent head CT scan and ER management.',
    keySymptoms: ['head injury', 'hit head', 'concussion', 'vomiting after head hit', 'headache after fall', 'sir me chot']
  },
  {
    id: 'rag-infection-07',
    title: 'Viral Upper Respiratory & Flu Symptom Management',
    category: 'Infectious Disease',
    source: 'WHO',
    content: 'Mild to moderate fever, nasal congestion, mild cough, sore throat, and muscle aches without dyspnea indicate acute viral URI. Recommended next steps: oral hydration, warm saline gargles, adequate rest, and OTC fever reducers. Monitor for secondary bacterial complications if fever persists > 3-4 days.',
    keySymptoms: ['fever', 'headache', 'cough', 'cold', 'sore throat', 'body pain', 'flu', 'bukhar aur sir dard', 'zukam']
  }
];

export function retrieveMedicalGuidance(userText: string): Array<{
  id: string;
  title: string;
  source: string;
  relevance: string;
  guidanceText: string;
}> {
  const textLower = userText.toLowerCase();
  
  // Score guidelines based on keyword matches
  const scored = MEDICAL_KNOWLEDGE_BASE.map(item => {
    let score = 0;
    for (const kw of item.keySymptoms) {
      if (textLower.includes(kw.toLowerCase())) {
        score += 2;
      }
    }
    // Check general terms
    if (textLower.includes(item.title.toLowerCase()) || textLower.includes(item.category.toLowerCase())) {
      score += 1;
    }
    return { item, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Take top relevant entries (score > 0), or default to viral/general if no specific matches
  const topMatches = scored.filter(s => s.score > 0).slice(0, 2);
  
  if (topMatches.length === 0) {
    // Default fallback guidance from WHO/CDC
    return [
      {
        id: MEDICAL_KNOWLEDGE_BASE[6].id,
        title: MEDICAL_KNOWLEDGE_BASE[6].title,
        source: MEDICAL_KNOWLEDGE_BASE[6].source,
        relevance: 'Standard Acute Infection Protocol',
        guidanceText: MEDICAL_KNOWLEDGE_BASE[6].content
      }
    ];
  }

  return topMatches.map(m => ({
    id: m.item.id,
    title: m.item.title,
    source: m.item.source,
    relevance: `Matched symptom markers: ${m.item.category}`,
    guidanceText: m.item.content
  }));
}
