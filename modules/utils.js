
/**
 * Given a string formatted in HTML, creates a timeline node
 * for jsPsych that requires a 'Y' button press to continue
 * 
 * @param {String} html an input formatted in HTML
 * @return {object} a jsPsychHtmlKeyboardResponse node
 */
export function ynode(html){
  return {
    type: jsPsychFullscreen,
    message: html,
    fullscreen_mode: true,
    button_label: "Next",
    delay_after: 150
  }
}

// export function ynode(html){
//   return {
//     type: jsPsychHtmlKeyboardResponse,
//     stimulus: `
//     <div class="layout">
//     ${html}
//     </div>`
//     ,
//     choices: ["y"]
//   }
// }

export function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}



var accumulator = true

function question(text, options){
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: `
        <div class="layout comprehension">
            <p align="center">${text}</p>
        </div>
        `,
        choices: options, 
        data:{
            task: 'comprehension',
        },
        button_html: `<div><button class="jspsych-btn">%choice%</button></div>`
    }
}
  
function response(options, correct, description){
    return {
        // type: jsPsychHtmlKeyboardResponse,
        type: jsPsychInstructions,
        pages: [function(){
            var last_trial = jsPsych.data.getLastTrialData().trials
            var is_correct = last_trial[0].response == correct
            var is_correct_text = `<h2>That was incorrect.</h2><br/>`
        
            if (accumulator){
                accumulator = accumulator && is_correct            
            }

            if (is_correct){
                is_correct_text = `
                <h2>That was correct!</h2><br/>
                <p>${description}
                </p>
                `
            }

            return `<div class="layout comprehension">
            ${is_correct_text}
            <br/><br/>
            </div>`
        }],
        show_clickable_nav: true,
        allow_backward: false,
        button_label_next: "Next"
    }
}

function intro(){
    return {
        // type: jsPsychHtmlKeyboardResponse,
        type: jsPsychInstructions,
        pages: [function(){
            //reset the accumulator
            accumulator = true

            return `<div class="layout comprehension">
            <h2>Comprehension Check</h2>
            <p>Please answer the following multiple-choice questions. <br/><br/></p>
            </div>`
        }],
        show_clickable_nav: true,
        allow_backward: false,
        button_label_next: "Next"
    }
}

function outro(){
    return {
        // type: jsPsychHtmlKeyboardResponse,
        type: jsPsychInstructions,
        pages: [function(){

            if (accumulator){
                return `<div class="layout comprehension">
                <h2>Wonderful! You have passed the comprehension check.</h2>
                </div>`
            }
            else{
                return `<div class="layout comprehension">
                <h2>You failed to pass the comprehension check.</h2>
                <p>Please read through the instructions again. </p>
                </div>`
            }
        }],
        show_clickable_nav: true,
        allow_backward: false,
        button_label_next: "Next"
    }
}
  
export function comprehension_check(timeline, text, options, correct){
    timeline.push(question(text, options, correct))
    timeline.push(response(options, correct))
}
  
export function comprehension_set(instruction, set){
    var nodes = []
    nodes.push(instruction)

    nodes.push(intro())

    set.map(s =>{
        nodes.push(question(s.text, s.options, s.answer))
        nodes.push(response(s.options, s.answer, s.desc))
    })

    nodes.push(outro())

    return {
        timeline: nodes,
        loop_function: function(){
        if(accumulator){
            return false;
        } else {
            return true;
        }
        }
    }
}


var flag = true;
function password_input(text){
    return {
        type: jsPsychSurvey,
        pages:[
            [
                {
                    type: 'text',
                    prompt: text,
                    input_type: 'text'
                }
            ]
        ],
        on_load: () => {flag = true}
    }
}

function passward_answer(correct){
    return {
        // type: jsPsychHtmlKeyboardResponse,
        type: jsPsychInstructions,
        pages: [function(){
            var last_trial = jsPsych.data.getLastTrialData().trials
            var is_correct = last_trial[0].response.P0_Q0 == correct
            var is_correct_text = `<h2>Wrong Password!</h2><br/>`

            if (is_correct){
                is_correct_text = `
                <h2>Passward correct!</h2><br/>
                `
            }

            if (flag){
                flag = flag && is_correct
            }
            console.log(flag)
            console.log(last_trial)
            console.log(last_trial[0].response)
            console.log(correct)
            console.log(last_trial[0].response == correct)


            return `<div class="layout comprehension">
            ${is_correct_text}
            <br/><br/>
            </div>`
        }],
        show_clickable_nav: true,
        allow_backward: false,
        button_label_next: "Next"
    }
}


export function check_password(set){
    var nodes = []

    set.map(s =>{
        nodes.push(password_input(s.text))
        nodes.push(passward_answer(s.answer))
    })

    return {
        timeline: nodes,
        loop_function: function(){
            if(flag){
                return false;
            } else {
                return true;
            }
        }
    }
}