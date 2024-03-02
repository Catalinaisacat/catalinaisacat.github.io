from collections import defaultdict
import json
from copy import deepcopy


# 1. find all the solutions, enumerate
# 2. constrain tree structure
# 3. solution: node whose all the offspring terminals are in state 'win'

def is_legal(p):
    if isinstance(p, int) or isinstance(p, float):
        return 0 <= p <= 35
    elif isinstance(p, list) or isinstance(p, tuple):
        return 0 <= p[0] <= 3 and 0 <= p[1] <= 8
    else:
        return False


def coordinate_to_index(x, y):
    if is_legal((x, y)):
        return x * 9 + y
    else:
        return -1


def index_to_coordinate(idx):
    if is_legal(idx):
        return idx // 9, idx % 9
    else:
        return -1


def prepare_legal_patterns():
    patterns = {}
    two_in_a_row = defaultdict(set)
    three_in_a_row = defaultdict(set)
    four_in_a_row = defaultdict(list)
    reversed_three_in_a_row = defaultdict(set)
    reversed_four_in_a_row = defaultdict(list)

    prob_four_in_a_row = []
    for y in range(9):
        for x in range(4):
            prob_four_in_a_row.append([(x, y), (x, y + 1), (x, y + 2), (x, y + 3)])
        prob_four_in_a_row.append([(k, y) for k in range(4)])
        prob_four_in_a_row.append([(k, y + k) for k in range(4)])
        prob_four_in_a_row.append([(k, y + 3 - k) for k in range(4)])

    all_three_in_a_row = []
    all_four_in_a_row = []
    for pos in prob_four_in_a_row:
        if all([is_legal(p) for p in pos]):
            idxes = [coordinate_to_index(*p) for p in pos]
            for (i, j) in [(0, 1), (0, 2), (0, 3), (1, 2), (1, 3), (2, 3)]:
                two_in_a_row[idxes[i]].add(idxes[j])
                two_in_a_row[idxes[j]].add(idxes[i])
            for (i, j, k) in [(0, 1, 2), (0, 2, 3), (0, 1, 3), (1, 2, 3)]:
                all_three_in_a_row.append((idxes[i], idxes[j], idxes[k]))
                three_in_a_row[idxes[i]].add((idxes[j], idxes[k]))
                three_in_a_row[idxes[j]].add((idxes[i], idxes[k]))
                three_in_a_row[idxes[k]].add((idxes[i], idxes[j]))
                reversed_three_in_a_row[f'{idxes[j]}-{idxes[k]}'].add(idxes[i])
                reversed_three_in_a_row[f'{idxes[i]}-{idxes[k]}'].add(idxes[j])
                reversed_three_in_a_row[f'{idxes[i]}-{idxes[j]}'].add(idxes[k])

            all_four_in_a_row.append(idxes)
            four_in_a_row[idxes[0]].append([idxes[1], idxes[2], idxes[3]])
            four_in_a_row[idxes[1]].append([idxes[0], idxes[2], idxes[3]])
            four_in_a_row[idxes[2]].append([idxes[0], idxes[1], idxes[3]])
            four_in_a_row[idxes[3]].append([idxes[0], idxes[1], idxes[2]])
            reversed_four_in_a_row[f'{idxes[1]}-{idxes[2]}-{idxes[3]}'].append(idxes[0])
            reversed_four_in_a_row[f'{idxes[0]}-{idxes[2]}-{idxes[3]}'].append(idxes[1])
            reversed_four_in_a_row[f'{idxes[0]}-{idxes[1]}-{idxes[3]}'].append(idxes[2])
            reversed_four_in_a_row[f'{idxes[0]}-{idxes[1]}-{idxes[2]}'].append(idxes[3])

    patterns['all_three_in_a_row'] = all_three_in_a_row
    patterns['all_four_in_a_row'] = all_four_in_a_row
    patterns['two_in_a_row'] = {k: list(v) for k, v in two_in_a_row.items()}
    patterns['three_in_a_row'] = {k: [list(i) for i in v] for k, v in three_in_a_row.items()}
    patterns['four_in_a_row'] = four_in_a_row
    patterns['reversed_three_in_a_row'] = {k: list(v) for k, v in reversed_three_in_a_row.items()}
    patterns['reversed_four_in_a_row'] = reversed_four_in_a_row
    json.dump(patterns, open('patterns.json', 'w'), indent=4)


def load_pattern_book():
    book = json.load(open('./modules/patterns.json', 'r'))

    two_in_a_row = {}
    for k, v in book['two_in_a_row'].items():
        two_in_a_row[int(k)] = v

    three_in_a_row = {}
    for k, v in book['three_in_a_row'].items():
        three_in_a_row[int(k)] = v

    four_in_a_row = {}
    for k, v in book['four_in_a_row'].items():
        four_in_a_row[int(k)] = v

    reversed_three_in_a_row = {}
    for k, v in book['reversed_three_in_a_row'].items():
        reversed_three_in_a_row[tuple([int(s) for s in k.split('-')])] = v

    reversed_four_in_a_row = {}
    for k, v in book['reversed_four_in_a_row'].items():
        reversed_four_in_a_row[tuple([int(s) for s in k.split('-')])] = v

    book['two_in_a_row'] = two_in_a_row
    book['three_in_a_row'] = three_in_a_row
    book['four_in_a_row'] = four_in_a_row
    book['reversed_three_in_a_row'] = reversed_three_in_a_row
    book['reversed_four_in_a_row'] = reversed_four_in_a_row

    return book


def init_two_in_a_row(pieces, opponent, feature_book, pattern_book):
    feature_book['all_two_in_a_row'] = []
    for i in range(len(pieces)):
        for j in range(1, len(pieces)):
            p1 = pieces[i]
            p2 = pieces[j]
            if p2 not in pattern_book['two_in_a_row'][p1]:
                continue

            pair = tuple(sorted([p1, p2]))
            if pair[1] - pair[0] in [1, 8, 9, 10]:
                pre = 2 * pair[0] - pair[1]
                post = 2 * pair[1] - pair[0]
                if (pre in opponent or not is_legal(pre)) and (post in opponent or not is_legal(post)):
                    continue
            elif pair[1] - pair[0] in [2, 16, 18, 20]:
                d = (pair[1] - pair[0]) / 2
                pre = pair[0] - d
                mid = pair[0] + d
                post = pair[1] + d
                if (mid in opponent) or\
                        (not is_legal(pre) and post in opponent) or\
                        (not is_legal(post) and pre in opponent) or\
                        (pre in opponent and post in opponent):
                    continue
            elif pair[1] - pair[0] in [3, 24, 27, 30]:
                d = (pair[1] - pair[0]) / 3
                mid1 = pair[0] + d
                mid2 = pair[1] - d
                if mid1 in opponent or mid2 in opponent:
                    continue

            if p2 not in feature_book[p1]['two_in_a_row']:
                feature_book[p1]['two_in_a_row'].append(p2)
            if p1 not in feature_book[p2]['two_in_a_row']:
                feature_book[p2]['two_in_a_row'].append(p1)
            if pair not in feature_book['all_two_in_a_row']:
                feature_book['all_two_in_a_row'].append(pair)


def init_three_in_a_row(pieces, opponent, feature_book, pattern_book):
    feature_book['all_three_in_a_row'] = []

    for p in pieces:
        for j in feature_book[p]['two_in_a_row']:
            pair = tuple(sorted([p, j]))
            for i in pattern_book['reversed_three_in_a_row'][pair]:
                if i not in pieces:
                    continue
                p1, p2, p3 = sorted(list(pair) + [i])
                triple = tuple([p1, p2, p3])
                if p2 == (p1 + p3) / 2:
                    d = p2 - p1
                    if (p1 - d in opponent or not is_legal(p1 - d)) and (p3 + d in opponent or not is_legal(p3 + d)):
                        continue
                else:
                    d = (p3 - p1) / 3
                    if p2 == p1 + d and p3 - d in opponent or p2 == p3 - d and p1 + d in opponent:
                        continue
                if (p2, p3) not in feature_book[p1]['three_in_a_row']:
                    feature_book[p1]['three_in_a_row'].append((p2, p3))
                if (p1, p3) not in feature_book[p2]['three_in_a_row']:
                    feature_book[p2]['three_in_a_row'].append((p1, p3))
                if (p1, p2) not in feature_book[p3]['three_in_a_row']:
                    feature_book[p3]['three_in_a_row'].append((p1, p2))
                if triple not in feature_book['all_three_in_a_row']:
                    feature_book['all_three_in_a_row'].append(triple)


def init_board(black, white, pattern_book):
    black_features = {p: {'two_in_a_row': [], 'three_in_a_row': []} for p in black}
    white_features = {p: {'two_in_a_row': [], 'three_in_a_row': []} for p in white}

    init_two_in_a_row(black, white, black_features, pattern_book)
    init_two_in_a_row(white, black, white_features, pattern_book)
    init_three_in_a_row(black, white, black_features, pattern_book)
    init_three_in_a_row(white, black, white_features, pattern_book)

    return black_features, white_features


def rule_is_legal_3iar(c, pair, opponent):
    if c + pair[0] == 2 * pair[1]:
        d = c - pair[1]
        pre = pair[0] - d
        post = c + d
        if (not is_legal(pre) or pre in opponent) and (not is_legal(post) or post in opponent):
            return False
    elif c + pair[1] == 2 * pair[0]:
        d = pair[0] - c
        pre = c - d
        post = pair[1] + d
        if (not is_legal(pre) or pre in opponent) and (not is_legal(post) or post in opponent):
            return False
    elif pair[0] - c == 2 * (pair[1] - pair[0]):
        if (c + pair[0]) / 2 in opponent:
            return False
    elif c - pair[1] == 2 * (pair[1] - pair[0]):
        if (c + pair[1]) / 2 in opponent:
            return False
    elif 2 * (pair[0] - c) == pair[1] - pair[0]:
        if (pair[0] + pair[1]) / 2 in opponent:
            return False
    elif 2 * (c - pair[1]) == pair[1] - pair[0]:
        if (pair[0] + pair[1]) / 2 in opponent:
            return False
    elif c == (pair[0] + pair[1]) / 2:
        pre = 2 * pair[0] - c
        post = 2 * pair[1] - c
        if (not is_legal(pre) or pre in opponent) and (not is_legal(post) or post in opponent):
            return False
    else:
        d = (pair[1] - pair[0]) / 3
        assert (pair[1] - pair[0]) % 3 == 0
        if (c == pair[0] + d and pair[1] - d in opponent) or (c == pair[1] - d and pair[0] + d in opponent):
            return False
    return True


def is_legal_3iar(c, pair, opponent, pattern_book):
    reversed_four_in_a_row = pattern_book['reversed_four_in_a_row']
    triple = tuple(sorted(list(pair) + [c]))
    flag = False
    for rest in reversed_four_in_a_row[triple]:
        if rest not in opponent:
            flag = True
            break
    return flag


def get_3iar_candidate(pieces, opponent, feature_book, pattern_book):
    reversed_three_in_a_row = pattern_book['reversed_three_in_a_row']
    three_in_a_row_cand = defaultdict(set)
    for p in pieces:
        new_2iar = []
        for op in feature_book[p]['two_in_a_row']:
            pair = tuple(sorted([p, op]))
            cands = reversed_three_in_a_row[pair]
            flag = False
            for c in cands:
                if c in opponent or c in pieces:
                    continue
                if not is_legal_3iar(c, pair, opponent, pattern_book):
                    continue
                flag = True
                three_in_a_row_cand[c].add(pair)
            if flag:
                new_2iar.append(op)
        feature_book[p]['two_in_a_row'] = new_2iar

    feature_book['all_two_in_a_row'] = []
    for p in pieces:
        for op in feature_book[p]['two_in_a_row']:
            if op > p:
                feature_book['all_two_in_a_row'].append((p, op))

    return three_in_a_row_cand


def step(pieces, opponent, player_feature_book, opponent_feature_book, pattern_book):
    cands = defaultdict(set)
    for triple in player_feature_book['all_three_in_a_row']:
        for s in pattern_book['reversed_four_in_a_row'][triple]:
           if s not in opponent + pieces and s not in cands:
               cands[s].add(triple)
    if len(cands) > 0:
        return cands, 'win'

    cands = {}
    cands_3iar = get_3iar_candidate(pieces, opponent, player_feature_book, pattern_book)
    opo_cands_3iar = get_3iar_candidate(opponent, pieces, opponent_feature_book, pattern_book)
    def_cands = defaultdict(set)
    for triple in opponent_feature_book['all_three_in_a_row']:
        for s in pattern_book['reversed_four_in_a_row'][triple]:
           if s not in opponent + pieces and s not in cands:
               def_cands[s].add(triple)
    for s in def_cands:
        cands[s] = [def_cands[s] | opo_cands_3iar.get(s, set()), cands_3iar.get(s, set())]
    if len(cands) > 0:
        return cands, 'defence'

    for s in cands_3iar:
        cands[s] = [opo_cands_3iar.get(s, set()), cands_3iar[s]]

    return cands, 'offence'


def update(new_pick, new_pairs, pieces, player_feature_book, opponent_feature_book, pattern_book, state):
    player_feature_book[new_pick] = {'two_in_a_row': [], 'three_in_a_row': []}
    for p in pattern_book['two_in_a_row'][new_pick]:
        if p in pieces:
            player_feature_book[new_pick]['two_in_a_row'].append(p)
            player_feature_book[p]['two_in_a_row'].append(new_pick)
            pair = tuple(sorted([new_pick, p]))
            if pair not in player_feature_book['all_two_in_a_row']:
                player_feature_book['all_two_in_a_row'].append(pair)

    opponent_pairs, player_pairs = new_pairs
    for pair in player_pairs:
        player_feature_book[new_pick]['three_in_a_row'].append(pair)
        player_feature_book[pair[0]]['three_in_a_row'].append(tuple(sorted([new_pick, pair[1]])))
        player_feature_book[pair[1]]['three_in_a_row'].append(tuple(sorted([new_pick, pair[0]])))
        player_feature_book['all_three_in_a_row'].append(tuple(sorted(list(pair) + [new_pick])))
    for pair in opponent_pairs:
        if len(pair) == 2:
            flag = True
            for p in pattern_book['reversed_three_in_a_row'][pair]:
                if p not in pieces + [new_pick]:
                    flag = False
                    break
            if flag:
                opponent_feature_book['all_two_in_a_row'].remove(pair)
        else:
            flag = True
            for p in pattern_book['reversed_four_in_a_row'][pair]:
                if p not in pieces + [new_pick]:
                    flag = False
                    break
            if flag:
                opponent_feature_book['all_three_in_a_row'].remove(pair)


def search_one_step(player_color, black, white, ori_black_features, ori_white_features, pattern_book, depth, max_depth, path):
    if depth > max_depth:
        return [path + ['depth limit exceed']]
    black_features = deepcopy(ori_black_features)
    white_features = deepcopy(ori_white_features)
    if player_color == 'black':
        cands, state = step(black, white, black_features, white_features, pattern_book)
        if state == 'win':
            return [path + [f'{c}-{state}-{player_color}'] for c in cands]
        all_paths = []
        for c, pairs in cands.items():
            feature_book = deepcopy(black_features)
            opponent_feature_book = deepcopy(white_features)
            pieces = deepcopy(black)
            update(c, pairs, pieces, feature_book, opponent_feature_book, pattern_book, state)
            pieces.append(c)
            new_path = deepcopy(path)
            new_path.append(f'{c}-{state}-{player_color}')
            paths = search_one_step('white', pieces, white, feature_book, white_features, pattern_book, depth + 1, max_depth, new_path)
            all_paths += paths

    else:
        cands, state = step(white, black, white_features, black_features, pattern_book)
        if state == 'win':
            return [path + [f'{c}-{state}-{player_color}'] for c in cands]
        all_paths = []
        for c, pairs in cands.items():
            feature_book = deepcopy(white_features)
            opponent_feature_book = deepcopy(black_features)
            pieces = deepcopy(white)
            update(c, pairs, pieces, feature_book, opponent_feature_book, pattern_book, state)
            pieces.append(c)
            new_path = deepcopy(path)
            new_path.append(f'{c}-{state}-{player_color}')
            paths = search_one_step('black', black, pieces, black_features, feature_book, pattern_book, depth + 1, max_depth, new_path)
            all_paths += paths

    return all_paths


if __name__ == '__main__':
    # prepare_legal_patterns()
    black = [5, 6, 13, 14, 19, 23, 25, 34]
    white = [15, 20, 21, 22, 24, 32, 18]
    pattern_book = load_pattern_book()
    black_features, white_features = init_board(black, white, pattern_book)
    all_paths = search_one_step('white', black, white, black_features, white_features, pattern_book, 0, 6, [])
    for path in all_paths:
        print(path)
