const Tone = require('tone'); // Import Tone.js for sound synthesis
let player;
let url = 'https://thenoceboeffect.github.io/sounds/a.ogg'
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../extension-support/target-type');

class Scratch3YourExtension {

    constructor(runtime) {
        this.runtime = runtime;
        this.player = new Tone.Player().toDestination();
    }

    //Define Helper Methods
    playSound({ url }) {
        this.player.load(url).then(() => {
            this.player.start();
        }).catch(error => {
            console.error('Error loading sound:', error);
        });
    }

    /**
     * Returns the metadata about your extension.
     */
    getInfo() {
        return {
            // unique ID for your extension
            id: 'yourScratchExtension',

            // name that will be displayed in the Scratch UI
            name: 'ScratchSpeech',

            // colours to use for your extension blocks
            color1: '#000099',
            color2: '#660066',

            // icons to display
            blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',
            menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAAAAACyOJm3AAAAFklEQVQYV2P4DwMMEMgAI/+DEUIMBgAEWB7i7uidhAAAAABJRU5ErkJggg==',

            // your Scratch blocks
            blocks: [
                {
                    opcode: 'playSound',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'load sound from [url]',
                    arguments: {
                        url: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://thenoceboeffect.github.io/sounds/a.ogg'
                        }
                    }
                },
                {
                    opcode: 'setPitch',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set pitch rate to [RATE]',
                    arguments: {
                        RATE: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 1.0
                        }
                    }
                }
            ],
            menus: {},

            playSound({ URL }) {
                loadSound(URL);
            },
            setPitch({ RATE }) {
                setPitch(RATE);
            },
        }
    }
}

setPitch({ rate });
if (player) {
    player.playbackRate = rate; // Example: 1.0 is normal, 2.0 doubles pitch, 0.5 halves it
}

module.exports = Scratch3YourExtension; // Export the extension for unsandboxed usage

