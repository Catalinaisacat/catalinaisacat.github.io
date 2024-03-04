export function get_puzzle_board(i){
    let black = [];
    let white = [];
    switch(i){
        //win in two
        case 0:
            black = [9, 18, 19, 20, 22];
            white = [10, 11, 21, 30];
            break
        case 1:
            black = [4, 11, 13, 20];
            white = [3, 14, 15, 24];
            break
        case "K": //13
            black = [5, 13, 14, 32, 33];
            white = [23, 26, 31, 34];
            break;
        case "A": //21
            black = [12, 24, 25, 31, 33, 8];
            white = [11, 13, 14, 21, 1];
            break;
        case "B": //48
            black = [2, 3, 15, 21, 29, 31, 8];
            white = [6, 12, 22, 24, 32, 16];
            break;
        //level 2:
        case "L": //45
            black = [9, 11, 13, 14, 17, 21, 24];
            white = [12, 15, 16, 23, 25, 28, 29];
            break;
        case "C": //34
            black = [3, 13, 14, 15, 35, 20, 22];
            white = [6, 12, 16, 21, 34, 30, 33];
            break
        case "D": //53
            black = [2, 3, 8, 12, 14, 20, 22, 28, 1];
            white = [4, 6, 11, 16, 19, 24, 30, 32, 0];
            break;
        //level 3:
        case "E": //55
            black = [5, 6, 13, 14, 19, 23, 25, 34];
            white = [15, 20, 21, 22, 24, 32, 18];
            break;
        case "F": //49
            black = [2, 3, 8, 13, 21, 25, 30];
            white = [12, 14, 16, 22, 24, 32];
            break;
        case "G": //46
            black = [6, 11, 13, 21, 23];
            white = [3, 4, 12,14,22];
            break;
        //level 4:
        case "H": //44
            black = [3, 5, 9, 13, 16, 17, 21, 34];
            white = [0, 2, 14, 15, 22, 25, 29, 28];
            break;
        case "I": //51
            black = [1, 3, 8, 11, 13, 23, 31, 35, 6];
            white = [12, 14, 16, 18, 21, 29, 30, 33];
            break;
        case "J": //52
            black = [3, 13, 15, 17, 20, 26, 29, 30, 10, 8];
            white = [1, 2, 4, 7, 12, 28, 31, 34, 0, 35];
            break;
        default:
            alert(i, "Puzzle index invalid")
    }
    return [black, white]
}





export function get_puzzle_tree(i){
    // let fun = (prev_moves, m)=>[];
    let tree = {};
    switch(i){
        case 0:
            tree["root"] = [12]
            tree["12"] = [3, 13]
            tree["12-3"] = [13]
            tree["12-13"] = [3]
            tree["12-3-13"] = -1
            tree["12-13-3"] = -1
            break
        case 1:
            tree["root"] = [12]
            tree["12"] = [10, 28]
            tree["12-10"] = [28]
            tree["12-28"] = [10]
            tree["12-28-10"] = -1
            tree["12-10-28"] = -1
            break;
        case "K": //13
            tree["root"] = [25];
            break;
        case "A": //21
            tree["root"] = [29];
            break;
        case "B": //48
            tree["root"] = [23];
            break;
        //level 2:
        case "L": //45
            tree["root"] = [31];
            break;
        case "C": //34
            tree["root"] = [25];
            break;
        case "D": //53
            tree["root"] = [23];
            break;
        //level 3:
        case "E": //55
            tree["root"] = [2];
            break;
        case "F": //49
            tree["root"] = [15];
            break;
        case "G": //46
            tree["root"] = [5];
            break;
        //level 4:
        case "H": //44
            tree["root"] = [6];
            break;
        case "I": //51
            tree["root"] = [27];
            break;
        case "J": //52
            tree["root"] = [33];
            break;
        default:
            alert("Puzzle index invalid")
    }
    return tree
}