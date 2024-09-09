class LightState {
    constructor(lightMachine) {
        /**
         * @type {LightMachine}
         */
        this.lightMachine = lightMachine
    }
    run() { }
}

class OffLightState extends LightState {
    run() {
        this.lightMachine.setState(this.lightMachine.weakLightState)
        console.log('weak light')
    }
}
class WeakLightState extends LightState {
    run() {
        this.lightMachine.setState(this.lightMachine.strongLightState)
        console.log('strong light')
    }
}
class StrongLightState extends LightState {
    run() {
        this.lightMachine.setState(this.lightMachine.offLightState)
        console.log('off light')
    }
}
class LightMachine {
    offLightState = new OffLightState(this)
    weakLightState = new WeakLightState(this)
    strongLightState = new StrongLightState(this)
    currentState = this.offLightState
    setState(newState) {
        this.currentState = newState
    }
    toggle() {
        this.currentState.run()
    }
}

const machine = new LightMachine()
document.querySelector('button').addEventListener('click', () => {
    machine.toggle()
})