<template>
    <el-card>
        <div style="diplay:flex;align-item: center;">
            <svg-icon icon="icon-rollback" @click="router.back()" size="20px"></svg-icon>
            <span style="margin-left: 16px;">查看名单</span>
        </div>
        <div>
            {{ route.query.theme }}
        </div>
        <div>
            <el-table v-loading="registrationListLoading" :data="state.registrationList" border style="width: 100%">
                <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="" header-align="center" align="center"></el-table-column> -->
                <!-- <el-table-column prop="eventId" label="活动id" header-align="center" align="center"></el-table-column> -->
                <el-table-column label="姓名" header-align="center" align="center">
                    <template #default="{ row }">
                        {{ state.userInfoList.find(item => item.id === row.userId)?.name }}
                    </template>
                </el-table-column>
                <el-table-column label="用户角色状态" header-align="center" align="center">

                    <template #default="{ row }">
                        {{ state.userInfoList.find(item => item.id === row.userId)?.status }}
                    </template>
                </el-table-column>
                <el-table-column label="行业" header-align="center" align="center">

                    <template #default="{ row }">
                        {{ state.userInfoList.find(item => item.id === row.userId)?.industry }}
                    </template>
                </el-table-column>
                <el-table-column prop="present" label="是否出席" header-align="center" align="center">

                    <template #default="{ row }">
                        <el-checkbox v-model="row.present" :disabled="row.represent || row.absent"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="represent" label="是否代替出席" header-align="center" align="center">

                    <template #default="{ row }">
                        <el-checkbox v-model="row.represent" :disabled="row.present || row.absent"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="absent" label="是否缺席" header-align="center" align="center">

                    <template #default="{ row }">
                        <el-checkbox v-model="row.absent" :disabled="row.represent || row.present"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="lateArrival" label="是否迟到" header-align="center" align="center">

                    <template #default="{ row }">
                        <el-checkbox v-model="row.lateArrival"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="earlyDeparture" label="是否早退" header-align="center" align="center">

                    <template #default="{ row }">
                        <el-checkbox v-model="row.earlyDeparture"></el-checkbox>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="status" label="是否确认录入" header-align="center" align="center"></el-table-column> -->
                <!-- <el-table-column prop="createTime" label="" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="" header-align="center" align="center"></el-table-column> -->
                <!-- <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'module:pz_event_registration:update'" type="primary" link @click="(scope.row.id)">修改</el-button>
					<el-button v-auth="'module:pz_event_registration:delete'" type="primary" link @click="(scope.row.id)">删除</el-button>
				</template>
			</el-table-column> -->
            </el-table>
        </div>
        <div>
            <el-button type="primary" @click="confirmHandle()">录入</el-button>
            <el-button type="primary" @click="dialogVisible = true">新增会员/嘉宾</el-button>
        </div>

        <div>
            <el-dialog v-model="dialogVisible" title="新增会员/嘉宾" :close-on-click-modal="false">
                <el-form>
                    <el-form-item label="姓名">
                        <el-select v-model="state.newUserId" clearable filterable placeholder="姓名"
                            style="width: 150px;">
                            <el-option v-for="item in state.userInfoList" :key="item.id" :label="item.name"
                                :value="item.id" />
                        </el-select>
                    </el-form-item>
                </el-form>

                <template #footer>
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addRegistrationHandle()">确定</el-button>
                </template>
            </el-dialog>
        </div>
    </el-card>
</template>

<script setup lang="ts" name="ModulePz_eventRegistration">
import svgIcon from '@/components/svg-icon'
import { useRoute, useRouter } from 'vue-router'
import { usePz_event_registrationEventApi, usePz_event_registrationConfirmApi } from '@/api/module/pz_event_registration'
import { reactive, ref } from 'vue';
import { onMounted } from 'vue';
import { usePz_user_infoAllApi } from '@/api/module/pz_user_info';
import { use } from 'echarts';
import { ElMessage } from 'element-plus';

const router = useRouter()
const route = useRoute()

const state = reactive({
    registrationList: [],
    userInfoList: [],
    newUserId: '',
})

const registrationListLoading = ref(false)
// 获得报名名单
const getRegistrationList = (eventId: number) => {
    registrationListLoading.value = true
    usePz_event_registrationEventApi(eventId).then(res => {
        state.registrationList = res.data.map(item => {
            return {
                ...item,
                present: item.present === 1,
                represent: item.represent === 1,
                absent: item.absent === 1,
                lateArrival: item.lateArrival === 1,
                earlyDeparture: item.earlyDeparture === 1,
            }
        })
        registrationListLoading.value = false
    })
}
// 获取用户信息列表
const getUserInfoList = () => {
    usePz_user_infoAllApi().then(res => {
        state.userInfoList = res.data
    })
}

// 新增会员/嘉宾
const dialogVisible = ref(false)
const addRegistrationHandle = () => {
    state.registrationList.push({
        id: '',
        eventId: route.query.id,
        userId: state.newUserId,
        present: false,
        represent: false,
        absent: false,
        lateArrival: false,
        earlyDeparture: false,
        status: 0
    })
    dialogVisible.value = false
}


// 确认录入
const confirmHandle = () => {
    let data = state.registrationList.map(item => {
        return {
            ...item,
            present: item.present ? 1 : 0,
            represent: item.represent ? 1 : 0,
            absent: item.absent ? 1 : 0,
            lateArrival: item.lateArrival ? 1 : 0,
            earlyDeparture: item.earlyDeparture ? 1 : 0,
            status: 1
        }
    })
    usePz_event_registrationConfirmApi(data).then(res => {
        if (res.code === 0) {
            ElMessage.success('录入成功')
            getRegistrationList(route.query.id)
        }
        else {
            ElMessage.error('录入失败')
        }
    })
}

onMounted(() => {
    getRegistrationList(route.query.id)
    getUserInfoList()
})


</script>