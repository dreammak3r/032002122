import { _decorator, Component, Node, AudioSource, NodeEventType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LRZMakerNameControl')
export class LRZMakerNameControl extends Component {
    myAudio:Component = null;
    ClickCount:Number = 0;
    myCameraScript:Component = null;
    myBSAuido:Component = null;
    myEggVideo:Component = null;
    start() {
        this.myAudio = this.node.getComponent(AudioSource);
        let myParent = this.node.parent;
        let myParentParent = myParent.parent;
        let camera = myParentParent.getChildByName('Camera');
        let Bs = myParentParent.getChildByName('Background_Start');
        this.myBSAuido = Bs.getComponent(AudioSource);
        this.myCameraScript = camera.getComponent('uiCameraControl');
        let egg = myParentParent.getChildByName('Background_Chicken');
        this.myEggVideo = egg.getComponent(AudioSource);
        this.node.on(NodeEventType.TOUCH_END,function(event){
            event.propagationStopped = true;
            this.myAudio.play();
            this.ClickCount =this.ClickCount + 1;
            console.log("touch count:"+this.ClickCount);
        },this)
    }

    update(deltaTime: number) {
        if(this.ClickCount == 10){
            this.ClickCount = 0;
            this.myCameraScript.onClick_To_Chicken();
            this.myBSAuido.stop();
            this.myEggVideo.play();
        }
    }
}

