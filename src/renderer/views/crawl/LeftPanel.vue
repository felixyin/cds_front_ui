<template>
    <div class="left-bg">
        <div class="board left-top-bg">
            <el-tree
                    :data="SEList"
                    show-checkbox
                    node-key="id"
                    ref="searchEngineTree"
                    :default-checked-keys="[1]"
                    :expand-on-click-node="dotClick"
                    default-expand-all>
            </el-tree>
        </div>
        <div class="board left-bottom-bg" :style="{height:(fullHeight-130-230-15)+'px!important'}">
            <el-tree
                    :data="countryList"
                    show-checkbox
                    node-key="id"
                    ref="countryTree"
                    :default-checked-keys="[1]"
                    :expand-on-click-node="dotClick"
                    default-expand-all>
            </el-tree>
        </div>
    </div>
</template>
<script>
    import {COUNTRY_LIST, SEARCH_ENGINE_LIST} from '../../crawl/aside.data'

    export default {
        name: 'LeftPanel',
        data() {
            return {
                SEList: SEARCH_ENGINE_LIST,
                countryList: COUNTRY_LIST,
                dotClick: false,
            }
        },
        props: {
            fullHeight: {}
        },
        methods: {
            getCountryTreeSelected() {
                return this.$refs.countryTree.getCheckedNodes();
            },
            getSearchEngineTreeSelected() {
                return this.$refs.searchEngineTree.getCheckedNodes();
            }
        }
    }
</script>
<style scoped>

    .left-top-bg {
        height: 230px;
        margin-bottom: 5px;
    }

    .left-bottom-bg {
        flex: 1;
        overflow: auto;
    }

    .left-bg {
        width: 240px;
        height: 100%;
        display: -webkit-flex;
        display: flex;
        flex-flow: column;
    }

</style>
<style>
    ul {
        padding-left: 5px;
    }

</style>
