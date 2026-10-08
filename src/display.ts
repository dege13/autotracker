/*
  Copyright 2020 David Whiting
  This work is licensed under a Creative Commons Attribution 4.0 International License
  https://creativecommons.org/licenses/by/4.0/
*/
const A0 = -12;

function textRepr(slot: Slot) {
    function hex(v: number) { return Math.floor(v * 255).toString(16).toUpperCase().padStart(2,'0'); }
    function noteName(v: number | "---" | "cont") {
        switch (v) {
            case "---":
                return "---";
            case "cont":
                return "&nbsp;&nbsp;&nbsp;";
            default:
                return ['A-', 'A#', 'B-', 'C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#'][(v - A0) % 12] + Math.floor((v - A0) / 12)
        }
    }
    if ("drum" in slot) {
        let string = slot.drum;
        if (slot.vel) string +=" v" + hex(slot.vel);
        return string;
    } else {
        let string = noteName(slot.note);
        if (slot.fx && slot.fx.pulseWidth) string += " w" +hex(slot.fx.pulseWidth);
        if (slot.fx && slot.fx.glide) string +=" g" + hex(slot.fx.glide);
        if (slot.vel) string += " v" + hex(slot.vel);
        return string;
    }
}

function PatternDisplay(display: HTMLElement) {
    let previousSaveString: string | undefined;

    function setPatterns(newPats: Pattern<Slot>[], saveString: string, headerExtra?: HTMLElement) {
        display.innerHTML = "<div class='header'>Pattern ID: </div>";
        const header = display.querySelector(".header") as HTMLElement;
        const saveLink = document.createElement("a");
        saveLink.href = "?" + saveString;
        saveLink.classList.add("save-string");
        Array.from(saveString).forEach((digit, index) => {
            if (previousSaveString !== undefined && digit !== previousSaveString[index]) {
                const highlightedDigit = document.createElement("span");
                highlightedDigit.classList.add("changed-digit");
                highlightedDigit.textContent = digit;
                saveLink.append(highlightedDigit);
            } else {
                saveLink.append(digit);
            }
        });
        header.append(saveLink);
        previousSaveString = saveString;
        if (headerExtra) {
            header.append(headerExtra);
        }
        const halves = document.createElement("div");
        halves.classList.add("pattern-halves");
        display.append(halves);
        const halfLength = Math.ceil((newPats[0]?.length ?? 0) / 2);
        for (const offset of [0, halfLength]) {
            const container = document.createElement("div");
            container.classList.add("columns", "pattern-half");
            halves.append(container);
            newPats.forEach((pattern, channel) => {
                const pDisplay = document.createElement("code");
                pDisplay.innerHTML =
                    "<h3>" + (channel === 4 ? "*" : "⎍") + (channel + 1) + "</h3>" +
                    pattern.slice(offset, offset + halfLength).map((slot, row) =>
                        "<div class='note' data-index='" + (offset + row) + "'>" + textRepr(slot) + "</div>"
                    ).join("");
                container.append(pDisplay);
            });
        }
    }

    const patternDisplayStyles = document.createElement("style");
    patternDisplayStyles.setAttribute("type", "text/css");
    document.body.append(patternDisplayStyles);
    const css = patternDisplayStyles.sheet as CSSStyleSheet;

    function highlightRow(index: number) {
        if (css.rules.length > 0) {
            css.deleteRule(0);
        }
        css.insertRule(`.note[data-index='${index}'] { background-color: #339933; color: white; font-weight: bold }`)
    }

    return {
        setPatterns,
        highlightRow
    };
}

export default PatternDisplay;