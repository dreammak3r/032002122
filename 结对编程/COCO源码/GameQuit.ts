import { _decorator, Component, Node, Game, Director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameQuit')
export class GameQuit extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }
    GameEnd(){
       let directot = new Game();
       directot.end();
    }
}

