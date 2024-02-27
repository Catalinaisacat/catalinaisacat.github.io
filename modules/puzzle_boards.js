export function get_puzzle_board(i){
    let black = [];
    let white = [];
    let solution = [];
    switch(i){
        //level 1:
        case 13:
            black = [23, 26, 31, 34];
            white = [5, 13, 14, 32];
            solution = [25];
            break;
        case 21:
            black = [12, 24, 25, 31, 33];
            white = [11, 13, 14, 21];
            solution = [29];
            break;
        case 48:
            black = [2, 3,15, 21, 29, 31];
            white = [6,12, 22, 24, 32];
            solution = [23];
            break;
        case 54:
            black = [3, 6, 15, 19, 21, 23, 25,31];
            white = [4, 7, 14, 20, 22, 30, 33];
            solution = [12];
            break;
        //level 2:
        case 45:
            black = [9, 11, 13, 14, 17, 21, 24];
            white = [12, 15, 16, 23, 25, 28, 29];
            solution = [31];
            break;
        case 34:
            black = [3, 13, 14, 15, 19, 20, 22];
            white = [6, 12, 16, 21, 28, 30, 33];
            break;
        case 53:
            black = [2, 3, 8, 12, 14, 20, 22, 28];
            white = [4, 6, 11, 16, 19, 24, 30, 32];
            solution = [24];
            break;
        //level 3:
        case 55:
            black = [15, 20, 21, 22, 24, 32];
            white = [5, 6, 13, 14, 19, 23];
            solution = [2];
            break;
        case 49:
            black = [2, 3, 8, 13, 21, 25, 30];
            white = [12,14, 16, 22, 24, 32];
            solution = [4];
            break;
        case 50: 
            black = [5, 13, 21, 23, 31,18, 28, 34];
            white = [2, 4, 14, 16, 22, 26, 29];
            solution = [32];
            break;
        //level 4:
        case 44:
            black = [3, 5, 11, 13, 16, 17, 21, 34];
            white = [2, 10, 14, 15, 22, 26, 29, 30];
            solution = [33];
            break;
        case 46:
            black = [6, 11, 13, 21, 23];
            white = [3, 4, 12,14,22];
            solution = [5];
            break;
        case 51: 
            black = [12, 14, 16, 18, 21, 29, 30, 33];
            white = [1, 3, 8, 11, 13, 23, 31, 35];
            solution = [27];
            break;
        case 52: 
            black = [3, 13, 15, 17, 20, 26, 29, 30];
            white = [1, 2, 4, 7, 12, 28, 31, 34];
            solution = [35];
        break;
        default:
            alert("Puzzle index invalid")
    }
    return [black, white, solution]
}
