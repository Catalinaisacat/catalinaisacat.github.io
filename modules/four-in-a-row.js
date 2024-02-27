
var jsPsychFourInARow = (function (jspsych) {
    'use strict';

    const info = {
        name: 'four-in-a-row',
        parameters: { 
            game_index: {
                type: jspsych.ParameterType.INT,
                default: -1
            },
            pieces: {
                // List of two lists
                // First list has positions of black's pieces,
                // second list has positions of white's pieces
                type: jspsych.ParameterType.OBJECT,
                default: [[], []]
            },
            tree: {
                // Opponent optimal moves for puzzles
                type: jspsych.ParameterType.OBJECT,
                default: []
            },
            free_play: {
                // True if freeplay, false if puzzles
                type: jspsych.ParameterType.BOOL,
                default: true
            },
            length: {
                // Length of a puzzle
                type: jspsych.ParameterType.INT,
                default: -1
            },
            get_level: {
                // Adaptively returns level of opponent for freeplay
                // Since level is a global parameter, this is a function which
                // gets passed down from experiment.js, returning the global variable
                // from there
                type: jspsych.ParameterType.FUNCTION,
            },
            time_per_move: {
                // For puzzles, how much time in seconds the subject has per move
                // once they have made their first move
                type: jspsych.ParameterType.INT,
                default: 5
            },
            player: {
                // 1 if subject is playing black, 2 if playing white
                type: jspsych.ParameterType.INT,
                default: null
            },
            debug_mode: {
                // For debugging purposes in puzzles, can ignore this
                type: jspsych.ParameterType.BOOL,
                default: false
            },
            tutorial: {
                type: jspsych.ParameterType.BOOL,
                default: false
            },
            puzzle: {
                // Puzzle number for record keeping (not actually used)
                type: jspsych.ParameterType.INT,
                default: null
            },
            initial_delay: {
                // For puzzles, the delay which is forced at the start
                type: jspsych.ParameterType.INT,
                default: null
            }
        }
    }
  
    class FourInARow {
        constructor(jsPsych){
            this.jsPsych = jsPsych;
            // Canvas sizing
            let w = window.innerWidth * 0.8;
            let h = window.innerHeight * 0.8;
            // Size of a tile
            let s = Math.floor(Math.min(w/9, h/4));
            this.s = s;
            this.w = 9*s;
            this.h = 4*s;
            // Piece radius
            this.r = s * 0.75 / 2;
            // Sampling period for mouse movements
            this.minimumSampleTime = 50;
            // Which color the player is playing ("White" or "Black")
            this.player = null;
            // Keeps track of whose turn it is
            this.turn = null;
            // Keeps track of which pieces are on the board
            this.black_pieces = [];
            this.white_pieces = [];
            // A different way of representing the pieces on the board
            // a 1 is a piece is present, a 0 is no piece is present
            // this is mainly to pass to the opponent for freeplay
            this.bp = new Array(9*4).fill(0);
            this.wp = new Array(9*4).fill(0);
            // For drawing on the canvas
            this.cvs = null;
            this.ctx = null;
            // To turn mouse coordinates to canvas oriented coordinates
            this.rect_left = null;
            this.rect_top = null;
            // Keeps track of all moves being made
            this.current_state = "root";
            // Solution in puzzles for debug_mode
            this.hint_tiles = [];
            // More debug_mode parameters for puzzles
            this.debug_mode = false;
            this.solution_mode = false;
            this.submit_mode = false;
            this.ready_to_submit = false;
            // Whether this is a puzzle or freeplay
            this.free_play = true;
            // Puzzle length
            this.length = 0;
            // This is where the freeplay opponent will be called from
            this.ai = null;
            // Difficulty level of freeplay opponent (0-199)
            this.level = null;
            // Whether opponent plays black (0) or white (1)
            this.opponent = null;
            // Whether game/puzzle was a 'win', 'tie' or 'loss'
            this.game_result = null;
            // Main HTMl displaying element
            this.display_element = null;
            // Listens for keypresses
            this.keyboardListener = null;
            // To show the 4-in-a-row at the end of a freeplay game
            this.winning_tiles = [];
            // How long in ms it took the subject to make the first move
            this.first_move_RT = null;
            // Whether the subject has made the first move
            this.first_move_made = false;
            // How much time the subject has in puzzles per move
            this.time_per_move = null;
            // Puzzle timer
            this.interval = null;
            // Absolute time stamp of last click (to measure RTs)
            this.last_click_time = null;
            // List of RT for each move
            this.move_RT = [];
            // Absolute time stamps for each move
            this.move_times = [];
            // Sound effects
            this.win_sound = new Audio('media/sounds/correct6.wav');
            this.loss_sound = new Audio('media/sounds/wrong1.wav');
            this.mousedown_sound = new Audio('media/sounds/mousedown.mp3');
            this.mouseup_sound = new Audio('media/sounds/mouseup.wav');
            // Puzzle number for records (not used)
            this.puzzle = null;
            // Stores all mouse movements
            this.mouse_movements = [];
            // Initial forced delay
            this.initial_delay = null;
            // Timer for forced delay
            this.initial_interval = null;
            // Whether subject is still forced to wait and cannot click
            this.can_click = false;
            this.tutorial = null;
            // Recorder related
            this.state = "planing";
            this.planing_move = [];
            this.recorder = null;
            this.recordedChunks = [];
            this.click_mode = "nothing";
            this.onestep = true;
            this.warm_up = null;
            this.free_click = null;
            this.puzzle_move = null;
            this.free_click_top = null;
            this.click_time = null;
        }
        mouseMoveEventHandler = ({ clientX: x, clientY: y }) => {
            const event_time = performance.now();
            const t = Math.round(event_time - this.currentTrialStartTime);
            // Only do stuff every this.minimumSampleTime
            if (event_time - this.lastSampleTime >= this.minimumSampleTime && !this.ready_to_submit) {
                this.lastSampleTime = event_time;
                this.mouse_movements.push([(x - this.rect_left)/this.w, (y - this.rect_top)/this.h, event_time])
                //this.draw_board(x - this.rect_left, y - this.rect_top)
            }
        };
        make_move(piece){
            // Only make move is piece not already on the board
            if (!this.black_pieces.includes(piece) && !this.white_pieces.includes(piece)){
                if (this.turn == "Black"){
                    this.black_pieces.push(piece);
                    this.bp[piece] = 1;
                    this.turn = "White";
                } else if (this.turn == "White"){
                    this.white_pieces.push(piece);
                    this.wp[piece] = 1;
                    this.turn = "Black";
                }
                // Hides hints
                this.solution_mode = false;
                this.hint_tiles = [];
                this.puzzle_move = piece.toString();
                // Records move
                if (this.current_state == "root"){
                    this.current_state = piece.toString();
                } else {
                    this.current_state += "-" + piece.toString();
                }
            }
        };
        opponent_move(){
            if (this.free_play){
                if (this.level < 200 && this.level >= 0 && (this.opponent == 0 || this.opponent == 1)){
                    // This has to be in a Timeout because the opponent program
                    // might take a second to run, so instead of doing a complicated
                    // asynch 'await' for the promise to return, we just force a small waiting time.
                    setTimeout(()=>{
                        // If board is full, its a tie
                        if (this.black_pieces.length + this.white_pieces.length == 9*4){
                            this.game_result = "tie";
                            this.draw_board(null, null);
                            this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
                            this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
                            setTimeout(()=>{
                                this.end_trial();
                            },1000);
                        } else {
                            // Quert opponent for a move
                            this.make_move(this.ai(Date.now(), this.bp.join(""), this.wp.join(""), this.opponent, this.level));
                            // Check if opponent has won, which makes this trial a loss
                            if (this.check_win(this.opponent).length > 0){
                                this.loss_sound.play();
                                this.game_result = "loss";
                                this.winning_tiles = this.check_win(this.opponent);
                                this.draw_board(null, null);
                                this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
                                this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
                                setTimeout(()=>{
                                    this.end_trial();
                                },500);
                            // This may seem redundant but it checks for a tie *after* the opponent
                            // has moved.
                            } else if (this.black_pieces.length + this.white_pieces.length == 9*4){
                                this.game_result = "tie";
                                this.draw_board(null, null);
                                this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
                                this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
                                setTimeout(()=>{
                                    this.end_trial();
                                },2000);
                            }
                        }
                        this.draw_board(null, null);
                    }, 100);
                }
            } else{
                // Select opponent move from tree for puzzle
                setTimeout(()=>{
                    let opponent_move = this.tree[this.current_state][Math.floor(Math.random()*this.tree[this.current_state].length)];
                    this.make_move(opponent_move);
                    this.draw_board(null, null);
                }, 200);
            }
        };
        mouseDownEventHandler = ({ clientX: click_x, clientY: click_y }) => {
            console.log("mouse")
            const event_time = performance.now();
            const t = Math.round(event_time - this.currentTrialStartTime);
            let x = Math.floor((click_x - this.rect_left) / this.s);
            let y = Math.floor((click_y - this.rect_top) / this.s);
            let piece = y*9 + x;
            if (!this.first_move_made){
                this.first_move_RT = performance.now() - this.currentTrialStartTime;
                this.first_move_made = true;
            }
            this.move_RT.push(performance.now() - this.last_click_time);
            this.move_times.push(performance.now());
            this.last_click_time = performance.now();
            if (!this.white_pieces.includes(piece) && !this.black_pieces.includes(piece)){
                // if (!this.first_move_made){
                //     this.first_move_RT = performance.now() - this.currentTrialStartTime;
                //     this.first_move_made = true;
                // }
                // this.move_RT.push(performance.now() - this.last_click_time);
                // this.move_times.push(performance.now());
                // this.last_click_time = performance.now();
                if (!this.free_play){
                    if (!this.can_click){
                        return
                    }
                    if (this.submit_mode && !this.ready_to_submit) {
                        this.make_move(piece);
                    } 
                    else if (this.state == "planing"){
                        this.mousedown_sound.play();
                        console.log('mouse down');
                        //this.planing_move.push(piece);
                        this.click_mode = "highlight";    
                        this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                        // this.cvs.addEventListener("mouseup", (event) => {this.mouseup_sound.play();console.log(event); this.click_mode = "normal"; this.draw_board(click_x - this.rect_left, click_y - this.rect_top);});
                        console.log(this.click_mode);
                        console.log(click_x);
                        console.log(click_y);
                        //this.cvs.addEventListener("mouseup", () => {this.click_mode = "nothing";this.draw_board(click_x - this.rect_left, click_y - this.rect_top)})
                    }
                    else if (this.onestep){
                        console.log("play the move");
                        clearInterval(this.interval);
                        this.puzzle_move = piece;
                        // if (this.tutorial){
                        //     console.log("tutorial");
                        //     this.game_result = "tutorial"
                        // }
                        if (this.tree[this.current_state].includes(piece)){
                            console.log("success");
                            this.game_result = "success"
                        }
                        else{
                            console.log("fail");
                            this.game_result = "fail"
                        }
                        this.make_move(piece);
                        this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                        setTimeout(()=>{
                            this.end_trial();
                        },500);
                    }
                    else {
                        if (this.tree[this.current_state].includes(piece)){
                            clearInterval(this.interval);
                            this.make_move(piece);
                            this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                            if (this.tree[this.current_state] == -1){
                                this.game_result = "win";
                                this.win_sound.play();
                                this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
                                this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
                                this.winning_tiles = this.check_win((this.opponent+1)%2);
                                this.draw_board(null, null);
                                setTimeout(()=>{
                                    this.end_trial();
                                },500);
                            } else{
                                let au = new Audio('media/sounds/correct1.wav');
                                au.play();
                                this.opponent_move();
                                setTimeout(() => {
                                    this.click_time = performance.now();
                                    this.interval = setInterval(() => this.timer(this.time_per_move), 25);
                                }, 100);
                            }
                        } else {
                            clearInterval(this.interval);
                            this.loss_sound.play();
                            this.game_result = "loss";
                            this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
                            this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
                            let s = this.current_state;
                            this.make_move(piece);
                            this.hint_tiles = this.tree[s];
                            this.solution_mode = true;
                            this.draw_board(null, null);
                            setTimeout(()=>{
                                this.end_trial();
                            },500);
                        }
                    }
                    this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                } else {
                    this.make_move(piece);
                    this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                    if (this.check_win((this.opponent+1)%2).length > 0){
                        this.game_result = "win";
                        this.win_sound.play();
                        this.winning_tiles = this.check_win((this.opponent+1)%2);
                        this.draw_board(null, null);
                        this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
                        this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
                        setTimeout(()=>{
                            this.end_trial();
                        },1000);
                    } else {
                        this.opponent_move();
                    }
                    this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                }
            }
            else{
                if (this.state == "planing"){
                    this.mousedown_sound.play();
                    console.log('mouse down');
                    //this.planing_move.push(piece);
                    this.click_mode = "highlight";    
                    this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                    // this.cvs.addEventListener("mouseup", (event) => {this.mouseup_sound.play();console.log(event); this.click_mode = "normal"; this.draw_board(click_x - this.rect_left, click_y - this.rect_top);});
                    console.log(this.click_mode);
                    console.log(click_x);
                    console.log(click_y);
                }
            }
        };
        mouseUpEventHandler = ({ clientX: click_x, clientY: click_y }) => {
            this.mouseup_sound.play();
            this.click_mode = "normal";
            this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
        }
        
        touchstartEventHandler = (e) => {
            console.log("touch")
            const event_time = performance.now();
            const t = Math.round(event_time - this.currentTrialStartTime);
            let click_x;
            let click_y;
            click_x = e.touches[0].clientX;
            click_y = e.touches[0].clientY;
            let x = Math.floor((click_x - this.rect_left) / this.s);
            let y = Math.floor((click_y - this.rect_top) / this.s);
            let piece = y*9 + x;
            if (!this.first_move_made){
                this.first_move_RT = performance.now() - this.currentTrialStartTime;
                this.first_move_made = true;
            }
            this.move_RT.push(performance.now() - this.last_click_time);
            this.move_times.push(performance.now());
            this.last_click_time = performance.now();
            if (!this.white_pieces.includes(piece) && !this.black_pieces.includes(piece)){
                // if (!this.first_move_made){
                //     this.first_move_RT = performance.now() - this.currentTrialStartTime;
                //     this.first_move_made = true;
                // }
                // this.move_RT.push(performance.now() - this.last_click_time);
                // this.move_times.push(performance.now());
                // this.last_click_time = performance.now();
                if (!this.free_play){
                    if (!this.can_click){
                        return
                    }
                    if (this.submit_mode && !this.ready_to_submit) {
                        this.make_move(piece);
                    } 
                    else if (this.state == "planing"){
                        this.mousedown_sound.play();
                        console.log('touch start');
                        this.planing_move.push(piece);
                        this.click_mode = "highlight";    
                        this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                        // this.cvs.addEventListener("mouseup", (event) => {this.mouseup_sound.play();console.log(event); this.click_mode = "normal"; this.draw_board(click_x - this.rect_left, click_y - this.rect_top);});
                        console.log(this.click_mode);
                        console.log(click_x);
                        console.log(click_y);
                        //this.cvs.addEventListener("mouseup", () => {this.click_mode = "nothing";this.draw_board(click_x - this.rect_left, click_y - this.rect_top)})
                    }
                    else if (this.onestep){
                        console.log("play the move");
                        clearInterval(this.interval);
                        this.puzzle_move = piece;
                        // if (this.tutorial){
                        //     console.log("tutorial");
                        //     this.game_result = "tutorial"
                        // }
                        if (this.tree[this.current_state].includes(piece)){
                            console.log("success");
                            if (this.tutorial){
                                this.game_result = "tutorial success"
                            }
                            else{
                                this.game_result = "success"
                            }
                        }
                        else{
                            console.log("fail");
                            if (this.tutorial){
                                this.game_result = "tutorial fail"
                            }
                            else{
                                this.game_result = "fail"
                            }
                        }
                        this.make_move(piece);
                        this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                        setTimeout(()=>{
                            this.end_trial();
                        },500);
                    }
                    else {
                        if (this.tree[this.current_state].includes(piece)){
                            clearInterval(this.interval);
                            this.make_move(piece);
                            this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                            if (this.tree[this.current_state] == -1){
                                this.game_result = "win";
                                this.win_sound.play();
                                this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
                                this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
                                this.cvs.removeEventListener("touchstart", this.touchstartEventHandler);
                                this.winning_tiles = this.check_win((this.opponent+1)%2);
                                this.draw_board(null, null);
                                setTimeout(()=>{
                                    this.end_trial();
                                },1000);
                            } else{
                                let au = new Audio('media/sounds/correct1.wav');
                                au.play();
                                this.opponent_move();
                                setTimeout(() => {
                                    this.click_time = performance.now();
                                    this.interval = setInterval(() => this.timer(this.time_per_move), 25);
                                }, 100);
                            }
                        } else {
                            clearInterval(this.interval);
                            this.loss_sound.play();
                            this.game_result = "loss";
                            this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
                            this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
                            this.cvs.removeEventListener("touchstart", this.touchstartEventHandler);
                            let s = this.current_state;
                            this.make_move(piece);
                            this.hint_tiles = this.tree[s];
                            this.solution_mode = true;
                            this.draw_board(null, null);
                            setTimeout(()=>{
                                this.end_trial();
                            },1000);
                        }
                    }
                    this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                } else {
                    this.make_move(piece);
                    this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                    if (this.check_win((this.opponent+1)%2).length > 0){
                        this.game_result = "win";
                        this.win_sound.play();
                        this.winning_tiles = this.check_win((this.opponent+1)%2);
                        this.draw_board(null, null);
                        this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
                        this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
                        this.cvs.removeEventListener("touchstart", this.touchstartEventHandler);
                        setTimeout(()=>{
                            this.end_trial();
                        },1000);
                    } else {
                        this.opponent_move();
                    }
                    this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                }
            }
            else {
                if (this.state == "planing"){
                    console.log('touch start');
                    console.log(this.click_mode);
                    console.log(click_x);
                    console.log(click_y);
                    this.mousedown_sound.play();
                    this.planing_move.push(piece);
                    this.click_mode = "highlight";
                    this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
                }
            }
        };
        touchendEventHandler = ({ clientX: click_x, clientY: click_y }) => {
            this.mouseup_sound.play();
            this.click_mode = "normal";
            this.draw_board(click_x - this.rect_left, click_y - this.rect_top);
        }
        check_win(color){
            let fourinarows = [[ 0,  9, 18, 27],
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
            for(var i=0;i<fourinarows.length;i++){
                var n = 0;
                for(var j=0;j<4;j++){
                    if(color==0)//BLACK
                        n+=this.bp[fourinarows[i][j]]
                    else
                        n+=this.wp[fourinarows[i][j]]
                }
                if(n==4){
                    return fourinarows[i]
                }
            }
            return []
        }
        async init_recorder() {
            var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.recorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
            this.recorder.ondataavailable = (event) => {
                this.recordedChunks.push(event.data);
            }
            this.recorder.start()
        }
        stop_recording(){
            console.log(this.plan_pieces);
            this.recorder.stop();
            this.state = "move";
            this.top.innerHTML = `Make your move in 5 seconds. `;
            document.getElementById('stop-button').style.visibility = "hidden";
            document.getElementById('down').style.visibility = "hidden";
            document.getElementById('progress-bar').style.visibility = 'visible';
            if (this.warm_up){
                document.getElementById('black-button').style.visibility = "visible";
                document.getElementById('white-button').style.visibility = "visible";
            }
            this.cvs.removeEventListener("touchend", this.touchendEventHandler);
            this.cvs.removeEventListener("mouseup", this.mouseUpEventHandler);
        }   
        draw_board(move_x, move_y){
            //this.update_top();
            // Clear screen
            this.ctx.clearRect(0, 0, this.w, this.h);
            // Draw hover highlight
           
            // Draw hover highlight on planing moves
            if (move_x !== null && move_y !== null && this.click_mode == "highlight"){
                this.ctx.beginPath();
                let x = Math.floor(move_x / this.s) * this.s;
                let y = Math.floor(move_y / this.s) * this.s;
                this.ctx.rect(x, y, this.s, this.s);
                this.ctx.fillStyle = "#bbbbbb";
                this.ctx.fill();
            }
            if (this.solution_mode){
                // Draw optimal moves
                for(let i=0; i<this.hint_tiles.length; i++){
                    let hint_tile = this.hint_tiles[i];
                    let x = hint_tile % 9;
                    let y = Math.floor(hint_tile / 9);
                    this.ctx.beginPath();
                    this.ctx.rect(this.s * x, this.s * y, this.s, this.s);
                    this.ctx.fillStyle = "#22ddaa";
                    this.ctx.fill();
                }
            }
            // Draw border
            this.ctx.beginPath();
            this.ctx.rect(0, 0, this.w, this.h);
            this.ctx.lineWidth = "8";
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
            this.ctx.lineWidth = "4";
            // Draw grid
            for(let i=1; i<4; i++){
                this.ctx.beginPath();
                this.ctx.moveTo(0, this.h*i/4);
                this.ctx.lineTo(this.w, this.h*i/4);
                this.ctx.stroke();
            }
            for(let i=1; i<9; i++){
                this.ctx.beginPath();
                this.ctx.moveTo(this.w*i/9, 0);
                this.ctx.lineTo(this.w*i/9, this.h);
                this.ctx.stroke();
            }
            for(const piece of this.black_pieces){
                this.ctx.beginPath();
                let x = piece % 9;
                let y = Math.floor(piece / 9);
                this.ctx.arc((this.s * x) + this.s/2, (this.s * y) + this.s/2, this.r, 0, 2 * Math.PI);
                if (this.game_result == "win" && this.player ==  "Black" && this.winning_tiles.includes(piece)){
                    this.ctx.fillStyle = "#22ddaa";
                } else if (this.game_result == "loss" && this.player ==  "White" && this.winning_tiles.includes(piece)){
                    this.ctx.fillStyle = "red";
                } else{
                    this.ctx.fillStyle="black";
                }
                this.ctx.fill();
            }
            for(const piece of this.white_pieces){
                this.ctx.beginPath();
                let x = piece % 9;
                let y = Math.floor(piece / 9);
                this.ctx.arc((this.s * x) + this.s/2, (this.s * y) + this.s/2, this.r, 0, 2 * Math.PI);
                if (this.game_result == "win" && this.player ==  "White" && this.winning_tiles.includes(piece)){
                    this.ctx.fillStyle = "#22ddaa";
                } else if (this.game_result == "loss" && this.player ==  "Black" && this.winning_tiles.includes(piece)){
                    this.ctx.fillStyle = "red";
                } else{
                    this.ctx.fillStyle="white";
                }
                this.ctx.fill();
            }            
        }
        reset_pieces(trial){
            // Reset solution
            this.ready_to_submit = false;
            this.debug_mode = trial.debug_mode;
            // Reset hint mode
            this.solution_mode = false;
            this.hint_tiles = [];
            // Add listeners again if already removed
            if (!this.free_play){
                if (this.tree[this.current_state] == -1){
                    this.cvs.addEventListener("mousemove", this.mouseMoveEventHandler);
                    this.cvs.addEventListener("touchstart", this.touchstartEventHandler);
                    this.cvs.addEventListener("touchend", () => {this.click_mode = "nothing";this.draw_board(click_x - this.rect_left, click_y - this.rect_top)});
                    this.cvs.addEventListener("mousedown", this.mouseDownEventHandler);
                    this.cvs.addEventListener("mouseup", () => {this.click_mode = "nothing";this.draw_board(click_x - this.rect_left, click_y - this.rect_top)});
                }
                // Reset tree            
                this.current_state = "root";
            } else {
                if (trial.player == 1){
                    let move = this.ai(Date.now(), "", "", 0, this.level);
                    trial.pieces = [[move], []];
                    this.current_state = move.toString();
                } else {
                    // Reset tree            
                    this.current_state = "root";
                }
            }
            // Get puzzle board
            this.black_pieces = [...trial.pieces[0]];
            this.white_pieces = [...trial.pieces[1]];
            for(const piece of this.black_pieces){
                this.bp[piece] = 1;
            }
            for(const piece of this.white_pieces){
                this.wp[piece] = 1;
            }
            // Whose turn is it
            if (this.white_pieces.length == this.black_pieces.length){
                this.turn = "Black";
                this.player = "Black";
                this.opponent = 1;
            } else {
                this.turn = "White";
                this.player = "White";
                this.opponent = 0;
            }
        }
        update_top(){
            if (this.game_result == "win"){
                //let p = this.free_play ? 100 : this.length == 2 ? 100 : this.length == 3 ? 200 : this.length == 4 ? 300 : 0;
                let b = this.free_play ? 0.2 : this.length == 2 ? 0.25 : this.length == 3 ? 1.0 : this.length == 4 ? 2.0 : 0;
                if (this.free_play){
                    this.top.innerHTML = `You won and got $${b} bonus reward!`;
                } else{
                    if (this.tutorial){
                        this.top.innerHTML = `You found the solution!`;
                    } else {
                        this.top.innerHTML = `You found the solution and got $${b} bonus reward!`;
                    }
                }
            } else if (this.game_result == "loss"){
                if (this.free_play){
                    this.top.innerHTML = `You lost and got no bonus reward`;
                } else{
                    this.top.innerHTML = `You did not find the solution and got no bonus reward!`;
                }
            } else if (this.game_result == "tie"){
                this.top.innerHTML = `You tied and got $0.1 bonus reward!`;
            } else if (this.game_result == "timeout"){
                this.top.innerHTML = `Sorry. You ran out of time.`;
            } else if (this.free_play){
                this.top.innerHTML = `Your turn to move (you are ${this.player})`;//Game ${this.game_index}: ${this.player == this.turn ? "Your" : "Opponent's"}
            } else if (this.submit_mode) {
                this.top.innerHTML = `Length: ${this.length}, New solution for Puzzle ${this.game_index}: ${this.current_state}`;
            } else {
                this.top.innerHTML = `Puzzle # ${this.puzzle}: You are playing <u>${this.turn}</u> <br/><br/>Plan the best move and say everything that goes through your mind  .`;//, Puzzle ${this.game_index}
            }
        }
        timer(time){
            // let diff = 1 - ((performance.now() - (this.last_click_time+100))/time);
            let diff = 1 - ((performance.now() - (this.click_time+100))/time);
            let pp = document.getElementById('progress');
            // console.log(performance.now(), this.last_click_time, time)
            if (diff < 0){
                this.game_result = "timeout";
                this.update_top();
                this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
                this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
                this.cvs.removeEventListener("touchstart", this.touchstartEventHandler);
                this.black_pieces = [];
                this.white_pieces = [];
                this.draw_board(null, null);
                setTimeout(()=>{
                    this.end_trial();
                },1000);
                clearInterval(this.interval);
            } else {
                pp.style.height = 100*diff+"%";
                //pp.style.backgroundColor = 'rgb(' + [255/(1+Math.exp(10*(diff-0.5))) + 100*Math.exp(-(diff-0.5)*(diff-0.5)/0.01), 255/(1+Math.exp(-10*(diff-0.5))) + 100*Math.exp(-(diff-0.5)*(diff-0.5)/0.01), 0].join(',') + ')';
                pp.style.backgroundColor = 'rgb(' + [Math.min(2*255*(1-diff), 255), Math.min(2*255*diff, 255), 0].join(',') + ')';
            }
        }
        initial_timer(time){
            let diff = performance.now() - time;
            let pp = document.getElementById('progress');
            if (diff > this.initial_delay){
                pp.style.backgroundColor = 'rgb(' + [0, 201, 0].join(',') + ')';
                this.can_click = true;
                clearInterval(this.initial_interval);
            }
        }
        // function to end trial when it is time
        end_trial(){
            // kill any remaining setTimeout handlers
            this.jsPsych.pluginAPI.clearAllTimeouts();
            // Kill listeners
            this.cvs.removeEventListener("mousemove", this.mouseMoveEventHandler);
            this.cvs.removeEventListener("mousedown", this.mouseDownEventHandler);
            this.cvs.removeEventListener("touchstart", this.touchstartEventHandler);
            this.cvs.removeEventListener("mouseup", this.mouseUpEventHandler);
            this.cvs.removeEventListener("touchend", this.touchendEventHandler);
            // kill keyboard listeners
            if (typeof this.keyboardListener !== "undefined") {
                this.jsPsych.pluginAPI.cancelKeyboardResponse(this.keyboardListener);
            }
            // gather the data to store for the trial
            var trial_data = {
                game_index: this.game_index,
                submit_mode: this.submit_mode && this.ready_to_submit,
                solution: this.current_state,
                level: this.level,
                player_color: this.player,
                result: this.game_result,
                free_play: this.free_play,
                length: this.length,
                puzzle: this.puzzle,
                initial_delay: this.initial_delay,
                planing_move: this.planing_move,
                recording: this.recordedChunks,
                first_move_RT: this.first_move_RT,
                all_move_RT: this.move_RT,
                all_move_times: this.move_times,
                duration: performance.now() - this.currentTrialStartTime,
                mouse_movements: this.mouse_movements,
            };
            // clear the display
            this.display_element.innerHTML = "";
            // move on to the next trial
            this.jsPsych.finishTrial(trial_data);
        };
        trial(display_element, trial){
            this.tree = trial.tree;
            this.free_play = trial.free_play;
            this.time_per_move = trial.time_per_move;
            this.puzzle = trial.puzzle;
            this.level = trial.get_level();
            this.tutorial = trial.tutorial;
            this.warm_up = trial.warm_up;
            this.free_click = trial.free_click;
            this.free_click_top = trial.free_click_top;
            console.log(this.game_index)
            if (this.free_play){
                // seed, black_pieces, white_pieces, opponent_color, level
                this.ai = Module.cwrap('makemove', 'number', ['number','string','string','number','number']);
                // if (trial.player == 1){
                //     let move = this.ai(Date.now(), "", "", 0, this.level);
                //     trial.pieces = [[move], []];
                //     this.current_state = move.toString();
                // }
            } else{
                this.initial_delay = trial.initial_delay;
                let start_time = performance.now();
                console.log(this.initial_delay);
                this.initial_interval = setInterval(() => this.initial_timer(start_time), 25);
            }
            this.reset_pieces(trial);
            this.game_index = trial.game_index;
            this.length = trial.length;
            let pb = `
            <div id="progress-bar">
                <div id="progress"></div>
            </div>`
            if (this.free_play){
                pb = ``
            }
            let bt = '<button id=\'stop-button\' class=\'puzzle_button\' disabled=\'false\' font-size=\'50px\'style=\'margin-left: 5px;\'> I am done thinking and ready to make a move </button>';
            let tp = '<h2 id=\'top\'> Puzzle '+ (this.game_index - 2).toString() +': You are playing <u>' + this.turn.toString() + '</u> <br/><br/> Plan the best move and say everything that goes through your mind </h1>';
            if(this.game_index<3){
                tp = '<h2 id=\'top\'> Practice Puzzle '+ this.game_index.toString() +': You are playing <u>' + this.turn.toString() + '</u> <br/><br/> Plan the best move and say everything that goes through your mind </h1>';
            }
            
            if (this.warm_up){
                tp = '<h2 id=\'top\'>Warm-up Question <br/><br/> <b>Which side is more likely to win?<br/><br/>Black\'s turn to move</b></h1>';
                bt += '<button id=\'black-button\' class=\'puzzle_button\' disabled=\'false\'> Black </button>';
                bt += '<button id=\'white-button\' class=\'puzzle_button\' disabled=\'false\'> White </button>';
            }
            if (this.free_click){
                bt = '<button id=\'stop-button\' class=\'puzzle_button\' disabled=\'false\' style=\'margin-left: 5px;\'> Next</button>';
                tp = `<h2 id=\'top\'>${this.free_click_top}</h1>`
            }
            else {
                bt = "<h2 id=\'down\'>Press the button below ONLY when you finish thinking </h2>" + bt
            }
            // Display HTML Puzzle and botton ${this.game_index}:
            display_element.innerHTML = `
            ${tp}
            <div id="container">
                <canvas id="game-canvas" width="${this.w}" height="${this.h}"></canvas>
                ${pb}
            </div>
            ${bt}
            `
            document.getElementById('stop-button').disabled = false;
            document.getElementById('progress-bar').style.visibility = 'hidden';
            if (this.warm_up){
                document.getElementById('black-button').disabled = false;
                document.getElementById('white-button').disabled = false;
                document.getElementById('black-button').style.visibility = "hidden";
                document.getElementById('white-button').style.visibility = "hidden";
            }
            if (this.free_play){
                //display_element.innerHTML += `<h1> Press 'Enter' to surrender`;
            } else {
                //this.interval = setInterval(() => this.timer(60000), 25);
                if (this.debug_mode){
                    display_element.innerHTML += `<h1>Press 'r' to reset, 'Space' for solution mode, 'Enter' to go to next puzzle</h1>
                    <h1>'s' for submit mode, 'Enter' once to confirm solution, twice to submit</h1>`; //birch: rgba(248,223,161,0.8)
                }
            }
            this.display_element = display_element;
            // Save references
            if (this.cvs == null) {
                this.cvs = document.getElementById('game-canvas');
                let rect = this.cvs.getBoundingClientRect();
                this.rect_left = rect.left;
                this.rect_top = rect.top;
                this.top = document.getElementById('top');
                if (!this.free_play){
                    let pb = document.getElementById('progress-bar');
                    pb.style.width = this.w/18+"px";
                    pb.style.height = this.h+"px";
                }
            }
            if (this.ctx == null) {
                this.ctx = this.cvs.getContext('2d');
            }
            // set current trial start time
            this.currentTrialStartTime = performance.now();
            this.lastSampleTime = performance.now();
            this.last_click_time = performance.now();
            // start data collection
            this.cvs.addEventListener("mousemove", this.mouseMoveEventHandler);
            this.cvs.addEventListener("mousedown", this.mouseDownEventHandler);
            this.cvs.addEventListener("mouseup", this.mouseUpEventHandler);
            this.cvs.addEventListener("touchstart", this.touchstartEventHandler);
            this.cvs.addEventListener("touchend", this.touchendEventHandler);
            // Draw board
            this.draw_board(null, null)
            if (this.free_click){
                document.getElementById('stop-button').addEventListener('click',()=>{this.end_trial()});
            }
            else{
                this.init_recorder()
                // var alertId = setTimeout(() => {
                //     this.top.innerHTML = `You have one minute left!`;
                // }, 24000); //maximum recording length: 300s
                // var timerId = setTimeout(() => {
                //     this.stop_recording();
                //     this.last_click_time = performance.now();
                //     setTimeout(() => {
                //         this.interval = setInterval(() => this.timer(this.time_per_move), 25);
                //     }, 100);
                // }, 30000); //maximum recording length: 300s
                document.getElementById('stop-button').addEventListener('click',()=>{
                    this.stop_recording();
                    //clearTimeout(timerId);
                    //clearTimeout(alertId);
                    //this.last_click_time = performance.now();
                    setTimeout(() => {
                        this.click_time = performance.now();
                        this.interval = setInterval(() => this.timer(this.time_per_move), 25);
                    }, 100);
                });
            }
            // function to handle responses by the subject
            var after_response = (info) => {
                if(info.key == "r" && !this.free_play && this.debug_mode){
                    // Reset background
                    this.cvs.style.backgroundColor = "rgba(0,0,0,0.4)";
                    this.reset_pieces(trial);
                    this.draw_board(null, null);
                } else if (info.key == " " && !this.free_play && this.debug_mode){
                    if (!this.solution_mode){
                        this.solution_mode = true;
                        if (this.current_state in this.tree){
                            this.hint_tiles = this.tree[this.current_state];
                        }
                        this.draw_board(null, null);
                    } else {
                        this.solution_mode = false;
                        this.hint_tiles = [];
                        this.draw_board(null, null);
                    }
                } else if(info.key == "enter" && this.debug_mode){
                    if (this.submit_mode) {
                        if (!this.ready_to_submit){
                            this.cvs.style.backgroundColor = "#23d0eb";
                            this.ready_to_submit = true;
                        } else {
                            this.end_trial();
                        }
                    } else {
                        this.end_trial();
                    }
                } else if (info.key == "s" && !this.free_play && this.debug_mode) {
                    if (!this.submit_mode) {
                        this.submit_mode = true;
                        this.reset_pieces(trial);
                    } else {
                        // Reset background
                        this.cvs.style.backgroundColor = "rgba(0,0,0,0.4)";
                        this.submit_mode = false;
                        this.reset_pieces(trial);
                    }
                    this.draw_board(null, null);
                }
            };
            // start the response listener
            this.keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: after_response,
                valid_responses: "ALL_KEYS",
                rt_method: "performance",
                persist: true,
                allow_held_key: false,
            });
        }
    }
    FourInARow.info = info;
  
    return FourInARow;
  
})(jsPsychModule);