import {ynode, shuffle, comprehension_set, check_password} from './utils.js';
import {get_puzzle_board, get_puzzle_tree} from './forced_win_boards.js';

export var recordedBlobs = [];
export var recorder = null;
export var config = {};
export var pid = -1;
export var points = 0;
export var bonus = 0;
export var level = 50;
export var free_play_tutorial_try = 0;
export var puzzles_tutorial_try = 0;
export var puzzles_results = {};
export var freeplay_results = [{
    "event_type": "event_type",
    "event_time": "event_time",
    "pid": "pid",
    "tid": "tid",
    "is_practice": "is_practice",
    "level": "level",
    "user_color": "user_color",
    "user_move": "user_move",
    "opponent_move": "opponent_move",
    "result": "result"
}];
export function get_level(){
    return level
}

export function get_points(){
    return points
}

export function get_bonus(){
    return bonus
}

export async function set_video_recorder(){
    const stream = await navigator.mediaDevices.getDisplayMedia({video: true})
    recorder = new MediaRecorder(stream)
    recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    };
}

export var ineligible = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    choices: [" "],
    on_load: () => {
        let exitMessage = '<h3>Unfortunately, you do not qualify for this study.</h3>';        
        exitMessage += '<h3><br><br>We are sorry for the inconvenience!</h3>';
        jsPsych.endExperiment(exitMessage);
    },
}

export var browser_wrong = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "",
    choices: [" "],
    on_load: () => {
        let exitMessage = '<h3>You must use Google Chrome for this experiment.</h3>';        
        exitMessage += '<h3><br><br>We are sorry for the inconvenience! You may open this window in Chrome and continue if you wish.</h3>';
        jsPsych.endExperiment(exitMessage);
    },
}

/**
 * Uploads data to Firebase
 * 
 * @param {Number} id the user id
 * @param {object} data the data to be uploaded (in JSON Object form)
 */
export function uploadData(id, category, game_index, data){
    // config.set(config.ref(config.database, id+"/"+category+"/"+game_index), data).then(() => {
    //     // Data saved successfully!
    // }).catch((error) => {
    //     alert("Saving data failed")
    // });

    let json = JSON.stringify(data, null, "\t");
    // let json = JSON.stringify(data);
    let blob = new Blob([json], {type: "application/json"});
    let url  = URL.createObjectURL(blob);

    let a = document.createElement('a');
    if(game_index != -1){
        a.download = category + game_index.toString() + ".json";
    }
    else{
        a.download = category + ".json";
    }
    a.style = "display: none";
    a.href = url;
    a.textContent = 'Download JSON';

    document.body.appendChild(a);
    a.click();
}


export function uploadcsv(id, category, game_index, data){
    function convertToCSV(objArray) {
        let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';

        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (let index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
    }
    let csv = convertToCSV(data);
    let csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    let csvUrl = URL.createObjectURL(csvBlob);
    let a = document.createElement('a');
    a.href = csvUrl;
    a.target = '_blank';
    a.style = "display: none";
    if(game_index != -1){
        a.download = category + game_index.toString() + ".csv";
    }
    else{
        a.download = category + ".csv";
    }
    document.body.appendChild(a);
    a.click();
}


export async function readData(id, category, game_index){
    let data = null;
    const dbRef = config.ref(config.database);
    await config.get(config.child(dbRef, id+"/"+category+"/"+game_index)).then((snapshot) => {
        if (snapshot.exists()) {
            data = snapshot.val();
        }
        }).catch((error) => {
        console.error(error);
    });
    return data
}

export function save_puzzle_data(){
    recorder.stop();
    let data = jsPsych.data.getLastTrialData().trials[0]
    if (data.submit_mode){
        let existing_data = readData(config.id, "puzzles", data.game_index)
        existing_data.then((result) => {
            if (result != null){
                result.push(data.solution)
            } else {
                result = [data.solution]
            }
            //uploadData(config.id, "puzzles", data.game_index, result)
            puzzles_results[data.game_index] = result;
        })
    } else {
        if (data.result == 'win'){
            if (data.length == 2){
                points += 100;
                bonus += 0.25;
            } else if (data.length == 3){
                points += 200;
                bonus += 1;
            } else if (data.length == 4){
                points += 300;
                bonus += 2;
            }
        }
        else if(data.result =='success'){
                bonus +=2;
        }
        var date = new Date();
        let result = {
            date: date.toLocaleString(),
            solution: data.solution,
            length: data.length,
            player_color: data.player_color,
            result: data.result,
            puzzle: data.puzzle,
            planing: data.planing_move,
            first_move_RT: data.first_move_RT,
            all_move_RT: data.all_move_RT,
            all_move_times: data.all_move_times,
            mouse_movements: data.mouse_movements,
            duration: data.duration
            //initial_delay: data.initial_delay
        };
        //uploadData(config.id, "puzzles", data.game_index, result)
        //puzzles_results[data.game_index] = result;
        uploadData(config.id, "planning", data.game_index, result)
        puzzles_results[String(data.game_index)] = result;
        let audioBlob = new Blob(data.recording, { 'type' : 'audio/wav; codecs=opus' });
        let audioUrl = window.URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        let a = document.createElement("a");
        a.style = "display: none";
        a.download = data.game_index + "_audio_recording.wav";
        a.href = audioUrl;
        a.click();
        let videoBlob = new Blob(recordedBlobs, {type: 'video/mp4'});
        let videoUrl = window.URL.createObjectURL(videoBlob);
        let video_a = document.createElement('a');
        video_a.style = 'display: none';
        video_a.href = videoUrl;
        video_a.download = data.game_index + '_screen_recording.mp4';
        document.body.appendChild(video_a);
        video_a.click();
        recordedBlobs = [];
        setTimeout(() => {
            document.body.removeChild(video_a);
            window.URL.revokeObjectURL(videoUrl);
        }, 100);
    }
}

export function save_free_play_data(tid){
    let data = jsPsych.data.getLastTrialData().trials[0]
    // let existing_data = readData(config.id, "free_play", data.game_index)
    // existing_data.then((result) => {
    //     if (result != null){
    //         result.push(data.solution)
    //     } else {
    //         result = [data.solution]
    //     }
    //     uploadData(config.id, "free_play", data.game_index, result)
    // })
    if (data.submit_mode){
        let existing_data = readData(config.id, "free_play", data.game_index)
        existing_data.then((result) => {
            if (result != null){
                result.push(data.solution)
            } else {
                result = [data.solution]
            }
            //uploadData(config.id, "puzzles", data.game_index, result)
            freeplay_results[data.game_index] = result;
        })
    } else {
        if (data.result == 'win'){
            points += 100;
            bonus += 0.2;
            level = Math.min(199, level + 10);
        } else if (data.result == 'tie'){
            points += 50;
            bonus += 0.1;
            level = Math.max(0, level - 10);
        } else {
            level = Math.max(0, level - 10);
        }
    }
    var date = new Date();
    let result = {
        date: date.toLocaleString(),
        solution: data.solution,
        level: data.level,
        player_color: data.player_color,
        result: data.result,
        first_move_RT: data.first_move_RT,
        all_move_RT: data.all_move_RT,
        all_move_times: data.all_move_times,
        mouse_movements: data.mouse_movements,
        duration: data.duration
    };
    freeplay_results.push({
        "event_type": "start game",
        "event_time": date.toLocaleString().replace(', ', '-'),
        "pid": pid,
        "tid": tid,
        "is_practice": "FALSE",
        "level": " ",
        "user_color": " ",
        "user_move": " ",
        "opponent_move": " ",
        "result": " "
    });
    //freeplay_results.push(["event_type","event_time","pid","is_practice","level","user_color","user_move","opponent_move","result"])
    for(let i=0; i<data.solution.length; i++){
        if(data.player_move[i]!=-1){
            freeplay_results.push({
                "event_type": "user move",
                "event_time": date.toLocaleString().replace(', ', '-'),
                "pid": pid,
                "tid": tid,
                "is_practice": "FALSE",
                "level": data.level,
                "user_color": data.player_color,
                "user_move": data.player_move[i],
                "opponent_move": " ",
                "result": " "
            });
        }else{
            freeplay_results.push({
                "event_type": "opponent move",
                "event_time": date.toLocaleString().replace(', ', '-'),
                "pid": pid,
                "tid": tid,
                "is_practice": "FALSE",
                "level": data.level,
                "user_color": data.player_color,
                "user_move": " ",
                "opponent_move": data.ai_move[i],
                "result": " "
            });
        }
    }
    freeplay_results.push({
        "event_type": "end game",
        "event_time": date.toLocaleString().replace(', ', '-'),
        "pid": pid,
        "tid": tid,
        "is_practice": "FALSE",
        "level": data.level,
        "user_color": " ",
        "user_move": " ",
        "opponent_move": " ",
        "result": data.result
    });
    uploadData(config.id, "free_play", data.game_index, result)
}

export function save_demographic_data(){
    let data = jsPsych.data.getLastTrialData().trials[0]
    uploadData(config.id, "demographic", -1, data.response)
}

export function save_first_timestamp_data(){
    // uploadData(config.id, "time_stamps", "performance_start", performance.now())
    var date = new Date();
    uploadData(config.id, "time_stamps", "_date_start", date.toLocaleString())
}

export function save_last_timestamp_data(){
    // uploadData(config.id, "time_stamps", "performance_end", performance.now())
    var date = new Date();
    uploadData(config.id, "time_stamps", "_date_end", date.toLocaleString())
    uploadData(config.id, "bonus", "bonus", bonus)
    //uploadData(config.id, "bonus", "points", points)
    //uploadData(config.id, "bonus", "bonus", Math.round(100 * points/(9000/14))/100)
}

export function save_freeplay_instruction_data(){
    let data = jsPsych.data.getLastTrialData().trials[0]
    uploadData(config.id, "instructions", "free_play", data.view_history)
}

export function save_freeplay_practice(){
    let data = jsPsych.data.getLastTrialData().trials[0]
    var date = new Date();
    let result = {
        date: date.toLocaleString(),
        solution: data.solution,
        level: data.level,
        player_color: data.player_color,
        result: data.result,
        first_move_RT: data.first_move_RT,
        duration: data.duration,
        all_move_RT: data.all_move_RT,
        all_move_times: data.all_move_times,
        mouse_movements: data.mouse_movements,
    };
    uploadData(config.id, "practice", "free_play_"+100*free_play_tutorial_try+data.game_index, result)
}

export function save_puzzle_practice(){
    let data = jsPsych.data.getLastTrialData().trials[0]
    var date = new Date();
    let result = {
        date: date.toLocaleString(),
        player_color: data.player_color,
        solution: data.solution,
        result: data.result,
        first_move_RT: data.first_move_RT,
        duration: data.duration,
        all_move_RT: data.all_move_RT,
        all_move_times: data.all_move_times,
        mouse_movements: data.mouse_movements,
        //initial_delay: data.initial_delay
    };
    uploadData(config.id, "practice", "puzzles_"+100*puzzles_tutorial_try+data.game_index, result)
}

export function save_puzzle_instruction_data(){
    let data = jsPsych.data.getLastTrialData().trials[0]
    uploadData(config.id, "instructions", "puzzles", data.view_history)
}

export async function is_subject_eligible(){
    let existing_data = readData(config.id, "eligible", 0)
    existing_data.then((result) => {
        if (result != null){
            if (result == true){
                return true
            } else{
                return false
            }
        } else {
            return true
        }
    })
}

export function set_subject_ineligible(){
    uploadData(config.id, "eligible", -1, false)
}

/**
 * Main body of the experiment
 * 
 * @param {List} timeline the timeline from jsPsych 
 */
export function create_timeline(timeline){
    // -------------------------------------------------- #PART 1: INITIALIZATION ---------------------------------------------------------
    var images = [
        'media/free_play_comprehension.png',
        'media/puzzles_comprehension1.png',
        'media/instructions1.png',
        'media/instructions2.png', 
        'media/instructions3.png',
        'media/instructions4.png',
        'media/instructions5.png', 
        'media/instructions6.png', 
        'media/instructions7.png', 
        'media/instructions8.png', 
        'media/instructions9.png',
        'media/planning1.png',
        'media/planning2.png',
        'media/planning3.png',
        'media/planning4.png',
        'media/planning5.png',
        'media/planning6.png',
        'media/planning7.png',
        'media/planning8.png',
        'media/planning9.png',
        'media/planning10.png',];
    var audio = ['media/sounds/correct6.wav', 'media/sounds/wrong1.wav','media/sounds/mousedown.mp3','media/sounds/mouseup.wav'];

    var preload = {
        type: jsPsychPreload,
        images: images,
        audio: audio 
    }

    var set_participant_id = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'text',
                    prompt: "Enter the Subject ID",
                    name: 'pid',
                    input_type: 'text',
                    required: true,
                },
            ],
        ],
        button_label_next: 'Continue',
        button_label_finish: 'Submit',
        on_finish: (data) => {
            pid = data.response.pid;
        },
    };

    var enter_fullscreen = {
        // message: `
        // <h1>Four In A Row</h1>
        // <p>
        //     Welcome to the study! The aim of this study is to learn more about the ways people plan.
        //     <br/><br/>
        //     This experiment has sound effects so we encourage you to turn your <b>sound on</b>. <br/><br/>
        //     The experiment will switch to full screen mode when you press the button below. <br/><br/>
        //     Please <b>remain in full screen</b> for the rest of the experiment.
        // </p>`,
        type: jsPsychFullscreen,
        fullscreen_mode: true,
        on_load: () => {
            save_first_timestamp_data()
            set_video_recorder()
        }
    }

    var consent_form = {
        type: jsPsychSurvey,
        pages: [
            [{
                type: 'html',
                prompt: '<p>Please read the consent form and sign by ticking the checkbox.</p>'+
                    '<iframe src="media/consent.pdf#zoom=60" width="100%" height="300px"></iframe>'+
                    '<p style="font-size:10pt; margin:0">' +
                    '<a href="media/consent.pdf" target="_blank" download="media/consent.pdf" style="font-size:10pt; margin:0; color:#b0ccff">' +
                    'Click here to download the pdf for your records.</a></p>',
            }, 
            {
                type: 'multi-choice',
                prompt: "Do you agree to take part in this study?", 
                name: 'agree', 
                options: ['I agree', 'I do not agree'],
                required: true,
            }]
        ],
        title: 'Consent form',
        button_label_finish: 'Submit',
        on_finish: (data) => {
            let agree = data.response.agree;
            if (agree == 'I do not agree') {
                let exitMessage = '<h3>Unfortunately, you do not qualify for this study.</h3>';        
                exitMessage += '<h3><br><br>We are sorry for the inconvenience! You can close this browser window now.</h3>';
                jsPsych.endExperiment(exitMessage);
            }
        },
    };

    var demographic_survey = {
        type: jsPsychSurvey,
        pages: [
          [
            {
              type: 'text',
              prompt: "Enter your age", 
              name: 'age', 
              input_type: 'number',
              required: true,
            }, 
            {
              type: 'multi-choice',
              prompt: "What is your gender?", 
              name: 'gender', 
              options: ['Non-binary', 'Female', 'Male', 'Prefer not to say'],
              required: true,
            }
          ],
          [
            {
              type: 'multi-choice',
              prompt: "Are you of Hispanic, Latino, or of Spanish origin?", 
              options: ['Yes', 'No', 'Prefer not to say'],
              name: 'ethnicity', 
              required: true,
            }, 
            {
              type: 'multi-select',
              prompt: "How would you describe yourself?", 
              options: ['American Indian or Alaskan Native','Asian','Black or African American','Native Hawaiian or Other Pacific Islander', 'White', 'Other', 'Prefer not to say'],
              columns: 1,
              name: 'race', 
              required: true,
            }
          ]
        ],
        title: 'Questionnaire',
        button_label_next: 'Continue',
        button_label_back: 'Previous',
        button_label_finish: 'Submit',
        on_finish: (data) => {
            let age = data.response.age;
            if (age < 18 || age > 100) {
                let exitMessage = '<h3>Unfortunately, you do not qualify for this study.</h3>';        
                exitMessage += '<h3><br><br>We are sorry for the inconvenience! You can close this browser window now.</h3>';
                set_subject_ineligible();
                jsPsych.endExperiment(exitMessage);
            } else {
                save_demographic_data();
            }
        },
    };

    // -------------------------------------------------- #PART 2: FREE PLAY ---------------------------------------------------------
    var free_play_instructions = {
        type: jsPsychInstructions,
        pages: [
        "In this study, you will play a game called '4-in-a-row' against computer agents.<br/><br/>",

        'You and the computer agent will take turns placing Black and White pieces on a game board.<br/><br/>' +
        '<img width="800" height="auto" src="media/instructions1.png"></img>',

        'If you get 4 pieces in a row before the computer agent does, you win! <br/><br/>' +
        '<img width="800" height="auto" src="media/instructions2.png"></img>',

        'You can connect your 4 pieces in any direction: horizontally, vertically, or diagonally.<br/><br/>' +
        '<img width="800" height="auto" src="media/instructions3.png"></img>',

        'If the computer gets 4-in-a-row before you do, you <b>lose</b>.<br/><br/>',

        'If the board is full and no one has 4-in-a-row, the game is a <b>tie</b>.<br/><br/>' +
        '<img width="800" height="auto" src="media/instructions4.png"></img>',

        '<b>Black</b> always goes first. You will alternate between playing as Black and White. <br/>'+
        'If you play Black in your first game, you will play White in your second game, etc.',

        'If you run into any technical issues when you are doing this study, for example: <br/><br/>'+
        '   the full-screen mode is exited,  <br/>'+
        '   the touch screen becomes unresponsive or responds inaccurately, <br/>'+
        '   unknown warming is popping up, <br/><br/>'+
        'please inform the experimenter immediately.<br/><br/>',

        'The study consists of two stages. In the first stage of the study, you will be freely playing against a computer agent.<br/><br/>' ,

        'There are <b>40</b> games in total. ',
        
        'You will receive <b>$10</b> for completing this stage of the study, with a maximum bonus of <b>$8</b> based on performance. <br/><br/>' +
        'You will not be paid if you drop out early or end the study before it is complete.',

        '<b>Bonus Reward</b><br/><br/>' +
        'You will get <b>$0.20 for winning</b> a game, <b>$0.10 for a tie</b> and <b>nothing if you lose</b>.<br/><br/>',
        ],
        show_clickable_nav: true,
        view_duration: 2000,
        on_finish: save_freeplay_instruction_data
    }

    let free_play_tutorial = [];
    free_play_tutorial.push(free_play_instructions)
    

    var free_play_comprehension = comprehension_set({timeline: [...free_play_tutorial]}, 
        [
            {
                text: "<h3>What is the goal of the game?</h3>", 
                options: [
                    "Place four pieces next to each other in any shape",
                    "Finish the game as fast as possible",
                    "Place four pieces of your color in a line"
                ], 
                desc: "The goal of the game is to place four pieces of your color in a straight line.",
                answer: 2
            },
            {
                text: `<div class="img-container"><img src='media/free_play_comprehension.png' height=300/></div><br/><br/>
                       <h3>Which player has won in this case?</h3>`
                , 
                options: [
                    "Black",
                    "White",
                    "Neither"
                ], 
                desc: "White had 4 pieces in a row and hence won.",
                answer: 1
            },
            {
                text: `<h3>Which player goes first?</h3>`
                , 
                options: [
                    "White",
                    "Black",
                    "Random"
                ], 
                desc: "Black always goes first.",
                answer: 1
            },
            {
                text: `<h3>How much bonus reward do you get if you tie?</h3>`
                , 
                options: [
                    "$0.20",
                    "$0.10",
                    "$0.00"
                ], 
                desc: "You get $0.10 bonus reward for a tie, which is half of what you get for a win.",
                answer: 1
            },
        ]
    )

    var after_practice_free_play = {
        type: jsPsychInstructions,
        pages: [
            'Practice ends! Any questions?',
            'Now we enter the official games.<br/><br/>'+
            'In between games, you can take some rest.</b>',
            'Good luck!'
        ],
        show_clickable_nav: true,
        view_duration: 1000,
        allow_keys: false,
        button_label_next: "Next"
    }
    function ready_check_free_play(orderstr){
        return {
            type: jsPsychInstructions,
            pages: [
                '<h1>Are you ready to start game ' + orderstr +'?</h1><br/><br/>'
            ],
            show_clickable_nav: true,
            view_duration: 1000,
            allow_keys: false,
            button_label_next: 'Yes. I am ready',
            allow_backward: false
        }
    }

    // -------------------------------------------------- #PART 3: FREE CONVERSATION ---------------------------------------------------------

    // var init_mic = {
    //     type: jsPsychInitializeMicrophone
    // }
    var free_conversation_instruction = {
        type: jsPsychInstructions,
        pages: [
            'Welcome to the second stage of the study.',
            // '<h1>Warm-up Question</h1> <br/><br/>' +
            // 'Please speak our <b>EVERYTHING</b> that flows into your mind.<br/>You have unlimited time.<br/><br/>' +
            // '<b>If you are going to be a tour guide for your friends from the UK on a 3-day trip in New York City, how will you plan the trip?</b><br/><br/>'
        ],
        show_clickable_nav: true,
        button_label_next: "Next"
    }
    var free_recorder = null;
    var free_recordedChunks = [];
    var free_conversation_record = {
        type: jsPsychInstructions,
        pages:[
            `<h3>Warm-up Question</h3> 
        <p>You will read a scenario and an open-ended question in the next page <br/><br/>
        Please say <b>EVERYTHING</b> that goes through your mind.<br/>
        It is completely fine to say something irrelevant to the task<br/>
        You have unlimited time. </p >`,
            `<h3>Warm-up Question</h3>
        <p><b>Your friend Mary is coming to New York City for a 3-day trip. You are going to be her tour guide.<br/>
        How will you plan the trip?</b><br/><br/>
        Please say <b>EVERYTHING</b> that goes through your mind.<br/>
        It is completely fine to say something irrelevant to the task.<br/> 
        You have unlimited time.<br/><br/><br/> 
        </p >`
        ],
        show_clickable_nav: true,
        done_button_label: "Next",
        on_load: async () => {var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            free_recorder = new MediaRecorder(stream, {mimeType: 'audio/wav'});
            free_recorder.ondataavailable = (event) => {
                free_recordedChunks.push(event.data);
            }
            free_recorder.start()},
        on_finish: () => {free_recorder.stop();console.log('The warm-up is over!')}
        }

    // -------------------------------------------------- #PART 4: PLANNING ---------------------------------------------------------

    var planning_insturctions_part1 = {
        type: jsPsychInstructions,
        pages: [
            "Now let's go through the instructions.",

            'In this stage, you will solve four-in-a-row puzzles and tell us what you are thinking about.',

            'Instead of starting from an empty board, you will start with some pieces already on the board.<br/><br/><br/>' +
            "<img width='1000' height='auto' src='media/planning1.png'></img>",

            'The text on top will tell you what color you are playing. <br/><br/><br/>' +
            "<img width='1000' height='auto' src='media/planning2.png'></img>",

            'Your job is to find the best move, and while you do so,<br/>' +
            'please say <b>EVERYTHING</b> that goes through your mind.<br/><br/>' +
            "<img width='1000' height='auto' src='media/planning3.png'></img>",

            'It is completely fine to say something irrelevant to the task. <br/><br/><br/>'+
            "<img width='1000' height='auto' src='media/planning3.png'></img>",

            'You have <b>unlimited</b> time. <br/><br/><br/>'+
            "<img width='1000' height='auto' src='media/planning3.png'></img>",

            'When you start talking about a move on a square, you should touch that square.<br/><br/><br/>' +
            "<img width='1000' height='auto' src='media/planning4.png'></img>",

            "When you touch the square, it will light up and you will hear a click sound. <br/>" +
            "If not, please touch again. <br/><br/>" +
            "<img width='1000' height='auto' src='media/planning5.png'></img>",

            "Let's interact with the board to see how it works!",
        ],
        show_clickable_nav: true,
        view_duration: 2000,
        allow_keys: false,
        button_label_next: "Next"
    }
    var planning_insturctions_part2 = {
        type: jsPsychInstructions,
        pages: [
            'Please REMEMBER to touch the square that you are thinking about. It is the only way to record the square you are mentioning.',
            
            "Please avoid air gestures because they will not be recorded.",

            'If you are describing a pattern of the board position (e.g., 3-in-a-row), you need to touch those squares one by one.<br/><br/>' +
            "<img width='1000' height='auto' src='media/three_in_a_row.gif'></img>",

            'Please make sure to touch EVERY square you are mentioning!',

            "If you accidentally touched a wrong square, just tell us you made a mistake and then touch the correct square.<br/><br/>" +
            "<img width='1000' height='auto' src='media/planning6.png'></img>",
        ],
        show_clickable_nav: true,
        view_duration: 2000,
        allow_keys: false,
        button_label_next: "Next"
    }

    var planning_insturctions_part3 = {
        type: jsPsychInstructions,
        pages: [
            'When you are done thinking, please press this  “I am done thinking and ready to make a move" button<br/>'+
            'Do not press it if you are not done thinking!<br/><br/>' +
            "<img width='1000' height='auto' src='media/planning7.png'></img>",

            'After you press the button, you need to make your move in 5 seconds, and then this trial ends.<br/>'+
            'You will see this 5-second countdown timer bar on the right side. <br/><br/>' +
            "<img width='1000' height='auto' src='media/planning8.png'></img>",

            'If you run into any technical issues when you are doing this study, for example: <br/><br/>'+
            '   the full-screen mode is exited,  <br/>'+
            '   the touch screen becomes unresponsive or responds inaccurately, <br/>'+
            '   unknown warming is popping up, <br/><br/>'+
            'please inform the experimenter immediately.<br/><br/>',

            'There are <b>10</b> puzzles in total.',

            'You will receive <b>$10</b> for completing this stage of the study, with a maximum bonus of <b>$20</b> based on performance. <br/><br/>' +
            'You will not be paid if you drop out early or end the study before it is complete.',

            '<b>Bonus Reward</b><br/><br/>' +
            'You will get <b>$2.00 for finding the best move</b> for each puzzle, and <b>nothing if you fail</b>.<br/>'+
            'So you can get up to <b>$30</b> in this stage!<br/><br/>',

            'Each puzzle may have more than one best move. You will be rewarded for finding ANY of the best moves.<br/><br/>',

            'You will NOT be told whether you earn a bonus after each trial ends.<br/>'+
            'But you will know the total bonus amount at the end of the study.<br/><br/>',

            // "The time limit for talking about your thinking process in each puzzle is 5 minutes. <br/>" +
            // "When time is up, it will jump to the page that you need to make a choice in 5s.<br/><br/>" +
            // "<img width='auto' height='600' src='media/planning9.png'></img>",

            // "You will see a alert when you have 1 minute left. <br/><br/>" +
            // "<img width='auto' height='600' src='media/planning10.png'></img>",

        ],
        show_clickable_nav: true,
        view_duration: 2000,
        allow_keys: false,
        button_label_next: "Next"
    }
    
    let planning_tutorial = [];
    planning_tutorial.push(planning_insturctions_part1);
    planning_tutorial.push({
        type: jsPsychFourInARow,
        pieces: get_puzzle_board(1),
        free_play: false,
        initial_delay: 0,//10000 + Math.round(20000*Math.random()),
        tree: get_puzzle_tree(1),
        get_level: () =>{0},
        game_index: 1,
        length: Math.floor((1-1)/10) + 2,
        puzzle: 1,
        time_per_move: 5000,
        free_click: true,
        free_click_top: "Let's interact with the board now"
        // on_finish: save_puzzle_data
    })
    planning_tutorial.push(planning_insturctions_part2);
    let three_in_a_row_example = [[6, 7, 11, 21, 31], [5, 14, 23, 32]];
    planning_tutorial.push({
        type: jsPsychFourInARow,
        pieces: three_in_a_row_example,
        free_play: false,
        initial_delay: 0,//10000 + Math.round(20000*Math.random()),
        tree: get_puzzle_tree(1),
        get_level: () =>{0},
        game_index: 1,
        length: Math.floor((1-1)/10) + 2,
        puzzle: 1,
        time_per_move: 5000,
        free_click: true,
        free_click_top: "Let's practice talking about patterns of the board position while touching the squares!"
        // on_finish: save_puzzle_data
    })
    planning_tutorial.push(planning_insturctions_part3);

    var planning_comprehension = comprehension_set({timeline: [...planning_tutorial]},
        [
            {
                text: "<h3>What should you say while thinking? </h3>",
                options: [
                    "Ideas related to finding the best move only and avoid saying anything unrelated to this game",
                    "Ideas related to preventing opponents from winning",
                    "Everything that goes through your mind while you are thinking about the best move",
                ],
                desc: "You should say everything that goes through your mind.",
                answer: 2
            },
            {
                text: `<h3>What should you do after touching a wrong square while thinking?</h3>`
                ,
                options: [
                    "Touch the correct square only. ",
                    "Tell us you made a mistake and then touch the correct square.",
                    "Ignore it."
                ],
                desc: "You should tell us that you just touched a wrong square.",
                answer: 1
            },
            {
                text: `<div class="img-container"><img src='media/puzzles_comprehension1.png' height=400/></div><br/>
                       <h3>Which color are you playing in this puzzle?</h3>`
                , 
                options: [
                    "Black",
                    "White",
                    "Can't tell"
                ], 
                desc: "It is white's turn, as is mentioned in the text above the board.",
                answer: 1
            },
            {
                text: `<h3>How long do you have to make a move after you press<br/> “I am done thinking and ready to make a move” button?</h3>`
                ,
                options: [
                    "15 s",
                    "10 s",
                    "5 s",
                    "3 s"
                ],
                desc: "You only have 5 seconds to make a move.",
                answer: 2
            },
            {
                text: `<h3>How much bonus reward do you get if you find the best move for each puzzle?</h3>`
                , 
                options: [
                    "$2.00",
                    "$1.00",
                    "$0.50",
                    "$0.20",
                ], 
                desc: "You get $2.00 bonus reward for if you find the best move for each puzzle.",
                answer: 0
            },
        ]
    )

    var after_practice = {
        type: jsPsychInstructions,
        pages: [
            'Practice ends! Any questions?', 
            'Now we enter the official puzzles.<br/><br/>'+
            'In between puzzles, you can take some rest.</b>',
            'Good luck!'
        ],
        show_clickable_nav: true,
        view_duration: 1000,
        allow_keys: false,
        button_label_next: "Next"
    }

    function ready_check_planning(orderstr){
        return {
            type: jsPsychInstructions,
            pages: [
                '<h1>Are you ready to start puzzle ' + orderstr +'?</h1><br/><br/>'
            ],
            show_clickable_nav: true,
            view_duration: 1000,
            allow_keys: false,
            button_label_next: 'Yes. I am ready',
            allow_backward: false
        }
    }


    // -------------------------------------------------- #PART 5: PUZZLES ---------------------------------------------------------


    var puzzles_instructions = {
        type: jsPsychInstructions,
        pages: [
        'You will now start the second experiment.',
        'Instead of starting from an empty board, you will start with pieces already on the board.<br/><br/>' +
        "<img width='80%' height='auto' src='media/instructions5.png'></img>",
        'The text on top will tell you how many moves you are given to get a 4-in-a-row. <br/><br/>Furthermore, it also says what color you are playing. <br/><br/>' +
        "<img width='80%' height='auto' src='media/instructions7.png'></img>",
        'Your job is to find the correct sequence of moves that leads to a 4-in-a-row. <br/><br/>' + 
        "<img width='80%' height='auto' src='media/instructions6.png'></img>",
        "The opponent will make the best possible moves to stop you from getting a 4-in-a-row.<br/><br/>"+
        "You must therefore choose the moves that will <b>FORCE</b> a win within the specified number of moves.",
        'Puzzles requiring more moves will give more <b>bonus reward</b> if solved.<br/><br/>' +
        `<table cellspacing='16vw'>
            <tr>
                <th>Moves</th>
                <th>Bonus Reward</th>
            </tr>
            <tr>
                <td>2</td>
                <td>$0.25</td>
            </tr>
            <tr>
                <td>3</td>
                <td>$1.00</td>
            </tr>
            <tr>
                <td>4</td>
                <td>$2.00</td>
            </tr>
        </table><br/><br/>`,
        'You can take <b>as much time as you want for the first move</b>. <br/><br/>Use this time to <b>plan</b> which moves you will make.<br/><br/>',
        //'As soon as the timer bar on the right turns green, you can make your first move. <br/><br/> (You may always choose to wait longer to plan a bit more if you would like.)'+
        //"<img width='30%' height='auto' src='media/instructions_extra.png'></img>",
        'You will have <b>3 seconds </b>to make every move afterwards.<br/><br/> As soon as you make your first move, the green bar on the right will start the 3 seconds countdown.' +
        "<img width='80%' height='auto' src='media/instructions8.png'></img>",
        'If you make a move that does not lead to a 4-in-a-row in the specified number of moves,</br> the trial will end and you will get no bonus reward. <br/><br/>' +
        "<img width='80%' height='auto' src='media/instructions9.png'></img>",
        'There are 30 puzzles in total. As before, we will do two practice rounds first.',
        ],
        show_clickable_nav: true,
        view_duration: 2000,
        allow_keys: false,
        on_finish: save_puzzle_instruction_data
    }

    let puzzles_tutorial = [];
    puzzles_tutorial.push(puzzles_instructions);

    puzzles_tutorial.push({
        type: jsPsychFourInARow,
        pieces: [[12, 13, 14], [11, 4, 22]],
        free_play: false,
        tutorial: true,
        tree: {"root":[15], "15": -1},
        get_level: () =>{0},
        game_index: 1,
        time_per_move: 3000,
        length: 1,
        initial_delay: 0,//5000 + Math.round(5000*Math.random()),
        on_load: () => {puzzles_tutorial_try += 1},
        on_finish: save_puzzle_practice
    })

    puzzles_tutorial.push({
        type: jsPsychFourInARow,
        pieces: get_puzzle_board(0),
        free_play: false,
        tutorial: true,
        tree: get_puzzle_tree(0),
        get_level: () =>{0},
        game_index: 2,
        time_per_move: 3000,
        length: 2,
        initial_delay: 0,//5000 + Math.round(5000*Math.random()),
        on_finish: save_puzzle_practice
    })

    var puzzles_comprehension = comprehension_set({timeline: [...puzzles_tutorial]},
        [
            {
                text: "<h3>How many moves can I make in a puzzle?</h3>", 
                options: [
                    "As many as it takes for me to win",
                    "As many as I am told I am given in the text above the board",
                    "One"
                ], 
                desc: "The text above the board tells you how many moves you are given to solve the puzzle.",
                answer: 1
            },
            {
                text: `<div class="img-container"><img src='media/puzzles_comprehension1.png' height=300/></div><br/><br/>
                       <h3>Which color are you playing in this case?</h3>`
                , 
                options: [
                    "Black",
                    "White",
                    "Can't tell"
                ], 
                desc: "It is white's turn as is mentioned in the text above the board.",
                answer: 1
            },
            {
                text: `<div class="img-container"><img src='media/puzzles_comprehension2.png' height=300/></div><br/><br/>
                       <h3>Why did the player fail to solve this puzzle (foced win in 2 moves) in this case?</h3>`
                , 
                options: [
                    "The move they selected did not lead to a solution in 2 moves",
                    "They took too long to make their move",
                    "The opponent got a 4-in-a-row"
                ], 
                desc: "The move they made allows black to stop them from winning in 2 moves.",
                answer: 0
            },
            {
                text: `<h3>How many seconds do you have to make your first move?</h3>`
                , 
                options: [
                    "1",
                    "3",
                    "As many as I want"
                ], 
                desc: "You can take as much time as you want to make the first move.",
                answer: 2
            },
            {
                text: `<h3>How much bonus reward do you get if you complete a 4 move puzzle?</h3>`
                , 
                options: [
                    "$0.25",
                    "$1.00",
                    "$2.00"
                ], 
                desc: "You get $2.00 bonus reward for solving a 4 move puzzle.",
                answer: 2
            },
        ]
    )
    var puzzles_walkthrough = {
        type: jsPsychInstructions,
        pages: [
        'As a final check before the experiment, we will walk you through a slightly harder puzzle. <br/><br/>' +
        'This is a <b>length 4</b> puzzle and you are playing as black. <br/><br/>' +
        "<img width='80%' height='auto' src='media/example1.png'></img>",
        'One possible solution starts as follows:<br/><br/>'+
        "<img width='80%' height='auto' src='media/example2.png'></img>",
        'This move forces white to defend <b>the imminent 4-in-a-row</b>:<br/><br/>'+
        "<img width='80%' height='auto' src='media/example3.png'></img>",
        'This can then be repeated:<br/><br/>'+
        "<img width='80%' height='auto' src='media/example4.png'></img>",
        "Where again white's move is <b>forced</b>:<br/><br/>"+
        "<img width='80%' height='auto' src='media/example5.png'></img>",
        "And now we're in a position to make the <b>final blow</b>:<br/><br/>"+
        "<img width='80%' height='auto' src='media/example6.png'></img>",
        "This move forces white to defend on <b>both sides</b>,<br/>"+
        "but only one piece can be placed:<br/><br/>"+
        "<img width='80%' height='auto' src='media/example7.png'></img>",
        "This double attack allows us to overwhelm the opponent and <b>win in 4 moves</b>:<br/><br/>"+
        "<img width='80%' height='auto' src='media/example8.png'></img>",
        "It is up to you to come up with <b>a plan</b> like this in the upcoming puzzles.<br/><br/>"+
        "Since you have <b>limited time</b> to make moves, </br>"+
        "it is best to <b>plan out what you will do at the start of the puzzle</b>.<br/><br/>",
        ],
        show_clickable_nav: true,
        view_duration: 2000,
        allow_keys: false,
        button_label_next: "Next"
    }

    function ready_check_puzzle(length){
        return ynode(
            `<h1>Are you ready to start the next puzzle?</h1><br/><br/>`
            //+`<h2>The potential earnings for the next puzzle are $${length == 2 ? 0.25 : length == 3 ? 1.00 : 2.00}</h2>`
        )
    }

    var password_page = check_password(
        [
            {
                text: "Enter the password to continue",
                answer: "malab"
            },
        ]
    )

    // var ready_check_free_play = ynode(`
    //     <h1>Are you ready to start the next game?</h1>
    // `);

    var submit_block = {
        type: jsPsychHtmlKeyboardResponse,//You collected a total of ${get_points()} points and will receive a <b>$${Math.round(100 * get_points()/(9000/14))/100}</b> bonus.
        stimulus: function(){//submissions/complete?cc=CYRJV1WH
            return `<div> 
                        <p>
                        You are done!<br/>
                        You earn a bonus of $${bonus.toFixed(2)}!<br/>
                        Thank you for participating in our study!
                        <p/>
                    </div>`
        },
        stimuli: [" "],
        choices: ['none'],
        on_load: function() {
            console.log(bonus)
            save_last_timestamp_data();
            uploadData(1,"all_puzzles",-1,puzzles_results);
            uploadcsv(1,"all_freeplay",-1,freeplay_results);
            //jsPsych.data.displayData();
        }
    }
    // Preset order
    //let order = [17, 23, 1, 27, 4, 33, 36, 26, 6, 12, 5, 13, 29, 38, 30, 19, 22, 11, 20, 15, 9, 3, 21, 37, 7, 24, 18, 28, 10, 31, 16, 8, 32, 40, 25, 35, 2, 14, 39, 34];
    // win in 6: 41, 42


    // -------------------------------------------------- MAIN ---------------------------------------------------------


    const practicetrial = shuffle([16, 22]);
    //const officialtrial = shuffle([2,3,12,13,27,26,31,32,41,42]);
    //let order = practicetrial.concat(officialtrial);

    let order = [1,2,1,2,3,4,5,6,7,8,9,10];
    
    // Add trials to timeline 
    timeline.push(preload);
    timeline.push(set_participant_id);
    timeline.push(enter_fullscreen);
    // timeline.push(consent_form);
    // timeline.push(demographic_survey);
    // timeline.push(ynode(`
    //     <p>
    //         Welcome to our study! We will go through the instructions first.
    //         <br/><br/>
    //     </p>
    // `))
    // timeline.push(free_play_comprehension);
    // timeline.push(ynode(`
    //     <p>
    //         You will now play two practice games to see how it works.
    //         <br/><br/>
    //     </p>
    // `))
    // timeline.push(ynode(`
    //     <p>
    //         Practice game 1
    //         <br/><br/>
    //     </p>
    // `))
    // timeline.push({
    //     type: jsPsychFourInARowFreePlay,
    //     game_index: 1,
    //     tutorial: true,
    //     get_level: () => 0,
    //     on_load: () => {free_play_tutorial_try += 1},
    //     on_finish: save_freeplay_practice,
    //     player: 1
    // })
    // timeline.push(ynode(`
    //     <p>
    //         Practice game 2
    //         <br/><br/>
    //     </p>
    // `))
    // timeline.push({
    //     type: jsPsychFourInARowFreePlay,
    //     game_index: 2,
    //     tutorial: true,
    //     get_level: () => 0,
    //     on_finish: save_freeplay_practice,
    //     player: 0
    // })
    // timeline.push(after_practice_free_play);
    // let color = 0;
    // for(let i=0; i<40; i++){
    //     timeline.push(ready_check_free_play((i + 1).toString()))
    //     color = (color+1) % 2;
    //     timeline.push({
    //         type: jsPsychFourInARowFreePlay,
    //         game_index: i+1,
    //         get_level: get_level,
    //         on_finish: () => {save_free_play_data(i)},
    //         player: color,
    //         free_play: true,
    //     })
    // }
    // timeline.push(ynode(`
    //     <p>
    //         You finished the first stage! Please inform the experimenter.<br/>
    //         <br/><br/>
    //     </p>
    // `))
    // timeline.push(password_page);
    // timeline.push(free_conversation_instruction);
    // timeline.push(free_conversation_record);
    // timeline.push(ynode(`
    //     <p>
    //         Good job!
    //         <br/><br/>
    //     </p>
    // `))
    // timeline.push(planning_comprehension);
    // timeline.push(ynode(`
    //     <p>
    //         Let's do 2 practice puzzles!
    //         <br/><br/>
    //     </p>
    // `))
    // timeline.push(ynode(`
    //     <p>
    //         Practice puzzle 1
    //         <br/><br/>
    //     </p>
    // `))
    // timeline.push(
    //     {
    //         type: jsPsychFourInARow,
    //         pieces: get_puzzle_board(order[0]),
    //         free_play: false,
    //         initial_delay: 0,//10000 + Math.round(20000*Math.random()),
    //         tree: get_puzzle_tree(order[0]),
    //         get_level: () =>{0},
    //         game_index: 1,
    //         length: Math.floor((order[0]-1)/10) + 2,
    //         puzzle: order[0],
    //         time_per_move: 5000,
    //         tutorial: true,
    //         // on_finish: save_puzzle_data
    //     }
    // )
    // timeline.push(ynode(`
    //     <p>
    //         Practice puzzle 2
    //         <br/><br/>
    //     </p>
    // `))
    // timeline.push(
    //     {
    //         type: jsPsychFourInARow,
    //         pieces: get_puzzle_board(order[1]),
    //         free_play: false,
    //         initial_delay: 0,//10000 + Math.round(20000*Math.random()),
    //         tree: get_puzzle_tree(order[1]),
    //         get_level: () =>{0},
    //         game_index: 1,
    //         length: Math.floor((order[1]-1)/10) + 2,
    //         puzzle: order[1],
    //         time_per_move: 5000,
    //         tutorial: true,
    //         // on_finish: save_puzzle_data
    //     }
    // )
    timeline.push(after_practice);
    let N = 12;
    for(let i=2; i<N; i++){
        timeline.push(ready_check_planning((i - 1).toString()))
        timeline.push({
            type: jsPsychFourInARow,
            pieces: get_puzzle_board(order[i]),
            free_play: false,
            initial_delay: 0,//10000 + Math.round(20000*Math.random()),
            tree: get_puzzle_tree(order[i]),
            get_level: () =>{0},
            game_index: i+1,
            length: Math.floor((order[i]-1)/10) + 2,
            puzzle: order[i],
            time_per_move: 5000,
            on_load: ()=>{recorder.start();},
            on_finish: save_puzzle_data
        })
    }
    timeline.push(submit_block);
}
