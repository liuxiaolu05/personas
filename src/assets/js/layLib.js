/**
 * Created by liuxiaolu on 2017/11/3.
 */
import "babel-polyfill";
import $ from "jquery";
Object.assign(self, {$, jQuery: $});
require("@@/lib/layer/layer");
import "@@/lib/layer/theme/default/layer.css"
