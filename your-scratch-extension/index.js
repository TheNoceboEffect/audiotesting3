let url = 'https://thenoceboeffect.github.io/sounds/a.ogg'
const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
const TargetType = require('../../extension-support/target-type');
import * as Tone from 'tone'


class Scratch3YourExtension {


    constructor(runtime) {
        this.runtime = runtime;
        this.pitchShift = new Tone.PitchShift({
            pitch: 0, // Default pitch (0 semitones)
        }).toDestination();
    }

    /**
     * Returns the metadata about your extension.
     */
    getInfo() {
        console.log('Extension loaded');

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
                    text: 'play sound from [URL]',
                    arguments: {
                        URL: {
                            type: ArgumentType.STRING,
                            defaultValue: 'https://thenoceboeffect.github.io/sounds/a.ogg'
                        }
                    }
                }
                // {
                //     opcode: 'setPitch',
                //     blockType: BlockType.COMMAND,
                //     text: 'set pitch rate to [RATE]',
                //     arguments: {
                //         RATE: {
                //             type: ArgumentType.NUMBER,
                //             defaultValue: 1.0
                //         }
                //     }
                // },
                // {
                //     opcode: 'stopSound',
                //     blockType: BlockType.COMMAND,
                //     text: 'stop sound',
                // }

            ],
            menus: {},


        }
    }

    async playSound({ URL }) {
        console.log(`Playing sound from URL: ${URL}`);

        try {
            await Tone.loaded(); // Ensure Tone.js is ready
            const player = new Tone.Player({
                url: URL,
                loop: true, // Enable looping
            }).connect(this.pitchShift); // Connect the player to pitchShift
    
            player.start(); // Start playback
            player.onstop = () => {
                player.dispose(); // Clean up resources after playback
            };
        } catch (err) {
            console.error('Error loading or playing sound:', err);
        }
    }
    

    setPitch({ RATE }) {
        this.pitchShift.pitch = RATE

    }

    stopSound() {
        if (this.player && this.player.state === 'started') {
            this.player.stop(); // Stop playback
        }
    }

}


module.exports = Scratch3YourExtension; // Export the extension for unsandboxed usage

