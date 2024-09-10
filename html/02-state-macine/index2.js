class LightMachine {
    states = {
        off: {
            run: () => {
                this.print('off')
            }
        },
        weak: {
            run: () => {
                this.print('weak')
            }
        },
        strong: {
            run: () => {
                this.print('strong')
            }
        },
    }
    currentState = this.states.off
    currentStateText = 'off'
    print(text) {
        console.log(text)
    }
    setState(newState) {
        switch (newState) {
            case 'off':
                this.currentState = this.states.weak
                this.currentStateText = 'weak'
                break
            case 'weak':
                this.currentState = this.states.strong
                this.currentStateText = 'strong'
                break
            case 'strong':
            default:
                this.currentState = this.states.off
                this.currentStateText = 'off'
                break
        }
    }
    toggle() {
        this.setState(this.currentStateText)
        this.currentState.run()
    }
}

const machine = new LightMachine()
document.querySelector('button').addEventListener('click', () => {
    machine.toggle()
})