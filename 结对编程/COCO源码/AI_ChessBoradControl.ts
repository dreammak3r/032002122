import { _decorator, Component, Node, CCInteger, CCBoolean, Event,SpriteFrame,Sprite } from 'cc';
import { CubeControl } from './CubeControl';
import { AICubeControl } from './AI_CubeControl';
const { ccclass, property } = _decorator;
//自定义事件类
class MyEvent extends Event {
    constructor(name: string, bubbles?: boolean, detail?: any) {
        super(name, bubbles);
        this.detail = detail;
    }
    public detail: any = null;  // 自定义的属性
}
@ccclass('AIChessBoradControl')
export class AIChessBoradControl extends Component {
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
    @property(CCBoolean)
    AI = true;
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
    myChessBoradForAiColOne:Number[] = [];
    myChessBoradForAiColTwo:Number[] = [];
    myChessBoradForAiColThree:Number[] = [];
    opChessBoradForAiColOne:Number[] = [];
    opChessBoradForAiColTwo:Number[] = [];
    opChessBoradForAiColThree:Number[] = [];

    start() {
        this.myParent=this.node.getParent();
        if(this.myParent.name == "Background_Battle_AI")
        {
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
            this.myChildScript[i] = this.myChildren[i].getComponent(AICubeControl);
            this.opChildScript[i] = this.opChildren[i].getComponent(CubeControl);
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
            console.log("Write number");
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
                for (let i = 0; i < 9; i++){
                    opChessBoradChildrenScript[i] = opChessBoradChildren[i].getComponent(AICubeControl);
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
        //监听AI指令
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

        // for(let i = 0; i < 9; i++)
        // {
        //     sumScore = sumScore + this.myChildScript[i].thisCubeNumber;
        // }
        for(i = 0; i < 2; i++){
            rowOneCount[this.myChildScript[i].thisCubeNumber]++;
        }
        for(i=0;i<5;i++){
            if(rowOneCount[i]){
                sumScoreOne+=i*Math.pow(rowOneCount[i],2);
            }
        }


        for(i = 3; i < 5; i++){
            rowTwoCount[this.myChildScript[i].thisCubeNumber]++;
        }
        for(i=0;i<5;i++){
            if(rowTwoCount[i]){
                sumScoreTwo+=i*Math.pow(rowTwoCount[i],2);
            }
        }


        for(i = 5; i < 8; i++){
            rowThreeCount[this.myChildScript[i].thisCubeNumber]++;
        }
        for(i=0;i<5;i++){
            if(rowThreeCount[i]){
                sumScoreThree+=i*Math.pow(rowThreeCount[i],2);
            }
        }
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
    }
    aiDecide() {
        let mat1:Number[] = [];//玩家
        let mat2:Number[] = [];//AI
        for(let i=0;i<9;i++)
        {
            mat1[i] = this.opChildScript[i].thisCubeNumber;
            mat2[i] = this.myChildScript[i].thisCubeNumber;
        }
        let val = this.numberToIns;
        let chessDown = this.f(mat1, mat2, val);
        console.log("AI: " + chessDown);
        this.myChildScript[chessDown].createNumber();
    }
    f(mat1, mat2, val) {
        //mat1 是真人的
        //mat2 是机器人
        //val 随机的值
        let ans = -1000
        let index = 0
        for (let i = 0; i < 9; i++) {
            if (mat2[i] === 0) {
                mat2[i] = val
                let temp = this.aidfs(this.deepcopy(mat1), this.deepcopy(mat2), val, i)
                if (temp > ans) {
                    ans = temp
                    index = i
                }
                mat2[i] = 0
            }
        }
        return index
    }
    
    deepcopy(mat) {
        let ans = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < 9; i++) {
            ans[i] = mat[i]
        }
        return ans;
    }
    
    aidfs(mat1, mat2, val, i) {
        let y = i % 3;
        let cur = mat2[i];
        for (let j = y, k = 0; k < 3; j = j + 3, k++) {
            if (cur === mat1[j]) {
                mat1[j] = 0;
            }
        }
        return this.getsroce(mat2) - this.getsroce(mat1);
    }
    
    getsroce(mat) {
        let ans = 0;
        for (let i = 0; i < 3; i++) {
            let p1 = mat[i], p2 = mat[i + 3], p3 = mat[i + 6];
            if (p1 === p2 && p2 === p3) {
                ans = ans + p1 * 9;
            } else if (p1 !== p2 && p2 !== p3 && p3 !== p1) {
                ans = ans + p1 + p2 + p3;
            } else {
                if (p1 === p2 && p2 !== p3) {
                    ans = ans + p1 * 4 + p3;
                } else if (p1 === p3 && p3 !== p2) {
                    ans = ans + p1 * 4 + p2;
                } else if (p2 === p3 && p1 !== p2) {
                    ans = ans + p2 * 4 + p1;
                }
            }
        }
        return ans;
    }
}

