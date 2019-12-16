import axios from "axios";


 const Ajax = {

    get:function(url,params){
        return axios.request({
            url,
            method:'get',
            params,
        })
    },

    post:function(url,params){
        return axios.request({
            url,
            params:params,
            method:'post',
        })
    },

    postForm:function(url,params){
        return axios.request({
            url: url,
            data: params,
            method: 'post',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
          })
    }

}

export default Ajax
