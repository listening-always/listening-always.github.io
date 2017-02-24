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
        filtered_audio_list: audios,
        // Tag data
        tag_list: Object.keys(tags).map(function(item, idx) { 
            return {tagname: item, count: tags[item]}
        }).sort(function(a, b) {
            if(a.tagname < b.tagname) return -1;
            if(a.tagname > b.tagname) return 1;
            return 0;
        }),
        filtered_tags: [],
        shown_tags: Object.keys(tags).map(function(item, idx) { 
            return {tagname: item, count: tags[item]}
        }).sort(function(a, b) {
            if(a.tagname < b.tagname) return -1;
            if(a.tagname > b.tagname) return 1;
            return 0;
        }),
        // Display info
        show_taglist: false,
        // Model
        search_terms: ""
    },
    methods: {
        get_random_audio: function() {
            return audios[Math.random() * audios.length + 1];
        },
        get_pill_for_tag: function(tag) {
            if (tag.toLowerCase() == "rape") { return "mdl-chip mdl-color--red" }
            else {
                return this.filtered_tags.indexOf(tag) !== -1 ? "mdl-chip mdl-color--light-blue" : "mdl-chip";
            }
        },
        get_icon_for_tags: function(taglist) {
            for (var i = 0; i < taglist.length; i++) {
                if (taglist[i].toLowerCase() == "singing") return "music_note";
            }
            return "person"
        },
        get_tag_list_class: function() {
            return this.show_taglist ? "taglist-visible" : "taglist-hidden";
        },
        toggle_tag_list: function() {
            this.show_taglist = !this.show_taglist;
        },
        toggle_tag_filter: function(tagname) {
            if (this.filtered_tags.indexOf(tagname) === -1) {
                this.filtered_tags.push(tagname);
            }
            else {
                this.filtered_tags.splice(this.filtered_tags.indexOf(tagname), 1);
            }
            if (this.filtered_tags.length === 0) {
                this.filtered_audio_list = this.audio_list;
            }
            else {
                this.filtered_tags.forEach(function(item) {
                    this.filtered_audio_list = this.filtered_audio_list.filter(function(audio) {
                        return audio.tags.indexOf(item) !== -1;
                    });
                }.bind(this));
            }
        },
        filter_tags: function() {
            // Using vue's data binding makes the whole thing excruciatingly slow for some reason.
            this.search_terms = document.getElementById("tag-search").value.toLowerCase();
            
            if (this.search_terms.trim() == "") {
                this.shown_tags = this.tag_list; 
                return; 
            }
            this.show_taglist = true;
            var self = this;
            self.shown_tags = self.tag_list.filter(function(tag) {
                return tag.tagname.toLowerCase().indexOf(self.search_terms) !== -1;
            });
        }
    }
});