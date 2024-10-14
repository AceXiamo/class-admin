<template>
	<el-card>
		<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-button @click="getDataList()">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'module:pz_event_registration:save'" type="primary"
					@click="addOrUpdateHandle()">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-auth="'module:pz_event_registration:delete'" type="danger"
					@click="deleteBatchHandle()">删除</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="state.dataListLoading" :data="state.dataList" border style="width: 100%"
			@selection-change="selectionChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="id" label="" header-align="center" align="center"></el-table-column>
			<el-table-column prop="eventId" label="活动" header-align="center" align="center">
				<template #default="{ row }">
					<span>{{ eventOptions.find((item: any) => item.value === row.eventId)?.label }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="userId" label="用户" header-align="center" align="center">
				<template #default="{ row }">
					<span>{{ userOptions.find((item: any) => item.value === row.userId)?.label }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="present" label="是否出席" header-align="center" align="center">
				<template #default="{ row }">
					<span>{{ row.present === 1 ? '是' : '否' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="represent" label="是否代替出席" header-align="center" align="center">
				<template #default="{ row }">
					<span>{{ row.represent === 1 ? '是' : '否' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="absent" label="是否缺席" header-align="center" align="center">
				<template #default="{ row }">
					<span>{{ row.absent === 1 ? '是' : '否' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="lateArrival" label="是否迟到" header-align="center" align="center">
				<template #default="{ row }">
					<span>{{ row.lateArrival === 1 ? '是' : '否' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="earlyDeparture" label="是否早退" header-align="center" align="center">
				<template #default="{ row }">
					<span>{{ row.earlyDeparture === 1 ? '是' : '否' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="是否确认录入" header-align="center" align="center">
				<template #default="{ row }">
					<span>{{ row.status === 1 ? '是' : '否' }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="updateTime" label="修改时间" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
				<template #default="scope">
					<el-button v-auth="'module:pz_event_registration:update'" type="primary" link
						@click="addOrUpdateHandle(scope.row.id)">修改</el-button>
					<el-button v-auth="'module:pz_event_registration:delete'" type="primary" link
						@click="deleteBatchHandle(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="state.page" :page-sizes="state.pageSizes" :page-size="state.limit"
			:total="state.total" layout="total, sizes, prev, pager, next, jumper" @size-change="sizeChangeHandle"
			@current-change="currentChangeHandle">
		</el-pagination>

		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdateRef" @refreshDataList="getDataList(true)"></add-or-update>
	</el-card>
</template>

<script setup lang="ts" name="ModulePz_event_registrationIndex">
import { useCrud } from '@/hooks'
import { reactive, ref } from 'vue'
import { IHooksOptions } from '@/hooks/interface'
import AddOrUpdate from './add-or-update.vue'
import { eventList, userInfoList } from '@/api/module/pz_event_registration'

const state: IHooksOptions = reactive({
	dataListUrl: '/module/pz_event_registration/page',
	deleteUrl: '/module/pz_event_registration',
	queryForm: {
	}
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: number) => {
	addOrUpdateRef.value.init(id)
}

const { getDataList, selectionChangeHandle, sizeChangeHandle, currentChangeHandle, deleteBatchHandle } = useCrud(state)


const eventOptions = ref<any>([])
const loadEventOptions = () => {
	eventList({
		page: 1,
		limit: 1000,
		theme: ''
	}).then(res => {
		console.log(res)
		eventOptions.value = res.data.list.map((item: any) => {
			return {
				value: item.id,
				label: item.theme
			}
		})
	})
}
loadEventOptions()

const userOptions = ref<any>([])
const loadUserOptions = () => {
	userInfoList({
		page: 1,
		limit: 1000,
		name: ''
	}).then(res => {
		userOptions.value = res.data.list.map((item: any) => {
			return {
				value: item.id,
				label: item.name
			}
		})
	})
}
loadUserOptions()
</script>
