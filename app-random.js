//import Vue from 'vue'
//import Vuetify from 'vuetify'
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var app = new Vue({
    el: "#app",
    data: {
        // Audio data
        audio_list: audios,
        random_audio: audios[Math.floor(Math.random() * audios.length)],
        
        // Tag data
        tag_list: Object.keys(tags).map(function(item, idx) { return {tagname: item, count: tags[item]}}),

    },
    methods: {
        get_random_audio: function() {
            this.random_audio = audios[Math.floor(Math.random() * audios.length)];
        },
        get_pill_for_tag: function(tag) {
            if (tag.toLowerCase() == "rape") { return "mdl-chip mdl-color--red" }
            else {
                return "mdl-chip";
            }
        },
        get_icon_for_tags: function(taglist) {
            for (var i = 0; i < taglist.length; i++) {
                if (taglist[i].toLowerCase() == "singing") return "music_note";
            }
            return "person"
        },
        init: function() {
            this.random_audio = this.get_random_audio();
        }
    }
});