# -*- coding:utf-8 -*-
from check_optimal import *


class Node:

    def __init__(self, step, depth):
        if step == 'ROOT' or step == 'depth limit exceed':
            self.ptype = step
            self.color = None
            self.pos = None
        else:
            pos, ptype, color = step.split('-')
            self.color = color
            self.pos = int(pos)
            self.ptype = ptype
        self.depth = depth
        self.is_force_win = False

        self.children = []
        self.parent = None

    def __eq__(self, other):
        return other.color == self.color and other.pos == self.pos and other.depth == self.depth

    def add_child(self, node):
        for child in self.children:
            if child == node:
                return child
        self.children.append(node)
        node.parent = self
        return node

    def set_force_win(self):
        self.is_force_win = True

    def __repr__(self):
        return f'{self.color}-{self.pos}-{self.is_force_win}'



def update_tree(root, path):
    cur = root
    for depth, step in enumerate(path):
        node = Node(step, depth)
        cur = cur.add_child(node)
    return root


def build_tree(all_paths):
    root = Node('ROOT', -1)
    for path in all_paths:
        root = update_tree(root, path)
    return root


def check_force_win(node, color):
    if node.ptype == 'win':
        if node.color == color:
            node.set_force_win()
            return True
        else:
            return False
    if node.ptype == 'depth limit exceed':
        return False
    if node.color == color:
        if all([check_force_win(c, color) for c in node.children]):
            node.set_force_win()
            return True
        else:
            return False
    else:
        if any([check_force_win(c, color) for c in node.children]):
            node.set_force_win()
            return True
        else:
            return False


def check_step_by_step(tree):
    cur = tree
    color = cur.color
    while cur.ptype != 'win':
        prompt = []
        color = cur.color
        for child in cur.children:
            if child.is_force_win:
                prompt.append(f'\033[41;1m{child.pos}\033[0m')
            else:
                prompt.append(str(child.pos))
            color = child.color
        if color is None:
            print("Depth Limit Exceed")
            return
        pos = int(input(f"Color: {color}, Candidates: {', '.join(prompt)}\nYour choice: "))
        for child in cur.children:
            if child.pos == pos:
                cur = child
                break
    print(f"{color} win!")


if __name__ == '__main__':
    #13 sol:25
    #player_color = 'black'
    #black = [23, 26, 31, 34]
    #white = [5, 13, 14, 32]
    #21 sol:29
    #player_color = 'white'
    #black = [12, 24, 25, 31, 33, 8]
    #white = [11, 13, 14, 21, 1]
    #48 sol:23
    #player_color = 'white'  # white | black
    #black = [2, 3, 15, 21, 29, 31, 8]
    #white = [6, 12, 22, 24, 32, 16]
    #45 sol:31
    #player_color = 'black' 
    #black = [9, 11, 13, 14, 17, 21, 24]
    #white = [12, 15, 16, 23, 25, 28, 29]
    #34 sol:25
    #player_color = 'black'
    #black = [3, 13, 14, 15, 35, 20, 22]
    #white = [6, 12, 16, 21, 34, 30, 33]
    #53 sol:23
    #player_color = 'black'
    #black = [2, 3, 8, 12, 14, 20, 22, 28, 1]
    #white = [4, 6, 11, 16, 19, 24, 30, 32, 0]
    #55 sol:2
    #player_color = 'black'
    #black = [15, 20, 21, 22, 24, 32, 18, 35]
    #white = [5, 6, 13, 14, 19, 23, 25, 34]
    #49 sol: 15
    #player_color = 'white'  # white | black
    #black = [2, 3, 8, 13, 21, 25, 30]
    #white = [12,14, 16, 22, 24, 32]
    #46 sol:5
    #player_color = 'black'
    #black = [6, 11, 13, 21, 23]
    #white = [3, 4, 12,14,22]
    #44 sol:6!
    #player_color = 'black'  # white | black
    #black = [3, 5,11, 13, 16, 17, 21, 34]
    #white = [2, 10, 14, 15, 22, 25, 29, 28]
    #51 sol:27
    #player_color = 'black'
    #black = [12, 14, 16, 18, 21, 29, 30, 33, 5]
    #white = [1, 3, 8, 11, 13, 23, 31, 35, 6]
    #52 sol:33
    player_color = 'black'
    black = [3, 13, 15, 17, 20, 26, 29, 30, 10, 8]
    white = [1, 2, 4, 7, 12, 28, 31, 34, 0, 35]
    max_depth = 18 - len(black)

    pattern_book = load_pattern_book()
    black_features, white_features = init_board(black, white, pattern_book)
    all_paths = search_one_step(player_color, black, white, black_features, white_features, pattern_book, 0, 2 * max_depth, [])
    tree = build_tree(all_paths)
    for child in tree.children:
        print(child.pos, check_force_win(child, player_color))
    check_step_by_step(tree)
