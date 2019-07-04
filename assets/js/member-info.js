$(function() {
  $(".icon-refresh").on("click", function() {
    $.showPreloader();
    window.location.reload();
  });

  $("#update-name").on("click", function() {
    let nickName = $("input#update-nickname")[0].value,
      noteName = $("input#update-notename")[0].value,
      oNickName = $("#nickname")[0].textContent,
      oNoteName = $("#notename")[0].textContent;
    if (!noteName && !nickName) {
      $.alert("请输入昵称或者备注");
    } else if (
      (noteName && noteName == oNoteName) ||
      (nickName && nickName == oNickName)
    ) {
      $.alert("请输入不同的昵称或者备注");
    } else {
      let id = $(".page").attr("member-id");
      $.showPreloader();
      axios
        .post(`/api/members/${id}`, {
          nickName: nickName,
          noteName: noteName
        })
        .then(function(res) {
          $.alert(res.data.data);
          window.location.reload();
        });
    }
  });

  $("#add-contact").on("click", function() {
    let name = $("input#add-contact-name")[0].value,
      addr = $("input#add-contact-addr")[0].value,
      phone = $("input#add-contact-phone")[0].value;
    if (!name || !addr || !phone) {
      $.alert("请输入完整的信息");
    } else {
      $.showPreloader();
      let id = $(".page").attr("member-id");
      axios
        .post(`/api/members/${id}/contact`, {
          name: name,
          addr: addr,
          phone: phone
        })
        .then(function(res) {
          $.alert(res.data.data);
          window.location.reload();
        });
    }
  });

  $("#update-points").on("click", function() {
    let reason = $("input#points-reason")[0].value,
      value = $("input#points-value")[0].value;
    console.log(reason, value);
    if (!reason || !value) {
      $.alert("请输入完整信息");
    } else {
      $.showPreloader();
      let id = $(".page").attr("member-id");
      axios
        .post(`/api/members/${id}/points`, {
          reason: reason,
          value: value
        })
        .then(function(res) {
          $.alert(res.data.data);
          window.location.reload();
        });
    }
  });

  $("#delete-member").on("click", function() {});
});
