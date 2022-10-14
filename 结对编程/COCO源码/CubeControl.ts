import { _decorator, Component, Node, Prefab, instantiate, CCInteger, CCBoolean, find, Event, NodeEventType, Sprite, AudioSource} from 'cc';
import { ChessBoradControl } from './ChessBoradControl';
import { ColControl } from './ColControl';
const { ccclass, property } = _decorator;
//自定义事件类
class MyEvent extends Event {
    constructor(name: string, bubbles?: boolean, detail?: any) {
        super(name, bubbles);
        this.detail = detail;
    }
    public detail: any = null;  // 自定义的属性
}

@ccclass('CubeControl')
export class CubeControl extends Component {
    //引入预制体变量
    @property(Prefab)
    numberOnePre:Prefab = null;
    @property(Prefab)
    numberTwoPre:Prefab = null;
    @property(Prefab)
    numberThreePre:Prefab = null;
    @property(Prefab)
    numberFourPre:Prefab = null;
    @property(Prefab)
    numberFivePre:Prefab = null;
    @property(Prefab)
    numberSixPre:Prefab = null;
    @property(CCInteger)
    numberToIns = 0;
    @property(CCBoolean)
    haveNumberAlready = false
    @property(CCInteger)
    thisCubeNumber = 0; 
    @property(CCBoolean)
    touchEnd = false;

    myParent:Node = null;
    myParentScript:Component = null; 
    AudioCompment:Component = null;

    start() {
     this.AudioCompment = this.node.getComponent(AudioSource);   
    }
    initial() {
        //获取父节点
        this.myParent = this.node.getParent();
        this.myParentScript = this.myParent.getComponent(ChessBoradControl);
        this.node.on(Node.EventType.TOUCH_END, function(event){
            event.propagationStopped = false;

            let ani = this.node.getComponent('cc.Animation');
            if(ani)
                ani.play("Click");

            if(this.myParentScript.isMyTurn == false)
            {
                event.propagationStopped = true;
                console.log("Not your turn!");
                return;
            }
            else
            {
                if(this.haveNumberAlready == false)
                {
                    let numberToPrint = null;

                    //判断需要生成哪个数字
                    if(this.numberToIns>=1 && this.numberToIns<=6)
                    {
                        if(this.numberToIns == 1)
                        {
                            numberToPrint = instantiate(this.numberOnePre);
                            numberToPrint.setParent(this.node);
                        }
                        else if(this.numberToIns == 2)
                        {
                            numberToPrint = instantiate(this.numberTwoPre);
                            numberToPrint.setParent(this.node);
                        }
                        else if(this.numberToIns == 3)
                        {
                            numberToPrint = instantiate(this.numberThreePre);
                            numberToPrint.setParent(this.node);
                        }
                        else if(this.numberToIns == 4)
                        {
                            numberToPrint = instantiate(this.numberFourPre);
                            numberToPrint.setParent(this.node);
                        }
                        else if(this.numberToIns == 5)
                        {
                            numberToPrint = instantiate(this.numberFivePre);
                            numberToPrint.setParent(this.node);
                        }
                        else if(this.numberToIns == 6)
                        {
                            numberToPrint = instantiate(this.numberSixPre);
                            numberToPrint.setParent(this.node);
                        }
                        //设置生成数字的位置
                        numberToPrint.setPosition(0, 0);
                        this.thisCubeNumber = this.numberToIns;
                        this.haveNumberAlready = true;
                        this.AudioCompment.play();
                        //告诉父节点放置数字所在的列,将信息送给父节点进行检测是否有重复数字
                        if(this.node.name == "myCubeOne" || this.node.name == "myCubeTwo" || this.node.name == "myCubeThree")
                        {
                            this.myParentScript.colToCheck = 1;
                            this.myParentScript.numberToCheck = this.thisCubeNumber;
                        }
                        else if(this.node.name == "myCubeFour" || this.node.name == "myCubeFive" || this.node.name == "myCubeSix")
                        {
                            this.myParentScript.colToCheck = 2;
                            this.myParentScript.numberToCheck = this.thisCubeNumber;
                        }
                        else
                        {
                            this.myParentScript.colToCheck = 3;
                            this.myParentScript.numberToCheck = this.thisCubeNumber;
                        }
                        //告诉父节点已生成数字且放置完成
                        this.node.dispatchEvent(new MyEvent('fullCheck', true));
                        this.node.dispatchEvent(new MyEvent('roundChange', true));
                        if(this.myParent.name == "myChessBorad")
                        {
                            this.node.dispatchEvent(new MyEvent('myNumberCreat', true));
                            this.node.dispatchEvent(new MyEvent('writeNumber', true));
                            this.node.dispatchEvent(new MyEvent('showOpNum', true));
                            this.node.dispatchEvent(new MyEvent('changeBorad',true));
                            if(this.myParentScript.opChessBoradIsAi)
                                this.node.dispatchEvent(new MyEvent('AI',true));
                        }
                        else
                        {
                            this.node.dispatchEvent(new MyEvent('opNumberCreat', true));
                            this.node.dispatchEvent(new MyEvent('writeNumber', true));
                            this.node.dispatchEvent(new MyEvent('showMyNum', true));
                            this.node.dispatchEvent(new MyEvent('changeBorad',true));
                        }
                    }
                    else
                    {
                        console.log("Wrong Input for numberToIns!");
                    }         
                }
                else
                {
                    event.propagationStopped = true;
                    console.log("Already have number!");
                }
            }
        }, this);
    }

    update(deltaTime: number) {

    }
    onDestroy(){

    }
    onDisable(){
        this.node.off(Node.EventType.TOUCH_START);
        this.node.off(Node.EventType.TOUCH_END);
    }
    clean() {
        this.node.destroyAllChildren();
        this.onDisable();
    }
}

