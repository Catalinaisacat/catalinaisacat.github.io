var jsPsychHtmlAudioResponse = function(t) {
    "use strict";
    const e = {
        name: "html-audio-response",
        parameters: {
            stimulus: {
                type: t.ParameterType.HTML_STRING,
                default: void 0
            },
            stimulus_duration: {
                type: t.ParameterType.INT,
                default: null
            },
            recording_duration: {
                type: t.ParameterType.INT,
                default: 2e3
            },
            show_done_button: {
                type: t.ParameterType.BOOL,
                default: !0
            },
            done_button_label: {
                type: t.ParameterType.STRING,
                default: "Continue"
            },
            record_again_button_label: {
                type: t.ParameterType.STRING,
                default: "Record again"
            },
            accept_button_label: {
                type: t.ParameterType.STRING,
                default: "Continue"
            },
            allow_playback: {
                type: t.ParameterType.BOOL,
                default: !1
            },
            save_audio_url: {
                type: t.ParameterType.BOOL,
                default: !1
            }
        }
    };
    class s {
        constructor(t) {
            this.jsPsych = t,
                this.rt = null,
                this.recorded_data_chunks = []
        }
        trial(t, e) {
            this.recorder = this.jsPsych.pluginAPI.getMicrophoneRecorder(),
                this.setupRecordingEvents(t, e),
                this.startRecording()
        }
        showDisplay(t, e) {
            new ResizeObserver(((e,s)=>{
                    this.stimulus_start_time = performance.now(),
                        s.unobserve(t)
                }
            )).observe(t);
            let s = `<div id="jspsych-html-audio-response-stimulus">${e.stimulus}</div>`;
            e.show_done_button && (s += `<p><button class="jspsych-btn" id="finish-trial">${e.done_button_label}</button></p>`),
                t.innerHTML = s
        }
        hideStimulus(t) {
            const e = t.querySelector("#jspsych-html-audio-response-stimulus");
            e && (e.style.visibility = "hidden")
        }
        addButtonEvent(t, e) {
            const s = t.querySelector("#finish-trial");
            s && s.addEventListener("click", (()=>{
                    const s = performance.now();
                    this.rt = Math.round(s - this.stimulus_start_time),
                        this.stopRecording().then((()=>{
                                e.allow_playback ? this.showPlaybackControls(t, e) : this.endTrial(t, e)
                            }
                        ))
                }
            ))
        }
        setupRecordingEvents(t, e) {
            this.data_available_handler = t=>{
                t.data.size > 0 && this.recorded_data_chunks.push(t.data)
            }
                ,
                this.stop_event_handler = ()=>{
                    const t = new Blob(this.recorded_data_chunks,{
                        type: "audio/webm"
                    });
                    this.audio_url = URL.createObjectURL(t);
                    const e = new FileReader;
                    e.addEventListener("load", (()=>{
                            const t = e.result.split(",")[1];
                            this.response = t,
                                this.load_resolver()
                        }
                    )),
                        e.readAsDataURL(t)
                }
                ,
                this.start_event_handler = s=>{
                    this.recorded_data_chunks.length = 0,
                        this.recorder_start_time = s.timeStamp,
                        this.showDisplay(t, e),
                        this.addButtonEvent(t, e),
                    null !== e.stimulus_duration && this.jsPsych.pluginAPI.setTimeout((()=>{
                            this.hideStimulus(t)
                        }
                    ), e.stimulus_duration),
                    null !== e.recording_duration && this.jsPsych.pluginAPI.setTimeout((()=>{
                            "inactive" !== this.recorder.state && this.stopRecording().then((()=>{
                                    e.allow_playback ? this.showPlaybackControls(t, e) : this.endTrial(t, e)
                                }
                            ))
                        }
                    ), e.recording_duration)
                }
                ,
                this.recorder.addEventListener("dataavailable", this.data_available_handler),
                this.recorder.addEventListener("stop", this.stop_event_handler),
                this.recorder.addEventListener("start", this.start_event_handler)
        }
        startRecording() {
            this.recorder.start()
        }
        stopRecording() {
            return this.recorder.stop(),
                new Promise((t=>{
                        this.load_resolver = t
                    }
                ))
        }
        showPlaybackControls(t, e) {
            t.innerHTML = `\n      <p><audio id="playback" src="${this.audio_url}" controls></audio></p>\n      <button id="record-again" class="jspsych-btn">${e.record_again_button_label}</button>\n      <button id="continue" class="jspsych-btn">${e.accept_button_label}</button>\n    `,
                t.querySelector("#record-again").addEventListener("click", (()=>{
                        URL.revokeObjectURL(this.audio_url),
                            this.startRecording()
                    }
                )),
                t.querySelector("#continue").addEventListener("click", (()=>{
                        this.endTrial(t, e)
                    }
                ))
        }
        endTrial(t, e) {
            this.recorder.removeEventListener("dataavailable", this.data_available_handler),
                this.recorder.removeEventListener("start", this.start_event_handler),
                this.recorder.removeEventListener("stop", this.stop_event_handler),
                this.jsPsych.pluginAPI.clearAllTimeouts();
            var s = {
                rt: this.rt,
                stimulus: e.stimulus,
                response: this.response,
                estimated_stimulus_onset: Math.round(this.stimulus_start_time - this.recorder_start_time)
            };
            e.save_audio_url ? s.audio_url = this.audio_url : URL.revokeObjectURL(this.audio_url),
                t.innerHTML = "",
                this.jsPsych.finishTrial(s)
        }
    }
    return s.info = e,
        s
}(jsPsychModule);
//# sourceMappingURL=index.browser.min.js.map
