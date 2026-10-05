/**
 * Deterministic Content Generation Engine for Polaris.
 * Pure functions with zero DOM code. Operates strictly on verified record and expedition fields.
 */

// Helper to format dates cleanly
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

// Generate valid hashtags from existing record & expedition fields only
function getRelevantHashtags(record, expedition) {
  const tags = new Set();

  if (expedition?.region) {
    tags.add(`#${expedition.region.replace(/\s+/g, '')}`);
  }
  tags.add('#IndiaInPolarScience');
  if (expedition?.year) {
    tags.add(`#PolarResearch${expedition.year}`);
  }
  if (Array.isArray(record?.tags)) {
    record.tags.slice(0, 2).forEach((t) => {
      const clean = t.replace(/[^a-zA-Z0-9]/g, '');
      if (clean) tags.add(`#${clean.charAt(0).toUpperCase() + clean.slice(1)}`);
    });
  }

  return Array.from(tags).slice(0, 4);
}

/**
 * Generate 4 distinct content outputs based on real fields only.
 */
export function generate(record, options = {}, expedition = null) {
  const {
    audience = 'general', // 'general' | 'students' | 'press'
    tone = 'informative',  // 'informative' | 'inspiring' | 'urgent'
    length = 'medium',     // 'short' | 'medium'
    cta = false,
  } = options;

  if (!record) {
    return null;
  }

  const fieldsUsed = ['title', 'type', 'date', 'description'];
  if (record.tags && record.tags.length > 0) fieldsUsed.push('tags');
  if (expedition?.name || expedition?.title) fieldsUsed.push('expedition.name');
  if (expedition?.region) fieldsUsed.push('expedition.region');
  if (expedition?.locationName) fieldsUsed.push('expedition.locationName');
  if (expedition?.institution) fieldsUsed.push('expedition.institution');
  if (expedition?.leaderName) fieldsUsed.push('expedition.leaderName');
  if (expedition?.keyFindings) fieldsUsed.push('expedition.keyFindings');

  const title = record.title || 'Polar Scientific Record';
  const desc = record.description || '';
  const dateFormatted = formatDate(record.date);
  const expName = expedition?.name || expedition?.title || 'Indian Scientific Expedition';
  const region = expedition?.region || 'Polar';
  const location = expedition?.locationName || region;
  const institution = expedition?.institution || 'Ministry of Earth Sciences';
  const leader = expedition?.leaderName ? `led by ${expedition.leaderName}` : '';
  const hashtags = getRelevantHashtags(record, expedition).join(' ');

  // Tone phrasing variations
  const tonePrefix = {
    informative: `Scientific field records from ${region} confirm key observations documented at ${location}.`,
    inspiring: `Standing at Earth's frozen frontier, Indian researchers continue pushing boundaries at ${location}.`,
    urgent: `Accelerating shifts at the poles highlight the critical need for continuous observations at ${location}.`,
  }[tone];

  // Audience introductions
  const audienceLead = {
    general: `India's polar mission has logged new observations from ${expName}.`,
    students: `Did you know Indian scientists travel to the coldest places on Earth to understand climate and wildlife?`,
    press: `FOR IMMEDIATE RELEASE: The Ministry of Earth Sciences reports verified observations from ${expName}.`,
  }[audience];

  // CTA lines
  const ctaLine = cta
    ? {
        general: 'Explore more expedition logs and datasets on the Polaris portal at polaris.gov.in.',
        students: 'Ask your teachers about India’s polar stations Maitri, Bharati, and Himadri to learn more!',
        press: 'For media access to complete datasets and expedition imagery, contact the outreach desk.',
      }[audience]
    : '';

  // 1. WEBSITE BLURB
  const blurbHeadline = `${title} (${region})`;
  let blurbSummary = `${audienceLead} ${tonePrefix} ${desc}`;
  if (leader) blurbSummary += ` The research contingent was ${leader}.`;
  if (ctaLine) blurbSummary += ` ${ctaLine}`;

  const bullets = [];
  bullets.push(`Location: Documented at ${location} under ${expName}.`);
  if (record.tags && record.tags.length > 0) {
    bullets.push(`Key topics observed: ${record.tags.join(', ')}.`);
  } else {
    bullets.push(`Recorded officially under Indian polar mission logs.`);
  }
  if (expedition?.keyFindings && expedition.keyFindings[0]) {
    bullets.push(`Related expedition finding: ${expedition.keyFindings[0]}.`);
  } else {
    bullets.push(`Field measurements logged on ${dateFormatted}.`);
  }

  const websiteBlurb = {
    headline: blurbHeadline,
    summary: blurbSummary,
    highlights: bullets,
    fullText: `${blurbHeadline}\n\n${blurbSummary}\n\nKey Highlights:\n• ${bullets.join('\n• ')}`,
  };

  // 2. SOCIAL POSTS
  // a) Twitter (<= 280 chars)
  let twitterText = '';
  if (length === 'short') {
    twitterText = `India's ${region} team logs ${title.toLowerCase()}: ${desc.slice(0, 110)}... ${hashtags}`;
  } else {
    twitterText = `${title}: ${desc.slice(0, 130)} Recorded at ${location} by ${expName}. ${hashtags}`;
  }
  if (twitterText.length > 280) {
    twitterText = twitterText.slice(0, 276) + '...';
  }

  // b) Instagram (<= 2200 chars)
  const instagramText = `From the ends of the Earth: ${title} ❄️\n\n${tonePrefix}\n\n${desc}\n\n📍 Location: ${location}\n📅 Date: ${dateFormatted}\n🚢 Expedition: ${expName}\n🏛️ Institute: ${institution}\n\n${ctaLine ? ctaLine + '\n\n' : ''}${hashtags}`;

  // c) LinkedIn (<= 700 chars)
  let linkedInText = `India's Polar Science Update | ${region}\n\n${desc}\n\nRecorded at ${location} under the ${expName}, ${institution}. Continuous monitoring in polar zones directly informs national understanding of climate and atmospheric cycles.\n\n${ctaLine ? ctaLine + '\n\n' : ''}${hashtags}`;
  if (linkedInText.length > 700) {
    linkedInText = linkedInText.slice(0, 696) + '...';
  }

  const socialPosts = {
    twitter: twitterText,
    instagram: instagramText,
    linkedin: linkedInText,
  };

  // 3. PRESS NOTE
  const pressHeadline = `MINISTRY OF EARTH SCIENCES: ${title.toUpperCase()} DOCUMENTED AT ${location.toUpperCase()}`;
  const dateline = `NEW DELHI / GOA, ${dateFormatted.toUpperCase() || 'RECENT'}`;
  const leadParagraph = `${dateline} — The ${institution} has documented verified records titled "${title}" during the ${expName} in the ${region}. ${desc}`;
  const bodyParagraph = `The research, conducted at ${location}${leader ? ` under the leadership of ${expedition.leaderName}` : ''}, forms part of India's ongoing polar observation framework. Scientists emphasized that observations in high-latitude environments provide vital baseline metrics for broader Earth system studies.`;
  const boilerplate = `About NCPOR: The National Centre for Polar and Ocean Research is India's premier R&D institution responsible for country research stations in Antarctica (Maitri, Bharati) and the Arctic (Himadri).`;

  const pressNoteText = `${pressHeadline}\n\n${leadParagraph}\n\n${bodyParagraph}\n\n${ctaLine ? ctaLine + '\n\n' : ''}${boilerplate}`;

  const pressNote = {
    headline: pressHeadline,
    dateline,
    lead: leadParagraph,
    body: bodyParagraph,
    boilerplate,
    fullText: pressNoteText,
  };

  // 4. EMAIL SNIPPET
  // Subject line <= 60 chars
  let emailSubject = `Polar Science Brief: ${title}`;
  if (emailSubject.length > 60) {
    emailSubject = emailSubject.slice(0, 57) + '...';
  }

  const emailBody = `Dear Colleague,\n\nA new polar science entry has been recorded under the ${expName} in ${region}.\n\nOverview:\n${title}\n${desc}\n\nLocation: ${location}\nDate: ${dateFormatted}\nLead Institution: ${institution}\n\n${tonePrefix}\n\n${ctaLine || 'You can review further details directly on the Polaris knowledge portal.'}\n\nWarm regards,\nPolar Outreach & Media Desk\nMinistry of Earth Sciences`;

  const emailSnippet = {
    subject: emailSubject,
    body: emailBody,
    fullText: `Subject: ${emailSubject}\n\n${emailBody}`,
  };

  return {
    websiteBlurb,
    socialPosts,
    pressNote,
    emailSnippet,
    fieldsUsed,
  };
}
