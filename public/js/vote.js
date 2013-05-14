/**
 * 投票操作，
 * @param cId 候选人ID
 */
function vote(cId) {
    $.getJSON("/candidate/" + cId + "/vote", {}, function (res) {
        if (res) {
            alert(res.msg);
        }
    });
}