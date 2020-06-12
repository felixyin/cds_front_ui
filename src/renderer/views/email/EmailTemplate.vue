<template>
    <div style="height: 100%">
        <div class="result-title">发件模板</div>
        <i @click="showTemplateDialogHandler" class="el-icon-circle-plus-outline right-edit-btn"></i>
        <div class="template-list-bg margin-t-15">
            <div v-for="(item,index) in templateEmails" :key="index" class="template-cell flex-jsb-aic">
                <el-radio :label="item.id" v-model="selectTemplateId" @change="templateChangeHandler">&nbsp;</el-radio>
                <div class="template-content">
                    <p class="title">{{item.subject}}</p>
                    <!--                    <p class="content">{{item.mainBody.length<80?(item.mainBody.substring(0,78)+'..'):item.mainBody}}</p>-->
                    <p class="content">{{item.mainBody}}</p>
                </div>
                <i @click="showTemplateDialogHandler(item.id)" class="el-icon-edit-outline"></i>
            </div>
        </div>
        <el-dialog
                title="模板编辑"
                :visible.sync="showTemplate"
                width="70%"
                class="template-dialog"
        >
            <!--            :style="{height:(fullHeight-130)+'px!important'}"-->
            <div>
                <el-form ref="editTemplate" :model="editTemplate" label-width="100px">
                    <el-form-item label="邮件标题">
                        <el-input placeholder="请输入邮件标题" v-model="editTemplate.subject"></el-input>
                    </el-form-item>
                    <el-form-item label="模板内容">
                        <el-input type="textarea" rows="10" v-model="editTemplate.mainBody"></el-input>
                    </el-form-item>
                    <!--                    <el-form-item label="是否启用">-->
                    <!--                        <el-switch v-model="editTemplate.isEnable"></el-switch>-->
                    <!--                    </el-form-item>-->
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showTemplate = false">取 消</el-button>
                <el-button @click="deleteEmailTemplate" v-if="editTemplate.id" type="danger">删除模板</el-button>
                <el-button type="primary" @click="saveEmailTemplate">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
    import {mapModel, updateModel} from '../../util/vuexbound';

    export default {
        name: 'EmailTemplate',
        data() {
            return {}
        },
        props: {
            fullHeight: {}
        },
        computed: {
            ...mapModel('Email', {
                showTemplate: state => state.emailTemplate.showTemplate,
                editTemplate: state => state.emailTemplate.editTemplate,
                selectTemplateId: state => state.emailTemplate.selectTemplateId,
                templateEmails: state => state.emailTemplate.templateEmails,
            }),
        },
        activated() {
            this.findAllEmailTemplatesAction();
        },
        methods: {
            ...mapActions('Email', ['templateChangeAction', 'showTemplateDialogAction', 'saveEmailTemplateAction',
                'deleteEmailTemplateAction', 'findAllEmailTemplatesAction']),
            /**
             * 选择默认模板
             */
            templateChangeHandler() {
                this.templateChangeAction().then(_ => {
                    this.$message({message: '模板选择成功！', type: 'success'});
                });
            },
            /**
             * 查询用户模板
             */
            showTemplateDialogHandler(id) {
                this.showTemplateDialogAction(id);
            },
            /**
             * 保存用户模板
             */
            saveEmailTemplate() {
                this.saveEmailTemplateAction().then(_ =>
                    this.$message({message: '模板保存成功！', type: 'success'})
                );
            },
            /**
             * 删除用户模板
             */
            deleteEmailTemplate() {
                this.deleteEmailTemplateAction().then(_ => {
                    this.$message({message: '模板删除成功！', type: 'success'});
                });
            },
        }
    }
</script>
<style scoped>

    .template-list-bg {
        height: calc(100% - 37px);
        overflow: auto;
    }

    .result-title {
        display: inline-block;
        padding: 0 15px;
        line-height: 25px;
        border-radius: 0 15px 15px 0;
        background: #4890EA;
        color: #ffffff;
        font-size: 13px;
        margin-left: -20px;
        margin-top: -20px;
    }

    .template-content {
        padding: 8px;
        flex: 1;
        border-right: 1px solid #f1f1f1;
        border-left: 1px solid #f1f1f1;
    }

    .template-cell {
        padding: 0 6px;
        border: 1px solid #f1f1f1;
    }

    .right-edit-btn {
        position: absolute;
        right: 15px;
        top: 22px;
        color: #4890EA;
        font-size: 19px;
    }

    .option-delete :hover {
        opacity: 0.6;
    }

    .el-icon-edit-outline {
        color: #4890EA;
        font-size: 19px;
        margin-left: 4px;
        margin-right: 12px;
    }

    .content {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
    }
</style>
<style>
    ul {
        padding-left: 5px;
    }


    /* tab 处理 */

</style>
