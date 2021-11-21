
eval(files.read("def.js"))//导入def模块




//txt_kt(path)                   从txt文件  ==>  l_key,l_time
//l_play(l_key,l_time,pos)        l_key,l_time,pos  ==>  演奏(pau==0,暂停)
//var path = './乐谱/test.txt';

//主窗口
var window = floaty.window(
    <vertical>
        <vertical bg="#70000000" w='272dp' h="120dp" id="vi">
            <horizontal>
                <button id="sdt" w="56dp" h="40dp" text="读取"/>
                <button id="ok" w="80dp" h="40dp" text="开始"/>
                <button id="db" w="56dp" h="40dp" text="倍速"/>
                <button id="exit" w="80dp" h="40dp" text="退出"/>
            </horizontal>
            <horizontal id='文本' gravity="center" h='30dp'>
                <text id="time" w='182dp' h="30dp" gravity="center" textColor="white" textStyle="bold" maxLines="1" text='点击这里移动'/>
                <text id="tims" w='0dp' h="30dp" gravity="center" textColor="white" textStyle="bold" text=''/>
            </horizontal>
            <seekbar id="sek" w="272" h="40dp"></seekbar>
        </vertical>
        <vertical>
            <list id="lit" h="0dp">
                <vertical>
                    <button id="name" w="272dp" h="40dp" text="{{name}}" textColor="#000000"/>
                </vertical>
            </list>
            <seekbar id="bs" w="272" h="0dp" progress="50"></seekbar>
        </vertical>
    </vertical>
);window.exitOnClose();//悬浮窗关闭后停止脚本



//移动主窗口
window.文本.setOnTouchListener(function(view, event){
    switch (event.getAction()){
        case event.ACTION_DOWN:
            x = event.getRawX();
            y = event.getRawY();
            windowX = window.getX();
            windowY = window.getY();
            downTime = new Date().getTime();
            return true;
        case event.ACTION_MOVE:
            //移动手指时调整悬浮窗位置
            window.setPosition(windowX + (event.getRawX() - x),
                windowY + (event.getRawY() - y));
            return true;
    }
    return true;
});



启动进度条()
//开关读取列表
ops=0;bss=0;sta=0;
window.sdt.click(()=>{if(ops==0){读取(1);倍速(0)}else{读取(0)}})
window.db.click(()=>{if(bss==0){倍速(1);读取(0)}else{倍速(0)}})//倍速
window.exit.click(()=>{engines.stopAll()})//退出
window.lit.on("item_bind", function(itemView, itemHolder) {
    itemView.name.on("click", function() {
        threads.shutDownAll()//停止已有线程(演奏)
        sta=0;window.ok.setText('开始');window.ok.attr('textColor',"black");pau=0//开始按钮初始化
        dt=0//进度条初始化
        let item = itemHolder.item;
        dress='./乐谱/'+item.name+'.txt'
        var t0=time()
        txt_kt(dress)
        log('用时',(time()-t0),'ms')
        时长=l_time[l_time.length-1];log(时长);读取(0)
        window.time.setText(item.name)//曲名文本设置
        window.tims.attr('w','90dp');le=时间转换(时长)//时间文本设置
    });
    
})//点击列表
//开始暂停继续

window.ok.click(()=>{
    if(sta==0){if(l_key!=undefined){开始演奏(0);sta=1;window.ok.setText('暂停')}}
    else if(sta==1){pau=1;sta=2;window.ok.setText('继续');window.ok.attr('textColor',"blue")}
    else{pau=0;sta=1;window.ok.setText('暂停');window.ok.attr('textColor',"black")}
    
})

//倍速进度条
importClass(android.widget.SeekBar);
window.bs.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener({
    onProgressChanged : function(bar,i,isFromUser){
        if(isFromUser){
            speed=映射(window.bs.getProgress())
            window.db.setText(String(speed))
        }    
    }
}));

//调节
window.sek.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener({
    onProgressChanged : function(bar,i,isFromUser){
        if(isFromUser){
            threads.shutDownAll()//停止已有线程(演奏)
        
            r=window.sek.getProgress()
            pos=(时长*r)/100
            pau=1;sta=2;window.ok.setText('继续');window.ok.attr('textColor',"blue")
            开始演奏(pos)
        }else{}
    }
}));



setInterval(()=>{ },1000)
