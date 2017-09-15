/**
 * Created by kerlw on 2017/9/11.
 */
(function () {
    'use strict'

    var area_cache_array, obj_cache_array, room_cache_array;
    var choose_type;

    $(function () {
        //选择房间所在区域的对话框
        $("#modal_dialog_choose_target").on("show.bs.modal", function() {
            $("div#dialog_body_target_list ul").empty();
            switch (choose_type) {
                case "area":
                    fillChooseDialogWithAreaData();
                    break;
                case "room":
                    fillChooseDialogWithRoomData();
                    break;
                case "obj":
                    fillChooseDialogWithObjData();
                    break;
            }
        });

        $("#btn_save_choosed_area").on("click", function() {

        });
        //---------------------------

        $("#btnAddExit").bind("click", function () {
            var div = $("<tr />");
            div.html(getExitTableRow());
            $("#room_exits_table").append(div);
        });

        $("#btnAddObj").bind("click", function () {
            var div = $("<tr />");
            div.html(getObjTableRow());
            $("#room_objs_table").append(div);
        });

        $("body").on("click", ".tbl_btn_remove", function () {
            $(this).closest("tr").remove();
        });

        $("body").on("click", "li.li-choosable-item", function() {
            console.log($(this).val() + " " + $(this).attr("value"));
        });

        $("body").on("click", ".click-to-choose", function() {
            choose_type = $(this).attr("target-type") || "";
            console.log($(this) + " " + $(this).attr("target-type") + $(this).text());
            switch (choose_type) {
                case "area":
                    $("#choose_dialog_title").text("选择房间所在区域");
                    break;
                case "room":
                    $("#choose_dialog_title").text("选择目标房间");
                    break;
                case "obj":
                    $("#choose_dialog_title").text("选择目标对象");
                    break;
            }

            $("#modal_dialog_choose_target").modal("show");
        });

        $("button#btn_save").on("click", function () {
            var filename = $("#input_filename").val(),
                area = $("#input_area").val();
            var data = {
                filename :  filename,
                overwrite : true,
                data : {
                    filename : filename
                }
            };
        });
    });

    function fillChooseDialogWithAreaData() {
        if (!area_cache_array || area_cache_array.length <= 0) {
            //show waiting progress
            $.ajax({
                type : 'POST',
                url : '/api?action=query',
                dataType : 'json',
                data : { "type" : "area_list" },
                success : function(data) {
                    if (data.code == 200) {
                        area_cache_array = data.areas;
                        bindAreaDataToTreeView(area_cache_array);
                    } else {
                    }
                }
            });
        } else {
            bindAreaDataToTreeView(area_cache_array);
        }
    }

    function fillChooseDialogWithRoomData() {
        if (!room_cache_array || !(room_cache_array instanceof Array) || room_cache_array.length <= 0) {
            $.ajax({
                type : 'POST',
                url : '/api?action=query',
                dataType : 'json',
                data : { "type" : "room_list" },
                success : function(data) {
                    if (data.code == 200) {
                        room_cache_array = data.rooms;
                        bindRoomDataToTreeView(room_cache_array);
                    } else {
                    }
                }
            });
        } else {
            bindRoomDataToTreeView(room_cache_array);
        }
    }

    function fillChooseDialogWithObjData() {

    }

    function bindAreaDataToTreeView(areas, lv) {
        if (!areas || !(areas instanceof Array) || areas.length <= 0)
            return;

        var selection = $("#input_area").val() || "";

        var indent = '';
        var lvl = lv || 0;
        while (lvl-- > 0)
            indent += '&nbsp;&nbsp;';
        areas.forEach(function(area) {
            var active = '"';
            if (selection.length > 0 && selection === area.pathname)
                active = ' active"';
            //关闭对话框有两种实现方式，在li上加data-dismiss或者在后面调用 dialog.modal("hide")
            // $("div#dialog_body_target_list ul").append('<li class="list-group-item' + active + ' data-dismiss="modal" value="' + area.pathname + '">' + indent + area.name + '</li>');
            $("div#dialog_body_target_list ul").append('<li class="li-choosable-item list-group-item' + active + ' value="' + area.pathname + '">' + indent + area.name + '</li>');
            bindAreaDataToTreeView(area.children, (lv || 0) + 1);
        });

        //对于0层的数据，绑定完成后加入点击事件
        if (!lv) {
            $("div#dialog_body_target_list ul li").on("click", function () {
                // $(this).closest("ul").find("li").removeClass("active");
                $(this).siblings("li").removeClass("active");
                $(this).addClass("active");

                $("#input_area_show").val($(this).text());
                $("#input_area").val($(this).attr("value"));

                $("#modal_dialog_choose_target").modal("hide");
            });
        }
    }

    function bindRoomDataToTreeView(rooms) {

    }

    function getExitTableRow() {
        return '<td><select name="" class="form-control"><option> 选择方向</option><option>north</option><option>south</option><option>east</option><option>west</option></select></td>'
            + '<td><input name="target" type="text" class="form-control input-small click-to-choose" target-type="room" value="" placeholder="点我选择目标房间" readonly="true"/></td>'
            // + '<td class="vcenter"><span class="sp-click-to-choose" data-type="room">点我选择目标房间</span></td>'
            + '<td><button type="button" class="btn btn-danger tbl_btn_remove"><i class="glyphicon glyphicon-remove-sign"></i></button></td>';
    }

    function getObjTableRow() {
        return '<td><input name="obj_path" type="text" class="form-control click-to-choose" target-type="obj" value="" placeholder="点我选择对象" readonly="true"/></td>'
            + '<td><input name="obj_num" class="form-control input-small" type="text" value="1" /></td>'
            + '<td><button type="button" class="btn btn-danger tbl_btn_remove"><i class="glyphicon glyphicon-remove-sign"></i></button></td>';
    }

})();
