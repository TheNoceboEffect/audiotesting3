const Tone = require('tone'); // Import Tone.js for sound synthesis
let player;
let url = 'https://thenoceboeffect.github.io/sounds/a.ogg'
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../extension-support/target-type');

class Scratch3YourExtension {

    constructor(runtime) {
        this.runtime = runtime;
        this.pitchShift = new Tone.PitchShift({ pitch: 0 }).toDestination()
        this.player = new Tone.Player().connect(pitchShift);
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
                    blockType: BlockType.COMMAND,
                    text: 'load sound from [url]',
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        url: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://thenoceboeffect.github.io/sounds/a.ogg'
                        }
                    }
                },
                {
                    opcode: 'setPitch',
                    blockType: BlockType.COMMAND,
                    text: 'set pitch rate to [RATE]',
                    filter: [TargetType.SPRITE, TargetType.STAGE],
                    arguments: {
                        RATE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1.0
                        }
                    }
                },

            ],
            menus: {},


        }
    }

    async playSound({ url }) {
        try {
            await this.player.load(url); // Wait for the player to load the URL
            await Tone.loaded(); // Wait for Tone.js to be fully loaded
            this.player.start(); // Start playback
        } catch (err) {
            console.error('Error loading or playing sound:', err);
        }
    }

    setPitch({ RATE }) {
        this.pitchShift.pitch = RATE

    }

}


module.exports = Scratch3YourExtension; // Export the extension for unsandboxed usage

