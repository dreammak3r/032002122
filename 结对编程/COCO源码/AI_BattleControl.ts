import { _decorator, Component, Node, random, CCInteger, Script, CCBoolean, BaseNode, director, Director, Prefab, instantiate, Label } from 'cc';
import { ChessBoradControl } from './ChessBoradControl';
import { AIChessBoradControl } from './AI_ChessBoradControl';
import { uiCameraControl } from './uiCameraControl';
const { ccclass, property } = _decorator;

@ccclass('AIBattleControl')
export class AIBattleControl extends Component {
    @property(CCInteger)
    whosTurn = 1;
    @property(Prefab)
    aPre:Prefab = null;
    @property(Prefab)
    bPre:Prefab = null;
    @property(Prefab)
    sOne:Prefab = null;
    @property(Prefab)
    sTwo:Prefab = null;
    @property(Prefab)
    sThree:Prefab = null;
    @property(Prefab)
    sFour:Prefab = null;
    @property(Prefab)
    sFive:Prefab = null;
    @property(Prefab)
    sSix:Prefab = null;
    @property(Prefab)
    aScorepre:Prefab = null;
    @property(Prefab)
    bScorepre:Prefab = null;
    @property(Prefab)
    WinWordApre:Prefab = null;
    @property(Prefab)
    WinWordBpre:Prefab = null;
    @property(Prefab)
    NotWinpre:Prefab = null;
    

    myChessBorad:Node = null;
    opChessBorad:Node = null;
    myChessBoradScript:Component = null;
    opChessBoradScript:Component = null;
    myParent:Node = null;
    myCamera:Node = null;


    start() {
        
    }
    initial() {
        //生成A玩家骰子显示
        let aPlayer = null;
        aPlayer = instantiate(this.aPre);
        aPlayer.setParent(this.node);
        aPlayer.setPosition(-117.81, -27.274);
        //生成B玩家骰子显示
        let bPlayer = null;
        bPlayer = instantiate(this.bPre);
        bPlayer.setParent(this.node);
        bPlayer.setPosition(95.047, -26.243);
        //获取父节点
        this.myParent = this.node.getParent();
        //获取相机节点
        this.myCamera = this.myParent.getChildByName('Camera');
        //获取棋盘节点
        this.myChessBorad = this.node.getChildByName("myChessBorad");
        this.opChessBorad = this.node.getChildByName("opChessBorad");
        //获取棋盘节点的脚本
        this.myChessBoradScript = this.myChessBorad.getComponent(ChessBoradControl);
        this.opChessBoradScript = this.opChessBorad.getComponent(AIChessBoradControl);

        //判断回合并发放随机数
        this.myChessBoradScript.isMyTurn = true;
        this.myChessBoradScript.numberToIns = this.getRandowNumber(1, 6);
        console.log("生成的我方随机数为："+this.myChessBoradScript.numberToIns);
        this.opChessBoradScript.isMyTurn = false;
        this.opChessBoradScript.numberToIns = this.getRandowNumber(1, 6);
        console.log("生成的对面随机数为："+this.opChessBoradScript.numberToIns);
        this.whosTurn = 0;
        //初始化显示A玩家的随机数
        this.showMyNum();
        //监听回合切换事件
        this.node.on('roundChange',function(event){
            event.propagationStopped = true;
            //检测任意棋盘是否已满
            if(this.boradFullCheck())
            {
                let aScore = this.myChessBoradScript.calScore();
                let bScore = this.opChessBoradScript.calScore();

                this.myParent = this.node.getParent();
                this.myCamera = this.myParent.getChildByName('Camera');
                if(aScore > bScore)
                {
                    //A玩家胜利
                    this.showWinBorad(aScore,bScore,1385.543,-1.662,"WinA");
                    return;
                }
                else if(aScore < bScore)
                {
                    //B玩家胜利
                    this.showWinBorad(aScore,bScore,1385.543,-1.662,"WinB");
                    return;
                }
                else
                {
                    this.showWinBorad(aScore,bScore,1385.543,-1.662,"NotWin");
                    return;
                    //平局
                }
                //结束游戏
            }
            if(this.whosTurn)
            {
                this.myChessBoradScript.isMyTurn = true;
                this.opChessBoradScript.isMyTurn = false;
                this.whosTurn = 0;
                
            }
            else if(!this.whosTurn)
            {
                this.opChessBoradScript.isMyTurn = true;
                this.myChessBoradScript.isMyTurn = false;
                this.whosTurn = 1;
                
            }
        }, this)
        //监听两棋盘数字产生事件
        this.node.on('myNumberCreat', function(event){
            event.propagationStopped = true;
            this.myChessBoradScript.numberToIns = this.getRandowNumber(1, 6);
            console.log("生成的我方随机数为："+this.myChessBoradScript.numberToIns);
        }, this)
        this.node.on('opNumberCreat', function(event){
            console.log("Create opnumber");
            event.propagationStopped = true;
            this.opChessBoradScript.numberToIns = this.getRandowNumber(1, 6);
            console.log("生成的对面随机数为："+this.opChessBoradScript.numberToIns);
        }, this)
        //监听显示数字事件
        this.node.on('showOpNum', function(event){
            event.propagationStopped = true;
            this.showOpNum();
        }, this)
        this.node.on('showMyNum', function(event){
            event.propagationStopped = true;
            this.showMyNum();
        }, this)
    }
    update(deltaTime: number) {
    }
    //生成随机数
    getRandowNumber(min:number, max:number){

        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        return randomNumber;
    }
    //检测是否任意棋盘已满
    boradFullCheck(){
        if(this.myChessBoradScript.chessBoradIsFull || this.opChessBoradScript.chessBoradIsFull)
            return true;
        else
            return false;
    }
    //展示摇到的随机数
    showMyNum(){
        let aText = this.node.getChildByName('aPlayerNum');
        let aTextChild = null;
        aText.destroyAllChildren();
        switch(this.myChessBoradScript.numberToIns)
            {
                case 1:
                    aTextChild = instantiate(this.sOne);
                    break;
                case 2:
                    aTextChild = instantiate(this.sTwo);
                    break;
                case 3:
                    aTextChild = instantiate(this.sThree);
                    break;
                case 4:
                    aTextChild = instantiate(this.sFour);
                    break;
                case 5:
                    aTextChild = instantiate(this.sFive);
                    break;
                case 6:
                    aTextChild = instantiate(this.sSix);
                    break;
                default:
                    console.log("Wrong this.opChessBoradScript.numberToIns!");
            }
        aTextChild.setParent(aText);
        console.log(aTextChild.getParent().name);
        console.log(aTextChild.name);
        aTextChild.setPosition(38.548, -1.586);
    }
    //展示摇到的随机数
    showOpNum(){
        let bText = this.node.getChildByName('bPlayerNum');
        let bTextChild = null;
        bText.destroyAllChildren();
            switch(this.opChessBoradScript.numberToIns)
            {
                case 1:
                    bTextChild = instantiate(this.sOne);
                    break;
                case 2:
                    bTextChild = instantiate(this.sTwo);
                    break;
                case 3:
                    bTextChild = instantiate(this.sThree);
                    break;
                case 4:
                    bTextChild = instantiate(this.sFour);
                    break;
                case 5:
                    bTextChild = instantiate(this.sFive);
                    break;
                case 6:
                    bTextChild = instantiate(this.sSix);
                    break;
                default:
                    console.log("Wrong this.opChessBoradScript.numberToIns!");
            }
            bTextChild.setParent(bText);
            bTextChild.setPosition(38.548, -1.586);
    }
    clean(){
        let WinWordA = null;
        let WinWordB = null;
        let NotWinWord = null;

        let aPlayerNum = this.node.getChildByName('aPlayerNum');
        let bPlayerNum = this.node.getChildByName('bPlayerNum');
        let AiOver = this.myParent.getChildByName('AiOver');
        let AScore = AiOver.getChildByName('AScore');
        let BScore = AiOver.getChildByName('BScore');
        if(AiOver.getChildByName('WinWordA'))
        {
            WinWordA = AiOver.getChildByName('WinWordA');
            WinWordA.destroy();
        }
        if(AiOver.getChildByName('WinWordB'))
        {
            WinWordB = AiOver.getChildByName('WinWordB');
            WinWordB.destroy();
        }
        if(AiOver.getChildByName('NotWinWord'))
        {
            NotWinWord = AiOver.getChildByName('NotWinWord');
            NotWinWord.destroy();
        }
        if(aPlayerNum!=null)
            aPlayerNum.destroy();
        if(bPlayerNum!=null)
            bPlayerNum.destroy();
        if(AScore!=null)
            AScore.destroy();
        if(BScore!=null)
            BScore.destroy();
        this.myChessBoradScript.clean();
        this.opChessBoradScript.clean();
        this.whosTurn = 1;
        this.onDisable();
    }
    onDisable(){
        this.node.off('roundChange');
        this.node.off('myNumberCreat');
        this.node.off('opNumberCreat');
        this.node.off('showOpNum');
        this.node.off('showMyNum');
    }
    showWinBorad(aScore,bScore,x,y,result){
        let AiOver:Node = this.myParent.getChildByName('AiOver');
        let aScoreNode = instantiate(this.aScorepre);
        let bScoreNode = instantiate(this.bScorepre);
        aScoreNode.setParent(AiOver);
        aScoreNode.setPosition(0,150.582);
        bScoreNode.setParent(AiOver);
        bScoreNode.setPosition(0,75.791);
        let aScoreLabel = aScoreNode.getComponent(Label);
        let bScoreLabel = bScoreNode.getComponent(Label);
        aScoreLabel.string = "A玩家分数:"+aScore;
        aScoreLabel.isBold = true;
        aScoreLabel.isItalic = true;
        bScoreLabel.string = "B玩家分数:"+bScore;
        bScoreLabel.isBold = true;
        bScoreLabel.isItalic = true;
        this.myCamera.setPosition(x, y);

        if(result == "WinA")
        {
            this.putWinWord(this.WinWordApre,AiOver);
        }
        else if(result == "WinB")
        {
            this.putWinWord(this.WinWordBpre,AiOver);
        }
        else
        {
            this.putWinWord(this.NotWinpre,AiOver);
        }
    }
    putWinWord(WinWordPre, pNode){
        let WinWord = instantiate(WinWordPre);
        WinWord.setParent(pNode);
        WinWord.setPosition(25,327.573);
    }
}

