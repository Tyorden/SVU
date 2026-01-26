const persons = require('./src/data/persons.json');
const episodes = require('./src/data/episodes.json');

console.log('=== DATA EXPLORATION ===\n');

// 1. Most common tags
const tagCounts = {};
persons.forEach(p => {
  if (p.tags) {
    p.tags.split(';').forEach(tag => {
      const t = tag.trim();
      if (t) tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  }
});
console.log('TOP 15 TAGS:');
Object.entries(tagCounts).sort((a,b) => b[1] - a[1]).slice(0, 15).forEach(([tag, count]) => {
  console.log('  ' + tag + ': ' + count);
});

// 2. Consequence details
const consequenceDetails = {};
persons.forEach(p => {
  if (p.consequence_detail) {
    consequenceDetails[p.consequence_detail] = (consequenceDetails[p.consequence_detail] || 0) + 1;
  }
});
console.log('\nTOP 15 CONSEQUENCE DETAILS:');
Object.entries(consequenceDetails).sort((a,b) => b[1] - a[1]).slice(0, 15).forEach(([detail, count]) => {
  console.log('  ' + detail + ': ' + count);
});

// 3. Role in plot distribution
const roles = {};
persons.forEach(p => {
  roles[p.role_in_plot || 'unknown'] = (roles[p.role_in_plot || 'unknown'] || 0) + 1;
});
console.log('\nROLE IN PLOT:');
Object.entries(roles).sort((a,b) => b[1] - a[1]).forEach(([role, count]) => {
  console.log('  ' + role + ': ' + count);
});

// 4. Severity by role
console.log('\nAVERAGE SEVERITY BY ROLE:');
const rolesSev = {};
persons.forEach(p => {
  const role = p.role_in_plot || 'unknown';
  const sev = parseInt(p.consequence_severity);
  if (!rolesSev[role]) rolesSev[role] = { total: 0, sum: 0 };
  if (!isNaN(sev)) {
    rolesSev[role].total++;
    rolesSev[role].sum += sev;
  }
});
Object.entries(rolesSev).forEach(([role, data]) => {
  const avg = (data.sum / data.total).toFixed(2);
  console.log('  ' + role + ': avg=' + avg + ' (n=' + data.total + ')');
});

// 5. Apology rate by threat type
console.log('\nAPOLOGY RATE BY THREAT TYPE:');
const threatApology = {};
persons.forEach(p => {
  const threat = p.police_conduct_threat || 'none';
  const apology = p.police_apology || 'none';
  if (!threatApology[threat]) threatApology[threat] = { total: 0, none: 0, partial: 0, formal: 0 };
  threatApology[threat].total++;
  threatApology[threat][apology] = (threatApology[threat][apology] || 0) + 1;
});
Object.entries(threatApology).forEach(([threat, data]) => {
  const apologyRate = (((data.partial || 0) + (data.formal || 0)) / data.total * 100).toFixed(1);
  console.log('  ' + threat + ': ' + apologyRate + '% got apology (n=' + data.total + ')');
});

// 6. Severity trends by season (early vs late)
console.log('\nSEVERITY BY ERA:');
const earlySev = { total: 0, sum: 0 };
const midSev = { total: 0, sum: 0 };
const lateSev = { total: 0, sum: 0 };
persons.forEach(p => {
  const season = parseInt(p.season);
  const sev = parseInt(p.consequence_severity);
  if (!isNaN(season) && !isNaN(sev)) {
    if (season <= 9) {
      earlySev.total++;
      earlySev.sum += sev;
    } else if (season <= 18) {
      midSev.total++;
      midSev.sum += sev;
    } else {
      lateSev.total++;
      lateSev.sum += sev;
    }
  }
});
console.log('  Early (S1-9): avg=' + (earlySev.sum / earlySev.total).toFixed(2) + ' (n=' + earlySev.total + ')');
console.log('  Mid (S10-18): avg=' + (midSev.sum / midSev.total).toFixed(2) + ' (n=' + midSev.total + ')');
console.log('  Late (S19-27): avg=' + (lateSev.sum / lateSev.total).toFixed(2) + ' (n=' + lateSev.total + ')');

// 7. Physical harm cases
console.log('\nPHYSICAL HARM BREAKDOWN:');
const physicalHarm = persons.filter(p =>
  p.consequence_category === 'physical' ||
  (p.tags && (p.tags.includes('ruined_physically') || p.tags.includes('suicide') || p.tags.includes('murdered')))
);
console.log('  Total physical harm cases: ' + physicalHarm.length);
const physicalDetails = {};
physicalHarm.forEach(p => {
  physicalDetails[p.consequence_detail] = (physicalDetails[p.consequence_detail] || 0) + 1;
});
Object.entries(physicalDetails).sort((a,b) => b[1] - a[1]).slice(0, 10).forEach(([detail, count]) => {
  console.log('    ' + detail + ': ' + count);
});

// 8. Fabricated vs other origins - severity comparison
console.log('\nACCUSATION ORIGIN vs AVERAGE SEVERITY:');
const originSev = {};
persons.forEach(p => {
  const origin = p.accusation_origin || 'unknown';
  const sev = parseInt(p.consequence_severity);
  if (!originSev[origin]) originSev[origin] = { total: 0, sum: 0 };
  if (!isNaN(sev)) {
    originSev[origin].total++;
    originSev[origin].sum += sev;
  }
});
Object.entries(originSev).sort((a,b) => (b[1].sum/b[1].total) - (a[1].sum/a[1].total)).forEach(([origin, data]) => {
  console.log('  ' + origin + ': avg=' + (data.sum / data.total).toFixed(2) + ' (n=' + data.total + ')');
});

// 9. Multiple persons per episode
console.log('\nEPISODES WITH MULTIPLE PERSONS HARMED:');
const episodeCounts = {};
persons.forEach(p => {
  episodeCounts[p.custom_id] = (episodeCounts[p.custom_id] || 0) + 1;
});
const multiPerson = Object.entries(episodeCounts).filter(([_, count]) => count > 1);
console.log('  Episodes with 2+ persons: ' + multiPerson.length);
console.log('  Episodes with 3+ persons: ' + multiPerson.filter(([_, c]) => c >= 3).length);
console.log('  Max persons in one episode: ' + Math.max(...Object.values(episodeCounts)));

// 10. Who exposed vs severity
console.log('\nWHO EXPOSED vs AVERAGE SEVERITY:');
const whoSev = {};
persons.forEach(p => {
  const who = p.exposure_who_told || 'unknown';
  const sev = parseInt(p.consequence_severity);
  if (!whoSev[who]) whoSev[who] = { total: 0, sum: 0 };
  if (!isNaN(sev)) {
    whoSev[who].total++;
    whoSev[who].sum += sev;
  }
});
Object.entries(whoSev).sort((a,b) => (b[1].sum/b[1].total) - (a[1].sum/a[1].total)).forEach(([who, data]) => {
  console.log('  ' + who + ': avg=' + (data.sum / data.total).toFixed(2) + ' (n=' + data.total + ')');
});

// 11. Accusation type vs exposure channel
console.log('\nACCUSED OF vs MOST COMMON EXPOSURE:');
const accusedExposure = {};
persons.forEach(p => {
  const accused = p.accused_of || 'unknown';
  const channel = p.exposure_channel || 'unknown';
  if (!accusedExposure[accused]) accusedExposure[accused] = {};
  accusedExposure[accused][channel] = (accusedExposure[accused][channel] || 0) + 1;
});
Object.entries(accusedExposure).forEach(([accused, channels]) => {
  const total = Object.values(channels).reduce((a, b) => a + b, 0);
  const top = Object.entries(channels).sort((a,b) => b[1] - a[1])[0];
  console.log('  ' + accused + ' (n=' + total + '): most common = ' + top[0] + ' (' + ((top[1]/total)*100).toFixed(0) + '%)');
});

// 12. Innocence status breakdown
console.log('\nINNOCENCE STATUS:');
const innocence = {};
persons.forEach(p => {
  innocence[p.innocence_status || 'unknown'] = (innocence[p.innocence_status || 'unknown'] || 0) + 1;
});
Object.entries(innocence).sort((a,b) => b[1] - a[1]).forEach(([status, count]) => {
  console.log('  ' + status + ': ' + count + ' (' + ((count/persons.length)*100).toFixed(1) + '%)');
});

// 13. Tags analysis - interesting combos
console.log('\nINTERESTING TAG PATTERNS:');
const wrongId = persons.filter(p => p.tags && p.tags.includes('wrong_ID')).length;
const publicConfront = persons.filter(p => p.tags && p.tags.includes('public_confrontation')).length;
const arrested = persons.filter(p => p.tags && p.tags.includes('arrested')).length;
const perpWalk = persons.filter(p => p.tags && p.tags.includes('perp_walk')).length;
const coerced = persons.filter(p => p.tags && p.tags.includes('coerced_confession')).length;
const fabricated = persons.filter(p => p.tags && p.tags.includes('fabricated_claim')).length;
const recanted = persons.filter(p => p.tags && p.tags.includes('witness_recant')).length;
console.log('  Wrong ID: ' + wrongId);
console.log('  Public Confrontation: ' + publicConfront);
console.log('  Arrested: ' + arrested);
console.log('  Perp Walk: ' + perpWalk);
console.log('  Coerced Confession: ' + coerced);
console.log('  Fabricated Claim: ' + fabricated);
console.log('  Witness Recanted: ' + recanted);
