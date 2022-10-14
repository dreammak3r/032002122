import { _decorator, Component, Node, find, Vec3, Camera, CCFloat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('uiCameraControl')
export class Button_Start extends Component {
    @property(Vec3)
    firstPosition = null;
    @property(Vec3)
    nowPosition = null;
    @property(Vec3)
    nextPositon = null;
    @property(CCFloat)
    moveSpeed = 5;

    start() {
        this.firstPosition = this.node.position;
        this.nextPositon = new Vec3(680,0,1000);
    }

    onClick_Start(){
        this.node.setPosition(680, 0, 1000);
    }
    onClick_Maker(){
        this.node.setPosition(0, -1000, 1000);
    }
    onClick_Battle_Back(){
        this.node.setPosition(680, 0, 1000);
    }
    onClick_Ai_In(){
        this.node.setPosition(0, 1020, 1000);
    }
    onClick_Ai_Back_to_select(){
        this.node.setPosition(680, 0, 1000);
    }
    onClick_Double(){
        this.node.setPosition(680, 1020, 1000);
    }
    onClick_Back_To_Start(){
        this.node.setPosition(0, 0, 1000);
    }
    onClick_Ai_Battle(){
        this.node.setPosition(2115.77, 0, 1000);
    }
    onClick_Rule_One(){
        this.node.setPosition(678.264, -1000, 1000);
    }
    onClick_Rule_Two(){
        this.node.setPosition(1386.719, -1000, 1000);
    }
    onClick_To_Egg(){
        this.node.setPosition(-699.384, -1000, 1000);
    }
    onClick_To_Chicken(){
        this.node.setPosition(-699.384, -2.518, 1000);
    }
    update(deltaTime: number) {
    }
}

