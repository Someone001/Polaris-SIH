/**
 * Deterministic Content Generation Engine for Polaris.
 * Pure functions with zero DOM code. Operates strictly on sourced record fields.
 * Every output strictly ends with: "Source: <title> (<URL>)".
 */

// Helper to extract a displayable source attribution line
function getSourceCitation(record) {
  const title = record.title || 'Polaris Archive Record';
  const url = record.url || record.sourceUrl || record.fileUrl || record.videoUrl || '';
  return `Source: ${title} (${url})`;
}

// Helper to determine the source publisher/organization name neutrally
function getSourceOrg(record) {
  if (record.journal) return record.journal;
  if (record.repository) return record.repository;
  if (record.channel) return record.channel;
  if (record.organizer) return record.organizer;
  if (record.author) return record.author;
  if (record.creditLine) return record.creditLine.replace(/^Source:\s*/, '');
  return 'public scientific records';
}

/**
 * Generate 4 distinct outreach content formats based only on sourced fields.
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

  const fieldsUsed = ['title', 'type'];
  if (record.author) fieldsUsed.push('author');
  if (record.creators) fieldsUsed.push('creators');
  if (record.journal) fieldsUsed.push('journal');
  if (record.year) fieldsUsed.push('year');
  if (record.date) fieldsUsed.push('date');
  if (record.doi) fieldsUsed.push('doi');
  if (record.region) fieldsUsed.push('region');
  if (record.description) fieldsUsed.push('description');
  if (record.subject) fieldsUsed.push('subject');
  if (record.highlights) fieldsUsed.push('highlights');
  if (record.sourceUrl) fieldsUsed.push('sourceUrl');

  const title = record.title || 'Polar Scientific Record';
  const desc = record.description || record.subject || record.highlights || record.sourceExcerpt || '';
  const dateStr = record.date || (record.year ? String(record.year) : '');
  const region = record.region || expedition?.region || '';

  // Audience prefix
  const audienceLead = {
    general: region ? `Public polar science update (${region}):` : 'Public polar science update:',
    students: region ? `Learning note on high-latitude polar research (${region}):` : 'Learning note on high-latitude polar research:',
    press: region ? `Research communication update (${region}):` : 'Research communication update:',
  }[audience];

  // Optional CTA
  const ctaLine = cta
    ? {
        general: 'Explore the full dataset and public citation on the Polaris portal.',
        students: 'Review this study to learn more about polar science and environments.',
        press: 'Refer to the primary source citation below for full details.',
      }[audience]
    : '';

  // 1. WEBSITE BLURB
  const blurbHeadline = `${title}${record.year ? ` (${record.year})` : ''}`;
  let blurbSummary = `${audienceLead} ${desc}`;
  if (authors) {
    blurbSummary += ` Contributed by ${authors}.`;
  }
  if (ctaLine) {
    blurbSummary += ` ${ctaLine}`;
  }

  const bullets = [];
  bullets.push(`Type: ${record.type}.`);
  if (region) bullets.push(`Region: ${region}.`);
  if (dateStr) bullets.push(`Date / Year: ${dateStr}.`);
  if (record.doi) bullets.push(`DOI: ${record.doi}.`);
  if (record.journal) bullets.push(`Journal: ${record.journal}.`);
  if (record.repository) bullets.push(`Repository: ${record.repository}.`);

  const websiteBlurb = {
    headline: blurbHeadline,
    summary: blurbSummary,
    highlights: bullets,
    fullText: `${blurbHeadline}\n\n${blurbSummary}\n\nKey Details:\n• ${bullets.join('\n• ')}\n\n${sourceCitation}`,
  };

  // 2. SOCIAL POSTS
  // a) Twitter (<= 280 chars strictly)
  const maxTwitterLen = 280;
  let twitterBase = length === 'short'
    ? `${title}`
    : `${title}. ${desc}`;
  const twitterTail = `\n\n${sourceCitation}`;
  const allowedBaseLen = maxTwitterLen - twitterTail.length;

  if (twitterBase.length > allowedBaseLen) {
    twitterBase = twitterBase.slice(0, Math.max(10, allowedBaseLen - 3)).trim() + '...';
  }
  const twitterText = `${twitterBase}${twitterTail}`;

  // b) Instagram (<= 2200 chars)
  const instagramText = `Polar Research Record: ${title}\n\n${desc}\n\n` +
    (authors ? `👤 Contributor(s): ${authors}\n` : '') +
    (region ? `📍 Region: ${region}\n` : '') +
    (dateStr ? `📅 Year/Date: ${dateStr}\n` : '') +
    (record.doi ? `🔗 DOI: ${record.doi}\n` : '') +
    (ctaLine ? `\n${ctaLine}\n` : '') +
    `\n${sourceCitation}`;

  // c) LinkedIn (<= 700 chars)
  let linkedInText = `Polar Science Brief${region ? ` | ${region}` : ''}\n\n${title}\n\n${desc}\n\n` +
    (authors ? `Authors / Contributors: ${authors}.\n` : '') +
    (ctaLine ? `${ctaLine}\n\n` : '') +
    `${sourceCitation}`;

  if (linkedInText.length > 700) {
    const tail = `\n\n${sourceCitation}`;
    const headLen = 700 - tail.length - 3;
    linkedInText = linkedInText.slice(0, headLen).trim() + '...' + tail;
  }

  const socialPosts = {
    twitter: twitterText,
    instagram: instagramText,
    linkedin: linkedInText,
  };

  // 3. PRESS NOTE (Neutral phrasing, no ministry spokesperson wording, no boilerplate)
  const pressHeadline = `RESEARCH SUMMARY: ${title.toUpperCase()}`;
  const dateline = dateStr ? `POLAR OBSERVATION RECORD, ${dateStr.toUpperCase()}` : 'POLAR OBSERVATION RECORD';
  const leadParagraph = `${dateline} — According to ${sourceOrg}, public records document the following findings regarding "${title}".`;
  const bodyParagraph = `${desc}${authors ? ` The work is attributed to ${authors}.` : ''}${record.journal ? ` Published in ${record.journal}.` : ''}${record.repository ? ` Preserved in ${record.repository}.` : ''}`;

  const pressNoteText = `${pressHeadline}\n\n${leadParagraph}\n\n${bodyParagraph}\n\n${ctaLine ? ctaLine + '\n\n' : ''}${sourceCitation}`;

  const pressNote = {
    headline: pressHeadline,
    dateline,
    lead: leadParagraph,
    body: bodyParagraph,
    fullText: pressNoteText,
  };

  // 4. EMAIL SNIPPET
  let emailSubject = `Polar Science Update: ${title}`;
  if (emailSubject.length > 60) {
    emailSubject = emailSubject.slice(0, 57) + '...';
  }

  const emailBody = `Dear Colleague,\n\nA public record has been cataloged under polar science documentation${region ? ` for ${region}` : ''}.\n\nTitle:\n${title}\n\nSummary:\n${desc}\n\n` +
    (authors ? `Contributors: ${authors}\n` : '') +
    (dateStr ? `Date / Year: ${dateStr}\n` : '') +
    (ctaLine ? `\n${ctaLine}\n\n` : '\n') +
    `${sourceCitation}`;

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
