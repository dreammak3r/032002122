import { _decorator, Component, Node, CCInteger, CCBoolean, Event, Sprite, SpriteFrame } from 'cc';
import { AIBattleControl } from './AI_BattleControl';
import { CubeControl } from './CubeControl';
const { ccclass, property } = _decorator;
//自定义事件类
class MyEvent extends Event {
    constructor(name: string, bubbles?: boolean, detail?: any) {
        super(name, bubbles);
        this.detail = detail;
    }
    public detail: any = null;  // 自定义的属性
}
@ccclass('ChessBoradControl')
export class ChessBoradControl extends Component {
    @property(CCInteger)
    numberToIns = 0;
    @property(CCBoolean)
    touchEnd = true;
    @property(CCBoolean)
    isMyTurn = false;
    @property(CCBoolean)
    chessBoradIsFull = false;
    @property(CCInteger)
    colToCheck = 0;
    @property(CCInteger)
    numberToCheck = 0;
    @property(SpriteFrame)
    YourTurn = null;
    @property(SpriteFrame)
    NotYourTurn = null;


    myParent:Node = null;
    myChildren:Node[] = [];
    opChildren:Node[] = [];
    myChildScript:Component[] = [];
    opChildScript:Component[] = [];
    opChild:Node = null;
    myChessBorad:Node = null;
    opChessBorad:Node = null;
    opChessBoradScript:Component = null;
    opChessBoradIsAi:Boolean = false;

    start() {
        this.myParent=this.node.getParent();
        if(this.myParent.name == "Background_Battle_AI")
        {
            this.opChessBoradIsAi = true;
            if(this.node.name == "myChessBorad")
            {
                this.opChessBorad = this.myParent.getChildByName('opChessBorad');
                this.opChessBoradScript = this.opChessBorad.getComponent('AIChessBoradControl');
            }
            else
                this.opChessBorad = this.myParent.getChildByName('myChessBorad');
        }
        else
        {
            if(this.node.name == "myChessBorad")
                this.opChessBorad = this.myParent.getChildByName('opChessBorad');
            else
                this.opChessBorad = this.myParent.getChildByName('myChessBorad');
        }
    }
    initial() {
        //获取子节点
        this.myChildren = this.node.children;
        this.opChildren = this.opChessBorad.children;
        //获取子节点的脚本
        for (let i = 0; i < 9; i++){
            this.myChildScript[i] = this.myChildren[i].getComponent(CubeControl);
            if(!this.opChessBoradIsAi)
                this.opChildScript[i] = this.opChildren[i].getComponent(CubeControl);
            else
                this.opChildScript[i] = this.opChildren[i].getComponent('AICubeControl');
        }
        //将要生成的数字填入cube中
        for(let i = 0; i < 9; i++){
            if(!this.myChildScript[i].haveNumberAlready)
            {
                this.myChildScript[i].numberToIns = this.numberToIns;
            }
        }
        //检测棋盘是否已满
        this.node.on('fullCheck', function(event){
            event.propagationStopped = true;
            this.chessBoradIsFull = this.boradFullCheck(this.myChildScript);
        }, this)

        //监听写数字的信号
        this.node.on('writeNumber', function(event){
            //终止冒泡传递消息
            event.propagationStopped = true;
            //检测列是否有相同数字
            if(this.node.name == "opChessBorad")
            {
                this.myParent = this.node.getParent();
                this.myChessBorad = this.myParent.getChildByName("myChessBorad");
                let myChessBoradChildren:Node[] = this.myChessBorad.children;
                let myChessBoradChildrenScript:Component[] = [];
                for (let i = 0; i < 9; i++){
                    myChessBoradChildrenScript[i] = myChessBoradChildren[i].getComponent(CubeControl);
                }
                this.boradSameCheck(this.colToCheck, myChessBoradChildren, myChessBoradChildrenScript);
            }
            else
            {
                this.myParent = this.node.getParent();
                this.opChessBorad = this.myParent.getChildByName("opChessBorad");
                let opChessBoradChildren:Node[] = this.opChessBorad.children;
                let opChessBoradChildrenScript:Component[] = [];
                if(!this.opChessBoradIsAi){
                    for (let i = 0; i < 9; i++)
                        opChessBoradChildrenScript[i] = opChessBoradChildren[i].getComponent(CubeControl);
                }
                else{
                    for (let i = 0; i < 9; i++)
                        opChessBoradChildrenScript[i] = opChessBoradChildren[i].getComponent('AICubeControl');
                }
                
                this.boradSameCheck(this.colToCheck, opChessBoradChildren, opChessBoradChildrenScript);
            }
            
            //让每个立方体将要生成的数字设为父节点所给的随机数
            for(let i = 0; i < 9; i++)
            {
                this.myChildScript[i].numberToIns = this.numberToIns;
            }
        }, this)
        this.node.on('changeBorad',function(event){
            event.propagationStopped = true;
            console.log("ChangeBorad!");
            for(let i=0;i<9;i++)
            {
                let sprit = this.myChildScript[i].getComponent(Sprite);
                sprit.spriteFrame = new SpriteFrame;
                sprit.spriteFrame = this.NotYourTurn;
            }
            for(let i=0;i<9;i++)
            {
                let sprit = this.opChildScript[i].getComponent(Sprite);
                sprit.spriteFrame = new SpriteFrame;
                sprit.spriteFrame = this.YourTurn;
            }
        }, this)
        if(this.opChessBoradIsAi)
        {
            this.node.on('AI',function(event){
                let Script = this.opChessBorad.getComponent('AIChessBoradControl');
                Script.aiDecide();
            },this)
        }
    }
    update(deltaTime: number) {
    }
    boradFullCheck(myChildScript:Component[]){
        for(let i = 0; i < 9; i++){
            if(!myChildScript[i].haveNumberAlready)
                return false;
        }
        return true;
    }
    boradSameCheck(colToCheck, myChildren, myChildScript){
        if(colToCheck == 1)
        {
            if(myChildScript[0].thisCubeNumber == this.numberToCheck){
                let myChildrenAni = myChildren[0].getComponent('cc.Animation');
                myChildrenAni.play("newDestory");
                myChildren[0].destroyAllChildren();
                myChildScript[0].thisCubeNumber = 0;
                myChildScript[0].haveNumberAlready = false;
            }
            if(myChildScript[1].thisCubeNumber == this.numberToCheck){
                let myChildrenAni = myChildren[1].getComponent('cc.Animation');
                myChildrenAni.play("newDestory");
                myChildren[1].destroyAllChildren();
                myChildScript[1].thisCubeNumber = 0;
                myChildScript[1].haveNumberAlready = false;
            }
            if(myChildScript[2].thisCubeNumber == this.numberToCheck){
                let myChildrenAni = myChildren[2].getComponent('cc.Animation');
                myChildrenAni.play("newDestory");
                myChildren[2].destroyAllChildren();
                myChildScript[2].thisCubeNumber = 0;
                myChildScript[2].haveNumberAlready = false;
            }
        }
        else if(colToCheck == 2)
        {
            if(myChildScript[3].thisCubeNumber == this.numberToCheck){
                let myChildrenAni = myChildren[3].getComponent('cc.Animation');
                myChildrenAni.play("newDestory");
                myChildren[3].destroyAllChildren();
                myChildScript[3].thisCubeNumber = 0;
                myChildScript[3].haveNumberAlready = false;
            }
            if(myChildScript[4].thisCubeNumber == this.numberToCheck){
                let myChildrenAni = myChildren[4].getComponent('cc.Animation');
                myChildrenAni.play("newDestory");
                myChildren[4].destroyAllChildren();
                myChildScript[4].thisCubeNumber = 0;
                myChildScript[4].haveNumberAlready = false;
            }
            if(myChildScript[5].thisCubeNumber == this.numberToCheck){
                let myChildrenAni = myChildren[5].getComponent('cc.Animation');
                myChildrenAni.play("newDestory");
                myChildren[5].destroyAllChildren();
                myChildScript[5].thisCubeNumber = 0;
                myChildScript[5].haveNumberAlready = false;
            }
        }
        else if(colToCheck == 3)
        {
            if(myChildScript[6].thisCubeNumber == this.numberToCheck){
                let myChildrenAni = myChildren[6].getComponent('cc.Animation');
                myChildrenAni.play("newDestory");
                myChildren[6].destroyAllChildren();
                myChildScript[6].thisCubeNumber = 0;
                myChildScript[6].haveNumberAlready = false;
            }
            if(myChildScript[7].thisCubeNumber == this.numberToCheck){
                let myChildrenAni = myChildren[7].getComponent('cc.Animation');
                myChildrenAni.play("newDestory");
                myChildren[7].destroyAllChildren();
                myChildScript[7].thisCubeNumber = 0;
                myChildScript[7].haveNumberAlready = false;
            }
            if(myChildScript[8].thisCubeNumber == this.numberToCheck){
                let myChildrenAni = myChildren[8].getComponent('cc.Animation');
                myChildrenAni.play("newDestory");
                myChildren[8].destroyAllChildren();
                myChildScript[8].thisCubeNumber = 0;
                myChildScript[8].haveNumberAlready = false;
            }
        }
        else
        {
            console.log("Wrong number for colToCheck!");
        }
    }
    calScore() {
        let i = 0;
        let sumScoreOne = 0;
        let sumScoreTwo = 0;
        let sumScoreThree = 0;
        let rowOneCount = [0,0,0,0,0,0];
        let rowTwoCount = [0,0,0,0,0,0];
        let rowThreeCount = [0,0,0,0,0,0];


        for(i = 0; i < 2; i++){
            if(this.myChildScript[i].thisCubeNumber)
                rowOneCount[this.myChildScript[i].thisCubeNumber-1]++;
        }
        for(i=0; i<2;i++){
            if(this.myChildScript[i].thisCubeNumber)
                sumScoreOne+=this.myChildScript[i].thisCubeNumber*Math.pow(rowOneCount[this.myChildScript[i].thisCubeNumber-1],2);
        }
        console.log("sumScoreOne"+sumScoreOne);

        for(i = 3; i < 5; i++){
            if(this.myChildScript[i].thisCubeNumber)
                rowTwoCount[this.myChildScript[i].thisCubeNumber-1]++;
        }
        for(i = 3; i < 5; i++){
            if(this.myChildScript[i].thisCubeNumber)
                sumScoreTwo+=this.myChildScript[i].thisCubeNumber*Math.pow(rowTwoCount[this.myChildScript[i].thisCubeNumber-1],2);
        }

        console.log("sumScoreTwo"+sumScoreTwo);
        for(i = 5; i < 8; i++){
            if(this.myChildScript[i].thisCubeNumber)
                rowThreeCount[this.myChildScript[i].thisCubeNumber-1]++;
        }
        for(i = 5; i < 8; i++){
            if(this.myChildScript[i].thisCubeNumber)
                sumScoreThree+=this.myChildScript[i].thisCubeNumber*Math.pow(rowThreeCount[this.myChildScript[i].thisCubeNumber-1],2);
        }
        console.log("sumScoreThree"+sumScoreThree);
        return sumScoreThree+sumScoreOne+sumScoreTwo;
    }
    clean() {
        for(let i = 0; i < 9; i++)
        {
            this.myChildScript[i].haveNumberAlready = false;
            this.myChildScript[i].thisCubeNumber = 0;
            this.myChildScript[i].numberToIns = 0;
            this.myChildScript[i].clean();
        }
        if(this.node.name == "myChessBorad"){
            for(let i=0;i<9;i++){
            let sprit = this.myChildScript[i].getComponent(Sprite);
            sprit.spriteFrame = new SpriteFrame;
            sprit.spriteFrame = this.YourTurn;
            }
            for(let i=0;i<9;i++){
            let sprit = this.opChildScript[i].getComponent(Sprite);
            sprit.spriteFrame = new SpriteFrame;
            sprit.spriteFrame = this.NotYourTurn;
            }
        }
        this.chessBoradIsFull = false;
        this.isMyTurn = false;
        this.numberToIns = 0;
        this.numberToCheck = 0;
        this.colToCheck = 0;
        this.onDisable();
    }
    onDisable(){
        this.node.off('fullCheck');
        this.node.off('writeNumber');
        this.node.off('AI');
        this.node.off('changeBorad');
    }
}

