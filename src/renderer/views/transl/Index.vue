<template>

    <div class="router-bg">
        <div id="masking"></div>
        <div class="translate" :style="{height:(fullHeight-130-10)+'px!important'}">
            <!--<div class="board" v-show="isShow" id="iframe-container">-->
            <div class="board" style="padding:0!important;">
                <iframe id="test_iframe" name="test_iframe" frameborder="0" src="http://fanyi.baidu.com/"
                        onload="myLoad();"></iframe>
            </div>
        </div>
    </div>
</template>

<script>
    const {shell} = require('electron');

    function xxxxxxxxxxxxxx(event) {
        let isOpened = shell.openExternal('http://www.yinbin.ink');
        while (!isOpened) {
            isOpened = shell.openExternal('http://www.yinbin.ink');
        }
    }

    window.myLoad = function () {
        var iframe = document.getElementById('test_iframe');
        var itl = setInterval(function () {
            if (iframe.contentWindow) {
                iframe.contentWindow.__mmmmmclick = function () {
                    xxxxxxxxxxxxxx();
                };
                var doc = iframe.contentWindow.document;
                var header = doc.getElementsByClassName('header');
                if (header && header.length > 0) {

                    //去掉百度title
                    var style = doc.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = '.zonedword-title>span,#upload-btn,.history-tip-row,.op-favor-container,.op-correct,#zonedword-wrap{display:none!important;}' +
                        ' *::-webkit-scrollbar {width: 6px; height: 6px; background-color: #F5F5F5; } *::-webkit-scrollbar-track {-webkit-box-shadow: inset 0 0 6px rgba(251, 164, 41, 0.3); border-radius: 10px; background-color: #F5F5F5; } *::-webkit-scrollbar-thumb {border-radius: 6px; -webkit-box-shadow: inset 0 0 6px rgba(251, 145, 7, 0.3); background-color: #ffc65c; }' +
                        'header,manual-trans-btn,footer,divide-wrap,translate-setting{display:none}';
                    doc.head.append(style);

                    header[0].style.display = 'none';

                    //
                    var btn = doc.getElementsByClassName('manual-trans-btn');
                    btn[0].style.display = 'none';

                    //
                    var footer = doc.getElementsByClassName('footer');
                    footer[0].innerHTML = '';

                    //
                    var divideWrap = doc.getElementsByClassName('divide-wrap');
                    divideWrap[0].innerHTML = '<br/><br/><br/>';

                    //
                    var setting = doc.getElementsByClassName('translate-setting');
                    setting[0].innerHTML = '';

                    //
                    document.getElementById('masking').style.display = 'none';

                    clearInterval(itl);
                    setInterval(function () {
                        var guangGao = doc.getElementById('transOtherRight');
                        if (guangGao) guangGao.style.display = 'none';
                        var js = doc.getElementsByClassName('dictionary-kingsoft-source');
                        if (js && js.length > 0) {
                            var j = js[0];
                            // j.innerHTML = '';
                            j.innerHTML = '翻译来自：<a style="font-size:12px;" onclick="__mmmmmclick();" >青岛前途软件技术有限公司</a>';
                        }
                    }, 100);
                }
            }
        }, 300); // 非常快不会影响性能
    };

    export default {
        name: 'Transl',
        data() {
            return {
                loading: true
            }
        },
        props: ['fullHeight'],
        activated() {
            document.getElementById('masking').style.display = 'block';
        },
    }
</script>

<style scoped>

    .router-bg {
        background-color: #C8DDED !important;
        padding: 5px 5px;
    }

    .board {
        height: 100%;
        overflow: hidden;
        position: relative;
    }

    iframe {
        width: 100%;
        height: 100%;
    }

    #masking {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        position: absolute;
        top: 0;
    }
</style>
