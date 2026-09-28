import { db } from './db.js';
import { AffiliateInsertion, SupportedLanguage } from '../src/shared/types.js';

export function matchAndInsertAffiliates(params: {
  headline: string;
  summary: string;
  editorial: string;
  tags: string[];
  relatedCoins: string[];
  detectedEntities: string[];
  language?: SupportedLanguage;
}): AffiliateInsertion[] {
  const activePrograms = db.getActiveAffiliates();
  const settings = db.getSettings();
  const lang = params.language || 'en';
  const disclosure = settings.affiliate_disclosure[lang] || settings.affiliate_disclosure.en;

  const combinedText = (
    params.headline +
    ' ' +
    params.summary +
    ' ' +
    params.editorial +
    ' ' +
    params.tags.join(' ') +
    ' ' +
    params.relatedCoins.join(' ') +
    ' ' +
    params.detectedEntities.join(' ')
  ).toLowerCase();

  const matchedInsertions: AffiliateInsertion[] = [];

  for (const program of activePrograms) {
    if (!program.is_active || !program.referral_url) continue;

    // Check language support if specified
    if (program.supported_languages && program.supported_languages.length > 0) {
      if (!program.supported_languages.includes(lang)) {
        continue;
      }
    }

    // Keyword matching
    const hasMatch = program.keywords.some(kw => combinedText.includes(kw.toLowerCase()));
    const hasEntityMatch = params.detectedEntities.some(ent =>
      ent.toLowerCase().includes(program.company_name.toLowerCase()) ||
      program.company_name.toLowerCase().includes(ent.toLowerCase())
    );

    if (hasMatch || hasEntityMatch) {
      matchedInsertions.push({
        program_id: program.id,
        program_name: program.program_name,
        referral_url: `/api/affiliates/click/${program.id}?lang=${lang}`, // tracked redirect
        disclosure,
        context_matched: program.keywords.find(kw => combinedText.includes(kw.toLowerCase())) || program.company_name,
        call_to_action: program.call_to_action || `Access ${program.company_name} Official Portal`,
      });

      // Limit to max 2 affiliate programs per article to avoid spam
      if (matchedInsertions.length >= 2) {
        break;
      }
    }
  }

  return matchedInsertions;
}
