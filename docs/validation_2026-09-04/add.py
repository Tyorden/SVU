#!/usr/bin/env python3
"""Append one validated re-coding line to recoded.jsonl, then print the NEXT uncoded transcript.

Usage: python3 add.py < judgment.json      (stdin = one JSON object; use "-" to skip appending)
       python3 add.py --next               (print the next uncoded transcript only)
Never opens the original coded output. Refuses duplicates and off-vocabulary values.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
TX = ('/private/tmp/claude-501/-Users-tylerorden-Desktop-SVU/2b6a75c5-654e-4357-957c-ab65c6d4af4a'
      '/scratchpad/validation/transcripts')
OUT = os.path.join(HERE, 'recoded.jsonl')

VOCAB = {
    'has_false_suspect': {'Y', 'N', 'Maybe'}, 'has_public_exposure': {'Y', 'N', 'Maybe'},
    'needs_deep_review': {'Y', 'N'},
    'innocence_status': {'proven_innocent', 'strongly_implied_innocent', 'partially_involved'},
    'role_in_plot': {'initial_suspect', 'red_herring', 'family_member', 'colleague', 'community_member',
                     'other', 'witness', 'defendant'},
    'accusation_origin': {'victim_ID', 'witness_misID', 'squad_inference', 'coerced_interview',
                          'tech_db_error', 'fabrication', 'unknown', 'prosecutorial_theory'},
    'exposure_channel': {'workplace', 'school', 'family', 'media', 'church', 'online', 'police_only',
                         'unknown', 'courtroom', 'political', 'community'},
    'exposure_who_told': {'squad', 'victim', 'third_party', 'media', 'unknown', 'prosecution', 'defense'},
    'consequence_category': {'work', 'family', 'legal', 'physical', 'social', 'multiple', 'political',
                             'financial'},
    'consequence_severity': {1, 2, 3, 4},
    'screen_evidence': {'on_screen', 'stated', 'implied', 'off_screen'},
    'confidence': {'high', 'medium', 'low'},
    'police_conduct_threat': {'none', 'verbal_threat', 'coercive_tactic', 'insult_degradation', 'multiple'},
    'police_apology': {'none', 'partial', 'formal', 'unknown'},
    'prosecutorial_conduct': {'none', 'overreach', 'misconduct', 'zealous_but_fair', 'dropped_appropriately'},
    'prosecutorial_apology': {'none', 'partial', 'formal', 'unknown'},
}
PERSON_REQ = ['person_label', 'role_in_plot', 'accused_of', 'innocence_status', 'accusation_origin',
              'exposure_channel', 'exposure_who_told', 'consequence_category', 'consequence_detail',
              'consequence_severity', 'police_conduct_threat', 'police_apology', 'screen_evidence',
              'confidence', 'quote_or_scene']


def sample_ids():
    with open(os.path.join(HERE, 'sample.json')) as fh:
        ids = [i['custom_id'] for i in json.load(fh)['sample']]
    rp = os.path.join(HERE, 'replacements.json')
    if os.path.exists(rp):
        for r in json.load(open(rp)):
            ids.append(r['replacement'])   # replaced id stays codable; replacement added
    return ids


def coded_ids():
    if not os.path.exists(OUT):
        return []
    with open(OUT) as fh:
        return [json.loads(l)['custom_id'] for l in fh if l.strip()]


def validate(j):
    errs = []
    for k in ['custom_id', 'has_false_suspect', 'has_public_exposure', 'needs_deep_review', 'summary',
              'person_rows', 'recoder_notes']:
        if k not in j:
            errs.append('missing ' + k)
    for k in ['has_false_suspect', 'has_public_exposure', 'needs_deep_review']:
        if j.get(k) not in VOCAB[k]:
            errs.append('%s=%r off vocab' % (k, j.get(k)))
    lo = j.get('custom_id', '').startswith('lo_')
    for i, p in enumerate(j.get('person_rows', [])):
        req = PERSON_REQ + (['prosecutorial_conduct', 'prosecutorial_apology'] if lo else [])
        for k in req:
            if k not in p:
                errs.append('row %d missing %s' % (i, k))
        for k, vals in VOCAB.items():
            if k in p and p[k] not in vals:
                errs.append('row %d %s=%r off vocab' % (i, k, p[k]))
    return errs


def main():
    ids = sample_ids()
    done = coded_ids()
    if len(sys.argv) < 2 or sys.argv[1] != '--next':
        raw = sys.stdin.read().strip()
        if raw and raw != '-':
            j = json.loads(raw)
            errs = validate(j)
            if errs:
                print('REJECTED:', '; '.join(errs)); return 1
            if j['custom_id'] in done:
                print('REJECTED: duplicate', j['custom_id']); return 1
            if j['custom_id'] not in ids:
                print('REJECTED: not in sample', j['custom_id']); return 1
            with open(OUT, 'a') as fh:
                fh.write(json.dumps(j, ensure_ascii=False) + '\n')
            done.append(j['custom_id'])
            print('APPENDED %s (%d rows). Coded %d/%d.' % (j['custom_id'], len(j['person_rows']), len(done), len(ids)))
    remaining = [i for i in ids if i not in done]
    if not remaining:
        print('ALL %d CODED.' % len(ids)); return 0
    nxt = remaining[0]
    print('NEXT (%d remaining): %s' % (len(remaining), nxt))
    src = os.path.join(TX, nxt + '.txt'); dst = os.path.join(TX, nxt + '.flow.txt')
    lines = open(src).read().split('\n')
    out, cur = [], ''
    for ln in lines[:2]:
        out.append(ln)
    for ln in lines[2:]:
        t = ln.strip()
        if not t:
            continue
        is_label = re.match(r'^\(?[A-Z][A-Za-z .\'-]{0,30}\)?:$', t) or re.match(r'^[A-Z][A-Za-z .\'-]{0,30}:\s', t)
        if is_label or len(cur) + len(t) + 1 > 110:
            if cur:
                out.append(cur)
            cur = t
        else:
            cur = (cur + ' ' + t) if cur else t
    if cur:
        out.append(cur)
    open(dst, 'w').write('\n'.join(out) + '\n')
    print('READ:', dst, '(%d lines, %d chars)' % (len(out), sum(len(o) + 1 for o in out)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
