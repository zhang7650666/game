<template>
    <!-- 图片版，优点是表情可以用图片代替，缺点是不能用input框，只好用contenteditable做代替，样式，效果都要重新考虑 -->
    <div class="send-wp">
        <div class="ipt-wp">
            <div class="edit-ipt">
                <img :src="editIcon" alt="" class="edit-icon" />
                <div
                    class="editor"
                    contenteditable="true"
                    ref="editor"
                    placeholder="回复楼主..."
                ></div>
            </div>
            <van-icon
                name="smile-o"
                size="22"
                @click="isShowEmoji = !isShowEmoji"
            />
            <span class="send" @click="sendComment">发送</span>
        </div>
        <emoji @emojiSelected="emojiSected" v-if="isShowEmoji"></emoji>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isFocus: false,
            editIcon: require("@images/edit-icon.png"),
            isShowEmoji: false
        };
    },

    methods: {
        // 光标到最后面
        keepLastIndex(obj) {
            if (window.getSelection) {
                //ie11 10 9 ff safari
                obj.focus(); //解决ff不获取焦点无法定位问题
                var range = window.getSelection(); //创建range
                range.selectAllChildren(obj); //range 选择obj下所有子内容
                range.collapseToEnd(); //光标移至最后
            } else if (document.selection) {
                //ie10 9 8 7 6 5
                var range = document.selection.createRange(); //创建选择对象
                //var range = document.body.createTextRange();
                range.moveToElementText(obj); //range定位到obj
                range.collapse(false); //光标移至最后
                range.select();
            }
        },
        // getSelection、createRange兼容
        isSupportRange() {
            return (
                typeof document.createRange === "function" ||
                typeof window.getSelection === "function"
            );
        },
        // 获取光标位置
        getCurrentRange() {
            let range = null;
            let selection = null;
            if (this.isSupportRange()) {
                selection = document.getSelection();
                if (selection.getRangeAt && selection.rangeCount) {
                    range = document.getSelection().getRangeAt(0);
                }
            } else {
                range = document.selection.createRange();
            }
            return range;
        },
        // 插入内容
        insertHtmlAfterRange(html) {
            let selection = null;
            let range = null;
            if (this.isSupportRange()) {
                // IE > 9 and 其它浏览器
                selection = document.getSelection();
                if (selection.getRangeAt && selection.rangeCount) {
                    let fragment, node, lastNode;
                    range = selection.getRangeAt(0);
                    range.deleteContents();
                    let el = document.createElement("span");
                    el.innerHTML = html;
                    // 创建空文档对象,IE > 8支持documentFragment
                    fragment = document.createDocumentFragment();

                    while ((node = el.firstChild)) {
                        lastNode = fragment.appendChild(node);
                    }
                    range.insertNode(fragment);

                    if (lastNode) {
                        range = range.cloneRange();
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            } else if (
                document.selection &&
                document.selection.type != "Control"
            ) {
                // IE < 9
                document.selection.createRange().pasteHTML(html);
            }
        },
        emojiSected(emoji, base64) {
            this.$refs.editor.focus();
            let html =
                "<img style='width: 20px;display: inline-block;vertical-align: sub;' src='" +
                base64 +
                "' alt>";
            // this.$refs.editor.innerHTML += html;  // 添加表情的时候会整体闪一下，是因为每次都会重新渲染，所以有很大缺陷。
            // this.$refs.editor.append(html);// 添加表情的时候，html代码不会被识别。
            // this.$refs.editor.insertAdjacentHTML("beforeend", html); // 表情只会插入到最后面，放弃。
            this.insertHtmlAfterRange(html);
        },
        sendComment() {
            const str = this.$refs.editor.innerHTML;
            this.isShowEmoji = false;
            this.$refs.editor.innerHTML = "";
            this.$emit("update:send", str);
        }
    }
};
</script>
<style lang="scss" scoped>
.send-wp {
    width: 100%;
    // placeholder 样式
    [contenteditable="true"]:empty::before {
        content: attr(placeholder);
        color: #ccc;
        caret-color: #ccc;
    }
    .ipt-wp {
        display: flex;
        align-items: center;
        width: 100%;
        height: 0.64rem;
        padding: 0.5rem 0.32rem;
        // background: #ccc;
        .edit-ipt {
            display: flex;
            align-items: center;
            width: 5.26rem;
            height: 0.64rem;
            background: #46423e;
            border-radius: 0.36rem;
            margin-right: 0.1rem;
            .edit-icon {
                display: inline-block;
                margin-left: 0.12rem;
                width: 0.44rem;
                height: 0.44rem;
                background-size: 0.44rem 0.44rem;
            }
            .editor {
                width: 4.86rem;
                // height: 0.64rem;
                background: #46423e;
                border-radius: 0.36rem;
                outline: none;
                padding-left: 0.1rem;
                line-height: 0.64rem;
                -webkit-user-select: text;
            }
        }
        .send {
            display: inline-block;
            margin-left: 0.1rem;
            padding: 0 0.15rem;
            border: thin solid #46423e;
            text-align: center;
            line-height: 0.62rem;
        }
    }
}
</style>
