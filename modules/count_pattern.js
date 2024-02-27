import {get_puzzle_board} from './puzzle_boards.js';
export var zero_group = [];
export var my_group_1 = [];
export var my_group_2 = [];
export var my_group_3 = [];
export var my_group_4 = [];
export var op_group_1 = [];
export var op_group_2 = [];
export var op_group_3 = [];
export var op_group_4 = [];
var my_piece = [];
var opponent_piece =[];
var fourinarows = [[ 0,  9, 18, 27],
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

export function count_groups(board_order){
    // get the setting of the puzzle
    if(current_bp.length == current_wp.length){ //it should be black
        my_piece = [get_puzzle_board(board_order)[0]];
        opponent_piece = [get_puzzle_board(board_order)[1]];
        
    }else if(current_bp.length = current_wp.length + 1){
        my_piece = [get_puzzle_board(board_order)[1]];
        opponent_piece = [get_puzzle_board(board_order)[0]];
    }else{
        alert("Puzzle is invalid")
    }
    
    for(var i=0;i<fourinarows.length;i++){
        //it goes over every possible FIAR case
        var m = 0;
        var n = 0;
        //n count for the 
        for(var j=0;j<4;j++){
            if(my_piece.contains(fourinarows[i][j])==true){
                m+=1
            }else if(op_piece.contains(fourinarows[i][j])==true){
                n+=1
            }else{
                m+=0
                n+=0
            }
        }
        if(m==0 & n==0){
            zero_group.add(fourinarows[i])
        }else if(m!=0 & n==0){
            if(m==4){
                my_group_4.add(fourinarows[i])
            }else if(m==3){
                my_group_3.add(fourinarows[i])
            }else if(m==2){
                my_group_2.add(fourinarows[i])
            }else{
                my_group_1.add(fourinarows[i])
            }
        }else{
            if(n==4){
                op_group_4.add(fourinarows[i])
            }else if(n==3){
                op_group_3.add(fourinarows[i])
            }else if(n==2){
                op_group_2.add(fourinarows[i])
            }else{
                op_group_1.add(fourinarows[i])
            }
        }
    }
    return zero_group,my_group_4,my_group_3,my_group_2,my_group_1,op_group_4,op_group_3,op_group_2,op_group_1
}

count_groups(49)