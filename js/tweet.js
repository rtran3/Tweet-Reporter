"use strict";
class Tweet {
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time);
    }
    get source() {
        if (this.text.includes("completed") || this.text.includes("posted")) {
            return "completed_event";
        }
        else if (this.text.includes(" Live ")) {
            return "live_event";
        }
        else if (this.text.includes("Achieved")) {
            return "achievement";
        }
        else {
            return "miscellaneous";
        }
    }
    get written() {
        if (this.text.includes("Check it out!")) {
            return false;
        }
        else if (this.text.includes("Distance...")) {
            return false;
        }
        else if (this.text.includes("Duration...")) {
            return false;
        }
        else if (this.text.includes("-   ")) {
            return false;
        }
        else {
            return true;
        }
    }
    get day() {
        const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return dayOfWeek[this.time.getDay()];
    }
    get writtenText() {
        if (!this.written) {
            return "";
        }
        return this.text;
    }
    get activityType() {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        var w = 0;
        var result = "";
        if (!this.written) {
            if (this.text.indexOf(" with ") != -1) {
                w = this.text.indexOf(" with ");
            }
            else if (this.text.indexOf(" - ") != -1) {
                w = this.text.indexOf(" - ");
            }
        }
        else {
            w = this.text.indexOf(" - ");
        }
        if (this.text.indexOf(" km ") != -1) {
            return this.text.substring(this.text.indexOf(" km ") + 4, w);
        }
        else if (this.text.indexOf(" mi ") != -1) {
            return this.text.substring(this.text.indexOf(" mi ") + 4, w);
        }
        else if (this.text.indexOf("km ") != -1) {
            if ((!isNaN(this.text[this.text.indexOf("km ") - 1]) || this.text[this.text.indexOf("km ") - 1] == ".") && (!isNaN(this.text[this.text.indexOf("km ") - 2]) || this.text[this.text.indexOf("km ") - 2] == ".")) {
                return this.text.substring(this.text.indexOf("km ") + 3, w);
            }
        }
        else {
            if (this.text.indexOf(" in ") != -1) {
                if (this.text.indexOf(" a ") != -1) {
                    return this.text.substring(this.text.indexOf(" a ") + 3, this.text.indexOf(" in "));
                }
                else if (this.text.indexOf(" an ") != -1) {
                    return this.text.substring(this.text.indexOf(" an ") + 4, this.text.indexOf(" in "));
                }
            }
            else if (this.text.indexOf(" with ") != -1) {
                if (this.text.indexOf(" a ") != -1) {
                    return this.text.substring(this.text.indexOf(" a ") + 3, this.text.indexOf(" with "));
                }
                else if (this.text.indexOf(" an ") != -1) {
                    return this.text.substring(this.text.indexOf(" an ") + 4, this.text.indexOf(" with "));
                }
            }
        }
        return "";
    }
    get distance() {
        if (this.source != 'completed_event') {
            return 0;
        }
        if (this.text.indexOf(" km ") != -1) {
            return Number(this.text.substring(this.text.indexOf(" a ") + 3, this.text.indexOf(" km ")) / 1.609);
        }
        else if (this.text.indexOf(" mi ") != -1) {
            return Number(this.text.substring(this.text.indexOf(" a ") + 3, this.text.indexOf(" mi ")));
        }
        else if (this.text.indexOf("km ") != -1) {
            if ((!isNaN(this.text[this.text.indexOf("km ") - 1]) || this.text[this.text.indexOf("km ") - 2] == ".") && (!isNaN(this.text[this.text.indexOf("km ") - 2]) || this.text[this.text.indexOf("km ") - 2] == ".")) {
                return Number((this.text.substring(this.text.indexOf(" a ") + 3, this.text.indexOf("km "))) / 1.609);
            }
        }
        else {
            if (this.text.indexOf(" in ") != -1) {
                if (!this.written) {
                    if (this.text.indexOf(" with ") != -1) {
                        return 0;
                    }
                    else if (this.text.indexOf(" - ") != -1) {
                        return 0;
                    }
                }
                else {
                    if (this.text.indexOf(" - ") != -1) {
                        return 0;
                    }
                }
            }
        }
        return 0;
    }
}
