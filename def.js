dressPath="./KeyDress.txt";
if(files.exists(dressPath)){eval(files.read(dressPath))}
xx=[];yy=[];
for(var i=0;i<21;i++){xx.push(xy[(2*i)]);yy.push(xy[2*i+1])}

note=['1--','2--','3--','4--','5--','6--','7--',
     '1-','2-','3-','4-','5-','6-','7-',
     '1','2','3','4','5','6','7',
     '1+','2+','3+','4+','5+','6+','7+',
     '1++','2++','3++','4++','5++','6++','7++'];
key=['z','x','c','v','b','n','m',
     'a','s','d','f','g','h','j',
     'q','w','e','r','t','y','u',];

ad_=0;bpm_=60;speed=1
function cg(x){
    if(x=='0'){return ''}
    else{
        var i=note.indexOf(x)+ad_;
        if(i<8){i=0}
        else if(i>26){i=20}
        else{i-=7}
        return key[i];
    }
}
//简谱转字母
function p_1(x){
    var ran=Math.random()*10-5;
    var i=key.indexOf(x);
    press(xx[i]+ran,yy[i]+ran,1);
    //log('点击',xx[i]+ran,yy[i]+ran)
}
function pre(x){
    for(i in x){
        if(x[i]==0){true}
        else{p_1(x[i])};
    }
}
//字母字符串转琴键
function time(){return new Date().getTime()}
//毫秒时间戳
function num(x){return Math.round(10000*x)/10000}
//小数点后4位
function ad(x){ad_=x}
//移调
function bpm(x){bpm_=x}
//bpm调节
function pause(t){b=60/bpm_;return (b*t)/speed}
//bpm转sec

function play_1(a){
    var k=a.indexOf(')');//查找按键
    var play_str=a.slice(1,k);
    var play=[];//key输出
    while(play_str.length>0){
        var le=play_str.length;
        if(play_str.slice(1,3)=='++'||play_str.slice(1,3)=='--'){//查找15度
            play.push(play_str.slice(0,3));
            play_str=play_str.slice(3,le)}
        else if(play_str.slice(1,2)=='+'||play_str.slice(1,2)=='-'){//查找8度
            play.push(play_str.slice(0,2));
            play_str=play_str.slice(2,le)}
        else{//查找
            play.push(play_str[0]);
            play_str=play_str.slice(1,le)}
    }
    a=a.slice(k+1,a.length);//  (num)time1(num)time2  ==>  time1(num)time2
    k=a.indexOf('(');//查找时间
    var time_str=a.slice(0,k);
    var kx=time_str.indexOf('/');var t;
    if(kx==-1){t=parseFloat(time_str)}
    else{
        var t11=parseFloat(time_str.slice(0,kx));
        var t22=parseFloat(time_str.slice(kx+1,time_str.length));
        t=t11/t22;
    }
    var key1='';
    if(play[0]=='0'){keys_1.push('0')}
    else{
        for(var i in play){
            key1=key1+cg(play[i].toString());
        }
        keys_1.push(key1);
    }
    if(times_1.length==0){
        times_1.push(num(pause(t)));
    }
    else{
        var tc=times_1[times_1.length-1]+pause(t);
        times_1.push(num(tc));
    }
}
//一行取出一个括号的内容转keys_1,times_1
function auto_trans(sa){
    times_1=[];keys_1=[];
    sa=sa+'(';
    while(sa.length>1){
        play_1(sa);
        sa=sa.slice(1,sa.length);
        sa=sa.slice(sa.indexOf('('),sa.length);
    }
}
//一行转keys_1,times_1

function mix(m1,m2,n1,n2){
    
    mk1=m1;mt1=m2;mk2=n1;mt2=n2;
    mt1.unshift(0);mt2.unshift(0);
    var x=Math.max(mt1[mt1.length-1],mt2[mt2.length-1]);
    mt1.pop();mt2.pop();
    for(var i in mt2){
        var mi=mt2[i];
        if(mt1.indexOf(mi)+1){
            mk1[mt1.indexOf(mi)]+=mk2[mt2.indexOf(mi)];
        }
        else{
            if(mi>mt1[mt1.length-1]){
                mt1.push(mi);
                mk1.push(mk2[mt2.indexOf(mi)]);
            }
            else{
                for(var t in mt1){
                    if(mt1[t]>mi){break}
                }
                var lop=mt1.indexOf(mt1[t]);
                mt1.splice(lop,0,mi);
                mk1.splice(lop,0,mk2[mt2.indexOf(mi)]);
            }
        }
    }
    mt1=mt1.slice(1,mt1.length);mt1.push(x);
    //for(var ii in mk1){
    //    var kks=mk1[ii];var ks='';
    //    for(var tt in kks){
    //        if(kks[tt]!='0'){ks+=kks[tt]}
    //    }
    //    if(ks==''){ks='0'}
    //    mk1[ii]=ks   
    //}

    k1=mk1,t1=mt1
}
//k1,t1

function readline(text,line){return text.split('\n')[line]}
function txt_kt(path){
    l_key=[];l_time=[];var key_s=[];var time_s=[];
    var fo=files.open(path,mode = "r", encoding = "utf-8").read()
    for(var i=0;readline(fo,i)!=undefined;i++){
        var l=readline(fo,i)
        if(l.slice(0,2)=='ad'){//移调
            var a_d=parseFloat(l.slice(3,l.length-1))
            ad(a_d)}
        else if(l.slice(0,3)=='bpm'){//bpm
            var b_pm=parseFloat(l.slice(4,l.length-1))
            bpm(b_pm)}
        else{
            if(l[0]=='('){
                auto_trans(l)
                mix(key_s,time_s,keys_1,times_1)
                key_s=k1;time_s=t1;
            }
            if(l[0]=='#'){
                if(l_key.length<1){
                    l_key=key_s;l_time=time_s;
                    key_s=[];time_s=[]
                }
                else{
                    var t_max=l_time[l_time.length-1]
                    for(var fs in key_s){
                        l_key.push(key_s[fs])
                        l_time.push(num(t_max+time_s[fs]))
                    }
                    key_s=[];time_s=[];
                }
            }
        }
        
    }
    l_time.unshift(0.001);l_time.pop();
}
//txt ==> l_key,l_time)


pos=0;pau=0;var l_key;speed=1;tn=0;var tick0
function l_play(l_key,l_time,pos){
    var i=0;
    while(l_time[i]<pos){i++}//根据POS找到演奏位置
    tick0=time()-1000*pos;dt=0
    for(i;i<l_time.length;i++){
        while(dt<1000*l_time[i]){
            dt=time()-tick0;//等待时间
            while(pau==1){tick0=time()-dt}//暂停功能
        }
        if(l_key[i]=='0'){true}
        else{pre(l_key[i])}//弹奏
    };sta=0;window.ok.setText('开始');window.ok.attr('textColor',"black");pau=0
}
//使用2个数组(l_key,l_time)进行演奏





function 映射(x){
    var k=8/15;var m=5/2;var c=k-0.2
    return k*Math.pow(m,x/50)-c
}
function 开始演奏(pos){

var thread = threads.start(function(){
    l_play(l_key,l_time,pos)
});

}
function load(){
    items=[];var dir = "./乐谱/";
    var jsFiles = files.listDir(dir, function(name){
        return filename=name.endsWith(".txt") && files.isFile(files.join(dir, name))});
    for(var i in jsFiles){
        items.push({'name':jsFiles[i].slice(0,jsFiles[i].length-4)})
    };
}
function op(){
ui.run(()=>{items.concat({1:'1'});
    window.lit.setDataSource(items);
});
}
function 读取(d_q){
    if(d_q==1){load();op();window.lit.attr('h','240dp');ops=1}
    if(d_q==0){items=[];op;window.lit.attr('h','0dp');ops=0}
}
function 倍速(b_s){
    if(b_s==1){window.bbs.attr('h','70dp');window.bs.attr('h','40dp');bss=1}
    if(b_s==0){window.bbs.attr('h','0dp');window.bs.attr('h','0dp');bss=0}
    
} 


var dt;var le;var 时长
function 启动进度条(){
    setInterval(()=>{
        if(时长!=undefined&dt!=undefined){window.sek.setProgress(dt/(10*时长))}
        if(le!=undefined){window.tims.setText(时间转换(dt/1000)+'/'+le)}
    }, 200);
}

function 时间转换(sec){
    sec=Math.round(sec)
    var second=sec%60
    var minute=(sec-second)/60
    if(second<10){second='0'+String(second)}
    else{second=String(second)}
    return String(minute)+':'+second
}

