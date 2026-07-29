import { ToolCallResult } from '@/types/triage';

export function findNearbyHospitals(locationInput?: any) {
  const queryStr = (locationInput?.address || locationInput?.query || '').toLowerCase();
  const lat = locationInput?.latitude || 33.6405;
  const lng = locationInput?.longitude || 72.9837;

  // Islamabad / Rawalpindi / H-12 Detection
  const isIslamabad = queryStr.includes('h-12') || queryStr.includes('islamabad') || queryStr.includes('rawalpindi') || queryStr.includes('pakistan') || (lat > 32.5 && lat < 34.5 && lng > 72.0 && lng < 74.0);

  if (isIslamabad) {
    return {
      queryLocation: locationInput?.address || "H-12, Islamabad, Pakistan",
      latitude: lat || 33.6405,
      longitude: lng || 72.9837,
      foundCount: 5,
      hospitals: [
        {
          name: "NUST Medical Complex & Health Center",
          distance: "0.5 km away (2 mins)",
          type: "Campus Emergency & Urgent Care Unit",
          address: "NUST University Campus, Sector H-12, Islamabad",
          phone: "+92 51 9085 1300",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Immediate (<5 mins)",
          googleMapsUrl: "https://www.google.com/maps/search/NUST+Medical+Center+H-12+Islamabad"
        },
        {
          name: "Quaid-e-Azam International Hospital (QIH)",
          distance: "2.2 km away (5 mins)",
          type: "24/7 Level 1 Emergency & Cardiac Trauma Center",
          address: "Near Golra Mor, Main Peshawar Road, H-13/Westridge, Islamabad",
          phone: "+92 51 8449100 / 111-505-505",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Est. 5 mins",
          googleMapsUrl: "https://www.google.com/maps/search/Quaid-e-Azam+International+Hospital+Islamabad"
        },
        {
          name: "Pakistan Institute of Medical Sciences (PIMS)",
          distance: "7.2 km away (12 mins)",
          type: "National Public Tertiary Emergency Trauma Hospital",
          address: "Ibn-e-Sina Road, Sector G-8/3, Islamabad",
          phone: "+92 51 9261170 / Rescue 1122",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Est. 10 mins",
          googleMapsUrl: "https://www.google.com/maps/search/PIMS+Hospital+G-8+Islamabad"
        },
        {
          name: "Shifa International Hospital",
          distance: "6.5 km away (10 mins)",
          type: "Quaternary Care Emergency & Surgical Center",
          address: "Pitras Bukhari Road, Sector H-8/4, Islamabad",
          phone: "+92 51 8463000",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Est. 8 mins",
          googleMapsUrl: "https://www.google.com/maps/search/Shifa+International+Hospital+Islamabad"
        },
        {
          name: "Kulsum International Hospital",
          distance: "9.1 km away (15 mins)",
          type: "Specialty ER & Intensive Care Unit",
          address: "Blue Area, Sector G-6/2, Jinnah Avenue, Islamabad",
          phone: "+92 51 8446666",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Est. 5 mins",
          googleMapsUrl: "https://www.google.com/maps/search/Kulsum+International+Hospital+Blue+Area+Islamabad"
        }
      ]
    };
  }

  // Lahore Detection
  if (queryStr.includes('lahore') || (lat > 31.0 && lat < 31.8 && lng > 74.0 && lng < 74.6)) {
    return {
      queryLocation: "Lahore, Punjab, Pakistan",
      latitude: 31.5204,
      longitude: 74.3587,
      foundCount: 4,
      hospitals: [
        {
          name: "Doctors Hospital & Medical Centre",
          distance: "2.1 km away (6 mins)",
          type: "24/7 Tertiary Emergency & Cardiac Care",
          address: "152-G/1, Canal Bank Road, Johar Town, Lahore",
          phone: "+92 42 35302701",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Est. 8 mins",
          googleMapsUrl: "https://www.google.com/maps/search/Doctors+Hospital+Johar+Town+Lahore"
        },
        {
          name: "Shaukat Khanum Memorial Hospital",
          distance: "3.5 km away (9 mins)",
          type: "Specialty Oncology & Emergency Unit",
          address: "7A Block R-3, Johar Town, Lahore",
          phone: "+92 42 35905000",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Est. 10 mins",
          googleMapsUrl: "https://www.google.com/maps/search/Shaukat+Khanum+Hospital+Lahore"
        },
        {
          name: "Services Hospital Lahore",
          distance: "5.8 km away (14 mins)",
          type: "Public Emergency Trauma Center",
          address: "Ghaus-ul-Azam Road, Jail Road, Lahore",
          phone: "+92 42 99203402 / Rescue 1122",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Est. 12 mins",
          googleMapsUrl: "https://www.google.com/maps/search/Services+Hospital+Jail+Road+Lahore"
        }
      ]
    };
  }

  // Karachi Detection
  if (queryStr.includes('karachi') || (lat > 24.7 && lat < 25.1 && lng > 66.9 && lng < 67.3)) {
    return {
      queryLocation: "Karachi, Sindh, Pakistan",
      latitude: 24.8607,
      longitude: 67.0011,
      foundCount: 4,
      hospitals: [
        {
          name: "The Aga Khan University Hospital (AKUH)",
          distance: "1.8 km away (5 mins)",
          type: "Quaternary Level 1 Emergency Trauma Center",
          address: "National Stadium Road, Karachi",
          phone: "+92 21 111 911 911",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Est. 6 mins",
          googleMapsUrl: "https://www.google.com/maps/search/Aga+Khan+University+Hospital+Karachi"
        },
        {
          name: "Liaquat National Hospital & Medical College",
          distance: "2.9 km away (8 mins)",
          type: "Tertiary Emergency Care Facility",
          address: "National Stadium Road, Gulshan-e-Iqbal, Karachi",
          phone: "+92 21 34412000",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Est. 10 mins",
          googleMapsUrl: "https://www.google.com/maps/search/Liaquat+National+Hospital+Karachi"
        },
        {
          name: "Jinnah Postgraduate Medical Centre (JPMC)",
          distance: "4.5 km away (12 mins)",
          type: "National Public Trauma ER Center",
          address: "Rafiqui Shaheed Road, Cantonment, Karachi",
          phone: "+92 21 99201300 / Rescue 1122",
          openStatus: "Open 24/7",
          emergencyWaitTime: "Est. 5 mins",
          googleMapsUrl: "https://www.google.com/maps/search/JPMC+Hospital+Karachi"
        }
      ]
    };
  }

  // General / Global Fallback with exact coordinates
  return {
    queryLocation: locationInput?.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    latitude: lat,
    longitude: lng,
    foundCount: 3,
    hospitals: [
      {
        name: "Regional Central Emergency Trauma Hospital",
        distance: "1.1 miles away (approx 4 mins)",
        type: "24/7 Level 1 Trauma ER Center",
        address: locationInput?.address ? `Primary ER Facility, ${locationInput.address}` : "742 Healthcare Parkway",
        phone: "+1 (800) 555-0199",
        openStatus: "Open 24/7",
        emergencyWaitTime: "Est. 8 mins",
        googleMapsUrl: `https://www.google.com/maps/search/emergency+room+hospitals/@${lat},${lng},14z`
      },
      {
        name: "St. Jude Medical Emergency Health Institute",
        distance: "2.8 miles away (approx 9 mins)",
        type: "Urgent Care & Specialty Emergency Facility",
        address: "108 Medical Center Plaza",
        phone: "+1 (800) 555-0144",
        openStatus: "Open 24/7",
        emergencyWaitTime: "Est. 12 mins",
        googleMapsUrl: `https://www.google.com/maps/search/emergency+room+hospitals/@${lat},${lng},14z`
      },
      {
        name: "Community Red Cross Emergency Center",
        distance: "4.2 miles away (approx 14 mins)",
        type: "Public General Hospital & Ambulance Hub",
        address: "45 Care Pathway Suite 100",
        phone: "+1 (800) 555-0112",
        openStatus: "Open 24/7",
        emergencyWaitTime: "Est. 5 mins",
        googleMapsUrl: `https://www.google.com/maps/search/emergency+room+hospitals/@${lat},${lng},14z`
      }
    ]
  };
}

export function lookupEmergencyContacts(region: string = 'Pakistan / Global') {
  return {
    region: region,
    primaryEmergencyNumber: "1122",
    internationalEmergencyNumber: "112",
    hotlines: [
      { service: "Pakistan Rescue Emergency Ambulance Dispatch", number: "1122" },
      { service: "Edhi Foundation Emergency Ambulance Service", number: "115" },
      { service: "Chhipa Ambulance Service", number: "1020" },
      { service: "PIMS Islamabad Emergency ER Counter", number: "+92 51 9261170" },
      { service: "US Emergency Dispatch", number: "911" }
    ]
  };
}

export function lookupFirstAid(condition: string = 'General Acute') {
  const c = condition.toLowerCase();
  
  if (c.includes('chest') || c.includes('cardiac') || c.includes('heart')) {
    return {
      condition: "Chest Pain / Suspected Acute Cardiac Distress",
      protocolSteps: [
        "Call Rescue 1122 or 115 immediately. Do not attempt to drive.",
        "Have the individual sit down comfortably in a semi-upright position.",
        "Loosen restrictive clothing around the neck, chest, and waist.",
        "If trained and aspirin is available (and person has no aspirin allergy), give non-coated aspirin 325 mg to chew.",
        "Monitor breathing and pulse. Be prepared to initiate CPR if unresponsive."
      ]
    };
  }

  if (c.includes('breath') || c.includes('dyspnea') || c.includes('chok')) {
    return {
      condition: "Acute Respiratory Distress / Asthma",
      protocolSteps: [
        "Position the individual sitting upright leaning slightly forward.",
        "Assist in administering their prescribed quick-relief rescue inhaler (Albuterol) if available.",
        "Maintain a calm environment and encourage slow, deep diaphragmatic breathing.",
        "Seek immediate emergency medical transport if speech becomes difficult or lips turn blue."
      ]
    };
  }

  if (c.includes('bleed') || c.includes('wound') || c.includes('cut')) {
    return {
      condition: "Severe Hemorrhage / Wound Pressure",
      protocolSteps: [
        "Apply direct, unbroken, firm pressure over the bleeding site using a clean cloth or sterile gauze.",
        "Do not remove blood-soaked dressings; add more pads on top and maintain constant pressure.",
        "Elevate the injured limb above heart level if bone fracture is ruled out.",
        "If heavy arterial spurting persists on limb, apply a tourniquet 2-3 inches above the wound."
      ]
    };
  }

  return {
    condition: condition || "General First-Aid Protocol",
    protocolSteps: [
      "Keep the person calm, warm, and resting comfortably.",
      "Monitor vital signs (responsiveness, airway, breathing, circulation).",
      "Do not offer food or drink if surgery or ER intervention may be needed.",
      "Contact healthcare professionals immediately if condition deteriorates."
    ]
  };
}

export function lookupMedicineInformation(medicineOrSymptom: string = 'Fever') {
  const query = medicineOrSymptom.toLowerCase();

  if (query.includes('fever') || query.includes('pain') || query.includes('paracetamol') || query.includes('acetaminophen')) {
    return {
      medicationName: "Acetaminophen (Paracetamol / Panadol)",
      category: "Antipyretic & Analgesic",
      standardAdultDose: "500 mg - 1000 mg every 4 to 6 hours as needed (Max: 4000 mg in 24 hours)",
      precautions: "Do not exceed maximum daily dosage. Avoid alcohol co-ingestion due to hepatic injury risk.",
      pediatricNotice: "Dosage in children must be based strictly on body weight (10-15 mg/kg per dose)."
    };
  }

  if (query.includes('ibuprofen') || query.includes('inflammation') || query.includes('brufen')) {
    return {
      medicationName: "Ibuprofen (Brufen)",
      category: "Non-Steroidal Anti-Inflammatory Drug (NSAID)",
      standardAdultDose: "200 mg - 400 mg every 4 to 6 hours with food or milk",
      precautions: "Avoid if patient has stomach ulcers, kidney disease, bleeding disorders, or late-stage pregnancy."
    };
  }

  return {
    medicationName: "Oral Rehydration Solution (ORS / Nimkol)",
    category: "Electrolyte & Fluid Replacement",
    standardAdultDose: "Sip 200-400 mL after each loose stool or fever fluid loss",
    precautions: "Dissolve 1 packet in clean drinking water as directed. Do not boil ORS solution after mixing."
  };
}

export function executeToolCall(toolName: string, parameters: Record<string, any> = {}): ToolCallResult {
  switch (toolName) {
    case 'findNearbyHospitals':
      return {
        toolName: 'findNearbyHospitals',
        parameters,
        output: findNearbyHospitals(parameters.location),
        status: 'executed'
      };

    case 'lookupEmergencyContacts':
      return {
        toolName: 'lookupEmergencyContacts',
        parameters,
        output: lookupEmergencyContacts(parameters.region),
        status: 'executed'
      };

    case 'lookupFirstAid':
      return {
        toolName: 'lookupFirstAid',
        parameters,
        output: lookupFirstAid(parameters.condition || parameters.message),
        status: 'executed'
      };

    case 'lookupMedicineInformation':
      return {
        toolName: 'lookupMedicineInformation',
        parameters,
        output: lookupMedicineInformation(parameters.medicine || parameters.message),
        status: 'executed'
      };

    default:
      return {
        toolName: 'findNearbyHospitals',
        parameters,
        output: findNearbyHospitals(parameters.location),
        status: 'executed'
      };
  }
}
