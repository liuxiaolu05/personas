/**加载高德地图，返回地图对象
 * 依赖axios
 * Created by liuxiaolu on 2018/2/9.
 */
export default function (callback) {
    if(window.AMap){
        callback();
    }
    else{
        let script = document.createElement("script");
        script.src = '/personas/static/lib/map.js';
        document.body.appendChild(script);
        setTimeout(function(){
            callback();
        },1000);

        /*axios.get("/personas/static/lib/map.js").then(function(res){
            let script = document.createElement("script");
            script.innerHTML = res;
            document.body.appendChild(script);
            callback();
        });*/
    }
}