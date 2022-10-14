import { _decorator, Component, Node, Widget, AudioSource, Vec3} from 'cc';
import { CubeControl } from './CubeControl';
import { AICubeControl } from './AI_CubeControl';
const { ccclass, property } = _decorator;

@ccclass('Canvas')
export class Canvas extends Component {
    battleControl:Node = null;
    battleControlScript:Component = null;
    myChessBorad:Node = null;
    myChessBoradScript:Component = null;
    opChessBorad:Node = null;
    opChessBoradScript:Component = null;
    myCube:Node[] = [];
    opCube:Node[] = [];
    myCubeScript:Component[] = [];
    opCubeScript:Component[] = [];
    Camera:Node = null;

    AIbattleControl:Node = null;
    AIbattleControlScript:Component = null;
    AImyChessBorad:Node = null;
    AImyChessBoradScript:Component = null;
    AIopChessBorad:Node = null;
    AIopChessBoradScript:Component = null;
    AImyCube:Node[] = [];
    AIopCube:Node[] = [];
    AImyCubeScript:Component[] = [];
    AIopCubeScript:Component[] = [];
    
    start() {
        this.Camera = this.node.getChildByName('Camera');
        this.battleControl = this.node.getChildByName('Background_Battle');
        this.battleControlScript = this.battleControl.getComponent('BattleControl');
        this.myChessBorad = this.battleControl.getChildByName('myChessBorad');
        this.myChessBoradScript = this.myChessBorad.getComponent('ChessBoradControl');
        this.opChessBorad = this.battleControl.getChildByName('opChessBorad');
        this.opChessBoradScript = this.opChessBorad.getComponent('ChessBoradControl');
        this.myCube = this.myChessBorad.children;
        this.opCube = this.opChessBorad.children;

        this.AIbattleControl = this.node.getChildByName('Background_Battle_AI');
        this.AIbattleControlScript = this.AIbattleControl.getComponent('AIBattleControl');
        this.AImyChessBorad = this.AIbattleControl.getChildByName('myChessBorad');
        this.AImyChessBoradScript = this.AImyChessBorad.getComponent('ChessBoradControl');
        this.AIopChessBorad = this.AIbattleControl.getChildByName('opChessBorad');
        this.AIopChessBoradScript = this.AIopChessBorad.getComponent('AIChessBoradControl');
        this.AImyCube = this.AImyChessBorad.children;
        this.AIopCube = this.AIopChessBorad.children;

        this.AudioCompment = this.node.getComponent(AudioSource);
    }

    update(deltaTime: number) {
    }

    initialDouble() {
       
        this.battleControlScript.initial();
        this.myChessBoradScript.initial();
        this.opChessBoradScript.initial();
        for(let i = 0; i < 9; i++)
        {
            this.myCubeScript[i] = this.myCube[i].getComponent(CubeControl);
            this.opCubeScript[i] = this.opCube[i].getComponent(CubeControl);
        }
        for(let i = 0; i < 9; i++)
        {
            this.myCubeScript[i].initial();
            this.opCubeScript[i].initial();
        }
    }
    initialAi() {
        this.AIbattleControlScript.initial();
        this.AImyChessBoradScript.initial();
        this.AIopChessBoradScript.initial();
        for(let i = 0; i < 9; i++)
        {
            this.AImyCubeScript[i] = this.AImyCube[i].getComponent(CubeControl);
            this.AIopCubeScript[i] = this.AIopCube[i].getComponent(AICubeControl);
        }
        for(let i = 0; i < 9; i++)
        {
            this.AImyCubeScript[i].initial();
            this.AIopCubeScript[i].initial();
        }
    }
    restartDoubleBattle(){
        this.battleControlScript.clean();
        this.initialDouble();
        this.Camera.setPosition(680, 1020);
    }
    restartAIBattle(){
        this.AIbattleControlScript.clean();
        this.initialAi();
        this.Camera.setPosition(680, 1020);
    
    }
}

