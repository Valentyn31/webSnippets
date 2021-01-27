import * as Vue from 'vue'

const app = Vue.createApp({
    data() {
        return {
            text: 'myText'
        }
    },
    methods: {
        changeText() {
            this.text += ' ' + this.text
        }
    }
})

app.mount('#main');

