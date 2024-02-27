from collections import defaultdict
import json
from copy import deepcopy

fourinarows = [[ 0,  9, 18, 27],
                    [ 1, 10, 19, 28],
                    [ 2, 11, 20, 29],
                    [ 3, 12, 21, 30],
                    [ 4, 13, 22, 31],
                    [ 5, 14, 23, 32],
                    [ 6, 15, 24, 33],
                    [ 7, 16, 25, 34],
                    [ 8, 17, 26, 35],
                    [ 0, 10, 20, 30],
                    [ 1, 11, 21, 31],
                    [ 2, 12, 22, 32],
                    [ 3, 13, 23, 33],
                    [ 4, 14, 24, 34],
                    [ 5, 15, 25, 35],
                    [ 3, 11, 19, 27],
                    [ 4, 12, 20, 28],
                    [ 5, 13, 21, 29],
                    [ 6, 14, 22, 30],
                    [ 7, 15, 23, 31],
                    [ 8, 16, 24, 32],
                    [ 0,  1,  2,  3],
                    [ 1,  2,  3,  4],
                    [ 2,  3,  4,  5],
                    [ 3,  4,  5,  6],
                    [ 4,  5,  6,  7],
                    [ 5,  6,  7,  8],
                    [ 9, 10, 11, 12],
                    [10, 11, 12, 13],
                    [11, 12, 13, 14],
                    [12, 13, 14, 15],
                    [13, 14, 15, 16],
                    [14, 15, 16, 17],
                    [18, 19, 20, 21],
                    [19, 20, 21, 22],
                    [20, 21, 22, 23],
                    [21, 22, 23, 24],
                    [22, 23, 24, 25],
                    [23, 24, 25, 26],
                    [27, 28, 29, 30],
                    [28, 29, 30, 31],
                    [29, 30, 31, 32],
                    [30, 31, 32, 33],
                    [31, 32, 33, 34],
                    [32, 33, 34, 35]]
def count_groups(black,white):
    book = {}
    zero_group = []
    black_group_1 = []
    black_group_2 = []
    black_group_3 = []
    black_group_4 = []
    white_group_1 = []
    white_group_2 = []
    white_group_3 = []
    white_group_4 = []
    none_group =[]
    zero = 0
    b_1 = 0
    b_2 = 0
    b_3 = 0
    b_4 = 0
    w_1 = 0
    w_2 = 0
    w_3 = 0
    w_4 = 0
    none = 0
    for i in range(len(fourinarows)):
        b = 0
        w = 0
        for j in range(4):
            if fourinarows[i][j] in black:
                b+=1
            elif fourinarows[i][j] in white:
                w+=1
        if b==0 and w==0:
            zero_group.append(fourinarows[i])
            zero+=1
        elif b!=0 and w==0:
            if b==4:
                black_group_4.append(fourinarows[i])
                b_4+=1
            elif b==3:
                black_group_3.append(fourinarows[i])
                b_3+=1
            elif b==2:
                black_group_2.append(fourinarows[i])
                b_2+=1
            elif b==1:
                black_group_1.append(fourinarows[i])
                b_1+=1
        elif w!=0 and b==0:
            if w==4:
                white_group_4.append(fourinarows[i])
                w_4+=1
            elif w==3:
                white_group_3.append(fourinarows[i])
                w_3+=1
            elif w==2:
                white_group_2.append(fourinarows[i])
                w_2+=1
            elif w==1:
                white_group_1.append(fourinarows[i])
                w_1+=1
        else:
            none_group.append(fourinarows[i])
            none+=1
    # book['zero_group'] = zero_group
    # book['black_group_1'] = black_group_1
    # book['black_group_2'] = black_group_2
    # book['black_group_3'] = black_group_3
    # book['black_group_4'] = black_group_4
    # book['white_group_1'] = white_group_1
    # book['white_group_2'] = white_group_2
    # book['white_group_3'] = white_group_3
    # book['white_group_4'] = white_group_4
    # return book
    print ("zero group:", zero,zero_group)
    print ("black group 1:", b_1,black_group_1)
    print ("black group 2:", b_2, black_group_2)
    print ("black group 3:", b_3, black_group_3)
    print ("black group 4:", b_4, black_group_4)
    print ("white group 1:", w_1, white_group_1)
    print ("white group 2:", w_2, white_group_2)
    print ("white group 3:", w_3, white_group_3)
    print ("white group 4:", w_4, white_group_4)
    print ("none group:", none, none_group)
    return


if __name__ == '__main__':
    black = [12, 14, 16, 18, 21, 29, 30, 33, 27, 0, 20]
    white = [1, 3, 8, 11, 13, 23, 31, 35, 28, 9]
    count_groups(black,white)

