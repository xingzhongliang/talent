/**
 * Created with IntelliJ IDEA.
 * User: Jale
 * Date: 13-5-8
 * Time: 上午3:03
 * To change this template use File | Settings | File Templates.
 */
exports.wrap = function (s, bean) {
    for(var p in bean) {
        s[p] = bean[p];
    }
};