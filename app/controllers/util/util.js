/**
 * Created with IntelliJ IDEA.
 * User: Jale laichendong
 * Date: 13-5-8
 * Time: 上午3:01
 * To change this template use File | Settings | File Templates.
 */
/**
 * 按key排序关联数组
 * @param map 关联数组
 * @return {Array}
 */
exports.sortMap = function (map) {
    var newMap = [];
    var keyArr = [];
    for (var key in map) {
        keyArr.push(key);
    }
    keyArr.sort();
    for (var i = 0; i < keyArr.length; i++) {
        newMap[keyArr[i]] = map[keyArr[i]];
    }
    return newMap;
};