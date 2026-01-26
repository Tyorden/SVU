/**
 * Terminology Definitions for SVU False Accusation Analysis
 *
 * These definitions come from the original tagging prompt used to analyze
 * all 576 episodes. They provide consistent explanations for all coded
 * values in the dataset, used for tooltips throughout the UI.
 */

/** Definitions for innocence_status field */
export const INNOCENCE_STATUS: Record<string, { label: string; description: string }> = {
  proven_innocent: {
    label: 'Proven Innocent',
    description: 'On-screen evidence or explicit statements exonerate them (DNA, real perpetrator found, confession to lying, ADA drops charges with reason)',
  },
  strongly_implied_innocent: {
    label: 'Strongly Implied Innocent',
    description: 'Show clearly pivots away; authority signals clearance (e.g., captain/ADA says "he\'s clear"). No contrary evidence remains.',
  },
  partially_involved: {
    label: 'Partially Involved',
    description: 'Person did something wrong other than the sex crime (e.g., lied about affair) but is innocent of the accused offense',
  },
  actually_guilty: {
    label: 'Actually Guilty',
    description: 'The person committed the accused offense (tracked for context but excluded from primary analysis)',
  },
}

/** Definitions for role_in_plot field */
export const ROLE_IN_PLOT: Record<string, { label: string; description: string }> = {
  initial_suspect: {
    label: 'Initial Suspect',
    description: 'First primary suspect the squad pursues in the investigation',
  },
  red_herring: {
    label: 'Red Herring',
    description: 'A suspect presented to mislead the audience and investigators, later discounted',
  },
  family_member: {
    label: 'Family Member',
    description: 'Relative, partner, or guardian of victim or suspect',
  },
  colleague: {
    label: 'Colleague',
    description: 'Works with victim or suspect (teacher, doctor, coach, coworker)',
  },
  community_member: {
    label: 'Community Member',
    description: 'Clergy, neighbor, landlord, or other community connection',
  },
  other: {
    label: 'Other',
    description: 'Does not fit the standard categories',
  },
}

/** Definitions for accused_of field */
export const ACCUSED_OF: Record<string, { label: string; description: string }> = {
  rape: {
    label: 'Rape',
    description: 'Sexual assault accusation',
  },
  CSA: {
    label: 'Child Sexual Abuse',
    description: 'Sexual abuse of a minor',
  },
  harassment: {
    label: 'Harassment',
    description: 'Sexual harassment accusation',
  },
  CP: {
    label: 'Child Pornography',
    description: 'Possession or distribution of child exploitation material',
  },
  DV: {
    label: 'Domestic Violence',
    description: 'Violence against intimate partner or family member',
  },
  trafficking: {
    label: 'Trafficking',
    description: 'Human trafficking or sex trafficking',
  },
  assault: {
    label: 'Assault',
    description: 'Physical assault (non-sexual)',
  },
  murder: {
    label: 'Murder',
    description: 'Homicide accusation',
  },
  sex_crime_vague: {
    label: 'Sex Crime (Unspecified)',
    description: 'Sexual offense where specific type is unclear from transcript',
  },
  other: {
    label: 'Other',
    description: 'Other crime type not covered by standard categories',
  },
}

/** Definitions for accusation_origin field */
export const ACCUSATION_ORIGIN: Record<string, { label: string; description: string }> = {
  victim_ID: {
    label: 'Victim Identification',
    description: 'Victim names or directly identifies the person as their attacker',
  },
  witness_misID: {
    label: 'Witness Misidentification',
    description: 'Third party points to the person (eyewitness, rumor, informant)',
  },
  squad_inference: {
    label: 'Squad Inference',
    description: 'Detectives\' theory based on pattern matching, proximity, or prior record',
  },
  coerced_interview: {
    label: 'Coerced Interview',
    description: 'Admissions or statements obtained under pressure, threats, or deceptive tactics',
  },
  tech_db_error: {
    label: 'Technical/Database Error',
    description: 'Database match, forensic error, or clerical mistake',
  },
  fabrication: {
    label: 'Fabricated Accusation',
    description: 'Knowingly false claim with proven lie or ulterior motive',
  },
  unknown: {
    label: 'Unknown',
    description: 'Origin of accusation unclear from transcript',
  },
}

/** Definitions for exposure_channel field */
export const EXPOSURE_CHANNEL: Record<string, { label: string; description: string }> = {
  workplace: {
    label: 'Workplace',
    description: 'Employer or coworkers informed or present during accusation/questioning',
  },
  school: {
    label: 'School',
    description: 'School administration, teachers, students, or CPS involved',
  },
  family: {
    label: 'Family',
    description: 'Spouse, parents, children, or relatives told or present',
  },
  media: {
    label: 'Media',
    description: 'Press present, perp walk, or news coverage of accusation',
  },
  church: {
    label: 'Church/Religious',
    description: 'Religious or community leadership informed',
  },
  online: {
    label: 'Online',
    description: 'Social media exposure, doxxing, or viral rumor',
  },
  police_only: {
    label: 'Police Only',
    description: 'Accusation contained to law enforcement with no sign it spread publicly',
  },
  multiple: {
    label: 'Multiple Channels',
    description: 'Exposure through more than one channel',
  },
  legal: {
    label: 'Legal/Court',
    description: 'Exposure through legal proceedings or court system',
  },
  unknown: {
    label: 'Unknown',
    description: 'Exposure channel not determinable from transcript',
  },
}

/** Definitions for exposure_who_told field */
export const EXPOSURE_WHO_TOLD: Record<string, { label: string; description: string }> = {
  squad: {
    label: 'Squad/Police',
    description: 'Detectives or law enforcement directly tell others or confront publicly',
  },
  victim: {
    label: 'Victim',
    description: 'The victim informs others about the accusation',
  },
  third_party: {
    label: 'Third Party',
    description: 'Lawyer, administrator, gossip, CPS, school official, etc.',
  },
  media: {
    label: 'Media',
    description: 'Reporters break or amplify the story',
  },
  unknown: {
    label: 'Unknown',
    description: 'Source of exposure not determinable from transcript',
  },
}

/** Definitions for consequence_category field */
export const CONSEQUENCE_CATEGORY: Record<string, { label: string; description: string }> = {
  work: {
    label: 'Work',
    description: 'Professional consequences (suspension, firing, license review)',
  },
  family: {
    label: 'Family',
    description: 'Family/relationship harm (divorce, custody loss, estrangement)',
  },
  legal: {
    label: 'Legal',
    description: 'Legal consequences (arrest, charges, restraining order)',
  },
  physical: {
    label: 'Physical',
    description: 'Physical harm (assault, vigilante attack, suicide)',
  },
  social: {
    label: 'Social',
    description: 'Social consequences (ostracism, reputation damage, eviction)',
  },
  multiple: {
    label: 'Multiple',
    description: 'Consequences across multiple domains',
  },
}

/** Definitions for consequence_severity field */
export const CONSEQUENCE_SEVERITY: Record<string, { label: string; description: string; color: string }> = {
  '1': {
    label: 'Low Harm',
    description: 'Private questioning; short-term discomfort; implied stigma with no outside audience and no formal sanction',
    color: '#22c55e',
  },
  '2': {
    label: 'Public Exposure',
    description: 'Accused in front of colleagues/family/school/media/online, OR notified behind the scenes but no arrest/suspension/job action yet',
    color: '#eab308',
  },
  '3': {
    label: 'Material Sanction',
    description: 'Suspension, firing, arrest, CPS involvement, breakup/divorce, custody issues, eviction, major online pile-on causing concrete losses',
    color: '#f97316',
  },
  '4': {
    label: 'Life-Altering/Death',
    description: 'Suicide, murder, severe injury, permanent child removal, deportation, career-ending license loss',
    color: '#ef4444',
  },
}

/** Definitions for police_conduct_threat field */
export const POLICE_CONDUCT_THREAT: Record<string, { label: string; description: string }> = {
  none: {
    label: 'None',
    description: 'No threats or coercion from detectives',
  },
  verbal_threat: {
    label: 'Verbal Threat',
    description: '"We\'ll bury you," "We know you did it," or explicit threat of punishment',
  },
  coercive_tactic: {
    label: 'Coercive Tactic',
    description: 'Promises, deception, or intimidation to elicit confession (e.g., false evidence claims)',
  },
  insult_degradation: {
    label: 'Insult/Degradation',
    description: 'Name-calling or moral condemnation ("scum," "pervert") even if not a direct threat',
  },
  multiple: {
    label: 'Multiple Types',
    description: 'More than one type of threatening or coercive behavior',
  },
}

/** Definitions for police_apology field */
export const POLICE_APOLOGY: Record<string, { label: string; description: string }> = {
  none: {
    label: 'None',
    description: 'No apology given to the falsely accused person',
  },
  partial: {
    label: 'Partial',
    description: 'Softened language ("misunderstanding," "sorry for the inconvenience") without true responsibility',
  },
  formal: {
    label: 'Formal',
    description: 'Clear on-screen acknowledgment of wrongful accusation or exposure',
  },
  unknown: {
    label: 'Unknown',
    description: 'Whether an apology occurred is unclear from transcript',
  },
}

/** North Star criteria for inclusion in the dataset */
export const NORTH_STAR_CRITERIA = {
  title: 'North Star Criteria',
  description: 'A person was included in the dataset only if ALL THREE conditions were met:',
  criteria: [
    {
      title: 'Proven or strongly implied innocent',
      description: 'On-screen evidence or explicit statements exonerate them, OR the show clearly pivots away with authority signaling clearance',
    },
    {
      title: 'Public exposure OR physical consequence',
      description: 'Harm extends beyond private police questioning to workplace, family, school, media, church, or online exposure, OR results in physical harm',
    },
    {
      title: 'Harm caused by the accusation',
      description: 'The consequences are a direct result of being accused (not unrelated violence)',
    },
  ],
}

/** Episodes with data quality issues */
export const DATA_QUALITY_ISSUES = [
  {
    episode: 'S14E01',
    issue: 'Missing transcript (empty in source)',
  },
  {
    episode: 'S14E02',
    issue: 'Missing transcript (empty in source)',
  },
  {
    episode: 'S15E01',
    issue: 'Missing transcript (empty in source)',
  },
  {
    episode: 'S17E01',
    issue: 'Missing transcript (empty in source)',
  },
  {
    episode: 'S06E09',
    issue: 'Non-English transcript (Greek characters)',
  },
]

/**
 * Get a formatted label for any coded value
 */
export function getDefinition(
  category: string,
  value: string
): { label: string; description: string } | undefined {
  const maps: Record<string, Record<string, { label: string; description: string }>> = {
    innocence_status: INNOCENCE_STATUS,
    role_in_plot: ROLE_IN_PLOT,
    accused_of: ACCUSED_OF,
    accusation_origin: ACCUSATION_ORIGIN,
    exposure_channel: EXPOSURE_CHANNEL,
    exposure_who_told: EXPOSURE_WHO_TOLD,
    consequence_category: CONSEQUENCE_CATEGORY,
    consequence_severity: CONSEQUENCE_SEVERITY,
    police_conduct_threat: POLICE_CONDUCT_THREAT,
    police_apology: POLICE_APOLOGY,
  }

  const map = maps[category]
  if (!map) return undefined

  return map[value]
}
