/**
 * Created by lenovo on 2017/6/12.
 */

let context;
const Msg = {

     qt:null,

     init:function(){
        
        if (typeof qt != 'undefined'){
            new QWebChannel(qt.webChannelTransport, function(channel)
            {
                context = channel.objects.context
            }
            );
        }
        else
        {
            // alert('qt获取失败')
        }
     },
     sendMessage:function(msg,str){
         console.log(msg,str)
        if(typeof context == 'undefined')
        {
            // alert("context对象获取失败！");
        }
        else
        {
            
            context.onMsg(msg,str);
        }
    },
    openFile:function(url,name=''){
        this.sendMessage(url,name)
     },
    token:function(){
        context.token(1);

        // this.sendMessage(1);
    }


   
  };

  export default Msg;
//   module.exports = Msg;
  