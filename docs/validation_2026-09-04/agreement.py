#!/usr/bin/env python3
"""Blind re-coding reliability study (SVU / L&O false-accusation census): scoring script.

Pre-registered in docs/VALIDATION_ANCHORS_2026-09-04.md (sections 3-6). Pure Python 3, no third-party
packages, deterministic (fixed bootstrap seed), exit 0 on success.

Blind guard: exits 2 without opening the original code files unless recoded.jsonl already holds a
judgment for every scored episode. The first successful run is therefore the unblinding moment.

Inputs (same folder unless noted):
  sample.json, replacements.json, recoded.jsonl, hand_matches.json (optional), adjudications.json (optional)
  ../../svu_analysis_complete_fixed.jsonl, ../../lo_analysis_complete.jsonl  (original codes; READ ONLY)
Outputs (same folder): agreement_results.json, disagreements.md
Verify: cd docs/validation_2026-09-04 && python3 agreement.py && echo OK
"""
import json
import os
import random
import re
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
ORIG_FILES = {
    'svu': os.path.join(REPO, 'svu_analysis_complete_fixed.jsonl'),
    'lo': os.path.join(REPO, 'lo_analysis_complete.jsonl'),
}
B = 2000
SEED = 20260904
SEVERITY_LEVELS = [1, 2, 3, 4]

EPISODE_FIELDS = ['has_false_suspect', 'has_public_exposure', 'needs_deep_review']
PERSON_FIELDS = ['innocence_status', 'role_in_plot', 'accused_of', 'accusation_origin', 'exposure_channel',
                 'exposure_who_told', 'consequence_category', 'consequence_severity', 'police_conduct_threat',
                 'police_apology', 'screen_evidence', 'confidence']
LO_ONLY_FIELDS = ['prosecutorial_conduct', 'prosecutorial_apology']
DERIVED_FIELDS = ['any_threat', 'any_apology', 'severe', 'media_or_online', 'beyond_police_only']

STOP = {'dr', 'mr', 'mrs', 'ms', 'miss', 'the', 'of', 'a', 'an', 'and', 'officer', 'detective', 'det',
        'father', 'reverend', 'rev', 'sgt', 'sergeant', 'lt', 'lieutenant', 'captain', 'capt', 'prof',
        'professor', 'ada', 'judge', 'unnamed', 'unknown', 'jr', 'sr', 'iii', 'ii', 'aka', 'monsignor',
        'sister', 'brother', 'uncle', 'aunt', 'coach', 'pastor', 'mother', 'son', 'daughter', 'husband',
        'wife', 'man', 'woman', 'boy', 'girl', 'guy', 'kid', 'his', 'her', 'their', 'in', 'at', 'to', 'for'}


# ----------------------------------------------------------------------------- helpers
def norm_origin(v):
    v = (v or '').strip()
    return {'victim_misID': 'victim_ID', 'third_party': 'witness_misID'}.get(v, v)


def norm_accused(v):
    v = (v or '').strip().lower().replace(' ', '_')
    if v.startswith('kidnap') or v == 'child_abduction' or v == 'abduction':
        return 'kidnapping'
    return v


def norm_person(p):
    q = dict(p)
    q['accusation_origin'] = norm_origin(q.get('accusation_origin'))
    q['accused_of'] = norm_accused(q.get('accused_of'))
    try:
        q['consequence_severity'] = int(q.get('consequence_severity'))
    except (TypeError, ValueError):
        q['consequence_severity'] = None
    for k in PERSON_FIELDS + LO_ONLY_FIELDS:
        if k not in q or q[k] in (None, ''):
            q[k] = q.get(k) if q.get(k) not in (None, '') else 'MISSING'
    # derived binaries used by the papers
    q['any_threat'] = 'Y' if q['police_conduct_threat'] not in ('none', 'unknown', 'MISSING') else 'N'
    q['any_apology'] = 'Y' if q['police_apology'] in ('partial', 'formal') else 'N'
    q['severe'] = 'Y' if q['consequence_severity'] in (3, 4) else 'N'
    q['media_or_online'] = 'Y' if q['exposure_channel'] in ('media', 'online') else 'N'
    q['beyond_police_only'] = 'Y' if q['exposure_channel'] not in ('police_only', 'unknown', 'MISSING') else 'N'
    return q


def tokens(label):
    t = re.sub(r"[^a-z0-9 ]", " ", (label or '').lower()).split()
    return {w for w in t if len(w) >= 3 and w not in STOP}


def percent_agreement(pairs):
    if not pairs:
        return None
    return sum(1 for a, b in pairs if a == b) / len(pairs)


def cohen_kappa(pairs):
    """Unweighted Cohen's kappa; None when expected agreement is 1 (both coders use one category)."""
    n = len(pairs)
    if n == 0:
        return None
    cats = sorted({a for a, _ in pairs} | {b for _, b in pairs}, key=str)
    ra = Counter(a for a, _ in pairs)
    rb = Counter(b for _, b in pairs)
    po = sum(1 for a, b in pairs if a == b) / n
    pe = sum((ra[c] / n) * (rb[c] / n) for c in cats)
    if pe >= 1.0 - 1e-12:
        return None
    return (po - pe) / (1 - pe)


def weighted_kappa_linear(pairs, levels=SEVERITY_LEVELS):
    pairs = [(a, b) for a, b in pairs if a in levels and b in levels]
    n = len(pairs)
    if n == 0:
        return None
    k = len(levels)
    idx = {v: i for i, v in enumerate(levels)}
    ra = Counter(a for a, _ in pairs)
    rb = Counter(b for _, b in pairs)
    num = 0.0
    den = 0.0
    for a, b in pairs:
        num += abs(idx[a] - idx[b]) / (k - 1)
    for i in levels:
        for j in levels:
            den += (abs(idx[i] - idx[j]) / (k - 1)) * (ra[i] / n) * (rb[j] / n)
    den *= n
    if den <= 1e-12:
        return None
    return 1 - num / den


def landis_koch(k):
    if k is None:
        return 'undefined'
    if k >= 0.81:
        return 'strong'
    if k >= 0.61:
        return 'substantial'
    if k >= 0.41:
        return 'moderate'
    if k >= 0.21:
        return 'fair'
    return 'slight_or_none'


def bootstrap_ci(per_episode, episodes, index_sets, stat):
    """per_episode: dict episode -> list of pairs. index_sets: list of B lists of episode indices.
    Returns (lo, hi, n_defined)."""
    vals = []
    for idxs in index_sets:
        pairs = []
        for i in idxs:
            pairs.extend(per_episode.get(episodes[i], []))
        v = stat(pairs)
        if v is not None:
            vals.append(v)
    if len(vals) < 20:
        return None, None, len(vals)
    vals.sort()
    lo = vals[int(0.025 * (len(vals) - 1))]
    hi = vals[int(0.975 * (len(vals) - 1))]
    return lo, hi, len(vals)


def field_report(per_episode, episodes, index_sets, weighted=False):
    pairs = [p for e in episodes for p in per_episode.get(e, [])]
    pa = percent_agreement(pairs)
    kap = cohen_kappa(pairs)
    pa_lo, pa_hi, _ = bootstrap_ci(per_episode, episodes, index_sets, percent_agreement)
    k_lo, k_hi, k_n = bootstrap_ci(per_episode, episodes, index_sets, cohen_kappa)
    out = {
        'n_pairs': len(pairs),
        'percent_agreement': None if pa is None else round(pa, 4),
        'percent_ci95': [None if pa_lo is None else round(pa_lo, 4), None if pa_hi is None else round(pa_hi, 4)],
        'kappa': None if kap is None else round(kap, 4),
        'kappa_ci95': [None if k_lo is None else round(k_lo, 4), None if k_hi is None else round(k_hi, 4)],
        'kappa_ci_replicates_defined': k_n,
        'band': landis_koch(kap),
        'categories_original': dict(Counter(str(a) for a, _ in pairs)),
        'categories_recoded': dict(Counter(str(b) for _, b in pairs)),
    }
    if weighted:
        kw = weighted_kappa_linear(pairs)
        kw_lo, kw_hi, kw_n = bootstrap_ci(per_episode, episodes, index_sets, weighted_kappa_linear)
        out['weighted_kappa_linear'] = None if kw is None else round(kw, 4)
        out['weighted_kappa_ci95'] = [None if kw_lo is None else round(kw_lo, 4),
                                     None if kw_hi is None else round(kw_hi, 4)]
        out['weighted_band'] = landis_koch(kw)
    return out


# ----------------------------------------------------------------------------- main
def main():
    with open(os.path.join(HERE, 'sample.json')) as fh:
        sample = json.load(fh)
    sample_ids = [s['custom_id'] for s in sample['sample']]
    stratum_of = {s['custom_id']: s['stratum'] for s in sample['sample']}
    replaced, replacements = set(), []
    rp = os.path.join(HERE, 'replacements.json')
    if os.path.exists(rp):
        with open(rp) as fh:
            for r in json.load(fh):
                replaced.add(r['replaced'])
                replacements.append(r)
                stratum_of[r['replacement']] = r['stratum']
    scored_ids = [i for i in sample_ids if i not in replaced] + [r['replacement'] for r in replacements]

    # ---- blind guard: every scored id must already be coded before the originals are opened
    recoded = {}
    with open(os.path.join(HERE, 'recoded.jsonl')) as fh:
        for line in fh:
            line = line.strip()
            if line:
                d = json.loads(line)
                recoded[d['custom_id']] = d
    missing = [i for i in scored_ids if i not in recoded]
    if missing:
        sys.stderr.write('BLIND GUARD: %d scored episodes not yet re-coded; refusing to open originals: %s\n'
                         % (len(missing), ', '.join(missing)))
        sys.exit(2)

    # ---- unblinding: load originals
    orig = {}
    for series, path in ORIG_FILES.items():
        with open(path) as fh:
            for line in fh:
                line = line.strip()
                if line:
                    d = json.loads(line)
                    orig[d['custom_id']] = d
    hand = {}
    hp = os.path.join(HERE, 'hand_matches.json')
    if os.path.exists(hp):
        with open(hp) as fh:
            hand = json.load(fh)  # {"episode": {"match": [[orig_label, recoded_label], ...], "no_match": [...]}}
    adjud = {}
    ap = os.path.join(HERE, 'adjudications.json')
    if os.path.exists(ap):
        with open(ap) as fh:
            adjud = json.load(fh)

    svu_ids = [i for i in scored_ids if i.startswith('svu_')]
    sets = {'pooled': scored_ids, 'svu_only': svu_ids, 'lo_only': [i for i in scored_ids if i.startswith('lo_')]}

    # ---- episode-level pairs
    ep_pairs = {f: {} for f in EPISODE_FIELDS}
    ep_disagreements = []
    for e in scored_ids:
        o = orig[e]['episode_summary']
        r = recoded[e]
        for f in EPISODE_FIELDS:
            a, b = str(o.get(f, 'MISSING')), str(r.get(f, 'MISSING'))
            ep_pairs[f][e] = [(a, b)]
            if a != b:
                ep_disagreements.append({'episode': e, 'field': f, 'original': a, 'recoded': b,
                                         'adjudication': adjud.get('%s|%s' % (e, f), '(adjudication pending)')})

    # ---- person matching
    matched = {}          # episode -> list of (orig_row, recoded_row)
    orig_only = {}        # episode -> list of orig rows (in the stats_v2 analysis set) without a match
    recoded_only = {}
    guilty_dropped = {}   # episode -> orig rows dropped because innocence_status == actually_guilty
    count_pairs = {}
    hand_match_log = []
    for e in scored_ids:
        orows_all = [norm_person(p) for p in orig[e]['person_rows']]
        orows = [p for p in orows_all if p['innocence_status'] != 'actually_guilty']
        guilty_dropped[e] = [p for p in orows_all if p['innocence_status'] == 'actually_guilty']
        rrows = [norm_person(p) for p in recoded[e]['person_rows']]
        count_pairs[e] = [(len(orows), len(rrows))]
        used_o, used_r = set(), set()
        pairs = []
        # hand decisions first
        hm = hand.get(e, {})
        for ol, rl in hm.get('match', []):
            oi = next((i for i, p in enumerate(orows) if p['person_label'] == ol and i not in used_o), None)
            ri = next((j for j, p in enumerate(rrows) if p['person_label'] == rl and j not in used_r), None)
            if oi is not None and ri is not None:
                used_o.add(oi)
                used_r.add(ri)
                pairs.append((orows[oi], rrows[ri]))
                hand_match_log.append({'episode': e, 'original': ol, 'recoded': rl, 'rule': 'hand'})
        blocked = {tuple(x) for x in hm.get('no_match', [])}
        # automatic token matching, greedy by shared-token count
        cands = []
        for i, op in enumerate(orows):
            for j, rp_ in enumerate(rrows):
                if i in used_o or j in used_r or (op['person_label'], rp_['person_label']) in blocked:
                    continue
                shared = tokens(op['person_label']) & tokens(rp_['person_label'])
                if shared:
                    cands.append((len(shared), -i, -j, i, j, sorted(shared)))
        cands.sort(reverse=True)
        for _, _, _, i, j, shared in cands:
            if i in used_o or j in used_r:
                continue
            used_o.add(i)
            used_r.add(j)
            pairs.append((orows[i], rrows[j]))
            hand_match_log.append({'episode': e, 'original': orows[i]['person_label'],
                                   'recoded': rrows[j]['person_label'], 'rule': 'token:' + '+'.join(shared)})
        matched[e] = pairs
        orig_only[e] = [p for i, p in enumerate(orows) if i not in used_o]
        recoded_only[e] = [p for j, p in enumerate(rrows) if j not in used_r]

    # ---- person-level pairs per field
    pf_pairs = {f: defaultdict(list) for f in PERSON_FIELDS + LO_ONLY_FIELDS + DERIVED_FIELDS}
    person_disagreements = []
    for e in scored_ids:
        for op, rp_ in matched[e]:
            diffs = {}
            fields = PERSON_FIELDS + DERIVED_FIELDS + (LO_ONLY_FIELDS if e.startswith('lo_') else [])
            for f in fields:
                a, b = op.get(f, 'MISSING'), rp_.get(f, 'MISSING')
                pf_pairs[f][e].append((a, b))
                if a != b:
                    diffs[f] = [a, b]
            if diffs:
                key = '%s|%s|%s' % (e, op['person_label'], rp_['person_label'])
                person_disagreements.append({'episode': e, 'original_label': op['person_label'],
                                             'recoded_label': rp_['person_label'], 'fields': diffs,
                                             'adjudication': adjud.get(key, '(adjudication pending)')})

    # ---- bootstrap index sets (one set per analysis set, same seed, reused across fields: deterministic)
    index_sets = {}
    for name, eps in sets.items():
        rng = random.Random(SEED)
        n = len(eps)
        index_sets[name] = [[rng.randrange(n) for _ in range(n)] for _ in range(B)]

    results = {
        'design': {
            'seed': SEED, 'bootstrap_B': B, 'scored_episodes': len(scored_ids),
            'svu_episodes': len(svu_ids), 'lo_episodes': len(sets['lo_only']),
            'replacements': replacements, 'excluded_from_primary': sorted(replaced),
            'original_rows_dropped_actually_guilty': sum(len(v) for v in guilty_dropped.values()),
            'normalizations': 'victim_misID->victim_ID; third_party (origin)->witness_misID; kidnap variants->kidnapping; '
                              'original actually_guilty rows dropped (stats_v2 analysis set)',
        },
        'episode_level': {}, 'person_inclusion': {}, 'person_level': {},
    }
    for name, eps in sets.items():
        ix = index_sets[name]
        results['episode_level'][name] = {f: field_report(ep_pairs[f], eps, ix) for f in EPISODE_FIELDS}
        # person inclusion
        n_o = sum(len(matched[e]) + len(orig_only[e]) for e in eps)
        n_r = sum(len(matched[e]) + len(recoded_only[e]) for e in eps)
        n_m = sum(len(matched[e]) for e in eps)
        cnt = field_report(count_pairs, eps, ix)
        jac = (lambda pairs: None)  # placeholder to keep structure explicit
        # Jaccard bootstrap: per-episode triples (matched, orig, recoded)
        per_ep_j = {e: [(len(matched[e]), len(matched[e]) + len(orig_only[e]), len(matched[e]) + len(recoded_only[e]))] for e in eps}

        def jaccard(trips):
            m = sum(t[0] for t in trips)
            o = sum(t[1] for t in trips)
            r = sum(t[2] for t in trips)
            d = o + r - m
            return None if d == 0 else m / d
        j_lo, j_hi, _ = bootstrap_ci(per_ep_j, eps, ix, jaccard)
        results['person_inclusion'][name] = {
            'original_persons': n_o, 'recoded_persons': n_r, 'matched_persons': n_m,
            'original_only': n_o - n_m, 'recoded_only': n_r - n_m,
            'jaccard': None if (n_o + n_r - n_m) == 0 else round(n_m / (n_o + n_r - n_m), 4),
            'jaccard_ci95': [None if j_lo is None else round(j_lo, 4), None if j_hi is None else round(j_hi, 4)],
            'per_episode_count_exact_agreement': cnt['percent_agreement'],
            'per_episode_count_ci95': cnt['percent_ci95'],
            'per_episode_count_within_1': round(sum(1 for e in eps if abs(count_pairs[e][0][0] - count_pairs[e][0][1]) <= 1) / len(eps), 4),
            'episodes_both_zero_persons': sum(1 for e in eps if count_pairs[e][0] == (0, 0)),
        }
        fields = PERSON_FIELDS + DERIVED_FIELDS + (LO_ONLY_FIELDS if name != 'svu_only' else [])
        results['person_level'][name] = {f: field_report(pf_pairs[f], eps, ix, weighted=(f == 'consequence_severity'))
                                         for f in fields}

    # ---- flagged duplicate-transcript episode, reported separately (not scored)
    side = {}
    for e in sorted(replaced):
        if e in recoded and e in orig:
            o = orig[e]['episode_summary']
            side[e] = {f: [str(o.get(f)), str(recoded[e].get(f))] for f in EPISODE_FIELDS}
            side[e]['original_person_rows'] = len(orig[e]['person_rows'])
            side[e]['recoded_person_rows'] = len(recoded[e]['person_rows'])
            side[e]['note'] = recoded[e].get('recoder_notes', '')
    results['excluded_duplicate_transcript_episode'] = side

    # ---- unmatched persons and decision rule summary
    results['unmatched_persons'] = {
        'original_only': [{'episode': e, 'label': p['person_label'], 'innocence_status': p['innocence_status'],
                           'severity': p['consequence_severity'], 'channel': p['exposure_channel'],
                           'adjudication': adjud.get('%s|orig_only|%s' % (e, p['person_label']), '(adjudication pending)')}
                          for e in scored_ids for p in orig_only[e]],
        'recoded_only': [{'episode': e, 'label': p['person_label'], 'innocence_status': p['innocence_status'],
                          'severity': p['consequence_severity'], 'channel': p['exposure_channel'],
                          'adjudication': adjud.get('%s|recoded_only|%s' % (e, p['person_label']), '(adjudication pending)')}
                         for e in scored_ids for p in recoded_only[e]],
        'original_actually_guilty_dropped': [{'episode': e, 'label': p['person_label']} for e in scored_ids for p in guilty_dropped[e]],
    }
    results['match_log'] = hand_match_log
    low = []
    for name in ('svu_only', 'pooled'):
        for f, rep in results['person_level'][name].items():
            if rep['kappa'] is not None and rep['kappa'] < 0.61:
                low.append({'set': name, 'field': f, 'kappa': rep['kappa']})
        for f, rep in results['episode_level'][name].items():
            if rep['kappa'] is not None and rep['kappa'] < 0.61:
                low.append({'set': name, 'field': f, 'kappa': rep['kappa']})
    results['fields_below_0_61'] = low
    results['n_adjudications_pending'] = sum(1 for d in ep_disagreements + person_disagreements if d['adjudication'] == '(adjudication pending)') + \
        sum(1 for d in results['unmatched_persons']['original_only'] + results['unmatched_persons']['recoded_only'] if d['adjudication'] == '(adjudication pending)')

    with open(os.path.join(HERE, 'agreement_results.json'), 'w') as fh:
        json.dump(results, fh, indent=1, sort_keys=True)

    # ---- disagreements.md
    L = []
    L.append('# Disagreements: blind re-coding vs original codes (2026-09-04 study)\n')
    L.append('Generated by agreement.py. Original data files are NOT changed by adjudication; notes are for the reader.\n')
    L.append('Scored episodes: %d (SVU %d, L&O %d). Excluded from primary scoring: %s (see results JSON).\n'
             % (len(scored_ids), len(svu_ids), len(sets['lo_only']), ', '.join(sorted(replaced)) or 'none'))
    L.append('\n## A. Episode-level disagreements (%d)\n' % len(ep_disagreements))
    L.append('| episode | field | original | re-coded | adjudication |')
    L.append('|---|---|---|---|---|')
    for d in ep_disagreements:
        L.append('| %s | %s | %s | %s | %s |' % (d['episode'], d['field'], d['original'], d['recoded'], d['adjudication']))
    L.append('\n## B. Persons found by only one coder\n')
    L.append('### B1. Original only (%d)\n' % len(results['unmatched_persons']['original_only']))
    L.append('| episode | original label | status | severity | channel | adjudication |')
    L.append('|---|---|---|---|---|---|')
    for d in results['unmatched_persons']['original_only']:
        L.append('| %s | %s | %s | %s | %s | %s |' % (d['episode'], d['label'], d['innocence_status'], d['severity'], d['channel'], d['adjudication']))
    L.append('\n### B2. Re-coded only (%d)\n' % len(results['unmatched_persons']['recoded_only']))
    L.append('| episode | re-coded label | status | severity | channel | adjudication |')
    L.append('|---|---|---|---|---|---|')
    for d in results['unmatched_persons']['recoded_only']:
        L.append('| %s | %s | %s | %s | %s | %s |' % (d['episode'], d['label'], d['innocence_status'], d['severity'], d['channel'], d['adjudication']))
    L.append('\n### B3. Original rows outside the stats_v2 analysis set (actually_guilty; not scored) (%d)\n' % len(results['unmatched_persons']['original_actually_guilty_dropped']))
    for d in results['unmatched_persons']['original_actually_guilty_dropped']:
        L.append('- %s: %s' % (d['episode'], d['label']))
    L.append('\n## C. Matched persons with at least one field disagreement (%d of %d matched pairs)\n'
             % (len(person_disagreements), sum(len(v) for v in matched.values())))
    for d in person_disagreements:
        L.append('- **%s** | original: %s | re-coded: %s' % (d['episode'], d['original_label'], d['recoded_label']))
        for f, (a, b) in d['fields'].items():
            L.append('    - %s: original=`%s` re-coded=`%s`' % (f, a, b))
        L.append('    - adjudication: %s' % d['adjudication'])
    L.append('\n## D. Person match log (how each pair was formed)\n')
    for m in hand_match_log:
        L.append('- %s: "%s" = "%s" [%s]' % (m['episode'], m['original'], m['recoded'], m['rule']))
    with open(os.path.join(HERE, 'disagreements.md'), 'w') as fh:
        fh.write('\n'.join(L) + '\n')

    # ---- console summary
    print('agreement.py: scored %d episodes (SVU %d, L&O %d); matched persons %d; orig-only %d; recoded-only %d'
          % (len(scored_ids), len(svu_ids), len(sets['lo_only']), results['person_inclusion']['pooled']['matched_persons'],
             results['person_inclusion']['pooled']['original_only'], results['person_inclusion']['pooled']['recoded_only']))
    for name in ('svu_only', 'pooled'):
        print('--- %s' % name)
        for f in EPISODE_FIELDS:
            r = results['episode_level'][name][f]
            print('  [episode] %-22s n=%3d pct=%.3f kappa=%s CI=%s %s' % (f, r['n_pairs'], r['percent_agreement'], r['kappa'], r['kappa_ci95'], r['band']))
        pi = results['person_inclusion'][name]
        print('  [persons] orig=%d recoded=%d matched=%d jaccard=%s CI=%s count-exact=%s' % (pi['original_persons'], pi['recoded_persons'], pi['matched_persons'], pi['jaccard'], pi['jaccard_ci95'], pi['per_episode_count_exact_agreement']))
        for f, r in results['person_level'][name].items():
            extra = ''
            if f == 'consequence_severity':
                extra = ' weighted=%s CI=%s' % (r.get('weighted_kappa_linear'), r.get('weighted_kappa_ci95'))
            print('  [person ] %-22s n=%3d pct=%s kappa=%s CI=%s %s%s' % (f, r['n_pairs'], r['percent_agreement'], r['kappa'], r['kappa_ci95'], r['band'], extra))
    print('fields below kappa 0.61 (svu_only/pooled): %d; adjudications pending: %d' % (len(low), results['n_adjudications_pending']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
