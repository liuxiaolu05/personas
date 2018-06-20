/**
 * Created by liuxiaolu on 2018/3/8.
 */
export default {
    data(){
        return { node: null }
    },
    mounted(){
        this.$emit("enter", this.node);
    }
}