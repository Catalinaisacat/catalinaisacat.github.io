var jsPsychInitializeMicrophone = function(e) {
    "use strict";
    function i(e, i, t, n) {
        return new (t || (t = Promise))((function(c, o) {
                function s(e) {
                    try {
                        a(n.next(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function r(e) {
                    try {
                        a(n.throw(e))
                    } catch (e) {
                        o(e)
                    }
                }
                function a(e) {
                    var i;
                    e.done ? c(e.value) : (i = e.value,
                        i instanceof t ? i : new t((function(e) {
                                e(i)
                            }
                        ))).then(s, r)
                }
                a((n = n.apply(e, i || [])).next())
            }
        ))
    }
    const t = {
        name: "initialize-microphone",
        parameters: {
            device_select_message: {
                type: e.ParameterType.HTML_STRING,
                default: "<p>Please select the microphone you would like to use.</p>"
            },
            button_label: {
                type: e.ParameterType.STRING,
                default: "Use this microphone"
            }
        }
    };
    class n {
        constructor(e) {
            this.jsPsych = e
        }
        trial(e, i) {
            this.run_trial(e, i).then((e=>{
                    this.jsPsych.finishTrial({
                        device_id: e
                    })
                }
            ))
        }
        run_trial(e, t) {
            return i(this, void 0, void 0, (function*() {
                    yield this.askForPermission(),
                        this.showMicrophoneSelection(e, t),
                        this.updateDeviceList(e),
                        navigator.mediaDevices.ondevicechange = i=>{
                            this.updateDeviceList(e)
                        }
                    ;
                    const i = yield this.waitForSelection(e)
                        , n = yield navigator.mediaDevices.getUserMedia({
                        audio: {
                            deviceId: i
                        }
                    });
                    return this.jsPsych.pluginAPI.initializeMicrophoneRecorder(n),
                        i
                }
            ))
        }
        askForPermission() {
            return i(this, void 0, void 0, (function*() {
                    return yield navigator.mediaDevices.getUserMedia({
                        audio: !0,
                        video: !1
                    })
                }
            ))
        }
        showMicrophoneSelection(e, i) {
            let t = `\n      ${i.device_select_message}\n      <select name="mic" id="which-mic" style="font-size:14px; font-family: 'Open Sans', 'Arial', sans-serif; padding: 4px;">\n      </select>\n      <p><button class="jspsych-btn" id="btn-select-mic">${i.button_label}</button></p>`;
            e.innerHTML = t
        }
        waitForSelection(e) {
            return new Promise((i=>{
                    e.querySelector("#btn-select-mic").addEventListener("click", (()=>{
                            const t = e.querySelector("#which-mic").value;
                            i(t)
                        }
                    ))
                }
            ))
        }
        updateDeviceList(e) {
            navigator.mediaDevices.enumerateDevices().then((i=>{
                    const t = i.filter((e=>"audioinput" === e.kind && "default" !== e.deviceId && "communications" !== e.deviceId)).filter(((e,i,t)=>t.findIndex((i=>i.groupId == e.groupId)) == i));
                    e.querySelector("#which-mic").innerHTML = "",
                        t.forEach((i=>{
                                let t = document.createElement("option");
                                t.value = i.deviceId,
                                    t.innerHTML = i.label,
                                    e.querySelector("#which-mic").appendChild(t)
                            }
                        ))
                }
            ))
        }
    }
    return n.info = t,
        n
}(jsPsychModule);
//# sourceMappingURL=index.browser.min.js.map
