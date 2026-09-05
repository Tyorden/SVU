#!/usr/bin/env python3
"""Deterministic stratified sample for the 2026-09-04 blind re-coding reliability study.

Writes sample.json (ids + strata + replacement lists) next to this file and extracts each sampled
transcript to the scratchpad transcripts folder. Reads ONLY the source transcripts, never the coded
output. Re-running reproduces sample.json byte for byte (seed 20260904).
"""
import json, os, random, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SEED = 20260904
XLSX = '/Users/tylerorden/Downloads/Law and Order SVU all Transcripts.xlsx'
LO_INPUT = '/Users/tylerorden/Desktop/LO/lo_batch_input.jsonl'
OUT_TX = ('/private/tmp/claude-501/-Users-tylerorden-Desktop-SVU/2b6a75c5-654e-4357-957c-ab65c6d4af4a'
          '/scratchpad/validation/transcripts')

CORRUPTED = {'s01e13','s02e11','s02e18','s04e10','s05e04','s05e14','s08e11','s09e19','s11e09'}
NO_SOURCE = {'s14e01','s14e02','s15e01','s17e01','s06e09'}
CONTAMINATED = set("""s01e01 s01e04 s01e08 s01e12 s01e15 s02e08 s02e10 s02e19 s03e01 s03e04 s03e19 s04e05
s04e13 s04e21 s04e23 s05e05 s05e11 s05e23 s06e14 s06e15 s06e19 s06e20 s09e08 s10e02 s10e06 s10e20 s11e13
s12e03 s12e10 s12e12 s12e15 s12e19 s13e09 s13e17 s15e03 s15e09 s15e11 s15e13 s15e17 s16e13 s17e05 s17e17
s18e02 s18e08 s18e10 s18e17 s19e07 s20e09 s20e13 s20e20 s20e21 s21e05 s21e06 s22e07 s22e10 s26e08 s26e19""".split())
LO_CONTAMINATED = {'lo_s01_e01'}


def svu_key(s, e):
    return 's%02de%02d' % (int(float(s)), int(float(e)))


def load_svu():
    import openpyxl
    wb = openpyxl.load_workbook(XLSX, read_only=True)
    ws = wb.worksheets[0]
    rows = ws.iter_rows(values_only=True)
    hdr = [h.strip() if isinstance(h, str) else h for h in next(rows)]
    eps = {}
    for r in rows:
        d = dict(zip(hdr, r))
        s, e = d.get('Season'), d.get('Episode')
        if s is None or e is None or str(s).strip() == '':
            continue
        k = svu_key(s, e)
        eps[k] = {'season': int(float(s)), 'episode': int(float(e)),
                  'title': str(d.get('Title') or '').strip(), 'text': str(d.get('text') or '')}
    return eps


def load_lo():
    eps = {}
    with open(LO_INPUT) as fh:
        for line in fh:
            r = json.loads(line)
            cid = r['custom_id']
            msg = r['params']['messages'][0]['content']
            msg = msg if isinstance(msg, str) else msg[0]['text']
            m = re.search(r'\*\*Season (\d+), Episode (\d+): (.*?)\*\*', msg)
            body = msg.split('=== TRANSCRIPT START ===', 1)[1].split('=== TRANSCRIPT END ===', 1)[0]
            eps[cid] = {'season': int(m.group(1)), 'episode': int(m.group(2)), 'title': m.group(3).strip(),
                        'text': body.strip('\n')}
    return eps


def allocate(total, sizes, minimum):
    keys = list(sizes)
    n = sum(sizes[k] for k in keys)
    raw = {k: total * sizes[k] / n for k in keys}
    alloc = {k: max(minimum, int(raw[k])) for k in keys}
    while sum(alloc.values()) < total:
        k = max(keys, key=lambda k: (raw[k] - alloc[k], k))
        alloc[k] += 1
    while sum(alloc.values()) > total:
        k = min((k for k in keys if alloc[k] > minimum), key=lambda k: (raw[k] - alloc[k], k))
        alloc[k] -= 1
    return alloc


def svu_stratum(season):
    return 'svu_pre_S1-18' if season <= 18 else ('svu_metoo_S19-21' if season <= 21 else 'svu_post_S22-27')


def lo_stratum(season):
    return 'lo_1990s_S1-9' if season <= 9 else ('lo_2000s_S11-20' if season <= 20 else 'lo_revival_S21-23')


def main():
    rng = random.Random(SEED)
    svu = load_svu(); lo = load_lo()
    svu_frame = {k: v for k, v in svu.items() if k not in CORRUPTED | NO_SOURCE | CONTAMINATED}
    lo_frame = {k: v for k, v in lo.items() if k not in LO_CONTAMINATED}
    strata = {}
    for k, v in svu_frame.items():
        strata.setdefault(svu_stratum(v['season']), []).append('svu_' + k[:3] + '_' + k[3:])
    for k, v in lo_frame.items():
        strata.setdefault(lo_stratum(v['season']), []).append(k)
    for s in strata:
        strata[s].sort()
    svu_alloc = allocate(60, {s: len(v) for s, v in strata.items() if s.startswith('svu')}, 5)
    lo_alloc = allocate(30, {s: len(v) for s, v in strata.items() if s.startswith('lo')}, 3)
    alloc = {**svu_alloc, **lo_alloc}
    sample, replacements = [], {}
    for s in sorted(strata):  # sorted stratum order fixes the RNG consumption order
        draw = rng.sample(strata[s], alloc[s] + 5)
        for cid in draw[:alloc[s]]:
            sample.append({'custom_id': cid, 'stratum': s})
        replacements[s] = draw[alloc[s]:]
    out = {'seed': SEED, 'frame_sizes': {s: len(v) for s, v in sorted(strata.items())}, 'allocation': alloc,
           'svu_frame_exclusions': {'corrupted': sorted(CORRUPTED), 'no_source': sorted(NO_SOURCE),
                                    'contaminated': sorted(CONTAMINATED)},
           'lo_frame_exclusions': sorted(LO_CONTAMINATED),
           'sample': sample, 'replacements': replacements}
    # transcripts
    os.makedirs(OUT_TX, exist_ok=True)
    lengths = {}
    for item in sample + [{'custom_id': c, 'stratum': s} for s, cs in replacements.items() for c in cs]:
        cid = item['custom_id']
        if cid.startswith('svu_'):
            k = cid[4:].replace('_', '')
            v = svu[k]; series = 'Law & Order: SVU'
        else:
            v = lo[cid]; series = 'Law & Order'
        header = '%s | Season %d Episode %d | %s\n%s\n' % (series, v['season'], v['episode'], v['title'], '=' * 72)
        with open(os.path.join(OUT_TX, cid + '.txt'), 'w') as fh:
            fh.write(header + v['text'] + '\n')
        lengths[cid] = len(v['text'])
    for item in sample:
        item['transcript_chars'] = lengths[item['custom_id']]
        item['near_excel_cap'] = lengths[item['custom_id']] >= 32700
    with open(os.path.join(HERE, 'sample.json'), 'w') as fh:
        json.dump(out, fh, indent=1, sort_keys=True)
    print('frame sizes', out['frame_sizes']); print('allocation', alloc)
    print('sampled', len(sample), 'transcripts written to', OUT_TX)
    print('near-cap in sample:', sum(1 for i in sample if i['near_excel_cap']))
    return 0


if __name__ == '__main__':
    sys.exit(main())
